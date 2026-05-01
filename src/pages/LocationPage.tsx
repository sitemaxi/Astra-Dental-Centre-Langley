import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { MedicalBusinessSchema, BreadcrumbSchema } from "../components/SchemaMarkup";
import {
  Phone,
  Calendar,
  MapPin,
  ChevronRight,
  Car,
  ArrowRight,
  Star,
} from "lucide-react";
import Hero from "../components/common/Hero";
import FAQSection from "../components/common/FAQSection";
import { getLocationBySlug } from "../data/locations";
import { BUSINESS } from "../data/navigation";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { supabase } from "../lib/supabase";

const featuredServices = [
  {
    name: "Invisalign",
    href: "/orthodontics/invisalign/",
    description:
      "Straighten your teeth discreetly with custom clear aligners — no metal brackets required.",
    badge: "Popular",
  },
  {
    name: "Dental Implants",
    href: "/oral-surgery/dental-implants/",
    description:
      "Replace missing teeth permanently with natural-looking, long-lasting implants.",
    badge: "Advanced",
  },
  {
    name: "Teeth Whitening",
    href: "/cosmetic-dentistry/zoom-teeth-whitening/",
    description:
      "Professional Zoom whitening delivers dramatic results in a single comfortable visit.",
    badge: "Cosmetic",
  },
  {
    name: "Root Canal Treatment",
    href: "/endodontics/root-canal-treatment/",
    description:
      "Relieve tooth pain and save your natural tooth with gentle, modern root canal therapy.",
    badge: "Restorative",
  },
  {
    name: "Braces for Adults",
    href: "/orthodontics/braces-for-adults/",
    description:
      "Achieve a straighter smile at any age with traditional or clear bracket systems.",
    badge: "Orthodontics",
  },
];

const whyChoosePoints = [
  {
    title: "Experienced Dentist",
    body: "Dr. Potluri brings extensive training and years of hands-on experience treating patients across all areas of dentistry.",
  },
  {
    title: "Family-Focused Care",
    body: "From toddlers to grandparents, we offer a complete range of services for every member of your family under one roof.",
  },
  {
    title: "Modern Technology",
    body: "Our clinic is equipped with CEREC same-day restorations, digital imaging, and the latest treatment tools for better outcomes.",
  },
  {
    title: "Convenient Langley Location",
    body: "Located at Unit 120, 20061 Fraser Hwy with free on-site parking, extended evening hours, and Saturday appointments.",
  },
];

interface LocationPageProps {
  locationSlug: string;
}

const DEFAULT_HERO = "https://images.pexels.com/photos/3881449/pexels-photo-3881449.jpeg?auto=compress&cs=tinysrgb&w=1920";

