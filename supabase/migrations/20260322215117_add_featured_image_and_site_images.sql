/*
  # Add featured image support and site-wide image management

  ## Summary
  Extends location image management with a manually-uploaded featured image column,
  and adds a new table to manage site-wide images like the homepage hero.

  ## Modified Tables
  - `location_hero_images`
    - `featured_image_url` (text, nullable) — manually uploaded image URL, shown instead of AI-generated when present

  ## New Tables
  - `site_images`
    - `id` (uuid, primary key)
    - `key` (text, unique) — identifier for the image (e.g. "homepage-hero")
    - `label` (text) — human-readable label shown in admin UI
    - `image_url` (text, nullable) — public URL of the uploaded image
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled on `site_images`
  - Public SELECT so the frontend can fetch images without auth
  - Authenticated-only INSERT/UPDATE/DELETE
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'location_hero_images' AND column_name = 'featured_image_url'
  ) THEN
    ALTER TABLE location_hero_images ADD COLUMN featured_image_url text;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS site_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL DEFAULT '',
  image_url text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site images"
  ON site_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert site images"
  ON site_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update site images"
  ON site_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site images"
  ON site_images FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO site_images (key, label) VALUES
  ('homepage-hero', 'Homepage Hero Background')
ON CONFLICT (key) DO NOTHING;
