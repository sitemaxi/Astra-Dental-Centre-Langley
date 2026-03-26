/*
  # Create location_hero_images table

  ## Summary
  Stores per-location hero background images for the 8 dental location pages.
  Each row maps a location slug to an image URL and optional generation metadata.

  ## New Tables
  - `location_hero_images`
    - `id` (uuid, primary key)
    - `slug` (text, unique) — matches the location slug used in LocationPage (e.g. "dentist-langley")
    - `location_name` (text) — human-readable label (e.g. "Langley")
    - `image_url` (text, nullable) — public URL of the stored hero image
    - `image_prompt` (text, nullable) — the Imagen prompt used to generate the image
    - `updated_at` (timestamptz) — when the image was last updated

  ## Security
  - RLS enabled; only authenticated users (admins) can insert/update/delete
  - Public SELECT allowed so the LocationPage can fetch images without auth
*/

CREATE TABLE IF NOT EXISTS location_hero_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  location_name text NOT NULL DEFAULT '',
  image_url text,
  image_prompt text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE location_hero_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read location hero images"
  ON location_hero_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert location hero images"
  ON location_hero_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update location hero images"
  ON location_hero_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete location hero images"
  ON location_hero_images FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO location_hero_images (slug, location_name) VALUES
  ('dentist-langley', 'Langley'),
  ('dentist-willowbrook-langley', 'Willowbrook'),
  ('dentist-walnut-grove-langley', 'Walnut Grove'),
  ('dentist-brookswood-langley', 'Brookswood'),
  ('dentist-murrayville-langley', 'Murrayville'),
  ('dentist-cloverdale-surrey', 'Cloverdale'),
  ('dentist-white-rock', 'White Rock'),
  ('dentist-north-delta', 'North Delta')
ON CONFLICT (slug) DO NOTHING;
