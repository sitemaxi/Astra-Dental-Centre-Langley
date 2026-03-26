import { supabase } from "./supabase";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  featured_image_alt: string | null;
  author_name: string;
  author_avatar: string | null;
  category: string | null;
  tags: string[];
  status: "draft" | "published" | "scheduled";
  published: boolean;
  published_at: string | null;
  schedule_for: string | null;
  read_time: number;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  workflow_status: "draft" | "review" | "approved" | "published";
  faq_section: { question: string; answer: string }[];
  internal_links: { anchorText: string; url: string }[];
  created_at: string;
  updated_at: string;
}

export type BlogPostInsert = Omit<BlogPost, "id" | "created_at" | "updated_at" | "views">;
export type BlogPostUpdate = Partial<BlogPostInsert>;

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as BlogPost | null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as BlogPost | null;
}

export async function createPost(data: BlogPostInsert): Promise<BlogPost> {
  const { data: post, error } = await supabase
    .from("blog_posts")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return post as BlogPost;
}

export async function updatePost(id: string, data: BlogPostUpdate): Promise<BlogPost> {
  const { data: post, error } = await supabase
    .from("blog_posts")
    .update(data)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return post as BlogPost;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

export async function incrementViews(id: string): Promise<void> {
  const { error } = await supabase.rpc("increment_post_views", { post_id: id });
  if (error) {
    await supabase.rpc("increment_post_views", { post_id: id }).throwOnError();
  }
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
