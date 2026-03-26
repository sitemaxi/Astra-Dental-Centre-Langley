/*
  # Add mobile_image_url to category_images

  1. Changes
    - `category_images` table: adds `mobile_image_url` column (nullable text)
      — Stores a separate, portrait-cropped image for mobile display
      — Falls back to hero_image_url when null

  2. Notes
    - Non-destructive: existing rows are unaffected
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'category_images' AND column_name = 'mobile_image_url'
  ) THEN
    ALTER TABLE category_images ADD COLUMN mobile_image_url text;
  END IF;
END $$;
