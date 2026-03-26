/*
  # Create service_images and service_before_after tables

  1. New Tables
    - `service_images`
      - `id` (uuid, primary key)
      - `service_slug` (text, unique) — matches service/category slug
      - `page_type` (text) — 'hub', 'category', or 'detail'
      - `hero_image_url` (text, nullable) — main image for the service section
      - `hero_image_alt` (text) — alt text
      - `updated_at` (timestamp)

    - `service_before_after`
      - `id` (uuid, primary key)
      - `service_slug` (text) — matches service slug
      - `label` (text) — caption shown below the compare widget
      - `before_image_url` (text) — before image URL
      - `after_image_url` (text) — after image URL
      - `sort_order` (int) — ordering
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - RLS enabled on both tables
    - Authenticated users can read/write (admin use)
    - Public users can SELECT only (for frontend display)
*/

CREATE TABLE IF NOT EXISTS service_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text UNIQUE NOT NULL,
  page_type text NOT NULL DEFAULT 'detail',
  hero_image_url text,
  hero_image_alt text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_before_after (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug text NOT NULL,
  label text NOT NULL DEFAULT '',
  before_image_url text NOT NULL DEFAULT '',
  after_image_url text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_before_after_slug ON service_before_after(service_slug);
CREATE INDEX IF NOT EXISTS idx_service_images_slug ON service_images(service_slug);

ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_before_after ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read service_images"
  ON service_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert service_images"
  ON service_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update service_images"
  ON service_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete service_images"
  ON service_images FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Public can read service_before_after"
  ON service_before_after FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert service_before_after"
  ON service_before_after FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update service_before_after"
  ON service_before_after FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete service_before_after"
  ON service_before_after FOR DELETE
  TO authenticated
  USING (true);
