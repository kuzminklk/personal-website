import type { MetadataRoute } from "next"

import { getPathname } from "@/i18n/navigation"
import { locales, pageEntries } from "@/i18n/routing"
import { websiteURL } from "@/data/search-engine-optimization"

/**
 * Localized sitemap with `hreflang` alternates for every page — one entry per
 * page containing all four language versions (standard multilingual SEO
 * pattern recommended by Google).
 */
export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date()

	return pageEntries.flatMap((entry) => {
		const languages: Record<string, string> = Object.fromEntries(
			locales.map((locale) => [locale, `${websiteURL}${getPathname({ href: entry.pathname, locale })}`]),
		)
		languages["x-default"] = `${websiteURL}${getPathname({ href: entry.pathname, locale: "en" })}`

		return locales.map((locale) => ({
			url: `${websiteURL}${getPathname({ href: entry.pathname, locale })}`,
			lastModified,
			changeFrequency: "monthly" as const,
			priority: entry.pathname === "/about" ? 1 : 0.8,
			alternates: { languages },
		}))
	})
}
