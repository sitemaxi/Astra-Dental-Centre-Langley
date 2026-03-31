import { Link, useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Star, Zap, Users, Shield, MapPin, Clock } from "lucide-react";
import HolographicCard from "../../components/ui/holographic-card";
import Hero from "../../components/common/Hero";
import CTASection from "../../components/common/CTASection";
import ServiceCard from "../../components/common/ServiceCard";
import FAQSection from "../../components/common/FAQSection";
import { getCategoryBySlug, serviceCategories } from "../../data/services";
import { categoryPageContent } from "../../data/categoryContent";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { getCategoryImage } from "../../lib/serviceImagesApi";
import type { FAQItem } from "../../components/common/FAQSection";

const categoryFAQs: Record<string, FAQItem[]> = {
  "general-dentistry": [
    { question: "How often should I visit the dentist?", answer: "Most patients benefit from visiting every six months for a routine exam and cleaning. Patients with specific oral health concerns may need more frequent visits." },
    { question: "Are composite fillings safe?", answer: "Yes, composite resin fillings are a safe, effective, and aesthetically pleasing option for restoring decayed teeth. They bond directly to the tooth structure." },
    { question: "How do I care for my dentures?", answer: "Remove and rinse dentures after eating, brush them daily with a soft brush and denture cleaner, soak them overnight, and visit us regularly for adjustments." },
  ],
  "cosmetic-dentistry": [
    { question: "How long does teeth whitening last?", answer: "Professional ZOOM whitening results typically last 1–3 years with proper maintenance and touch-ups as needed." },
    { question: "What is CEREC dentistry?", answer: "CEREC allows us to design, fabricate, and place ceramic crowns, veneers, and other restorations in a single appointment using advanced CAD/CAM technology." },
    { question: "Are porcelain veneers permanent?", answer: "Veneers are considered a permanent cosmetic treatment because a small amount of enamel is removed during preparation. They typically last 10–15 years with proper care." },
  ],
  "preventive-dentistry": [
    { question: "Why are dental cleanings important?", answer: "Professional cleanings remove tartar and plaque that regular brushing and flossing cannot reach, reducing the risk of gum disease and cavities." },
    { question: "Are dental X-rays safe?", answer: "Yes. Modern digital X-rays emit very low levels of radiation — significantly less than traditional film X-rays — and are considered very safe." },
  ],
  "orthodontics": [
    { question: "What age should children get orthodontic evaluation?", answer: "The Canadian Association of Orthodontists recommends an evaluation by age 7, when issues with jaw growth and emerging teeth can be detected early." },
    { question: "How long does Invisalign treatment take?", answer: "The average Invisalign treatment takes 12–18 months, though simpler cases can be completed in as few as 6 months." },
    { question: "What is TMJ disorder?", answer: "TMJ (temporomandibular joint) disorder involves pain and dysfunction in the jaw joint. Treatment may include night guards, physical therapy, or other interventions." },
  ],
  "endodontics": [
    { question: "Is a root canal painful?", answer: "With modern anesthetics and techniques, root canal treatment is no more uncomfortable than getting a filling. Most patients are surprised at how comfortable the procedure is." },
    { question: "How long does a root canal take?", answer: "Most root canals can be completed in one to two appointments, each lasting 1–2 hours depending on the complexity." },
  ],
  "oral-surgery": [
    { question: "How long is recovery from wisdom tooth extraction?", answer: "Most patients recover within 3–5 days. Swelling and discomfort are normal and can be managed with prescribed medication and ice packs." },
    { question: "How long do dental implants last?", answer: "With proper care, dental implants can last a lifetime. The crown on top may need replacement after 10–15 years due to normal wear." },
  ],
  "gum-surgery": [
    { question: "What is gum disease?", answer: "Gum disease (periodontitis) is a serious infection of the gum tissue that can damage the bone supporting your teeth if left untreated." },
    { question: "How do I know if I need gum surgery?", answer: "Signs include persistent bad breath, receding gums, bleeding when brushing, loose teeth, or deep pockets between teeth and gums. A comprehensive exam will determine the appropriate treatment." },
  ],
  "prosthodontics": [
    { question: "What does prosthodontics specialize in?", answer: "Prosthodontics focuses on the restoration and replacement of teeth, including crowns, bridges, dentures, and implant-supported restorations." },
  ],
  "periodontics": [
    { question: "What is a periodontist?", answer: "A periodontist specializes in the prevention, diagnosis, and treatment of gum disease and the placement of dental implants." },
  ],
  "childrens-dentistry": [
    { question: "When should my child first visit the dentist?", answer: "We recommend bringing your child for their first dental visit by their first birthday or when their first tooth emerges, whichever comes first." },
    { question: "How do I prepare my child for their first dental visit?", answer: "Talk positively about the dentist, read books about dental visits, and schedule morning appointments when children are typically more rested and cooperative." },
  ],
};

const whyChooseUs = [
  { icon: <Star size={18} />, title: "14 years of experience in BC and Langley", desc: "Trusted by Langley families since 2013." },
  { icon: <Zap size={18} />, title: "Modern Technology", desc: "Digital X-rays, CEREC, and advanced diagnostics." },
  { icon: <Users size={18} />, title: "All Ages Welcome", desc: "Children, adults, and seniors all in one clinic." },
  { icon: <Shield size={18} />, title: "Direct Insurance Billing", desc: "We handle your insurance so you don't have to." },
  { icon: <MapPin size={18} />, title: "Langley Location", desc: "Conveniently on Fraser Hwy with easy parking." },
  { icon: <Clock size={18} />, title: "Flexible Hours", desc: "Extended weekday and Saturday availability." },
];

