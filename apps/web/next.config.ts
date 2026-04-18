import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@upwise/shared"],
  output: "standalone",
};

export default nextConfig;
