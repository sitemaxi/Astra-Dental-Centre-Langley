import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SquarePen as PenSquare, Trash2, ExternalLink, PlusCircle, LogOut, Eye, Clock, Tag, CalendarDays, ChevronRight, Loader2, AlertCircle, Users, TrendingUp, Calendar, BarChart2, FileText, Sparkles, MapPin, Image as ImageIcon, ClipboardList } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getAllPosts, deletePost, type BlogPost } from "../lib/blogApi";

interface AppointmentRequest {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
  created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: "bg-emerald-100 text-emerald-700 border-emerald-200",
    draft: "bg-amber-100 text-amber-700 border-amber-200",
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${styles[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      {[...Array(6)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-gray-100 rounded animate-pulse" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminBlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
    });
  }, [navigate]);

  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch {
      setError("Failed to load posts.");
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    setLoadingAppts(true);
    try {
      const { data, error: err } = await supabase
        .from("appointment_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (err) throw err;
      setAppointments((data ?? []) as AppointmentRequest[]);
    } catch {
      setError("Failed to load appointments.");
    } finally {
      setLoadingAppts(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetchAppointments();
  }, [fetchPosts, fetchAppointments]);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch {
      setError("Failed to delete post.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const apptThisWeek = appointments.filter((a) => new Date(a.created_at) >= startOfWeek).length;
  const apptThisMonth = appointments.filter((a) => new Date(a.created_at) >= startOfMonth).length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const totalViews = posts.reduce((sum, p) => sum + (p.views ?? 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-lg">Astra Admin</span>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500">Blog & Appointments</span>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Appointments", value: appointments.length, icon: Users, color: "blue" },
            { label: "This Month", value: apptThisMonth, icon: Calendar, color: "teal" },
            { label: "This Week", value: apptThisWeek, icon: TrendingUp, color: "emerald" },
            { label: "Published Posts", value: publishedPosts, icon: FileText, color: "amber" },
          ].map(({ label, value, icon: Icon, color }) => (

            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-3`}>
                <Icon size={18} className={`text-${color}-600`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{loadingAppts && label !== "Published Posts" ? "—" : value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Appointment Requests */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Appointment Requests</h2>
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">{appointments.length} total</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Patient</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Contact</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Service</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Preferred Date</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Time</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingAppts ? (
                    [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
                  ) : appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                        No appointment requests yet.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {appt.first_name} {appt.last_name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <div>{appt.email}</div>
                          <div className="text-xs text-gray-400">{appt.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{appt.service ?? "—"}</td>
                        <td className="px-4 py-3">
                          {appt.preferred_date ? (
                            <span className="flex items-center gap-1 text-gray-600">
                              <CalendarDays size={12} className="text-teal-500" />
                              {new Date(appt.preferred_date + "T00:00:00").toLocaleDateString("en-CA", {
                                month: "short", day: "numeric", year: "numeric"
                              })}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {appt.preferred_time ? (
                            <span className="flex items-center gap-1 text-gray-600">
                              <Clock size={12} className="text-teal-500" />
                              {appt.preferred_time}
                            </span>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(appt.created_at).toLocaleDateString("en-CA", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PenSquare size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Blog Posts</h2>
              <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-0.5">
                {publishedPosts} published · {totalViews} views
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/admin/patient-forms"
                className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                title="New Patient Form Submissions"
              >
                <ClipboardList size={14} className="text-teal-500" />
                Patient Forms
              </Link>
              <Link
                to="/admin/service-images"
                className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                title="Service Images & Before/After"
              >
                <ImageIcon size={14} className="text-teal-500" />
                Service Images
              </Link>
              <Link
                to="/admin/locations"
                className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                title="Location Hero Images"
              >
                <MapPin size={14} className="text-teal-500" />
                Location Images
              </Link>
              <Link
                to="/admin/ai-settings"
                className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                title="AI Prompt Settings"
              >
                <Sparkles size={14} className="text-blue-500" />
                AI Settings
              </Link>
              <Link
                to="/admin/blog/new"
                className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <PlusCircle size={15} />
                New Post
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Post</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Read Time</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Views</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Date</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingPosts ? (
                    [...Array(4)].map((_, i) => <SkeletonRow key={i} />)
                  ) : posts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <FileText size={32} className="text-gray-300" />
                          <p className="text-sm text-gray-400">No blog posts yet.</p>
                          <Link
                            to="/admin/blog/new"
                            className="flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline"
                          >
                            Create your first post <ChevronRight size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    posts.map((post) => (
                      <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {post.featured_image ? (
                              <img src={post.featured_image} alt={post.featured_image_alt ?? ""} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <FileText size={16} className="text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800 line-clamp-1">{post.title}</p>
                              <p className="text-xs text-gray-400">/blog/{post.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {post.category ? (
                            <span className="flex items-center gap-1 text-gray-600 text-xs">
                              <Tag size={11} /> {post.category}
                            </span>
                          ) : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={post.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {post.read_time} min
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {post.views}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {new Date(post.created_at).toLocaleDateString("en-CA", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            {post.status === "published" && (
                              <a
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                title="View live"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <Link
                              to={`/admin/blog/edit/${post.id}`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <PenSquare size={14} />
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(post.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Delete Post?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The post will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
