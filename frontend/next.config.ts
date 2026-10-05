import type { NextConfig } from "next";

const enderecoApi = process.env.API_URL ?? "http://localhost:3333";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  images: {
    localPatterns: [
      { pathname: "/logo.png" },
      { pathname: "/ete-logo.png" },
      { pathname: "/integrantes/**" },
    ],
  },
  allowedDevOrigins: ["192.168.0.179"],
  async rewrites() {
    return [
      {
        source: "/api/:caminho*",
        destination: `${enderecoApi}/api/:caminho*`,
      },
    ];
  },
};

export default nextConfig;
