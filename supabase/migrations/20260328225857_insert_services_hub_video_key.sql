/*
  # Insert services hub video key into site_images

  1. Changes
    - Inserts a new row into site_images with key 'services-hub-video'
    - This key is used by the admin panel to store a video URL for the Services Hub page
    - The video displays above the "Dental Care for Every Stage of Life" section
    - image_url is nullable; when null no video player is shown
*/

INSERT INTO site_images (key, label, image_url, updated_at)
VALUES ('services-hub-video', 'Services Hub — Feature Video', NULL, now())
ON CONFLICT (key) DO NOTHING;
