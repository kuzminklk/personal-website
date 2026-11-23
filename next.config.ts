import createNextIntlPlugin from "next-intl/plugin"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	reactCompiler: true,
	// Localized redirects (`/` → About) live in `src/app/[locale]/page.tsx` so
	// the visitor's language is preserved instead of always redirecting to /about.
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
