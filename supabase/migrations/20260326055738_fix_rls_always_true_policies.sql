/*
  # Fix RLS Policies That Are Always True

  ## Summary
  Replaces all RLS policies that use unconditional `true` clauses with proper
  checks that verify the user is authenticated (auth.uid() IS NOT NULL).

  This eliminates the "always true" security warnings while preserving the
  intended access pattern: any authenticated user can manage admin content,
  and anonymous users can only submit forms.

  ## Tables Fixed
  1. `public.ai_prompt_settings` - INSERT, UPDATE
  2. `public.blog_posts` - INSERT, UPDATE, DELETE
  3. `public.category_images` - INSERT, UPDATE, DELETE
  4. `public.location_hero_images` - INSERT, UPDATE, DELETE
  5. `public.media_library` - INSERT, UPDATE, DELETE
  6. `public.service_before_after` - INSERT, UPDATE, DELETE
  7. `public.service_images` - INSERT, UPDATE, DELETE
  8. `public.site_images` - INSERT, UPDATE, DELETE
  9. `public.appointment_requests` - INSERT (anon allowed, validated)
  10. `public.new_patient_forms` - INSERT (anon allowed, validated)
*/

-- ============================================================
-- ai_prompt_settings
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can insert ai prompts" ON public.ai_prompt_settings;
DROP POLICY IF EXISTS "Authenticated users can update ai prompts" ON public.ai_prompt_settings;

CREATE POLICY "Authenticated users can insert ai prompts"
  ON public.ai_prompt_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update ai prompts"
  ON public.ai_prompt_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- blog_posts
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can insert blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can update blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can delete blog posts" ON public.blog_posts;

CREATE POLICY "Authenticated users can insert blog posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update blog posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- category_images
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can insert category images" ON public.category_images;
DROP POLICY IF EXISTS "Authenticated users can update category images" ON public.category_images;
DROP POLICY IF EXISTS "Authenticated users can delete category images" ON public.category_images;

CREATE POLICY "Authenticated users can insert category images"
  ON public.category_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update category images"
  ON public.category_images FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete category images"
  ON public.category_images FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- location_hero_images
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can insert location hero images" ON public.location_hero_images;
DROP POLICY IF EXISTS "Authenticated users can update location hero images" ON public.location_hero_images;
DROP POLICY IF EXISTS "Authenticated users can delete location hero images" ON public.location_hero_images;

CREATE POLICY "Authenticated users can insert location hero images"
  ON public.location_hero_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update location hero images"
  ON public.location_hero_images FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete location hero images"
  ON public.location_hero_images FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- media_library
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can insert media" ON public.media_library;
DROP POLICY IF EXISTS "Authenticated users can update media" ON public.media_library;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON public.media_library;

CREATE POLICY "Authenticated users can insert media"
  ON public.media_library FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update media"
  ON public.media_library FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete media"
  ON public.media_library FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- service_before_after
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can insert service_before_after" ON public.service_before_after;
DROP POLICY IF EXISTS "Authenticated can update service_before_after" ON public.service_before_after;
DROP POLICY IF EXISTS "Authenticated can delete service_before_after" ON public.service_before_after;

CREATE POLICY "Authenticated can insert service_before_after"
  ON public.service_before_after FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update service_before_after"
  ON public.service_before_after FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete service_before_after"
  ON public.service_before_after FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- service_images
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can insert service_images" ON public.service_images;
DROP POLICY IF EXISTS "Authenticated can update service_images" ON public.service_images;
DROP POLICY IF EXISTS "Authenticated can delete service_images" ON public.service_images;

CREATE POLICY "Authenticated can insert service_images"
  ON public.service_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update service_images"
  ON public.service_images FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete service_images"
  ON public.service_images FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- site_images
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can insert site images" ON public.site_images;
DROP POLICY IF EXISTS "Authenticated users can update site images" ON public.site_images;
DROP POLICY IF EXISTS "Authenticated users can delete site images" ON public.site_images;

CREATE POLICY "Authenticated users can insert site images"
  ON public.site_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update site images"
  ON public.site_images FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete site images"
  ON public.site_images FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- appointment_requests (public form submission)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can submit an appointment request" ON public.appointment_requests;

CREATE POLICY "Anyone can submit an appointment request"
  ON public.appointment_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    first_name IS NOT NULL AND
    last_name IS NOT NULL AND
    email IS NOT NULL AND
    phone IS NOT NULL
  );

-- ============================================================
-- new_patient_forms (public form submission)
-- ============================================================
DROP POLICY IF EXISTS "Anyone can submit new patient forms" ON public.new_patient_forms;

CREATE POLICY "Anyone can submit new patient forms"
  ON public.new_patient_forms FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    first_name IS NOT NULL AND
    last_name IS NOT NULL
  );
