import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Phone, Calendar, ClipboardList, ChevronRight, ArrowRight } from "lucide-react";
import SEOHead from "../components/SEOHead";
import { trackFbLead } from "../lib/analytics";
import { BUSINESS } from "../data/navigation";

interface BookingState {
  firstName?: string;
  date?: string;
  time?: string;
  service?: string;
}

export default function ThankYouPage() {
  const location = useLocation();
  const state = (location.state as BookingState) ?? {};
  const { firstName, date, time, service } = state;

  useEffect(() => {
    // Meta Pixel — Lead conversion
    trackFbLead();

    // Google Ads conversion
    // TODO: Replace AW-CONVERSION_ID/CONVERSION_LABEL with your actual Google Ads
    // conversion action ID from Google Ads → Tools → Conversions.
    // Format: AW-XXXXXXXXXX/XXXXXXXXXXXXXXXXXXXX
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-CONVERSION_ID/CONVERSION_LABEL",
      });
    }
  }, []);

  const formattedDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString("en-CA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <>
      <SEOHead
        title="Appointment Request Received | Astra Dental Centre"
        description="Thank you for contacting Astra Dental Centre in Langley, BC. We have received your appointment request and will be in touch shortly."
        noIndex
        canonicalPath="/thankyou/"
      />

      <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-24">
        <div className="max-w-lg w-full">
          {/* Success card */}
          <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10 text-center mb-6">
            <div className="w-18 h-18 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={44} className="text-teal-500" />
            </div>

            <h1 className="font-poppins text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
              {firstName ? `Thank You, ${firstName}!` : "Request Received!"}
            </h1>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              We've received your appointment request and our team will review Dr. Potluri's availability and contact you to confirm.
            </p>

            {formattedDate && time && (
              <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 mb-6 text-left">
                <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-3">Your Request Details</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-teal-800">
                    <Calendar size={14} className="flex-shrink-0 text-teal-500" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-teal-800">
                    <Phone size={14} className="flex-shrink-0 text-teal-500" />
                    <span>Around {time}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-8 text-left">
              <p className="text-xs text-amber-700 leading-relaxed">
                <span className="font-semibold">Please note:</span> This is a request only — not a confirmed booking. We will call or email you to confirm your appointment time.
              </p>
            </div>

            {service === "New Patient Exam" && (
              <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 mb-6 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList size={16} className="text-teal-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-teal-800">Complete Your New Patient Form</p>
                </div>
                <p className="text-xs text-teal-700 leading-relaxed mb-3">
                  Save time at your first visit by completing your medical questionnaire online before your appointment.
                </p>
                <Link
                  to="/patient-info/new-patient-form/"
                  className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-teal-700 transition-colors"
                >
                  Fill Out New Patient Form
                  <ChevronRight size={13} />
                </Link>
              </div>
            )}

            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-navy-900 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-navy-800 transition-colors"
            >
              Back to Home
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-2xl shadow-card p-6 text-center">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide font-semibold">Need to reach us?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-surface border border-gray-100 text-navy-900 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                <Phone size={13} className="text-teal-500" />
                {BUSINESS.phone}
              </a>
              <Link
                to="/contact-us/"
                className="inline-flex items-center justify-center gap-2 bg-surface border border-gray-100 text-navy-900 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                <Calendar size={13} className="text-teal-500" />
                Book Another Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
