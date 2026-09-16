"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/i18n/naviagation"
import styles from "./page.module.css"
import Me from "@/public/me.jpg"

function scrollToTop() {
	window.scrollTo({ top: 0, behavior: "smooth" })
}

export default function About() {
	const translations = useTranslations("about")

	return (
		<main className={styles.about}>
			<section className={styles.greet}>
				<h1>
					<span className={styles.emoji}>👋</span> {translations("greet.hi")}
					<br />
					<em>{translations("greet.introduction")}</em>
				</h1>
				<Image src={Me} alt={translations("greet.photo")} placeholder="blur"></Image>
			</section>
			<section className={styles.about}>
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
			<section className={styles.explore}>
				<p>
					<em>
						{translations.rich("explore", {
							emoji: (chunks) => <span className="emoji">{chunks}</span>,
							scroll: (chunks) => (
								<a
									href=""
									onClick={(event) => {
										event.preventDefault()
										scrollToTop()
									}}
								>
									{chunks}
								</a>
							),
						})}
					</em>
				</p>
			</section>
		</main>
	)
}
