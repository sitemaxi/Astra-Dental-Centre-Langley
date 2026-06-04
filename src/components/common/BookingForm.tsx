import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Clock, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { trackFormSubmit } from "../../lib/analytics";

const SERVICES = [
  "General Dentistry (Includes Crowns)",
  "Cosmetic Dentistry",
  "Preventive Dentistry (Cleaning)",
  "Orthodontics (Braces & Invisalign)",
  "Endodontics (Root Canals)",
  "Oral Surgery (Extractions)",
  "Gum Surgery",
  "Prosthodontics (Crowns, Bridges & Dentures)",
  "Periodontics",
  "Children's Dentistry",
  "Botox & TMJ Therapy",
  "Dental Implants",
  "New Patient Exam",
  "Other",
];

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder:text-gray-300 bg-white";

// Clinic hours per day index (0=Sun, 1=Mon, ..., 6=Sat)
// null means closed
const CLINIC_HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,                             // Sunday — Closed
  1: { open: "10:00", close: "19:00" }, // Monday 10am–7pm
  2: { open: "09:00", close: "17:00" }, // Tuesday 9am–5pm
  3: { open: "09:00", close: "17:00" }, // Wednesday
  4: { open: "09:00", close: "17:00" }, // Thursday
  5: { open: "10:00", close: "19:00" }, // Friday 10am–7pm
  6: { open: "09:00", close: "17:00" }, // Saturday 9am–5pm
};

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseHHMM(str: string) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

function formatSlot(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function getSlotsForDay(dayIndex: number): string[] {
  const hours = CLINIC_HOURS[dayIndex];
  if (!hours) return [];
  const slots: string[] = [];
  const openMin = parseHHMM(hours.open);
  const closeMin = parseHHMM(hours.close);
  // Last bookable slot is 30 min before close
  for (let m = openMin; m <= closeMin - 30; m += 30) {
    slots.push(formatSlot(m));
  }
  return slots;
}

function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function getDayIndexFromDateString(dateStr: string): number {
  // Parse as local date to avoid timezone shift
  const [y, mo, d] = dateStr.split("-").map(Number);
  return new Date(y, mo - 1, d).getDay();
}

export default function BookingForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedDayIndex = form.date ? getDayIndexFromDateString(form.date) : null;
  const hoursForDay = selectedDayIndex !== null ? CLINIC_HOURS[selectedDayIndex] : null;
  const availableSlots = selectedDayIndex !== null ? getSlotsForDay(selectedDayIndex) : [];
  const isDayClosed = form.date !== "" && hoursForDay === null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setError("");
    if (name === "date") {
      setForm((prev) => ({ ...prev, date: value, time: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.date) { setError("Please select a preferred date."); return; }
    if (isDayClosed) { setError("The clinic is closed on that day. Please choose another date."); return; }
    if (!form.time) { setError("Please select a preferred time slot."); return; }

    setSubmitting(true);
    setError("");

    const { error: dbError } = await supabase.from("appointment_requests").insert({
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      phone: form.phone,
      service: form.service,
      preferred_date: form.date,
      preferred_time: form.time,
      message: form.message,
    });

    if (dbError) {
      setSubmitting(false);
      setError("Something went wrong. Please try again or call us directly.");
      return;
    }

    // Fire-and-forget email notification — does not block success flow
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-form-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        type: "appointment",
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          email: form.email,
          phone: form.phone,
          service: form.service,
          preferred_date: form.date,
          preferred_time: form.time,
          message: form.message,
        },
      }),
    }).catch(() => { /* email failure is silent — data is already saved */ });

    trackFormSubmit("appointment_booking");
    setSubmitting(false);
    navigate("/thankyou/", {
      state: {
        firstName: form.firstName,
        date: form.date,
        time: form.time,
        service: form.service,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">First Name</label>
          <input name="firstName" type="text" required value={form.firstName} onChange={handleChange}
            className={inputClass} placeholder="John" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Last Name</label>
          <input name="lastName" type="text" required value={form.lastName} onChange={handleChange}
            className={inputClass} placeholder="Doe" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Email Address</label>
          <input name="email" type="email" required value={form.email} onChange={handleChange}
            className={inputClass} placeholder="john@example.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Phone Number</label>
          <input name="phone" type="tel" required value={form.phone} onChange={handleChange}
            className={inputClass} placeholder="604-000-0000" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Service of Interest</label>
        <select name="service" required value={form.service} onChange={handleChange} className={inputClass}>
          <option value="">Select a service...</option>
          {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Date & Time row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <CalendarDays size={12} className="text-teal-500" /> Preferred Date
          </label>
          <input
            name="date"
            type="date"
            required
            min={getTodayString()}
            value={form.date}
            onChange={handleChange}
            className={inputClass}
          />
          {form.date && !isDayClosed && hoursForDay && (
            <p className="text-xs text-teal-600 mt-1.5 font-medium">
              {DAY_NAMES[selectedDayIndex!]} hours: {formatSlot(parseHHMM(hoursForDay.open))} – {formatSlot(parseHHMM(hoursForDay.close))}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <Clock size={12} className="text-teal-500" /> Preferred Time
          </label>
          <select
            name="time"
            required
            value={form.time}
            onChange={handleChange}
            disabled={!form.date || isDayClosed}
            className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <option value="">
              {!form.date ? "Select a date first" : isDayClosed ? "Clinic closed this day" : "Select a time..."}
            </option>
            {availableSlots.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {isDayClosed && (
        <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-600 leading-relaxed">
            The clinic is <span className="font-semibold">closed on Sundays</span>. Please select a Monday – Saturday date.
          </p>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Additional Notes <span className="normal-case font-normal text-gray-400">(optional)</span>
        </label>
        <textarea
          name="message"
          rows={3}
          value={form.message}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder="Any dental concerns, allergies, or notes for our team..."
        />
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">Please note:</span> Submitting this form is a request only — not a confirmed booking. Our team will contact you to confirm availability with Dr. Potluri.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || isDayClosed}
        className="btn-teal w-full !py-4 !text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Sending Request...
          </>
        ) : (
          "Request Appointment"
        )}
      </button>
    </form>
  );
}
