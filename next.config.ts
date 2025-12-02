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
    // Optimize CSS loading
    optimizeCss: true,
  },
  
  // Performance: Headers for caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Performance: Use Turbopack (Next.js 16 default) with optimized code splitting
  // Turbopack provides automatic code splitting and tree-shaking
  // Combined with dynamic imports in page.tsx for optimal bundle sizes
  turbopack: {},
};

// Enable bundle analyzer when ANALYZE=true
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
