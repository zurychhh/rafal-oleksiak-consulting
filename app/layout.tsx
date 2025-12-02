import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./critical.css"; // Critical CSS inlined for fastest FCP (above-the-fold only)
import "./globals.css"; // Remaining below-the-fold styles
import FontAwesomeLoader from "./components/FontAwesomeLoader";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { WebVitals } from "./components/WebVitals";
import { ScrollTracker } from "./components/ScrollTracker";

// Configure Poppins for headlines - Optimized for LCP
const poppins = Poppins({
  subsets: ["latin"], // Latin subset includes Polish special characters
  weight: ["400", "600", "700", "900"],
  variable: "--font-poppins",
  display: "optional", // Better for LCP - shows fallback immediately if font not ready
  adjustFontFallback: true, // Better CLS prevention
  preload: true, // Prioritizes font in network waterfall
});

// Configure DM Sans for body text - Optimized for LCP
const dmSans = DM_Sans({
  subsets: ["latin"], // Latin subset includes Polish special characters
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "optional", // Better for LCP - shows fallback immediately if font not ready
  adjustFontFallback: true, // Better CLS prevention
  preload: true, // Prioritizes font in network waterfall
});

export const metadata: Metadata = {
  title: "Rafał Oleksiak - CRM & Marketing Automation Consultant",
  description: "Expert CRM and Marketing Automation consulting services. Specializing in customer relationship management strategies and marketing automation solutions.",
  keywords: ["CRM", "Marketing Automation", "Customer Relationship Management", "Email Automation", "CRM Strategy", "Revenue Growth", "Allegro", "Accenture", "Booksy"],
  authors: [{ name: "Rafał Oleksiak" }],
  creator: "Rafał Oleksiak",
  publisher: "Rafał Oleksiak Consulting",
  openGraph: {
    title: "Rafał Oleksiak - CRM & Marketing Automation Consultant",
    description: "Expert CRM and Marketing Automation consulting services. Specializing in customer relationship management strategies and marketing automation solutions.",
    url: "https://oleksiakconsulting.com",
    siteName: "Rafał Oleksiak Consulting",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rafał Oleksiak - CRM & Marketing Automation Consultant",
    description: "Expert CRM and Marketing Automation consulting services.",
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
        {/* Performance: Preconnect to external domains for faster DNS resolution */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />

        {/* Performance: DNS prefetch for third-party services */}
        <link rel="dns-prefetch" href="https://calendly.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Performance: Preload critical image for LCP optimization */}
        <link
          rel="preload"
          href="/images/rafal-oleksiak.png"
          as="image"
          fetchPriority="high"
        />
      </head>
      <body
        className={`${poppins.variable} ${dmSans.variable} antialiased`}
      >
        {/* Performance: Async load Font Awesome to prevent render blocking */}
        <FontAwesomeLoader />
        {children}

        {/* Google Analytics - loaded AFTER children for optimal performance */}
        <GoogleAnalytics />
        <WebVitals />
        <ScrollTracker />
      </body>
    </html>
  );
}
