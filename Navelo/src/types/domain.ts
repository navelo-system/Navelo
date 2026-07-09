export type UUID = string;
export type Timestamp = Date | string;

// ==========================================
// 1. CATÁLOGO E ESTOQUE
// ==========================================

export enum ProductType {
  SIMPLE = "SIMPLE",
  COMPOSITE = "COMPOSITE",
  COMBO = "COMBO",
}

export enum UnitType {
  UN = "UN",
  KG = "KG",
  L = "L",
  G = "G",
  ML = "ML",
  CX = "CX",
}

export interface Product {
  id: UUID;
  tenantId: UUID;
  name: string;
  type: ProductType;
  mainImage?: string;
  gallery?: string[];
  description?: string;
  detailedDescription?: string;
  unitType: UnitType;
  categoryId: UUID;
  subcategoryId?: UUID;
  barcode?: string;
  stock: number;
  minStock: number;
  costPrice: number;
  otherCosts: number;
  marginPercentage: number;
  sellingPrice: number;
  isActive: boolean;
  taxRuleId?: UUID;
  fiscalOverrides?: {
    useDefaultIcms?: boolean;
    csosn?: string;
    reductionBaseCalc?: number;
    effectiveIcmsAliquot?: number;
    useDefaultPisCofins?: boolean;
    cstPisCofins?: string;
  };
}

export interface Category {
  id: UUID;
  name: string;
  color?: string; // HEX
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface RecipeItem {
  id: UUID;
  parentProductId: UUID;
  ingredientProductId: UUID;
  quantityUsed: number;
  unitType: UnitType;
}

export enum StockMovementType {
  IN = "IN",
  OUT = "OUT",
  ADJUSTMENT = "ADJUSTMENT",
}

export interface StockMovement {
  id: UUID;
  productId: UUID;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  userId: UUID;
  createdAt: Timestamp;
  invoiceId?: UUID;
}

// ==========================================
// 2. PESSOAS E ACESSOS
// ==========================================

export interface Customer {
  id: UUID;
  name: string;
  document?: string;
  email?: string;
  phone?: string;
  loyaltyPoints: number;
  cashbackBalance: number;
  creditLimit: number;
  usedCredit: number;
  isActive: boolean;
}

export interface CustomerAddress {
  id: UUID;
  customerId: UUID;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  CASHIER = "CASHIER",
  ATTENDANT = "ATTENDANT",
}

export interface User {
  id: UUID;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  tenantId: UUID;
  pinCode?: string; // 4 digits
}

export interface Tenant {
  id: UUID;
  corporateName: string;
  tradingName: string;
  cnpj: string;
  digitalCertificate?: Blob | File | string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  subscriptionId?: UUID;
  isActive?: boolean;
}

// ==========================================
// 3. OPERAÇÃO DE VENDA (FRENTE DE LOJA)
// ==========================================

export enum SessionStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface CashRegisterSession {
  id: UUID;
  userId: UUID;
  openedAt: Timestamp;
  closedAt?: Timestamp;
  openingBalance: number;
  closingBalance?: number;
  status: SessionStatus;
}

export enum TabStatus {
  FREE = "FREE",
  OCCUPIED = "OCCUPIED",
  BILL_REQUESTED = "BILL_REQUESTED",
  PAYING = "PAYING",
}

export interface Tab {
  id: UUID;
  identifier: string; // "Mesa 04", "Comanda 102"
  status: TabStatus;
  openedAt?: Timestamp;
  customerCount: number;
}

export enum OrderSource {
  POS = "POS",
  DELIVERY = "DELIVERY",
  MOBILE = "MOBILE",
  TOTEM = "TOTEM",
}

export enum OrderStatus {
  DRAFT = "DRAFT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export interface Order {
  id: UUID;
  orderNumber: number;
  sessionId: UUID;
  tabId?: UUID;
  customerId?: UUID;
  source: OrderSource;
  subtotal: number;
  discountAmount: number;
  serviceFee: number;
  total: number;
  status: OrderStatus;
  createdAt: Timestamp;
}

export interface OrderItem {
  id: UUID;
  orderId: UUID;
  productId: UUID;
  productNameSnapshot: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  notes?: string;
}

// ==========================================
// 4. FINANCEIRO E FISCAL
// ==========================================

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
  TRANSFER = "TRANSFER",
}

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  PIX = "PIX",
  VOUCHER = "VOUCHER",
  STORE_CREDIT = "STORE_CREDIT",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface PaymentTransaction {
  id: UUID;
  orderId?: UUID;
  type: TransactionType;
  method: PaymentMethod;
  amount: number;
  installments: number;
  status: PaymentStatus;
}

export enum InvoiceType {
  NFCE = "NFCE",
  NFE = "NFE",
}

export enum InvoiceStatus {
  ISSUED = "ISSUED",
  CONTINGENCY = "CONTINGENCY",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

export interface Invoice {
  id: UUID;
  orderId: UUID;
  type: InvoiceType;
  accessKey?: string;
  xmlUrl?: string;
  status: InvoiceStatus;
}

export interface TaxRule {
  id: UUID;
  name: string;
  ncm?: string;
  cest?: string;
  cfop?: string;
  icmsCst?: string;
  icmsAliquota?: number;
}

// ==========================================
// 5. DELIVERY E PRODUÇÃO
// ==========================================

export enum DeliveryStatus {
  PENDING = "PENDING",
  DISPATCHED = "DISPATCHED",
  DELIVERED = "DELIVERED",
  FAILED = "FAILED",
}

export interface DeliveryDispatch {
  id: UUID;
  orderId: UUID;
  deliveryAddressId: UUID;
  deliveryFee: number;
  driverId?: UUID;
  estimatedTime?: Timestamp;
  status: DeliveryStatus;
}

export enum KitchenDestination {
  KITCHEN = "KITCHEN",
  BAR = "BAR",
}

export enum KitchenStatus {
  WAITING = "WAITING",
  PREPARING = "PREPARING",
  DONE = "DONE",
  DELIVERED = "DELIVERED",
}

export interface KitchenTicket {
  id: UUID;
  orderId: UUID;
  destination: KitchenDestination;
  status: KitchenStatus;
  itemIds: UUID[]; // Refers to OrderItem IDs
  startedAt?: Timestamp;
  finishedAt?: Timestamp;
}

// ==========================================
// 6. AUDITORIA
// ==========================================

export enum AuditSeverity {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export interface AuditLog {
  id: UUID;
  userId: UUID;
  action: string;
  entityId: UUID;
  entityType: string;
  oldValue?: string | Record<string, unknown>;
  newValue?: string | Record<string, unknown>;
  createdAt: Timestamp;
  ipAddress?: string;
  severity?: AuditSeverity;
}

// ==========================================
// 7. PLANOS DE ASSINATURA
// ==========================================

export enum PlanStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

// ==========================================
// 8. CONFIGURAÇÕES GLOBAIS
// ==========================================

export interface GlobalConfig {
  systemName: string;
  adminEmail: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  whitelabel: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
}

export interface Plan {
  id: UUID;
  name: string;
  price: number;
  status: PlanStatus;
  features: string[];
}

export interface SupplierInvoice {
  id: UUID;
  number: string;
  supplier: string;
  value: number;
  key: string;
  status: string;
}
