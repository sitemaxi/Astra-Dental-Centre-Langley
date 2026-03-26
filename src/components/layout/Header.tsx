import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Menu, X, ChevronDown, Calendar } from "lucide-react";
import { BUSINESS, primaryNav } from "../../data/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "../ui/navigation-menu";
import { cn } from "../../lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${
          scrolled ? "shadow-[0_2px_20px_rgba(11,60,93,0.10)]" : ""
        }`}
      >
        {/* Top bar */}
        <div className="hidden md:block bg-navy-950">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2 flex items-center justify-between">
            <span className="text-xs text-navy-200 tracking-wide">
              Unit 120, 20061 Fraser Hwy, Langley, BC
            </span>
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${BUSINESS.email}`}
                className="text-xs text-navy-200 hover:text-teal-400 transition-colors"
              >
                {BUSINESS.email}
              </a>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
              >
                <Phone size={12} />
                {BUSINESS.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/Astra_Dental_Mobile_Logo.png"
                alt="Astra Dental Centre"
                className="h-16 w-auto"
              />
            </Link>

            {/* Desktop nav — each dropdown item has its own NavigationMenu root */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {primaryNav.map((item) =>
                item.children ? (
                  <NavigationMenu key={item.label}>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-sm font-medium">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {item.label === "Services" ? (
                            <div className="w-[280px] py-3">
                              <div className="px-3 pb-2.5">
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={item.href}
                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 transition-colors"
                                  >
                                    <span>All Dental Services</span>
                                    <ChevronDown size={11} className="-rotate-90" />
                                  </Link>
                                </NavigationMenuLink>
                              </div>
                              <div className="border-t border-gray-50 pt-2 px-3 grid grid-cols-2 gap-0.5">
                                {item.children.map((child) => (
                                  <NavigationMenuLink asChild key={child.href}>
                                    <Link
                                      to={child.href}
                                      className="px-3 py-2 text-[11.5px] text-gray-600 hover:bg-surface hover:text-navy-900 rounded-lg transition-colors font-medium leading-tight block"
                                    >
                                      {child.label}
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="w-[220px] py-2 px-2">
                              {item.children.map((child) => (
                                <NavigationMenuLink asChild key={child.href}>
                                  <Link
                                    to={child.href}
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-surface hover:text-navy-900 rounded-lg transition-colors font-medium"
                                  >
                                    {child.label}
                                  </Link>
                                </NavigationMenuLink>
                              ))}
                            </div>
                          )}
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <NavigationMenu key={item.href}>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className={cn(
                              navigationMenuTriggerStyle(),
                              location.pathname === item.href
                                ? "text-navy-900 bg-navy-50"
                                : ""
                            )}
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                )
              )}
            </nav>

            {/* CTA + phone */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-teal-600 transition-colors"
              >
                <Phone size={14} className="text-teal-600" />
                <span>{BUSINESS.phone}</span>
              </a>
              <Link to="/contact-us/" className="btn-teal !px-5 !py-2.5 !text-xs">
                <Calendar size={13} />
                Book Appointment
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[320px] bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <span className="font-poppins font-semibold text-navy-900 text-sm">Navigation</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0.5">
            {primaryNav.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-navy-900 rounded-xl hover:bg-surface transition-colors"
                    onClick={() => setMobileExpandedItem(mobileExpandedItem === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${mobileExpandedItem === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileExpandedItem === item.label && (
                    <div className="pl-3 mt-1 space-y-0.5 mb-1">
                      {item.label === "Services" && (
                        <Link
                          to={item.href}
                          className="block px-4 py-2.5 text-sm font-semibold text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          View All Services
                        </Link>
                      )}
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-600 hover:text-navy-900 hover:bg-surface rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    location.pathname === item.href
                      ? "bg-navy-50 text-navy-900 font-semibold"
                      : "text-gray-700 hover:bg-surface"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <a
              href={`tel:${BUSINESS.phone}`}
              className="flex items-center justify-center gap-2 w-full border-2 border-navy-900 text-navy-900 font-semibold py-3 rounded-full text-sm hover:bg-navy-900 hover:text-white transition-all duration-200"
            >
              <Phone size={15} />
              {BUSINESS.phone}
            </a>
            <Link to="/contact-us/" className="btn-teal w-full !py-3">
              <Calendar size={15} />
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
