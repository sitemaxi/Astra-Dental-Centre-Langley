/*
# Track email notification status for website form submissions

1. Modified Tables
- `appointment_requests` and `new_patient_forms` each gain:
  - `email_status` (text, not null, default 'pending') - one of pending, sending, sent, failed, not_sent
  - `email_error` (text, nullable) - short reason when sending failed
  - `email_sent_at` (timestamptz, nullable) - when the clinic email went out
2. Data
- All submissions that existed before this change are marked `not_sent`, because
  there is no record of their email notification having been delivered.
3. Security
- New SELECT policy so signed-in admins can read appointment requests (previously
  no SELECT policy existed, so the admin list was always empty).
- Website visitors (anon) and signed-in users can no longer INSERT values into the
  email_* columns or UPDATE any column on these tables. Only the server-side email
  function (service role) changes email status.
*/

DO $$
DECLARE
  t text;
  cols text;
BEGIN
  FOREACH t IN ARRAY ARRAY['appointment_requests', 'new_patient_forms'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = t AND column_name = 'email_status'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN email_status text NOT NULL DEFAULT ''pending''', t);
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN email_error text', t);
      EXECUTE format('ALTER TABLE public.%I ADD COLUMN email_sent_at timestamptz', t);
      EXECUTE format(
        'ALTER TABLE public.%I ADD CONSTRAINT %I CHECK (email_status IN (''pending'',''sending'',''sent'',''failed'',''not_sent''))',
        t, t || '_email_status_check'
      );
      EXECUTE format('UPDATE public.%I SET email_status = ''not_sent''', t);
    END IF;

    EXECUTE format('REVOKE INSERT, UPDATE ON public.%I FROM anon, authenticated', t);

    SELECT string_agg(quote_ident(column_name), ', ')
      INTO cols
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = t
        AND column_name NOT IN ('email_status', 'email_error', 'email_sent_at', 'created_at');

    EXECUTE format('GRANT INSERT (%s) ON public.%I TO anon, authenticated', cols, t);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "Authenticated admins can view appointment requests" ON public.appointment_requests;
CREATE POLICY "Authenticated admins can view appointment requests"
  ON public.appointment_requests FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
