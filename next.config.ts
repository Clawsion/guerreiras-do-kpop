import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Server mode — enables API routes (video proxy) for external video hosting */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
