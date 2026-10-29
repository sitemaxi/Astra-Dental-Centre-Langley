import { useEffect, useRef, useState } from "react";
import { X, Loader2, AlertCircle, Mail, Phone, Stethoscope, CalendarDays, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { logRecordAccess } from "../../lib/adminAuth";

interface AppointmentDetail {
  email: string;
  phone: string;
  service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  message: string | null;
}

interface Props {
  id: string;
  name: string;
  submittedAt: string;
  onClose: () => void;
}

function formatDate(value: string) {
  return new Date(value + "T00:00:00").toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

export default function AppointmentDetailModal({ id, name, submittedAt, onClose }: Props) {
  const [detail, setDetail] = useState<AppointmentDetail | null>(null);
  const [error, setError] = useState("");
  const logged = useRef<Promise<void> | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        logged.current ??= logRecordAccess("appointment", id, "view");
        await logged.current;
        const { data, error: err } = await supabase
          .from("appointment_requests")
          .select("email, phone, service, preferred_date, preferred_time, message")
          .eq("id", id)
          .maybeSingle();
        if (err) throw err;
        if (!data) throw new Error("not found");
        if (active) setDetail(data as AppointmentDetail);
      } catch {
        if (active) setError("This request couldn't be opened. Please try again.");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const rows = detail
    ? [
        { icon: Mail, label: "Email", value: <a href={`mailto:${detail.email}`} className="text-blue-600 hover:underline break-all">{detail.email}</a> },
        { icon: Phone, label: "Phone", value: <a href={`tel:${detail.phone}`} className="text-blue-600 hover:underline">{detail.phone}</a> },
        { icon: Stethoscope, label: "Service", value: detail.service || "—" },
        { icon: CalendarDays, label: "Preferred date", value: detail.preferred_date ? formatDate(detail.preferred_date) : "—" },
        { icon: Clock, label: "Preferred time", value: detail.preferred_time || "—" },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="appt-detail-title">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h3 id="appt-detail-title" className="font-bold text-gray-900 text-lg">{name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Submitted {new Date(submittedAt).toLocaleString("en-CA", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {error ? (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          ) : !detail ? (
            <div className="flex justify-center py-10">
              <Loader2 size={22} className="animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-5">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rows.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs text-gray-400">{label}</dt>
                      <dd className="text-sm text-gray-800">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <MessageSquare size={13} /> Message
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-xl p-4 whitespace-pre-wrap leading-relaxed">
                  {detail.message || "No message provided."}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 border-t border-gray-100 rounded-b-2xl text-xs text-gray-500">
          <ShieldCheck size={13} className="text-emerald-600" />
          Opening this request is recorded in the access log.
        </div>
      </div>
    </div>
  );
}
