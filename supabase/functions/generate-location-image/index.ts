import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateLocationImageRequest {
  slug: string;
  prompt: string;
}

async function generateImageWithImagen(
  prompt: string,
  googleApiKey: string
): Promise<string | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "x-goog-api-key": googleApiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "16:9",
        personGeneration: "dont_allow",
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Imagen API error:", errText);
    return null;
  }

  const data = await res.json();
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) return null;
  return b64;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");

    if (!googleApiKey) {
      return new Response(
        JSON.stringify({ error: "Google API key not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: GenerateLocationImageRequest = await req.json();
    const { slug, prompt } = body;

    if (!slug || !prompt) {
      return new Response(
        JSON.stringify({ error: "slug and prompt are required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const b64 = await generateImageWithImagen(prompt, googleApiKey);
    if (!b64) {
      return new Response(
        JSON.stringify({ error: "Image generation failed — no image returned." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const fileName = `location-heroes/${slug}-${Date.now()}.jpg`;
    const imageBytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, imageBytes, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload generated image." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: urlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from("location_hero_images")
      .update({ image_url: imageUrl, image_prompt: prompt, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    if (dbError) {
      console.error("DB update error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to save image URL to database." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, image_url: imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Unhandled error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
