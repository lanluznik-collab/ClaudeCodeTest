-- ============================================================================
-- blog_posts_simplify_to_markdown.sql
-- ============================================================================
-- Run this in the Supabase SQL Editor. Safe to re-run (idempotent), EXCEPT
-- for section 1 (the DROP/ADD COLUMN), which only runs cleanly once — running
-- it a second time would drop real content. Verify blog_posts is still empty
-- before re-running section 1 if this migration is ever re-applied.
--
-- Verified live schema immediately before writing this (information_schema.
-- columns + pg_policies on blog_posts): title/intro/body are jsonb NOT NULL
-- (bilingual {slo,eng} shape from the previous migration), blog_posts has
-- 0 rows, RLS enabled with exactly one policy (public_read_blog_posts,
-- SELECT-only for anon/authenticated, no write policy).
--
-- Decision: simplify to Slovenian-only, single markdown body. Table is empty,
-- so the jsonb columns are dropped and replaced outright rather than cast in
-- place (there's no bilingual data to extract a "SL" value from).
--   title:  jsonb {slo,eng}        -> text
--   intro:  jsonb {slo,eng}        -> text
--   body:   jsonb [{head,text}...] -> text (markdown)
-- Unchanged: id, slug, tag, tag_icon, read_minutes, cover_image, cta_product,
-- author, published_at, created_at.
-- ============================================================================


-- ── 1) Replace the bilingual jsonb columns with plain text ──────────────
ALTER TABLE public.blog_posts
  DROP COLUMN title,
  DROP COLUMN intro,
  DROP COLUMN body;

ALTER TABLE public.blog_posts
  ADD COLUMN title text NOT NULL,
  ADD COLUMN intro text NOT NULL,
  ADD COLUMN body text NOT NULL DEFAULT '';

ALTER TABLE public.blog_posts ALTER COLUMN body DROP DEFAULT;


-- ── 2) Slug auto-generate trigger — rebuilt for plain-text title ────────
-- slugify_sl() itself is unchanged (already plain text in/out). Restated here
-- so this migration is self-contained.
CREATE OR REPLACE FUNCTION public.slugify_sl(input text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(both '-' FROM
    regexp_replace(
      translate(lower(coalesce(input, '')), chr(269)||chr(263)||chr(353)||chr(382)||chr(273), 'ccszd'),
      '[^a-z0-9]+', '-', 'g'
    )
  );
$$;

-- The trigger function's title lookup no longer needs jsonb ->> extraction —
-- NEW.title is now the plain Slovenian title directly.
CREATE OR REPLACE FUNCTION public.blog_posts_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug text;
  candidate text;
  suffix int := 1;
BEGIN
  IF NEW.slug IS NULL OR btrim(NEW.slug) = '' THEN
    base_slug := public.slugify_sl(NEW.title);
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

-- Uniqueness backstop (matches the original `slug TEXT UNIQUE NOT NULL`
-- column definition) — no-op if it already exists under this name.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public' AND tablename = 'blog_posts' AND indexname = 'blog_posts_slug_key'
  ) THEN
    CREATE UNIQUE INDEX blog_posts_slug_key ON public.blog_posts (slug);
  END IF;
END $$;


-- ── 3) RLS — restate idempotently (unchanged: public read-only) ─────────
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_blog_posts" ON public.blog_posts;
CREATE POLICY "public_read_blog_posts" ON public.blog_posts
  FOR SELECT TO anon, authenticated USING (published_at <= CURRENT_DATE);

-- No INSERT/UPDATE/DELETE policy for anon/authenticated — writes stay denied;
-- only service_role (used by every /api/admin route) can write.


-- ── 4) Reload PostgREST's schema cache ───────────────────────────────────
NOTIFY pgrst, 'reload schema';


-- ── 5) Verification queries (run manually after applying) ───────────────
--   SELECT column_name, data_type FROM information_schema.columns
--     WHERE table_schema='public' AND table_name='blog_posts' ORDER BY ordinal_position;
--   -- expect title/intro/body all "text"
--   INSERT INTO blog_posts (title, intro, body, published_at)
--     VALUES ('Testna Objava Č Š Ž', 'Uvod', '## Naslov' || chr(10) || chr(10) || 'Besedilo.', CURRENT_DATE)
--     RETURNING slug; -- expect: testna-objava-c-s-z
