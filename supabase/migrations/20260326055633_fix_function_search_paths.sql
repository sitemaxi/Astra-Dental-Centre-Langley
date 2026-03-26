/*
  # Fix Mutable Search Paths on Functions

  ## Summary
  Sets a fixed search_path on three functions that currently have a mutable
  search_path, which is a security risk. A mutable search_path allows an
  attacker to inject malicious objects into the search path.

  ## Changes
  - `public.update_ai_prompt_timestamp` - set search_path = ''
  - `public.increment_post_views` - set search_path = ''
  - `public.update_blog_post_timestamp` - set search_path = ''

  Setting search_path = '' and using fully-qualified names (public.tablename)
  eliminates the attack surface.
*/

CREATE OR REPLACE FUNCTION public.update_ai_prompt_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.blog_posts
  SET views = views + 1
  WHERE id = post_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_blog_post_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
