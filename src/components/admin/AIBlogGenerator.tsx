import { useState } from "react";
import { X, Sparkles, Loader2, AlertCircle, Link, Plus, Trash2, ChevronRight, CheckCircle2, Image as ImageIcon, FileText, Search } from "lucide-react";
import { generateBlogPost, type AIGeneratedBlog } from "../../lib/aiApi";
import { serviceCategories } from "../../data/services";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: AIGeneratedBlog) => void;
}

const SUGGESTED_LINKS = [
  { anchorText: "Book an Appointment", url: "/contact-us/" },
  { anchorText: "Our Dental Services", url: "/langley-dental-services/" },
  { anchorText: "About Astra Dental", url: "/about-the-dentist/" },
  { anchorText: "General Dentistry", url: "/langley-dental-services/general-dentistry/" },
  { anchorText: "Cosmetic Dentistry", url: "/langley-dental-services/cosmetic-dentistry/" },
  { anchorText: "Dental Implants", url: "/langley-dental-services/dental-implants-langley/" },
  { anchorText: "Invisalign", url: "/orthodontics/invisalign/" },
  { anchorText: "Teeth Whitening", url: "/cosmetic-dentistry/zoom-teeth-whitening/" },
];

type Step = "input" | "generating" | "preview";

const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all";

