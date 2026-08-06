import { db } from './db';
import { supabase } from '../supabase/client';

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
    if (categories) await db.categories.bulkPut(categories);

    // 4. Puxar Produtos do Tenant
    const { data: products } = await supabase.from('products').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (products) await db.products.bulkPut(products);

    // 5. Puxar Filiais
    const { data: branches } = await supabase.from('branches').select('*').or(`company_id.eq.${tenantId},tenant_id.eq.${tenantId}`);
    if (branches) await db.branches.bulkPut(branches);

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
 * Processa a fila de sincronização enviando ao Supabase
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
        if (item.action === 'DELETE') {
          const { error } = await supabase.from(item.table).delete().eq('id', item.payload.id as string);
          if (error) {
            console.warn(`[Sync] Aviso Supabase (${item.table}):`, error.message);
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await supabase.from(item.table).upsert(item.payload as any);
          if (error) {
            console.warn(`[Sync] Aviso Supabase (${item.table}):`, error.message);
          }
        }
        
        // Remove da fila se processado localmente
        await db.sync_queue.delete(item.id);
      } catch (err) {
        console.warn(`[Sync] Falha temporária ao sincronizar item ${item.id}:`, err);
        break;
      }
    }
    /* eslint-enable max-depth, no-await-in-loop */
  } catch (err) {
    console.error("[Sync] Erro ao ler fila de sincronização:", err);
  }
}

// Escutar eventos de conectividade para rodar a fila automaticamente
if (typeof window !== 'undefined') {
  window.addEventListener('online', processSyncQueue);
}
