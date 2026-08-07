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
  } else if (table === 'users') {
    delete payload.isCurrent;
  } else if (table === 'customers') {
    if (payload.addresses && Array.isArray(payload.addresses)) {
      delete payload.addresses;
    }
  } else if (table === 'delivery_orders' || table === 'tabs' || table === 'sales') {
    if (payload.items && Array.isArray(payload.items)) {
      payload.items = JSON.stringify(payload.items) as any;
    }
  }

  return payload;
}

/**
 * Baixa os dados do Supabase para o Tenant especificado e salva no Dexie (IndexedDB)
 */
export async function initialSync(tenantId?: string) {
  try {
    // 1. Puxar Configurações Globais da Plataforma
    const { data: platformSettings } = await supabase.from('platform_settings').select('*').single();
    if (platformSettings) {
      await db.platform_settings.put(platformSettings);
    }

    if (!tenantId) {
      console.warn('[Sync] Sincronização inicial da plataforma concluída.');
      return;
    }

    // 2. Puxar Empresa / Tenant
    const { data: company } = await supabase.from('companies').select('*').eq('id', tenantId).single();
    if (company) await db.companies.put(company);

    // 3. Puxar Categorias do Tenant
    const { data: categories } = await supabase.from('categories').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (categories && categories.length > 0) await db.categories.bulkPut(categories);

    // 4. Puxar Produtos do Tenant
    const { data: products } = await supabase.from('products').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (products && products.length > 0) await db.products.bulkPut(products);

    // 5. Puxar Filiais
    const { data: branches } = await supabase.from('branches').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (branches && branches.length > 0) await db.branches.bulkPut(branches);

    // 6. Puxar Clientes
    const { data: customers } = await supabase.from('customers').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (customers && customers.length > 0) await db.customers.bulkPut(customers);

    // 7. Puxar Vendas
    const { data: sales } = await supabase.from('sales').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (sales && sales.length > 0) await db.sales.bulkPut(sales);

    // 8. Puxar Comandas (tabs)
    const { data: tabs } = await supabase.from('tabs').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (tabs && tabs.length > 0) await db.tabs.bulkPut(tabs);

    // 9. Puxar Pedidos de Delivery (delivery_orders)
    const { data: deliveryOrders } = await supabase.from('delivery_orders').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (deliveryOrders && deliveryOrders.length > 0) await db.delivery_orders.bulkPut(deliveryOrders);

    // 10. Puxar Usuários / Operadores
    const { data: users } = await supabase.from('users').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (users && users.length > 0) await db.users.bulkPut(users);

    // 11. Puxar Caixas
    const { data: cashRegisters } = await supabase.from('cash_registers').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (cashRegisters && cashRegisters.length > 0) await db.cash_registers.bulkPut(cashRegisters);

    // 12. Puxar Fornecedores
    const { data: suppliers } = await supabase.from('suppliers').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (suppliers && suppliers.length > 0) await db.suppliers.bulkPut(suppliers);

    console.warn(`[Sync] Sincronização inicial concluída com sucesso para o tenant ${tenantId}.`);
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
  const activeTenantId = tenantId || payload.tenant_id || payload.company_id;
  const enrichedPayload = {
    ...payload,
    tenant_id: activeTenantId,
    company_id: activeTenantId || payload.company_id
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
// eslint-disable-next-line complexity
export async function processSyncQueue() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return;

  try {
    const queue = await db.sync_queue.orderBy('created_at').toArray();
    if (!queue || queue.length === 0) return;
    
    /* eslint-disable max-depth, no-await-in-loop */
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
export function subscribeToRealtimeSync(tenantId: string) {
  if (!tenantId || typeof window === 'undefined') return () => {};

  const channel = supabase
    .channel(`navelo-realtime-${tenantId}`)
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
            const companyId = (newRecord.company_id || newRecord.tenant_id) as string;
            if (!companyId || companyId === tenantId) {
              await db.table(table).put(newRecord);
            }
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

