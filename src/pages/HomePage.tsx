import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle, ArrowRight,
  Stethoscope, Sparkles, ShieldCheck, AlignCenter,
  Activity, Scissors, Heart, Star, Leaf, Smile,
  BadgeCheck, ExternalLink, ChevronDown,
} from "lucide-react";
import Hero from "../components/common/Hero";
import CTASection from "../components/common/CTASection";
import ServiceCard from "../components/common/ServiceCard";
import DoctorBio from "../components/common/DoctorBio";
import Testimonials from "../components/common/Testimonials";
import WhyAccordion from "../components/common/WhyAccordion";
import ClinicGallerySection from "../components/common/ClinicGallerySection";
import { serviceCategories } from "../data/services";
import { BUSINESS } from "../data/navigation";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { supabase } from "../lib/supabase";

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope size={18} />,
  Sparkles: <Sparkles size={18} />,
  ShieldCheck: <ShieldCheck size={18} />,
  AlignCenter: <AlignCenter size={18} />,
  Activity: <Activity size={18} />,
  Scissors: <Scissors size={18} />,
  Heart: <Heart size={18} />,
  Star: <Star size={18} />,
  Leaf: <Leaf size={18} />,
  Smile: <Smile size={18} />,
};

const whyChooseUs = [
  "Comprehensive care for the whole family",
  "State-of-the-art dental technology",
  "CEREC same-day ceramic restorations",
  "Invisalign certified provider",
  "Direct billing to major insurance plans",
  "Welcoming, anxiety-free environment",
];

const FAQ_ITEMS = [
  {
    question: "Do you offer direct billing to insurance?",
    answer: "Yes, we offer direct billing with all major insurance providers to make your visit as convenient as possible.",
  },
  {
    question: "What ages do you treat?",
    answer: "We provide dental care for patients of all ages from 7 years and up, including teens, adults, and seniors.",
  },
  {
    question: "Do you accept the Canada Dental Care Plan (CDCP)?",
    answer: "Yes, we accept the Canada Dental Care Plan. Please contact our team to confirm your eligibility and coverage details.",
  },
  {
    question: "Are you accepting new patients?",
    answer: "Yes, we are always happy to welcome new patients and families to our clinic.",
  },
  {
    question: "What dental services do you offer?",
    answer: "We provide a full range of dental services including general dentistry, cosmetic treatments, preventive care, orthodontics, and restorative procedures.",
  },
  {
    question: "How often should I visit the dentist?",
    answer: "Most patients benefit from a dental checkup and cleaning every six months. Your dentist may recommend a different schedule based on your oral health needs.",
  },
  {
    question: "Do you offer emergency dental care?",
    answer: "Yes, we provide emergency dental services. Please contact us as soon as possible if you are experiencing pain, swelling, or a dental injury.",
  },
  {
    question: "Is parking available at your clinic?",
    answer: "Yes, convenient parking is available for all patients visiting our Langley clinic. Parking Directions – Parkade entrance located behind the building, accessible from 20058 Industrial Ave, Langley.",
  },
  {
    question: "Where are you located?",
    answer: "We are located in Langley, BC, and proudly serve patients from Langley and surrounding areas including Surrey, White Rock, and Delta.",
  },
  {
    question: "How can I book an appointment?",
    answer: "You can book an appointment by calling our clinic or using our online booking form. Our team is happy to assist you in scheduling a convenient time.",
  },
];

