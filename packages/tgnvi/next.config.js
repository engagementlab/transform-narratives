/** @type {import('next').NextConfig} */
// const { withKeystone } = require('@keystone-6/core/next');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.vimeocdn.com'],
    loader: 'custom',
  },
  trailingSlash: true,
};

module.exports = nextConfig;
