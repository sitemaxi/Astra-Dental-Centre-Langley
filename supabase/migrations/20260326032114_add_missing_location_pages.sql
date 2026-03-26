/*
  # Add missing location pages

  ## Summary
  Inserts 10 additional location rows into the location_hero_images table
  for newly added location pages: Clayton Heights, Fleetwood, Guildford,
  South Surrey, Panorama Ridge, Newton, Ocean Park, Ladner, Tsawwassen,
  and Pitt Meadows.

  ## Changes
  - Adds rows so the admin panel can manage hero images for all new location pages.

  ## Notes
  - Uses ON CONFLICT DO NOTHING to safely skip if rows already exist.
*/

INSERT INTO location_hero_images (slug, location_name) VALUES
  ('dentist-clayton-heights-surrey', 'Clayton Heights'),
  ('dentist-fleetwood-surrey', 'Fleetwood'),
  ('dentist-guildford-surrey', 'Guildford'),
  ('dentist-south-surrey', 'South Surrey'),
  ('dentist-panorama-ridge-surrey', 'Panorama Ridge'),
  ('dentist-newton-surrey', 'Newton'),
  ('dentist-ocean-park-surrey', 'Ocean Park'),
  ('dentist-ladner', 'Ladner'),
  ('dentist-tsawwassen', 'Tsawwassen'),
  ('dentist-pitt-meadows', 'Pitt Meadows')
ON CONFLICT (slug) DO NOTHING;
