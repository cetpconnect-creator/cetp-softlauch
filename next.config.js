/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.tathva.org',
      },
      {
        protocol: 'https',
        hostname: 'tathva.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '2026.techkriti.org',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/workshops', destination: '/#workshops', permanent: false },
      { source: '/competitions', destination: '/#competitions', permanent: false },
      { source: '/passes', destination: '/#passes', permanent: false },
      { source: '/accommodation', destination: '/#accommodation', permanent: false },
    ];
  },
};

module.exports = nextConfig;
