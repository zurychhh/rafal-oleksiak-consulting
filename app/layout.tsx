import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./critical.css"; // Critical CSS inlined for fastest FCP (above-the-fold only)
import "./globals.css"; // Remaining below-the-fold styles
import "./fonts.css"; // IBM Plex hostowany lokalnie — zero zadan do Google
import FontAwesomeLoader from "./components/FontAwesomeLoader";
import ConsentMode from "./components/ConsentMode";
import CookieConsent from "./components/ui/CookieConsent";
import { GTMScript, GTMNoScript } from "./components/GTMScript";
import SchemaOrg from "./components/SchemaOrg";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { WebVitals } from "./components/WebVitals";
import { ScrollTracker } from "./components/ScrollTracker";

// Configure Poppins for headlines - Optimized for LCP
const poppins = Poppins({
  subsets: ["latin"], // Latin subset includes Polish special characters
  weight: ["400", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap", // Swap ensures font loads visibly
  adjustFontFallback: true, // Better CLS prevention
  preload: true, // Prioritizes font in network waterfall
});

// Configure DM Sans for body text - Optimized for LCP
const dmSans = DM_Sans({
  subsets: ["latin"], // Latin subset includes Polish special characters
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap", // Swap ensures font loads visibly
  adjustFontFallback: true, // Better CLS prevention
  preload: true, // Prioritizes font in network waterfall
});

export const metadata: Metadata = {
  title: "Rafał Oleksiak — FMCG ecommerce, end to end",
  description: "One market — things people finish and buy again — and the whole funnel tuned to it: paid, search, storefront, CRM and loyalty. Fifteen years at Allegro, mBank, Booksy and Genactiv.",
  keywords: ["FMCG ecommerce", "replenishment", "subscription commerce", "paid traffic quality", "ecommerce SEO", "conversion rate optimization", "marketing automation", "loyalty", "Shopify", "WooCommerce"],
  authors: [{ name: "Rafał Oleksiak" }],
  creator: "Rafał Oleksiak",
  publisher: "Rafał Oleksiak Consulting",
  openGraph: {
    // Ten sam tytul i opis co w metadata — nie dwie rozne wersje tej samej strony.
    title: "Rafał Oleksiak — FMCG ecommerce, end to end",
    description: "One market — things people finish and buy again — and the whole funnel tuned to it: paid, search, storefront, CRM and loyalty. Fifteen years at Allegro, mBank, Booksy and Genactiv.",
    url: "https://oleksiakconsulting.com",
    siteName: "Oleksiak Consulting",
    // Zapasowy obrazek dla wszystkich tras. Strona glowna nadpisuje metadata
    // wlasnym openGraph w app/page.tsx, ale /privacy, /stop i /blog dziedzicza
    // z layoutu — bez tego pola szly na LinkedIna bez zadnego podgladu.
    images: ["https://oleksiakconsulting.com/og.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafał Oleksiak — FMCG ecommerce, end to end",
    description: "One market — things people finish and buy again — and the whole funnel tuned to it: paid, search, storefront, CRM and loyalty. Fifteen years at Allegro, mBank, Booksy and Genactiv.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Consent Mode v2 - MUST be first script (before GTM/GA4) */}
        <ConsentMode />

        {/* IBM Plex jest hostowany lokalnie (app/fonts.css + public/fonts).
            Nie ma tu preconnectow do fonts.googleapis.com ani fonts.gstatic.com,
            bo zaden font nie jest juz pobierany z zewnatrz — <link> do Google
            wysylal IP odwiedzajacego przed zgoda i poza Consent Mode. */}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" />

        {/* Performance: DNS prefetch for third-party services */}
        <link rel="dns-prefetch" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googleadservices.com" />

        {/* Performance: Preload critical image for LCP optimization */}
        <link
          rel="preload"
          href="/images/rafal-oleksiak.png"
          as="image"
          fetchPriority="high"
        />

        {/* Schema.org JSON-LD structured data for rich snippets */}
        <SchemaOrg />
      </head>
      <body
        className={`${poppins.variable} ${dmSans.variable} antialiased`}
      >
        {/* GTM noscript fallback - must be first in body */}
        <GTMNoScript />

        {/* Performance: Async load Font Awesome to prevent render blocking */}
        <FontAwesomeLoader />
        {children}

        {/* GTM container (loads GA4, Google Ads, remarketing via GTM) */}
        <GTMScript />
        {/* Fallback: direct GA4 when GTM is not configured */}
        <GoogleAnalytics />
        <WebVitals />
        <ScrollTracker />

        {/* Banner zgody. Siedzi w layoucie, nie na stronie: ConsentMode ustawia
            domyślne 'denied' dla EOG, więc bez tego UI nie ma jak zgody udzielić
            i analityka jest ślepa na całym serwisie, nie tylko na stronie głównej. */}
        <CookieConsent />
      </body>
    </html>
  );
}
