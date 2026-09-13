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
 * Uwaga: usunięty blok trzymał jedyny w repo adres LinkedIna
 * (sameAs), którego brakuje w JSON-LD strony.
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
      'https://www.linkedin.com/in/rafal-oleksiak/',
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
    knowsAbout: [
      'FMCG Ecommerce',
      'Replenishment and Recurring Purchase',
      'Paid Traffic Quality',
      'Ecommerce SEO and AI Answers',
      'Onsite Conversion Optimization',
      'Subscription and Loyalty Programmes',
      'CRM and Marketing Automation',
      'Shopify and WooCommerce',
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
      'One market — FMCG and anything bought again. Inside it the whole funnel: paid, search including AI answers, the storefront, CRM, subscription, loyalty. Fifteen years at Allegro, mBank, Booksy and Genactiv.',
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
