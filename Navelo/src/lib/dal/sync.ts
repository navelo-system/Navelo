import { db } from './db';
import { supabase } from '../supabase/client';

export const SYNC_TABLES = [
  'categories',
  'products',
  'branches',
  'customers',
  'sales',
  'sale_items',
  'tabs',
  'delivery_orders',
  'users',
  'cash_registers',
  'cash_movements',
  'suppliers',
  'units',
  'print_points',
  'riders',
  'delivery_rates',
  'restaurant_tables',
] as const;

export interface SyncQueueItem {
  id: string;
  table: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  tenant_id: string;
  payload: Record<string, unknown> & { id?: string };
  created_at: string;
  retries?: number;
}

// ---------------- SANITIZADORES ESPECÍFICOS POR TABELA ----------------

function extractProductFiscalData(p: Record<string, unknown>): Record<string, unknown> {
  const fiscalData = (typeof p.fiscal_data === 'object' && p.fiscal_data !== null)
    ? { ...(p.fiscal_data as Record<string, unknown>) }
    : {};
  if (p.multissabor_limit !== undefined) fiscalData.multissabor_limit = p.multissabor_limit;
  if (p.multissabor_pricing_mode !== undefined) fiscalData.multissabor_pricing_mode = p.multissabor_pricing_mode;
  if (p.plataformas_price_different !== undefined) fiscalData.plataformas_price_different = p.plataformas_price_different;
  return fiscalData;
}

function sanitizeProductsPayload(p: Record<string, unknown>): Record<string, unknown> {
  const image_url = (p.image && !p.image_url) ? p.image : p.image_url;
  const clean: Record<string, unknown> = {
    ...p,
    image_url,
    fiscal_data: extractProductFiscalData(p),
    type: p.type || 'PRODUCT',
    unit: p.unit || 'UN',
    unit_type: p.unit_type || p.unit || 'UNIT',
    price: Number(p.price) || 0,
    stock: Number(p.stock) || 0,
  };

  delete clean.multissabor_limit;
  delete clean.multissabor_pricing_mode;
  delete clean.plataformas_price_different;
  delete clean.updated_at;
  delete clean.updatedAt;

  return clean;
}

function sanitizeUsersPayload(p: Record<string, unknown>): Record<string, unknown> {
  delete p.isCurrent;
  const pwd = (p.password_hash as string) || (p.password as string) || '123456789';
  p.password_hash = pwd;
  p.password = pwd;
  return p;
}

function sanitizeTabsPayload(p: Record<string, unknown>): Record<string, unknown> {
  p.identifier = p.identifier || p.code || p.label || (p.id as string);
  p.status = p.status || 'OPEN';
  if (p.items && Array.isArray(p.items)) p.items = JSON.stringify(p.items);
  if (p.observation !== undefined) delete p.observation;
  return p;
}

function sanitizeSaleItemsPayload(p: Record<string, unknown>): Record<string, unknown> {
  const name = p.product_name || p.name || 'Item';
  const unit_price = Number(p.unit_price ?? p.unitPrice) || 0;
  const total_price = Number(p.total_price ?? p.totalPrice) || 0;
  const quantity = Number(p.quantity ?? p.qty) || 1;
  return { ...p, product_name: name, name, unit_price, total_price, quantity };
}

function sanitizeUnitsPayload(p: Record<string, unknown>): Record<string, unknown> {
  p.symbol = p.symbol || p.abbreviation || 'UN';
  p.name = p.name || 'Unidade';
  p.decimals = Number(p.decimals) || 0;
  return p;
}

function sanitizeRidersPayload(p: Record<string, unknown>): Record<string, unknown> {
  p.active = p.active !== false;
  p.conecta_enabled = Boolean(p.conecta_enabled);
  p.conecta_code = (p.conecta_code as string) || '';
  return p;
}

function sanitizePrintPointsPayload(p: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {
    ...p,
    enabled: p.enabled !== false,
    server_ip: p.server_ip || p.serverIp,
    bobbin_size: p.bobbin_size || p.bobbinSize,
    increase_font: Boolean(p.increase_font ?? p.increaseFont),
    kitchen_monitor_enabled: Boolean(p.kitchen_monitor_enabled ?? p.kitchenMonitorEnabled),
    linking_code: p.linking_code || p.linkingCode,
  };
  delete clean.serverIp;
  delete clean.bobbinSize;
  delete clean.increaseFont;
  delete clean.kitchenMonitorEnabled;
  delete clean.linkingCode;
  return clean;
}

function sanitizeCashRegistersPayload(p: Record<string, unknown>): Record<string, unknown> {
  if (p.initial_balance !== undefined) p.initial_balance = Number(p.initial_balance) || 0;
  if (p.current_balance !== undefined) p.current_balance = Number(p.current_balance) || 0;
  return p;
}

