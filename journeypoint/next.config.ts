import type { NextConfig } from "next";

// Allow self-signed certs when proxying to local backend in development
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
