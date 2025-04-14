/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js already handles CSS extraction in its built-in webpack configuration
  // We don't need to manually add mini-css-extract-plugin
};

module.exports = nextConfig;
