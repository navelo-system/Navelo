-- Execute no SQL Editor do Supabase (uma vez).
-- Cria as tabelas usadas pelo balanço de estoque e pela entrada manual.

CREATE TABLE IF NOT EXISTS inventory_audits (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  date text,
  groups text,
  status text DEFAULT 'Pendente',
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS manual_stock_entries (
  id text PRIMARY KEY,
  company_id text,
  tenant_id text,
  date text,
  supplier_id text,
  supplier_name text,
  total numeric DEFAULT 0,
  status text DEFAULT 'Pendente',
  items jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE IF EXISTS inventory_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS manual_stock_entries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon inventory_audits') THEN
    CREATE POLICY "Allow all for anon inventory_audits" ON inventory_audits FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow all for anon manual_stock_entries') THEN
    CREATE POLICY "Allow all for anon manual_stock_entries" ON manual_stock_entries FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['inventory_audits', 'manual_stock_entries'] LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', t);
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END LOOP;
END $$;

NOTIFY pgrst, 'reload schema';
