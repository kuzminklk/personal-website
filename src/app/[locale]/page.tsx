import { permanentRedirect } from "next/navigation"

import { getPathname } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"

/**
 * The site has no standalone landing page: the About page is the home page.
 * Locale-aware permanent redirect keeps `/`, `/ru`, `/be`, `/pl` useful and
 * preserves the visitor's language.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params
	permanentRedirect(getPathname({ href: "/about", locale: locale as Locale }))
}
