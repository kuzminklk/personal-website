import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"

import { websiteURL } from "@/data/search-engine-optimization"

const pages = [
	"/about",
	"/development",
	"/photography",
	"/sports",
	"/books",
	"/writings",
	"/connect",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
	return pages.flatMap((pathname) =>
		routing.locales.map((locale) => {
			const localizedPathname = routing.pathnames[pathname][locale]

			return {
				url: `${websiteURL}/${locale}${localizedPathname}`,
			}
		}),
	)
}
