

"use client"


import { useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/naviagation"

import styles from "./Header.module.css"
import { ThemeSwitcher } from "@/components/ThemeSwitcher"
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
	]
	const pathname = usePathname()

	return (
		<header className={styles.primary}>
			<h3 className={styles.title}>📜 kuzminklk</h3>
			<nav>
				{ navigation.map((item) => {
					const isActive = pathname === item.href
					return (
						<h3 key={item.name} className={isActive ? styles.active : ""}>
							<Link href={item.href}>{item.name}<span className="emoji">{item.emoji}</span></Link>
						</h3>
					)
				})}
			</nav>
			<section className={styles.switchers}>
				{/* <ThemeSwitcher/> */}
				<LanguageSwitcher/>
			</section>
		</header>
	)
}