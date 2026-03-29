import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Phone, CheckCircle, MapPin, Clock, Star, Shield, Users, Zap } from "lucide-react";
import HolographicCard from "../../components/ui/holographic-card";
import Hero from "../../components/common/Hero";
import CTASection from "../../components/common/CTASection";
import ServiceCard from "../../components/common/ServiceCard";
import { Compare } from "../../components/ui/Compare";
import { serviceCategories } from "../../data/services";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { BUSINESS } from "../../data/navigation";
import { getAllCategoryImages, getSiteImagesByKeys } from "../../lib/serviceImagesApi";
import type { CategoryImage, SiteImageRow } from "../../lib/serviceImagesApi";
import {
  Stethoscope, Sparkles, ShieldCheck, AlignCenter,
  Activity, Scissors, Heart, Star as StarIcon, Leaf, Smile,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Stethoscope: <Stethoscope size={18} />,
  Sparkles: <Sparkles size={18} />,
  ShieldCheck: <ShieldCheck size={18} />,
  AlignCenter: <AlignCenter size={18} />,
  Activity: <Activity size={18} />,
  Scissors: <Scissors size={18} />,
  Heart: <Heart size={18} />,
  Star: <StarIcon size={18} />,
  Leaf: <Leaf size={18} />,
  Smile: <Smile size={18} />,
};

const whyChooseUs = [
  {
    icon: <Star size={20} />,
    title: "15+ Years of Experience",
    desc: "Serving Langley families since 2009 with skilled, compassionate care.",
  },
  {
    icon: <Zap size={20} />,
    title: "Advanced Technology",
    desc: "Digital X-rays, CEREC same-day crowns, and modern diagnostic tools.",
  },
  {
    icon: <Users size={20} />,
    title: "Care for All Ages",
    desc: "From children's first visits to senior care — we treat the whole family.",
  },
  {
    icon: <Shield size={20} />,
    title: "Direct Insurance Billing",
    desc: "We bill your insurance directly so you focus on your health, not paperwork.",
  },
  {
    icon: <MapPin size={20} />,
    title: "Conveniently Located",
    desc: "Easy access on Fraser Hwy in Langley, BC with ample parking.",
  },
  {
    icon: <Clock size={20} />,
    title: "Flexible Scheduling",
    desc: "Extended weekday hours and Saturday appointments to fit your schedule.",
  },
];

const WHO_WE_SERVE_DEFAULTS = {
  "services-who-we-serve-left":  "https://images.pexels.com/photos/3845741/pexels-photo-3845741.jpeg?auto=compress&cs=tinysrgb&w=600",
  "services-who-we-serve-right": "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=600",
  "services-compare-before":     "https://images.pexels.com/photos/3762940/pexels-photo-3762940.jpeg?auto=compress&cs=tinysrgb&w=800",
  "services-compare-after":      "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800",
  "services-hub-video":          "",
} as const;

