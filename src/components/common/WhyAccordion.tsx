import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const panels = [
  {
    id: 1,
    label: "Advanced Digital Dentistry",
    imageUrl:
      "https://gyqodvtskytuzifinoxq.supabase.co/storage/v1/object/public/blog-images/clinic-gallery/1774748369573-1774748369573.jpg",
  },
  {
    id: 2,
    label: "Modern Treatment Rooms",
    imageUrl: "/Astra_Dental_Langley_Comfortable_Treatment_Rooms2.png",
  },
  {
    id: 3,
    label: "Comfortable Care",
    imageUrl:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 5,
    label: "Bright Smiles",
    imageUrl: "/Bright-smiles_Astra-Dental-Langley.png",
  },
];

const INTERVAL = 4000;
const FADE_MS = 600;

export default function WhyAccordion() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (index === current || fading) return;
      setFading(true);
      setTimeout(() => {
        setCurrent(index);
        setFading(false);
      }, FADE_MS);
    },
    [current, fading]
  );

  const next = useCallback(() => {
    goTo((current + 1) % panels.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + panels.length) % panels.length);
  }, [current, goTo]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, INTERVAL);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, paused, next]);

  const active = panels[current];

  return (
    <div
      className="relative w-full h-[420px] rounded-2xl overflow-hidden group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {panels.map((panel, i) => (
        <div
          key={panel.id}
          className="absolute inset-0"
          style={{
            opacity: i === current ? (fading ? 0 : 1) : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
            pointerEvents: i === current ? "auto" : "none",
          }}
        >
          <img
            src={panel.imageUrl}
            alt={panel.label}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
        <span className="flex items-center gap-2 text-white text-sm font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400" />
          {active.label}
        </span>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/35 z-10"
        aria-label="Previous image"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/35 z-10"
        aria-label="Next image"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {panels.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "w-5 h-2 bg-teal-400" : "w-2 h-2 bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
