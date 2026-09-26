/**
 * Schema.org JSON-LD Structured Data
 *
 * Provides rich snippets to Google Search and Google Ads:
 * - Organization: company info, logo, contact, social
 * - ProfessionalService: consulting services
 * - WebSite: search action
 *
 * Person NIE jest tu renderowany. Encję Person dostarcza strona główna
 * (app/page.tsx) — jest specyficzna dla niszy FMCG i ma być jedyna na tym
 * URL-u; dwie encje Person to sygnał sprzeczny dla Google.
 * LinkedIn w sameAs = ten sam adres co w stopce strony i w Person z app/page.tsx.
 *
 * Impact on Google Ads:
 * - Improves Quality Score (landing page relevance)
 * - Enables rich ad extensions
 * - Better ad rank from structured trust signals
 */
export default function SchemaOrg() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Oleksiak Consulting',
    legalName: 'Rafał Oleksiak Consulting',
    url: 'https://oleksiakconsulting.com',
    logo: 'https://oleksiakconsulting.com/images/rafal-oleksiak.png',
    description:
      'FMCG ecommerce consulting, end to end — paid, search including AI answers, the storefront, CRM, subscription and loyalty, for anything bought again. Fifteen years at Allegro, mBank, Booksy and Genactiv.',
    foundingDate: '2024',
    founder: {
      '@type': 'Person',
      name: 'Rafał Oleksiak',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'rafal@oleksiakconsulting.com',
      availableLanguage: ['Polish', 'English'],
    },
    sameAs: [
      'https://www.linkedin.com/in/rafa%C5%82-oleksiak-3b322981/',
    ],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: 52.2297,
        longitude: 21.0122,
      },
      geoRadius: '2000',
    },
    // Zakres jak w system/USP.md: rynek FMCG / zakupy powtarzalne, caly lejek.
    knowsAbout: [
      'FMCG and repeat-purchase ecommerce',
      'Paid traffic quality',
      'SEO including AI answers',
      'Onsite conversion',
      'CRM and marketing automation',
      'Subscriptions',
      'Loyalty programmes',
    ],
  };

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Oleksiak Consulting',
    description:
      'FMCG ecommerce consulting, end to end — paid, search including AI answers, the storefront, CRM, subscription and loyalty, for anything bought again.',
    url: 'https://oleksiakconsulting.com',
    provider: {
      '@type': 'Person',
      name: 'Rafał Oleksiak',
    },
    areaServed: 'Europe',
    serviceType: [
      'FMCG Ecommerce Consulting',
      'Paid Traffic Quality',
      'Ecommerce SEO',
      'Conversion Rate Optimization',
      'Subscription and Replenishment',
      'Loyalty Programmes',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Oleksiak Consulting',
    url: 'https://oleksiakconsulting.com',
    description:
      "You don't pay twice for the same customer. FMCG and repeat-purchase ecommerce, end to end — paid traffic quality, SEO including AI answers, onsite conversion, CRM and marketing automation, subscriptions and loyalty.",
    publisher: {
      '@type': 'Organization',
      name: 'Oleksiak Consulting',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
