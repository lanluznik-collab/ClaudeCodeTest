-- ============================================================================
-- blog_posts_author_slug_rls.sql
-- ============================================================================
-- Run this in the Supabase SQL Editor. Safe to re-run (idempotent).
--
-- Live schema of public.blog_posts at the time this was written (verified via
-- information_schema.columns): id, slug, tag, tag_icon, published_at,
-- read_minutes, cover_image, title (jsonb), intro (jsonb), body (jsonb),
-- cta_product, created_at. No author column existed, which is what made the
-- admin "Nova blog objava" form's insert fail with "Could not find the
-- 'author' column of 'blog_posts' in the schema cache".
--
-- This migration:
--   1) Adds the missing author column.
--   2) Auto-generates slug from title (Slovenian-aware) when left blank, with
--      collision-safe uniqueness (-2, -3, ... suffixes).
--   3) Confirms RLS + the public-read-only policy (already applied by
--      enable_rls.sql — restated here idempotently so this migration is
--      self-contained and doesn't depend on tribal knowledge of what ran
--      before it).
--   4) Reloads PostgREST's schema cache so the new column is visible
--      immediately without waiting for the next deploy/restart.
-- ============================================================================


-- ── 1) Missing column ────────────────────────────────────────────────────
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS author text;


-- ── 2) Auto-slug from title ──────────────────────────────────────────────

-- Slovenian-aware slugify: lowercase, transliterate č/ć→c š→s ž→z đ→d, then
-- collapse any run of non [a-z0-9] characters into a single hyphen and trim
-- leading/trailing hyphens.
CREATE OR REPLACE FUNCTION public.slugify_sl(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(both '-' FROM
    regexp_replace(
      translate(lower(coalesce(input, '')), 'čćšžđ', 'ccszd'),
      '[^a-z0-9]+', '-', 'g'
    )
  );
$$;

-- title is jsonb ({"slo": "...", "eng": "..."} per the seeded posts, but this
-- also tolerates a plain jsonb string so the trigger doesn't break if a
-- caller ever inserts title as just "Some Title" instead of the bilingual
-- object shape).
CREATE OR REPLACE FUNCTION public.blog_posts_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  title_text text;
  base_slug text;
  candidate text;
  suffix int := 1;
BEGIN
  IF NEW.slug IS NULL OR btrim(NEW.slug) = '' THEN
    title_text := COALESCE(NEW.title ->> 'slo', NEW.title ->> 'eng', NEW.title #>> '{}');
    base_slug := public.slugify_sl(title_text);
    IF base_slug = '' THEN
      base_slug := 'objava';
    END IF;

    candidate := base_slug;
    WHILE EXISTS (
      SELECT 1 FROM public.blog_posts
      WHERE slug = candidate AND id IS DISTINCT FROM NEW.id
    ) LOOP
      suffix := suffix + 1;
      candidate := base_slug || '-' || suffix;
    END LOOP;

    NEW.slug := candidate;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_blog_posts_set_slug ON public.blog_posts;
CREATE TRIGGER trg_blog_posts_set_slug
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.blog_posts_set_slug();

-- Ensure slug uniqueness is enforced at the DB level regardless of the
-- trigger (belt-and-suspenders — matches the original `slug TEXT UNIQUE NOT
-- NULL` column definition; guarded so it's a no-op if that constraint/index
-- already exists under its default Postgres-assigned name).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'blog_posts' AND indexname = 'blog_posts_slug_key'
  ) THEN
    CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts (slug);
  END IF;
END $$;


-- ── 3) RLS — restate the existing policy idempotently ───────────────────
-- (Originally applied by enable_rls.sql: RLS enabled with public SELECT-only
-- access limited to published posts; no anon/authenticated write policy, so
-- writes stay denied and only service_role — used by every /api/admin route
-- — can insert/update/delete.)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_blog_posts" ON public.blog_posts;
CREATE POLICY "public_read_blog_posts" ON public.blog_posts
  FOR SELECT TO anon, authenticated USING (published_at <= CURRENT_DATE);

-- No INSERT/UPDATE/DELETE policy is created for anon/authenticated — the
-- absence of one, combined with RLS being enabled, denies those writes.


-- ── 4) Reload PostgREST's schema cache ───────────────────────────────────
NOTIFY pgrst, 'reload schema';


-- ── 5) Verification queries (run manually after applying) ───────────────
--   SELECT column_name, data_type FROM information_schema.columns
--     WHERE table_schema='public' AND table_name='blog_posts' ORDER BY ordinal_position;
--   SELECT policyname, cmd, roles FROM pg_policies WHERE tablename='blog_posts';
--   INSERT INTO blog_posts (title, intro, body, published_at)
--     VALUES ('{"slo":"Testna Objava Č Š Ž","eng":"Test Post"}', '{"slo":"x","eng":"x"}', '[]', CURRENT_DATE)
--     RETURNING slug; -- expect: testna-objava-c-s-z
