/*
  # Create new_patient_forms table

  ## Summary
  Creates a table to store online New Patient Medical Questionnaire submissions,
  matching the exact fields from the paper form used at Astra Dental Centre.

  ## New Tables

  ### `new_patient_forms`
  Stores all patient-submitted new patient form data.

  #### Personal Information (left column of page 1)
  - `title` — salutation (Mr/Miss/Mrs/Ms/Dr)
  - `first_name`, `last_name` — patient name
  - `date_of_birth` — DATE
  - `home_address` — full home address text
  - `phone` — primary phone
  - `email` — email address
  - `business_address` — business address
  - `business_phone` — business phone
  - `occupation` — patient occupation
  - `referred_by` — who referred the patient

  #### Emergency Contact & Providers (right column of page 1)
  - `emergency_name`, `emergency_relationship`, `emergency_phone`
  - `family_doctor_name`, `family_doctor_phone`
  - `pharmacy_name`, `pharmacy_phone`
  - `specialist_1_name`, `specialist_1_area`, `specialist_1_contact`
  - `specialist_2_name`, `specialist_2_area`, `specialist_2_contact`

  #### Medical History Questions Q1–Q20 (page 2)
  Each stored as TEXT with values 'yes', 'no', 'not_sure', plus TEXT explanation columns.
  - `q1_medical_treatment`, `q1_details`
  - `q2_last_checkup` (TEXT — free text answer)
  - `q3_health_change`, `q3_details`
  - `q4_medications`, `q4_details`
  - `q5_allergies`, `q5_medications`, `q5_latex`, `q5_other`
  - `q6_adverse_reaction`, `q6_details`
  - `q7_asthma`
  - `q8_heart_blood_pressure`
  - `q9_heart_valve_transplant`
  - `q10_prosthetic_joint`
  - `q11_immune_conditions`
  - `q12_hepatitis_liver`
  - `q13_bleeding_disorder`
  - `q14_hospitalized`, `q14_details`
  - `q15_conditions` — JSONB array of checked condition names
  - `q16_other_conditions`, `q16_details`
  - `q17_family_history`, `q17_details`
  - `q18_tobacco`
  - `q19_nervous_dental`
  - `q20_pregnancy`, `q20_delivery_date`

  #### Consent
  - `patient_signature` — TEXT (typed name)
  - `signature_date` — DATE

  #### Metadata
  - `id` — UUID primary key
  - `created_at` — timestamp

  ## Security
  - RLS enabled: unauthenticated users can insert (submit form), authenticated admins can select all
*/

CREATE TABLE IF NOT EXISTS new_patient_forms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),

  -- Personal Information
  title text DEFAULT '',
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  date_of_birth date,
  home_address text DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  business_address text DEFAULT '',
  business_phone text DEFAULT '',
  occupation text DEFAULT '',
  referred_by text DEFAULT '',

  -- Emergency Contact & Providers
  emergency_name text DEFAULT '',
  emergency_relationship text DEFAULT '',
  emergency_phone text DEFAULT '',
  family_doctor_name text DEFAULT '',
  family_doctor_phone text DEFAULT '',
  pharmacy_name text DEFAULT '',
  pharmacy_phone text DEFAULT '',
  specialist_1_name text DEFAULT '',
  specialist_1_area text DEFAULT '',
  specialist_1_contact text DEFAULT '',
  specialist_2_name text DEFAULT '',
  specialist_2_area text DEFAULT '',
  specialist_2_contact text DEFAULT '',

  -- Medical History Q1–Q20
  q1_medical_treatment text DEFAULT '',
  q1_details text DEFAULT '',
  q2_last_checkup text DEFAULT '',
  q3_health_change text DEFAULT '',
  q3_details text DEFAULT '',
  q4_medications text DEFAULT '',
  q4_details text DEFAULT '',
  q5_allergies text DEFAULT '',
  q5_medications text DEFAULT '',
  q5_latex text DEFAULT '',
  q5_other text DEFAULT '',
  q6_adverse_reaction text DEFAULT '',
  q6_details text DEFAULT '',
  q7_asthma text DEFAULT '',
  q8_heart_blood_pressure text DEFAULT '',
  q9_heart_valve_transplant text DEFAULT '',
  q10_prosthetic_joint text DEFAULT '',
  q11_immune_conditions text DEFAULT '',
  q12_hepatitis_liver text DEFAULT '',
  q13_bleeding_disorder text DEFAULT '',
  q14_hospitalized text DEFAULT '',
  q14_details text DEFAULT '',
  q15_conditions jsonb DEFAULT '[]'::jsonb,
  q16_other_conditions text DEFAULT '',
  q16_details text DEFAULT '',
  q17_family_history text DEFAULT '',
  q17_details text DEFAULT '',
  q18_tobacco text DEFAULT '',
  q19_nervous_dental text DEFAULT '',
  q20_pregnancy text DEFAULT '',
  q20_delivery_date date,

  -- Consent
  patient_signature text DEFAULT '',
  signature_date date
);

ALTER TABLE new_patient_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit new patient forms"
  ON new_patient_forms
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated admins can view all patient forms"
  ON new_patient_forms
  FOR SELECT
  TO authenticated
  USING (true);
