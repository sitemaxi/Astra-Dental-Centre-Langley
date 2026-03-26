import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Sparkles, Loader2, AlertCircle, CheckCircle2,
  Image as ImageIcon, RefreshCw, Upload, Trash2, Home,
} from "lucide-react";
import { supabase } from "../lib/supabase";

interface LocationHeroImage {
  id: string;
  slug: string;
  location_name: string;
  image_url: string | null;
  featured_image_url: string | null;
  image_prompt: string | null;
  updated_at: string;
}

interface SiteImage {
  id: string;
  key: string;
  label: string;
  image_url: string | null;
  updated_at: string;
}

const DEFAULT_PROMPTS: Record<string, string> = {
  "dentist-langley": "Professional modern dental clinic exterior in Langley BC Canada, suburban commercial strip, clear blue sky, Fraser Valley landscape, photorealistic, no text, no watermarks",
  "dentist-willowbrook-langley": "Modern dental office near Willowbrook Shopping Centre Langley BC, sunny suburban setting, professional healthcare building, photorealistic, no text, no watermarks",
  "dentist-walnut-grove-langley": "Family-friendly neighbourhood in Walnut Grove Langley BC Canada, tree-lined residential street, warm golden hour light, photorealistic, no text, no watermarks",
  "dentist-brookswood-langley": "South Langley Brookswood neighbourhood BC Canada, quiet tree-lined suburban street, established community feel, warm natural lighting, photorealistic, no text, no watermarks",
  "dentist-murrayville-langley": "Historic Murrayville Langley BC Canada, charming small-town main street, heritage buildings with modern touches, warm afternoon light, photorealistic, no text, no watermarks",
  "dentist-cloverdale-surrey": "Cloverdale Surrey BC Canada town centre, heritage buildings on a sunny street, Fraser Valley skyline, photorealistic, no text, no watermarks",
  "dentist-white-rock": "White Rock BC Canada oceanfront promenade, Pacific ocean view, sunny day, blue sky and sea, coastal British Columbia, photorealistic, no text, no watermarks",
  "dentist-north-delta": "North Delta BC Canada suburban neighbourhood, green parks and residential streets, Fraser River valley landscape in background, photorealistic, no text, no watermarks",
};

function ImageUploadButton({
  onUpload,
  uploading,
  label = "Upload Image",
}: {
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
        {uploading ? "Uploading..." : label}
      </button>
    </>
  );
}

