import Image from "next/image"
import { getTranslations } from "next-intl/server"

import type { Metadata } from "next"

import { Emoji } from "@/components/Emoji"
import { PixelIcon } from "@/components/PixelIcon"
import { PixelArrowDown } from "@/components/Glyphs"
import { CornerTicks, PixelDivider, StarChart } from "@/components/Ornaments"
import { Link, getPathname } from "@/i18n/navigation"
import { buildPageMetadata } from "@/data/metadata"
import { profilePageSchema } from "@/data/structured-data"
import { absoluteUrl, websiteURL } from "@/data/search-engine-optimization"
import type { Locale } from "@/i18n/routing"

import styles from "./page.module.css"
import Me from "@/public/me.jpg"
import MePixelLight from "@/public/me-pixel-light.png"
import MePixelDark from "@/public/me-pixel-dark.png"

type PageProps = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params
	return buildPageMetadata({ locale: locale as Locale, pathname: "/about", pageKey: "about" })
}

/** Portrait block: pixel-art by default, the real photograph on hover. */
function Portrait({ alt }: { alt: string }) {
	return (
		<figure className={styles.portrait}>
			<CornerTicks />
			<div className={styles.portraitMedia}>
				<Image className={styles.portraitPixelLight} src={MePixelLight} alt={alt} priority placeholder="blur" />
				<Image className={styles.portraitPixelDark} src={MePixelDark} alt="" aria-hidden="true" placeholder="blur" />
				<Image className={styles.portraitPhoto} src={Me} alt="" aria-hidden="true" placeholder="blur" />
			</div>
			<figcaption className={styles.portraitCaption}>
				<span className="micro">PORTRAIT / 001</span>
				<span className="micro">MINSK · 2026</span>
			</figcaption>
		</figure>
	)
}

export default async function About({ params }: PageProps) {
	const { locale } = await params
	const translations = await getTranslations("about")
	const metadata = await getTranslations("metadata")

	const pageURL = absoluteUrl(getPathname({ href: "/about", locale: locale as Locale }))
	const profileSchema = profilePageSchema(websiteURL, locale, pageURL, metadata("pages.about.description"))

	return (
		<main id="main" className={styles.about}>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }} />

			{/* ——— Hero ——— */}
			<section className={styles.hero}>
				<div className={styles.heroText}>
					<p className={styles.kicker}>
						<PixelIcon name="compass" size={14} />
						{translations("hero.kicker")}
					</p>

					<h1 className={styles.title} aria-label={`${translations("greet.hi")} ${translations("greet.introduction")}`}>
						<span className={styles.titleHi}>{translations("greet.hi")}</span>
						<span className={styles.titleName}>{translations("greet.introduction")}</span>
					</h1>

					<p className={styles.role}>
						{translations.rich("facts.role", {
							strong: (chunks) => <strong>{chunks}</strong>,
						})}
					</p>

					<ul className={styles.tags} aria-label={translations("hero.tagsLabel")}>
						{["WEB3", "FRONT-END", "AI", "BLOCKCHAIN"].map((tag) => (
							<li key={tag} className="tag">
								{tag}
							</li>
						))}
					</ul>

					<a className={styles.scrollCue} href="#dossier">
						<PixelArrowDown size={14} />
						<span className="micro">Scroll / dossier</span>
					</a>
				</div>

				<div className={styles.heroVisual}>
					<StarChart className={styles.chart} />
					<Portrait alt={translations("greet.photo")} />
				</div>
			</section>

			{/* ——— Dossier ——— */}
			<section id="dossier" className={styles.dossier} aria-labelledby="dossier-title">
				<div className={styles.dossierHead}>
					<h2 id="dossier-title" className={styles.dossierTitle}>
						<span className={styles.dossierNumber} aria-hidden="true">
							01
						</span>
						{translations("dossier")}
					</h2>
					<span className="micro">PERSONAL DATA / VERIFIED</span>
				</div>

				<dl className={styles.facts}>
					<div className={styles.fact}>
						<dt className="micro">{translations("facts.labels.aliases")}</dt>
						<dd>
							{translations.rich("facts.aliases", {
								emphasize: (chunks) => <em>{chunks}</em>,
							})}
						</dd>
					</div>
					<div className={styles.fact}>
						<dt className="micro">{translations("facts.labels.languages")}</dt>
						<dd>{translations("facts.languages")}</dd>
					</div>
					<div className={styles.fact}>
						<dt className="micro">{translations("facts.labels.activities")}</dt>
						<dd>
							{translations.rich("facts.activities", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								sportsLink: (chunks) => <Link href="/sports">{chunks}</Link>,
								photographyLink: (chunks) => <Link href="/photography">{chunks}</Link>,
								booksLink: (chunks) => <Link href="/books">{chunks}</Link>,
							})}
						</dd>
					</div>
				</dl>
			</section>

			{/* ——— Explore ——— */}
			<section className={styles.explore}>
				<PixelDivider />
				<p>
					<em>
						{translations.rich("explore", {
							emoji: (chunks) => <Emoji>{chunks}</Emoji>,
							scroll: (chunks) => <a href="#top">{chunks}</a>,
						})}
					</em>
				</p>
			</section>
		</main>
	)
}
