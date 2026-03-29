import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Calendar, Clock, Eye, Tag, User, Share2,
  Twitter, Linkedin, Link2, ChevronRight, ChevronDown, Facebook
} from "lucide-react";
import { getPostBySlug, getPublishedPosts, incrementViews, type BlogPost } from "../lib/blogApi";

function ShareButton({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Icon size={14} />
      {label}
    </button>
  );
}

function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mt-10 border-t border-gray-100 pt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-5">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800 text-sm">{faq.question}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ml-4 ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed bg-white">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RelatedPost({ post }: { post: BlogPost }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {post.featured_image && (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img src={post.featured_image} alt={post.featured_image_alt ?? ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <div className="p-4">
        {post.category && (
          <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{post.category}</span>
        )}
        <h3 className="font-bold text-gray-800 mt-2 mb-1 text-sm leading-snug group-hover:text-teal-600 transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <Clock size={10} /> {post.read_time} min read
        </p>
      </div>
    </Link>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get("preview") === "true";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug).then((p) => {
      if (!p || (!isPreview && p.status !== "published")) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(p);
      setLoading(false);
      incrementViews(p.id).catch(() => {});
      document.title = p.meta_title ?? p.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute("content", p.meta_description ?? p.excerpt ?? "");
      getPublishedPosts().then((all) => {
        setRelated(
          all.filter((r) => r.id !== p.id && r.category === p.category).slice(0, 3)
        );
      });
    }).catch(() => { setNotFound(true); setLoading(false); });
  }, [slug, isPreview]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${80 - i * 8}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Post Not Found</h1>
        <p className="text-gray-500 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog/" className="inline-flex items-center gap-2 text-teal-600 font-medium hover:underline">
          <ChevronRight size={16} className="rotate-180" /> Back to Blog
        </Link>
      </div>
    );
  }

  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <article className="pt-28 pb-13 px-4">
      <div className="max-w-[720px] mx-auto">

        {/* Back link */}
        <Link to="/blog/" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-600 transition-colors mb-8">
          <ChevronRight size={14} className="rotate-180" />
          Back to Blog
        </Link>

        {/* Category */}
        {post.category && (
          <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-full mb-4">
            {post.category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">{post.title}</h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-gray-500 leading-relaxed mb-6">{post.excerpt}</p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-teal-500" />
            {post.author_name}
          </span>
          {publishedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-teal-500" />
              {publishedDate}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-teal-500" />
            {post.read_time} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} className="text-teal-500" />
            {post.views} views
          </span>
        </div>

        {/* Featured image */}
        {post.featured_image && (
          <div className="rounded-2xl overflow-hidden bg-gray-100 mb-10 aspect-video">
            <img
              src={post.featured_image}
              alt={post.featured_image_alt ?? post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 mr-1">
              <Tag size={12} /> Tags:
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* FAQ */}
        {post.faq_section && post.faq_section.length > 0 && (
          <FaqAccordion faqs={post.faq_section} />
        )}

        {/* Share */}
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-600 flex items-center gap-1.5 mr-1">
              <Share2 size={14} /> Share:
            </span>
            <ShareButton
              icon={Facebook}
              label="Facebook"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank", "width=600,height=400")}
            />
            <ShareButton
              icon={Twitter}
              label="Twitter"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, "_blank")}
            />
            <ShareButton
              icon={Linkedin}
              label="LinkedIn"
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}
            />
            <ShareButton
              icon={Link2}
              label={copied ? "Copied!" : "Copy Link"}
              onClick={handleCopyLink}
            />
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="max-w-5xl mx-auto mt-16 px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((r) => <RelatedPost key={r.id} post={r} />)}
          </div>
        </div>
      )}
    </article>
  );
}
