/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactRoot: true,
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
