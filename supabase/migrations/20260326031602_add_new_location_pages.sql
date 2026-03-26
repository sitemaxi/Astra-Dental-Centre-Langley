/*
  # Add new location pages

  ## Summary
  Inserts 6 new location rows into the location_hero_images table to support
  the newly added location pages: Aldergrove, Fort Langley, Abbotsford,
  Maple Ridge, Surrey, and Burnaby.

  ## Changes
  - Adds rows for each new location slug so the admin panel can manage
    hero images and AI generation for these pages.

  ## Notes
  - Uses ON CONFLICT DO NOTHING to safely skip if rows already exist.
*/

INSERT INTO location_hero_images (slug, location_name) VALUES
  ('dentist-aldergrove-langley', 'Aldergrove'),
  ('dentist-fort-langley', 'Fort Langley'),
  ('dentist-abbotsford', 'Abbotsford'),
  ('dentist-maple-ridge', 'Maple Ridge'),
  ('dentist-surrey', 'Surrey'),
  ('dentist-burnaby', 'Burnaby')
ON CONFLICT (slug) DO NOTHING;
