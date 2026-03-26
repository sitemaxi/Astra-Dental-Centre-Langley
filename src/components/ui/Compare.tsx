import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { SparklesCore } from "./SparklesCore";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
  label?: string;
}

export const Compare = ({
  firstImage = "",
  secondImage = "",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
  label,
}: CompareProps) => {
  const [sliderXPercent, setSliderXPercent] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startAutoplay = useCallback(() => {
    if (!autoplay) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = (elapsedTime % (autoplayDuration * 2)) / autoplayDuration;
      const percentage = progress <= 1 ? progress * 100 : (2 - progress) * 100;
      setSliderXPercent(percentage);
      autoplayRef.current = setTimeout(animate, 16);
    };
    animate();
  }, [autoplay, autoplayDuration]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearTimeout(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  function mouseEnterHandler() {
    setIsMouseOver(true);
    stopAutoplay();
  }

  function mouseLeaveHandler() {
    setIsMouseOver(false);
    if (slideMode === "hover") {
      setSliderXPercent(initialSliderPercentage);
    }
    if (slideMode === "drag") {
      setIsDragging(false);
    }
    startAutoplay();
  }

  const handleStart = useCallback(
    (_clientX: number) => {
      if (slideMode === "drag") {
        setIsDragging(true);
      }
    },
    [slideMode]
  );

  const handleEnd = useCallback(() => {
    if (slideMode === "drag") {
      setIsDragging(false);
    }
  }, [slideMode]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return;
      if (slideMode === "hover" || (slideMode === "drag" && isDragging)) {
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percent = (x / rect.width) * 100;
        requestAnimationFrame(() => {
          setSliderXPercent(Math.max(0, Math.min(100, percent)));
        });
      }
    },
    [slideMode, isDragging]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => handleStart(e.clientX),
    [handleStart]
  );
  const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => handleMove(e.clientX),
    [handleMove]
  );
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) handleStart(e.touches[0].clientX);
    },
    [handleStart, autoplay]
  );
  const handleTouchEnd = useCallback(() => {
    if (!autoplay) handleEnd();
  }, [handleEnd, autoplay]);
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!autoplay) handleMove(e.touches[0].clientX);
    },
    [handleMove, autoplay]
  );

  return (
    <div className="w-full">
      <div
        ref={sliderRef}
        className={cn("w-full overflow-hidden rounded-2xl relative", className)}
        style={{ cursor: slideMode === "drag" ? "grab" : "col-resize" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={mouseLeaveHandler}
        onMouseEnter={mouseEnterHandler}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        <AnimatePresence initial={false}>
          <motion.div
            className="h-full w-px absolute top-0 m-auto z-30 bg-gradient-to-b from-transparent from-[5%] via-teal-500 to-[95%] to-transparent"
            style={{ left: `${sliderXPercent}%`, top: "0", zIndex: 40 }}
            transition={{ duration: 0 }}
          >
            <div className="w-36 h-full [mask-image:radial-gradient(100px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-teal-400 via-transparent to-transparent z-20 opacity-50" />
            <div className="w-10 h-1/2 [mask-image:radial-gradient(50px_at_left,white,transparent)] absolute top-1/2 -translate-y-1/2 left-0 bg-gradient-to-r from-cyan-400 via-transparent to-transparent z-10 opacity-100" />
            <div className="w-10 h-3/4 top-1/2 -translate-y-1/2 absolute -right-10 [mask-image:radial-gradient(100px_at_left,white,transparent)]">
              <MemoizedSparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={1200}
                className="w-full h-full"
                particleColor="#5eead4"
              />
            </div>
            {showHandlebar && (
              <div className="h-8 w-8 rounded-full top-1/2 -translate-y-1/2 bg-white z-30 -right-4 absolute flex items-center justify-center shadow-lg border border-teal-100">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-teal-600">
                  <path d="M5 8H11M5 8L3 6M5 8L3 10M11 8L13 6M11 8L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="overflow-hidden w-full h-full relative z-20 pointer-events-none">
          <AnimatePresence initial={false}>
            {firstImage ? (
              <motion.div
                className={cn(
                  "absolute inset-0 z-20 flex-shrink-0 w-full h-full select-none overflow-hidden",
                  firstImageClassName
                )}
                style={{ clipPath: `inset(0 ${100 - sliderXPercent}% 0 0)` }}
                transition={{ duration: 0 }}
              >
                <img
                  alt="After treatment"
                  src={firstImage}
                  className={cn(
                    "absolute inset-0 z-20 flex-shrink-0 w-full h-full select-none object-cover",
                    firstImageClassName
                  )}
                  draggable={false}
                />
                <div className="absolute top-3 left-3 bg-teal-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-30 tracking-wide">
                  AFTER
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false}>
          {secondImage ? (
            <motion.div className="absolute inset-0 z-[19] w-full h-full select-none">
              <img
                className={cn(
                  "absolute inset-0 z-[19] w-full h-full select-none object-cover",
                  secondImageClassname
                )}
                alt="Before treatment"
                src={secondImage}
                draggable={false}
              />
              <div className="absolute top-3 right-3 bg-navy-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-30 tracking-wide">
                BEFORE
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-center pb-2 pointer-events-none">
          <span className="text-[10px] text-white/60 font-medium select-none">
            {slideMode === "hover" ? "Hover to compare" : "Drag to compare"}
          </span>
        </div>
      </div>

      {label && (
        <div className="px-4 py-2.5 bg-surface rounded-b-2xl -mt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium">{label}</p>
        </div>
      )}
    </div>
  );
};

const MemoizedSparklesCore = React.memo(SparklesCore);
