import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel için basePath kaldırıyoruz
  // basePath: '/ts',
  // assetPrefix: '/ts',
  
  // Static export'u kaldırıyoruz - Vercel serverless kullanacak
  // output: 'export',
  
  images: {
    unoptimized: true
  },
  
  // TypeScript checking'i aktif et
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Vercel için optimize ayarlar
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
