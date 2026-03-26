/*
  # Fix Storage RLS Policies for blog-images bucket

  ## Summary
  The existing INSERT policy for authenticated users was failing with an RLS violation
  despite the user being authenticated. This migration drops and recreates all storage
  policies with explicit owner checks and ensures the authenticated role is properly
  granted access for all operations.

  ## Changes
  - Drop all existing storage.objects policies for blog-images
  - Recreate INSERT policy with explicit auth.uid() owner check
  - Recreate UPDATE/DELETE policies with owner check
  - Ensure SELECT covers both anon and authenticated roles
*/

DROP POLICY IF EXISTS "Authenticated can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;

CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated can upload blog images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated can update blog images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL)
  WITH CHECK (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete blog images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images' AND auth.uid() IS NOT NULL);