function sanitizeCustomersPayload(p: Record<string, unknown>): Record<string, unknown> {
  if (p.addresses && Array.isArray(p.addresses)) delete p.addresses;
  return p;
}

function sanitizeJsonItemsPayload(p: Record<string, unknown>): Record<string, unknown> {
  if (p.items && Array.isArray(p.items)) p.items = JSON.stringify(p.items);
  return p;
}

const TABLE_SANITIZERS: Record<string, (p: Record<string, unknown>) => Record<string, unknown>> = {
  products: sanitizeProductsPayload,
  users: sanitizeUsersPayload,
  tabs: sanitizeTabsPayload,
  sale_items: sanitizeSaleItemsPayload,
  units: sanitizeUnitsPayload,
  riders: sanitizeRidersPayload,
  print_points: sanitizePrintPointsPayload,
  cash_registers: sanitizeCashRegistersPayload,
  customers: sanitizeCustomersPayload,
  delivery_orders: sanitizeJsonItemsPayload,
  sales: sanitizeJsonItemsPayload,
};

export function sanitizePayloadForSupabase(table: string, rawPayload: Record<string, unknown>): Record<string, unknown> {
  const clone = { ...rawPayload };
  const handler = TABLE_SANITIZERS[table];
  return handler ? handler(clone) : clone;
}

// ---------------- CLOUD PUSH & LOCAL SYNC ----------------

const LEGACY_TENANTS = new Set(['tenant-11111111111111', 'tenant-demo-001', 'demo-tenant']);

function isLegacyTenant(id?: unknown): boolean {
  return !id || typeof id !== 'string' || LEGACY_TENANTS.has(id);
}

function enrichRecordTenant(rec: Record<string, unknown>, activeTenant: string): Record<string, unknown> {
  const defaultFallback = (rec.company_id as string) || activeTenant || 'tenant-36383365000190';
  const targetTenant = activeTenant !== 'tenant-11111111111111' ? activeTenant : defaultFallback;
  const isLegacy = isLegacyTenant(rec.company_id);
  const resolved = isLegacy ? targetTenant : ((rec.company_id as string) || targetTenant);
  return { ...rec, company_id: resolved, tenant_id: resolved };
}

async function syncLocalTableToCloud(table: string, activeTenant: string) {
  try {
    const localRecords = await db.table(table).toArray();
    if (!localRecords || localRecords.length === 0) return;

    const updatedLocals = localRecords.map((rec) => enrichRecordTenant(rec as Record<string, unknown>, activeTenant));
    await Promise.all(
      updatedLocals.map((rec) => {
        const cleanPayload = sanitizePayloadForSupabase(table, rec);
        return supabase.from(table).upsert(cleanPayload);
      })
    );
    await db.table(table).bulkPut(updatedLocals);
  } catch (err) {
    console.warn(`[Sync] Aviso ao subir dados locais da tabela ${table}:`, err);
  }
}

export async function pushLocalDataToCloud(tenantId?: string) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;
  const activeTenant = tenantId || 'tenant-11111111111111';
  await Promise.all(SYNC_TABLES.map((t) => syncLocalTableToCloud(t, activeTenant)));
}

function normalizeIncomingRecord(record: Record<string, unknown>, activeTenant: string): Record<string, unknown> {
  const normalized: Record<string, unknown> = {
    ...record,
    company_id: activeTenant,
    tenant_id: activeTenant,
  };
  if (typeof normalized.items === 'string') {
    try {
      normalized.items = JSON.parse(normalized.items as string);
    } catch {
      // ignore
    }
  }
  return normalized;
}

async function fetchAndMergeTable(table: string, activeTenant: string) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .or(`company_id.eq.${activeTenant},tenant_id.eq.${activeTenant},company_id.eq.tenant-36383365000190,tenant_id.eq.tenant-36383365000190,company_id.eq.tenant-11111111111111,tenant_id.eq.tenant-11111111111111,company_id.is.null`);

  if (error) {
    console.warn(`[Sync] Aviso ao buscar tabela ${table}:`, error.message);
    return;
  }
  if (data && data.length > 0) {
    const normalized = data.map((record) => normalizeIncomingRecord(record as Record<string, unknown>, activeTenant));
    await db.table(table).bulkPut(normalized);
  }
}

async function syncTenantCompanyRecord(activeTenant: string) {
  const { data: company, error: cErr } = await supabase.from('companies').select('*').eq('id', activeTenant).maybeSingle();
  if (!cErr && company) {
    await db.companies.put(company);
    return;
  }
  const localCompany = await db.companies.get(activeTenant);
  if (localCompany) {
    await supabase.from('companies').upsert({
      id: activeTenant,
      name: localCompany.name,
      document: localCompany.document,
      phone: localCompany.phone || '',
      email: localCompany.email || '',
      company_id: activeTenant,
      tenant_id: activeTenant,
    });
  }
}

