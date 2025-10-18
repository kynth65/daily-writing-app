import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize images for faster page loads
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Enable strict mode for better performance warnings
  reactStrictMode: true,

  // Reduce client-side JavaScript
  poweredByHeader: false,
};

export default nextConfig;
