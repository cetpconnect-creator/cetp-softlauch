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
};

module.exports = nextConfig;
