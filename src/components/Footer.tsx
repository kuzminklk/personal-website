import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/navigation"
import { pageEntries } from "@/i18n/routing"
import { PixelIcon } from "@/components/PixelIcon"
import { PixelStar, PixelArrowUpRight, PixelArrowDown } from "@/components/Glyphs"
import styles from "./Footer.module.css"

/**
 * Site footer: an inverted "colophon" panel with the sections index, off-site
 * links, a giant pixel wordmark and the archive metadata line.
 */
export async function Footer() {
	const translations = await getTranslations("Footer")
	const header = await getTranslations("Header")
	const year = new Date().getFullYear()

	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<div className={styles.top}>
					<div className={styles.about}>
						<PixelStar size={26} className={styles.star} />
						<p className={styles.note}>{translations("note")}</p>
						<p className={styles.signature}>{translations("madeBy")}</p>
					</div>

					<nav className={styles.column} aria-label={translations("sections")}>
						<h2 className={styles.columnTitle}>{translations("sections")}</h2>
						<ul className={styles.links}>
							{pageEntries.map((entry) => (
								<li key={entry.pathname}>
									<Link href={entry.pathname} className={styles.link}>
										<PixelIcon name={entry.icon} size={14} className={styles.linkIcon} />
										{header(entry.key)}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<nav className={styles.column} aria-label={translations("elsewhere")}>
						<h2 className={styles.columnTitle}>{translations("elsewhere")}</h2>
						<ul className={styles.links}>
							<li>
								<a
									className={styles.link}
									href="https://github.com/kuzminklk"
									target="_blank"
									rel="noopener noreferrer"
								>
									{translations("source")}
									<PixelArrowUpRight size={11} className={styles.external} />
								</a>
							</li>
							<li>
								<a className={styles.link} href="https://t.me/kuzminklk" target="_blank" rel="noopener noreferrer">
									{translations("contact")}
									<PixelArrowUpRight size={11} className={styles.external} />
								</a>
							</li>
							<li>
								<a
									className={styles.link}
									href="https://unsplash.com/@kuzminklk"
									target="_blank"
									rel="noopener noreferrer"
								>
									Unsplash
									<PixelArrowUpRight size={11} className={styles.external} />
								</a>
							</li>
							<li>
								<a className={styles.link} href="https://t.me/kuzminklkk" target="_blank" rel="noopener noreferrer">
									Telegram channel
									<PixelArrowUpRight size={11} className={styles.external} />
								</a>
							</li>
						</ul>
					</nav>
				</div>

				{/* Oversized pixel wordmark — the footer's poster moment. */}
				<p className={styles.wordmark} aria-hidden="true">
					kuzminklk
				</p>

				<div className={styles.bottom}>
					<span className="micro">© {year} Daniel Cosmo</span>
					<span className="micro">MINSK · UTC+3</span>
					<a className={styles.topLink} href="#top">
						<PixelArrowDown size={12} className={styles.topIcon} />
						{translations("backToTop")}
					</a>
				</div>
			</div>
		</footer>
	)
}
