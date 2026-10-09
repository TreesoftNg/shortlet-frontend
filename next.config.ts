import type { NextConfig } from 'next';

const DEFAULT_API_ORIGIN = 'https://api-staging.sunmadeapartments.com';

/** Env may be missing, blank, or wrapped in quotes on Vercel — never allow an invalid rewrite. */
function resolveApiOrigin(): string {
  const raw = (
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.API_BASE_URL ??
    ''
  )
    .trim()
    .replace(/^["']|["']$/g, '');

  if (!raw || (!raw.startsWith('http://') && !raw.startsWith('https://'))) {
    return DEFAULT_API_ORIGIN;
  }

  return raw.replace(/\/$/, '');
}

const apiOrigin = resolveApiOrigin();

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/backend/:path*',
          destination: `${apiOrigin}/:path*`,
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
  transpilePackages: ['flutterwave-react-v3'],
};

export default nextConfig;
