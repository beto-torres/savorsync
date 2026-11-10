import type { NextConfig } from "next";

const enderecoApi = process.env.API_URL ?? "http://localhost:3333";

if (process.env.VERCEL && !process.env.API_URL) {
  throw new Error("Configure API_URL na Vercel com a URL HTTPS do backend.");
}

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
  allowedDevOrigins: ["10.206.119.240"],
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
