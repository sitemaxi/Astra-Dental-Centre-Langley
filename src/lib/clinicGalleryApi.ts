import { supabase } from "./supabase";

export interface ClinicGalleryImage {
  id: string;
  image_url: string;
  alt_text: string;
  caption: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getActiveGalleryImages(): Promise<ClinicGalleryImage[]> {
  const { data } = await supabase
    .from("clinic_gallery_images")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data || [];
}

export async function getAllGalleryImages(): Promise<ClinicGalleryImage[]> {
  const { data } = await supabase
    .from("clinic_gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });
  return data || [];
}

export async function insertGalleryImage(
  imageUrl: string,
  altText: string,
  caption: string | null,
  sortOrder: number
): Promise<void> {
  await supabase.from("clinic_gallery_images").insert({
    image_url: imageUrl,
    alt_text: altText,
    caption,
    sort_order: sortOrder,
    is_active: true,
    updated_at: new Date().toISOString(),
  });
}

export async function updateGalleryImage(
  id: string,
  fields: Partial<Pick<ClinicGalleryImage, "image_url" | "alt_text" | "caption" | "sort_order" | "is_active">>
): Promise<void> {
  await supabase
    .from("clinic_gallery_images")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id);
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await supabase.from("clinic_gallery_images").delete().eq("id", id);
}
