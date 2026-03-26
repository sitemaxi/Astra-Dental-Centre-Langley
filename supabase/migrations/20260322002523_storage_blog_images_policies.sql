/*
  # Storage Policies for blog-images bucket

  Allows authenticated users to upload, update, and delete images.
  Allows public (anon) users to read/view images.
*/

CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated can update blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated can delete blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');
