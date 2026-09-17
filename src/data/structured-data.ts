export function personSchema(websiteURL: string) {
	return {
		"@type": "Person",
		"@id": `${websiteURL}/#person`,
		name: "Daniel Cosmo",
		url: websiteURL,

		sameAs: [
			"https://github.com/kuzminklk",
			"https://www.tiktok.com/@kuzminklk",
			"https://instagram.com/kuzminklk",
			"https://www.youtube.com/@kuzminklk",
		],
	}
}

export function websiteSchema(websiteURL: string) {
	return {
		"@type": "WebSite",
		"@id": `${websiteURL}/#website`,
		url: websiteURL,
		name: "Daniel Cosmo",
		publisher: {
			"@id": `${websiteURL}/#person`,
		},
	}
}

export function globalStructuredData(websiteURL: string) {
	return {
		"@context": "https://schema.org",
		"@graph": [personSchema(websiteURL), websiteSchema(websiteURL)],
	}
}
