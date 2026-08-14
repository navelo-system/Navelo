/* eslint-disable complexity, max-depth, no-await-in-loop, @typescript-eslint/no-explicit-any */
import { db } from './db';
import { supabase } from '../supabase/client';

/**
 * Sanitiza o payload para remover propriedades transientes incompatíveis antes de enviar ao Supabase
 */
function sanitizePayloadForSupabase(table: string, rawPayload: Record<string, unknown>): Record<string, unknown> {
  const payload = { ...rawPayload };

  if (table === 'products') {
    if (payload.image && !payload.image_url) {
      payload.image_url = payload.image;
    }
    payload.type = payload.type || 'PRODUCT';
    payload.unit = payload.unit || 'UN';
    payload.unit_type = payload.unit_type || payload.unit || 'UNIT';
    if (payload.price !== undefined) payload.price = Number(payload.price) || 0;
    if (payload.stock !== undefined) payload.stock = Number(payload.stock) || 0;
  } else if (table === 'users') {
    delete payload.isCurrent;
    payload.password_hash = (payload.password_hash as string) || (payload.password as string) || '123456789';
    payload.password = (payload.password as string) || (payload.password_hash as string) || '123456789';
  } else if (table === 'tabs') {
    payload.identifier = payload.identifier || payload.code || payload.label || (payload.id as string);
    payload.status = payload.status || 'OPEN';
    if (payload.items && Array.isArray(payload.items)) {
      payload.items = JSON.stringify(payload.items) as any;
    }
  } else if (table === 'sale_items') {
    payload.product_name = payload.product_name || payload.name || 'Item';
    payload.name = payload.name || payload.product_name || 'Item';
    if (payload.unit_price !== undefined || payload.unitPrice !== undefined) {
      payload.unit_price = Number(payload.unit_price ?? payload.unitPrice) || 0;
    }
    if (payload.total_price !== undefined || payload.totalPrice !== undefined) {
      payload.total_price = Number(payload.total_price ?? payload.totalPrice) || 0;
    }
    if (payload.quantity !== undefined || payload.qty !== undefined) {
      payload.quantity = Number(payload.quantity ?? payload.qty) || 1;
    }
  } else if (table === 'units') {
    payload.symbol = payload.symbol || payload.abbreviation || 'UN';
    payload.name = payload.name || 'Unidade';
    payload.decimals = Number(payload.decimals) || 0;
  } else if (table === 'riders') {
    payload.active = payload.active !== false;
    payload.conecta_enabled = Boolean(payload.conecta_enabled);
    payload.conecta_code = (payload.conecta_code as string) || '';
  } else if (table === 'print_points') {
    payload.enabled = payload.enabled !== false;
    if (payload.serverIp && !payload.server_ip) payload.server_ip = payload.serverIp;
    if (payload.bobbinSize && !payload.bobbin_size) payload.bobbin_size = payload.bobbinSize;
    if (payload.increaseFont !== undefined && payload.increase_font === undefined) {
      payload.increase_font = Boolean(payload.increaseFont);
    }
    if (payload.kitchenMonitorEnabled !== undefined && payload.kitchen_monitor_enabled === undefined) {
      payload.kitchen_monitor_enabled = Boolean(payload.kitchenMonitorEnabled);
    }
    if (payload.linkingCode && !payload.linking_code) payload.linking_code = payload.linkingCode;
  } else if (table === 'cash_registers') {
    if (payload.initial_balance !== undefined) payload.initial_balance = Number(payload.initial_balance) || 0;
    if (payload.current_balance !== undefined) payload.current_balance = Number(payload.current_balance) || 0;
  } else if (table === 'customers') {
    if (payload.addresses && Array.isArray(payload.addresses)) {
      delete payload.addresses;
    }
  } else if (table === 'delivery_orders' || table === 'sales') {
    if (payload.items && Array.isArray(payload.items)) {
      payload.items = JSON.stringify(payload.items) as any;
    }
  }

  return payload;
}

/**
 * Envia todos os dados locais do Dexie para o Supabase (Cloud Push / Migration)
 */
export async function pushLocalDataToCloud(tenantId?: string) {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;
  const activeTenant = tenantId || 'tenant-11111111111111';

  const tables = [
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
  ];

  for (const table of tables) {
    try {
      const localRecords = await db.table(table).toArray();
      if (!localRecords || localRecords.length === 0) continue;

      const updatedLocals: any[] = [];
      for (const rec of localRecords) {
        const isLegacy = !rec.company_id || rec.company_id === 'tenant-11111111111111' || rec.company_id === 'tenant-demo-001' || rec.company_id === 'demo-tenant';
        const targetTenant = (activeTenant !== 'tenant-11111111111111' ? activeTenant : (rec.company_id || activeTenant)) || 'tenant-36383365000190';
        const enriched = {
          ...rec,
          company_id: isLegacy ? targetTenant : (rec.company_id || targetTenant),
          tenant_id: isLegacy ? targetTenant : (rec.tenant_id || targetTenant),
        };
        updatedLocals.push(enriched);
        const cleanPayload = sanitizePayloadForSupabase(table, enriched);
        await supabase.from(table).upsert(cleanPayload as any);
      }
      if (updatedLocals.length > 0) {
        await db.table(table).bulkPut(updatedLocals);
      }
    } catch (err) {
      console.warn(`[Sync] Aviso ao subir dados locais da tabela ${table}:`, err);
    }
  }
}

/**
 * Baixa os dados do Supabase para o Tenant especificado e salva no Dexie (IndexedDB)
 */
