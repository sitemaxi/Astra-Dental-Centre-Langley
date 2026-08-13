export interface ServiceItem {
  title: string;
  slug: string;
  description: string;
  categorySlug: string;
}

export interface ServiceCategory {
  title: string;
  slug: string;
  categoryPath: string;
  description: string;
  icon: string;
  services: ServiceItem[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    title: "General Dentistry (Includes Crowns)",
    slug: "general-dentistry",
    categoryPath: "/langley-dental-services/general-dentistry/",
    description: "Comprehensive dental care for patients of all ages, addressing everyday oral health needs.",
    icon: "Stethoscope",
    services: [
      {
        title: "White Fillings",
        slug: "composite-fillings",
        categorySlug: "general-dentistry",
        description: "Tooth-coloured composite resin fillings that restore the natural look and function of your teeth.",
      },
      {
        title: "Dentures",
        slug: "dentures",
        categorySlug: "general-dentistry",
        description: "Custom-fitted removable appliances to replace missing teeth and restore your smile.",
      },
      {
        title: "Inlay Restorations",
        slug: "inlay-restorations",
        categorySlug: "general-dentistry",
        description: "Precision-crafted restorations fitted within the cusps of a damaged tooth.",
      },
      {
        title: "Onlay Restorations",
        slug: "onlay-restorations",
        categorySlug: "general-dentistry",
        description: "Extended restorations covering one or more cusps for larger areas of damage.",
      },
      {
        title: "Bite Guards",
        slug: "bite-guards",
        categorySlug: "general-dentistry",
        description: "Custom-fitted night guards to protect teeth from grinding and clenching.",
      },
    ],
  },
  {
    title: "Cosmetic Dentistry",
    slug: "cosmetic-dentistry",
    categoryPath: "/langley-dental-services/cosmetic-dentistry/",
    description: "Smile-enhancing treatments designed to improve the appearance of your teeth and boost your confidence.",
    icon: "Sparkles",
    services: [
      {
        title: "Bridges",
        slug: "bridges",
        categorySlug: "cosmetic-dentistry",
        description: "Fixed prosthetic devices that bridge the gap created by one or more missing teeth.",
      },
      {
        title: "Crowns",
        slug: "crowns",
        categorySlug: "cosmetic-dentistry",
        description: "Tooth-shaped caps that restore the shape, size, and strength of damaged teeth.",
      },
      {
        title: "Zoom Teeth Whitening",
        slug: "zoom-teeth-whitening",
        categorySlug: "cosmetic-dentistry",
        description: "Professional in-office whitening treatment for dramatically brighter teeth in one visit.",
      },
      {
        title: "Porcelain Veneers",
        slug: "porcelain-veneers",
        categorySlug: "cosmetic-dentistry",
        description: "Ultra-thin porcelain shells bonded to the front surface of teeth for a perfect smile.",
      },
      {
        title: "CEREC Dentistry",
        slug: "cerec-dentistry",
        categorySlug: "cosmetic-dentistry",
        description: "Same-day ceramic restorations using advanced CAD/CAM technology.",
      },
    ],
  },
  {
    title: "Preventive Dentistry (Cleaning)",
    slug: "preventive-dentistry",
    categoryPath: "/langley-dental-services/preventive-dentistry/",
    description: "Proactive treatments to maintain oral health and prevent dental problems before they start.",
    icon: "ShieldCheck",
    services: [
      {
        title: "Dental Exams and Cleanings",
        slug: "dental-exams-and-cleanings",
        categorySlug: "preventive-dentistry",
        description: "Regular professional cleanings and comprehensive exams to keep your smile healthy.",
      },
      {
        title: "Dental X-Rays",
        slug: "dental-x-rays",
        categorySlug: "preventive-dentistry",
        description: "Digital radiographs that provide a detailed view of teeth, bone, and surrounding tissues.",
      },
    ],
  },
  {
    title: "Orthodontics (Braces & Invisalign)",
    slug: "orthodontics",
    categoryPath: "/langley-dental-services/orthodontics/",
    description: "Teeth straightening solutions for children and adults to achieve a properly aligned, beautiful smile.",
    icon: "AlignCenter",
    services: [
      {
        title: "Braces for Teens & Kids",
        slug: "braces-for-kids",
        categorySlug: "orthodontics",
        description: "Early orthodontic treatment to guide jaw development and correct misalignment.",
      },
      {
        title: "Braces for Adults",
        slug: "braces-for-adults",
        categorySlug: "orthodontics",
        description: "Discreet orthodontic options designed to fit the lifestyle of adult patients.",
      },
      {
        title: "Invisalign / Clear Aligners",
        slug: "invisalign",
        categorySlug: "orthodontics",
        description: "Clear removable aligners that gradually straighten teeth without metal brackets.",
      },
    ],
  },
  {
    title: "Endodontics (Root Canals)",
    slug: "endodontics",
    categoryPath: "/langley-dental-services/endodontics/",
    description: "Specialized care for the inner tissue of teeth, focused on relieving pain and saving natural teeth.",
    icon: "Activity",
    services: [
      {
        title: "Cracked Teeth Treatment",
        slug: "cracked-teeth-treatment",
        categorySlug: "endodontics",
        description: "Advanced treatment options to repair and preserve cracked or fractured teeth.",
      },
      {
        title: "Root Amputation",
        slug: "root-amputation",
        categorySlug: "endodontics",
        description: "Surgical removal of one root from a multi-rooted tooth to preserve the remaining structure.",
      },
      {
        title: "Root Canal Treatment",
        slug: "root-canal-treatment",
        categorySlug: "endodontics",
        description: "Removal of infected pulp to relieve pain and save a severely damaged tooth.",
      },
      {
        title: "Endodontic Surgery",
        slug: "endodontic-surgery",
        categorySlug: "endodontics",
        description: "Surgical procedures including apicoectomy to treat persistent infections.",
      },
    ],
  },
  {
    title: "Oral Surgery (Extractions)",
    slug: "oral-surgery",
    categoryPath: "/langley-dental-services/oral-surgery/",
    description: "Surgical procedures to address complex dental conditions requiring expert care.",
    icon: "Scissors",
    services: [
      {
        title: "Wisdom Teeth Extractions",
        slug: "wisdom-teeth-extractions",
        categorySlug: "oral-surgery",
        description: "Safe removal of problematic wisdom teeth to prevent crowding and infection.",
      },
      {
        title: "Bone Grafting",
        slug: "bone-grafting",
        categorySlug: "oral-surgery",
        description: "Rebuilding bone density in the jaw to support dental implants or treat bone loss.",
      },
      {
        title: "Dental Implants",
        slug: "dental-implants",
        categorySlug: "oral-surgery",
        description: "Titanium implants that serve as permanent roots for replacement teeth.",
      },
      {
        title: "Impacted Canines",
        slug: "impacted-canines",
        categorySlug: "oral-surgery",
        description: "Surgical exposure and orthodontic guidance of teeth that failed to erupt properly.",
      },
    ],
  },
  {
    title: "Gum Surgery",
    slug: "gum-surgery",
    categoryPath: "/langley-dental-services/gum-surgery/",
    description: "Surgical treatments to restore and maintain the health of your gum tissue.",
    icon: "Heart",
    services: [],
  },
  {
    title: "Prosthodontics (Crowns, Bridges & Dentures)",
    slug: "prosthodontics",
    categoryPath: "/langley-dental-services/prosthodontics/",
    description: "Specialized restoration and replacement of teeth — crowns, bridges, and dentures to restore your smile and function.",
    icon: "Star",
    services: [
      {
        title: "Dental Crowns",
        slug: "crowns",
        categorySlug: "cosmetic-dentistry",
        description: "Custom-made ceramic or porcelain caps that protect and restore damaged, cracked, or heavily filled teeth.",
      },
      {
        title: "Dental Bridges",
        slug: "bridges",
        categorySlug: "cosmetic-dentistry",
        description: "Fixed restorations that replace one or more missing teeth by anchoring to neighbouring healthy teeth.",
      },
      {
        title: "Dentures",
        slug: "dentures",
        categorySlug: "general-dentistry",
        description: "Full or partial removable appliances to replace multiple missing teeth comfortably and affordably.",
      },
    ],
  },
  {
    title: "Periodontics",
    slug: "periodontics",
    categoryPath: "/langley-dental-services/periodontics/",
    description: "Prevention, diagnosis, and treatment of gum disease and conditions affecting the supporting structures of teeth.",
    icon: "Leaf",
    services: [
      {
        title: "Professional Teeth Cleaning",
        slug: "dental-exams-and-cleanings",
        categorySlug: "preventive-dentistry",
        description: "Routine deep cleaning to remove plaque and tartar buildup that regular brushing can't reach.",
      },
      {
        title: "Gum Surgery",
        slug: "gum-surgery",
        categorySlug: "gum-surgery",
        description: "Surgical pocket reduction and gum grafting procedures for advanced periodontal disease.",
      },
    ],
  },
  {
    title: "Children's Dentistry",
    slug: "childrens-dentistry",
    categoryPath: "/langley-dental-services/childrens-dentistry/",
    description: "Gentle, child-friendly dental care focused on building healthy habits from an early age.",
    icon: "Smile",
    services: [
      {
        title: "Children's Dental Exams & Cleanings",
        slug: "dental-exams-and-cleanings",
        categorySlug: "preventive-dentistry",
        description: "Gentle routine checkups and professional cleanings tailored for children of all ages.",
      },
      {
        title: "Orthodontics for Children",
        slug: "braces-for-kids",
        categorySlug: "orthodontics",
        description: "Early orthodontic treatment to guide jaw development and correct misalignment in children.",
      },
      {
        title: "White Fillings for Kids",
        slug: "composite-fillings",
        categorySlug: "general-dentistry",
        description: "Tooth-coloured fillings that treat cavities gently and restore young smiles naturally.",
      },
    ],
  },
  {
    title: "Dental Implants",
    slug: "dental-implants-langley",
    categoryPath: "/langley-dental-services/dental-implants-langley/",
    description: "Permanent, natural-looking tooth replacement using titanium implants anchored directly into the jawbone.",
    icon: "Zap",
    services: [],
  },
];

export const getServiceBySlug = (categorySlug: string, serviceSlug: string): ServiceItem | undefined => {
  const category = serviceCategories.find((c) => c.slug === categorySlug);
  return category?.services.find((s) => s.slug === serviceSlug);
};

export const getCategoryBySlug = (slug: string): ServiceCategory | undefined => {
  return serviceCategories.find((c) => c.slug === slug);
};
