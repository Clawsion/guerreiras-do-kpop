import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "standalone", // disabled — causes issues with next start
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
