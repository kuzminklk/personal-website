

"use client"


import { useLocale } from "next-intl"

import { usePathname, useRouter } from "@/i18n/naviagation"
import styles from "./LanguageSwitcher.module.css"


export function LanguageSwitcher() {
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()

	const nextLocale = locale === "en" ? "ru" : "en"

	function switchLanguage() {
		router.replace(pathname, {
			"locale": nextLocale
		})
	}

	return (
		<button onClick={switchLanguage} className={styles.switcher} aria-label={`Switch to ${nextLocale}`}>
			{locale === "en" ? "🇺🇸" : "🇷🇺"}
		</button>
	)
}