import React, { useRef } from "react";
import { cn } from "../../lib/utils";

interface HolographicCardProps {
  className?: string;
  children: React.ReactNode;
}

const HolographicCard = ({ className, children }: HolographicCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 14;
    const rotateY = (centerX - x) / 14;

    card.style.setProperty("--x", `${x}px`);
    card.style.setProperty("--y", `${y}px`);
    card.style.setProperty("--bg-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--bg-y", `${(y / rect.height) * 100}%`);
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    card.style.setProperty("--x", "50%");
    card.style.setProperty("--y", "50%");
    card.style.setProperty("--bg-x", "50%");
    card.style.setProperty("--bg-y", "50%");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(11,60,93,0.14)] cursor-default",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.1s ease, box-shadow 0.3s ease",
        willChange: "transform",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at var(--bg-x, 50%) var(--bg-y, 50%), rgba(13,148,136,0.07) 0%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default HolographicCard;
