/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
    domains: ['img.clerk.com'], // Add any other domains you need
  },
};

module.exports = nextConfig;
