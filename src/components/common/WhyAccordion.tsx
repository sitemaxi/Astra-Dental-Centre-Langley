import { useState } from "react";

const panels = [
  {
    id: 1,
    label: "Family Dentistry",
    imageUrl:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 2,
    label: "Modern Technology",
    imageUrl:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
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
    imageUrl:
      "/Bright-smiles_Astra-Dental-Langley.png",
  },
];

interface PanelProps {
  label: string;
  imageUrl: string;
  isActive: boolean;
  onMouseEnter: () => void;
}

function AccordionPanel({ label, imageUrl, isActive, onMouseEnter }: PanelProps) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out flex-shrink-0 h-[420px] ${
        isActive ? "flex-[4]" : "flex-[0.5]"
      }`}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={imageUrl}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

      <span
        className={`absolute text-white text-sm font-semibold whitespace-nowrap transition-all duration-500 ease-in-out ${
          isActive
            ? "bottom-5 left-5 rotate-0 opacity-100"
            : "bottom-20 left-1/2 -translate-x-1/2 rotate-90 opacity-80"
        }`}
      >
        {isActive && (
          <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2 align-middle" />
        )}
        {label}
      </span>
    </div>
  );
}

export default function WhyAccordion() {
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <div className="flex flex-row gap-2 w-full h-[420px]">
      {panels.map((panel, index) => (
        <AccordionPanel
          key={panel.id}
          label={panel.label}
          imageUrl={panel.imageUrl}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
