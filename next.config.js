const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: false,
  swcMinify: true,
  cacheStartUrl: true,
  // disable: process.env.NODE_ENV === 'development',
  // runtimeCaching,
  // buildExcludes: [/middleware2.*manifest\.js$/],
  // scope: '/app',
  dynamicStartUrl: true,
  // dynamicStartUrlRedirect: '/login',
  // workboxOptions: {
  //   disableDevLogs: true,
  //   mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  // },
  // ... other options you like
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'macedosofthouse.s3.amazonaws.com',
        protocol: 'https',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_VAPID_PUBLIC_KEY: process.env.NEXT_VAPID_PUBLIC_KEY,
    NEXT_VERSION: process.env.NEXT_VERSION,
    NEXT_GOOGLE_API_KEY: process.env.NEXT_GOOGLE_API_KEY,
    NEXT_FRONT_URL: process.env.NEXT_FRONT_URL,
  },
}

module.exports = withPWA(nextConfig)
// module.exports = withBundleAnalyzer(nextConfig)
