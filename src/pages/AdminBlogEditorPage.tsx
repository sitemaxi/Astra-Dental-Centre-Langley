import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save, Globe, Image as ImageIcon, X, Loader2, AlertCircle, CheckCircle2, Plus, Trash2, CreditCard as Edit3, Eye, Sparkles, Settings } from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  getPostById, createPost, updatePost, generateSlug,
  type BlogPost, type BlogPostInsert
} from "../lib/blogApi";
import RichTextEditor, { type RichTextEditorRef } from "../components/RichTextEditor";
import MediaLibrary from "../components/MediaLibrary";
import TagInput from "../components/admin/TagInput";
import CollapsibleSection from "../components/admin/CollapsibleSection";
import AIBlogGenerator from "../components/admin/AIBlogGenerator";
import type { AIGeneratedBlog } from "../lib/aiApi";

type MediaMode = "featured" | "inline" | "og";

const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";
const labelClass = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

export default function AdminBlogEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isNew = !id;

  const editorRef = useRef<RichTextEditorRef>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaMode, setMediaMode] = useState<MediaMode>("featured");
  const [slugLocked, setSlugLocked] = useState(!isNew);
  const [aiOpen, setAiOpen] = useState(false);

  const [form, setForm] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: null,
    featured_image_alt: "",
    author_name: "Admin",
    category: "",
    tags: [],
    status: "draft",
    read_time: 5,
    meta_title: "",
    meta_description: "",
    og_title: "",
    og_description: "",
    og_image: null,
    faq_section: [],
    internal_links: [],
    schedule_for: null,
    published_at: null,
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saveError, setError] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, [navigate]);

  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      getPostById(id).then((post) => {
        if (post) {
          setForm(post);
          setTimeout(() => {
            editorRef.current?.setContent(post.content ?? "");
          }, 100);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id, isNew]);

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTitleChange = (value: string) => {
    set("title", value);
    if (!slugLocked) {
      set("slug", generateSlug(value));
    }
  };

  const handleContentChange = useCallback((html: string) => {
    setForm((prev) => ({ ...prev, content: html }));
  }, []);

  const openMedia = (mode: MediaMode) => {
    setMediaMode(mode);
    setMediaOpen(true);
  };

  const handleMediaSelect = (media: { id: string; url: string; alt_text: string }) => {
    if (mediaMode === "featured") {
      set("featured_image", media.url);
      set("featured_image_alt", media.alt_text);
    } else if (mediaMode === "og") {
      set("og_image", media.url);
    } else if (mediaMode === "inline") {
      editorRef.current?.insertImage(media.url, media.alt_text);
    }
    setMediaOpen(false);
  };

  const buildPayload = (publishNow = false): BlogPostInsert => {
    const p: BlogPostInsert = {
      title: form.title ?? "",
      slug: form.slug ?? "",
      excerpt: form.excerpt ?? null,
      content: form.content ?? null,
      featured_image: form.featured_image ?? null,
      featured_image_alt: form.featured_image_alt ?? null,
      author_name: form.author_name ?? "Admin",
      author_avatar: form.author_avatar ?? null,
      category: form.category ?? null,
      tags: form.tags ?? [],
      status: publishNow ? "published" : (form.status as BlogPost["status"] ?? "draft"),
      published: publishNow ? true : (form.published ?? false),
      published_at: publishNow && !form.published_at
        ? new Date().toISOString()
        : (form.published_at ?? null),
      schedule_for: form.schedule_for ?? null,
      read_time: form.read_time ?? 5,
      meta_title: form.meta_title ?? null,
      meta_description: form.meta_description ?? null,
      og_title: form.og_title ?? null,
      og_description: form.og_description ?? null,
      og_image: form.og_image ?? null,
      workflow_status: publishNow ? "published" : (form.workflow_status as BlogPost["workflow_status"] ?? "draft"),
      faq_section: form.faq_section ?? [],
      internal_links: form.internal_links ?? [],
    };
    return p;
  };

  const handleSave = async (publishNow = false) => {
    if (!form.title?.trim()) { setError("Title is required."); return; }
    if (!form.content?.trim()) { setError("Content is required."); return; }
    setError("");
    setSaving(true);
    try {
      const payload = buildPayload(publishNow);
      if (isNew) {
        const post = await createPost(payload);
        setLastSaved(new Date());
        navigate(`/admin/blog/edit/${post.id}`, { replace: true });
      } else {
        await updatePost(id!, payload);
        setLastSaved(new Date());
        setAutoSaveStatus("saved");
      }
    } catch (e: unknown) {
      setError((e as Error).message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  // Auto-save every 10 seconds for existing posts
  useEffect(() => {
    if (isNew) return;
    autoSaveTimer.current = setInterval(async () => {
      if (!form.title?.trim() || !form.content?.trim()) return;
      setAutoSaveStatus("saving");
      try {
        await updatePost(id!, buildPayload());
        setLastSaved(new Date());
        setAutoSaveStatus("saved");
      } catch {
        setAutoSaveStatus("idle");
      }
    }, 10000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew, form.title, form.content]);

  const addFaq = () => {
    set("faq_section", [...(form.faq_section ?? []), { question: "", answer: "" }]);
  };
  const updateFaq = (i: number, field: "question" | "answer", value: string) => {
    const updated = [...(form.faq_section ?? [])];
    updated[i] = { ...updated[i], [field]: value };
    set("faq_section", updated);
  };
  const removeFaq = (i: number) => {
    set("faq_section", (form.faq_section ?? []).filter((_, idx) => idx !== i));
  };

  const addLink = () => {
    set("internal_links", [...(form.internal_links ?? []), { anchorText: "", url: "" }]);
  };
  const updateLink = (i: number, field: "anchorText" | "url", value: string) => {
    const updated = [...(form.internal_links ?? [])];
    updated[i] = { ...updated[i], [field]: value };
    set("internal_links", updated);
  };
  const removeLink = (i: number) => {
    set("internal_links", (form.internal_links ?? []).filter((_, idx) => idx !== i));
  };

  const handleAIApply = useCallback((data: AIGeneratedBlog) => {
    setForm((prev) => ({
      ...prev,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      og_title: data.og_title,
      og_description: data.og_description,
      category: data.category,
      tags: data.tags,
      read_time: data.read_time,
      author_name: data.author_name,
      faq_section: data.faq_section,
      internal_links: data.internal_links,
      featured_image: data.featured_image ?? prev.featured_image,
      featured_image_alt: data.featured_image_alt,
      og_image: data.og_image ?? prev.og_image,
    }));
    setTimeout(() => {
      editorRef.current?.setContent(data.content);
      setForm((prev) => ({ ...prev, content: data.content }));
    }, 100);
    setSlugLocked(true);
  }, []);

  const autoSaveLabel = () => {
    if (autoSaveStatus === "saving") return "Saving...";
    if (autoSaveStatus === "saved" && lastSaved) {
      const secs = Math.round((Date.now() - lastSaved.getTime()) / 1000);
      return secs < 60 ? "Saved just now" : `Saved ${Math.round(secs / 60)} min ago`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin/blog" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft size={17} className="text-gray-500" />
            </Link>
            <span className="text-sm font-semibold text-gray-700">
              {isNew ? "New Post" : "Edit Post"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!isNew && autoSaveLabel() && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                {autoSaveStatus === "saving" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} className="text-emerald-500" />}
                {autoSaveLabel()}
              </span>
            )}
            <button
              onClick={() => setAiOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
            >
              <Sparkles size={14} />
              AI Generate
            </button>
            <Link
              to="/admin/ai-settings"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="AI Prompt Settings"
            >
              <Settings size={16} />
            </Link>
            {form.status === "published" && !isNew && (
              <a
                href={`/blog/${form.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Eye size={14} /> Preview
              </a>
            )}
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              <Save size={14} />
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
              Publish
            </button>
          </div>
        </div>
      </header>

      {saveError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={15} />
            {saveError}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
              {/* Title */}
              <div>
                <label className={labelClass}>Post Title</label>
                <input
                  type="text"
                  value={form.title ?? ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:font-normal placeholder:text-gray-300"
                />
              </div>

              {/* Slug */}
              <div>
                <label className={labelClass}>Slug</label>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all">
                  <span className="px-3 py-2.5 bg-gray-50 text-xs text-gray-400 border-r border-gray-200 flex-shrink-0">/blog/</span>
                  <input
                    type="text"
                    value={form.slug ?? ""}
                    onChange={(e) => set("slug", e.target.value)}
                    disabled={slugLocked}
                    className="flex-1 px-3 py-2.5 text-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setSlugLocked(!slugLocked)}
                    className="px-3 py-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                    title={slugLocked ? "Unlock to edit" : "Lock slug"}
                  >
                    <Edit3 size={13} />
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className={labelClass}>Excerpt</label>
                <textarea
                  value={form.excerpt ?? ""}
                  onChange={(e) => set("excerpt", e.target.value)}
                  rows={3}
                  placeholder="A short summary of the post (shown in listings)..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className={labelClass}>Featured Image</label>
              {form.featured_image ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
                    <img src={form.featured_image} alt={form.featured_image_alt ?? ""} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { set("featured_image", null); set("featured_image_alt", ""); }}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Alt text</label>
                    <input
                      type="text"
                      value={form.featured_image_alt ?? ""}
                      onChange={(e) => set("featured_image_alt", e.target.value)}
                      placeholder="Describe the image..."
                      className={inputClass}
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => openMedia("featured")}
                  className="w-full aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-blue-400 hover:bg-blue-50/50 transition-colors text-gray-400 hover:text-blue-500"
                >
                  <ImageIcon size={28} />
                  <span className="text-sm font-medium">Choose Featured Image</span>
                </button>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <label className={labelClass}>Content</label>
              <RichTextEditor
                ref={editorRef}
                content={form.content ?? ""}
                onChange={handleContentChange}
                onImageInsert={() => openMedia("inline")}
                placeholder="Start writing your post..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish */}
            <CollapsibleSection title="Publish" defaultOpen>
              <div>
                <label className={labelClass}>Status</label>
                <div className="flex gap-2">
                  {(["draft", "published", "scheduled"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set("status", s)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors capitalize ${
                        form.status === s
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              {form.status === "scheduled" && (
                <div>
                  <label className={labelClass}>Schedule For</label>
                  <input
                    type="datetime-local"
                    value={form.schedule_for?.slice(0, 16) ?? ""}
                    onChange={(e) => set("schedule_for", e.target.value ? new Date(e.target.value).toISOString() : null)}
                    className={inputClass}
                  />
                </div>
              )}
              <div>
                <label className={labelClass}>Publish Date</label>
                <input
                  type="date"
                  value={form.published_at ? form.published_at.slice(0, 10) : ""}
                  onChange={(e) => set("published_at", e.target.value ? new Date(e.target.value).toISOString() : null)}
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="flex-1 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  <Save size={13} /> Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
                  Publish
                </button>
              </div>
            </CollapsibleSection>

            {/* Post Details */}
            <CollapsibleSection title="Post Details" defaultOpen>
              <div>
                <label className={labelClass}>Author Name</label>
                <input type="text" value={form.author_name ?? ""} onChange={(e) => set("author_name", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input type="text" value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} placeholder="e.g. General Dentistry" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Tags</label>
                <TagInput tags={form.tags ?? []} onChange={(tags) => set("tags", tags)} />
              </div>
              <div>
                <label className={labelClass}>Read Time (minutes)</label>
                <input type="number" min={1} value={form.read_time ?? 5} onChange={(e) => set("read_time", parseInt(e.target.value) || 5)} className={inputClass} />
              </div>
            </CollapsibleSection>

            {/* SEO */}
            <CollapsibleSection title="SEO Settings" defaultOpen={false}>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass.replace("mb-1.5", "")}>Meta Title</label>
                  <span className={`text-xs ${(form.meta_title?.length ?? 0) > 60 ? "text-red-500" : "text-gray-400"}`}>
                    {form.meta_title?.length ?? 0}/60
                  </span>
                </div>
                <input type="text" value={form.meta_title ?? ""} onChange={(e) => set("meta_title", e.target.value)} maxLength={60} className={inputClass} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={labelClass.replace("mb-1.5", "")}>Meta Description</label>
                  <span className={`text-xs ${(form.meta_description?.length ?? 0) > 160 ? "text-red-500" : "text-gray-400"}`}>
                    {form.meta_description?.length ?? 0}/160
                  </span>
                </div>
                <textarea value={form.meta_description ?? ""} onChange={(e) => set("meta_description", e.target.value)} rows={3} maxLength={160} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>OG Title</label>
                <input type="text" value={form.og_title ?? ""} onChange={(e) => set("og_title", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>OG Description</label>
                <textarea value={form.og_description ?? ""} onChange={(e) => set("og_description", e.target.value)} rows={2} className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>OG Image</label>
                {form.og_image ? (
                  <div className="space-y-2">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                      <img src={form.og_image} alt="OG" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => set("og_image", null)} className="absolute top-1.5 right-1.5 p-1 bg-black/50 text-white rounded hover:bg-black/70">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => openMedia("og")} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                    <ImageIcon size={15} /> Choose OG Image
                  </button>
                )}
              </div>
            </CollapsibleSection>

            {/* FAQ Section */}
            <CollapsibleSection title="FAQ Section" defaultOpen={false}>
              <div className="space-y-3">
                {(form.faq_section ?? []).map((faq, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-gray-500">Q{i + 1}</span>
                      <button type="button" onClick={() => removeFaq(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(i, "question", e.target.value)}
                      placeholder="Question..."
                      className={inputClass}
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(i, "answer", e.target.value)}
                      placeholder="Answer..."
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFaq}
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add FAQ
                </button>
              </div>
            </CollapsibleSection>

            {/* Internal Links */}
            <CollapsibleSection title="Internal Links" defaultOpen={false}>
              <div className="space-y-3">
                {(form.internal_links ?? []).map((link, i) => (
                  <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Link {i + 1}</span>
                      <button type="button" onClick={() => removeLink(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={link.anchorText}
                      onChange={(e) => updateLink(i, "anchorText", e.target.value)}
                      placeholder="Anchor text..."
                      className={inputClass}
                    />
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      placeholder="https://..."
                      className={inputClass}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLink}
                  className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      <MediaLibrary
        isOpen={mediaOpen}
        onClose={() => setMediaOpen(false)}
        onSelectImage={handleMediaSelect}
      />

      <AIBlogGenerator
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onApply={handleAIApply}
      />
    </div>
  );
}
