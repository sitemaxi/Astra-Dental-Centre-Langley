import { Phone, Mail, MapPin, Clock, Navigation } from "lucide-react";
import SEOHead from "../components/SEOHead";
import Hero from "../components/common/Hero";
import BookingForm from "../components/common/BookingForm";
import ParkingBanner from "../components/common/ParkingBanner";
import StoreLocator from "../components/common/StoreLocator";
import { BUSINESS } from "../data/navigation";

export default function ContactPage() {
  return (
    <>
      <SEOHead
        title="Contact Us | Book a Dental Appointment in Langley, BC"
        description="Contact Astra Dental Centre in Langley, BC to book an appointment or ask a question. Call 604-533-8806 or use our online booking form. New patients welcome."
        keywords="book dentist Langley, dental appointment Langley BC, contact Astra Dental Centre, dentist phone number Langley"
        canonicalPath="/contact-us/"
      />
      <ParkingBanner />

      <Hero
        title="Contact Us"
        subtitle="We'd love to hear from you. Book an appointment, ask a question, or find out how to reach us."
        compact
        breadcrumb={[{ label: "Contact Us", href: "/contact-us/" }]}
      />

      <section className="pt-8 pb-16 sm:pt-12 sm:pb-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">

            {/* Form — wider column */}
            <div className="lg:col-span-3 bg-white rounded-3xl shadow-card p-6 sm:p-8 md:p-10">
              <span className="section-label mb-4">Book an Appointment</span>
              <h2 className="font-poppins text-2xl font-bold text-navy-900 mb-2">Request Your Visit</h2>
              <p className="text-sm text-gray-500 mb-7">Select your preferred date and time and our team will confirm availability with Dr. Potluri.</p>
              <BookingForm />
            </div>

            {/* Info column */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-navy-900 rounded-3xl p-7 text-white">
                <h3 className="font-poppins font-semibold text-lg mb-5">Clinic Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={15} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide font-semibold mb-0.5">Address</p>
                      <p className="text-sm text-white/90">{BUSINESS.fullAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Phone size={15} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide font-semibold mb-0.5">Phone</p>
                      <a href={`tel:${BUSINESS.phone}`} className="text-sm text-white/90 hover:text-teal-400 transition-colors">
                        {BUSINESS.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={15} className="text-teal-400" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-wide font-semibold mb-0.5">Email</p>
                      <a href={`mailto:${BUSINESS.email}`} className="text-sm text-white/90 hover:text-teal-400 transition-colors break-all">
                        {BUSINESS.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={15} className="text-teal-600" />
                  <h3 className="font-poppins font-semibold text-sm text-navy-900 uppercase tracking-wide">Office Hours</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(BUSINESS.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 capitalize">{day}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        hours === "Closed"
                          ? "bg-red-50 text-red-500"
                          : "bg-teal-50 text-teal-700"
                      }`}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5">
                <p className="text-sm font-semibold text-teal-800 mb-1">New Patients Welcome</p>
                <p className="text-xs text-teal-600 leading-relaxed">
                  We welcome patients of all ages. Give us a call or fill out our form to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Business Profile Store Locator */}
      <section className="pb-16 sm:pb-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="section-label mb-4">Find Us</span>
            <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-navy-900 mb-3">
              Locate Astra Dental Centre
            </h2>
            <p className="text-sm text-gray-500 max-w-xl mx-auto">
              Connected to our Google Business Profile — get directions, view hours, and navigate directly to our Langley clinic.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-card border border-gray-100" style={{ height: "600px" }}>
            <StoreLocator />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=49.1082904,-122.6667404"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white text-sm font-semibold rounded-full hover:bg-navy-800 transition-colors"
            >
              <Navigation size={16} />
              Get Directions
            </a>
            <a
              href={`tel:${BUSINESS.phone}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full hover:bg-teal-100 transition-colors"
            >
              <Phone size={16} />
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
