import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getActiveGalleryImages, type ClinicGalleryImage } from "../../lib/clinicGalleryApi";

const STATIC_FALLBACK: ClinicGalleryImage[] = [
  { id: "1", image_url: "/Astra_Dental_Langley_Office.png", alt_text: "Astra Dental Langley office exterior", caption: "Our Langley Clinic", sort_order: 0, is_active: true, created_at: "", updated_at: "" },
  { id: "2", image_url: "/Astra_Dental_Langley_Reception.jpeg", alt_text: "Astra Dental Langley reception area", caption: "Welcome Reception", sort_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "3", image_url: "/Astra_Dental_Langley_Comfortable_Treatment_Rooms2.png", alt_text: "Astra Dental comfortable treatment room", caption: "Modern Treatment Rooms", sort_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "4", image_url: "/Astra_Dental_Langley_Comfortable_Treatment_Rooms3.png", alt_text: "Astra Dental treatment room with advanced equipment", caption: "Advanced Equipment", sort_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "5", image_url: "/Astra_Dental_Langley_Treatment_Rooms.jpg", alt_text: "Astra Dental Langley treatment room", caption: "Patient Comfort First", sort_order: 4, is_active: true, created_at: "", updated_at: "" },
];

const AUTO_INTERVAL = 4000;

export default function ClinicGallerySection() {
  const [images, setImages] = useState<ClinicGalleryImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getActiveGalleryImages().then((data) => {
      setImages(data.length > 0 ? data : STATIC_FALLBACK);
    });
  }, []);

  const goTo = useCallback(
    (index: number, dir: "left" | "right") => {
      if (animating || images.length === 0) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 420);
    },
    [animating, images.length]
  );

  const next = useCallback(() => {
    const idx = (current + 1) % images.length;
    goTo(idx, "left");
  }, [current, images.length, goTo]);

  const prev = useCallback(() => {
    const idx = (current - 1 + images.length) % images.length;
    goTo(idx, "right");
  }, [current, images.length, goTo]);

  useEffect(() => {
    if (paused || images.length === 0) return;
    timerRef.current = setTimeout(next, AUTO_INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, paused, images.length, next]);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  if (images.length === 0) return null;

  const slideClass = animating
    ? direction === "left"
      ? "translate-x-[-100%] opacity-0"
      : "translate-x-[100%] opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <section className="bg-white py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col items-center text-center mb-12">
          <span className="inline-block bg-teal-50 text-teal-700 text-[11px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-teal-100 mb-5">
            Our Clinic
          </span>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl lg:text-[2.75rem] text-navy-900 leading-tight mb-5">
            Experience Our Modern<br className="hidden sm:block" /> Dental Facility
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl">
            At Astra Dental, we combine advanced technology with a comfortable, welcoming environment. Our clinic is designed to deliver exceptional care for patients of all ages, from routine visits to advanced treatments.
          </p>
        </div>

        <div
          className="relative group"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="relative w-full overflow-hidden rounded-xl shadow-[0_8px_40px_rgba(11,60,93,0.18)]"
            style={{ aspectRatio: "16/9" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((img, i) => (
              <div
                key={img.id}
                className={`absolute inset-0 transition-all duration-[420ms] ease-in-out ${
                  i === current ? slideClass : "opacity-0 pointer-events-none"
                }`}
                aria-hidden={i !== current}
              >
                <img
                  src={img.image_url}
                  alt={img.alt_text}
                  loading="lazy"
                  className={`w-full h-full object-cover object-center transition-transform duration-[4000ms] ease-out ${
                    i === current && !animating ? "scale-[1.04]" : "scale-100"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
                {img.caption && (
                  <div className="absolute bottom-5 left-5">
                    <span className="bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 tracking-wide">
                      {img.caption}
                    </span>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/35 hover:scale-105 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/35 hover:scale-105 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "left" : "right")}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2 bg-teal-600"
                    : "w-2 h-2 bg-navy-200 hover:bg-navy-400"
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
