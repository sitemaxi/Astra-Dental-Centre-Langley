import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Phone, ChevronRight } from "lucide-react";
import { BUSINESS } from "../../data/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface HeroProps {
  title: string;
  subtitle?: string;
  showCTA?: boolean;
  compact?: boolean;
  breadcrumb?: BreadcrumbItem[];
  image?: string;
  images?: string[];
  mobileImages?: string[];
}

// Append Supabase image transform params to reduce download size.
// Only applied to Supabase storage URLs; all other URLs are returned as-is.
function withSize(url: string, width: number, quality = 75): string {
  if (!url) return url;
  if (!url.includes("supabase.co/storage")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}width=${width}&quality=${quality}`;
}

export default function Hero({
  title,
  subtitle,
  showCTA = true,
  compact = false,
  breadcrumb,
  image,
  images,
  mobileImages,
}: HeroProps) {
  const slideImages = images && images.length > 0 ? images : image ? [image] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slideImages.length < 2) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slideImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slideImages.length]);

  if (compact) {
    const compactImg = slideImages[0];
    return (
      <section className="relative bg-navy-950 pt-[145px] pb-8 sm:pb-14 overflow-hidden">
        {compactImg && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{ backgroundImage: `url(${compactImg})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 to-navy-900/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="flex items-center gap-1.5 text-xs text-navy-200 mb-5 flex-wrap">
              <Link to="/" className="hover:text-teal-400 transition-colors">Home</Link>
              {breadcrumb.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  <ChevronRight size={11} className="text-navy-600" />
                  {i === breadcrumb.length - 1 ? (
                    <span className="text-teal-400">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.href} className="hover:text-teal-400 transition-colors">{crumb.label}</Link>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-poppins text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base text-navy-200 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </div>
      </section>
    );
  }

  const hasMobileImages = mobileImages && mobileImages.length > 0;
  const lcpDesktop = slideImages[0] ?? null;
  const lcpMobile = hasMobileImages ? mobileImages![0] : lcpDesktop;

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/*
        LCP image: use <picture> so the browser only downloads the image
        appropriate for the current viewport (mobile vs desktop). Both
        variants get fetchPriority="high" so the browser prioritises them.
      */}
      {lcpDesktop && (
        <picture
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
          style={{ opacity: activeIndex === 0 ? 1 : 0, transition: "opacity 1s" }}
        >
          {/* Mobile source — only downloaded on narrow viewports */}
          {hasMobileImages && lcpMobile && (
            <source
              media="(max-width: 767px)"
              srcSet={withSize(lcpMobile, 828)}
            />
          )}
          {/* Desktop source */}
          <img
            src={withSize(lcpDesktop, 1600)}
            alt=""
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width="1600"
            height="900"
            className="w-full h-full object-cover object-center scale-105"
          />
        </picture>
      )}

      {/* Remaining carousel slides — loaded lazily via background-image */}
      {slideImages.slice(1).map((src, i) => (
        <div
          key={`d-${src}`}
          className={`absolute inset-0 bg-cover bg-center scale-105 transition-opacity duration-1000${hasMobileImages ? " hidden sm:block" : ""}`}
          style={{
            backgroundImage: `url(${withSize(src, 1600)})`,
            opacity: i + 1 === activeIndex ? 1 : 0,
          }}
        />
      ))}
      {hasMobileImages && mobileImages!.slice(1).map((src, i) => (
        <div
          key={`m-${src}`}
          className="absolute inset-0 bg-cover bg-top scale-105 transition-opacity duration-1000 sm:hidden"
          style={{
            backgroundImage: `url(${withSize(src, 828)})`,
            opacity: i + 1 === activeIndex ? 1 : 0,
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-2xl xl:max-w-3xl">
          {/* Location pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold text-white/90 tracking-widest uppercase">
              Langley, BC · Accepting New Patients
            </span>
          </div>

          <h1 className="font-poppins text-5xl sm:text-6xl lg:text-[68px] font-bold text-white leading-[1.08] tracking-tight mb-6">
            {title}
          </h1>

          {subtitle && (
            <p className="text-lg text-white/75 leading-relaxed max-w-xl mb-10">
              {subtitle}
            </p>
          )}

          {showCTA && (
            <>
              <div className="flex flex-wrap gap-4 mb-12">
                <Link to="/contact-us/" className="btn-teal !px-8 !py-4 !text-[13px] !font-semibold">
                  Book Your Appointment
                </Link>
                <a
                  href={`tel:${BUSINESS.phone}`}
                  className="btn-outline-white !px-8 !py-4 !text-[13px]"
                >
                  <Phone size={15} />
                  {BUSINESS.phone}
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6">
                {[
                  { num: "30+", label: "Years Experience" },
                  { num: "3,000+", label: "Patients Served" },
                  { num: "4.9★", label: "Google Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2.5">
                    <div className="w-px h-8 bg-white/20" />
                    <div>
                      <p className="font-poppins font-bold text-white text-base leading-none">{stat.num}</p>
                      <p className="text-white/50 text-[11px] mt-0.5 leading-none">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
