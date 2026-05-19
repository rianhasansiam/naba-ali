/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src 'self' data: blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false,
  },

  compress: true,

  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; font-src 'self' https: data:; connect-src 'self' ws://localhost:3001 wss://localhost:3001 ws://localhost:3000 wss://localhost:3000 ws: wss: https://api.imgbb.com https: http://localhost:3001;",
          },
        ],
      },
    ]
  },

  // ── Dev-only proxy: forward /ws-api/* to the local WebSocket server ──────────
  // Allows Next.js API routes to call http://localhost:3001 without CORS issues
  // during local development. Has no effect in production (NEXT_PUBLIC_SOCKET_URL
  // points to Render, and direct fetch is used).
  async rewrites() {
    const isLocalDev = process.env.NODE_ENV === 'development';
    if (!isLocalDev) return [];

    return [
      {
        source: '/ws-api/:path*',
        destination: 'http://localhost:3001/:path*',
      },
    ];
  },

  // Suppress router scroll warnings for loading overlays
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  // Suppress development warnings
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Experimental features
  experimental: {
    // Suppress scroll restoration warnings
    scrollRestoration: true,
    // CSS and package optimization
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
