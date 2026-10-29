/*
# Admin-only access, admin list, and sign-up allow-list

## Summary
Restricts every private area of the site to people on an explicit admin list,
and makes it impossible for anyone else to create an account.

## 1. New table: admin_users
- `user_id` (uuid, primary key, the signed-in account)
- `email` (text, for display)
- `role` (text, 'admin' or 'reception', default 'admin'; not used to restrict yet)
- `created_at` (timestamptz)
Signed-in users can only read their OWN row (so the admin area can check "am I an admin?").
Nobody can add, change or remove rows through the website; only database owners can.

## 2. New function: is_admin()
Returns true when the signed-in account is on the admin list. Used by every policy below.

## 3. Seed: seo@sitemaxi.com
Added to the admin list in this same migration. If that account does not exist,
the migration stops and nothing is applied, so the site can never be left without an admin.

## 4. Sign-up allow-list (triggers on auth.users)
- Before a new account is created: refused unless the email is
  seo@sitemaxi.com or reception@astradentalcentre.com.
- After an allowed account is created: it is added to the admin list automatically.

## 5. Access rules rewritten (4 policies per verb, no FOR ALL)
- appointment_requests, new_patient_forms: public may submit (with field limits);
  only admins can read. anon loses SELECT/DELETE grants.
- ai_prompt_settings: admins only (read/insert/update). anon loses all grants.
- blog_posts: public reads published posts; admins read/insert/update/delete everything.
- category_images, clinic_gallery_images, location_hero_images, media_library,
  service_before_after, service_images, site_images: public read stays as before;
  only admins can insert/update/delete. anon loses write grants.
- storage bucket blog-images: public read; only admins upload/update/delete.
  Images (jpg, jpeg, png, webp, gif, avif) anywhere; videos (mp4, mov, webm) only in videos/.
  Bucket limited to those file types and 200 MB per file (the services video needs it).

## Important notes
1. Old "any signed-in user" policies are dropped and replaced with admin checks.
2. Form field limits apply to NEW submissions only; existing rows are untouched.
3. No data is deleted or altered.
*/

-- 1. admin list
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'reception')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_users FROM anon, authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
GRANT SELECT ON public.admin_users TO service_role;

DROP POLICY IF EXISTS "Admins can read own admin row" ON public.admin_users;
CREATE POLICY "Admins can read own admin row" ON public.admin_users
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- 2. is_admin()
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid());
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- 3. seed seo@sitemaxi.com, and refuse to continue without an admin
INSERT INTO public.admin_users (user_id, email, role)
SELECT id, lower(email), 'admin' FROM auth.users WHERE lower(email) = 'seo@sitemaxi.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.admin_users (user_id, email, role)
SELECT id, lower(email), 'admin' FROM auth.users WHERE lower(email) = 'reception@astradentalcentre.com'
ON CONFLICT (user_id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'seo@sitemaxi.com') THEN
    RAISE EXCEPTION 'seo@sitemaxi.com account not found; refusing to enable admin-only rules';
  END IF;
END $$;

-- 4. sign-up allow-list
CREATE OR REPLACE FUNCTION public.enforce_admin_signup_allowlist()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF lower(coalesce(NEW.email, '')) NOT IN ('seo@sitemaxi.com', 'reception@astradentalcentre.com') THEN
    RAISE EXCEPTION 'Sign-ups are disabled';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.add_allowlisted_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.admin_users (user_id, email, role)
  VALUES (NEW.id, lower(NEW.email), 'admin')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.enforce_admin_signup_allowlist() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.add_allowlisted_admin() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS enforce_admin_signup_allowlist ON auth.users;
CREATE TRIGGER enforce_admin_signup_allowlist
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_signup_allowlist();

DROP TRIGGER IF EXISTS add_allowlisted_admin ON auth.users;
CREATE TRIGGER add_allowlisted_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.add_allowlisted_admin();