export default function ServiceCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const contentRef = useScrollAnimation<HTMLDivElement>();
  const whyRef = useScrollAnimation<HTMLDivElement>();
  const [dbHeroImage, setDbHeroImage] = useState<string | null>(null);
  const [dbMobileImage, setDbMobileImage] = useState<string | null>(null);
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    if (!categorySlug) return;
    setImagesReady(false);
    setDbHeroImage(null);
    setDbMobileImage(null);
    getCategoryImage(categorySlug).then((img) => {
      if (img?.hero_image_url) setDbHeroImage(img.hero_image_url);
      if (img?.mobile_image_url) setDbMobileImage(img.mobile_image_url);
      setImagesReady(true);
    });
  }, [categorySlug]);

  if (!categorySlug) return <Navigate to="/langley-dental-services/" replace />;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return <Navigate to="/langley-dental-services/" replace />;

  const faqs = categoryFAQs[categorySlug] || [];
  const content = categoryPageContent[categorySlug];
  const heroImageUrl = imagesReady ? (dbHeroImage || content?.heroImage || null) : null;
  const mobileImageUrl = imagesReady ? (dbMobileImage || heroImageUrl) : null;

  return (
    <>
      <Hero
        title={content?.seoTitle ?? category.title}
        subtitle={category.description}
        compact
        breadcrumb={[
          { label: "Langley Dental Services", href: "/langley-dental-services/" },
          { label: category.title, href: category.categoryPath },
        ]}
      />

      {/* Intro + Image */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={contentRef} className="fade-up grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Main content */}
            <div className="lg:col-span-2">
              {content && (
                <div className="mb-10">
                  <span className="section-label mb-4">About This Service</span>
                  <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-4 leading-tight">
                    {content.seoTitle} at Astra Dental Centre
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-4">{content.intro}</p>
                  <p className="text-gray-500 leading-relaxed text-sm mb-6">{content.details}</p>
                </div>
              )}

              {/* Service Cards */}
              {category.services.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-poppins text-lg font-bold text-navy-900">{category.title} Services</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.services.map((service) => (
                      <ServiceCard
                        key={service.slug}
                        title={service.title}
                        description={service.description}
                        href={`/${service.categorySlug}/${service.slug}/`}
                      />
                    ))}
                  </div>
                </>
              )}

              {category.services.length === 0 && (
                <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6">
                  <p className="text-sm text-teal-700 font-medium">
                    Detailed service information for {category.title} is coming soon. Please contact us to learn more.
                  </p>
                </div>
              )}

              {/* Who Is This For */}
              {content?.whoFor && content.whoFor.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-poppins text-lg font-bold text-navy-900 mb-5">
                    Who Is {category.title} For?
                  </h2>
                  <ul className="space-y-3">
                    {content.whoFor.map((item) => (
                      <li key={item.label} className="flex items-start gap-3">
                        <CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          <span className="font-semibold text-navy-900">{item.label}</span> — {item.desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-5">
              {heroImageUrl && (
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <picture>
                    {mobileImageUrl && mobileImageUrl !== heroImageUrl && (
                      <source media="(max-width: 767px)" srcSet={mobileImageUrl} />
                    )}
                    <img
                      src={heroImageUrl}
                      alt={`${category.title} in Langley BC`}
                      className="w-full h-52 object-cover"
                    />
                  </picture>
                </div>
              )}

              <div className="bg-navy-950 rounded-2xl p-6 text-white">
                <h3 className="font-poppins font-semibold text-base mb-2">Book a Consultation</h3>
                <p className="text-navy-200 text-sm leading-relaxed mb-4">
                  Ready to get started? Contact our Langley clinic to schedule your appointment.
                </p>
                <Link to="/contact-us/" className="btn-teal w-full !text-xs !py-3">
                  Book Now <ArrowRight size={13} />
                </Link>
              </div>

              <div className="bg-surface rounded-2xl p-5 border border-gray-100">
                <h3 className="font-poppins font-semibold text-xs text-navy-900 uppercase tracking-widest mb-4">All Services</h3>
                <div className="space-y-1">
                  {serviceCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={cat.categoryPath}
                      className={`flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-colors ${
                        cat.slug === categorySlug
                          ? "bg-navy-900 text-white font-semibold"
                          : "text-gray-600 hover:bg-white hover:text-navy-900"
                      }`}
                    >
                      {cat.title}
                      {cat.slug !== categorySlug && <ArrowRight size={11} className="text-gray-300" />}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="section-label mb-4">Why Astra Dental</span>
            <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-3 leading-tight">
              Why Choose Astra Dental Centre in Langley?
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              We provide expert {category.title.toLowerCase()} in a welcoming, modern clinic right here in Langley, BC.
            </p>
          </div>
          <div ref={whyRef} className="fade-up grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {whyChooseUs.map((item) => (
              <HolographicCard key={item.title} className="bg-white p-4 text-center">
                <p className="font-poppins font-semibold text-navy-900 text-xs mb-1 leading-tight">{item.title}</p>
                <p className="text-gray-500 text-[11px] leading-relaxed">{item.desc}</p>
              </HolographicCard>
            ))}
          </div>
        </div>
      </section>

      {faqs.length > 0 && <FAQSection faqs={faqs} title={`${category.title} FAQ`} />}

      <div className="py-5 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/langley-dental-services/"
            className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
          >
            <ArrowLeft size={13} />
            Back to All Services
          </Link>
        </div>
      </div>

      <CTASection />
    </>
  );
}