export async function initialSync(tenantId?: string) {
  try {
    const activeTenant = tenantId || 'tenant-11111111111111';

    await processSyncQueue();
    await pushLocalDataToCloud(activeTenant);

    const { data: platformSettings, error: pErr } = await supabase.from('platform_settings').select('*').maybeSingle();
    if (!pErr && platformSettings) {
      await db.platform_settings.put(platformSettings);
    }

    await syncTenantCompanyRecord(activeTenant);
    await Promise.all(SYNC_TABLES.map((table) => fetchAndMergeTable(table, activeTenant).catch((err) => console.warn(`[Sync] Exceção na tabela ${table}:`, err))));

    console.warn(`[Sync] Sincronização inicial da fonte primária (Supabase) concluída com sucesso para o tenant ${activeTenant}.`);
  } catch (err) {
    console.error('[Sync] Falha na sincronização inicial:', err);
  }
}

export async function mutateLocalFirst<T extends { id: string; company_id?: string; tenant_id?: string }>(
  tableName: 'products' | 'categories' | 'sales' | 'sale_items' | 'customers' | 'users' | 'suppliers' | 'units' | 'print_points' | 'cash_registers' | 'cash_movements' | 'restaurant_tables' | 'tabs' | 'contingency_notes' | 'riders' | 'delivery_rates' | 'delivery_orders' | 'companies' | 'inventory_audits',
  payload: T,
  action: 'INSERT' | 'UPDATE' | 'DELETE' = 'UPDATE',
  tenantId?: string
) {
  const activeTenantId = tenantId || payload.tenant_id || payload.company_id || 'tenant-11111111111111';
  const enrichedPayload = {
    ...payload,
    tenant_id: activeTenantId,
    company_id: activeTenantId,
  };

  if (action === 'DELETE') {
    await db.table(tableName).delete(payload.id);
  } else {
    await db.table(tableName).put(enrichedPayload);
  }

  await db.sync_queue.add({
    id: crypto.randomUUID(),
    table: tableName,
    action,
    tenant_id: activeTenantId,
    payload: enrichedPayload as Record<string, unknown>,
    created_at: new Date().toISOString(),
  });

  processSyncQueue();
}

async function handleQueueItemError(item: SyncQueueItem): Promise<void> {
  const currentRetries = ((item.retries as number) || 0) + 1;
  if (currentRetries >= 5) {
    console.warn(`[Sync] Item ${item.id} (${item.table}) expurgado da fila após 5 falhas.`);
    await db.sync_queue.delete(item.id);
  } else {
    await db.sync_queue.update(item.id, { retries: currentRetries });
  }
}

async function processSingleQueueItem(item: SyncQueueItem): Promise<void> {
  try {
    const isDelete = item.action === 'DELETE';
    const result = isDelete
      ? await supabase.from(item.table).delete().eq('id', (item.payload.id as string) || item.id)
      : await supabase.from(item.table).upsert(sanitizePayloadForSupabase(item.table, item.payload));

    if (result.error) {
      console.warn(`[Sync] Erro Supabase (${item.table}):`, result.error.message);
      await handleQueueItemError(item);
      return;
    }

    await db.sync_queue.delete(item.id);
  } catch (err) {
    console.warn(`[Sync] Falha temporária ao sincronizar item ${item.id}:`, err);
  }
}

export async function processSyncQueue() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  try {
    const queue = await db.sync_queue.orderBy('created_at').toArray();
    if (!queue || queue.length === 0) return;

    await Promise.all(queue.map((item) => processSingleQueueItem(item as SyncQueueItem)));
  } catch (err) {
    console.warn('[Sync] Erro ao ler fila de sincronização:', err);
  }
}

export function subscribeToRealtimeSync(tenantId?: string) {
  const activeTenant = tenantId || 'tenant-11111111111111';
  if (typeof window === 'undefined') return () => {};

  const channel = supabase
    .channel(`navelo-realtime-${activeTenant}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public' },
      async (payload) => {
        const table = payload.table;
        const eventType = payload.eventType;
        const newRecord = payload.new as Record<string, unknown>;
        const oldRecord = payload.old as Record<string, unknown>;

        try {
          if (eventType === 'DELETE' && oldRecord?.id) {
            await db.table(table).delete(oldRecord.id as string);
          } else if ((eventType === 'INSERT' || eventType === 'UPDATE') && newRecord?.id) {
            const normalizedRecord = normalizeIncomingRecord(newRecord, activeTenant);
            await db.table(table).put(normalizedRecord);
          }
        } catch (err) {
          console.warn(`[Realtime] Erro ao aplicar mudança na tabela ${table}:`, err);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', processSyncQueue);
}
