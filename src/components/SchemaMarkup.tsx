import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.astradentalcentre.com";
const CLINIC_IMAGE = `${SITE_URL}/Astra_Dental_Langley_Office.png`;

const DENTIST_BASE = {
  "@type": ["LocalBusiness", "Dentist"],
  "@id": `${SITE_URL}/#dentist`,
  name: "Astra Dental Centre",
  image: CLINIC_IMAGE,
  url: SITE_URL,
  telephone: "+16045338806",
  email: "reception@astradentalcentre.com",
  priceRange: "$$",
  currenciesAccepted: "CAD",
  paymentAccepted: "Cash, Credit Card, Direct Billing",
  description:
    "Astra Dental Centre in Langley, BC offers comprehensive family and cosmetic dental care including general dentistry, orthodontics, implants, and more.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 120, 20061 Fraser Hwy",
    addressLocality: "Langley",
    addressRegion: "BC",
    postalCode: "V3A 4E1",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 49.10863,
    longitude: -122.66712,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Friday"], opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "17:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "17:00" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "200",
  },
  sameAs: [
    "https://www.facebook.com/astradentalcentre",
    "https://www.google.com/maps?cid=astradentalcentre",
  ],
  hasMap: "https://www.google.com/maps/place/Astra+Dental+Centre",
};

// ---------------------------------------------------------------------------
// LocalBusiness / Dentist schema — homepage
// ---------------------------------------------------------------------------
interface LocalBusinessSchemaProps {
  faqs?: Array<{ question: string; answer: string }>;
}

export function LocalBusinessSchema({ faqs }: LocalBusinessSchemaProps) {
  const localBusiness = { "@context": "https://schema.org", ...DENTIST_BASE };

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}

// ---------------------------------------------------------------------------
// BlogPosting schema — blog post pages
// ---------------------------------------------------------------------------
interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  publishedAt?: string | null;
  modifiedAt?: string | null;
  slug: string;
  authorName?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export function ArticleSchema({
  title,
  description,
  image,
  publishedAt,
  modifiedAt,
  slug,
  authorName = "Astra Dental Centre",
  faqs,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: image ?? CLINIC_IMAGE,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: publishedAt ?? undefined,
    dateModified: modifiedAt ?? publishedAt ?? undefined,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Astra Dental Centre",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/Astra_Dental_LOGO_PNG.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
  };

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbList schema
// ---------------------------------------------------------------------------
interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.label,
        item: `${SITE_URL}${item.href}`,
      })),
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

// ---------------------------------------------------------------------------
// Service schema — individual service detail pages
// ---------------------------------------------------------------------------
interface FAQItem {
  question: string;
  answer: string;
  bullets?: string[];
}

interface ServiceSchemaProps {
  serviceName: string;
  description: string;
  slug: string;
  categorySlug: string;
  faqs?: FAQItem[];
}

export function ServiceSchema({ serviceName, description, slug, categorySlug, faqs }: ServiceSchemaProps) {
  const serviceUrl = `${SITE_URL}/${categorySlug}/${slug}/`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    description,
    url: serviceUrl,
    provider: {
      "@type": "Dentist",
      "@id": `${SITE_URL}/#dentist`,
      name: "Astra Dental Centre",
    },
    areaServed: {
      "@type": "City",
      name: "Langley",
    },
    serviceType: "Dental Service",
  };

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text:
                f.bullets && f.bullets.length > 0
                  ? `${f.answer} ${f.bullets.join(". ")}`.trim()
                  : f.answer,
            },
          })),
        }
      : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}

// ---------------------------------------------------------------------------
// ServiceCategory schema — category hub pages
// ---------------------------------------------------------------------------
interface ServiceCategorySchemaProps {
  categoryName: string;
  categoryPath: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export function ServiceCategorySchema({ categoryName, categoryPath, faqs }: ServiceCategorySchemaProps) {
  const dentistSchema = {
    "@context": "https://schema.org",
    ...DENTIST_BASE,
    url: `${SITE_URL}${categoryPath}`,
    description: `${categoryName} services at Astra Dental Centre in Langley, BC.`,
  };

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(dentistSchema)}</script>
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}

// ---------------------------------------------------------------------------
// Location schema — full Dentist/LocalBusiness per city page
// ---------------------------------------------------------------------------
interface LocationSchemaProps {
  cityName: string;
  locationPath: string;
  faqs?: Array<{ question: string; answer: string }>;
}

export function LocationSchema({ cityName, locationPath, faqs }: LocationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    ...DENTIST_BASE,
    url: `${SITE_URL}${locationPath}`,
    description: `Astra Dental Centre serves patients from ${cityName}, BC with comprehensive family and cosmetic dental care in nearby Langley.`,
    areaServed: [
      { "@type": "City", name: cityName },
      { "@type": "City", name: "Langley" },
    ],
  };

  const faqSchema =
    faqs && faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}

// ---------------------------------------------------------------------------
// MedicalBusiness schema — kept for ServicesHub backward compatibility
// ---------------------------------------------------------------------------
export function MedicalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    ...DENTIST_BASE,
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
