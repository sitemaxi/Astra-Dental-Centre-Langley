/*
# Let admins see the admin list

1. Modified Tables
- `admin_users`: adds a read policy so a signed-in admin can see every admin row
  (used to populate the "filter by admin" menu on the Access log page).

2. Security
- Read-only; only callers for whom `public.is_admin()` is true.
- No insert/update/delete policies are added; the admin list still cannot be changed from the app.
*/

DROP POLICY IF EXISTS "Admins can read admin list" ON public.admin_users;
CREATE POLICY "Admins can read admin list"
ON public.admin_users FOR SELECT
TO authenticated
USING (public.is_admin());
