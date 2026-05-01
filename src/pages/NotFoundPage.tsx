import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import SEOHead from "../components/SEOHead";

export default function NotFoundPage() {
  return (
    <>
      <SEOHead
        title="Page Not Found | Astra Dental Centre"
        description="The page you are looking for does not exist. Return to Astra Dental Centre homepage."
        noIndex
        canonicalPath="/"
      />
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-8xl font-bold text-navy-100 mb-4 font-poppins">404</p>
          <h1 className="text-2xl font-bold text-navy-900 font-poppins mb-3">Page Not Found</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-teal-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <Home size={15} />
              Back to Home
            </Link>
            <Link
              to="/contact-us/"
              className="inline-flex items-center justify-center gap-2 border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              <ArrowLeft size={15} />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
