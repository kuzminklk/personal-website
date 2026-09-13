

import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"


const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true /* For quick prototyping… */
  },
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/about",
        permanent: true
      }
    ]
  }
};

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig);
