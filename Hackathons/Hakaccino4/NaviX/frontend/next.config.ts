import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*.replit.dev", "*.pike.replit.dev", "*.repl.co"],
  transpilePackages: ["react-simple-maps", "@react-spring/web", "@react-spring/core", "@react-spring/shared", "@react-spring/types"],
};

export default nextConfig;
