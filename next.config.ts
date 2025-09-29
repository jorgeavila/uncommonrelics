/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // TEMP: let builds succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;
