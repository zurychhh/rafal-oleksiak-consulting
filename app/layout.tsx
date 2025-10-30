import type { Metadata } from "next";
import { Poppins, DM_Sans } from "next/font/google";
import "./globals.css";

// Configure Poppins for headlines
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-poppins",
  display: "swap",
});

// Configure DM Sans for body text
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rafał Oleksiak - CRM & Marketing Automation Consultant",
  description: "Expert CRM and Marketing Automation consulting services. Specializing in customer relationship management strategies and marketing automation solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${dmSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
