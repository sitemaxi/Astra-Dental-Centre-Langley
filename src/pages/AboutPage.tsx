import { ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";
import { MedicalBusinessSchema } from "../components/SchemaMarkup";
import Hero from "../components/common/Hero";
import CTASection from "../components/common/CTASection";
import DoctorBio from "../components/common/DoctorBio";
import Testimonials from "../components/common/Testimonials";
import ClinicGallerySection from "../components/common/ClinicGallerySection";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

const values = [
  {
    title: "Patient-Centered Care",
    description: "We take time to listen, understand your concerns, and develop personalized treatment plans tailored to your unique needs and goals.",
  },
  {
    title: "Advanced Technology",
    description: "From digital X-rays to CEREC same-day restorations, we invest in the latest technology for better precision and outcomes.",
  },
  {
    title: "Comfortable Environment",
    description: "Our clinic is designed to put patients at ease, with a friendly team dedicated to minimizing anxiety at every appointment.",
  },
  {
    title: "Continuing Education",
    description: "Our dental team regularly pursues advanced training to stay current with the latest techniques and treatments.",
  },
];


export default function AboutPage() {
  const valuesRef = useScrollAnimation<HTMLDivElement>();
  const philosophyRef = useScrollAnimation<HTMLDivElement>();

  return (
    <>
      <SEOHead
        title="About the Dentist | Dr. B. Kumar Potluri | Astra Dental Centre Langley"
        description="Meet Dr. B. Kumar Potluri, the experienced dentist behind Astra Dental Centre in Langley, BC. Learn about his philosophy, training, and commitment to patient care."
        keywords="Dr Potluri dentist Langley, about Astra Dental Centre, dentist Langley BC, family dentist"
        canonicalPath="/about-the-dentist/"
      />
      <MedicalBusinessSchema />
      <Hero
        title="About the Dentist"
        subtitle="Learn about the dental professional behind Astra Dental Centre and our commitment to exceptional oral health care."
        compact
        breadcrumb={[{ label: "About the Dentist", href: "/about-the-dentist/" }]}
      />

      <DoctorBio />

      {/* Dr. Potluri's Philosophy */}
      <section className="py-20 bg-navy-900 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={philosophyRef} className="fade-up text-center">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-teal-400 border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 rounded-full mb-8">
              Dr. Potluri's Philosophy
            </span>
            <div className="relative">
              <Quote size={64} className="text-teal-500/20 mx-auto mb-4" />
              <blockquote className="font-poppins text-lg md:text-xl font-medium text-white leading-relaxed mb-8">
                "I am a strong believer in patient comfort and patient education. I am very gentle when treating patients and make sure that they are comfortable every step of the way. I make a point to always spend time listening to my patients and explaining in detail their condition and treatment options. I believe that my patients deserve the best treatments available and also the information to make educated choices. I strive to truly earn every patient's trust and to be my patients' partner in their goal of achieving optimal oral health."
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-teal-500/40" />
                <p className="text-teal-400 font-semibold text-sm tracking-wide">Dr. B. Kumar Potluri</p>
                <div className="h-px w-12 bg-teal-500/40" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={valuesRef} className="fade-up">
            <div className="text-center mb-10">
              <span className="section-label mb-5">Our Values</span>
              <h2 className="font-poppins text-2xl font-bold text-navy-900 mt-5">
                What Guides Our Practice
              </h2>
            </div>
            <div className="space-y-4">
              {values.map((val, i) => (
                <div key={val.title} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-card transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center flex-shrink-0 text-navy-700 font-poppins font-bold text-xs">
                      0{i + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-navy-900 mb-1">{val.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{val.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-label mb-5">Our Mission</span>
          <blockquote className="font-poppins text-xl md:text-2xl font-semibold text-navy-900 leading-relaxed mb-6">
            "To provide every patient in Langley with exceptional dental care in a welcoming, stress-free environment — building lifelong relationships based on trust and outstanding results."
          </blockquote>
          <div className="accent-line mx-auto mb-8" />
          <Link to="/contact-us/" className="btn-teal">
            Book Your Visit <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <Testimonials />
      <ClinicGallerySection />
      <CTASection variant="light" />
    </>
  );
}
