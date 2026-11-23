import { defineRouting } from "next-intl/routing"

/**
 * Supported locales.
 *
 * Locale codes follow BCP 47 / ISO 639-1 so that `<html lang>`, `hreflang`
 * links and Open Graph `og:locale` values are valid for search engines:
 * - `en` — English
 * - `ru` — Russian
 * - `be` — Belarusian (ISO 639-1; not the non-standard `by`)
 * - `pl` — Polish
 */
export const locales = ["en", "ru", "be", "pl"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

/**
 * Human readable data for the language switcher. Native names are deliberately
 * not translated — a language is always written in its own language.
 */
export const localeOptions: ReadonlyArray<{
	code: Locale
	/** Short code shown in the compact switch. */
	short: string
	/** Native language name, used as an accessible label / tooltip. */
	name: string
}> = [
	{ code: "en", short: "EN", name: "English" },
	{ code: "ru", short: "RU", name: "Русский" },
	{ code: "be", short: "BE", name: "Беларуская" },
	{ code: "pl", short: "PL", name: "Polski" },
]

/**
 * Localized pathnames. Every page has a human readable translation of its URL
 * in all four languages. Slavic URLs use their native scripts (Cyrillic for
 * Russian and Belarusian), Polish uses ASCII slugs to keep links short and
 * copyable.
 */
export const routing = defineRouting({
	locales,
	defaultLocale,
	localePrefix: "as-needed",
	pathnames: {
		"/about": {
			en: "/about",
			ru: "/обо-мне",
			be: "/пра-мяне",
			pl: "/o-mnie",
		},
		"/development": {
			en: "/development",
			ru: "/программирование",
			be: "/праграмаванне",
			pl: "/programowanie",
		},
		"/photography": {
			en: "/photography",
			ru: "/фотографии",
			be: "/фатаграфіі",
			pl: "/fotografia",
		},
		"/sports": {
			en: "/sports",
			ru: "/спорт",
			be: "/спорт",
			pl: "/sport",
		},
		"/books": {
			en: "/books",
			ru: "/книги",
			be: "/кнігі",
			pl: "/ksiazki",
		},
		"/writings": {
			en: "/writings",
			ru: "/сочинения",
			be: "/творы",
			pl: "/teksty",
		},
		"/connect": {
			en: "/connect",
			ru: "/связаться-со-мной",
			be: "/звязацца",
			pl: "/kontakt",
		},
	},
})

/** Internal (untranslated) pathnames, in navigation order. */
export const pageEntries = [
	{ pathname: "/about", key: "about", icon: "astronaut" },
	{ pathname: "/development", key: "development", icon: "laptop" },
	{ pathname: "/photography", key: "photography", icon: "camera" },
	{ pathname: "/sports", key: "sports", icon: "muscle" },
	{ pathname: "/books", key: "books", icon: "books" },
	{ pathname: "/writings", key: "writings", icon: "notebook" },
	{ pathname: "/connect", key: "connect", icon: "handshake" },
] as const

export type PageKey = (typeof pageEntries)[number]["key"]
export type AppPathname = keyof typeof routing.pathnames
