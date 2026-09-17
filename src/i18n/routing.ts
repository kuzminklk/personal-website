import { defineRouting } from "next-intl/routing"

export const locales = ["en", "ru"] as const

export const routing = defineRouting({
	locales: locales,
	defaultLocale: "en",
	localePrefix: "as-needed",
	pathnames: {
		"/about": {
			en: "/about",
			ru: "/обо-мне",
		},
		"/development": {
			en: "/development",
			ru: "/программирование",
		},
		"/photography": {
			en: "/photography",
			ru: "/фотографии",
		},
		"/sports": {
			en: "/sports",
			ru: "/спорт",
		},
		"/books": {
			en: "/books",
			ru: "/книги",
		},
		"/writings": {
			en: "/writings",
			ru: "/сочинения",
		},
		"/connect": {
			en: "/connect",
			ru: "/связаться-со-мной",
		},
	},
})