export async function initialSync(tenantId?: string) {
  try {
    const activeTenant = tenantId || 'tenant-11111111111111';

    // 0. Processar a fila local de pendências primeiro
    await processSyncQueue();

    // 0.1 Subir dados locais existentes no Dexie para o Supabase
    await pushLocalDataToCloud(activeTenant);

    // 1. Puxar Configurações Globais da Plataforma
    const { data: platformSettings, error: pErr } = await supabase.from('platform_settings').select('*').maybeSingle();
    if (!pErr && platformSettings) {
      await db.platform_settings.put(platformSettings);
    }

    // 2. Puxar Empresa / Tenant
    const { data: company, error: cErr } = await supabase.from('companies').select('*').eq('id', activeTenant).maybeSingle();
    if (!cErr && company) {
      await db.companies.put(company);
    } else {
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
        } as any);
      }
    }

    // 3 a 19. Puxar TODAS as 17 tabelas vinculadas ao Tenant (Fonte Primária Supabase -> Merge IndexedDB)
    const tables = [
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
    ];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .or(`company_id.eq.${activeTenant},tenant_id.eq.${activeTenant},company_id.eq.tenant-36383365000190,tenant_id.eq.tenant-36383365000190,company_id.eq.tenant-11111111111111,tenant_id.eq.tenant-11111111111111,company_id.is.null`);

        if (error) {
          console.warn(`[Sync] Aviso ao buscar tabela ${table}:`, error.message);
        } else if (data && data.length > 0) {
          const normalized = data.map((record) => ({
            ...record,
            company_id: activeTenant,
            tenant_id: activeTenant,
          }));
          await db.table(table).bulkPut(normalized);
        }
      } catch (tableErr) {
        console.warn(`[Sync] Exceção ao consultar tabela ${table}:`, tableErr);
      }
    }

    console.warn(`[Sync] Sincronização inicial da fonte primária (Supabase) concluída com sucesso para o tenant ${activeTenant}.`);
  } catch (err) {
    console.error('[Sync] Falha na sincronização inicial:', err);
  }
}

/**
 * Função genérica para realizar uma mutação Local-First vinculada ao Tenant.
 */
export async function mutateLocalFirst<T extends { id: string; company_id?: string; tenant_id?: string }>(
  tableName: 'products' | 'categories' | 'sales' | 'sale_items' | 'customers' | 'users' | 'suppliers' | 'units' | 'print_points' | 'cash_registers' | 'cash_movements' | 'restaurant_tables' | 'tabs' | 'contingency_notes' | 'riders' | 'delivery_rates' | 'delivery_orders' | 'companies',
  payload: T,
  action: 'INSERT' | 'UPDATE' | 'DELETE' = 'UPDATE',
  tenantId?: string
) {
  const activeTenantId = tenantId || payload.tenant_id || payload.company_id || 'tenant-11111111111111';
  const enrichedPayload = {
    ...payload,
    tenant_id: activeTenantId,
    company_id: activeTenantId
  };

  // 1. Atualiza localmente imediatamente (UI rápida)
  if (action === 'DELETE') {
    await db.table(tableName).delete(payload.id);
  } else {
    await db.table(tableName).put(enrichedPayload);
  }

  // 2. Enfileira a mudança para a nuvem com tag de tenant_id
  await db.sync_queue.add({
    id: crypto.randomUUID(),
    table: tableName,
    action,
    tenant_id: activeTenantId,
    payload: enrichedPayload,
    created_at: new Date().toISOString()
  });

  // 3. Tenta processar a fila em background
  processSyncQueue();
}

/**
 * Processa a fila de sincronização enviando ao Supabase com sanitização e retenção segura em caso de erro
 */
export async function processSyncQueue() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  try {
    const queue = await db.sync_queue.orderBy('created_at').toArray();
    if (!queue || queue.length === 0) return;
    
    for (const item of queue) {
      try {
        let hasError = false;
        if (item.action === 'DELETE') {
          const { error } = await supabase.from(item.table).delete().eq('id', item.payload.id as string);
          if (error) {
            console.warn(`[Sync] Erro Supabase DELETE (${item.table}):`, error.message);
            hasError = true;
          }
        } else {
          const cleanPayload = sanitizePayloadForSupabase(item.table, item.payload);
          const { error } = await supabase.from(item.table).upsert(cleanPayload as any);
          if (error) {
            console.warn(`[Sync] Erro Supabase UPSERT (${item.table}):`, error.message);
            hasError = true;
          }
        }
        
        if (hasError) {
          const currentRetries = ((item.retries as number) || 0) + 1;
          if (currentRetries >= 5) {
            console.warn(`[Sync] Item ${item.id} (${item.table}) expurgado da fila após 5 falhas.`);
            await db.sync_queue.delete(item.id);
          } else {
            await db.sync_queue.update(item.id, { retries: currentRetries });
          }
        } else {
          // Remove da fila somente se enviado com sucesso ao Supabase
          await db.sync_queue.delete(item.id);
        }
      } catch (err) {
        console.warn(`[Sync] Falha temporária ao sincronizar item ${item.id}:`, err);
        break;
      }
    }
    /* eslint-enable max-depth, no-await-in-loop */
  } catch (err) {
    console.warn("[Sync] Erro ao ler fila de sincronização:", err);
  }
}

/**
 * Subscrição em Tempo Real (Supabase Realtime) para refletir instantaneamente dados no Dexie entre dispositivos
 */
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
            const normalizedRecord = {
              ...newRecord,
              company_id: activeTenant,
              tenant_id: activeTenant,
            };
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

// Escutar eventos de conectividade para rodar a fila automaticamente
if (typeof window !== 'undefined') {
  window.addEventListener('online', processSyncQueue);
}

