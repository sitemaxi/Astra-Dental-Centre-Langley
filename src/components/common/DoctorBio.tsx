import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const credentials = [
  "Practicing dentistry since 1996",
  "BC College of Oral Health Professionals",
  "Invisalign Certified Provider",
  "CEREC CAD/CAM Certified",
];

export default function DoctorBio() {
  const textRef = useScrollAnimation<HTMLDivElement>();
  const imgRef = useScrollAnimation<HTMLDivElement>(1);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Image side */}
          <div ref={imgRef} className="fade-up relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card-hover">
              <img
                src="/Dr.Bhushan_Kumar_Astra-Dental-Langley.png"
                alt="Dr. Bhushan Kumar - Astra Dental Centre"
                className="w-full h-[500px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 via-transparent to-transparent" />
            </div>

            {/* Floating stats card */}
            <div className="absolute -bottom-6 -right-4 lg:right-8 bg-white rounded-2xl shadow-card-hover p-5 border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-poppins font-bold text-2xl text-navy-900 leading-none">30+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Years Exp.</p>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div className="text-center">
                  <p className="font-poppins font-bold text-2xl text-teal-600 leading-none">3K+</p>
                  <p className="text-xs text-gray-500 mt-0.5">Braces Patients</p>
                </div>
                <div className="w-px h-10 bg-gray-100" />
                <div className="text-center flex flex-col items-center">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B">
                        <path d="M6 1l1.4 2.8L10.5 4.3l-2.25 2.2.53 3.1L6 8.05 3.22 9.6l.53-3.1L1.5 4.3l3.1-.5L6 1z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">4.9 Rating</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text side */}
          <div ref={textRef} className="fade-up lg:pl-6">
            <span className="section-label mb-5">Meet Your Dentist</span>
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-navy-900 leading-tight mb-5">
              Expert Care with a{" "}
              <span className="gradient-text">Personal Touch</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Dr. B. Kumar Potluri has been practicing dentistry since 1996, bringing over 30+ years of experience in all aspects of oral health care. He is dedicated to providing personalized and comprehensive dental care for every patient at Astra Dental Centre in Langley.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              While an accomplished General Dentist, Dr. Potluri maintains a true passion for preventative, restorative, and cosmetic dentistry — interests he has cultivated throughout his career through active patient care and extensive continuing education.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-7">
              Beyond dentistry, Dr. Potluri loves working and living in Langley. His passions include spending time with his wife and daughter, photography, reading, and the incredible beauty of the region he is proud to call home.
            </p>

            <ul className="space-y-2.5 mb-8">
              {credentials.map((c) => (
                <li key={c} className="flex items-center gap-2.5">
                  <CheckCircle size={15} className="text-teal-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 font-medium">{c}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <Link to="/about-the-dentist/" className="btn-primary !text-sm">
                About Our Practice
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
