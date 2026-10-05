import type { NextConfig } from 'next';

const apiOrigin =
  process.env.API_BASE_URL ?? 'https://api-staging.sunmadeapartments.com';

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
    ],
  },
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
};

export default nextConfig;
