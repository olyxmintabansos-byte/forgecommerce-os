import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/forgecommerce-os",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