function FAQSection() {
  const ref = useScrollAnimation<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <section className="py-20 bg-white">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 fade-up">
        <div className="text-center mb-12">
          <span className="section-label mb-4">Common Questions</span>
          <h2 className="font-poppins text-3xl font-bold text-navy-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">
            Everything you need to know before your first visit to Astra Dental.
          </p>
        </div>

        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`bg-white transition-colors duration-200 ${isOpen ? "bg-teal-50/40" : "hover:bg-gray-50/60"}`}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className={`font-poppins font-semibold text-sm sm:text-base transition-colors duration-200 ${isOpen ? "text-teal-600" : "text-navy-900 group-hover:text-teal-600"}`}>
                    {item.question}
                  </span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-teal-500 text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-teal-100 group-hover:text-teal-500"}`}>
                    <ChevronDown size={15} />
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const infoRef = useScrollAnimation<HTMLDivElement>();
  const servicesRef = useScrollAnimation<HTMLDivElement>();
  const whyRef = useScrollAnimation<HTMLDivElement>();
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [mobileHeroImages, setMobileHeroImages] = useState<string[]>([]);
  const [heroReady, setHeroReady] = useState(false);

  const HOME_DEFAULT_HERO = "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1920";

  useEffect(() => {
    setHeroReady(false);
    supabase
      .from("site_images")
      .select("key, image_url")
      .in("key", ["homepage-hero", "homepage-hero-2", "homepage-hero-mobile", "homepage-hero-2-mobile"])
      .then(({ data }) => {
        const rows = data || [];
        const img1 = rows.find((r) => r.key === "homepage-hero")?.image_url ?? HOME_DEFAULT_HERO;
        const img2 = rows.find((r) => r.key === "homepage-hero-2")?.image_url;
        setHeroImages(img2 ? [img1, img2] : [img1]);

        const mob1 = rows.find((r) => r.key === "homepage-hero-mobile")?.image_url;
        const mob2 = rows.find((r) => r.key === "homepage-hero-2-mobile")?.image_url;
        const mobileImgs: string[] = [];
        if (mob1) mobileImgs.push(mob1);
        if (mob2) mobileImgs.push(mob2);
        setMobileHeroImages(mobileImgs);

        setHeroReady(true);
      });
  }, []);

  return (
    <>
      <Hero
        title="Your Smile Deserves the Best Care in Langley"
        subtitle="Astra Dental Centre provides comprehensive, compassionate dental services for the whole family, ranging from routine cleanings to advanced restorations."
        images={heroReady ? heroImages : []}
        mobileImages={heroReady ? mobileHeroImages : []}
      />

      {/* CDCP Section */}
      <section className="bg-white border-b border-gray-100">
        <div ref={infoRef} className="fade-up max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Text */}
            <div>
              <span className="inline-flex items-center gap-2 text-teal-600 text-[11px] font-semibold uppercase tracking-widest mb-4">
                <BadgeCheck size={14} />
                Government-Backed Program
              </span>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-navy-900 leading-tight mb-5">
                We Accept the Canadian Dental Care Plan (CDCP)
              </h2>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                Astra Dental Centre is proud to accept the Canadian Dental Care Plan (CDCP), helping make dental care more affordable for eligible patients.
              </p>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                If you are enrolled in CDCP, you can receive essential dental treatments with reduced out-of-pocket costs. Our team will guide you through your coverage and help you get started.
              </p>

              {/* Highlighted callout */}
              <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl px-5 py-4 mb-8">
                <CheckCircle size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-teal-800 text-sm font-semibold leading-snug">
                  We offer direct billing to CDCP and all major insurance providers.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/contact-us"
                  className="inline-flex items-center gap-2 bg-navy-900 hover:bg-teal-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Book Appointment
                  <ArrowRight size={15} />
                </Link>
                <a
                  href="https://www.canada.ca/en/services/benefits/dental/dental-care-plan.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
                >
                  Check Eligibility
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* Right: Image */}
            <div className="flex flex-col items-center lg:items-end">
              <div className="w-full max-w-md">
                <img
                  src="/Canadian_Dental_Care_Plan_(CDCP)_sample_card.png"
                  alt="Canadian Dental Care Plan sample card"
                  className="w-full rounded-2xl shadow-lg object-contain"
                />
                <p className="text-center text-[11px] text-gray-400 mt-3 leading-snug">
                  Sample CDCP card shown for illustrative purposes only.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={servicesRef} className="fade-up flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="section-label mb-4">What We Offer</span>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-navy-900 leading-tight">
                Comprehensive Dental Care<br className="hidden md:block" /> Under One Roof
              </h2>
            </div>
            <Link
              to="/langley-dental-services/"
              className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors whitespace-nowrap group"
            >
              View All Services
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {serviceCategories.map((cat) => (
              <ServiceCard
                key={cat.slug}
                title={cat.title}
                description={cat.description}
                href={cat.categoryPath}
                icon={iconMap[cat.icon]}
              />
            ))}
          </div>
        </div>
      </section>

      <DoctorBio />

      {/* Why choose us */}
      <section className="py-24 bg-navy-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div ref={whyRef} className="fade-up">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                Why Astra Dental
              </span>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white leading-tight mb-5">
                The Langley Dental Clinic That Puts You First
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-8">
                We are proud to serve the Langley community with high-quality dental care. Our experienced team is dedicated to making every visit comfortable, efficient, and effective.
              </p>
              <ul className="space-y-3 mb-10">
                {whyChooseUs.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-600/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={11} className="text-teal-400" />
                    </div>
                    <span className="text-sm text-white/75">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about-the-dentist/" className="btn-teal !text-sm">
                About Our Team <ArrowRight size={14} />
              </Link>
            </div>
            <WhyAccordion />
          </div>
        </div>
      </section>

      <Testimonials />

      <ClinicGallerySection />

      {/* Blog teaser */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label mb-4">From Our Blog</span>
          <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-3">Dental Health Tips & Insights</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Stay informed with articles from our team on maintaining your best smile.
          </p>
          <Link to="/blog/" className="btn-primary !text-sm">
            Read Our Blog <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <FAQSection />

      <CTASection />
    </>
  );
}
