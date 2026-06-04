import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, Menu, X, ChevronDown, Calendar, Search, ArrowRight } from "lucide-react";
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
import { serviceCategories } from "../../data/services";

interface SearchResult {
  label: string;
  sublabel: string;
  href: string;
  type: "category" | "service";
}

function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const cat of serviceCategories) {
    results.push({
      label: cat.title,
      sublabel: "Service Category",
      href: cat.categoryPath,
      type: "category",
    });
    for (const svc of cat.services) {
      results.push({
        label: svc.title,
        sublabel: cat.title,
        href: `/${svc.categorySlug}/${svc.slug}/`,
        type: "service",
      });
    }
  }
  return results;
}

const SEARCH_INDEX = buildSearchIndex();

function ServiceSearch({ onSelect }: { onSelect?: () => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length >= 4) {
      const q = query.toLowerCase();
      const filtered = SEARCH_INDEX.filter(
        (r) =>
          r.label.toLowerCase().includes(q) ||
          r.sublabel.toLowerCase().includes(q)
      ).slice(0, 8);
      setResults(filtered);
      setOpen(filtered.length > 0);
    } else {
      setResults([]);
      setOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSelect(href: string) {
    setQuery("");
    setOpen(false);
    navigate(href);
    onSelect?.();
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); setQuery(""); }
          }}
          placeholder="Search for a service"
          className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-teal-400 focus:bg-white transition-all placeholder:text-gray-400"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
          {results.map((r) => (
            <button
              key={r.href}
              onClick={() => handleSelect(r.href)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface text-left transition-colors group border-b border-gray-50 last:border-0"
            >
              <div>
                <p className="text-sm font-semibold text-navy-900 group-hover:text-teal-700 transition-colors leading-tight">{r.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{r.sublabel}</p>
              </div>
              <ArrowRight size={13} className="text-gray-300 group-hover:text-teal-500 flex-shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2.5 flex items-center justify-between">
            <span className="text-sm text-navy-200 tracking-wide">
              Unit 120, 20061 Fraser Hwy, Langley, BC
            </span>
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${BUSINESS.email}`}
                className="text-sm text-navy-200 hover:text-teal-400 transition-colors"
              >
                {BUSINESS.email}
              </a>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
              >
                <Phone size={14} />
                {BUSINESS.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[84px] gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src="/Astra_Dental_Mobile_Logo.png"
                alt="Astra Dental Centre"
                className="h-20 w-auto"
                width="420"
                height="140"
                fetchPriority="high"
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-0.5 flex-shrink-0">
              {primaryNav.map((item) =>
                item.children ? (
                  <NavigationMenu key={item.label}>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-base font-semibold">
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {item.label === "Services" ? (
                            <div className="w-[360px] py-3">
                              <div className="px-3 pb-2.5">
                                <NavigationMenuLink asChild>
                                  <Link
                                    to={item.href}
                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-800 transition-colors"
                                  >
                                    <span>All Dental Services</span>
                                    <ChevronDown size={12} className="-rotate-90" />
                                  </Link>
                                </NavigationMenuLink>
                              </div>
                              <div className="border-t border-gray-50 pt-2 px-3 grid grid-cols-1 gap-0.5">
                                {item.children.map((child) => (
                                  <NavigationMenuLink asChild key={child.href}>
                                    <Link
                                      to={child.href}
                                      className="px-3 py-2.5 text-sm text-gray-600 hover:bg-surface hover:text-navy-900 rounded-lg transition-colors font-medium leading-tight block"
                                    >
                                      {child.label}
                                    </Link>
                                  </NavigationMenuLink>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="w-[240px] py-2 px-2">
                              {item.children.map((child) => (
                                <NavigationMenuLink asChild key={child.href}>
                                  <Link
                                    to={child.href}
                                    className="flex items-center gap-2 px-3 py-2.5 text-base text-gray-700 hover:bg-surface hover:text-navy-900 rounded-lg transition-colors font-medium"
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
                              "text-base font-semibold",
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

            {/* Desktop search + CTA */}
            <div className="hidden xl:flex items-center gap-3 flex-shrink-0">
              <div className="w-52">
                <ServiceSearch />
              </div>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center gap-1.5 text-base font-semibold text-navy-900 hover:text-teal-600 transition-colors whitespace-nowrap"
              >
                <Phone size={16} className="text-teal-600" />
                <span>{BUSINESS.phone}</span>
              </a>
              <Link to="/contact-us/" className="btn-teal !px-5 !py-2.5 !text-sm whitespace-nowrap flex-shrink-0">
                <Calendar size={14} />
                Book Now
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="xl:hidden w-12 h-12 flex items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 h-full w-[340px] bg-white shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <span className="font-poppins font-bold text-navy-900 text-lg">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mobile search bar */}
          <div className="px-4 py-3 border-b border-gray-100">
            <ServiceSearch onSelect={() => setMobileOpen(false)} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
            {primaryNav.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 text-base font-semibold text-navy-900 rounded-xl hover:bg-surface transition-colors"
                    onClick={() => setMobileExpandedItem(mobileExpandedItem === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 transition-transform ${mobileExpandedItem === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {mobileExpandedItem === item.label && (
                    <div className="pl-3 mt-1 space-y-0.5 mb-1">
                      {item.label === "Services" && (
                        <Link
                          to={item.href}
                          className="block px-4 py-3 text-base font-semibold text-teal-600 rounded-lg hover:bg-teal-50 transition-colors"
                        >
                          View All Services
                        </Link>
                      )}
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="block px-4 py-3 text-base text-gray-600 hover:text-navy-900 hover:bg-surface rounded-lg transition-colors"
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
                  className={`block px-4 py-4 text-base font-medium rounded-xl transition-colors ${
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
              className="flex items-center justify-center gap-2 w-full border-2 border-navy-900 text-navy-900 font-bold py-4 rounded-full text-base hover:bg-navy-900 hover:text-white transition-all duration-200"
            >
              <Phone size={18} />
              {BUSINESS.phone}
            </a>
            <Link to="/contact-us/" className="btn-teal w-full !py-4 !text-base">
              <Calendar size={18} />
              Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
