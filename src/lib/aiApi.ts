import { supabase } from "./supabase";

export interface AIGeneratedBlog {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  category: string;
  tags: string[];
  read_time: number;
  author_name: string;
  faq_section: Array<{ question: string; answer: string }>;
  featured_image: string | null;
  featured_image_alt: string;
  og_image: string | null;
  internal_links: Array<{ anchorText: string; url: string }>;
}

export interface AIPromptSetting {
  id: string;
  key: string;
  name: string;
  prompt: string;
  description: string;
  updated_at: string;
}

export async function generateBlogPost(
  topic: string,
  internalLinks: Array<{ anchorText: string; url: string }> = []
): Promise<AIGeneratedBlog> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  const res = await fetch(`${supabaseUrl}/functions/v1/generate-blog-post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ topic, internalLinks }),
  });

  let data: Record<string, unknown>;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Server error (${res.status}): ${await res.text()}`);
  }

  if (!res.ok) throw new Error((data.error as string) ?? `AI generation failed (${res.status})`);
  return data as unknown as AIGeneratedBlog;
}

export async function getPromptSettings(): Promise<AIPromptSetting[]> {
  const { data, error } = await supabase
    .from("ai_prompt_settings")
    .select("*")
    .order("key");
  if (error) throw error;
  return data ?? [];
}

export async function updatePromptSetting(
  key: string,
  prompt: string
): Promise<void> {
  const { error } = await supabase
    .from("ai_prompt_settings")
    .update({ prompt })
    .eq("key", key);
  if (error) throw error;
}
