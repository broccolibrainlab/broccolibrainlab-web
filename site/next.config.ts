import type { NextConfig } from "next";

// Static export so the site can be hosted anywhere (GitHub Pages included).
// For a GitHub Pages project site, build with NEXT_PUBLIC_BASE_PATH=/<repo-name>.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    // Serve the supplied images byte-for-byte; the hero brain must not be re-encoded.
    unoptimized: true,
  },
};

export default nextConfig;
