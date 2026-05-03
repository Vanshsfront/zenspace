import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "oiqfocwezhdwlgnqzylx.supabase.co" },
    ],
  },
  async redirects() {
    return [
      // Locate Us is now part of the contact page — bookmarks and old links keep working.
      { source: "/locate-us", destination: "/contact#map", permanent: true },
    ];
  },
};

export default nextConfig;
