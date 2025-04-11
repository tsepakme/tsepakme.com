/** @type {import('next').NextConfig} */
const nextConfig = {
  // Включаем SWC
  swcMinify: true,
  
  // Поддержка MDX файлов
  experimental: {
    mdxRs: true,
  },

  // Дополнительные опции для обработки MDX при необходимости
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: '@mdx-js/loader',
          options: {
            providerImportSource: '@mdx-js/react',
          },
        },
      ],
    });
    return config;
  },
};

module.exports = nextConfig;