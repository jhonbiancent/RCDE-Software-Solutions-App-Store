import type { NextConfig } from "next";

const supabaseUrl = process.env.SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 31536000,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseUrl ? new URL(supabaseUrl).hostname : "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
