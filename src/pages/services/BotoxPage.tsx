import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, Star, Zap, Users, Shield, MapPin, Clock, ExternalLink } from "lucide-react";
import HolographicCard from "../../components/ui/holographic-card";
import Hero from "../../components/common/Hero";
import CTASection from "../../components/common/CTASection";
import FAQSection from "../../components/common/FAQSection";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const treatments = [
  {
    title: "TMJ & Jaw Pain Relief",
    desc: "Botox injected into the masseter (jaw) muscle reduces clenching force and relieves TMJ pain. Most patients feel results within 1–2 weeks, lasting 3–6 months.",
  },
  {
    title: "Bruxism (Teeth Grinding) Treatment",
    desc: "Reducing masseter muscle activity with Botox protects your teeth from the grinding forces that cause wear, fractures, and enamel damage — especially at night.",
  },
  {
    title: "Chronic Tension Headache Relief",
    desc: "Overactive jaw and facial muscles are a common cause of tension-type headaches. Botox relaxes these muscles, providing lasting headache relief for many patients.",
  },
  {
    title: "Gummy Smile Correction",
    desc: "A small, precise injection into the upper lip muscle reduces how much gum shows when you smile — a natural, balanced result with no surgery required.",
  },
  {
    title: "Cosmetic Facial Lines",
    desc: "Smooth crow's feet, frown lines, and forehead wrinkles with aesthetic Botox administered by your dental team who understands your facial anatomy.",
  },
];

const whoFor = [
  { label: "Patients with jaw pain or TMJ disorder", desc: "Botox relieves overactive jaw muscles without surgery" },
  { label: "Patients who grind or clench their teeth", desc: "Masseter Botox reduces grinding force and protects your enamel" },
  { label: "Patients with frequent tension headaches", desc: "Jaw muscle tension is a leading cause of morning headaches that Botox can resolve" },
  { label: "Patients with a gummy smile", desc: "A targeted injection creates a more balanced, confident smile" },
  { label: "Patients seeking facial rejuvenation", desc: "Combine aesthetic Botox with your dental visits for expert, convenient care" },
];

const faqs = [
  {
    question: "Is dental Botox safe?",
    answer: "Yes. Dentists are among the most qualified professionals to administer Botox due to their extensive training in facial anatomy and injection techniques. At Astra Dental Centre, Botox is administered by our trained dental team in a clinical, sterile setting.",
  },
  {
    question: "How long does therapeutic Botox last for TMJ and jaw pain?",
    answer: "Therapeutic Botox for TMJ and bruxism typically lasts 3–6 months. Many patients find that repeated treatments help retrain jaw muscles over time, leading to progressively longer-lasting relief.",
  },
  {
    question: "Does Botox hurt?",
    answer: "Botox injections involve a very fine needle and are generally well tolerated. Most patients describe only a brief pinch sensation. Topical numbing cream can be applied beforehand to maximize comfort.",
  },
  {
    question: "How many units are needed for TMJ treatment?",
    answer: "The number of units varies depending on the size of the masseter muscle and the severity of symptoms. Your provider will assess your specific needs during a consultation and recommend an appropriate dose.",
  },
  {
    question: "Can Botox replace a night guard for teeth grinding?",
    answer: "Botox and night guards serve complementary roles. Botox reduces the force of muscle contractions at the source, while a night guard protects the tooth surfaces from wear. Many patients benefit from both.",
  },
  {
    question: "What is the difference between therapeutic and cosmetic Botox?",
    answer: "Therapeutic Botox targets overactive jaw and facial muscles to relieve pain and dysfunction. Cosmetic Botox softens expression lines and wrinkles. Both use the same product but injected at different sites and doses for different goals.",
  },
  {
    question: "When will I see results?",
    answer: "Most patients begin to notice reduced jaw tension and pain within 1–2 weeks. Full effects from both therapeutic and cosmetic Botox are typically seen at the 2-week mark.",
  },
  {
    question: "How is dental Botox different from a cosmetic clinic?",
    answer: "Dentists have specialized training in orofacial anatomy, nerve distribution, and muscle function that most cosmetic providers do not. This makes dental professionals uniquely suited for jaw, TMJ, and perioral Botox treatments.",
  },
];

const whyChooseUs = [
  { title: "15+ Years Experience", desc: "Trusted by Langley families since 2009." },
  { title: "Trained Dental Team", desc: "Facial anatomy expertise from years of clinical practice." },
  { title: "All Ages Welcome", desc: "Children, adults, and seniors all in one clinic." },
  { title: "Direct Insurance Billing", desc: "We handle your insurance so you don't have to." },
  { title: "Langley Location", desc: "Conveniently on Fraser Hwy with easy parking." },
  { title: "Flexible Hours", desc: "Extended weekday and Saturday availability." },
];

