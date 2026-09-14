

"use client"


import { useLocale } from "next-intl"
import { useTranslations } from "next-intl"

import { usePathname, useRouter } from "@/i18n/naviagation"
import styles from "./LanguageSwitcher.module.css"


export function LanguageSwitcher() {
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()
	const translations = useTranslations("LanguageSwitcher")

	const nextLocale = locale === "en" ? "ru" : "en"

	const title = translations("title")

	function switchLanguage() {
		router.replace(pathname, {
			"locale": nextLocale
		})
	}

	return (
		<button onClick={switchLanguage} className={styles.switcher} title={title} aria-label={title}>
			{locale === "en" ? "🇺🇸" : "🇷🇺"}
		</button>
	)
}