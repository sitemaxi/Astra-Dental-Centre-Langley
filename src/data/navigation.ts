export const BUSINESS = {
  name: "Astra Dental Centre",
  phone: "604-533-8806",
  email: "reception@astradentalcentre.com",
  address: "Unit 120, 20061 Fraser Hwy",
  city: "Langley, BC",
  fullAddress: "Unit 120, 20061 Fraser Hwy, Langley, BC",
  hours: {
    monday: "10:00 AM – 7:00 PM",
    tuesday: "9:00 AM – 5:00 PM",
    wednesday: "9:00 AM – 5:00 PM",
    thursday: "9:00 AM – 5:00 PM",
    friday: "10:00 AM – 7:00 PM",
    saturday: "9:00 AM – 5:00 PM",
    sunday: "Closed",
  },
};

export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-the-dentist/" },
  {
    label: "Services",
    href: "/langley-dental-services/",
    children: [
      { label: "General Dentistry", href: "/langley-dental-services/general-dentistry/" },
      { label: "Cosmetic Dentistry", href: "/langley-dental-services/cosmetic-dentistry/" },
      { label: "Preventive Dentistry", href: "/langley-dental-services/preventive-dentistry/" },
      { label: "Orthodontics", href: "/langley-dental-services/orthodontics/" },
      { label: "Endodontics", href: "/langley-dental-services/endodontics/" },
      { label: "Oral Surgery", href: "/langley-dental-services/oral-surgery/" },
      { label: "Gum Surgery", href: "/langley-dental-services/gum-surgery/" },
      { label: "Prosthodontics", href: "/langley-dental-services/prosthodontics/" },
      { label: "Periodontics", href: "/langley-dental-services/periodontics/" },
      { label: "Children's Dentistry", href: "/langley-dental-services/childrens-dentistry/" },
    ],
  },
  {
    label: "Patient Info",
    href: "/patient-info/",
    children: [
      { label: "New Patient Form", href: "/patient-info/new-patient-form/" },
    ],
  },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact-us/" },
];
