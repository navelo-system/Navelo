import Dexie, { type EntityTable } from 'dexie';

// Tipos base para as tabelas principais
export interface Company {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  active: boolean;
}

export interface Product {
  id: string;
  company_id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  active: boolean;
}

export interface Category {
  id: string;
  company_id: string;
  name: string;
  active: boolean;
}

export interface Sale {
  id: string;
  company_id: string;
  total: number;
  status: string;
}

export interface Customer {
  id: string;
  company_id: string;
  name: string;
  document: string;
  phone: string;
}

// Classe do Banco Local
export class NaveloLocalDB extends Dexie {
  companies!: EntityTable<Company, 'id'>;
  branches!: EntityTable<Branch, 'id'>;
  products!: EntityTable<Product, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  sales!: EntityTable<Sale, 'id'>;
  customers!: EntityTable<Customer, 'id'>;
  
  // Fila de Sincronização (Sync Queue)
  sync_queue!: EntityTable<{ id: string; table: string; action: 'INSERT' | 'UPDATE' | 'DELETE'; payload: Record<string, unknown> & { id?: string }; created_at: string }, 'id'>;

  constructor() {
    super('NaveloLocalDB');
    
    // Define o schema (apenas as chaves primárias e índices que serão buscados localmente)
    this.version(1).stores({
      companies: 'id',
      branches: 'id, company_id',
      products: 'id, company_id, category_id',
      categories: 'id, company_id',
      sales: 'id, company_id',
      customers: 'id, company_id',
      sync_queue: 'id, table'
    });
  }
}

export const db = new NaveloLocalDB();
