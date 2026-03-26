import { supabase } from "./supabase";

export interface ServiceImage {
  id: string;
  service_slug: string;
  page_type: string;
  hero_image_url: string | null;
  hero_image_alt: string;
  updated_at: string;
}

export interface ServiceBeforeAfter {
  id: string;
  service_slug: string;
  label: string;
  before_image_url: string;
  after_image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getServiceImage(slug: string): Promise<ServiceImage | null> {
  const { data } = await supabase
    .from("service_images")
    .select("*")
    .eq("service_slug", slug)
    .maybeSingle();
  return data;
}

export async function getServiceBeforeAfters(slug: string): Promise<ServiceBeforeAfter[]> {
  const { data } = await supabase
    .from("service_before_after")
    .select("*")
    .eq("service_slug", slug)
    .order("sort_order", { ascending: true });
  return data || [];
}

export async function upsertServiceImage(
  slug: string,
  pageType: string,
  heroImageUrl: string,
  heroImageAlt: string
): Promise<void> {
  await supabase.from("service_images").upsert(
    { service_slug: slug, page_type: pageType, hero_image_url: heroImageUrl, hero_image_alt: heroImageAlt, updated_at: new Date().toISOString() },
    { onConflict: "service_slug" }
  );
}

export async function createBeforeAfter(
  slug: string,
  label: string,
  beforeUrl: string,
  afterUrl: string,
  sortOrder: number
): Promise<void> {
  await supabase.from("service_before_after").insert({
    service_slug: slug,
    label,
    before_image_url: beforeUrl,
    after_image_url: afterUrl,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  });
}

export async function updateBeforeAfter(
  id: string,
  label: string,
  beforeUrl: string,
  afterUrl: string,
  sortOrder: number
): Promise<void> {
  await supabase.from("service_before_after").update({
    label,
    before_image_url: beforeUrl,
    after_image_url: afterUrl,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
}

export async function deleteBeforeAfter(id: string): Promise<void> {
  await supabase.from("service_before_after").delete().eq("id", id);
}

export interface CategoryImage {
  id: string;
  category_slug: string;
  hero_image_url: string | null;
  mobile_image_url: string | null;
  hero_image_alt: string;
  updated_at: string;
}

export async function getCategoryImage(slug: string): Promise<CategoryImage | null> {
  const { data } = await supabase
    .from("category_images")
    .select("*")
    .eq("category_slug", slug)
    .maybeSingle();
  return data;
}

export async function getAllCategoryImages(): Promise<CategoryImage[]> {
  const { data } = await supabase.from("category_images").select("*");
  return data || [];
}

export async function upsertCategoryImage(
  slug: string,
  heroImageUrl: string,
  heroImageAlt: string,
  mobileImageUrl?: string | null
): Promise<void> {
  const payload: Record<string, unknown> = {
    category_slug: slug,
    hero_image_url: heroImageUrl,
    hero_image_alt: heroImageAlt,
    updated_at: new Date().toISOString(),
  };
  if (mobileImageUrl !== undefined) payload.mobile_image_url = mobileImageUrl;
  await supabase.from("category_images").upsert(payload, { onConflict: "category_slug" });
}

export interface SiteImageRow {
  id: string;
  key: string;
  label: string;
  image_url: string | null;
  updated_at: string;
}

export async function getSiteImagesByKeys(keys: string[]): Promise<SiteImageRow[]> {
  const { data } = await supabase
    .from("site_images")
    .select("*")
    .in("key", keys);
  return data || [];
}

export async function upsertSiteImageByKey(key: string, imageUrl: string | null): Promise<void> {
  await supabase
    .from("site_images")
    .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
    .eq("key", key);
}
