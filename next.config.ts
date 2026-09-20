import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "@prisma/engines"],
};

export default nextConfig;