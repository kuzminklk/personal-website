"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/naviagation"
import styles from "./page.module.css"
import Me from "@/public/me.jpg"

export default function About() {
	const translations = useTranslations("about")

	return (
		<main id="main-content" tabIndex={-1} className={styles.about}>
			<section className={styles.greet}>
				<h1>
					<span className={styles.emoji}>👋</span> {translations("greet.hi")}
					<br />
					<em>{translations("greet.introduction")}</em>
				</h1>
				<Image src={Me} alt={translations("greet.photo")} placeholder="blur" priority />
			</section>
			<section className={styles.introduction}>
				<p>
					{translations.rich("about.role", {
						strong: (chunks) => <strong>{chunks}</strong>,
					})}
				</p>
				<p>
					{translations.rich("about.names", {
						emphasize: (chunks) => <em>{chunks}</em>,
					})}
				</p>
				<p>
					{translations.rich("about.activities", {
						emoji: (chunks) => <span className="emoji">{chunks}</span>,
						sportsLink: (chunks) => <Link href="/sports">{chunks}</Link>,
						photographyLink: (chunks) => <Link href="/photography">{chunks}</Link>,
						booksLink: (chunks) => <Link href="/books">{chunks}</Link>,
					})}
				</p>
				<p>{translations("about.languages")}</p>
			</section>
			<section className={styles.explore} aria-label={translations("explore.heading")}>
				<h2>{translations("explore.heading")}</h2>
				<div className={styles.cards}>
					<Link href="/development" className={styles.card}>
						<span className={styles.cardIcon} aria-hidden="true">
							⌘
						</span>
						<span className={styles.cardTitle}>{translations("explore.development")}</span>
						<span className={styles.cardDescription}>{translations("explore.developmentDescription")}</span>
						<span className={styles.cardArrow} aria-hidden="true">
							↗
						</span>
					</Link>
					<Link href="/photography" className={styles.card}>
						<span className={styles.cardIcon} aria-hidden="true">
							◎
						</span>
						<span className={styles.cardTitle}>{translations("explore.photography")}</span>
						<span className={styles.cardDescription}>{translations("explore.photographyDescription")}</span>
						<span className={styles.cardArrow} aria-hidden="true">
							↗
						</span>
					</Link>
					<Link href="/sports" className={styles.card}>
						<span className={styles.cardIcon} aria-hidden="true">
							↗
						</span>
						<span className={styles.cardTitle}>{translations("explore.sports")}</span>
						<span className={styles.cardDescription}>{translations("explore.sportsDescription")}</span>
						<span className={styles.cardArrow} aria-hidden="true">
							↗
						</span>
					</Link>
				</div>
				<Link href="/connect" className={styles.contactLink}>
					{translations("explore.contact")} <span aria-hidden="true">→</span>
				</Link>
			</section>
		</main>
	)
}
