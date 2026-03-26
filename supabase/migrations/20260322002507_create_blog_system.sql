/*
  # Blog System Tables & Storage

  ## Summary
  Creates the complete blog CMS infrastructure for Astra Dental Centre admin.

  ## New Tables

  ### blog_posts
  - Full blog post record with title, slug, content (HTML), SEO fields, FAQs, internal links
  - Status workflow: draft → review → approved → published
  - Scheduling support via schedule_for and published_at
  - View counting and read time tracking

  ### media_library
  - Image/file asset management linked to Supabase Storage
  - Tracks filename, URL, dimensions, file size, mime type

  ## New Functions
  - increment_post_views(post_id uuid) — safely increments view count

  ## Security
  - RLS enabled on both tables
  - Authenticated users (admins) can read/write all records
  - Public (anonymous) users can only read published blog posts and media
*/

-- ─── blog_posts ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text        NOT NULL,
  slug              text        UNIQUE NOT NULL,
  excerpt           text,
  content           text,
  featured_image    text,
  featured_image_alt text,
  author_name       text        DEFAULT 'Astra Dental Team',
  author_avatar     text,
  category          text,
  tags              text[]      DEFAULT '{}',
  status            text        DEFAULT 'draft' CHECK (status IN ('draft','published','scheduled')),
  published         boolean     DEFAULT false,
  published_at      timestamptz,
  schedule_for      timestamptz,
  read_time         integer     DEFAULT 5,
  views             integer     DEFAULT 0,
  meta_title        text,
  meta_description  text,
  og_title          text,
  og_description    text,
  og_image          text,
  workflow_status   text        DEFAULT 'draft' CHECK (workflow_status IN ('draft','review','approved','published')),
  faq_section       jsonb       DEFAULT '[]',
  internal_links    jsonb       DEFAULT '[]',
  created_at        timestamptz DEFAULT now(),
  updated_at        timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  TO anon
  USING (status = 'published');

-- ─── media_library ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_library (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  filename    text,
  url         text        NOT NULL,
  alt_text    text        DEFAULT '',
  caption     text        DEFAULT '',
  file_size   integer,
  mime_type   text,
  width       integer,
  height      integer,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage media"
  ON media_library FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert media"
  ON media_library FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update media"
  ON media_library FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete media"
  ON media_library FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read media"
  ON media_library FOR SELECT
  TO anon
  USING (true);

-- ─── RPC: increment_post_views ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_post_views(post_id uuid)
RETURNS void AS $$
  UPDATE blog_posts SET views = views + 1 WHERE id = post_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- ─── auto-update updated_at ───────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_blog_post_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_blog_post_timestamp();
