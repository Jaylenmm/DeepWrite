import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Disable ESLint during build for production
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js', '@stripe/stripe-js'],
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Compiler options for better performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
