import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Image as ImageIcon, Upload, Trash2, Plus,
  ChevronDown, ChevronRight, ChevronUp, Loader2, CheckCircle2, AlertCircle, Save, LayoutGrid,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { serviceCategories } from "../data/services";
import { serviceDetailExtras } from "../data/serviceDetailContent";
import {
  getServiceBeforeAfters, getServiceImage,
  upsertServiceImage, createBeforeAfter, updateBeforeAfter, deleteBeforeAfter,
  getCategoryImage, upsertCategoryImage, getAllCategoryImages,
  getSiteImagesByKeys, upsertSiteImageByKey,
} from "../lib/serviceImagesApi";
import type { ServiceBeforeAfter, ServiceImage, CategoryImage, SiteImageRow } from "../lib/serviceImagesApi";
import { Compare } from "../components/ui/Compare";
import {
  getAllGalleryImages, insertGalleryImage, updateGalleryImage, deleteGalleryImage,
  type ClinicGalleryImage,
} from "../lib/clinicGalleryApi";

interface ServiceEntry {
  slug: string;
  title: string;
  categorySlug: string;
  categoryTitle: string;
}

const allServices: ServiceEntry[] = serviceCategories.flatMap((cat) =>
  cat.services.map((s) => ({
    slug: s.slug,
    title: s.title,
    categorySlug: cat.slug,
    categoryTitle: cat.title,
  }))
);

function ImageUpload({
  onUpload,
  uploading,
  label = "Upload",
}: {
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
  label?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          if (ref.current) ref.current.value = "";
        }}
      />
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
        {uploading ? "Uploading..." : label}
      </button>
    </>
  );
}

