/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

// CORS configuration for API routes
// In production, set ALLOWED_ORIGINS env var to comma-separated list of allowed origins
// e.g., ALLOWED_ORIGINS=https://ragaurd.com,https://app.ragaurd.com
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

const corsHeaders = [
  // Only allow specific origins - DO NOT use '*' in production
  { key: 'Access-Control-Allow-Origin', value: allowedOrigins[0] || 'http://localhost:3000' },
  { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, PATCH, DELETE, OPTIONS' },
  { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With' },
  { key: 'Access-Control-Allow-Credentials', value: 'true' },
  { key: 'Access-Control-Max-Age', value: '86400' }, // 24 hours preflight cache
];

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  // Security: Disable X-Powered-By header to avoid exposing Next.js version
  poweredByHeader: false,
  async headers() {
    return [
      // API routes get CORS headers
      {
        source: '/api/:path*',
        headers: [...securityHeaders, ...corsHeaders],
      },
      // All other routes get security headers only
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
