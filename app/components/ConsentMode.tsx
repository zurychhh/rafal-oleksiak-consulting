import Script from 'next/script';

/**
 * Google Consent Mode v2 - MUST be the first script in <head>
 *
 * Sets default consent to 'denied' for all storage types.
 * CookieConsent component updates consent state on user action.
 *
 * Required for:
 * - GDPR compliance in EU (mandatory since March 2024)
 * - Google Ads conversion modeling
 * - GA4 behavioral modeling
 * - Remarketing audience building
 *
 * @see https://developers.google.com/tag-platform/security/guides/consent
 */
export default function ConsentMode() {
  return (
    <Script
      id="consent-mode-defaults"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}

          // Consent Mode v2 defaults - everything denied until user accepts
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'denied',
            'personalization_storage': 'denied',
            'security_storage': 'granted',
            'wait_for_update': 500,
            'region': ['PL', 'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH']
          });

          // For non-EU visitors, grant by default
          gtag('consent', 'default', {
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted',
            'analytics_storage': 'granted',
            'functionality_storage': 'granted',
            'personalization_storage': 'granted',
            'security_storage': 'granted'
          });

          // URL passthrough for better attribution when cookies are denied
          gtag('set', 'url_passthrough', true);

          // Redact ads data when consent denied (privacy-safe)
          gtag('set', 'ads_data_redaction', true);
        `,
      }}
    />
  );
}
