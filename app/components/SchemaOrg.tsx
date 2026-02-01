/**
 * Schema.org JSON-LD Structured Data
 *
 * Provides rich snippets to Google Search and Google Ads:
 * - Organization: company info, logo, contact, social
 * - Person: Rafał Oleksiak expertise profile
 * - ProfessionalService: consulting services
 * - WebSite: search action
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
      'Ecommerce conversion optimization, CRM strategy, and marketing automation consulting. 15+ years experience at Allegro, Booksy, mBank.',
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
      'Ecommerce Conversion Optimization',
      'CRM Strategy',
      'Marketing Automation',
      'Customer Retention',
      'UX Optimization',
      'Traffic Quality',
      'A/B Testing',
      'Data Analytics',
    ],
  };

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Rafał Oleksiak',
    jobTitle: 'Ecommerce Conversion & CRM Consultant',
    url: 'https://oleksiakconsulting.com',
    image: 'https://oleksiakconsulting.com/images/rafal-oleksiak.png',
    description:
      '15+ years optimizing traffic, UX, CRM and marketing automation at Allegro, Booksy, mBank.',
    worksFor: {
      '@type': 'Organization',
      name: 'Oleksiak Consulting',
    },
    alumniOf: [
      { '@type': 'Organization', name: 'Allegro' },
      { '@type': 'Organization', name: 'Booksy' },
      { '@type': 'Organization', name: 'mBank' },
    ],
    knowsAbout: [
      'Ecommerce',
      'Conversion Rate Optimization',
      'CRM',
      'Marketing Automation',
      'HubSpot',
      'Google Analytics',
      'A/B Testing',
    ],
    sameAs: [
      'https://www.linkedin.com/in/rafal-oleksiak/',
    ],
  };

  const professionalServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Oleksiak Consulting',
    description:
      'Expert ecommerce conversion optimization and CRM consulting. Free website audit with AI-powered analysis.',
    url: 'https://oleksiakconsulting.com',
    provider: {
      '@type': 'Person',
      name: 'Rafał Oleksiak',
    },
    areaServed: 'Europe',
    serviceType: [
      'Ecommerce Consulting',
      'Conversion Rate Optimization',
      'CRM Strategy',
      'Marketing Automation',
      'Website Audit',
    ],
    offers: {
      '@type': 'Offer',
      name: 'Free Website Audit',
      description: 'AI-powered LAMA audit analyzing 6 key areas of your website performance.',
      price: '0',
      priceCurrency: 'PLN',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Oleksiak Consulting',
    url: 'https://oleksiakconsulting.com',
    description: 'Ecommerce conversion & CRM consulting by Rafał Oleksiak',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
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
