import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "trlvrnhwqqbvujusqbhi.supabase.co",
      },
    ],
  },
};

export default nextConfig;
