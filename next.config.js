/** @type {import('next').NextConfig} */
const { withKeystone } = require("@keystone-6/core/next");

const nextConfig = withKeystone({
  reactStrictMode: true,
  images: {
    domains: ['i.vimeocdn.com'],
  },
});

module.exports = nextConfig
