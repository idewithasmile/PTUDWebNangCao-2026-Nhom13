/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL || 'http://localhost:9000';
    return [
      {
        source: '/culinary-blog/:path*',
        destination: `${minioUrl}/culinary-blog/:path*`,
      },
    ];
  },
};

export default nextConfig;

