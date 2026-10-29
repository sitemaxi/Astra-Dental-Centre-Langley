import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, AlertCircle, Eye, FileDown, Mail, Loader2, ClipboardList, CalendarDays } from "lucide-react";
import { supabase } from "../lib/supabase";

interface AccessLogEntry {
  id: string;
  admin_user_id: string;
  admin_email: string;
  record_type: "appointment" | "new_patient";
  subject_name: string;
  action: "view" | "export" | "resend";
  created_at: string;
}

interface AdminOption {
  user_id: string;
  email: string;
}

const PAGE_SIZE = 100;

const ACTIONS = {
  view: { label: "Viewed", icon: Eye, style: "bg-blue-50 text-blue-700 border-blue-100" },
  export: { label: "Downloaded PDF", icon: FileDown, style: "bg-amber-50 text-amber-700 border-amber-100" },
  resend: { label: "Resent email", icon: Mail, style: "bg-emerald-50 text-emerald-700 border-emerald-100" },
} as const;

const RECORD_TYPES = {
  appointment: { label: "Appointment request", icon: CalendarDays },
  new_patient: { label: "New patient form", icon: ClipboardList },
} as const;

export default function AdminAccessLogPage() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<AccessLogEntry[]>([]);
  const [admins, setAdmins] = useState<AdminOption[]>([]);
  const [adminFilter, setAdminFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState("");

  const fetchPage = useCallback(
    async (offset: number) => {
      let query = supabase
        .from("patient_record_access_log")
        .select("id, admin_user_id, admin_email, record_type, subject_name, action, created_at")
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      if (adminFilter) query = query.eq("admin_user_id", adminFilter);
      const { data, error: err } = await query;
      if (err) throw err;
      return (data ?? []) as AccessLogEntry[];
    },
    [adminFilter],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchPage(0)
      .then((rows) => {
        if (!active) return;
        setEntries(rows);
        setHasMore(rows.length === PAGE_SIZE);
      })
      .catch(() => active && setError("Failed to load the access log."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [fetchPage]);

  useEffect(() => {
    supabase
      .from("admin_users")
      .select("user_id, email")
      .order("email")
      .then(({ data }) => setAdmins((data ?? []) as AdminOption[]));
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const rows = await fetchPage(entries.length);
      setEntries((prev) => [...prev, ...rows]);
      setHasMore(rows.length === PAGE_SIZE);
    } catch {
      setError("Failed to load more entries.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/admin/blog" className="font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
              Astra Admin
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500">Access Log</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/blog" className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <ShieldCheck size={18} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Access Log</h1>
              <p className="text-sm text-gray-500">Every time a patient record was opened, downloaded or resent. Entries cannot be edited or removed.</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            Admin
            <select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            >
              <option value="">All admins</option>
              {admins.map((a) => (
                <option key={a.user_id} value={a.user_id}>{a.email}</option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={15} />
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {["When", "Admin", "Action", "Record", "Patient"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      {[...Array(5)].map((__, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : entries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <ShieldCheck size={36} className="text-gray-200" />
                        <p className="text-sm text-gray-400">No patient records have been accessed yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entries.map((e) => {
                    const action = ACTIONS[e.action];
                    const record = RECORD_TYPES[e.record_type];
                    const ActionIcon = action.icon;
                    const RecordIcon = record.icon;
                    return (
                      <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(e.created_at).toLocaleString("en-CA", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{e.admin_email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${action.style}`}>
                            <ActionIcon size={12} />
                            {action.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <RecordIcon size={13} className="text-teal-500" />
                            {record.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">{e.subject_name}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {hasMore && !loading && (
          <div className="flex justify-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-60"
            >
              {loadingMore && <Loader2 size={14} className="animate-spin" />}
              Load older entries
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
