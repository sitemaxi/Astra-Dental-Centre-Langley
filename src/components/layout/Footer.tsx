import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ChevronRight, Facebook, Instagram } from "lucide-react";
import { BUSINESS } from "../../data/navigation";
import { serviceCategories } from "../../data/services";
import { locations } from "../../data/locations";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex mb-5">
              <img
                src="/Astra_Dental_LOGO_PNG_White.png"
                alt="Astra Dental Centre"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Compassionate, high-quality dental care for families in Langley and the Fraser Valley.
            </p>
            <div className="space-y-3">
              <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-teal-400 transition-colors group">
                <span className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600/40 transition-colors">
                  <Phone size={13} className="text-teal-500" />
                </span>
                {BUSINESS.phone}
              </a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-3 text-sm text-gray-300 hover:text-teal-400 transition-colors group whitespace-nowrap">
                <span className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-600/40 transition-colors">
                  <Mail size={13} className="text-teal-500" />
                </span>
                {BUSINESS.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <span className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-teal-500" />
                </span>
                <span>{BUSINESS.address}<br />{BUSINESS.city}</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-xs font-poppins font-semibold text-white uppercase tracking-widest mb-3">Follow Us</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61574706966726"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-800 text-gray-400 hover:bg-blue-600/30 hover:text-blue-400 transition-colors group"
                >
                  <Facebook size={14} />
                  <span className="text-xs font-medium">Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/astra_dentalcentre/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-800 text-gray-400 hover:bg-pink-600/30 hover:text-pink-400 transition-colors group"
                >
                  <Instagram size={14} />
                  <span className="text-xs font-medium">Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="lg:pl-4">
            <h3 className="font-poppins font-semibold text-white text-xs uppercase tracking-widest mb-5">Our Services</h3>
            <ul className="space-y-2">
              {serviceCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link to={cat.categoryPath} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-400 transition-colors group">
                    <ChevronRight size={11} className="text-gray-600 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-poppins font-semibold text-white text-xs uppercase tracking-widest mb-5">Locations We Serve</h3>
            <ul className="space-y-2">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link to={`/${loc.slug}/`} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-400 transition-colors group">
                    <ChevronRight size={11} className="text-gray-600 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                    {loc.footerName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-poppins font-semibold text-white text-xs uppercase tracking-widest mb-5">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "About the Dentist", href: "/about-the-dentist/" },
                { label: "All Services", href: "/langley-dental-services/" },
                { label: "Blog & Articles", href: "/blog/" },
                { label: "Contact Us", href: "/contact-us/" },
                { label: "Book Appointment", href: "/contact-us/" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-400 transition-colors group">
                    <ChevronRight size={11} className="text-gray-600 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-poppins font-semibold text-white text-xs uppercase tracking-widest mb-5">Office Hours</h3>
            <div className="space-y-2.5">
              {Object.entries(BUSINESS.hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 capitalize">{day}</span>
                  <span className={`font-medium text-xs px-2.5 py-0.5 rounded-full ${
                    hours === "Closed"
                      ? "bg-red-950/60 text-red-400"
                      : "bg-teal-900/40 text-teal-400"
                  }`}>
                    {hours}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3.5 bg-teal-600/10 border border-teal-600/20 rounded-xl">
              <p className="text-xs text-teal-300 font-semibold mb-0.5">New Patients Welcome</p>
              <p className="text-xs text-gray-400">Call us to schedule your first visit</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">&copy; {year} {BUSINESS.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/terms-and-conditions/" className="text-xs text-gray-500 hover:text-teal-400 transition-colors">Terms &amp; Conditions</Link>
            <span className="text-gray-700 text-xs">·</span>
            <Link to="/privacy-policy/" className="text-xs text-gray-500 hover:text-teal-400 transition-colors">Privacy Policy</Link>
          </div>
          <a href="https://sitemaxi.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-teal-400 transition-colors">Designed by Sitemaxi Canada</a>
        </div>
      </div>
    </footer>
  );
}
