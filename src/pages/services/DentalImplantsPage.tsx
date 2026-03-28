import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, Zap } from "lucide-react";
import HolographicCard from "../../components/ui/holographic-card";
import Hero from "../../components/common/Hero";
import CTASection from "../../components/common/CTASection";
import FAQSection from "../../components/common/FAQSection";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const implantTypes = [
  {
    title: "Single Tooth Implant",
    desc: "Replace one missing tooth with a titanium post and a custom crown. No impact on neighbouring teeth — the implant stands entirely on its own.",
  },
  {
    title: "Multiple Tooth Implants",
    desc: "Replace several missing teeth independently, preserving the integrity of all remaining teeth without grinding them down for a bridge.",
  },
  {
    title: "Implant-Supported Bridge",
    desc: "A fixed bridge anchored to implants rather than natural teeth — more stable and tooth-preserving than a traditional bridge.",
  },
  {
    title: "Implant-Supported Dentures",
    desc: "Snap-on or fixed full-arch dentures anchored by implants. Eliminates slipping, clicking, and the need for adhesive.",
  },
  {
    title: "Bone Grafting (if needed)",
    desc: "We rebuild jawbone density before implant placement when required, ensuring a solid and lasting foundation.",
  },
];

const process = [
  { step: "01", title: "Consultation & Imaging", desc: "Digital X-rays and imaging confirm candidacy and guide precise treatment planning." },
  { step: "02", title: "Bone Grafting (if needed)", desc: "Bone volume is rebuilt when required to ensure a strong foundation for the implant." },
  { step: "03", title: "Implant Placement", desc: "The titanium post is placed into the jawbone under local anesthesia — a comfortable, precise procedure." },
  { step: "04", title: "Healing & Osseointegration", desc: "Over 3–6 months, the implant fuses with the bone. Most patients continue normal daily activities during this time." },
  { step: "05", title: "Crown Placement", desc: "Your custom-designed crown is attached. The result looks, feels, and functions exactly like a natural tooth." },
];

const whoFor = [
  { label: "Patients with one or more missing teeth", desc: "Implants are the most permanent and natural-feeling replacement available" },
  { label: "Patients unhappy with removable dentures", desc: "Implant-supported restorations don't slip, shift, or require adhesive" },
  { label: "Patients with healthy gums and adequate bone", desc: "Good bone density and healthy gum tissue are key success factors" },
  { label: "Patients who want to preserve their jawbone", desc: "Implants stimulate bone and prevent the bone loss that follows tooth extraction" },
  { label: "Long-term investment seekers", desc: "With proper care, implants can last decades — the most cost-effective option over time" },
];

const faqs = [
  {
    question: "How long do dental implants last?",
    answer: "With proper care and regular dental checkups, dental implants can last many decades — often a lifetime. The crown attached to the implant may need replacement after 10–20 years due to normal wear, but the implant post itself is designed to be permanent.",
  },
  {
    question: "Am I a candidate for dental implants?",
    answer: "Most healthy adults with missing teeth are candidates. Key factors include adequate jawbone volume, healthy gum tissue, and good overall health. Conditions like diabetes or smoking may affect outcomes but do not necessarily disqualify you. We perform a thorough evaluation including digital imaging.",
  },
  {
    question: "Does the dental implant procedure hurt?",
    answer: "The procedure is performed under local anesthesia and is typically much more comfortable than patients expect. Most describe it as similar to having a tooth extracted. Some soreness and mild swelling in the days following is normal and easily managed with over-the-counter pain relief.",
  },
  {
    question: "How long does the full implant process take?",
    answer: "The complete process — from implant placement to final crown — typically takes 3–6 months. This allows sufficient time for osseointegration. Some patients with excellent bone density may qualify for faster timelines.",
  },
  {
    question: "What happens if I don't have enough bone for an implant?",
    answer: "Bone grafting can rebuild lost bone density to prepare the jaw for an implant. We offer socket preservation (immediately after extraction) and ridge augmentation procedures. After a healing period, implant placement can proceed successfully.",
  },
  {
    question: "How do I care for my dental implant?",
    answer: "Implants are cared for just like natural teeth — brush twice daily, floss regularly, and attend routine dental checkups. Avoid smoking and maintain good oral hygiene to maximize the lifespan of your implant.",
  },
  {
    question: "Are dental implants covered by insurance?",
    answer: "Coverage varies by insurance plan. Some plans provide partial coverage for implants. We recommend checking with your provider before treatment and can help you navigate your benefits. We also offer direct billing.",
  },
  {
    question: "What is the success rate of dental implants?",
    answer: "Dental implants have a success rate of over 95% when placed by experienced professionals. Factors such as smoking, uncontrolled diabetes, and poor oral hygiene can reduce this rate, which is why we evaluate each patient carefully before proceeding.",
  },
  {
    question: "Why are implants better than dentures or bridges?",
    answer: "Implants are the only tooth replacement option that preserves jawbone. Unlike dentures, they don't slip or require adhesive. Unlike bridges, they don't require grinding down neighbouring healthy teeth. They look, feel, and function exactly like natural teeth.",
  },
  {
    question: "How much do dental implants cost in Langley?",
    answer: "The cost varies based on how many teeth are being replaced, whether bone grafting is needed, and the type of restoration. We provide a detailed treatment plan with transparent pricing during your consultation.",
  },
];

