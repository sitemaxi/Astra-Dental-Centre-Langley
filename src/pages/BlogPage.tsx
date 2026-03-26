import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Clock, Search, Eye, Loader2, FileText } from "lucide-react";
import Hero from "../components/common/Hero";
import CTASection from "../components/common/CTASection";
import { getPublishedPosts, type BlogPost } from "../lib/blogApi";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {post.featured_image ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={post.featured_image} alt={post.featured_image_alt ?? post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
          <FileText size={32} className="text-gray-300" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
              {post.category}
            </span>
          )}
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <Clock size={9} /> {post.read_time} min
          </span>
        </div>
        <h2 className="font-poppins text-[15px] font-semibold text-navy-900 mb-2 leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            {post.published_at && (
              <span className="flex items-center gap-1"><Calendar size={9} />{formatDate(post.published_at)}</span>
            )}
            <span className="flex items-center gap-1"><Eye size={9} />{post.views}</span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 group-hover:gap-2 transition-all uppercase tracking-wide">
            Read <ArrowRight size={10} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    getPublishedPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category).filter(Boolean) as string[]));
    return ["All", ...cats];
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return posts.filter((p) => {
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || (p.excerpt ?? "").toLowerCase().includes(q);
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [posts, search, activeCategory]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <Hero
        title="Dental Health Blog"
        subtitle="Tips, insights, and updates from the team at Astra Dental Centre — helping you make informed decisions about your oral health."
        compact
        breadcrumb={[{ label: "Blog", href: "/blog/" }]}
      />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-colors ${
                    activeCategory === cat
                      ? "bg-teal-600 text-white border-teal-600"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-teal-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FileText size={40} className="text-gray-200 mb-3" />
              <p className="text-gray-400 font-medium">No articles found.</p>
              {search && (
                <button onClick={() => setSearch("")} className="mt-3 text-sm text-teal-600 hover:underline">Clear search</button>
              )}
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && (
                <div className="mb-14">
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="group grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 service-card border border-gray-100"
                  >
                    {featured.featured_image ? (
                      <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                        <img src={featured.featured_image} alt={featured.featured_image_alt ?? featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] lg:aspect-auto bg-gray-100 flex items-center justify-center">
                        <FileText size={40} className="text-gray-300" />
                      </div>
                    )}
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        {featured.category && (
                          <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700">
                            {featured.category}
                          </span>
                        )}
                        <span className="text-xs text-gray-400 font-medium bg-navy-50 px-2 py-0.5 rounded-full">Featured</span>
                      </div>
                      <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-3 leading-tight group-hover:text-teal-700 transition-colors">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          {featured.published_at && (
                            <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(featured.published_at)}</span>
                          )}
                          <span className="flex items-center gap-1"><Clock size={11} />{featured.read_time} min</span>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
                          Read Article <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <>
                  <div className="mb-6">
                    <span className="section-label">Latest Articles</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rest.map((post) => <PostCard key={post.id} post={post} />)}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      <CTASection variant="light" />
    </>
  );
}
