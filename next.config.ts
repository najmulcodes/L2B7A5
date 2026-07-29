import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Gear images are arbitrary provider-supplied URLs (see backend
    // GearItem.images - validated as URLs, not scoped to one host), so
    // remote patterns are intentionally permissive here.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