export default function AdminLocationsPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<LocationHeroImage[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, [navigate]);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    const [{ data: locData, error: locErr }, { data: siteData, error: siteErr }] = await Promise.all([
      supabase.from("location_hero_images").select("*").order("location_name"),
      supabase.from("site_images").select("*").order("label"),
    ]);

    if (locErr || siteErr) {
      setError("Failed to load image data.");
    } else {
      const rows = (locData ?? []) as LocationHeroImage[];
      setLocations(rows);
      setSiteImages((siteData ?? []) as SiteImage[]);
      const initial: Record<string, string> = {};
      for (const row of rows) {
        initial[row.slug] = row.image_prompt ?? DEFAULT_PROMPTS[row.slug] ?? "";
      }
      setPrompts(initial);
    }
    setLoading(false);
  }

  async function uploadFile(file: File, path: string): Promise<string | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setError("Not authenticated. Please log in again.");
      return null;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const res = await fetch(
      `${supabaseUrl}/storage/v1/object/blog-images/${path}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: file,
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Upload error:", res.status, errText);
      setError(`Upload failed (${res.status}): ${errText}`);
      return null;
    }

    return `${supabaseUrl}/storage/v1/object/public/blog-images/${path}`;
  }

  async function handleFeaturedUpload(slug: string, file: File) {
    setUploading(slug);
    setError("");
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `location-heroes/${slug}-featured-${Date.now()}.${ext}`;
    const url = await uploadFile(file, path);
    if (!url) {
      setUploading(null);
      return;
    }

    const { error: dbErr } = await supabase
      .from("location_hero_images")
      .update({ featured_image_url: url, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    if (dbErr) {
      setError(`Failed to save image URL: ${dbErr.message}`);
    } else {
      await loadAll();
      setSuccessSlug(slug);
      setTimeout(() => setSuccessSlug(null), 4000);
    }
    setUploading(null);
  }

  async function handleSiteImageUpload(key: string, file: File) {
    setUploading(`site-${key}`);
    setError("");
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `site/${key}-${Date.now()}.${ext}`;
    const url = await uploadFile(file, path);
    if (!url) {
      setUploading(null);
      return;
    }

    const { error: dbErr } = await supabase
      .from("site_images")
      .update({ image_url: url, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (dbErr) {
      setError(`Failed to save image URL: ${dbErr.message}`);
    } else {
      await loadAll();
      setSuccessSlug(`site-${key}`);
      setTimeout(() => setSuccessSlug(null), 4000);
    }
    setUploading(null);
  }

  async function handleRemoveSiteImage(key: string) {
    setRemoving(`site-${key}`);
    setError("");
    const { error: err } = await supabase
      .from("site_images")
      .update({ image_url: null, updated_at: new Date().toISOString() })
      .eq("key", key);
    if (err) setError("Failed to remove image.");
    else await loadAll();
    setRemoving(null);
  }

  async function handleGenerate(slug: string) {
    setGenerating(slug);
    setError("");
    setSuccessSlug(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY;
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

      const res = await fetch(`${supabaseUrl}/functions/v1/generate-location-image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ slug, prompt: prompts[slug] ?? "" }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generation failed");

      await loadAll();
      setSuccessSlug(slug);
      setTimeout(() => setSuccessSlug(null), 4000);
    } catch (err: unknown) {
      setError(`Failed to generate image for ${slug}: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setGenerating(null);
    }
  }

  async function handleRemove(slug: string) {
    setRemoving(slug);
    setError("");
    const { error: err } = await supabase
      .from("location_hero_images")
      .update({ image_url: null, featured_image_url: null, image_prompt: null, updated_at: new Date().toISOString() })
      .eq("slug", slug);
    if (err) {
      setError("Failed to remove image.");
    } else {
      await loadAll();
    }
    setRemoving(null);
  }

  async function handleRemoveFeatured(slug: string) {
    setRemoving(`feat-${slug}`);
    setError("");
    const { error: err } = await supabase
      .from("location_hero_images")
      .update({ featured_image_url: null, updated_at: new Date().toISOString() })
      .eq("slug", slug);
    if (err) setError("Failed to remove featured image.");
    else await loadAll();
    setRemoving(null);
  }

  const activeImage = (loc: LocationHeroImage) => loc.featured_image_url ?? loc.image_url;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link to="/admin/blog" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={17} className="text-gray-500" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-teal-50 rounded-lg">
              <MapPin size={15} className="text-teal-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Location & Site Images</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-teal-500" />
          </div>
        ) : (
          <>
            {/* Site-wide images */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Home size={15} className="text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-700">Site-Wide Images</h2>
              </div>
              <p className="text-xs text-gray-400">
                These images are used across the main website pages.
              </p>

              {siteImages.map((si) => {
                const isUploadingSite = uploading === `site-${si.key}`;
                const isRemovingSite = removing === `site-${si.key}`;
                const isSuccessSite = successSlug === `site-${si.key}`;

                return (
                  <div key={si.key} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="flex items-start gap-5 p-6">
                      <div className="flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                        {si.image_url ? (
                          <img src={si.image_url} alt={si.label} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                            <ImageIcon size={22} className="text-gray-300" />
                            <span className="text-xs text-gray-400">No image</span>
                          </div>
                        )}
                        {isUploadingSite && (
                          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-teal-600" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-base">{si.label}</h3>
                          <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">{si.key}</span>
                          {isSuccessSite && (
                            <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center gap-1">
                              <CheckCircle2 size={11} /> Saved
                            </span>
                          )}
                          {si.image_url && !isSuccessSite && (
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full flex items-center gap-1">
                              <ImageIcon size={11} /> Has image
                            </span>
                          )}
                        </div>

                        {si.updated_at && si.image_url && (
                          <p className="text-xs text-gray-400 mb-3">
                            Last updated: {new Date(si.updated_at).toLocaleDateString("en-CA", { dateStyle: "medium" })}
                          </p>
                        )}

                        <div className="flex items-center gap-2 flex-wrap mt-3">
                          <ImageUploadButton
                            onUpload={(file) => handleSiteImageUpload(si.key, file)}
                            uploading={isUploadingSite}
                            label={si.image_url ? "Replace Image" : "Upload Image"}
                          />
                          {si.image_url && (
                            <button
                              onClick={() => handleRemoveSiteImage(si.key)}
                              disabled={isRemovingSite}
                              className="flex items-center gap-1.5 px-3 py-2 border border-red-100 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {isRemovingSite ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Location hero images */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-teal-50 rounded-lg">
                  <MapPin size={15} className="text-teal-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-700">Location Hero Images</h2>
              </div>

              <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 flex gap-3">
                <Sparkles size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-teal-800">AI-Generated or Manually Uploaded</p>
                  <p className="text-sm text-teal-700">
                    Upload your own photo or generate one with Google Imagen AI. Uploaded images take priority over AI-generated ones.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {locations.map((loc) => {
                  const isGenerating = generating === loc.slug;
                  const isRemoving = removing === loc.slug;
                  const isRemovingFeat = removing === `feat-${loc.slug}`;
                  const isUploadingFeat = uploading === loc.slug;
                  const isSuccess = successSlug === loc.slug;
                  const displayImage = activeImage(loc);

                  return (
                    <div key={loc.slug} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="flex items-start gap-5 p-6">

                        {/* Preview thumbnail */}
                        <div className="flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={`Hero for ${loc.location_name}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                              <ImageIcon size={22} className="text-gray-300" />
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                          {(isGenerating || isUploadingFeat) && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                              <Loader2 size={20} className="animate-spin text-teal-600" />
                            </div>
                          )}
                          {loc.featured_image_url && (
                            <div className="absolute bottom-1 left-1">
                              <span className="text-[9px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">CUSTOM</span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-base">{loc.location_name}</h3>
                            <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">/{loc.slug}/</span>
                            {isSuccess && (
                              <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={11} /> Saved
                              </span>
                            )}
                            {loc.featured_image_url && !isSuccess && (
                              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-full flex items-center gap-1">
                                <Upload size={11} /> Custom upload
                              </span>
                            )}
                            {!loc.featured_image_url && loc.image_url && !isSuccess && (
                              <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-600 border border-teal-200 rounded-full flex items-center gap-1">
                                <Sparkles size={11} /> AI generated
                              </span>
                            )}
                          </div>

                          {loc.updated_at && displayImage && (
                            <p className="text-xs text-gray-400 mb-3">
                              Last updated: {new Date(loc.updated_at).toLocaleDateString("en-CA", { dateStyle: "medium" })}
                            </p>
                          )}

                          {/* Upload section */}
                          <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Custom Upload</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <ImageUploadButton
                                onUpload={(file) => handleFeaturedUpload(loc.slug, file)}
                                uploading={isUploadingFeat}
                                label={loc.featured_image_url ? "Replace Upload" : "Upload Photo"}
                              />
                              {loc.featured_image_url && (
                                <button
                                  onClick={() => handleRemoveFeatured(loc.slug)}
                                  disabled={isRemovingFeat}
                                  className="flex items-center gap-1.5 px-3 py-2 border border-red-100 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                  {isRemovingFeat ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                  Remove Upload
                                </button>
                              )}
                            </div>
                          </div>

                          {/* AI generation section */}
                          <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                              AI Generation Prompt
                            </label>
                            <textarea
                              value={prompts[loc.slug] ?? ""}
                              onChange={(e) => setPrompts((prev) => ({ ...prev, [loc.slug]: e.target.value }))}
                              rows={2}
                              placeholder="Describe the hero image for this location page..."
                              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none leading-relaxed"
                            />
                            <p className="text-xs text-gray-400 mt-1 mb-2.5">
                              {(prompts[loc.slug] ?? "").length} chars · Google Imagen 4 · 16:9 · No people
                            </p>

                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleGenerate(loc.slug)}
                                disabled={isGenerating || !prompts[loc.slug]?.trim()}
                                className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isGenerating ? (
                                  <><Loader2 size={13} className="animate-spin" /> Generating...</>
                                ) : loc.image_url ? (
                                  <><RefreshCw size={13} /> Regenerate with AI</>
                                ) : (
                                  <><Sparkles size={13} /> Generate with AI</>
                                )}
                              </button>

                              {displayImage && (
                                <>
                                  <a
                                    href={`/${loc.slug}/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                  >
                                    <Upload size={13} className="rotate-90" />
                                    Preview Page
                                  </a>
                                  <button
                                    onClick={() => handleRemove(loc.slug)}
                                    disabled={isRemoving}
                                    className="flex items-center gap-1.5 px-3 py-2 border border-red-100 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                                  >
                                    {isRemoving ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                                    Remove All
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
