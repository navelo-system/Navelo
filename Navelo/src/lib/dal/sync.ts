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
    // 0. Processar a fila local de pendências primeiro
    await processSyncQueue();

    const activeTenant = tenantId || 'tenant-11111111111111';

    // 1. Puxar Configurações Globais da Plataforma
    const { data: platformSettings, error: pErr } = await supabase.from('platform_settings').select('*').maybeSingle();
    if (!pErr && platformSettings) {
      await db.platform_settings.put(platformSettings);
    }

    // 2. Puxar Empresa / Tenant
    const { data: company, error: cErr } = await supabase.from('companies').select('*').eq('id', activeTenant).maybeSingle();
    if (!cErr && company) {
      await db.companies.put(company);
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
          .or(`company_id.eq.${activeTenant},tenant_id.eq.${activeTenant}`);

        if (error) {
          console.warn(`[Sync] Aviso ao buscar tabela ${table}:`, error.message);
        } else if (data && data.length > 0) {
          const normalized = data.map((record) => ({
            ...record,
            company_id: record.company_id || record.tenant_id || activeTenant,
            tenant_id: record.tenant_id || record.company_id || activeTenant,
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
            const companyId = (newRecord.company_id || newRecord.tenant_id) as string;
            if (!companyId || companyId === activeTenant) {
              const normalizedRecord = {
                ...newRecord,
                company_id: newRecord.company_id || newRecord.tenant_id || activeTenant,
                tenant_id: newRecord.tenant_id || newRecord.company_id || activeTenant,
              };
              await db.table(table).put(normalizedRecord);
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

