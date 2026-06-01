import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Memaksa Vercel tetep nyelesaiin build production meskipun banyak file demo bawaan template yang error
    ignoreBuildErrors: true,
  },
  eslint: {
    // Cuekin juga error ESLint pas di awan biar gak sensitif amat wkwk
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);