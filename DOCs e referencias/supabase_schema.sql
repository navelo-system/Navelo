-- =====================================================================================
-- ESQUEMA DE BANCO DE DADOS - NAVELO (SUPABASE / POSTGRESQL)
-- Baseado no Documento de Modelagem de Domínio (domain.ts)
-- Arquitetura Offline-First (Sincronização com IndexedDB)
-- =====================================================================================

-- Extensão necessária para gerar UUIDs automaticamente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 0. LIMPEZA DO SCHEMA ANTIGO (Cuidado em Produção)
-- ==========================================
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS kitchen_tickets CASCADE;
DROP TABLE IF EXISTS delivery_dispatches CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS tabs CASCADE;
DROP TABLE IF EXISTS cash_register_sessions CASCADE;
DROP TABLE IF EXISTS stock_movements CASCADE;
DROP TABLE IF EXISTS recipe_items CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS tax_rules CASCADE;
DROP TABLE IF EXISTS customer_addresses CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- ==========================================
-- 2. PESSOAS E ACESSOS (Criados primeiro devido as chaves estrangeiras)
-- ==========================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    corporate_name TEXT NOT NULL,
    trading_name TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    digital_certificate TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    logo_url TEXT,
    subscription_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('ADMIN', 'MANAGER', 'CASHIER', 'ATTENDANT')),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    pin_code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    document TEXT,
    email TEXT,
    phone TEXT,
    loyalty_points INTEGER DEFAULT 0,
    cashback_balance DECIMAL(10,2) DEFAULT 0.00,
    credit_limit DECIMAL(10,2) DEFAULT 0.00,
    used_credit DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    zip_code TEXT NOT NULL,
    street TEXT NOT NULL,
    number TEXT NOT NULL,
    complement TEXT,
    neighborhood TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. FINANCEIRO E FISCAL (Tabelas Base)
-- ==========================================

CREATE TABLE tax_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    ncm TEXT,
    cest TEXT,
    cfop TEXT,
    icms_cst TEXT,
    icms_aliquota DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 1. CATÁLOGO E ESTOQUE
-- ==========================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    color TEXT,
    icon TEXT,
    "order" INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('SIMPLE', 'COMPOSITE', 'COMBO')),
    main_image TEXT,
    gallery TEXT[], -- Array de strings no Postgres
    description TEXT,
    detailed_description TEXT,
    unit_type TEXT NOT NULL CHECK (unit_type IN ('UN', 'KG', 'L', 'G', 'ML', 'CX')),
    category_id UUID NOT NULL REFERENCES categories(id),
    subcategory_id UUID,
    barcode TEXT,
    stock DECIMAL(10,3) DEFAULT 0,
    min_stock DECIMAL(10,3) DEFAULT 0,
    cost_price DECIMAL(10,2) DEFAULT 0,
    other_costs DECIMAL(10,2) DEFAULT 0,
    margin_percentage DECIMAL(5,2) DEFAULT 0,
    selling_price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    tax_rule_id UUID REFERENCES tax_rules(id),
    fiscal_overrides JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE recipe_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    ingredient_product_id UUID NOT NULL REFERENCES products(id),
    quantity_used DECIMAL(10,3) NOT NULL,
    unit_type TEXT NOT NULL CHECK (unit_type IN ('UN', 'KG', 'L', 'G', 'ML', 'CX')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUSTMENT')),
    quantity DECIMAL(10,3) NOT NULL,
    reason TEXT,
    user_id UUID NOT NULL REFERENCES users(id),
    invoice_id UUID, -- Será referenciado posteriormente se necessário
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. OPERAÇÃO DE VENDA (FRENTE DE LOJA)
-- ==========================================

CREATE TABLE cash_register_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,
    opening_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(10,2),
    status TEXT NOT NULL CHECK (status IN ('OPEN', 'CLOSED'))
);

CREATE TABLE tabs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('FREE', 'OCCUPIED', 'BILL_REQUESTED', 'PAYING')),
    opened_at TIMESTAMP WITH TIME ZONE,
    customer_count INTEGER DEFAULT 1
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number SERIAL,
    session_id UUID NOT NULL REFERENCES cash_register_sessions(id),
    tab_id UUID REFERENCES tabs(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    source TEXT NOT NULL CHECK (source IN ('POS', 'DELIVERY', 'MOBILE', 'TOTEM')),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    service_fee DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('DRAFT', 'COMPLETED', 'CANCELLED', 'REFUNDED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name_snapshot TEXT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. FINANCEIRO E FISCAL (Tabelas Secundárias)
-- ==========================================

CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'TRANSFER')),
    method TEXT NOT NULL CHECK (method IN ('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'PIX', 'VOUCHER', 'STORE_CREDIT')),
    amount DECIMAL(10,2) NOT NULL,
    installments INTEGER DEFAULT 1,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('NFCE', 'NFE')),
    access_key TEXT,
    xml_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('ISSUED', 'CONTINGENCY', 'CANCELLED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. DELIVERY E PRODUÇÃO
-- ==========================================

CREATE TABLE delivery_dispatches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_address_id UUID NOT NULL REFERENCES customer_addresses(id),
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    driver_id UUID REFERENCES users(id),
    estimated_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'DISPATCHED', 'DELIVERED', 'FAILED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE kitchen_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    destination TEXT NOT NULL CHECK (destination IN ('KITCHEN', 'BAR')),
    status TEXT NOT NULL CHECK (status IN ('WAITING', 'PREPARING', 'DONE', 'DELIVERED')),
    item_ids UUID[] NOT NULL, -- Array contendo os IDs dos OrderItems
    started_at TIMESTAMP WITH TIME ZONE,
    finished_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 6. AUDITORIA
-- ==========================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    action TEXT NOT NULL,
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
