/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.URL_SERVIDOR}/api/:path*`
      }
    ];
  }
};

export default nextConfig;