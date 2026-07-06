const isDevelopment = process.env.NODE_ENV !== 'production';

const IMAGE_ORIGINS = [
  'https://images.unsplash.com',
  'https://lh3.googleusercontent.com',
  'https://upload.wikimedia.org',
  'https://i.ibb.co',
  'https://ibb.co',
  'https://ui-avatars.com',
  'https://via.placeholder.com',
];

const DEV_CONNECT_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'ws://localhost:3000',
  'ws://127.0.0.1:3000',
  'ws://localhost:3001',
  'ws://127.0.0.1:3001',
];

const normalizeOrigin = (value) => {
  if (!value) return null;

  const rawValue = String(value).trim();
  if (!rawValue) return null;

  try {
    const hasNetworkScheme = /^(https?|wss?):\/\//i.test(rawValue);
    const url = new URL(hasNetworkScheme ? rawValue : `https://${rawValue}`);
    return url.origin;
  } catch {
    return null;
  }
};

const isLoopbackOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return ['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'].includes(hostname);
  } catch {
    return false;
  }
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const getAllowedOrigins = (values, { allowLoopback = isDevelopment } = {}) => (
  unique(values.map(normalizeOrigin))
    .filter((origin) => allowLoopback || !isLoopbackOrigin(origin))
);

const getSocketSources = (values) => {
  const origins = getAllowedOrigins(values);

  return unique(origins.flatMap((origin) => {
    const url = new URL(origin);
    const isSecure = url.protocol === 'https:' || url.protocol === 'wss:';
    const httpProtocol = isSecure ? 'https:' : 'http:';
    const wsProtocol = isSecure ? 'wss:' : 'ws:';

    return [
      `${httpProtocol}//${url.host}`,
      `${wsProtocol}//${url.host}`,
    ];
  }));
};

const APP_ORIGINS = getAllowedOrigins([
  'https://skyzonee.com',
  'https://www.skyzonee.com',
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXTAUTH_URL,
  process.env.APP_URL,
  process.env.VERCEL_URL,
]);

const API_ORIGINS = getAllowedOrigins([
  process.env.NEXT_PUBLIC_API_URL,
]);

const SOCKET_SOURCES = getSocketSources([
  'https://skyzonee-websocket-server.onrender.com',
  process.env.NEXT_PUBLIC_SOCKET_URL,
  process.env.SOCKET_SERVER_URL,
  process.env.WEBSOCKET_SERVER_URL,
]);

const CONFIGURED_IMAGE_ORIGINS = getAllowedOrigins([
  process.env.NEXT_PUBLIC_IMAGE_CDN_URL,
  process.env.NEXT_PUBLIC_CDN_URL,
  process.env.IMAGE_CDN_URL,
  process.env.CDN_URL,
]);

const buildContentSecurityPolicy = () => {
  const directives = [
    ['default-src', "'self'"],
    ['base-uri', "'self'"],
    ['object-src', "'none'"],
    ['frame-ancestors', "'none'"],
    ['frame-src', "'none'"],
    ['form-action', "'self'"],
    ['script-src', "'self'", "'unsafe-inline'", ...(isDevelopment ? ["'unsafe-eval'"] : [])],
    ['style-src', "'self'", "'unsafe-inline'"],
    ['img-src', "'self'", 'data:', 'blob:', ...IMAGE_ORIGINS, ...CONFIGURED_IMAGE_ORIGINS],
    ['font-src', "'self'", 'data:'],
    [
      'connect-src',
      "'self'",
      ...APP_ORIGINS,
      ...API_ORIGINS,
      ...SOCKET_SOURCES,
      'https://api.emailjs.com',
      ...(isDevelopment ? DEV_CONNECT_ORIGINS : []),
    ],
    ['media-src', "'self'", 'data:', 'blob:'],
    ['worker-src', "'self'", 'blob:'],
    ['manifest-src', "'self'"],
  ];

  return directives
    .map(([directive, ...sources]) => `${directive} ${unique(sources).join(' ')}`)
    .join('; ');
};

const contentSecurityPolicy = buildContentSecurityPolicy();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
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
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'none'; img-src 'self' data: blob:; media-src 'self' data: blob:; script-src 'none'; style-src 'none'; sandbox;",
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
            value: contentSecurityPolicy,
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
