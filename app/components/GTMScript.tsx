import Script from 'next/script';

/**
 * Google Tag Manager - loads AFTER Consent Mode defaults
 *
 * GTM manages all tracking tags centrally:
 * - GA4 (measurement)
 * - Google Ads conversion tracking (AW-XXXXXXX)
 * - Google Ads remarketing tag
 * - Conversion linker
 * - Enhanced conversions
 * - (Future) Meta Pixel, LinkedIn Insight Tag
 *
 * Tags in GTM fire based on Consent Mode state.
 * When consent is 'denied', tags still load but don't set cookies
 * (enabling Google's conversion modeling).
 *
 * Setup in GTM:
 * 1. Create GA4 Configuration tag (G-WZWCGQLQ2Y)
 * 2. Create Google Ads Conversion tag (AW-XXXXXXX)
 * 3. Create Google Ads Remarketing tag
 * 4. Enable "Require additional consent for ad features" on all tags
 * 5. Set consent checks: ad_storage, analytics_storage
 */

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

export function GTMScript() {
  if (!GTM_ID) return null;

  return (
    <Script
      id="gtm-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
  );
}

export function GTMNoScript() {
  if (!GTM_ID) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
