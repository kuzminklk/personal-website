import { locales } from "@/i18n/routing"

/**
 * JSON-LD structured data for search engines.
 *
 * A Person node and a WebSite node describe the author and the site; the
 * ProfilePage node ties the locale to the person so Google can surface the
 * page as a personal profile. Kept deliberately modest — no fake ratings or
 * search actions that the site does not actually provide.
 */
export function personSchema(websiteURL: string) {
	return {
		"@type": "Person",
		"@id": `${websiteURL}/#person`,
		name: "Daniel Cosmo",
		alternateName: ["Даниил Кузьмин", "kuzminklk"],
		url: websiteURL,
		image: `${websiteURL}/me-pixel-light.png`,
		jobTitle: "Computer-science engineer",
		knowsLanguage: ["en", "ru", "be", "pl"],
		sameAs: [
			"https://github.com/kuzminklk",
			"https://t.me/kuzminklk",
			"https://www.tiktok.com/@kuzminklk",
			"https://instagram.com/kuzminklk",
			"https://www.youtube.com/@kuzminklk",
			"https://www.linkedin.com/in/kuzminklk/",
			"https://unsplash.com/@kuzminklk",
			"https://dev.to/kuzminklk",
			"https://farcaster.xyz/kuzminklk",
		],
	}
}

export function websiteSchema(websiteURL: string) {
	return {
		"@type": "WebSite",
		"@id": `${websiteURL}/#website`,
		url: websiteURL,
		name: "Daniel Cosmo",
		inLanguage: locales,
		publisher: {
			"@id": `${websiteURL}/#person`,
		},
	}
}

export function profilePageSchema(websiteURL: string, locale: string, pageURL: string, description: string) {
	return {
		"@type": "ProfilePage",
		"@id": `${pageURL}/#profile`,
		url: pageURL,
		name: "Daniel Cosmo",
		description,
		inLanguage: locale,
		isPartOf: {
			"@id": `${websiteURL}/#website`,
		},
		mainEntity: {
			"@id": `${websiteURL}/#person`,
		},
	}
}

/** Site-wide graph: rendered once in the locale layout. */
export function globalStructuredData(websiteURL: string) {
	return {
		"@context": "https://schema.org",
		"@graph": [personSchema(websiteURL), websiteSchema(websiteURL)],
	}
}
