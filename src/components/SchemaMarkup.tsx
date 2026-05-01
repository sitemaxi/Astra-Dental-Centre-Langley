import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.astradentalcentre.com";
const CLINIC_IMAGE = `${SITE_URL}/Astra_Dental_Langley_Office.png`;

// ---------------------------------------------------------------------------
// LocalBusiness / Dentist schema for the homepage
// ---------------------------------------------------------------------------
interface LocalBusinessSchemaProps {
  faqs?: Array<{ question: string; answer: string }>;
}

export function LocalBusinessSchema({ faqs }: LocalBusinessSchemaProps) {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "Dentist"],
    "@id": `${SITE_URL}/#dentist`,
    name: "Astra Dental Centre",
    image: CLINIC_IMAGE,
    url: SITE_URL,
    telephone: "+16045338806",
    email: "reception@astradentalcentre.com",
    priceRange: "$$",
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
    servesCuisine: undefined,
    currenciesAccepted: "CAD",
    paymentAccepted: "Cash, Credit Card, Direct Billing",
  };

  const faqSchema = faqs && faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
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
// Article schema for blog posts
// ---------------------------------------------------------------------------
interface ArticleSchemaProps {
  title: string;
  description: string;
  image?: string;
  publishedAt?: string | null;
  modifiedAt?: string | null;
  slug: string;
  authorName?: string;
}

export function ArticleSchema({
  title,
  description,
  image,
  publishedAt,
  modifiedAt,
  slug,
  authorName = "Astra Dental Centre",
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
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

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
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
// MedicalBusiness schema for service/location pages
// ---------------------------------------------------------------------------
export function MedicalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Astra Dental Centre",
    image: CLINIC_IMAGE,
    url: SITE_URL,
    telephone: "+16045338806",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 120, 20061 Fraser Hwy",
      addressLocality: "Langley",
      addressRegion: "BC",
      postalCode: "V3A 4E1",
      addressCountry: "CA",
    },
    medicalSpecialty: "Dentistry",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
