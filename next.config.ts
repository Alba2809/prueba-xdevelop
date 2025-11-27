import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://covers.openlibrary.org/b/id/*"),
    ]
  }
};

export default nextConfig;
