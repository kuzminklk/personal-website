"use client"

import NextLink from "next/link"
import { useLocale, useTranslations } from "next-intl"

import { getPathname, usePathname } from "@/i18n/navigation"
import { localeOptions } from "@/i18n/routing"
import { PixelCheck } from "@/components/Glyphs"
import styles from "./LanguageSwitcher.module.css"

/**
 * Language switcher.
 *
 * Renders real `<Link>` elements (not buttons) so the language versions are
 * crawlable, middle-clickable and work without JavaScript. `next-intl` keeps
 * the visitor on the same page and translates the URL to the target locale.
 */
/**
 * Persist the switch for future visits. next-intl reads this cookie in the
 * middleware; setting it here keeps the language even if the URL is opened
 * later without a prefix.
 */
function rememberLocale(locale: string) {
	try {
		document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000;samesite=lax`
	} catch {
		// Cookies can be blocked; the current navigation still works.
	}
}

export function LanguageSwitcher({ variant = "compact" }: { variant?: "compact" | "full" }) {
	const locale = useLocale()
	const pathname = usePathname()
	const translations = useTranslations("LanguageSwitcher")

	return (
		<nav className={styles.switcher} data-variant={variant} aria-label={translations("switch")}>
			{variant === "full" ? <span className={styles.legend}>{translations("title")}</span> : null}
			<ul className={styles.list}>
				{localeOptions.map((option) => {
					const isActive = option.code === locale
					return (
						<li key={option.code}>
							<NextLink
								href={getPathname({ href: pathname, locale: option.code })}
								className={styles.option}
								data-active={isActive || undefined}
								aria-current={isActive ? "true" : undefined}
								hrefLang={option.code}
								lang={option.code}
								title={option.name}
								onClick={() => rememberLocale(option.code)}
							>
								<span className={styles.code}>{option.short}</span>
								{variant === "full" ? <span className={styles.name}>{option.name}</span> : null}
								{variant === "full" && isActive ? <PixelCheck size={12} className={styles.check} /> : null}
							</NextLink>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}
