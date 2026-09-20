import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  outputFileTracingIncludes: {
    "/api/**/*": ["./app/generated/prisma/**/*"],
  },
};

export default nextConfig;