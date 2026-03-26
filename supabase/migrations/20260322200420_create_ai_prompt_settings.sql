/*
  # Create AI Prompt Settings Table

  ## Summary
  Stores customizable AI prompts for blog content and image generation.
  Admins can edit these prompts from the admin panel to control AI output style.

  ## Tables
  - `ai_prompt_settings`
    - `id` (uuid, primary key)
    - `key` (text, unique) - identifier for the prompt (e.g., 'blog_content', 'image_generation')
    - `name` (text) - human-readable label
    - `prompt` (text) - the actual prompt template
    - `description` (text) - explains what the prompt does
    - `updated_at` (timestamptz)
    - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - Authenticated users can read and update prompts
  - No anonymous access
*/

CREATE TABLE IF NOT EXISTS ai_prompt_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  prompt text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_prompt_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read ai prompts"
  ON ai_prompt_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update ai prompts"
  ON ai_prompt_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert ai prompts"
  ON ai_prompt_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_ai_prompt_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ai_prompt_settings_updated_at
  BEFORE UPDATE ON ai_prompt_settings
  FOR EACH ROW EXECUTE FUNCTION update_ai_prompt_timestamp();

INSERT INTO ai_prompt_settings (key, name, description, prompt) VALUES
(
  'blog_content',
  'Blog Content Generation',
  'Controls how the AI writes the full blog post content, structure, and tone.',
  'You are an expert dental content writer for Astra Dental Centre in Langley, BC. Write a comprehensive, SEO-optimized blog post based on the given topic.

REQUIREMENTS:
- Write in a professional yet approachable tone
- Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em> tags
- Include a compelling introduction that hooks readers
- Structure content with clear headings and subheadings
- Write at least 800-1200 words
- Include practical tips and patient-friendly explanations
- Naturally mention Astra Dental Centre where relevant
- Add a strong call-to-action at the end encouraging readers to book an appointment
- Focus on the Langley, BC area and local patients
- Avoid keyword stuffing; write naturally
- Include transition sentences between sections

INTERNAL LINKS TO WEAVE IN NATURALLY (use as <a href="URL">anchor text</a> in content):
{{internal_links}}

Return ONLY the HTML content, no markdown, no code blocks.'
),
(
  'blog_metadata',
  'Blog Metadata & SEO Generation',
  'Controls how the AI generates titles, slugs, excerpts, tags, and SEO fields.',
  'You are an SEO expert for a dental clinic in Langley, BC called Astra Dental Centre.

Given the topic/keyword, generate complete blog post metadata as a valid JSON object.

Return ONLY valid JSON with these exact fields:
{
  "title": "Compelling SEO-optimized blog post title (50-60 chars)",
  "slug": "url-friendly-slug-using-hyphens",
  "excerpt": "Engaging 150-160 character excerpt that includes the keyword naturally",
  "meta_title": "SEO meta title under 60 characters including keyword",
  "meta_description": "Meta description 140-160 chars with keyword and CTA",
  "og_title": "Social sharing title (can be more engaging/clickable)",
  "og_description": "Social sharing description 100-150 chars",
  "category": "Most relevant dental category",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "read_time": 6,
  "author_name": "Astra Dental Centre",
  "faq_section": [
    {"question": "Relevant FAQ question 1?", "answer": "Detailed answer 1"},
    {"question": "Relevant FAQ question 2?", "answer": "Detailed answer 2"},
    {"question": "Relevant FAQ question 3?", "answer": "Detailed answer 3"},
    {"question": "Relevant FAQ question 4?", "answer": "Detailed answer 4"},
    {"question": "Relevant FAQ question 5?", "answer": "Detailed answer 5"}
  ]
}

Make all content specific to dental health and Astra Dental Centre in Langley, BC.'
),
(
  'image_generation',
  'Featured Image Generation',
  'Controls the DALL-E prompt style for generating blog featured images.',
  'Professional dental photography style, clean and modern dental clinic aesthetic, bright and welcoming atmosphere, high quality, photorealistic, suitable for a dental blog post about: {{topic}}. No text overlays, no watermarks. Style: professional healthcare photography, soft natural lighting, Langley BC Canada dental clinic setting.'
)
ON CONFLICT (key) DO NOTHING;
