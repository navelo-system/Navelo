-- ====================================================================
-- NAVELO SAAS — SCRIPT DE MIGRATION PARA RÉPLICA COMPLETA NO SUPABASE
-- Execute este script no SQL Editor do Supabase para alinhar todas as colunas
-- ====================================================================

-- 1. TABELA PRODUCTS
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS image text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS fiscal_data jsonb DEFAULT '{}'::jsonb;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS barcodes jsonb DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS print_point text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS multissabor_enabled boolean DEFAULT false;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS complementos_enabled boolean DEFAULT false;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS plataformas_enabled boolean DEFAULT false;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS producao_propria boolean DEFAULT false;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS ingredients text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS preparation_mode text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS stock numeric DEFAULT 0;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS cost_price numeric DEFAULT 0;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS min_stock numeric DEFAULT 0;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS other_costs numeric DEFAULT 0;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS margin numeric DEFAULT 0;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS subgroup text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS detailed_description text;

-- 2. TABELA USERS
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS commission text;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS password text;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;

-- 3. TABELA CUSTOMERS
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS rg text;
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS ie text;
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS addresses jsonb DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS credit_limit numeric DEFAULT 0;
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 0;

-- 4. TABELA TABS (COMANDAS)
CREATE TABLE IF NOT EXISTS tabs (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  table_id text,
  code text,
  label text,
  customer_name text,
  time text,
  total numeric DEFAULT 0,
  status text DEFAULT 'OPEN',
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS label text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;

-- 5. TABELA DELIVERY_ORDERS
CREATE TABLE IF NOT EXISTS delivery_orders (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  client_name text,
  address text,
  status text DEFAULT 'confirmed',
  estimated_time text,
  total numeric DEFAULT 0,
  motoboy text,
  created_at timestamp with time zone DEFAULT now()
);

-- 6. POLÍTICAS DE SEGURANÇA (RLS) PERMISSIVAS PARA A CHAVE DA API (ANON)
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS delivery_orders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon products') THEN
    CREATE POLICY "Allow all for anon products" ON products FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon users') THEN
    CREATE POLICY "Allow all for anon users" ON users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon customers') THEN
    CREATE POLICY "Allow all for anon customers" ON customers FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon tabs') THEN
    CREATE POLICY "Allow all for anon tabs" ON tabs FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon sales') THEN
    CREATE POLICY "Allow all for anon sales" ON sales FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon delivery_orders') THEN
    CREATE POLICY "Allow all for anon delivery_orders" ON delivery_orders FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
