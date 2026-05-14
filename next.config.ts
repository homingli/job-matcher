import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/match": ["./HML.RESUME.md"]
  }
};

export default nextConfig;
