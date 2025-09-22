/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },

  // ---- reduce Webpack pack-file cache issues in development ----
  webpack(config, { dev }) {
    if (dev) {
      // disable persistent filesystem cache which is the common cause
      // of "rename ... .pack.gz_" ENOENT errors in some environments
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;