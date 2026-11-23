import type { MetadataRoute } from "next"

import { websiteURL } from "@/data/search-engine-optimization"

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${websiteURL}/sitemap.xml`,
		host: new URL(websiteURL).host,
	}
}
