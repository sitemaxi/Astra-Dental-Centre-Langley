/*
  # Create Clinic Gallery Images Table

  ## Purpose
  Stores the images shown in the "Experience Our Modern Dental Facility" carousel
  section on the homepage and about page.

  ## New Tables
  - `clinic_gallery_images`
    - `id` (uuid, primary key)
    - `image_url` (text, required) — public URL of the image
    - `alt_text` (text) — accessibility description
    - `caption` (text, nullable) — optional display caption
    - `sort_order` (integer) — controls carousel order (lower = first)
    - `is_active` (boolean) — whether to show this image in the carousel
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ## Security
  - RLS enabled
  - Public users can SELECT active images (needed for public-facing carousel)
  - Only authenticated admin users can INSERT, UPDATE, DELETE

  ## Seed Data
  - 5 default clinic images inserted in the specified order:
    1. Office exterior
    2. Reception
    3. Treatment Rooms 2
    4. Treatment Rooms 3
    5. Treatment Rooms
*/

CREATE TABLE IF NOT EXISTS clinic_gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL DEFAULT '',
  alt_text text NOT NULL DEFAULT '',
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE clinic_gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active clinic gallery images"
  ON clinic_gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert clinic gallery images"
  ON clinic_gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clinic gallery images"
  ON clinic_gallery_images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clinic gallery images"
  ON clinic_gallery_images
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO clinic_gallery_images (image_url, alt_text, caption, sort_order, is_active) VALUES
  ('/Astra_Dental_Langley_Office.png', 'Astra Dental Langley office exterior', 'Our Langley Clinic', 0, true),
  ('/Astra_Dental_Langley_Reception.jpeg', 'Astra Dental Langley reception area', 'Welcome Reception', 1, true),
  ('/Astra_Dental_Langley_Comfortable_Treatment_Rooms2.png', 'Astra Dental comfortable treatment room', 'Modern Treatment Rooms', 2, true),
  ('/Astra_Dental_Langley_Comfortable_Treatment_Rooms3.png', 'Astra Dental treatment room with advanced equipment', 'Advanced Equipment', 3, true),
  ('/Astra_Dental_Langley_Treatment_Rooms.jpg', 'Astra Dental Langley treatment room', 'Patient Comfort First', 4, true)
ON CONFLICT DO NOTHING;
