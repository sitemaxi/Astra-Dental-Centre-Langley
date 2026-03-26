import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useId } from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "compact";
  imageUrl?: string | null;
  imageAlt?: string;
}

function GridPattern({ width, height, x, y, squares, ...props }: {
  width: number;
  height: number;
  x: string;
  y: string;
  squares: number[][];
  className?: string;
}) {
  const patternId = useId();
  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(([sx, sy]) => (
          <rect
            strokeWidth="0"
            key={`${sx}-${sy}`}
            width={width + 1}
            height={height + 1}
            x={sx * width}
            y={sy * height}
          />
        ))}
      </svg>
    </svg>
  );
}

function CardGrid() {
  const squares = [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r from-navy-50/30 to-teal-50/30 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
        <GridPattern
          width={20}
          height={20}
          x="-12"
          y="4"
          squares={squares}
          className="absolute inset-0 h-full w-full mix-blend-overlay stroke-navy-200/40 fill-navy-100/40"
        />
      </div>
    </div>
  );
}

export default function ServiceCard({ title, description, href, icon, variant = "default", imageUrl, imageAlt }: ServiceCardProps) {
  if (variant === "compact") {
    return (
      <Link
        to={href}
        className="flex items-center justify-between px-4 py-3.5 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-card transition-all duration-200 group service-card"
      >
        <span className="text-sm font-medium text-gray-700 group-hover:text-navy-900 transition-colors">
          {title}
        </span>
        <ArrowRight size={14} className="text-gray-300 group-hover:text-teal-500 transition-all duration-200 group-hover:translate-x-1 flex-shrink-0" />
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className="service-card relative flex flex-col bg-gradient-to-b from-navy-50 to-white rounded-2xl border border-navy-100/80 hover:border-teal-300/60 shadow-card hover:shadow-card-hover group overflow-hidden"
    >
      {imageUrl ? (
        <div className="relative w-full h-40 overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt || title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
        </div>
      ) : (
        <CardGrid />
      )}
      <div className="relative z-10 flex flex-col flex-1 p-6">
        <h3 className="font-poppins text-[15px] font-bold text-navy-900 mb-2 leading-snug group-hover:text-teal-700 transition-colors">
          {title}
        </h3>
        <p className="text-[13px] text-gray-500 leading-relaxed flex-1">
          {description}
        </p>
        <div className="flex items-center gap-1.5 mt-5 text-[11px] font-semibold text-teal-600 group-hover:gap-2.5 transition-all duration-200 uppercase tracking-widest">
          Learn More
          <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
}
