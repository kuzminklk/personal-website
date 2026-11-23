import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { getPathname } from "@/i18n/navigation"
import { locales, type AppPathname, type Locale } from "@/i18n/routing"
import {
	absoluteUrl,
	openGraphImagePath,
	openGraphLocales,
	siteName,
	websiteURL,
} from "@/data/search-engine-optimization"

export type PageMetadataOptions = {
	locale: Locale
	/** Internal pathname key, e.g. "/development". */
	pathname: AppPathname
	/** Key under `metadata.pages` in the message files. */
	pageKey: string
}

/**
 * Build page metadata with canonical URL, hreflang alternates and localized
 * Open Graph / Twitter cards.
 *
 * Important for Telegram: `metadataBase` (set in the root layout) combined
 * with absolute image URLs means every crawler receives a fully-qualified
 * `og:image`, `og:url` and `og:image:type` — relative URLs are a common cause
 * of broken previews in Telegram.
 */
export async function buildPageMetadata({ locale, pathname, pageKey }: PageMetadataOptions): Promise<Metadata> {
	const translations = await getTranslations({ locale, namespace: "metadata" })

	const title = translations(`pages.${pageKey}.title`)
	const description = translations(`pages.${pageKey}.description`)
	const imageAlt = translations("images.open-graph.alternative")
	const imageUrl = absoluteUrl(openGraphImagePath(locale))

	const canonical = absoluteUrl(getPathname({ href: pathname, locale }))

	// hreflang map: one entry per locale plus x-default → English.
	const languages: Record<string, string> = Object.fromEntries(
		locales.map((entryLocale) => [entryLocale, absoluteUrl(getPathname({ href: pathname, locale: entryLocale }))]),
	)
	languages["x-default"] = absoluteUrl(getPathname({ href: pathname, locale: "en" }))

	const fullTitle = `${title} | ${siteName}`

	return {
		title,
		description,
		alternates: {
			canonical,
			languages,
		},
		openGraph: {
			type: "website",
			siteName,
			title: fullTitle,
			description,
			url: canonical,
			locale: openGraphLocales[locale],
			alternateLocale: locales.filter((entryLocale) => entryLocale !== locale).map((entry) => openGraphLocales[entry]),
			images: [
				{
					url: imageUrl,
					width: 1200,
					height: 630,
					alt: imageAlt,
					type: "image/png",
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description,
			images: [{ url: imageUrl, alt: imageAlt }],
		},
	}
}

/** Canonical URL for the site root (used in structured data). */
export const canonicalRoot = websiteURL