-- 5. drop every existing policy on the affected public tables
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN (
      'appointment_requests', 'new_patient_forms', 'ai_prompt_settings', 'blog_posts',
      'category_images', 'clinic_gallery_images', 'location_hero_images', 'media_library',
      'service_before_after', 'service_images', 'site_images')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- 5a. appointment_requests
REVOKE SELECT, DELETE ON public.appointment_requests FROM anon;

CREATE POLICY "Public can submit appointment requests" ON public.appointment_requests
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(first_name)) BETWEEN 1 AND 100 AND first_name !~ '[<>]'
    AND char_length(btrim(last_name)) BETWEEN 1 AND 100 AND last_name !~ '[<>]'
    AND char_length(email) <= 254 AND email ~* '^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$'
    AND phone ~ '^[0-9+().\- ]{7,25}$'
    AND char_length(coalesce(service, '')) <= 200 AND coalesce(service, '') !~ '[<>]'
    AND char_length(coalesce(preferred_time, '')) <= 50 AND coalesce(preferred_time, '') !~ '[<>]'
    AND char_length(coalesce(message, '')) <= 2000
    AND (preferred_date IS NULL OR preferred_date BETWEEN current_date - 1 AND current_date + 366)
  );

CREATE POLICY "Admins can view appointment requests" ON public.appointment_requests
  FOR SELECT TO authenticated USING (public.is_admin());

-- 5b. new_patient_forms
REVOKE SELECT, DELETE ON public.new_patient_forms FROM anon;

CREATE POLICY "Public can submit new patient forms" ON public.new_patient_forms
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(btrim(first_name)) BETWEEN 1 AND 100 AND first_name !~ '[<>]'
    AND char_length(btrim(last_name)) BETWEEN 1 AND 100 AND last_name !~ '[<>]'
    AND char_length(coalesce(title, '')) <= 20
    AND (coalesce(email, '') = '' OR (char_length(email) <= 254 AND email ~* '^[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+$'))
    AND (coalesce(phone, '') = '' OR phone ~ '^[0-9+().\- ]{7,25}$')
    AND (coalesce(business_phone, '') = '' OR business_phone ~ '^[0-9+().\- extEXT]{7,30}$')
    AND (coalesce(emergency_phone, '') = '' OR emergency_phone ~ '^[0-9+().\- ]{7,25}$')
    AND (date_of_birth IS NULL OR date_of_birth BETWEEN DATE '1900-01-01' AND current_date)
    AND (signature_date IS NULL OR signature_date BETWEEN current_date - 7 AND current_date + 1)
    AND (q20_delivery_date IS NULL OR q20_delivery_date BETWEEN current_date - 31 AND current_date + 366)
    AND char_length(coalesce(home_address, '')) <= 300
    AND char_length(coalesce(business_address, '')) <= 300
    AND char_length(coalesce(occupation, '')) <= 200
    AND char_length(coalesce(referred_by, '')) <= 200
    AND char_length(coalesce(emergency_name, '')) <= 200
    AND char_length(coalesce(emergency_relationship, '')) <= 100
    AND char_length(coalesce(family_doctor_name, '')) <= 200
    AND char_length(coalesce(family_doctor_phone, '')) <= 40
    AND char_length(coalesce(pharmacy_name, '')) <= 200
    AND char_length(coalesce(pharmacy_phone, '')) <= 40
    AND char_length(coalesce(specialist_1_name, '') || coalesce(specialist_1_area, '') || coalesce(specialist_1_contact, '')) <= 600
    AND char_length(coalesce(specialist_2_name, '') || coalesce(specialist_2_area, '') || coalesce(specialist_2_contact, '')) <= 600
    AND char_length(coalesce(q1_details, '')) <= 2000
    AND char_length(coalesce(q2_last_checkup, '')) <= 200
    AND char_length(coalesce(q3_details, '')) <= 2000
    AND char_length(coalesce(q4_details, '')) <= 2000
    AND char_length(coalesce(q5_medications, '') || coalesce(q5_latex, '') || coalesce(q5_other, '')) <= 3000
    AND char_length(coalesce(q6_details, '')) <= 2000
    AND char_length(coalesce(q14_details, '')) <= 2000
    AND char_length(coalesce(q16_details, '')) <= 2000
    AND char_length(coalesce(q17_details, '')) <= 2000
    AND (q15_conditions IS NULL OR pg_column_size(q15_conditions) <= 4000)
    AND char_length(coalesce(patient_signature, '')) <= 200
  );