export default function LocationPage({ locationSlug }: LocationPageProps) {
  const location = getLocationBySlug(locationSlug);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    setHeroImage(null);
    setHeroReady(false);
    supabase
      .from("location_hero_images")
      .select("image_url, featured_image_url")
      .eq("slug", locationSlug)
      .maybeSingle()
      .then(({ data }) => {
        const url = data?.featured_image_url ?? data?.image_url ?? DEFAULT_HERO;
        setHeroImage(url);
        setHeroReady(true);
      });
  }, [locationSlug]);

  const heroRef = useScrollAnimation<HTMLDivElement>();
  const servicesRef = useScrollAnimation<HTMLDivElement>();
  const whyRef = useScrollAnimation<HTMLDivElement>();
  const directionsRef = useScrollAnimation<HTMLDivElement>();

  if (!location) {
    return <Navigate to="/" replace />;
  }

  const cityName = location.name;
  const locationPath = `/${locationSlug}/`;

  return (
    <>
      <SEOHead
        title={`Dentist in ${cityName}, BC | Astra Dental Centre Langley`}
        description={`Looking for a dentist near ${cityName}? Astra Dental Centre in Langley, BC is just minutes away. Comprehensive family dental care, new patients welcome. Book today.`}
        keywords={`dentist ${cityName}, dentist near ${cityName}, ${cityName} dental clinic, Langley dentist, family dentist ${cityName} BC`}
        canonicalPath={locationPath}
      />
      <MedicalBusinessSchema />
      <BreadcrumbSchema items={[{ label: `Dentist ${cityName}`, href: locationPath }]} />
      <Hero
        title={location.heroTitle}
        subtitle={location.heroSubtitle}
        compact={false}
        image={heroReady ? (heroImage ?? DEFAULT_HERO) : undefined}
      />

      {/* Intro Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={heroRef} className="fade-up grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label mb-4">Serving {location.regionLabel}</span>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-navy-900 leading-tight mb-6">
                {location.introHeading}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">
                {location.introParagraph}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/contact-us/" className="btn-teal">
                  <Calendar size={15} />
                  Book Appointment
                </Link>
                <a href={`tel:${BUSINESS.phone}`} className="btn-primary">
                  <Phone size={15} />
                  {BUSINESS.phone}
                </a>
              </div>
            </div>

            <div className="bg-surface rounded-3xl p-8 lg:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-poppins font-bold text-navy-900 text-lg mb-1">
                    Astra Dental Centre
                  </h3>
                  <p className="text-gray-500 text-sm">{BUSINESS.fullAddress}</p>
                  <p className="text-gray-500 text-sm">{BUSINESS.phone}</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { day: "Mon – Wed", hours: BUSINESS.hours.monday },
                  { day: "Thursday", hours: BUSINESS.hours.thursday },
                  { day: "Friday", hours: BUSINESS.hours.friday },
                  { day: "Saturday", hours: BUSINESS.hours.saturday },
                  { day: "Sunday", hours: BUSINESS.hours.sunday },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium">{day}</span>
                    <span
                      className={`font-semibold text-xs px-2.5 py-1 rounded-full ${
                        hours === "Closed"
                          ? "bg-red-50 text-red-600"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-teal-700 font-medium">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>New patients welcome — no referral needed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={servicesRef} className="fade-up">
            <div className="text-center mb-12">
              <span className="section-label mb-4">What We Offer</span>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-navy-900 mb-4">
                Our Services Near {location.name}
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                From routine hygiene visits to advanced restorations — all available at our{" "}
                <Link to="/langley-dental-services/" className="text-teal-600 hover:underline font-medium">
                  Langley dental clinic
                </Link>
                , just {location.driveTime} from {location.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {featuredServices.map((service) => (
                <Link
                  key={service.name}
                  to={service.href}
                  className="service-card group bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-poppins font-semibold text-navy-900 text-lg group-hover:text-teal-600 transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wide bg-teal-50 text-teal-700 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                      {service.badge}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-teal-600 text-sm font-semibold">
                    <span>Learn more</span>
                    <ArrowRight
                      size={14}
                      className="translate-x-0 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/langley-dental-services/"
                className="inline-flex items-center gap-2 text-navy-900 font-semibold hover:text-teal-600 transition-colors text-sm"
              >
                View all dental services
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={whyRef} className="fade-up">
            <div className="text-center mb-12">
              <span className="section-label mb-4">Why Patients Choose Us</span>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose Astra Dental Centre
              </h2>
              <p className="text-navy-200 max-w-xl mx-auto">
                {location.whyChooseParagraph}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChoosePoints.map((point) => (
                <div
                  key={point.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                >
                  <h3 className="font-poppins font-semibold text-white mb-2">{point.title}</h3>
                  <p className="text-navy-200 text-sm leading-relaxed">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directions Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={directionsRef} className="fade-up grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="section-label mb-4">Getting Here</span>
              <h2 className="font-poppins text-3xl font-bold text-navy-900 mb-6">
                Directions from {location.name}
              </h2>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Car size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900 mb-1">
                    {location.driveTime} via {location.driveRoute}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{location.directionsDetail}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900 mb-1">Our Address</p>
                  <p className="text-gray-600">{BUSINESS.fullAddress}</p>
                  <p className="text-gray-500 text-sm mt-1">Free on-site parking available</p>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-3xl overflow-hidden">
              <iframe
                title={`Map to Astra Dental Centre from ${location.name}`}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d736.0089356636234!2d-122.66712063771944!3d49.10863049410286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485cfd5f42d6087%3A0xaec8e87c10582f27!2sAstra%20Dental%20Centre!5e0!3m2!1sen!2sca!4v1774064383741!5m2!1sen!2sca"
                className="w-full h-64 lg:h-80"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="p-5">
                <p className="text-sm text-gray-500 text-center">
                  Unit 120, 20061 Fraser Hwy, Langley, BC &mdash;{" "}
                  <a
                    href="https://maps.google.com/?q=20061+Fraser+Hwy+Langley+BC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline font-medium"
                  >
                    Open in Google Maps
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        faqs={location.faqs}
        title={`Common Questions from ${location.name} Patients`}
      />

      {/* CTA */}
      <section className="py-20 bg-navy-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label mb-6">Book Today</span>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-4">
            {location.ctaHeading}
          </h2>
          <p className="text-navy-200 text-lg mb-10 max-w-2xl mx-auto">
            {location.ctaSubtext}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact-us/" className="btn-teal text-base px-8 py-3.5">
              <Calendar size={17} />
              Book Appointment Online
            </Link>
            <a href={`tel:${BUSINESS.phone}`} className="btn-outline-white text-base px-8 py-3.5">
              <Phone size={17} />
              Call {BUSINESS.phone}
            </a>
          </div>

          <div className="mt-12 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm text-navy-300">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/langley-dental-services/" className="hover:text-white transition-colors">
              All Services
            </Link>
            <Link to="/about-the-dentist/" className="hover:text-white transition-colors">
              Meet Dr. Potluri
            </Link>
            <Link to="/contact-us/" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
