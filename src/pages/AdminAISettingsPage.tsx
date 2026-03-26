import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Save, Loader2, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Info } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getPromptSettings, updatePromptSetting, type AIPromptSetting } from "../lib/aiApi";

const PROMPT_DOCS: Record<string, { variables?: string[]; tips: string[] }> = {
  blog_content: {
    variables: ["{{internal_links}}", "{{topic}}"],
    tips: [
      "Use {{internal_links}} to insert the list of internal links the AI should weave in.",
      "Use {{topic}} to reference the keyword/topic in the prompt.",
      "The AI returns HTML — instruct it to use <h2>, <p>, <ul>, etc.",
      "Mention your clinic name and location for local SEO.",
    ],
  },
  blog_metadata: {
    variables: ["{{topic}}"],
    tips: [
      "This prompt must instruct the AI to return a valid JSON object.",
      "Keep the JSON field names exactly as listed — they map directly to the blog form.",
      "The faq_section array should have 4-6 objects with 'question' and 'answer' keys.",
    ],
  },
  image_generation: {
    variables: ["{{topic}}"],
    tips: [
      "Use {{topic}} to dynamically insert the blog topic.",
      "Be specific about style, lighting, and mood for consistent results.",
      "Images are generated at 16:9 aspect ratio using Google Imagen 4.",
      "Avoid requesting people — the model is set to 'dont_allow' for person generation.",
      "Include 'no text, no watermarks' to keep images clean.",
      "Max prompt length is 480 tokens.",
    ],
  },
};

export default function AdminAISettingsPage() {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState<AIPromptSetting[]>([]);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    getPromptSettings()
      .then((data) => {
        setPrompts(data);
        const initial: Record<string, string> = {};
        for (const p of data) initial[p.key] = p.prompt;
        setEdited(initial);
      })
      .catch(() => setError("Failed to load prompt settings."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    setError("");
    try {
      await updatePromptSetting(key, edited[key] ?? "");
      setSaved(key);
      setTimeout(() => setSaved(null), 3000);
    } catch {
      setError(`Failed to save "${key}" prompt.`);
    } finally {
      setSaving(null);
    }
  };

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasChanged = (key: string) => {
    const original = prompts.find((p) => p.key === key)?.prompt ?? "";
    return (edited[key] ?? "") !== original;
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <Link to="/admin/blog" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft size={17} className="text-gray-500" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Sparkles size={15} className="text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-gray-700">AI Writing Settings</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 flex gap-3">
          <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-800">Customize AI Behavior</p>
            <p className="text-sm text-blue-700">
              These prompts control how the AI generates blog content, metadata, and images.
              Use the available variables (shown in each section) to dynamically insert context.
              Changes take effect immediately for all future generations.
            </p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {prompts.map((prompt) => {
          const docs = PROMPT_DOCS[prompt.key];
          const isExpanded = expanded[prompt.key] ?? true;
          const isSaving = saving === prompt.key;
          const isSaved = saved === prompt.key;
          const isDirty = hasChanged(prompt.key);

          return (
            <div key={prompt.key} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                onClick={() => toggleExpand(prompt.key)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <Sparkles size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{prompt.name}</p>
                    <p className="text-xs text-gray-500">{prompt.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isDirty && (
                    <span className="text-xs px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-full">Unsaved</span>
                  )}
                  {isSaved && (
                    <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={11} /> Saved
                    </span>
                  )}
                  {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-50">
                  {docs && (
                    <div className="mt-4 space-y-3">
                      {docs.variables && docs.variables.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Available Variables</p>
                          <div className="flex flex-wrap gap-2">
                            {docs.variables.map((v) => (
                              <code key={v} className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg font-mono">{v}</code>
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tips</p>
                        <ul className="space-y-1">
                          {docs.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
                              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Prompt
                      </label>
                      <span className="text-xs text-gray-400">
                        {(edited[prompt.key] ?? "").length} chars
                      </span>
                    </div>
                    <textarea
                      value={edited[prompt.key] ?? ""}
                      onChange={(e) => setEdited((prev) => ({ ...prev, [prompt.key]: e.target.value }))}
                      rows={12}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-y leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Last updated: {new Date(prompt.updated_at).toLocaleDateString("en-CA", { dateStyle: "medium" })}
                    </p>
                    <button
                      onClick={() => handleSave(prompt.key)}
                      disabled={isSaving || !isDirty}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <><Loader2 size={13} className="animate-spin" /> Saving...</>
                      ) : (
                        <><Save size={13} /> Save Prompt</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
