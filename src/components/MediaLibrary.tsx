import { useState, useEffect, useRef, useCallback } from "react";
import { X, Upload, Search, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface MediaItem {
  id: string;
  filename: string | null;
  url: string;
  alt_text: string | null;
  caption: string | null;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

interface MediaLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (media: { id: string; url: string; alt_text: string }) => void;
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary({ isOpen, onClose, onSelectImage }: MediaLibraryProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await supabase
        .from("media_library")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setItems((data ?? []) as MediaItem[]);
    } catch {
      setError("Failed to load media library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen, fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(path, file, { contentType: file.type });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("blog-images").getPublicUrl(path);
      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from("media_library").insert({
        filename: file.name,
        url: publicUrl,
        alt_text: file.name.replace(/\.[^.]+$/, ""),
        file_size: file.size,
        mime_type: file.type,
      });
      if (dbError) throw dbError;

      await fetchMedia();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.filename?.toLowerCase().includes(q) ||
      item.alt_text?.toLowerCase().includes(q) ||
      false
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ImageIcon size={20} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Media Library</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4">
              <AlertCircle size={15} />
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-blue-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ImageIcon size={40} className="text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                {search ? "No images match your search." : "No images uploaded yet. Upload your first image."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectImage({ id: item.id, url: item.url, alt_text: item.alt_text ?? "" })}
                  className="group relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-md transition-all text-left"
                >
                  <div className="aspect-square">
                    <img
                      src={item.url}
                      alt={item.alt_text ?? ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-700 truncate">{item.filename ?? "image"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                      {formatBytes(item.file_size)}
                    </p>
                  </div>
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors rounded-xl" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
