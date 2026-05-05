import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Loader2, AlertCircle, CheckCircle, Image as ImageIcon } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "../lib/supabase";

interface ImageEntry {
  url: string;
  filename: string;
  folder: string;
}

async function fetchAllImages(): Promise<ImageEntry[]> {
  const entries: ImageEntry[] = [];

  const push = (url: string | null | undefined, folder: string, name: string) => {
    if (!url || !url.startsWith("http")) return;
    const ext = url.split("?")[0].split(".").pop() ?? "jpg";
    entries.push({ url, folder, filename: `${name}.${ext}` });
  };

  const [
    blogRes,
    serviceRes,
    baRes,
    categoryRes,
    galleryRes,
    siteRes,
    locationRes,
  ] = await Promise.all([
    supabase.from("blog_posts").select("slug, featured_image, og_image"),
    supabase.from("service_images").select("service_slug, hero_image_url"),
    supabase.from("service_before_after").select("service_slug, label, before_image_url, after_image_url"),
    supabase.from("category_images").select("category_slug, hero_image_url, mobile_image_url"),
    supabase.from("clinic_gallery_images").select("id, image_url, alt_text"),
    supabase.from("site_images").select("key, image_url"),
    supabase.from("location_hero_images").select("slug, image_url, featured_image_url"),
  ]);

  for (const post of blogRes.data ?? []) {
    push(post.featured_image, "blog", `${post.slug}-featured`);
    if (post.og_image && post.og_image !== post.featured_image) {
      push(post.og_image, "blog", `${post.slug}-og`);
    }
  }

  for (const svc of serviceRes.data ?? []) {
    push(svc.hero_image_url, "services", `${svc.service_slug}-hero`);
  }

  for (const ba of baRes.data ?? []) {
    const safeName = (ba.label ?? ba.service_slug).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    push(ba.before_image_url, "before-after", `${ba.service_slug}-${safeName}-before`);
    push(ba.after_image_url, "before-after", `${ba.service_slug}-${safeName}-after`);
  }

  for (const cat of categoryRes.data ?? []) {
    push(cat.hero_image_url, "categories", `${cat.category_slug}-desktop`);
    push(cat.mobile_image_url, "categories", `${cat.category_slug}-mobile`);
  }

  for (const img of galleryRes.data ?? []) {
    const name = img.alt_text
      ? img.alt_text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)
      : img.id;
    push(img.image_url, "clinic-gallery", name);
  }

  for (const site of siteRes.data ?? []) {
    push(site.image_url, "site", site.key.replace(/[^a-z0-9]+/g, "-"));
  }

  for (const loc of locationRes.data ?? []) {
    push(loc.image_url, "locations", `${loc.slug}-hero`);
    if (loc.featured_image_url && loc.featured_image_url !== loc.image_url) {
      push(loc.featured_image_url, "locations", `${loc.slug}-featured`);
    }
  }

  return entries;
}

const FOLDER_LABELS: Record<string, string> = {
  blog: "Blog Posts",
  services: "Service Hero Images",
  "before-after": "Before / After Pairs",
  categories: "Service Categories",
  "clinic-gallery": "Clinic Gallery",
  site: "Site Images",
  locations: "Location Pages",
};

type DownloadState = "idle" | "loading" | "downloading" | "done" | "error";

export default function AdminDownloadImagesPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, [navigate]);

  useEffect(() => {
    setLoadState("loading");
    fetchAllImages()
      .then((imgs) => {
        setImages(imgs);
        setLoadState("ready");
      })
      .catch(() => {
        setErrorMsg("Failed to load image list from database.");
        setLoadState("error");
      });
  }, []);

  const grouped = images.reduce<Record<string, ImageEntry[]>>((acc, img) => {
    (acc[img.folder] ??= []).push(img);
    return acc;
  }, {});

  const handleDownloadAll = async () => {
    if (images.length === 0) return;
    setDownloadState("downloading");
    setProgress(0);
    setErrorMsg("");

    try {
      const zip = new JSZip();
      let done = 0;

      await Promise.all(
        images.map(async (img) => {
          try {
            const res = await fetch(img.url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const blob = await res.blob();
            zip.folder(img.folder)!.file(img.filename, blob);
          } catch {
            // skip images that can't be fetched
          } finally {
            done++;
            setProgress(Math.round((done / images.length) * 100));
          }
        })
      );

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "astra-dental-images.zip");
      setDownloadState("done");
    } catch {
      setErrorMsg("Something went wrong while building the ZIP file.");
      setDownloadState("error");
    }
  };

  const isDownloading = downloadState === "downloading";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/blog"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft size={15} />
              Back
            </Link>
            <span className="text-gray-300">/</span>
            <span className="font-semibold text-gray-900 text-sm">Download Images</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Hero card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                <ImageIcon size={24} className="text-teal-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Image Download Center</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loadState === "ready"
                    ? `${images.length} images found across ${Object.keys(grouped).length} categories`
                    : loadState === "loading"
                    ? "Scanning image library…"
                    : ""}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadAll}
              disabled={isDownloading || loadState !== "ready" || images.length === 0}
              className="flex items-center gap-2 bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  {progress}%
                </>
              ) : (
                <>
                  <Download size={15} />
                  Download All (.zip)
                </>
              )}
            </button>
          </div>

          {/* Progress bar */}
          {isDownloading && (
            <div className="mt-6">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Fetching and compressing images… {progress}% complete
              </p>
            </div>
          )}

          {/* Success */}
          {downloadState === "done" && (
            <div className="mt-6 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <CheckCircle size={15} className="flex-shrink-0" />
              ZIP file downloaded successfully — check your downloads folder.
            </div>
          )}

          {/* Error */}
          {(downloadState === "error" || loadState === "error") && errorMsg && (
            <div className="mt-6 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="flex-shrink-0" />
              {errorMsg}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        {loadState === "loading" && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {loadState === "ready" && (
          <div className="space-y-3">
            {Object.entries(grouped).map(([folder, imgs]) => (
              <div key={folder} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{FOLDER_LABELS[folder] ?? folder}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{imgs.length} file{imgs.length !== 1 ? "s" : ""}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 font-mono">
                    {folder}/
                  </span>
                </div>

                <div className="border-t border-gray-50 px-6 py-3 max-h-48 overflow-y-auto">
                  <ul className="space-y-1">
                    {imgs.map((img, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-500 py-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                        <span className="font-mono truncate">{img.filename}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