CREATE POLICY "Admins can view patient forms" ON public.new_patient_forms
  FOR SELECT TO authenticated USING (public.is_admin());

-- 5c. ai_prompt_settings (admins only)
REVOKE ALL ON public.ai_prompt_settings FROM anon;
CREATE POLICY "Admins can read ai prompts" ON public.ai_prompt_settings
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert ai prompts" ON public.ai_prompt_settings
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update ai prompts" ON public.ai_prompt_settings
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 5d. blog_posts
REVOKE INSERT, UPDATE, DELETE ON public.blog_posts FROM anon;
CREATE POLICY "Public can read published blog posts" ON public.blog_posts
  FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admins can read all blog posts" ON public.blog_posts
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert blog posts" ON public.blog_posts
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update blog posts" ON public.blog_posts
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete blog posts" ON public.blog_posts
  FOR DELETE TO authenticated USING (public.is_admin());

-- 5e. public-read image/media tables: public read, admin write
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['category_images', 'location_hero_images', 'media_library',
                           'service_before_after', 'service_images', 'site_images']
  LOOP
    EXECUTE format('REVOKE INSERT, UPDATE, DELETE ON public.%I FROM anon', t);
    EXECUTE format('CREATE POLICY "Public can read %s" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t, t);
    EXECUTE format('CREATE POLICY "Admins can insert %s" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.is_admin())', t, t);
    EXECUTE format('CREATE POLICY "Admins can update %s" ON public.%I FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', t, t);
    EXECUTE format('CREATE POLICY "Admins can delete %s" ON public.%I FOR DELETE TO authenticated USING (public.is_admin())', t, t);
  END LOOP;
END $$;

-- 5f. clinic_gallery_images: public sees active only, admins see all
REVOKE INSERT, UPDATE, DELETE ON public.clinic_gallery_images FROM anon;
CREATE POLICY "Public can read active clinic gallery images" ON public.clinic_gallery_images
  FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can read all clinic gallery images" ON public.clinic_gallery_images
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert clinic gallery images" ON public.clinic_gallery_images
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update clinic gallery images" ON public.clinic_gallery_images
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete clinic gallery images" ON public.clinic_gallery_images
  FOR DELETE TO authenticated USING (public.is_admin());

-- 5g. storage: blog-images bucket
UPDATE storage.buckets
SET file_size_limit = 209715200,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
                               'video/mp4', 'video/quicktime', 'video/webm']
WHERE id = 'blog-images';

DROP POLICY IF EXISTS "Authenticated can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete blog images" ON storage.objects;

CREATE POLICY "Public can view blog images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'blog-images' AND name !~~ '%/');

CREATE POLICY "Admins can upload blog images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'blog-images' AND public.is_admin()
    AND (
      (name NOT LIKE 'videos/%' AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'))
      OR (name LIKE 'videos/%' AND lower(storage.extension(name)) IN ('mp4', 'mov', 'webm'))
    )
  );

CREATE POLICY "Admins can update blog images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin())
  WITH CHECK (
    bucket_id = 'blog-images' AND public.is_admin()
    AND (
      (name NOT LIKE 'videos/%' AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'))
      OR (name LIKE 'videos/%' AND lower(storage.extension(name)) IN ('mp4', 'mov', 'webm'))
    )
  );

CREATE POLICY "Admins can delete blog images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin());
