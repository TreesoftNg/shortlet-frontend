import type { NextConfig } from 'next';

const apiOrigin =
  process.env.API_BASE_URL ?? 'http://localhost:4000';

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/backend/:path*',
          destination: `${apiOrigin.replace(/\/$/, '')}/:path*`,
        },
      ],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api-staging.sunmadeapartments.com',
        pathname: '/media/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;
