import { db } from './db';
import { supabase } from '../supabase/client';

/**
 * Baixa os dados do Supabase e salva no Dexie (IndexedDB)
 * Esta função deve ser chamada no momento do login ou splash screen.
 */
export async function initialSync() {
  try {
    // 1. Puxar Categorias
    const { data: categories } = await supabase.from('categories').select('*');
    if (categories) await db.categories.bulkPut(categories);

    // 2. Puxar Produtos
    const { data: products } = await supabase.from('products').select('*');
    if (products) await db.products.bulkPut(products);

    // 3. Puxar Filiais
    const { data: branches } = await supabase.from('branches').select('*');
    if (branches) await db.branches.bulkPut(branches);
    
    // (Outras tabelas seguiriam o mesmo padrão)
    
    console.warn('[Sync] Sincronização inicial concluída com sucesso.');
  } catch (err) {
    console.error('[Sync] Falha na sincronização inicial:', err);
  }
}

/**
 * Função genérica para realizar uma mutação Local-First.
 * Salva no Dexie imediatamente e enfileira para envio ao Supabase.
 */
export async function mutateLocalFirst<T extends { id: string }>(
  tableName: 'products' | 'categories' | 'sales' | 'customers',
  payload: T,
  action: 'INSERT' | 'UPDATE' | 'DELETE' = 'UPDATE'
) {
  // 1. Atualiza localmente imediatamente (UI rápida)
  if (action === 'DELETE') {
    await db.table(tableName).delete(payload.id);
  } else {
    await db.table(tableName).put(payload);
  }

  // 2. Enfileira a mudança para a nuvem
  await db.sync_queue.add({
    id: crypto.randomUUID(),
    table: tableName,
    action,
    payload,
    created_at: new Date().toISOString()
  });

  // 3. Tenta processar a fila em background
  processSyncQueue();
}

/**
 * Processa a fila de sincronização enviando ao Supabase
 */
export async function processSyncQueue() {
  if (!navigator.onLine) return; // Só processa se tiver internet

  const queue = await db.sync_queue.orderBy('created_at').toArray();
  
  /* eslint-disable max-depth, no-await-in-loop */
  for (const item of queue) {
    try {
      if (item.action === 'DELETE') {
        const { error } = await supabase.from(item.table).delete().eq('id', item.payload.id as string);
        if (error) throw error;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await supabase.from(item.table).upsert(item.payload as any);
        if (error) throw error;
      }
      
      // Remove da fila se o envio for bem-sucedido
      await db.sync_queue.delete(item.id);
    } catch (err) {
      console.error(`[Sync] Falha ao sincronizar item ${item.id}:`, err);
      // Para o loop e tenta de novo mais tarde para manter a ordem cronológica
      break;
    }
  }
  /* eslint-enable max-depth, no-await-in-loop */
}

// Opcional: Escutar eventos de conectividade para rodar a fila automaticamente
if (typeof window !== 'undefined') {
  window.addEventListener('online', processSyncQueue);
}
