import { useState, useEffect } from "react";
import { X, MapPin, Navigation } from "lucide-react";

const DISMISS_KEY = "parking-banner-dismissed";
const PARKING_MAP_URL = "https://maps.google.com/?q=20058+Industrial+Ave+Langley+BC";

export default function ParkingBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  if (!visible) return null;

  return (
    <>
      {/* Fixed banner sits directly below the header */}
      {/* Desktop header: top bar (~40px) + main nav (84px) = ~124px */}
      {/* Mobile header: main nav only (84px) */}
      <div className="fixed left-0 right-0 z-40 top-[84px] md:top-[124px] bg-teal-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <MapPin size={15} className="flex-shrink-0 text-teal-200" />
            <p className="text-sm leading-snug">
              <span className="font-semibold">Parking Directions</span>
              <span className="hidden sm:inline"> — Parkade entrance located behind the building, accessible from 20058 Industrial Ave, Langley.</span>
              <span className="sm:hidden"> — Entrance from 20058 Industrial Ave.</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={PARKING_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white text-teal-700 font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors whitespace-nowrap"
            >
              <Navigation size={11} />
              Get Directions
            </a>
            <button
              onClick={dismiss}
              aria-label="Dismiss parking notice"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-teal-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Spacer so page content isn't hidden behind the fixed banner (~40px banner height) */}
      <div className="h-10" />
    </>
  );
}
