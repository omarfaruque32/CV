import type { NextConfig } from "next";

const isVercelBuild =
  process.env.VERCEL === "1" || process.env.BUILD_TARGET === "vercel";

const nextConfig: NextConfig = {
  // The Sites build includes Cloudflare worker modules. Native Next.js builds
  // use an app-only TypeScript project so Vercel does not type-check those
  // platform-specific entry points.
  typescript: isVercelBuild
    ? { tsconfigPath: "./tsconfig.vercel.json" }
    : undefined,
};

export default nextConfig;
