/*
  # Create appointment_requests table

  1. New Tables
    - `appointment_requests`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `service` (text)
      - `preferred_date` (date) — patient's preferred appointment date
      - `preferred_time` (text) — patient's preferred time slot
      - `message` (text, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `appointment_requests` table
    - Allow anonymous inserts (public form submission)
    - No SELECT policy for public — only service role can read

  3. Notes
    - This table stores appointment request submissions from the website contact form
    - These are NOT confirmed bookings — they are requests pending staff review
*/

CREATE TABLE IF NOT EXISTS appointment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL DEFAULT '',
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an appointment request"
  ON appointment_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
