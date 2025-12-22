/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/design-system"],
  // Enable logging to see cache behavior
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;

