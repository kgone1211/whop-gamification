/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  images: {
    domains: ['whop.com', 'cdn.whop.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  async headers() {
    const isEmbedded = process.env.EMBEDDED_IN_WHOP === 'true';
    
    const baseHeaders = [
      {
        source: '/:path*',
        headers: isEmbedded
          ? [
              {
                key: 'Content-Security-Policy',
                value: "frame-ancestors 'self' https://whop.com https://*.whop.com",
              },
              {
                key: 'X-Frame-Options',
                value: 'ALLOW-FROM https://whop.com',
              },
            ]
          : [
              {
                key: 'X-Frame-Options',
                value: 'DENY',
              },
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'Referrer-Policy',
                value: 'strict-origin-when-cross-origin',
              },
            ],
      },
      {
        source: '/api/webhooks/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, x-whop-signature' },
        ],
      },
    ];
    
    return baseHeaders;
  },
};

module.exports = nextConfig;
