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
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const minioUrl = process.env.NEXT_PUBLIC_MINIO_URL || 'http://localhost:9000';
    const apiOrigin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1').replace(
      /\/api\/v1\/?$/,
      '',
    );
    return [
      {
        source: '/culinary-blog/:path*',
        destination: `${minioUrl}/culinary-blog/:path*`,
      },
      {
        source: '/sitemap.xml',
        destination: `${apiOrigin}/sitemap.xml`,
      },
    ];
  },
};

export default nextConfig;
