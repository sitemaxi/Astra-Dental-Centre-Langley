import { Outlet, ScrollRestoration, Link, Navigate, useLocation } from "react-router-dom";
import { Phone, Calendar } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import RouteTracker from "../RouteTracker";
import { BUSINESS } from "../../data/navigation";
import { lookupRedirect } from "../../lib/internalLinks";

export default function Layout() {
  const { pathname, search, hash } = useLocation();
  const redirect = lookupRedirect(pathname);
  if (redirect) {
    return <Navigate to={`${redirect}${search}${hash}`} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollRestoration />
      <RouteTracker />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Mobile sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
        <a
          href={`tel:${BUSINESS.phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-navy-900 text-white text-sm font-semibold py-4 hover:bg-navy-800 transition-colors"
        >
          <Phone size={15} />
          Call Now
        </a>
        <Link
          to="/contact-us/"
          className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white text-sm font-semibold py-4 hover:bg-teal-700 transition-colors"
        >
          <Calendar size={15} />
          Book Appointment
        </Link>
      </div>

      {/* Spacer to prevent mobile CTA from covering content */}
      <div className="h-14 lg:hidden" />
    </div>
  );
}
