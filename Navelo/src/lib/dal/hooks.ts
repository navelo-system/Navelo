import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';
import { mutateLocalFirst } from './sync';

// Hooks de leitura (Usando useLiveQuery do Dexie para reatividade automática na UI)
export function useProducts() {
  return useLiveQuery(() => db.products.toArray());
}

export function useCategories() {
  return useLiveQuery(() => db.categories.toArray());
}

// Hooks de mutação (Abstração)
export const dal = {
  products: {
    create: async (product: unknown) => mutateLocalFirst('products', product as { id: string }, 'INSERT'),
    update: async (product: unknown) => mutateLocalFirst('products', product as { id: string }, 'UPDATE'),
    delete: async (id: string) => mutateLocalFirst('products', { id } as { id: string }, 'DELETE')
  },
  categories: {
    create: async (category: unknown) => mutateLocalFirst('categories', category as { id: string }, 'INSERT'),
    update: async (category: unknown) => mutateLocalFirst('categories', category as { id: string }, 'UPDATE'),
    delete: async (id: string) => mutateLocalFirst('categories', { id } as { id: string }, 'DELETE')
  }
};