export default function AIBlogGenerator({ isOpen, onClose, onApply }: Props) {
  const [step, setStep] = useState<Step>("input");
  const [topic, setTopic] = useState("");
  const [internalLinks, setInternalLinks] = useState<Array<{ anchorText: string; url: string }>>([
    { anchorText: "Book an Appointment", url: "/contact-us/" },
    { anchorText: "Our Dental Services", url: "/langley-dental-services/" },
  ]);
  const [result, setResult] = useState<AIGeneratedBlog | null>(null);
  const [error, setError] = useState("");
  const [generatingStep, setGeneratingStep] = useState(0);

  const GENERATION_STEPS = [
    { icon: Search, label: "Analyzing topic & keywords..." },
    { icon: FileText, label: "Writing blog content..." },
    { icon: ImageIcon, label: "Generating featured image..." },
    { icon: CheckCircle2, label: "Finalizing SEO & metadata..." },
  ];

  const addLink = () => setInternalLinks((prev) => [...prev, { anchorText: "", url: "" }]);
  const removeLink = (i: number) => setInternalLinks((prev) => prev.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: "anchorText" | "url", value: string) => {
    setInternalLinks((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };
  const toggleSuggestedLink = (link: { anchorText: string; url: string }) => {
    const exists = internalLinks.some((l) => l.url === link.url);
    if (exists) {
      setInternalLinks((prev) => prev.filter((l) => l.url !== link.url));
    } else {
      setInternalLinks((prev) => [...prev, link]);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) { setError("Please enter a topic or keyword."); return; }
    setError("");
    setStep("generating");
    setGeneratingStep(0);

    const stepInterval = setInterval(() => {
      setGeneratingStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 4000);

    try {
      const validLinks = internalLinks.filter((l) => l.anchorText.trim() && l.url.trim());
      const data = await generateBlogPost(topic, validLinks);
      clearInterval(stepInterval);
      setGeneratingStep(GENERATION_STEPS.length - 1);
      setResult(data);
      setTimeout(() => setStep("preview"), 500);
    } catch (e: unknown) {
      clearInterval(stepInterval);
      const msg = (e as Error).message;
      setError(msg || "Generation failed. Check your API keys in AI Settings.");
      setStep("input");
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result);
      onClose();
      resetState();
    }
  };

  const resetState = () => {
    setStep("input");
    setTopic("");
    setResult(null);
    setError("");
    setGeneratingStep(0);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={step !== "generating" ? handleClose : undefined} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Blog Generator</h2>
              <p className="text-xs text-blue-100">Powered by GPT-4o & Google Imagen 4</p>
            </div>
          </div>
          {step !== "generating" && (
            <button onClick={handleClose} className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {step === "input" && (
            <div className="p-6 space-y-6">
              {error && (
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                  Topic, Keyword, or Heading
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. 'Benefits of dental implants in Langley BC' or 'How often should you visit the dentist?' or 'Invisalign vs braces for adults'"
                  rows={3}
                  className={`${inputClass} resize-none`}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1.5">Be specific for better results. Include location or audience if relevant.</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                    <Link size={12} /> Internal Links to Include
                  </label>
                  <button
                    type="button"
                    onClick={addLink}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Custom
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {SUGGESTED_LINKS.map((link) => {
                    const selected = internalLinks.some((l) => l.url === link.url);
                    return (
                      <button
                        key={link.url}
                        type="button"
                        onClick={() => toggleSuggestedLink(link)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                          selected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {selected ? "✓ " : ""}{link.anchorText}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  {internalLinks
                    .filter((l) => !SUGGESTED_LINKS.some((s) => s.url === l.url))
                    .map((link, rawIdx) => {
                      const actualIdx = internalLinks.indexOf(link);
                      return (
                        <div key={rawIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={link.anchorText}
                            onChange={(e) => updateLink(actualIdx, "anchorText", e.target.value)}
                            placeholder="Anchor text"
                            className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                          />
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => updateLink(actualIdx, "url", e.target.value)}
                            placeholder="/services/..."
                            className="flex-1 border border-gray-200 rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeLink(actualIdx)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleGenerate}
                  disabled={!topic.trim()}
                  className="w-full py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  <Sparkles size={16} />
                  Generate Full Blog Post
                  <ChevronRight size={16} />
                </button>
                <p className="text-xs text-center text-gray-400 mt-2">
                  This will generate title, content, SEO, FAQs, and a featured image
                </p>
              </div>
            </div>
          )}

          {step === "generating" && (
            <div className="p-8 flex flex-col items-center justify-center min-h-[360px] gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                  <Sparkles size={32} className="text-blue-600 animate-pulse" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-gray-800">Generating Your Blog Post</h3>
                <p className="text-sm text-gray-500">This takes about 30-60 seconds...</p>
              </div>

              <div className="w-full max-w-sm space-y-2">
                {GENERATION_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const isDone = i < generatingStep;
                  const isActive = i === generatingStep;
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive ? "bg-blue-50 border border-blue-100" : isDone ? "opacity-60" : "opacity-30"
                      }`}
                    >
                      {isActive ? (
                        <Loader2 size={15} className="text-blue-600 animate-spin flex-shrink-0" />
                      ) : isDone ? (
                        <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <Icon size={15} className="text-gray-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${isActive ? "text-blue-700 font-medium" : isDone ? "text-gray-500" : "text-gray-400"}`}>
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === "preview" && result && (
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <CheckCircle2 size={15} />
                <span className="font-medium">Blog post generated successfully!</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <PreviewCard label="Title" value={result.title} />
                <PreviewCard label="Category" value={result.category} />
                <PreviewCard label="Slug" value={`/blog/${result.slug}`} mono />
                <PreviewCard label="Read Time" value={`${result.read_time} min read`} />
              </div>

              {result.featured_image && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Featured Image (AI Generated)</p>
                  <div className="rounded-xl overflow-hidden aspect-video bg-gray-100">
                    <img src={result.featured_image} alt={result.featured_image_alt} className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Excerpt</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">{result.excerpt}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Meta Description</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-4 py-3 leading-relaxed">{result.meta_description}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tags ({result.tags.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">{tag}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">FAQ Questions ({result.faq_section.length})</p>
                <div className="space-y-1.5">
                  {result.faq_section.map((faq, i) => (
                    <div key={i} className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="font-medium text-gray-800">Q{i+1}:</span> {faq.question}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Content Preview</p>
                <div className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 max-h-32 overflow-hidden relative">
                  <div dangerouslySetInnerHTML={{ __html: result.content.slice(0, 400) + "..." }} className="line-clamp-4" />
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50" />
                </div>
              </div>
            </div>
          )}
        </div>

        {step === "preview" && result && (
          <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => { setStep("input"); setResult(null); }}
              className="flex-1 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Regenerate
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={15} />
              Apply to Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PreviewCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-gray-50 rounded-xl px-3 py-2.5">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className={`text-sm font-medium text-gray-800 truncate ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}
