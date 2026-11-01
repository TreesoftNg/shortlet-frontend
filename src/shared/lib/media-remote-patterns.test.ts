import { hasRemoteMatch } from 'next/dist/shared/lib/match-remote-pattern';
import { describe, expect, it } from 'vitest';
import { mediaRemotePatterns } from './media-remote-patterns';

const S3_HOST = 'sunmade-s3.s3.us-east-1.amazonaws.com';

describe('mediaRemotePatterns', () => {
  it.each([undefined, '', '   ', '""', 'not a url', 'ftp://files.example.com'])(
    'falls back to the production bucket for %j',
    (raw) => {
      expect(mediaRemotePatterns(raw)).toEqual([
        {
          protocol: 'https',
          hostname: S3_HOST,
          port: '',
          pathname: '/tenants/**',
        },
      ]);
    },
  );

  it('uses the configured media address, quotes and trailing slash removed', () => {
    expect(
      mediaRemotePatterns('"https://media.sunmadeapartments.com/"'),
    ).toEqual([
      {
        protocol: 'https',
        hostname: 'media.sunmadeapartments.com',
        port: '',
        pathname: '/tenants/**',
      },
    ]);
  });

  it('lets next/image load unit photos but not pending uploads', () => {
    const patterns = mediaRemotePatterns(undefined);
    const photo = new URL(
      `https://${S3_HOST}/tenants/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/units/u1/photos/p1/medium.webp`,
    );
    const pending = new URL(`https://${S3_HOST}/uploads/pending/p1.png`);

    expect(hasRemoteMatch([], patterns, photo)).toBe(true);
    expect(hasRemoteMatch([], patterns, pending)).toBe(false);
  });

  it('keeps a port and a base path', () => {
    expect(mediaRemotePatterns('http://localhost:9000/bucket')).toEqual([
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/bucket/tenants/**',
      },
    ]);
  });
});