export default function ServicesHubPage() {
  const cardsRef = useScrollAnimation<HTMLDivElement>();
  const introRef = useScrollAnimation<HTMLDivElement>();
  const whyRef = useScrollAnimation<HTMLDivElement>();
  const [categoryImages, setCategoryImages] = useState<CategoryImage[]>([]);
  const [whoWeServeImages, setWhoWeServeImages] = useState<SiteImageRow[]>([]);

  useEffect(() => {
    getAllCategoryImages().then(setCategoryImages);
    getSiteImagesByKeys(Object.keys(WHO_WE_SERVE_DEFAULTS)).then(setWhoWeServeImages);
  }, []);

  function getCategoryImageUrl(slug: string): string | null {
    return categoryImages.find((ci) => ci.category_slug === slug)?.hero_image_url || null;
  }

  function getWhoWeServeImage(key: keyof typeof WHO_WE_SERVE_DEFAULTS): string {
    const row = whoWeServeImages.find((r) => r.key === key);
    return row?.image_url || WHO_WE_SERVE_DEFAULTS[key] || "";
  }

  return (
    <>
      <Hero
        title="Dental Services in Langley, BC"
        subtitle="Astra Dental Centre offers a complete range of dental treatments for every age and every need — all under one roof in Langley, BC."
        compact
        breadcrumb={[{ label: "Langley Dental Services", href: "/langley-dental-services/" }]}
      />

      {/* Intro Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={introRef} className="fade-up grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label mb-4">Comprehensive Dental Care</span>
              <h2 className="font-poppins text-3xl font-bold text-navy-900 mb-5 leading-tight">
                Full-Spectrum Dental Services in Langley, BC
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Whether you're looking for a routine cleaning, cosmetic smile enhancement, orthodontic treatment, or complex oral surgery, Astra Dental Centre in Langley, BC is your destination for comprehensive dental care. Our experienced team treats patients of all ages — from toddlers to seniors — in a welcoming, modern clinic on Fraser Hwy.
              </p>
              <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                We understand that every patient has unique needs and concerns. That's why we take the time to listen, thoroughly assess your oral health, and develop a personalized treatment plan. From preventive care that keeps small issues from becoming costly problems, to restorative and cosmetic treatments that rebuild confidence — we do it all with a friendly, patient-first approach.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact-us/" className="btn-teal">
                  Book Appointment
                </Link>
                <a href={`tel:${BUSINESS.phone}`} className="btn-primary">
                  <Phone size={15} />
                  {BUSINESS.phone}
                </a>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
              <img
                src="https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Dental clinic in Langley BC"
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950/80 to-transparent p-6">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-teal-400" />
                  <span className="text-white text-sm font-medium">{BUSINESS.fullAddress}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What This Includes */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="section-label mb-4">What We Offer</span>
            <h2 className="font-poppins text-3xl font-bold text-navy-900 mb-4 leading-tight">
              Treatments Available at Astra Dental
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm">
              From routine checkups to specialized surgical procedures, our clinic in Langley covers the full spectrum of modern dentistry.
            </p>
          </div>

          <div ref={cardsRef} className="fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {serviceCategories.map((cat) => (
              <ServiceCard
                key={cat.slug}
                title={cat.title}
                description={cat.description}
                href={cat.categoryPath}
                icon={iconMap[cat.icon]}
                imageUrl={getCategoryImageUrl(cat.slug)}
                imageAlt={`${cat.title} at Astra Dental Langley`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Video */}
      {getWhoWeServeImage("services-hub-video") && (
        <section className="py-14 bg-navy-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="section-label mb-3 !text-teal-400">Modern technolog</span>
              <h2 className="font-poppins text-2xl font-bold text-white leading-tight">
                A Look Inside Astra Dental Centr
              </h2>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <video
                src={getWhoWeServeImage("services-hub-video")}
                controls
                preload="none"
                playsInline
                poster="https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=1200"
                className="w-full aspect-video bg-navy-900"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
      )}

      {/* Who is this for */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label mb-4">Who We Serve</span>
              <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-5 leading-tight">
                Dental Care for Every Stage of Life
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                Our Langley dental clinic is designed to be a place the whole family can trust — from a child's very first dental visit to complex restorative work for adults and seniors.
              </p>
              <ul className="space-y-3">
                {[
                  { label: "Children & Teens", desc: "Gentle, fun visits that build healthy habits early" },
                  { label: "Adults", desc: "Preventive care, cosmetic enhancements, and restorations" },
                  { label: "Seniors", desc: "Dentures, implants, and supportive periodontal care" },
                  { label: "Anxious Patients", desc: "Calm, patient-paced approach to reduce dental anxiety" },
                  { label: "Families", desc: "Coordinate appointments for the whole family in one visit" },
                  { label: "Orthodontic Patients", desc: "Invisalign and braces for teens and adults" },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold text-navy-900">{item.label}</span> — {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={getWhoWeServeImage("services-who-we-serve-left")}
                  alt="Family dental care Langley"
                  className="rounded-2xl h-44 w-full object-cover shadow-card"
                />
                <img
                  src={getWhoWeServeImage("services-who-we-serve-right")}
                  alt="Children dentistry Langley BC"
                  className="rounded-2xl h-44 w-full object-cover shadow-card mt-6"
                />
              </div>
              <Compare
                firstImage={getWhoWeServeImage("services-compare-after")}
                secondImage={getWhoWeServeImage("services-compare-before")}
                firstImageClassName="object-cover"
                secondImageClassname="object-cover"
                className="h-52 w-full"
                slideMode="hover"
                label="Smile transformation — hover to compare before and after"
              />
              <p className="text-[11px] text-gray-400 mt-2 italic">
                Images are for illustrative purposes only and do not represent actual patient results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="py-12 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-poppins text-xl font-bold text-white mb-1">Ready to take the first step?</p>
            <p className="text-teal-100 text-sm">Book your consultation at our Langley clinic today.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link to="/contact-us/" className="bg-white text-teal-700 font-semibold px-6 py-3 rounded-full text-sm hover:bg-teal-50 transition-colors">
              Book Appointment
            </Link>
            <a href={`tel:${BUSINESS.phone}`} className="border border-white/50 text-white font-semibold px-6 py-3 rounded-full text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
              <Phone size={14} />
              {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="section-label mb-4">Why Astra Dental</span>
            <h2 className="font-poppins text-3xl font-bold text-navy-900 mb-4 leading-tight">
              Why Langley Patients Choose Astra Dental Centre
            </h2>
            <p className="text-gray-500 leading-relaxed text-sm">
              We combine clinical expertise with a warm, patient-first approach — so you always feel informed, comfortable, and well cared for.
            </p>
          </div>

          <div ref={whyRef} className="fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item) => (
              <HolographicCard key={item.title} className="bg-surface">
                <h3 className="font-poppins font-semibold text-navy-900 text-[15px] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
