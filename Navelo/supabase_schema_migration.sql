-- ====================================================================
-- NAVELO SAAS — SCRIPT COMPLETO DE DDL E MIGRATION PARA O SUPABASE
-- Execute este script no SQL Editor do Supabase para criar/alinhar
-- todas as 12 tabelas, colunas company_id/tenant_id e políticas RLS
-- ====================================================================

-- 0. REMOÇÃO DINÂMICA DE POLÍTICAS RLS, FOREIGN KEYS E NOT-NULL CONSTRAINTS QUE TRAVAM A SINCRONIZAÇÃO
DO $$
DECLARE
    pol RECORD;
    fk RECORD;
    chk RECORD;
    col RECORD;
BEGIN
    -- 0.1 Remover todas as políticas RLS pré-existentes que dependem de colunas
    FOR pol IN (
        SELECT policyname, tablename
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(pol.policyname) || ' ON public.' || quote_ident(pol.tablename) || ';';
    END LOOP;

    -- 0.2 Remover todas as Foreign Key constraints pré-existentes
    FOR fk IN (
        SELECT tc.table_name, tc.constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
    ) LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(fk.table_name) || ' DROP CONSTRAINT IF EXISTS ' || quote_ident(fk.constraint_name) || ' CASCADE;';
    END LOOP;

    -- 0.3 Remover todas as CHECK constraints pré-existentes que travam status ou tipos
    FOR chk IN (
        SELECT tc.table_name, tc.constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.constraint_type = 'CHECK'
          AND tc.table_schema = 'public'
    ) LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(chk.table_name) || ' DROP CONSTRAINT IF EXISTS ' || quote_ident(chk.constraint_name) || ' CASCADE;';
    END LOOP;

    -- 0.4 Remover restrições NOT NULL indevidas de todas as colunas (exceto ID)
    FOR col IN (
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND is_nullable = 'NO' 
          AND column_name != 'id'
          AND table_name IN (
            'platform_settings', 'companies', 'categories', 'products', 'branches', 
            'customers', 'sales', 'sale_items', 'tabs', 'delivery_orders', 'users', 
            'cash_registers', 'cash_movements', 'suppliers', 'units', 'print_points', 
            'riders', 'delivery_rates', 'restaurant_tables'
          )
    ) LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(col.table_name) || ' ALTER COLUMN ' || quote_ident(col.column_name) || ' DROP NOT NULL;';
    END LOOP;
END $$;

-- 1. TABELA PLATFORM_SETTINGS
CREATE TABLE IF NOT EXISTS platform_settings (
  id text PRIMARY KEY,
  platform_name text,
  primary_color text,
  secondary_color text,
  logo_url text,
  updated_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS platform_settings ALTER COLUMN id TYPE text USING id::text;

-- 2. TABELA COMPANIES
CREATE TABLE IF NOT EXISTS companies (
  id text PRIMARY KEY,
  name text,
  document text,
  email text,
  phone text,
  primary_color text,
  secondary_color text,
  logo_url text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS companies ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS companies ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS companies ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS companies ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS companies ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 3. TABELA CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  name text,
  active boolean DEFAULT true,
  subgroups jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS categories ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS categories ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS categories ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS categories ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 4. TABELA PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  category_id text,
  category text,
  name text,
  description text,
  price numeric DEFAULT 0,
  active boolean DEFAULT true,
  stock numeric DEFAULT 0,
  unit text,
  cost_price numeric DEFAULT 0,
  ncm text,
  cest text,
  cfop text,
  icms_origem text,
  detailed_description text,
  subgroup text,
  min_stock numeric DEFAULT 0,
  other_costs numeric DEFAULT 0,
  margin numeric DEFAULT 0,
  barcodes jsonb DEFAULT '[]'::jsonb,
  barcode text,
  image_url text,
  image text,
  print_point text,
  multissabor_enabled boolean DEFAULT false,
  complementos_enabled boolean DEFAULT false,
  plataformas_enabled boolean DEFAULT false,
  producao_propria boolean DEFAULT false,
  ingredients text,
  preparation_mode text,
  fiscal_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS products ADD COLUMN IF NOT EXISTS type text DEFAULT 'PRODUCT';
ALTER TABLE IF EXISTS products ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS products ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS products ALTER COLUMN tenant_id TYPE text USING tenant_id::text;
ALTER TABLE IF EXISTS products ALTER COLUMN category_id TYPE text USING category_id::text;

-- 5. TABELA BRANCHES
CREATE TABLE IF NOT EXISTS branches (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  name text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS branches ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS branches ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS branches ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS branches ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS branches ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 6. TABELA CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  name text,
  document text,
  phone text,
  email text,
  rg text,
  ie text,
  type text,
  addresses jsonb DEFAULT '[]'::jsonb,
  credit_limit numeric DEFAULT 0,
  balance numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS customers ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS customers ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS customers ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS customers ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 7. TABELA SALES
CREATE TABLE IF NOT EXISTS sales (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  total numeric DEFAULT 0,
  status text,
  payment_method text,
  customer_id text,
  customer_name text,
  items jsonb DEFAULT '[]'::jsonb,
  cash_register_id text,
  operator_id text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS sales ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS sales ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS sales ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS sales ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS sales ALTER COLUMN tenant_id TYPE text USING tenant_id::text;
ALTER TABLE IF EXISTS sales ALTER COLUMN customer_id TYPE text USING customer_id::text;
ALTER TABLE IF EXISTS sales ALTER COLUMN cash_register_id TYPE text USING cash_register_id::text;
ALTER TABLE IF EXISTS sales ALTER COLUMN operator_id TYPE text USING operator_id::text;
ALTER TABLE IF EXISTS sales ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0;
ALTER TABLE IF EXISTS sales ADD COLUMN IF NOT EXISTS discount numeric DEFAULT 0;
ALTER TABLE IF EXISTS sales ADD COLUMN IF NOT EXISTS pdf_url text;

-- ====================================================================
-- BUCKET PARA COMPROVANTES PDF (executar UMA VEZ no Supabase)
-- ====================================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('sale-receipts', 'sale-receipts', true)
-- ON CONFLICT (id) DO UPDATE SET public = true;
--
-- CREATE POLICY IF NOT EXISTS "Public read sale-receipts"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'sale-receipts');
-- ====================================================================

-- 8. TABELA TABS (COMANDAS)
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
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS identifier text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS label text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS time text;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS total numeric DEFAULT 0;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS status text DEFAULT 'OPEN';
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS tabs ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE IF EXISTS tabs ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS tabs ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS tabs ALTER COLUMN tenant_id TYPE text USING tenant_id::text;
ALTER TABLE IF EXISTS tabs ALTER COLUMN table_id TYPE text USING table_id::text;

-- 9. TABELA DELIVERY_ORDERS
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
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS client_name text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS client_document text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS client_phone text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS status text DEFAULT 'confirmed';
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS estimated_time text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS total numeric DEFAULT 0;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS discount numeric DEFAULT 0;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS delivery_fee numeric DEFAULT 0;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS motoboy text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS origin text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS delivery_type text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS payment_method text;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS items jsonb DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS delivery_orders ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();
ALTER TABLE IF EXISTS delivery_orders ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS delivery_orders ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS delivery_orders ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 10. TABELA USERS
CREATE TABLE IF NOT EXISTS users (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  name text,
  email text,
  phone text,
  commission text,
  password text,
  role text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS password_hash text;
ALTER TABLE IF EXISTS users ADD COLUMN IF NOT EXISTS password text;
ALTER TABLE IF EXISTS users ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS users ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS users ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 11. TABELA CASH_REGISTERS
CREATE TABLE IF NOT EXISTS cash_registers (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  code text,
  name text,
  status text DEFAULT 'closed',
  balance numeric DEFAULT 0,
  opened_at text,
  operator_name text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS code text;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS status text DEFAULT 'closed';
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 0;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS initial_balance numeric DEFAULT 0;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS current_balance numeric DEFAULT 0;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS opened_at text;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS closed_at text;
ALTER TABLE IF EXISTS cash_registers ADD COLUMN IF NOT EXISTS operator_name text;
ALTER TABLE IF EXISTS cash_registers ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS cash_registers ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS cash_registers ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 12. TABELA SUPPLIERS
CREATE TABLE IF NOT EXISTS suppliers (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  name text,
  document text,
  email text,
  phone text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS suppliers ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS suppliers ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS suppliers ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE IF EXISTS suppliers ADD COLUMN IF NOT EXISTS trade_name text;
ALTER TABLE IF EXISTS suppliers ADD COLUMN IF NOT EXISTS document text;
ALTER TABLE IF EXISTS suppliers ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE IF EXISTS suppliers ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE IF EXISTS suppliers ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS suppliers ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS suppliers ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 13. TABELA SALE_ITEMS
CREATE TABLE IF NOT EXISTS sale_items (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  sale_id text,
  product_id text,
  product_name text,
  name text,
  quantity numeric DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_price numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS sale_items ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS sale_items ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS sale_items ADD COLUMN IF NOT EXISTS product_name text;
ALTER TABLE IF EXISTS sale_items ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE IF EXISTS sale_items ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS sale_items ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS sale_items ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 14. TABELA CASH_MOVEMENTS
CREATE TABLE IF NOT EXISTS cash_movements (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  cash_register_id text,
  type text,
  amount numeric DEFAULT 0,
  description text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS cash_movements ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS cash_movements ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS cash_movements ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS cash_movements ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS cash_movements ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 15. TABELA UNITS
CREATE TABLE IF NOT EXISTS units (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  name text,
  abbreviation text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS units ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS units ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS units ADD COLUMN IF NOT EXISTS symbol text;
ALTER TABLE IF EXISTS units ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE IF EXISTS units ADD COLUMN IF NOT EXISTS abbreviation text;
ALTER TABLE IF EXISTS units ADD COLUMN IF NOT EXISTS decimals numeric DEFAULT 0;
ALTER TABLE IF EXISTS units ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS units ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS units ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 16. TABELA PRINT_POINTS
CREATE TABLE IF NOT EXISTS print_points (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  name text,
  printer_name text,
  type text,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS printer_name text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS type text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS server_ip text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS "serverIp" text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS port text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS enabled boolean DEFAULT true;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS bobbin_size text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS "bobbinSize" text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS increase_font boolean DEFAULT false;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS "increaseFont" boolean DEFAULT false;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS columns numeric DEFAULT 48;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS kitchen_monitor_enabled boolean DEFAULT false;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS "kitchenMonitorEnabled" boolean DEFAULT false;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS linking_code text;
ALTER TABLE IF EXISTS print_points ADD COLUMN IF NOT EXISTS "linkingCode" text;
ALTER TABLE IF EXISTS print_points ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS print_points ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS print_points ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 17. TABELA RIDERS
CREATE TABLE IF NOT EXISTS riders (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  name text,
  phone text,
  status text DEFAULT 'available',
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS document text;
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS conecta_enabled boolean DEFAULT false;
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS conecta_code text;
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
ALTER TABLE IF EXISTS riders ADD COLUMN IF NOT EXISTS status text DEFAULT 'available';
ALTER TABLE IF EXISTS riders ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS riders ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS riders ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 18. TABELA DELIVERY_RATES
CREATE TABLE IF NOT EXISTS delivery_rates (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  neighborhood text,
  rate numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS delivery_rates ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS delivery_rates ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS delivery_rates ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS delivery_rates ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS delivery_rates ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- 19. TABELA RESTAURANT_TABLES
CREATE TABLE IF NOT EXISTS restaurant_tables (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  number text,
  capacity integer DEFAULT 4,
  status text DEFAULT 'free',
  created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE IF EXISTS restaurant_tables ADD COLUMN IF NOT EXISTS company_id text;
ALTER TABLE IF EXISTS restaurant_tables ADD COLUMN IF NOT EXISTS tenant_id text;
ALTER TABLE IF EXISTS restaurant_tables ADD COLUMN IF NOT EXISTS number text;
ALTER TABLE IF EXISTS restaurant_tables ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE IF EXISTS restaurant_tables ADD COLUMN IF NOT EXISTS capacity integer DEFAULT 4;
ALTER TABLE IF EXISTS restaurant_tables ADD COLUMN IF NOT EXISTS customer_count numeric DEFAULT 0;
ALTER TABLE IF EXISTS restaurant_tables ADD COLUMN IF NOT EXISTS status text DEFAULT 'AVAILABLE';
ALTER TABLE IF EXISTS restaurant_tables ADD COLUMN IF NOT EXISTS opened_at text;
ALTER TABLE IF EXISTS restaurant_tables ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE IF EXISTS restaurant_tables ALTER COLUMN company_id TYPE text USING company_id::text;
ALTER TABLE IF EXISTS restaurant_tables ALTER COLUMN tenant_id TYPE text USING tenant_id::text;

-- ====================================================================
-- HABILITAÇÃO E POLÍTICAS DE ROW LEVEL SECURITY (RLS) PARA A CHAVE ANON
-- ====================================================================
ALTER TABLE IF EXISTS platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS delivery_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cash_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cash_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS units ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS print_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS delivery_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS restaurant_tables ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon platform_settings') THEN
    CREATE POLICY "Allow all for anon platform_settings" ON platform_settings FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon companies') THEN
    CREATE POLICY "Allow all for anon companies" ON companies FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon categories') THEN
    CREATE POLICY "Allow all for anon categories" ON categories FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon products') THEN
    CREATE POLICY "Allow all for anon products" ON products FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon branches') THEN
    CREATE POLICY "Allow all for anon branches" ON branches FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon customers') THEN
    CREATE POLICY "Allow all for anon customers" ON customers FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon sales') THEN
    CREATE POLICY "Allow all for anon sales" ON sales FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon sale_items') THEN
    CREATE POLICY "Allow all for anon sale_items" ON sale_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon tabs') THEN
    CREATE POLICY "Allow all for anon tabs" ON tabs FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon delivery_orders') THEN
    CREATE POLICY "Allow all for anon delivery_orders" ON delivery_orders FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon users') THEN
    CREATE POLICY "Allow all for anon users" ON users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon cash_registers') THEN
    CREATE POLICY "Allow all for anon cash_registers" ON cash_registers FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon cash_movements') THEN
    CREATE POLICY "Allow all for anon cash_movements" ON cash_movements FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon suppliers') THEN
    CREATE POLICY "Allow all for anon suppliers" ON suppliers FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon units') THEN
    CREATE POLICY "Allow all for anon units" ON units FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon print_points') THEN
    CREATE POLICY "Allow all for anon print_points" ON print_points FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon riders') THEN
    CREATE POLICY "Allow all for anon riders" ON riders FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon delivery_rates') THEN
    CREATE POLICY "Allow all for anon delivery_rates" ON delivery_rates FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon restaurant_tables') THEN
    CREATE POLICY "Allow all for anon restaurant_tables" ON restaurant_tables FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ====================================================================
-- FORÇA O RELOAD IMEDIATO DO CACHE DE SCHEMA DO POSTGREST NO SUPABASE
-- ====================================================================
NOTIFY pgrst, 'reload schema';
