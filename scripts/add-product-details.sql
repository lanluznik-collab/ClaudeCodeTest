-- Run this in the Supabase SQL Editor.
-- Adds product-detail-page fields to `products` and seeds sensible values
-- for all products that exist today. Safe to re-run (IF NOT EXISTS / upsert
-- by slug), but only intended to run once.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS purity          TEXT,
  ADD COLUMN IF NOT EXISTS analysis_method TEXT,
  ADD COLUMN IF NOT EXISTS storage_temp    TEXT,
  ADD COLUMN IF NOT EXISTS form            TEXT,
  ADD COLUMN IF NOT EXISTS amount_mg       TEXT,
  ADD COLUMN IF NOT EXISTS description_sl  TEXT,
  ADD COLUMN IF NOT EXISTS description_en  TEXT,
  ADD COLUMN IF NOT EXISTS coa_url         TEXT,
  ADD COLUMN IF NOT EXISTS msds_url        TEXT;

-- Seed existing products. coa_url is backfilled from the first entry of the
-- existing coa_images array so the new document card reuses real data
-- instead of duplicating it. msds_url is left NULL — no MSDS documents
-- exist yet, and the product page hides that card when it's null.

UPDATE products SET
  purity          = '>99,9 %',
  analysis_method = 'Sterilnost, test na endotoksine (LAL)',
  storage_temp    = '2 °C do 25 °C',
  form            = 'Sterilna vodna raztopina (0,9 % benzil alkohol)',
  amount_mg       = '5 ml',
  description_sl  = 'Bakteriostatska voda za rekonstitucijo liofiliziranih peptidov v laboratorijskem okolju. Vsebuje 0,9 % benzil alkohol kot konzervans, kar omogoča večkratno odvzemanje iz iste viale pod sterilnimi pogoji.',
  description_en  = 'Bacteriostatic water for reconstituting lyophilized peptides in a laboratory setting. Contains 0.9% benzyl alcohol as a preservative, allowing multiple sterile draws from the same vial.',
  coa_url         = NULL,
  msds_url        = NULL
WHERE slug = 'bac-water-5mg';

UPDATE products SET
  purity          = '>99 %',
  analysis_method = 'HPLC, MS',
  storage_temp    = '-20 °C, zaščiteno pred svetlobo',
  form            = 'Liofiliziran prašek',
  amount_mg       = '50 mg',
  description_sl  = 'GHK-Cu je bakrov kompleks tripeptida glicil-L-histidil-L-lizin, pogosto uporabljen v in-vitro raziskavah celične signalizacije in modelov obnove tkiva.',
  description_en  = 'GHK-Cu is a copper complex of the tripeptide glycyl-L-histidyl-L-lysine, commonly used in in-vitro research on cell signaling and tissue-repair models.',
  coa_url         = 'https://smdykipbanqblocoovkd.supabase.co/storage/v1/object/public/product-images/02c1a884-8f71-460e-b41a-40580b31bda5.png',
  msds_url        = NULL
WHERE slug = 'ghk-cu-50mg';

UPDATE products SET
  purity          = '>99 %',
  analysis_method = 'HPLC, MS',
  storage_temp    = '-20 °C, zaščiteno pred svetlobo',
  form            = 'Liofiliziran prašek',
  amount_mg       = '5 mg',
  description_sl  = 'Melanotan II je sintetični analog alfa-melanocit stimulirajočega hormona (α-MSH), uporabljen v raziskavah receptorjev melanokortina.',
  description_en  = 'Melanotan II is a synthetic analog of alpha-melanocyte-stimulating hormone (α-MSH), used in melanocortin receptor research.',
  coa_url         = 'https://smdykipbanqblocoovkd.supabase.co/storage/v1/object/public/product-images/e3db7655-fb02-4cd8-87c4-fa16e093a264.png',
  msds_url        = NULL
WHERE slug = 'mt-2';

UPDATE products SET
  purity          = '>99 %',
  analysis_method = 'HPLC, MS',
  storage_temp    = '-20 °C, zaščiteno pred svetlobo',
  form            = 'Liofiliziran prašek',
  amount_mg       = '5 mg',
  description_sl  = 'Retatrutid je raziskovalni triagonist receptorjev GIP, GLP-1 in glukagona, preučevan v študijah presnove in energijske homeostaze.',
  description_en  = 'Retatrutide is a research triple agonist of the GIP, GLP-1, and glucagon receptors, studied in metabolic and energy-homeostasis research.',
  coa_url         = 'https://smdykipbanqblocoovkd.supabase.co/storage/v1/object/public/product-images/12634c45-8a8a-468d-8269-b42f2d3fda23.png',
  msds_url        = NULL
WHERE slug = 'retatrutide';

UPDATE products SET
  purity          = '>99 %',
  analysis_method = 'HPLC, MS',
  storage_temp    = '-20 °C, zaščiteno pred svetlobo',
  form            = 'Liofiliziran prašek',
  amount_mg       = '5 mg',
  description_sl  = 'BPC-157 je sintetični pentadekapeptid, izpeljan iz zaščitnega želodčnega proteina, preučevan v modelih celjenja tkiv in angiogeneze.',
  description_en  = 'BPC-157 is a synthetic pentadecapeptide derived from a gastric protective protein, studied in tissue-healing and angiogenesis models.',
  coa_url         = 'https://smdykipbanqblocoovkd.supabase.co/storage/v1/object/public/product-images/2e199e4c-e1c1-40a0-befe-2ac030283259.png',
  msds_url        = NULL
WHERE slug = 'bcp-157';
