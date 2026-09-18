"use client"

import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/naviagation"

import styles from "./Header.module.css"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export function Header() {
	const translations = useTranslations("Header")
	const navigation = [
		{ name: translations("about"), href: "/about", emoji: "🧑‍🚀" },
		{ name: translations("development"), href: "/development", emoji: "💻" },
		{ name: translations("photography"), href: "/photography", emoji: "📸" },
		{ name: translations("sports"), href: "/sports", emoji: "💪" },
		{ name: translations("books"), href: "/books", emoji: "📚" },
		{ name: translations("writings"), href: "/writings", emoji: "📒" },
		{ name: translations("connect"), href: "/connect", emoji: "🤝" },
	] as const
	const pathname = usePathname()

	return (
		<header className={styles.primary}>
			<h3 className={styles.title}>📜 kuzminklk</h3>
			<nav>
				{navigation.map((link) => {
					const isActive = pathname === link.href
					return (
						<h3 key={link.name} className={isActive ? styles.active : ""}>
							<Link href={link.href}>
								{link.name}
								<span className="emoji">{link.emoji}</span>
							</Link>
						</h3>
					)
				})}
			</nav>
			<section className={styles.switchers}>
				<LanguageSwitcher />
			</section>
		</header>
	)
}