const whyChooseUs = [
  { title: "15+ Years Experience", desc: "Trusted by Langley families since 2009." },
  { title: "Advanced Technology", desc: "Digital X-rays and precise implant planning." },
  { title: "All Ages Welcome", desc: "Adults and seniors treated with equal care." },
  { title: "Direct Insurance Billing", desc: "We handle your insurance claims directly." },
  { title: "Langley Location", desc: "Conveniently on Fraser Hwy with easy parking." },
  { title: "Flexible Hours", desc: "Extended weekday and Saturday availability." },
];

export default function DentalImplantsPage() {
  const contentRef = useScrollAnimation<HTMLDivElement>();
  const processRef = useScrollAnimation<HTMLDivElement>();
  const whyRef = useScrollAnimation<HTMLDivElement>();

  return (
    <>
      <Hero
        title="Dental Implants in Langley, BC"
        subtitle="The most permanent, natural-looking solution for missing teeth. Titanium implants that look, feel, and function just like your own teeth."
        compact
        breadcrumb={[
          { label: "Langley Dental Services", href: "/langley-dental-services/" },
          { label: "Dental Implants", href: "/langley-dental-services/dental-implants-langley/" },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={contentRef} className="fade-up grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-10">
                <span className="section-label mb-4">About Dental Implants</span>
                <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-4 leading-tight">
                  Dental Implants at Astra Dental Centre
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Dental implants are the gold standard for replacing missing teeth. At Astra Dental Centre in Langley, BC, we offer comprehensive implant treatment that restores your smile with a permanent, natural-looking, and fully functional result. Unlike dentures or bridges, implants integrate directly with your jawbone to provide stability that no other restoration can match.
                </p>
                <p className="text-gray-500 leading-relaxed text-sm mb-6">
                  A dental implant is a small titanium post placed into the jawbone. Over time, it fuses with the bone through osseointegration — creating the same stability as a natural tooth root. A custom-designed crown is then attached to complete your restoration. The result looks, feels, and functions just like your natural teeth.
                </p>
              </div>

              <div className="mb-10">
                <h2 className="font-poppins text-xl font-bold text-navy-900 mb-6">Implant Options We Offer</h2>
                <div className="space-y-4">
                  {implantTypes.map((type) => (
                    <div key={type.title} className="flex items-start gap-4 bg-surface rounded-2xl p-5 border border-gray-100">
                      <CheckCircle size={16} className="text-teal-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-poppins font-semibold text-navy-900 text-sm mb-1">{type.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{type.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h2 className="font-poppins text-xl font-bold text-navy-900 mb-6">Who Is a Good Candidate?</h2>
                <ul className="space-y-3">
                  {whoFor.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold text-navy-900">{item.label}</span> — {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-2xl overflow-hidden shadow-card">
                <img
                  src="https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Dental Implants in Langley BC"
                  className="w-full h-52 object-cover"
                />
              </div>

              <div className="bg-navy-950 rounded-2xl p-6 text-white">
                <h3 className="font-poppins font-semibold text-base mb-2">Book an Implant Consultation</h3>
                <p className="text-navy-200 text-sm leading-relaxed mb-4">
                  Ready to replace missing teeth permanently? Contact our Langley clinic to get started.
                </p>
                <Link to="/contact-us/" className="btn-teal w-full !text-xs !py-3">
                  Book Now <ArrowRight size={13} />
                </Link>
              </div>

              <div className="bg-surface rounded-2xl p-5 border border-gray-100">
                <h3 className="font-poppins font-semibold text-xs text-navy-900 uppercase tracking-widest mb-3">Related Services</h3>
                <div className="space-y-1">
                  {[
                    { label: "Oral Surgery (Extractions)", href: "/langley-dental-services/oral-surgery/" },
                    { label: "Prosthodontics", href: "/langley-dental-services/prosthodontics/" },
                    { label: "All Services", href: "/langley-dental-services/" },
                  ].map((l) => (
                    <Link
                      key={l.href}
                      to={l.href}
                      className="flex items-center justify-between text-sm py-2 px-3 rounded-lg text-gray-600 hover:bg-white hover:text-navy-900 transition-colors"
                    >
                      {l.label} <ArrowRight size={11} className="text-gray-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-navy-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="section-label mb-4 !text-teal-400">The Process</span>
            <h2 className="font-poppins text-2xl font-bold text-white mb-3 leading-tight">
              How Dental Implant Treatment Works
            </h2>
            <p className="text-navy-200 text-sm leading-relaxed">
              Our step-by-step approach ensures every implant is placed with precision, comfort, and long-term success in mind.
            </p>
          </div>
          <div ref={processRef} className="fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {process.map((step) => (
              <div key={step.step} className="bg-navy-900 rounded-2xl p-5 border border-navy-800">
                <div className="text-teal-400 font-poppins font-bold text-2xl mb-3">{step.step}</div>
                <h3 className="font-poppins font-semibold text-white text-sm mb-2">{step.title}</h3>
                <p className="text-navy-200 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="section-label mb-4">Why Astra Dental</span>
            <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-3 leading-tight">
              Why Choose Astra Dental Centre for Implants?
            </h2>
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

      <FAQSection faqs={faqs} title="Dental Implants FAQ" />

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
