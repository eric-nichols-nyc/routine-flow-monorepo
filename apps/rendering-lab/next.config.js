/**
 * =============================================================================
 * RENDERING LAB: Next.js Configuration
 * =============================================================================
 *
 * This project demonstrates all Next.js rendering methods.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/design-system"],

  // Enable experimental features for PPR demo
  experimental: {
    // Partial Prerendering - combines static and dynamic content
    // ppr: true, // Uncomment when you want to demo PPR
  },
};

export default nextConfig;

