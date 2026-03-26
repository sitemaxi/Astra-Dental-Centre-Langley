import { Link } from "react-router-dom";
import { Phone, Calendar, ArrowRight } from "lucide-react";
import { BUSINESS } from "../../data/navigation";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  variant?: "dark" | "light" | "gradient";
}

export default function CTASection({
  title = "Ready to Book Your Appointment?",
  subtitle = "Join thousands of happy patients in Langley. Our team is ready to help you achieve the healthy, confident smile you deserve.",
  variant = "dark",
}: CTASectionProps) {
  if (variant === "light") {
    return (
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-card p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="section-label mb-4">Get Started Today</span>
              <h2 className="font-poppins text-2xl md:text-3xl font-bold text-navy-900 leading-tight mb-3">
                {title}
              </h2>
              <p className="text-gray-500 leading-relaxed text-sm">
                {subtitle}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link to="/contact-us/" className="btn-teal whitespace-nowrap">
                <Calendar size={15} />
                Book Appointment
              </Link>
              <a href={`tel:${BUSINESS.phone}`} className="btn-primary whitespace-nowrap">
                <Phone size={15} />
                {BUSINESS.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "gradient") {
    return (
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-section-gradient" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
            {title}
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            {subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact-us/" className="btn-teal !px-8 !py-4">
              <Calendar size={15} />
              Book an Appointment
            </Link>
            <a href={`tel:${BUSINESS.phone}`} className="btn-outline-white !px-8 !py-4">
              <Phone size={15} />
              {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 bg-navy-950 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-700/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              Start Today
            </span>
            <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">
              {title}
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-lg">
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              to="/contact-us/"
              className="group flex items-center justify-between bg-teal-600 hover:bg-teal-500 text-white font-semibold px-7 py-5 rounded-2xl transition-all duration-200 hover:shadow-[0_8px_30px_rgba(13,148,136,0.4)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Calendar size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">Book Your Appointment</p>
                  <p className="text-xs text-teal-100/80">Fill out our quick form</p>
                </div>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={`tel:${BUSINESS.phone}`}
              className="group flex items-center justify-between bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold px-7 py-5 rounded-2xl transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Phone size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{BUSINESS.phone}</p>
                  <p className="text-xs text-white/50">Call our front desk</p>
                </div>
              </div>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
