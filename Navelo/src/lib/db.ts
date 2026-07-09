import Dexie, { type EntityTable } from 'dexie';
import {
  Product,
  Category,
  RecipeItem,
  StockMovement,
  Customer,
  CustomerAddress,
  User,
  Tenant,
  CashRegisterSession,
  Tab,
  Order,
  OrderItem,
  PaymentTransaction,
  Invoice,
  TaxRule,
  DeliveryDispatch,
  KitchenTicket,
  AuditLog
} from '../types/domain';

export class NaveloDB extends Dexie {
  products!: EntityTable<Product, 'id'>;
  categories!: EntityTable<Category, 'id'>;
  recipeItems!: EntityTable<RecipeItem, 'id'>;
  stockMovements!: EntityTable<StockMovement, 'id'>;
  customers!: EntityTable<Customer, 'id'>;
  customerAddresses!: EntityTable<CustomerAddress, 'id'>;
  users!: EntityTable<User, 'id'>;
  tenants!: EntityTable<Tenant, 'id'>;
  cashRegisterSessions!: EntityTable<CashRegisterSession, 'id'>;
  tabs!: EntityTable<Tab, 'id'>;
  orders!: EntityTable<Order, 'id'>;
  orderItems!: EntityTable<OrderItem, 'id'>;
  paymentTransactions!: EntityTable<PaymentTransaction, 'id'>;
  invoices!: EntityTable<Invoice, 'id'>;
  taxRules!: EntityTable<TaxRule, 'id'>;
  deliveryDispatches!: EntityTable<DeliveryDispatch, 'id'>;
  kitchenTickets!: EntityTable<KitchenTicket, 'id'>;
  auditLogs!: EntityTable<AuditLog, 'id'>;

  constructor() {
    super('NaveloDB');
    
    // Schema de chaves para IndexedDB.
    // O primeiro item é a Primary Key ('id'). 
    // Os demais itens são os campos que serão frequentemente pesquisados ou filtrados offline.
    // Campos que não sofrem filtros "WHERE" não precisam (e nem devem) ser indexados para poupar memória.
    this.version(1).stores({
      products: 'id, tenantId, categoryId, name, barcode, isActive',
      categories: 'id, name, isActive',
      recipeItems: 'id, parentProductId, ingredientProductId',
      stockMovements: 'id, productId, createdAt',
      customers: 'id, name, document, phone, isActive',
      customerAddresses: 'id, customerId',
      users: 'id, tenantId, email, pinCode',
      tenants: 'id, cnpj',
      cashRegisterSessions: 'id, userId, status, openedAt',
      tabs: 'id, identifier, status',
      orders: 'id, sessionId, customerId, status, createdAt',
      orderItems: 'id, orderId, productId',
      paymentTransactions: 'id, orderId, status',
      invoices: 'id, orderId, status',
      taxRules: 'id',
      deliveryDispatches: 'id, orderId, status',
      kitchenTickets: 'id, orderId, status, destination',
      auditLogs: 'id, entityId, createdAt'
    });
  }
}

export const db = new NaveloDB();
