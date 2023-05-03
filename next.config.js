/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    minify: false
  },
  typescript : {
    ignoreBuildErrors: true,
  },
  eslint : {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig
