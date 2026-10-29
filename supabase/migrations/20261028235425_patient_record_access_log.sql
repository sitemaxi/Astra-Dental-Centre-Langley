/*
# Patient record access log + email rate-limit store

## 1. New table: patient_record_access_log (permanent, insert-only)
- `id` (uuid, primary key)
- `admin_user_id` (uuid, the admin who accessed the record; no foreign key so entries survive account removal)
- `admin_email` (text, copied at time of access)
- `record_type` ('appointment' or 'new_patient')
- `record_id` (uuid; no foreign key so entries survive record deletion)
- `subject_name` (text, patient name copied at time of access; no other patient details stored)
- `action` ('view', 'export' or 'resend')
- `created_at` (timestamptz)

Security:
- RLS on. Admins can read. There are NO insert/update/delete policies for any website role.
- Entries are written only by log_record_access() (view/export, called from the admin pages)
  and by the email service (resend).
- A trigger blocks UPDATE, DELETE and TRUNCATE for everyone, including the service role,
  so entries can never be altered or removed.

## 2. New function: log_record_access(record_type, record_id, action)
- SECURITY DEFINER, callable by signed-in users only, refuses non-admins.
- Takes the admin's identity from their sign-in, and the patient's name from the record itself.
- Only 'view' and 'export' are accepted here; 'resend' is logged server-side.

## 3. New table: email_send_attempts (rate limiting public email sends)
- `id` (bigint identity), `client_key` (text, hashed visitor address), `created_at`
- RLS on, no policies; only the email service (service role) can use it.

## Notes
1. No existing data is changed.
*/

CREATE TABLE IF NOT EXISTS public.patient_record_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  admin_email text NOT NULL DEFAULT '',
  record_type text NOT NULL CHECK (record_type IN ('appointment', 'new_patient')),
  record_id uuid NOT NULL,
  subject_name text NOT NULL DEFAULT '',
  action text NOT NULL CHECK (action IN ('view', 'export', 'resend')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS patient_record_access_log_created_at_idx
  ON public.patient_record_access_log (created_at DESC);
CREATE INDEX IF NOT EXISTS patient_record_access_log_admin_idx
  ON public.patient_record_access_log (admin_user_id, created_at DESC);

ALTER TABLE public.patient_record_access_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.patient_record_access_log FROM anon, authenticated;
GRANT SELECT ON public.patient_record_access_log TO authenticated;
GRANT SELECT, INSERT ON public.patient_record_access_log TO service_role;

DROP POLICY IF EXISTS "Admins can read access log" ON public.patient_record_access_log;
CREATE POLICY "Admins can read access log" ON public.patient_record_access_log
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.prevent_access_log_changes()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RAISE EXCEPTION 'Access log entries cannot be changed or removed';
END;
$$;
REVOKE EXECUTE ON FUNCTION public.prevent_access_log_changes() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS access_log_no_update_delete ON public.patient_record_access_log;
CREATE TRIGGER access_log_no_update_delete
  BEFORE UPDATE OR DELETE ON public.patient_record_access_log
  FOR EACH ROW EXECUTE FUNCTION public.prevent_access_log_changes();

DROP TRIGGER IF EXISTS access_log_no_truncate ON public.patient_record_access_log;
CREATE TRIGGER access_log_no_truncate
  BEFORE TRUNCATE ON public.patient_record_access_log
  FOR EACH STATEMENT EXECUTE FUNCTION public.prevent_access_log_changes();

CREATE OR REPLACE FUNCTION public.log_record_access(p_record_type text, p_record_id uuid, p_action text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_email text;
  v_name text;
BEGIN
  SELECT email INTO v_email FROM public.admin_users WHERE user_id = auth.uid();
  IF v_email IS NULL THEN
    RAISE EXCEPTION 'Not authorised' USING ERRCODE = '42501';
  END IF;

  IF p_action NOT IN ('view', 'export') THEN
    RAISE EXCEPTION 'Invalid action';
  END IF;

  IF p_record_type = 'appointment' THEN
    SELECT btrim(first_name || ' ' || last_name) INTO v_name
    FROM public.appointment_requests WHERE id = p_record_id;
  ELSIF p_record_type = 'new_patient' THEN
    SELECT btrim(first_name || ' ' || last_name) INTO v_name
    FROM public.new_patient_forms WHERE id = p_record_id;
  ELSE
    RAISE EXCEPTION 'Invalid record type';
  END IF;

  IF v_name IS NULL THEN
    RAISE EXCEPTION 'Record not found';
  END IF;

  INSERT INTO public.patient_record_access_log (admin_user_id, admin_email, record_type, record_id, subject_name, action)
  VALUES (auth.uid(), v_email, p_record_type, p_record_id, v_name, p_action);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.log_record_access(text, uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.log_record_access(text, uuid, text) TO authenticated;

CREATE TABLE IF NOT EXISTS public.email_send_attempts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  client_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_send_attempts_key_time_idx
  ON public.email_send_attempts (client_key, created_at DESC);

ALTER TABLE public.email_send_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.email_send_attempts FROM anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.email_send_attempts TO service_role;

GRANT SELECT ON public.appointment_requests, public.new_patient_forms TO service_role;
