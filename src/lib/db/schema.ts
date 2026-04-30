import sql from './client';

export async function runMigrations() {
  await sql`
    CREATE TABLE IF NOT EXISTS product_settings (
      shopify_product_id TEXT PRIMARY KEY,
      shopify_handle     TEXT,
      shopify_title      TEXT,
      is_active          BOOLEAN DEFAULT true,
      niche              TEXT DEFAULT 'cuisine_home',
      test_mode          BOOLEAN DEFAULT false,
      priority           INTEGER DEFAULT 0,
      created_at         TIMESTAMPTZ DEFAULT NOW(),
      updated_at         TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS product_suppliers (
      id                  SERIAL PRIMARY KEY,
      shopify_product_id  TEXT NOT NULL,
      supplier            TEXT NOT NULL,
      supplier_product_id TEXT,
      supplier_sku        TEXT,
      cost_price          DECIMAL(10,2),
      sell_price          DECIMAL(10,2),
      compare_at_price    DECIMAL(10,2),
      lead_time_days      INTEGER,
      is_active           BOOLEAN DEFAULT true,
      notes               TEXT,
      created_at          TIMESTAMPTZ DEFAULT NOW(),
      updated_at          TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS product_analytics (
      id                  SERIAL PRIMARY KEY,
      shopify_product_id  TEXT NOT NULL,
      date                DATE NOT NULL DEFAULT CURRENT_DATE,
      views               INTEGER DEFAULT 0,
      add_to_carts        INTEGER DEFAULT 0,
      orders              INTEGER DEFAULT 0,
      revenue             DECIMAL(10,2) DEFAULT 0,
      UNIQUE(shopify_product_id, date)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id                   SERIAL PRIMARY KEY,
      shopify_order_id     TEXT NOT NULL UNIQUE,
      shopify_order_number TEXT,
      customer_email       TEXT,
      customer_name        TEXT,
      shipping_address     JSONB,
      line_items           JSONB,
      total_price          DECIMAL(10,2),
      currency             TEXT DEFAULT 'USD',
      status               TEXT DEFAULT 'pending',
      cj_orders            JSONB DEFAULT '[]',
      error_message        TEXT,
      created_at           TIMESTAMPTZ DEFAULT NOW(),
      updated_at           TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS rate_limits (
      id           SERIAL PRIMARY KEY,
      key          TEXT NOT NULL,
      attempted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS rate_limits_key_idx ON rate_limits (key, attempted_at)`;

  return { ok: true };
}
