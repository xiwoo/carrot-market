/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    runtime: 'edge',
    serverComponents: true,
  },
  images: {
    domains: [
      "imagedelivery.net",
      "videodelivery.net",
      "live.cloudflare.com",
    ],
  }
}

module.exports = nextConfig
