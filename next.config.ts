import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress hydration warnings caused by browser extensions (e.g., Google Tag Assistant)
  // These warnings appear in development when extensions modify the DOM
  reactStrictMode: true,
};

export default nextConfig;
