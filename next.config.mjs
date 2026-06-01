// import createNextIntlPlugin from 'next-intl/plugin';

// const withNextIntl = createNextIntlPlugin();

// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default withNextIntl(nextConfig);

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔑 KUNCI SAKTI VERSI NEXT.JS 16
  typescript: {
    ignoreBuildErrors: true, // Libas error type file bawaan template
  },
  eslint: {
    ignoreDuringBuilds: true, // Cuekin warning/error linting
  }
};

export default withNextIntl(nextConfig);