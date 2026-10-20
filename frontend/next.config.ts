import type { NextConfig } from "next";

// Product photos are served from Laravel's public storage, e.g. http://localhost:8000/storage/products/x.jpg
const apiOrigin = new URL(process.env.API_URL ?? "http://localhost:8000/api/v1");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: apiOrigin.protocol.replace(":", "") as "http" | "https",
        hostname: apiOrigin.hostname,
        port: apiOrigin.port,
        pathname: "/storage/**",
      },
    ],
    // 90 is used for the category photos, where fine jewelry detail matters
    qualities: [75, 90],
    // The local Laravel server runs on localhost; only allow that during development
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
