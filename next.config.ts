import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 31622400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.origines.africa',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
  allowedDevOrigins: ['*.ngrok-free.app', '*.ngrok-free.dev', '*.ngrok.app'],
}

export default nextConfig