async function uploadToStorage(file: File, path: string): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const filename = `${path}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("blog-images").upload(filename, file, { upsert: true });
  if (error) return null;
  const { data } = supabase.storage.from("blog-images").getPublicUrl(filename);
  return data.publicUrl;
}

interface CategoryRowProps {
  slug: string;
  title: string;
  initialImage: CategoryImage | null;
}

function CategoryRow({ slug, title, initialImage }: CategoryRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialImage?.hero_image_url || "");
  const [imageAlt, setImageAlt] = useState(initialImage?.hero_image_alt || `${title} at Astra Dental`);
  const [mobileImageUrl, setMobileImageUrl] = useState(initialImage?.mobile_image_url || "");
  const [uploading, setUploading] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  async function save() {
    setSaving(true);
    await upsertCategoryImage(slug, imageUrl, imageAlt, mobileImageUrl || null);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function uploadImg(file: File) {
    setUploading(true);
    const url = await uploadToStorage(file, `categories/${slug}/card`);
    if (url) setImageUrl(url);
    setUploading(false);
  }

  async function uploadMobileImg(file: File) {
    setUploadingMobile(true);
    const url = await uploadToStorage(file, `categories/${slug}/mobile`);
    if (url) setMobileImageUrl(url);
    setUploadingMobile(false);
  }

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {imageUrl && (
            <img src={imageUrl} alt={title} className="w-10 h-8 object-cover rounded-lg border border-gray-100 flex-shrink-0" />
          )}
          <p className="font-semibold text-navy-900 text-sm">{title}</p>
        </div>
        {expanded ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronRight size={15} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5">
          {/* Desktop / Card Image */}
          <div>
            <p className="text-xs font-semibold text-navy-900 mb-2 uppercase tracking-widest">Desktop Image</p>
            <div className="flex gap-3 items-start flex-wrap">
              {imageUrl && (
                <img src={imageUrl} alt="preview" className="w-32 h-20 object-cover rounded-xl border border-gray-100" />
              )}
              <div className="flex-1 min-w-[200px] space-y-2">
                <input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Image URL"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Alt text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <ImageUpload label="Upload Desktop Image" onUpload={uploadImg} uploading={uploading} />
              </div>
            </div>
          </div>

          {/* Mobile Image */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-navy-900 mb-1 uppercase tracking-widest">Mobile Image <span className="font-normal text-gray-400 normal-case tracking-normal">(shown only on phones)</span></p>
            <p className="text-[11px] text-gray-400 mb-2">Upload a portrait-cropped version for better mobile display. If left empty, the desktop image is used.</p>
            <div className="flex gap-3 items-start flex-wrap">
              {mobileImageUrl && (
                <img src={mobileImageUrl} alt="mobile preview" className="w-20 h-28 object-cover rounded-xl border border-gray-100" />
              )}
              <div className="flex-1 min-w-[200px] space-y-2">
                <input
                  value={mobileImageUrl}
                  onChange={(e) => setMobileImageUrl(e.target.value)}
                  placeholder="Mobile image URL (optional)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <div className="flex gap-2 flex-wrap items-center">
                  <ImageUpload label="Upload Mobile Image" onUpload={uploadMobileImg} uploading={uploadingMobile} />
                  {mobileImageUrl && (
                    <button
                      onClick={() => setMobileImageUrl("")}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center pt-1">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
              Save
            </button>
            {success && <CheckCircle2 size={16} className="text-teal-500" />}
          </div>
        </div>
      )}
    </div>
  );
}

interface ServiceRowProps {
  service: ServiceEntry;
}

function ServiceRow({ service }: ServiceRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [heroImage, setHeroImage] = useState<ServiceImage | null>(null);
  const [beforeAfters, setBeforeAfters] = useState<ServiceBeforeAfter[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [heroUrl, setHeroUrl] = useState("");
  const [heroAlt, setHeroAlt] = useState("");
  const [success, setSuccess] = useState(false);
  const [newBefore, setNewBefore] = useState("");
  const [newAfter, setNewAfter] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);

  const staticExtra = serviceDetailExtras[service.slug];

  async function load() {
    if (loaded) return;
    const [img, bas] = await Promise.all([
      getServiceImage(service.slug),
      getServiceBeforeAfters(service.slug),
    ]);
    setHeroImage(img);
    setHeroUrl(img?.hero_image_url || staticExtra?.heroImage || "");
    setHeroAlt(img?.hero_image_alt || `${service.title} in Langley BC`);
    setBeforeAfters(bas);
    setLoaded(true);
  }

  function toggle() {
    if (!expanded) load();
    setExpanded((v) => !v);
  }

  async function saveHero() {
    setSaving(true);
    await upsertServiceImage(service.slug, "detail", heroUrl, heroAlt);
    const updated = await getServiceImage(service.slug);
    setHeroImage(updated);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function uploadHero(file: File) {
    setUploading("hero");
    const url = await uploadToStorage(file, `services/${service.slug}/hero`);
    if (url) setHeroUrl(url);
    setUploading(null);
  }

  async function uploadBeforeAfterImg(field: "before" | "after", file: File) {
    setUploading(field);
    const url = await uploadToStorage(file, `services/${service.slug}/${field}`);
    if (url) {
      if (field === "before") setNewBefore(url);
      else setNewAfter(url);
    }
    setUploading(null);
  }

  async function addPair() {
    if (!newBefore || !newAfter) return;
    setAdding(true);
    await createBeforeAfter(service.slug, newLabel, newBefore, newAfter, beforeAfters.length);
    const updated = await getServiceBeforeAfters(service.slug);
    setBeforeAfters(updated);
    setNewBefore("");
    setNewAfter("");
    setNewLabel("");
    setAdding(false);
  }

  async function removePair(id: string) {
    await deleteBeforeAfter(id);
    setBeforeAfters((prev) => prev.filter((b) => b.id !== id));
  }

  async function uploadExisting(id: string, field: "before" | "after", file: File) {
    setUploading(`${id}-${field}`);
    const url = await uploadToStorage(file, `services/${service.slug}/${field}-${id}`);
    if (url) {
      const item = beforeAfters.find((b) => b.id === id)!;
      await updateBeforeAfter(
        id,
        item.label,
        field === "before" ? url : item.before_image_url,
        field === "after" ? url : item.after_image_url,
        item.sort_order
      );
      const updated = await getServiceBeforeAfters(service.slug);
      setBeforeAfters(updated);
    }
    setUploading(null);
  }

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div>
          <p className="font-semibold text-navy-900 text-sm">{service.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{service.categoryTitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {staticExtra?.beforeAfter && (
            <span className="text-[10px] bg-teal-50 text-teal-700 font-semibold px-2 py-0.5 rounded-full">
              {staticExtra.beforeAfter.length} static B/A
            </span>
          )}
          {expanded ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronRight size={15} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-6">
          {!loaded ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={14} className="animate-spin" /> Loading...
            </div>
          ) : (
            <>
              {/* Hero Image */}
              <div>
                <p className="font-poppins font-semibold text-xs text-navy-900 uppercase tracking-widest mb-3">
                  Service Hero Image
                </p>
                <div className="flex gap-3 items-start flex-wrap">
                  {heroUrl && (
                    <img src={heroUrl} alt="hero preview" className="w-28 h-20 object-cover rounded-xl border border-gray-100" />
                  )}
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <input
                      value={heroUrl}
                      onChange={(e) => setHeroUrl(e.target.value)}
                      placeholder="Image URL"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <input
                      value={heroAlt}
                      onChange={(e) => setHeroAlt(e.target.value)}
                      placeholder="Alt text"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <div className="flex gap-2">
                      <ImageUpload
                        label="Upload Image"
                        onUpload={uploadHero}
                        uploading={uploading === "hero"}
                      />
                      <button
                        onClick={saveHero}
                        disabled={saving}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                      >
                        {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
                        Save
                      </button>
                      {success && <CheckCircle2 size={16} className="text-teal-500 self-center" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Before / After Pairs */}
              <div>
                <p className="font-poppins font-semibold text-xs text-navy-900 uppercase tracking-widest mb-3">
                  Before &amp; After Images
                </p>

                {beforeAfters.length === 0 && (
                  <p className="text-xs text-gray-400 mb-3">No before/after pairs yet.</p>
                )}

                <div className="space-y-4">
                  {beforeAfters.map((ba) => (
                    <div key={ba.id} className="border border-gray-100 rounded-xl p-4 bg-surface space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-navy-900">{ba.label || "Untitled"}</p>
                        <button
                          onClick={() => removePair(ba.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <Compare
                        firstImage={ba.after_image_url}
                        secondImage={ba.before_image_url}
                        firstImageClassName="object-cover"
                        secondImageClassname="object-cover"
                        className="h-40 w-full"
                        slideMode="hover"
                      />
                      <p className="text-[10px] text-gray-400 italic">
                        Images are for illustrative purposes only and do not represent actual patient results.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1 font-semibold uppercase">Before</p>
                          <ImageUpload
                            label="Replace"
                            onUpload={(f) => uploadExisting(ba.id, "before", f)}
                            uploading={uploading === `${ba.id}-before`}
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1 font-semibold uppercase">After</p>
                          <ImageUpload
                            label="Replace"
                            onUpload={(f) => uploadExisting(ba.id, "after", f)}
                            uploading={uploading === `${ba.id}-after`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Pair */}
                <div className="mt-4 border border-dashed border-teal-200 rounded-xl p-4 bg-teal-50/30 space-y-3">
                  <p className="text-xs font-semibold text-teal-700">Add New Before / After Pair</p>
                  <input
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Label (e.g. Smile transformation)"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1.5 font-semibold uppercase">Before Image</p>
                      <input
                        value={newBefore}
                        onChange={(e) => setNewBefore(e.target.value)}
                        placeholder="URL or upload"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 mb-1.5"
                      />
                      <ImageUpload
                        label="Upload Before"
                        onUpload={(f) => uploadBeforeAfterImg("before", f)}
                        uploading={uploading === "before"}
                      />
                      {newBefore && (
                        <img src={newBefore} alt="before preview" className="mt-2 h-20 w-full object-cover rounded-lg border border-gray-100" />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1.5 font-semibold uppercase">After Image</p>
                      <input
                        value={newAfter}
                        onChange={(e) => setNewAfter(e.target.value)}
                        placeholder="URL or upload"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 mb-1.5"
                      />
                      <ImageUpload
                        label="Upload After"
                        onUpload={(f) => uploadBeforeAfterImg("after", f)}
                        uploading={uploading === "after"}
                      />
                      {newAfter && (
                        <img src={newAfter} alt="after preview" className="mt-2 h-20 w-full object-cover rounded-lg border border-gray-100" />
                      )}
                    </div>
                  </div>
                  {newBefore && newAfter && (
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1.5 font-semibold uppercase">Preview</p>
                      <Compare
                        firstImage={newAfter}
                        secondImage={newBefore}
                        firstImageClassName="object-cover"
                        secondImageClassname="object-cover"
                        className="h-40 w-full"
                        slideMode="hover"
                      />
                      <p className="text-[10px] text-gray-400 mt-1.5 italic">
                        Images are for illustrative purposes only and do not represent actual patient results.
                      </p>
                    </div>
                  )}
                  <button
                    onClick={addPair}
                    disabled={adding || !newBefore || !newAfter}
                    className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {adding ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                    Add Pair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const HOME_HERO_KEYS = [
  { key: "homepage-hero",   label: "Hero Image 1", desc: "First background image shown on the homepage hero" },
  { key: "homepage-hero-2", label: "Hero Image 2", desc: "Second background image — slides in after 5 seconds" },
] as const;

const WHO_WE_SERVE_KEYS = [
  { key: "services-who-we-serve-left",  label: "Left Photo",     desc: "Top-left image in the 2-column grid" },
  { key: "services-who-we-serve-right", label: "Right Photo",    desc: "Top-right image in the 2-column grid" },
  { key: "services-compare-before",     label: "Compare — Before", desc: "Left side of the hover comparison slider" },
  { key: "services-compare-after",      label: "Compare — After",  desc: "Right side of the hover comparison slider" },
] as const;

interface SiteImageCardEntry {
  key: string;
  label: string;
  desc: string;
}

interface SiteImageCardProps {
  entry: SiteImageCardEntry;
  row: SiteImageRow | null;
}

function SiteImageCard({ entry, row }: SiteImageCardProps) {
  const [url, setUrl] = useState(row?.image_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    const uploaded = await uploadToStorage(file, `site/who-we-serve/${entry.key}`);
    if (uploaded) {
      setUrl(uploaded);
      await upsertSiteImageByKey(entry.key, uploaded);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    await upsertSiteImageByKey(entry.key, url || null);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handleRemove() {
    setRemoving(true);
    await upsertSiteImageByKey(entry.key, null);
    setUrl("");
    setRemoving(false);
  }

  return (
    <div className="border border-gray-100 rounded-2xl bg-white p-5 space-y-4">
      <div>
        <p className="font-semibold text-navy-900 text-sm">{entry.label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{entry.desc}</p>
      </div>

      {url ? (
        <img src={url} alt={entry.label} className="w-full h-40 object-cover rounded-xl border border-gray-100" />
      ) : (
        <div className="w-full h-40 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <ImageIcon size={24} className="text-gray-300 mx-auto mb-1" />
            <p className="text-xs text-gray-400">No image set — using default</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste image URL or upload below"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <div className="flex gap-2 flex-wrap items-center">
          <ImageUpload label="Upload Image" onUpload={handleUpload} uploading={uploading} />
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={11} className="animate-spin" /> : <Save size={11} />}
            Save URL
          </button>
          {url && (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {removing ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
              Remove
            </button>
          )}
          {success && <CheckCircle2 size={16} className="text-teal-500" />}
        </div>
      </div>
    </div>
  );
}

interface WhoWeServeImagesProps {
  rows: SiteImageRow[];
}

function WhoWeServeImages({ rows }: WhoWeServeImagesProps) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-5 leading-relaxed">
        These images appear in the "Who We Serve" section on the Services page. Upload your own photos to replace the defaults.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {WHO_WE_SERVE_KEYS.map((entry) => {
          const row = rows.find((r) => r.key === entry.key) ?? null;
          return <SiteImageCard key={entry.key} entry={entry} row={row} />;
        })}
      </div>
    </div>
  );
}

interface HomeHeroImagesProps {
  rows: SiteImageRow[];
}

function HomeHeroImages({ rows }: HomeHeroImagesProps) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-5 leading-relaxed">
        These two images crossfade every 5 seconds on the homepage hero. Upload a second image to enable the slideshow effect — if only one is set, no slideshow occurs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {HOME_HERO_KEYS.map((entry) => {
          const row = rows.find((r) => r.key === entry.key) ?? null;
          return <SiteImageCard key={entry.key} entry={entry} row={row} />;
        })}
      </div>
    </div>
  );
}

function ClinicGalleryImages() {
  const [images, setImages] = useState<ClinicGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [editUrls, setEditUrls] = useState<Record<string, string>>({});
  const [editAlts, setEditAlts] = useState<Record<string, string>>({});
  const [editCaptions, setEditCaptions] = useState<Record<string, string>>({});
  const addFileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const data = await getAllGalleryImages();
    setImages(data);
    const urls: Record<string, string> = {};
    const alts: Record<string, string> = {};
    const captions: Record<string, string> = {};
    data.forEach((img) => {
      urls[img.id] = img.image_url;
      alts[img.id] = img.alt_text;
      captions[img.id] = img.caption || "";
    });
    setEditUrls(urls);
    setEditAlts(alts);
    setEditCaptions(captions);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleUploadNew(file: File) {
    setUploading(true);
    const url = await uploadToStorage(file, `clinic-gallery/${Date.now()}`);
    if (url) setNewUrl(url);
    setUploading(false);
  }

  async function handleAdd() {
    if (!newUrl) return;
    setAdding(true);
    await insertGalleryImage(newUrl, newAlt || "Astra Dental clinic", newCaption || null, images.length);
    setNewUrl("");
    setNewAlt("");
    setNewCaption("");
    await load();
    setAdding(false);
  }

  async function handleSaveRow(img: ClinicGalleryImage) {
    setSavingId(img.id);
    await updateGalleryImage(img.id, {
      image_url: editUrls[img.id] ?? img.image_url,
      alt_text: editAlts[img.id] ?? img.alt_text,
      caption: editCaptions[img.id] || null,
    });
    setSavingId(null);
    setSuccessId(img.id);
    setTimeout(() => setSuccessId(null), 2500);
    await load();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await deleteGalleryImage(id);
    await load();
    setDeletingId(null);
  }

  async function handleToggleActive(img: ClinicGalleryImage) {
    await updateGalleryImage(img.id, { is_active: !img.is_active });
    await load();
  }

  async function handleMove(img: ClinicGalleryImage, dir: "up" | "down") {
    const idx = images.findIndex((i) => i.id === img.id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= images.length) return;
    const other = images[swapIdx];
    await Promise.all([
      updateGalleryImage(img.id, { sort_order: other.sort_order }),
      updateGalleryImage(other.id, { sort_order: img.sort_order }),
    ]);
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
        <Loader2 size={16} className="animate-spin" /> Loading gallery images...
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-gray-400 mb-5 leading-relaxed">
        These images appear in the "Experience Our Modern Dental Facility" carousel on the homepage and about page. Use the arrows to reorder, toggle visibility, or upload new photos.
      </p>

      <div className="space-y-3 mb-8">
        {images.map((img, idx) => (
          <div key={img.id} className="border border-gray-100 rounded-2xl bg-white overflow-hidden">
            <div className="flex items-center gap-4 px-5 py-4">
              <img
                src={editUrls[img.id] || img.image_url}
                alt={img.alt_text}
                className="w-20 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <input
                    value={editUrls[img.id] ?? img.image_url}
                    onChange={(e) => setEditUrls((p) => ({ ...p, [img.id]: e.target.value }))}
                    placeholder="Image URL"
                    className="flex-1 min-w-[160px] border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <input
                    value={editAlts[img.id] ?? img.alt_text}
                    onChange={(e) => setEditAlts((p) => ({ ...p, [img.id]: e.target.value }))}
                    placeholder="Alt text"
                    className="flex-1 min-w-[130px] border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                  <input
                    value={editCaptions[img.id] ?? (img.caption || "")}
                    onChange={(e) => setEditCaptions((p) => ({ ...p, [img.id]: e.target.value }))}
                    placeholder="Caption (optional)"
                    className="flex-1 min-w-[120px] border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handleSaveRow(img)}
                    disabled={savingId === img.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {savingId === img.id ? <Loader2 size={10} className="animate-spin" /> : <Save size={10} />}
                    Save
                  </button>
                  {successId === img.id && <CheckCircle2 size={14} className="text-teal-500" />}
                  <button
                    onClick={() => handleToggleActive(img)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors ${
                      img.is_active
                        ? "border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100"
                        : "border-gray-200 text-gray-400 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {img.is_active ? "Visible" : "Hidden"}
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={deletingId === img.id}
                    className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === img.id ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                <button
                  onClick={() => handleMove(img, "up")}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-navy-900 hover:border-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Move up"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  onClick={() => handleMove(img, "down")}
                  disabled={idx === images.length - 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-navy-900 hover:border-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Move down"
                >
                  <ChevronDown size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">No images yet. Add one below.</p>
        )}
      </div>

      <div className="border border-dashed border-teal-200 rounded-2xl p-5 bg-teal-50/30 space-y-3">
        <p className="text-xs font-semibold text-teal-700">Add New Gallery Image</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Image URL or upload below"
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
          <input
            value={newAlt}
            onChange={(e) => setNewAlt(e.target.value)}
            placeholder="Alt text"
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
          <input
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
          />
        </div>
        {newUrl && (
          <img src={newUrl} alt="preview" className="h-24 w-auto rounded-xl border border-gray-100 object-cover" />
        )}
        <div className="flex gap-2 flex-wrap items-center">
          <input
            ref={addFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) await handleUploadNew(f);
              if (addFileRef.current) addFileRef.current.value = "";
            }}
          />
          <button
            onClick={() => addFileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={11} className="animate-spin" /> : <Upload size={11} />}
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
          <button
            onClick={handleAdd}
            disabled={adding || !newUrl}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-xs font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
            Add Image
          </button>
        </div>
      </div>
    </div>
  );
}

type Tab = "categories" | "services" | "whoweserve" | "homehero" | "clinicgallery" | "video";

export default function AdminServiceImagesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("categories");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryImages, setCategoryImages] = useState<CategoryImage[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [whoWeServeRows, setWhoWeServeRows] = useState<SiteImageRow[]>([]);
  const [loadingWhoWeServe, setLoadingWhoWeServe] = useState(true);
  const [homeHeroRows, setHomeHeroRows] = useState<SiteImageRow[]>([]);
  const [loadingHomeHero, setLoadingHomeHero] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, [navigate]);

  useEffect(() => {
    getAllCategoryImages().then((imgs) => {
      setCategoryImages(imgs);
      setLoadingCategories(false);
    });
  }, []);

  useEffect(() => {
    getSiteImagesByKeys(WHO_WE_SERVE_KEYS.map((k) => k.key)).then((rows) => {
      setWhoWeServeRows(rows);
      setLoadingWhoWeServe(false);
    });
  }, []);

  useEffect(() => {
    getSiteImagesByKeys(HOME_HERO_KEYS.map((k) => k.key)).then((rows) => {
      setHomeHeroRows(rows);
      setLoadingHomeHero(false);
    });
  }, []);

  const filtered = allServices.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.categoryTitle.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === "all" || s.categorySlug === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/blog"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft size={14} /> Admin
          </Link>
          <span className="text-gray-200">/</span>
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-teal-600" />
            <h1 className="font-poppins font-bold text-navy-900 text-lg">Service Images</h1>
          </div>
        </div>

        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mb-6 flex gap-3 items-start">
          <AlertCircle size={16} className="text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-teal-700 leading-relaxed">
            Manage images for service category cards and individual service hero images &amp; before/after comparisons. Images saved here take priority over static defaults.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit flex-wrap">
          <button
            onClick={() => setTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "categories" ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-navy-900"
            }`}
          >
            <LayoutGrid size={14} />
            Category Cards
          </button>
          <button
            onClick={() => setTab("services")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "services" ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-navy-900"
            }`}
          >
            <ImageIcon size={14} />
            Service Images
          </button>
          <button
            onClick={() => setTab("whoweserve")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "whoweserve" ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-navy-900"
            }`}
          >
            <ImageIcon size={14} />
            Who We Serve
          </button>
          <button
            onClick={() => setTab("homehero")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "homehero" ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-navy-900"
            }`}
          >
            <ImageIcon size={14} />
            Homepage Hero
          </button>
          <button
            onClick={() => setTab("clinicgallery")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "clinicgallery" ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-navy-900"
            }`}
          >
            <LayoutGrid size={14} />
            Clinic Gallery
          </button>
          <button
            onClick={() => setTab("video")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "video" ? "bg-white text-navy-900 shadow-sm" : "text-gray-500 hover:text-navy-900"
            }`}
          >
            <Upload size={14} />
            Services Video
          </button>
        </div>

        {tab === "categories" && (
          <div>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              These images appear on the service category cards shown on the main services page. Each image represents a dental specialty.
            </p>
            {loadingCategories ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
                <Loader2 size={16} className="animate-spin" /> Loading categories...
              </div>
            ) : (
              <div className="space-y-3">
                {serviceCategories.map((cat) => {
                  const existing = categoryImages.find((ci) => ci.category_slug === cat.slug) || null;
                  return (
                    <CategoryRow
                      key={cat.slug}
                      slug={cat.slug}
                      title={cat.title}
                      initialImage={existing}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "services" && (
          <div>
            <div className="flex gap-3 mb-5 flex-wrap">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 flex-1 min-w-[200px]"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              >
                <option value="all">All Categories</option>
                {serviceCategories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>{cat.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {filtered.map((s) => (
                <ServiceRow key={s.slug} service={s} />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-sm">No services match your search.</div>
              )}
            </div>
          </div>
        )}

        {tab === "whoweserve" && (
          loadingWhoWeServe ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : (
            <WhoWeServeImages rows={whoWeServeRows} />
          )
        )}

        {tab === "homehero" && (
          loadingHomeHero ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : (
            <HomeHeroImages rows={homeHeroRows} />
          )
        )}

        {tab === "clinicgallery" && <ClinicGalleryImages />}

        {tab === "video" && <ServicesVideoUpload />}
      </div>
    </div>
  );
}

function ServicesVideoUpload() {
  const videoRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteImagesByKeys(["services-hub-video"]).then((rows) => {
      const row = rows.find((r) => r.key === "services-hub-video");
      setVideoUrl(row?.image_url || "");
      setLoading(false);
    });
  }, []);

  async function uploadVideo(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `videos/services-hub-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(filename, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("blog-images").getPublicUrl(filename);
      setVideoUrl(data.publicUrl);
    }
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    await upsertSiteImageByKey("services-hub-video", videoUrl || null);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function remove() {
    setVideoUrl("");
    await upsertSiteImageByKey("services-hub-video", null);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400 py-8 justify-center">
        <Loader2 size={16} className="animate-spin" /> Loading...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-poppins font-semibold text-navy-900 text-base mb-1">Services Hub — Feature Video</h2>
      <p className="text-xs text-gray-400 leading-relaxed mb-5">
        Upload a video (MP4, MOV, WebM — up to 200 MB) that will appear on the All Services page above the "Dental Care for Every Stage of Life" section. The video only appears when a URL is saved here. It requires the user to press play and never autoplays.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Video URL</label>
          <div className="flex gap-2">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Paste a video URL or upload below"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {videoUrl && (
              <button
                onClick={remove}
                className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 size={11} />
                Remove
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Upload Video File</label>
          <>
            <input
              ref={videoRef}
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadVideo(f);
                if (videoRef.current) videoRef.current.value = "";
              }}
            />
            <button
              onClick={() => videoRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? "Uploading... (large files may take a moment)" : "Choose Video File"}
            </button>
          </>
          <p className="text-[11px] text-gray-400 mt-1.5">Recommended: MP4 format, 1080p or lower. Files up to ~200 MB are supported.</p>
        </div>

        {videoUrl && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Preview</label>
            <video
              src={videoUrl}
              controls
              preload="metadata"
              className="w-full rounded-xl border border-gray-100 bg-gray-50 aspect-video"
            />
          </div>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : success ? <CheckCircle2 size={14} /> : <Save size={14} />}
          {saving ? "Saving..." : success ? "Saved!" : "Save Video"}
        </button>
      </div>
    </div>
  );
}
