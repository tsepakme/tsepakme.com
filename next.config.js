
/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;