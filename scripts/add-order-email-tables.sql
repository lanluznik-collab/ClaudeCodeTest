-- Run this in the Supabase SQL Editor.
-- Adds columns needed by the transactional order-email system (language,
-- generated predracun numbering/paths, send tracking) and a per-year
-- sequential counter table for predracun numbers. Safe to re-run.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS language                TEXT NOT NULL DEFAULT 'sl',
  ADD COLUMN IF NOT EXISTS predracun_number         TEXT,
  ADD COLUMN IF NOT EXISTS predracun_pdf_path       TEXT,
  ADD COLUMN IF NOT EXISTS declaration_pdf_path     TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_sent_at     TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS confirmation_email_error TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS orders_predracun_number_key
  ON orders (predracun_number) WHERE predracun_number IS NOT NULL;

-- One row per year.
CREATE TABLE IF NOT EXISTS predracun_counters (
  year        INT PRIMARY KEY,
  last_number INT NOT NULL DEFAULT 0
);

-- Atomic allocation of the next sequence number for a given year. The
-- Supabase JS client's upsert() can't express "SET x = x + 1" (it can only
-- overwrite with a literal value), so this is a single-statement SQL
-- function called via supabase.rpc() — atomic under concurrent orders
-- without any explicit locking.
CREATE OR REPLACE FUNCTION allocate_predracun_number(p_year INT)
RETURNS INT
LANGUAGE sql
AS $$
  INSERT INTO predracun_counters (year, last_number) VALUES (p_year, 1)
  ON CONFLICT (year) DO UPDATE SET last_number = predracun_counters.last_number + 1
  RETURNING last_number;
$$;

-- Create the private bucket for generated order PDFs. Unlike `product-images`,
-- this bucket has no public read policy — only the service role (used by
-- API routes) can read/write, since these documents contain customer PII.
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-documents', 'order-documents', false)
ON CONFLICT (id) DO NOTHING;
