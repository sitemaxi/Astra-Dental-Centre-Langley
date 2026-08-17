import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  topic: string;
  internalLinks?: Array<{ anchorText: string; url: string }>;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogMetadata {
  title: string;
  slug: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  category: string;
  tags: string[];
  read_time: number;
  author_name: string;
  faq_section: FAQItem[];
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
    const openaiKey = Deno.env.get("OPENAI_API_KEY");
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");

    const missingKeys: string[] = [];
    if (!openaiKey) missingKeys.push("OPENAI_API_KEY");
    if (!googleApiKey) missingKeys.push("GOOGLE_API_KEY");

    if (missingKeys.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Missing API keys: ${missingKeys.join(", ")}. Please add them in the AI Settings.`,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: GenerateRequest = await req.json();
    const { topic, internalLinks = [] } = body;

    if (!topic?.trim()) {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: promptSettings } = await supabase
      .from("ai_prompt_settings")
      .select("key, prompt")
      .in("key", ["blog_content", "blog_metadata", "image_generation"]);

    const promptMap: Record<string, string> = {};
    for (const p of (promptSettings ?? [])) {
      promptMap[p.key] = p.prompt;
    }

    const internalLinksText = internalLinks.length > 0
      ? internalLinks.map((l) => `- ${l.anchorText}: ${l.url}`).join("\n")
      : "- Our Services: /langley-dental-services/\n- Book Appointment: /contact-us/\n- About Us: /about-the-dentist/";

    const contentPrompt = (promptMap["blog_content"] || "Write a professional dental blog post about: {{topic}}")
      .replace("{{internal_links}}", internalLinksText)
      .replace("{{topic}}", topic);

    const metadataPrompt = (promptMap["blog_metadata"] || "Generate blog metadata JSON for: {{topic}}")
      .replace("{{topic}}", topic);

    const imagePromptTemplate = (promptMap["image_generation"] || "Professional dental photography about: {{topic}}")
      .replace("{{topic}}", topic);

    const [metadataRes, contentRes] = await Promise.all([
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: metadataPrompt },
            { role: "user", content: `Topic/Keyword: ${topic}` },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" },
        }),
      }),
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${openaiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: contentPrompt },
            { role: "user", content: `Write a comprehensive blog post about: ${topic}` },
          ],
          temperature: 0.7,
          max_tokens: 3000,
        }),
      }),
    ]);

    if (!metadataRes.ok || !contentRes.ok) {
      const errText = await (metadataRes.ok ? contentRes : metadataRes).text();
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errText}` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const [metadataJson, contentJson] = await Promise.all([
      metadataRes.json(),
      contentRes.json(),
    ]);

    let metadata: BlogMetadata;
    try {
      metadata = JSON.parse(metadataJson.choices[0].message.content);
    } catch {
      return new Response(
        JSON.stringify({ error: "Failed to parse metadata from AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const content: string = contentJson.choices[0].message.content;

    let imageUrl: string | null = null;
    try {
      const b64Image = await generateImageWithImagen(imagePromptTemplate, googleApiKey!);

      if (b64Image) {
        const binaryStr = atob(b64Image);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const fileName = `ai-generated-${Date.now()}.png`;
        const { data: uploadData } = await supabase.storage
          .from("blog-images")
          .upload(fileName, bytes, { contentType: "image/png", upsert: false });

        if (uploadData) {
          const { data: publicUrl } = supabase.storage
            .from("blog-images")
            .getPublicUrl(fileName);
          imageUrl = publicUrl.publicUrl;

          await supabase.from("media_library").insert({
            filename: fileName,
            url: imageUrl,
            alt_text: `AI generated image for: ${topic}`,
            caption: `Generated for blog post: ${metadata.title}`,
            mime_type: "image/png",
          });
        }
      }
    } catch (imgErr) {
      console.error("Image generation failed:", imgErr);
    }

    return new Response(
      JSON.stringify({
        title: metadata.title,
        slug: metadata.slug,
        excerpt: metadata.excerpt,
        content,
        meta_title: metadata.meta_title,
        meta_description: metadata.meta_description,
        og_title: metadata.og_title,
        og_description: metadata.og_description,
        category: metadata.category,
        tags: metadata.tags,
        read_time: metadata.read_time,
        author_name: metadata.author_name,
        faq_section: metadata.faq_section,
        featured_image: imageUrl,
        featured_image_alt: `${metadata.title} - Astra Dental Centre Langley`,
        og_image: imageUrl,
        internal_links: internalLinks,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
