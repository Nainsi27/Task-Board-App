import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // DO NOT include "output: 'export'" here
  // Render needs server-side rendering, not static export
};

export default nextConfig;
