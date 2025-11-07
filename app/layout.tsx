import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./critical.css"; // Critical CSS inlined for fastest FCP (above-the-fold only)
import "./globals.css"; // Remaining below-the-fold styles
import FontAwesomeLoader from "./components/FontAwesomeLoader";

// Configure Poppins for headlines - Optimized for mobile performance
const poppins = Poppins({
  subsets: ["latin"], // Latin subset includes Polish special characters
  weight: ["400", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
  adjustFontFallback: false, // Reduces CLS and prevents extra system font loading
  preload: true, // Prioritizes font in network waterfall
});

// Configure DM Sans for body text - Optimized for mobile performance
const dmSans = DM_Sans({
  subsets: ["latin"], // Latin subset includes Polish special characters
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
  adjustFontFallback: false, // Reduces CLS and prevents extra system font loading
  preload: true, // Prioritizes font in network waterfall
});

export const metadata: Metadata = {
  title: "Rafał Oleksiak - CRM & Marketing Automation Consultant",
  description: "Expert CRM and Marketing Automation consulting services. Specializing in customer relationship management strategies and marketing automation solutions.",
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
      </head>
      <body
        className={`${poppins.variable} ${dmSans.variable} antialiased`}
      >
        {/* Performance: Async load Font Awesome to prevent render blocking */}
        <FontAwesomeLoader />
        {children}
      </body>
    </html>
  );
}
