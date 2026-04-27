-- Run this in the Supabase SQL Editor.
-- The old blog_posts table used TEXT columns (title, excerpt, content, reading_time).
-- This migration drops the old table and creates the new JSONB-based schema.
-- If you have posts to keep, export them first.

DROP TABLE IF EXISTS blog_posts CASCADE;

CREATE TABLE blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  tag           TEXT,
  tag_icon      TEXT,
  published_at  DATE NOT NULL,
  read_minutes  INTEGER,
  cover_image   TEXT,
  title         JSONB NOT NULL,
  intro         JSONB NOT NULL,
  body          JSONB NOT NULL,
  cta_product   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- After running this, call POST /api/admin/seed-blog (with admin session cookie) to insert seed posts.
