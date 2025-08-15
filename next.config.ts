import type {NextConfig} from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // FIX: Enforce type checking for stability.
    ignoreBuildErrors: false,
  },
  eslint: {
    // FIX: Enforce linting for code quality.
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // ENHANCEMENT: Add basic security headers for production
  async headers() {
    if (isDev) return [];
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