export default function BotoxPage() {
  const contentRef = useScrollAnimation<HTMLDivElement>();
  const treatmentsRef = useScrollAnimation<HTMLDivElement>();
  const whyRef = useScrollAnimation<HTMLDivElement>();

  return (
    <>
      <Hero
        title="Botox & TMJ Therapy in Langley, BC"
        subtitle="Therapeutic and aesthetic Botox treatments administered by our trained dental team — providing relief from jaw pain, bruxism, headaches, and more."
        compact
        breadcrumb={[
          { label: "Langley Dental Services", href: "/langley-dental-services/" },
          { label: "Botox & TMJ Therapy", href: "/langley-dental-services/botox/" },
        ]}
      />

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={contentRef} className="fade-up grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="mb-10">
                <span className="section-label mb-4">About This Service</span>
                <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-4 leading-tight">
                  Botox at Astra Dental Centre, Langley
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  At Astra Dental Centre in Langley, BC, we offer both therapeutic and aesthetic Botox treatments administered by our trained dental team. Dental professionals are uniquely qualified to provide Botox — we have advanced knowledge of facial anatomy, muscle function, and the jaw structures that make Botox treatments both safe and highly effective.
                </p>
                <p className="text-gray-500 leading-relaxed text-sm mb-6">
                  Therapeutic Botox is used to treat jaw clenching, teeth grinding (bruxism), TMJ disorders, chronic headaches related to muscle tension, and gummy smiles. Cosmetic Botox smooths facial lines around the mouth, forehead, and eyes — a natural complement to your dental treatment. Our approach is conservative, precise, and focused on results that look and feel completely natural.
                </p>
              </div>

              <div ref={treatmentsRef} className="fade-up mb-10">
                <h2 className="font-poppins text-xl font-bold text-navy-900 mb-6">What We Treat with Botox</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {treatments.map((t) => (
                    <div key={t.title} className="bg-surface rounded-2xl p-5 border border-gray-100">
                      <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center mb-3">
                        <Zap size={14} className="text-teal-600" />
                      </div>
                      <h3 className="font-poppins font-semibold text-navy-900 text-sm mb-2">{t.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10 bg-teal-50 border border-teal-100 rounded-2xl p-6">
                <h2 className="font-poppins text-base font-bold text-navy-900 mb-3 flex items-center gap-2">
                  <ExternalLink size={16} className="text-teal-600" />
                  TMJ Treatment is Also Part of Our Orthodontics Services
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  TMJ (temporomandibular joint) disorders can also be addressed through our Orthodontics services, which include bite guard therapy and orthodontic approaches to jaw alignment. Many patients benefit from a combined approach using both Botox and orthodontic care.
                </p>
                <Link
                  to="/langley-dental-services/orthodontics/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
                >
                  View Orthodontics Services <ArrowRight size={14} />
                </Link>
              </div>

              <div className="mb-10">
                <h2 className="font-poppins text-lg font-bold text-navy-900 mb-5">Who Is Botox Therapy For?</h2>
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
                  src="https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Botox and TMJ Therapy in Langley BC"
                  className="w-full h-52 object-cover"
                />
              </div>

              <div className="bg-navy-950 rounded-2xl p-6 text-white">
                <h3 className="font-poppins font-semibold text-base mb-2">Book a Botox Consultation</h3>
                <p className="text-navy-200 text-sm leading-relaxed mb-4">
                  Ready to relieve jaw pain or explore aesthetic options? Contact our Langley clinic today.
                </p>
                <Link to="/contact-us/" className="btn-teal w-full !text-xs !py-3">
                  Book Now <ArrowRight size={13} />
                </Link>
              </div>

              <div className="bg-surface rounded-2xl p-5 border border-gray-100">
                <h3 className="font-poppins font-semibold text-xs text-navy-900 uppercase tracking-widest mb-3">Related Services</h3>
                <div className="space-y-1">
                  {[
                    { label: "Orthodontics (Braces & Invisalign)", href: "/langley-dental-services/orthodontics/" },
                    { label: "General Dentistry", href: "/langley-dental-services/general-dentistry/" },
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

      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="section-label mb-4">Why Astra Dental</span>
            <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-3 leading-tight">
              Why Choose Astra Dental Centre in Langley?
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

      <FAQSection faqs={faqs} title="Botox & TMJ Therapy FAQ" />

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
