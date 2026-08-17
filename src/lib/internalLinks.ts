// Maps legacy / generic link paths that do not exist on this site to their
// real page addresses. Used for router-level redirects, in-article link
// interception, and normalizing links saved from the blog editor.
export const LINK_REDIRECTS: Record<string, string> = {
  "/contact": "/contact-us/",
  "/services": "/langley-dental-services/",
  "/about": "/about-the-dentist/",
  "/services/general-dentistry": "/langley-dental-services/general-dentistry/",
  "/services/cosmetic-dentistry": "/langley-dental-services/cosmetic-dentistry/",
  "/services/preventive-dentistry": "/langley-dental-services/preventive-dentistry/",
  "/services/orthodontics": "/langley-dental-services/orthodontics/",
  "/services/endodontics": "/langley-dental-services/endodontics/",
  "/services/oral-surgery": "/langley-dental-services/oral-surgery/",
  "/services/dental-hygiene": "/langley-dental-services/preventive-dentistry/",
  "/services/emergency-dentistry": "/contact-us/",
  "/services/oral-surgery/dental-implants": "/langley-dental-services/dental-implants-langley/",
  "/services/dental-implants": "/langley-dental-services/dental-implants-langley/",
  "/services/cosmetic-dentistry/teeth-whitening": "/cosmetic-dentistry/zoom-teeth-whitening/",
  "/services/teeth-whitening": "/cosmetic-dentistry/zoom-teeth-whitening/",
  "/services/orthodontics/invisalign": "/orthodontics/invisalign/",
};

function stripTrailingSlash(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

// Returns the corrected path for a pathname, or null if no redirect applies.
export function lookupRedirect(pathname: string): string | null {
  return LINK_REDIRECTS[stripTrailingSlash(pathname)] ?? null;
}

// Given any href, returns an internal path (starting with "/") if it points to
// this site — applying redirects — or null when the link is external.
export function resolveInternalHref(href: string): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("#")
  ) {
    return null;
  }
  try {
    const url = new URL(trimmed, window.location.origin);
    if (url.origin !== window.location.origin) return null;
    const redirected = lookupRedirect(url.pathname);
    const path = redirected ?? url.pathname;
    return path + url.search + url.hash;
  } catch {
    return null;
  }
}
