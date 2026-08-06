import Dexie, { type EntityTable } from 'dexie';

export interface PlatformSettingEntity {
  id: string;
  platformName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
}

export interface Branch {
  id: string;
  company_id: string;
  tenant_id?: string;
  name: string;
  active: boolean;
}

export interface Product {
  id: string;
  company_id: string;
  tenant_id?: string;
  category_id?: string | null;
  category?: string;
  name: string;
  description?: string;
  price: number;
  active: boolean;
  stock?: number;
  unit?: string;
  cost_price?: number;
  ncm?: string;
  cest?: string;
  cfop?: string;
  icms_origem?: string;
  detailed_description?: string;
  subgroup?: string;
  min_stock?: number;
  other_costs?: number;
  margin?: number;
  barcodes?: string[];
  barcode?: string;
  image_url?: string;
  print_point?: string;
  multissabor_enabled?: boolean;
  complementos_enabled?: boolean;
  plataformas_enabled?: boolean;
  producao_propria?: boolean;
  ingredients?: string;
  preparation_mode?: string;
  fiscal_data?: Record<string, unknown>;
}

export interface Category {
  id: string;
  company_id: string;
  tenant_id?: string;
  name: string;
  active: boolean;
}

export interface Sale {
  id: string;
  company_id: string;
  tenant_id?: string;
  total: number;
  status: string;
  payment_method?: string;
  customer_id?: string;
  cash_register_id?: string;
  operator_id?: string;
  created_at?: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CustomerAddress {
  id: string;
  customerId: string;
  name?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference_point?: string;
  isDefault: boolean;
}

export interface Customer {
  id: string;
  company_id: string;
  tenant_id?: string;
  name: string;
  document: string;
  phone: string;
  email?: string;
  rg?: string;
  ie?: string;
  type?: 'PF' | 'PJ';
  credit_limit?: number;
  balance?: number;
  addresses?: CustomerAddress[];
}

export interface CashRegister {
  id: string;
  company_id: string;
  tenant_id?: string;
  operator_id: string;
  operator_name: string;
  initial_balance: number;
  current_balance: number;
  status: 'OPEN' | 'CLOSED';
  opened_at: string;
  closed_at?: string;
}

export interface CashMovement {
  id: string;
  cash_register_id: string;
  company_id: string;
  tenant_id?: string;
  type: 'SUPPLY' | 'BLEED' | 'SALE_PAYMENT' | 'REFUND';
  amount: number;
  description: string;
  operator_name: string;
  created_at: string;
}

export interface TableEntity {
  id: string;
  company_id: string;
  tenant_id?: string;
  number: number | string;
  name: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'BILLING';
  customer_count: number;
  opened_at?: string;
}

export interface TabEntity {
  id: string;
  company_id: string;
  tenant_id?: string;
  table_id?: string;
  code: string;
  label?: string;
  customer_name?: string;
  time?: string;
  total: number;
  status: 'OPEN' | 'CLOSED';
  created_at: string;
  items?: Array<Record<string, unknown>>;
}

export interface Supplier {
  id: string;
  company_id: string;
  tenant_id?: string;
  name: string;
  trade_name?: string;
  document: string;
  phone?: string;
  email?: string;
}

export interface Unit {
  id: string;
  company_id: string;
  tenant_id?: string;
  symbol: string;
  name: string;
}

export interface ContingencyNote {
  id: string;
  company_id: string;
  tenant_id?: string;
  sale_id: string;
  series: number;
  number: number;
  xml_payload: string;
  status: 'PENDING_TRANSMISSION' | 'TRANSMITTED' | 'ERROR';
  created_at: string;
}

export interface Rider {
  id: string;
  company_id: string;
  tenant_id?: string;
  name: string;
  phone: string;
  active: boolean;
}

export interface DeliveryRate {
  id: string;
  company_id: string;
  tenant_id?: string;
  neighborhood: string;
  fee: number;
}

export interface AuditLog {
  id: string;
  company_id: string;
  tenant_id?: string;
  operator_name: string;
  action: string;
  resource: string;
  status: 'ALLOWED' | 'DENIED';
  created_at: string;
}

export interface SyncQueueItem {
  id: string;
  table: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  tenant_id?: string;
  payload: Record<string, unknown> & { id?: string; tenant_id?: string; company_id?: string };
  created_at: string;
}

export interface DeliveryOrderEntity {
  id: string;
  company_id: string;
  tenant_id?: string;
  client_name: string;
  address: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'delivered';
  estimated_time?: string;
  total: number;
  motoboy?: string;
  created_at?: string;
}

export interface UserEntity {
  id: string;
  company_id: string;
  tenant_id?: string;
  name: string;
  email: string;
  role: string;
  password: string;
  active: boolean;
}

// Classe do Banco Local
export class NaveloLocalDB extends Dexie {
  platform_settings!: EntityTable<PlatformSettingEntity, 'id'>;
  companies!: EntityTable<Company, 'id'>;
  branches!: EntityTable<Branch, 'id'>;
  products!: EntityTable<Product, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  sales!: EntityTable<Sale, 'id'>;
  sale_items!: EntityTable<SaleItem, 'id'>;
  customers!: EntityTable<Customer, 'id'>;
  users!: EntityTable<UserEntity, 'id'>;
  cash_registers!: EntityTable<CashRegister, 'id'>;
  cash_movements!: EntityTable<CashMovement, 'id'>;
  restaurant_tables!: EntityTable<TableEntity, 'id'>;
  tabs!: EntityTable<TabEntity, 'id'>;
  suppliers!: EntityTable<Supplier, 'id'>;
  units!: EntityTable<Unit, 'id'>;
  contingency_notes!: EntityTable<ContingencyNote, 'id'>;
  riders!: EntityTable<Rider, 'id'>;
  delivery_rates!: EntityTable<DeliveryRate, 'id'>;
  delivery_orders!: EntityTable<DeliveryOrderEntity, 'id'>;
  audit_logs!: EntityTable<AuditLog, 'id'>;
  
  // Fila de Sincronização (Sync Queue)
  sync_queue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('NaveloLocalDB');
    
    // Schema v6 com tabela delivery_orders
    this.version(6).stores({
      platform_settings: 'id',
      companies: 'id',
      branches: 'id, company_id, tenant_id',
      products: 'id, company_id, tenant_id, category_id',
      categories: 'id, company_id, tenant_id',
      sales: 'id, company_id, tenant_id, status',
      sale_items: 'id, sale_id, product_id',
      customers: 'id, company_id, tenant_id',
      users: 'id, company_id, tenant_id, role',
      cash_registers: 'id, company_id, tenant_id, status',
      cash_movements: 'id, cash_register_id, company_id, tenant_id, type',
      restaurant_tables: 'id, company_id, tenant_id, status',
      tabs: 'id, company_id, tenant_id, table_id, status',
      suppliers: 'id, company_id, tenant_id, document',
      units: 'id, company_id, tenant_id',
      contingency_notes: 'id, company_id, tenant_id, sale_id, status',
      riders: 'id, company_id, tenant_id, active',
      delivery_rates: 'id, company_id, tenant_id',
      delivery_orders: 'id, company_id, tenant_id, status',
      audit_logs: 'id, company_id, tenant_id',
      sync_queue: 'id, table, tenant_id, created_at'
    });
  }
}

export const db = new NaveloLocalDB();
