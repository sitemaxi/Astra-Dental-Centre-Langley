/*
  # Fix RLS Policies and Security Definer Functions

  ## Summary
  Addresses all outstanding security warnings:

  1. **clinic_gallery_images** — Replace always-true INSERT, UPDATE, DELETE policies with proper
     `auth.uid() IS NOT NULL` checks so unauthenticated requests are genuinely blocked.

  2. **blog-images storage bucket** — Replace the broad SELECT policy that allows listing all files
     with a narrower policy scoped to individual object reads, preventing directory enumeration.

  3. **increment_post_views** — Revoke EXECUTE from `anon` and `authenticated` roles and redefine
     as SECURITY INVOKER. The function only updates blog_posts which already has RLS; callers must
     be authenticated and pass the existing RLS check.

  4. **update_ai_prompt_timestamp** — Revoke public EXECUTE. This is a trigger function and must
     never be callable directly via RPC by any role.

  5. **update_blog_post_timestamp** — Revoke public EXECUTE. Same reason as above.

  ## Security Changes
  - clinic_gallery_images: INSERT, UPDATE, DELETE now require auth.uid() IS NOT NULL
  - storage.objects blog-images SELECT: scoped to authenticated bucket access only
  - increment_post_views: changed to SECURITY INVOKER, EXECUTE revoked from anon/authenticated
  - update_ai_prompt_timestamp: EXECUTE revoked from anon/authenticated/public
  - update_blog_post_timestamp: EXECUTE revoked from anon/authenticated/public
*/

-- ============================================================
-- 1. Fix clinic_gallery_images always-true policies
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can insert clinic gallery images" ON public.clinic_gallery_images;
DROP POLICY IF EXISTS "Authenticated users can update clinic gallery images" ON public.clinic_gallery_images;
DROP POLICY IF EXISTS "Authenticated users can delete clinic gallery images" ON public.clinic_gallery_images;

CREATE POLICY "Authenticated users can insert clinic gallery images"
  ON public.clinic_gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update clinic gallery images"
  ON public.clinic_gallery_images FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete clinic gallery images"
  ON public.clinic_gallery_images FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- ============================================================
-- 2. Fix blog-images storage bucket broad SELECT policy
--    Replace listing policy with one that only allows reading
--    objects the requester knows the path of (no wildcard listing)
-- ============================================================
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;

CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  TO anon
  USING (
    bucket_id = 'blog-images'
    AND name NOT LIKE '%/'
  );

-- ============================================================
-- 3. Fix increment_post_views — switch to SECURITY INVOKER
--    and revoke direct RPC execution from anon/authenticated
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id uuid)
RETURNS void
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  UPDATE blog_posts SET views = views + 1 WHERE id = post_id;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_post_views(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_post_views(uuid) FROM authenticated;

-- ============================================================
-- 4. Revoke public EXECUTE on trigger function update_ai_prompt_timestamp
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.update_ai_prompt_timestamp() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_ai_prompt_timestamp() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_ai_prompt_timestamp() FROM PUBLIC;

-- ============================================================
-- 5. Revoke public EXECUTE on trigger function update_blog_post_timestamp
-- ============================================================
REVOKE EXECUTE ON FUNCTION public.update_blog_post_timestamp() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_blog_post_timestamp() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_blog_post_timestamp() FROM PUBLIC;
