import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a self-contained static copy in out/ with relative
// asset paths, so it can be hosted from any folder or link.
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(staticExport ? { output: "export" as const, assetPrefix: "." } : {}),
};

export default nextConfig;
