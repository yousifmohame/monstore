/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.pexels.com', 'via.placeholder.com'],
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // output: 'export',
  distDir: 'out'
}

module.exports = nextConfig