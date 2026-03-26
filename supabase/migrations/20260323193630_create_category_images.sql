/*
  # Create category_images table

  1. New Tables
    - `category_images`
      - `id` (uuid, primary key)
      - `category_slug` (text, unique) — matches ServiceCategory.slug
      - `hero_image_url` (text, nullable) — URL for the card/hero image
      - `hero_image_alt` (text) — alt text for accessibility
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Public (anon + authenticated) can SELECT
    - Authenticated users can INSERT, UPDATE, DELETE

  3. Indexes
    - Index on category_slug for fast lookups
*/

CREATE TABLE IF NOT EXISTS category_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug text UNIQUE NOT NULL,
  hero_image_url text,
  hero_image_alt text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE category_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view category images"
  ON category_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert category images"
  ON category_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update category images"
  ON category_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete category images"
  ON category_images FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_category_images_slug ON category_images (category_slug);
