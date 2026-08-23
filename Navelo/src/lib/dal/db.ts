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
  trade_name?: string;
  state_registration?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  address_cep?: string;
  plan?: string;
  status?: string;
  primary_color?: string;
  secondary_color?: string;
  logo_url?: string;
  company_id?: string;
  tenant_id?: string;
  created_at?: string;
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
  multissabor_limit?: number;
  multissabor_pricing_mode?: "proporcional" | "maior";
  complementos_enabled?: boolean;
  plataformas_enabled?: boolean;
  plataformas_price_different?: number;
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
  subgroups?: string[];
}

export interface Sale {
  id: string;
  company_id: string;
  tenant_id?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  status: string;
  payment_method?: string;
  customer_id?: string;
  customer_name?: string;
  items?: (SaleItem | Record<string, unknown>)[];
  cash_register_id?: string;
  operator_id?: string;
  created_at?: string;
  pdf_url?: string;
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
  updated_at?: string;
  items?: Array<Record<string, unknown>>;
  observation?: string;
  is_fixed?: boolean;
}

export type Table = TableEntity;
export type Tab = TabEntity;

export interface Supplier {
  id: string;
  company_id: string;
  tenant_id?: string;
  name: string;
  trade_name?: string;
  document: string;
  phone?: string;
  email?: string;
  state_registration?: string;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
}

export interface Unit {
  id: string;
  company_id: string;
  tenant_id?: string;
  symbol: string;
  name: string;
  decimals?: number;
}

export interface PrintPoint {
  id: string;
  company_id: string;
  tenant_id?: string;
  name: string;
  serverIp?: string;
  port?: string;
  enabled?: boolean;
  bobbinSize?: string;
  increaseFont?: boolean;
  columns?: number;
  kitchenMonitorEnabled?: boolean;
  linkingCode?: string;
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
  document?: string;
  conecta_enabled?: boolean;
  conecta_code?: string;
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
  retries?: number;
}

export interface DeliveryOrderEntity {
  id: string;
  company_id: string;
  tenant_id?: string;
  client_name: string;
  client_document?: string;
  client_phone?: string;
  address: string;
  status: 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'delivered';
  estimated_time?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  delivery_fee?: number;
  motoboy?: string;
  created_at?: string;
  origin?: string;
  delivery_type?: string;
  payment_method?: string;
  items?: Array<Record<string, unknown>>;
}

export type DeliveryOrder = DeliveryOrderEntity;

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

export type User = UserEntity;

export interface InventoryAuditItem {
  productId: string;
  productName: string;
  category: string;
  systemStock: number;
  countedStock: number;
  diff: number;
}

export interface InventoryAuditEntity {
  id: string;
  company_id: string;
  tenant_id?: string;
  date: string;
  groups: string;
  status: "Finalizado" | "Pendente";
  items: InventoryAuditItem[];
  created_at?: string;
}

export interface ManualStockEntryItem {
  productId: string;
  productName: string;
  quantity: number;
  costPrice: number;
  oldCostPrice?: number;
  otherCosts?: number;
  margin?: number;
  salePrice?: number;
  totalCost: number;
  category?: string;
  subgroup?: string;
  imageUrl?: string;
}

export interface ManualStockEntryEntity {
  id: string;
  company_id: string;
  tenant_id?: string;
  date: string;
  supplier_id?: string;
  supplier_name?: string;
  total: number;
  status?: "Finalizado" | "Pendente";
  items: ManualStockEntryItem[];
  created_at?: string;
}

export interface ReceivableEntity {
  id: string;
  company_id: string;
  tenant_id?: string;
  customer_id?: string;
  customer_name: string;
  sale_id?: string;
  doc_number: string;
  due_date: string;
  issue_date: string;
  value: number;
  fine: number;
  interest: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  created_at?: string;
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
  print_points!: EntityTable<PrintPoint, 'id'>;
  inventory_audits!: EntityTable<InventoryAuditEntity, 'id'>;
  manual_stock_entries!: EntityTable<ManualStockEntryEntity, 'id'>;
  receivables!: EntityTable<ReceivableEntity, 'id'>;
  
  // Fila de Sincronização (Sync Queue)
  sync_queue!: EntityTable<SyncQueueItem, 'id'>;

  constructor() {
    super('NaveloLocalDB');
    
    // Schema v7 com print_points, subgroups e decimals
    this.version(7).stores({
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
      print_points: 'id, company_id, tenant_id',
      sync_queue: 'id, table, tenant_id, created_at'
    });

    // Schema v8 com inventory_audits
    this.version(8).stores({
      inventory_audits: 'id, company_id, tenant_id, status, created_at'
    });

    // Schema v9 com manual_stock_entries
    this.version(9).stores({
      manual_stock_entries: 'id, company_id, tenant_id, supplier_id, created_at'
    });

    // Schema v10 com receivables
    this.version(10).stores({
      receivables: 'id, company_id, tenant_id, customer_id, customer_name, status, due_date, created_at'
    });
  }
}

export const db = new NaveloLocalDB();

