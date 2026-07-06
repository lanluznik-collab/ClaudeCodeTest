-- Run this in the Supabase SQL Editor.
-- Adds promo codes and extends `orders` for the new Cart -> Checkout ->
-- Confirmation funnel (order_ref, phone, invoice fields, payment/consent
-- tracking, discount + shipping breakdown). Safe to re-run.

-- ── Promo codes ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promo_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code        TEXT UNIQUE NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('percent', 'fixed')),
  value       NUMERIC NOT NULL CHECK (value > 0),
  active      BOOLEAN NOT NULL DEFAULT true,
  expires_at  TIMESTAMPTZ,
  min_order   NUMERIC,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One example code so the flow is testable end to end. Remove or edit freely.
INSERT INTO promo_codes (code, type, value, active, min_order)
VALUES ('DOBRODOSLI10', 'percent', 10, true, 0)
ON CONFLICT (code) DO NOTHING;

-- ── Orders: new columns ─────────────────────────────────────────────
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_ref        TEXT,
  ADD COLUMN IF NOT EXISTS customer_phone   TEXT,
  ADD COLUMN IF NOT EXISTS company_name     TEXT,
  ADD COLUMN IF NOT EXISTS vat_id           TEXT,
  ADD COLUMN IF NOT EXISTS subtotal         NUMERIC,
  ADD COLUMN IF NOT EXISTS shipping_cost    NUMERIC,
  ADD COLUMN IF NOT EXISTS discount_code    TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount  NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cod_surcharge    NUMERIC NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS consent_terms_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS consent_ruo_at   TIMESTAMPTZ;

-- order_ref must be unique once populated, but existing rows (if any) have
-- none yet, so this is a partial unique index rather than a NOT NULL column.
CREATE UNIQUE INDEX IF NOT EXISTS orders_order_ref_key
  ON orders (order_ref) WHERE order_ref IS NOT NULL;
