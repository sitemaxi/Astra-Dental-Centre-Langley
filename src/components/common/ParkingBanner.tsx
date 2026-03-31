import { useState, useEffect, useRef, useCallback } from "react";
import { X, MapPin, Navigation, PlayCircle } from "lucide-react";

const DISMISS_KEY = "parking-banner-dismissed";
const PARKING_MAP_URL = "https://maps.app.goo.gl/VnpDUukWoqUDDRT26";

export default function ParkingBanner() {
  const [visible, setVisible] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  const closeVideo = useCallback(() => {
    setVideoOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeVideo();
    }
    if (videoOpen) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [videoOpen, closeVideo]);

  if (!visible) return null;

  return (
    <>
      <div className="fixed left-0 right-0 z-40 top-[84px] md:top-[124px] bg-teal-700 text-white shadow-md">
        {/* Mobile layout */}
        <div className="sm:hidden px-4 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={14} className="flex-shrink-0 text-teal-200 mt-0.5" />
              <p className="text-xs leading-snug">
                <span className="font-semibold">Parking Directions</span>
                <span> — Entrance from 20058 Industrial Ave.</span>
              </p>
            </div>
            <button
              onClick={dismiss}
              aria-label="Dismiss parking notice"
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full hover:bg-teal-600 transition-colors"
            >
              <X size={13} />
            </button>
          </div>
          <div className="flex gap-2 mt-2.5">
            <button
              onClick={() => setVideoOpen(true)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-white/70 text-white font-semibold text-xs px-3 py-2 rounded-full hover:bg-teal-600 transition-colors"
            >
              <PlayCircle size={12} />
             Watch video for parking directions
            </button>
            <a
              href={PARKING_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 bg-white text-teal-700 font-semibold text-xs px-3 py-2 rounded-full hover:bg-teal-50 transition-colors"
            >
              <Navigation size={12} />
              Get Directions
            </a>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:flex max-w-7xl mx-auto px-6 lg:px-8 py-2.5 items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <MapPin size={15} className="flex-shrink-0 text-teal-200" />
            <p className="text-sm leading-snug">
              <span className="font-semibold">Parking Directions</span>
              <span> — Parkade entrance located behind the building, accessible from 20058 Industrial Ave, Langley.</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setVideoOpen(true)}
              className="flex items-center gap-1.5 border border-white/70 text-white font-semibold text-xs px-3 py-1.5 rounded-full hover:bg-teal-600 transition-colors whitespace-nowrap"
            >
              <PlayCircle size={11} />
              See the Video
            </button>
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

      <div className="h-[72px] sm:h-10" />

      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeVideo}
        >
          <div
            className="relative w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeVideo}
              aria-label="Close video"
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X size={16} />
            </button>
            <video
              ref={videoRef}
              src="/Astra_Dental_Parking_Directions.mp4"
              controls
              autoPlay
              className="w-full aspect-video"
            />
          </div>
        </div>
      )}
    </>
  );
}
