/*
  # Insert "Who We Serve" section images into site_images

  ## Summary
  Adds four new rows to the existing `site_images` table to support
  editable images for the "Who We Serve" section on the Services Hub page.

  ## New Rows
  - `services-who-we-serve-left`  — top-left photo in the 2-column grid
  - `services-who-we-serve-right` — top-right photo in the 2-column grid
  - `services-compare-before`     — "Before" image in the hover comparison slider
  - `services-compare-after`      — "After" image in the hover comparison slider

  ## Notes
  - Uses INSERT ... ON CONFLICT DO NOTHING so the migration is idempotent
  - `image_url` is intentionally NULL; the frontend falls back to Pexels defaults
    until an admin uploads a real photo
*/

INSERT INTO site_images (key, label, image_url)
VALUES
  ('services-who-we-serve-left',  'Who We Serve — Left Photo',    NULL),
  ('services-who-we-serve-right', 'Who We Serve — Right Photo',   NULL),
  ('services-compare-before',     'Services Compare — Before',    NULL),
  ('services-compare-after',      'Services Compare — After',     NULL)
ON CONFLICT (key) DO NOTHING;
