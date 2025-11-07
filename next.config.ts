import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Development
  reactStrictMode: true,

  // Performance: Enable compression
  compress: true,

  // Performance: Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Performance: Remove powered-by header
  poweredByHeader: false,

  // Performance: Generate ETags for caching
  generateEtags: true,

  // Performance: Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

// Enable bundle analyzer when ANALYZE=true
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
