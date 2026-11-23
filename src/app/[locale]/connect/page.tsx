import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Emoji } from "@/components/Emoji"
import { PixelIcon } from "@/components/PixelIcon"
import { PageHeader } from "@/components/PageHeader"
import { SectionHeader } from "@/components/SectionHeader"
import { buildPageMetadata } from "@/data/metadata"
import type { Locale } from "@/i18n/routing"

import styles from "./page.module.css"

type PageProps = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params
	return buildPageMetadata({ locale: locale as Locale, pathname: "/connect", pageKey: "connect" })
}

export default async function Connect() {
	const translations = await getTranslations("connect")
	const header = await getTranslations("Header")
	const metadata = await getTranslations("metadata")

	return (
		<main id="main" className={styles.connect}>
			<PageHeader
				index="07"
				kicker="SECTION / OPEN CHANNELS"
				title={header("connect")}
				icon="mailbox"
				lede={metadata("pages.connect.description")}
				meta={["TELEGRAM", "EMAIL", "SOCIAL"]}
			/>

			<section className={styles.section} aria-labelledby="messaging">
				<SectionHeader number="01" title={translations("messaging.header")} icon="mailbox" />
				<ul className={styles.links}>
					<li>
						<PixelIcon name="smile-heart" size={22} className={styles.icon} />
						<p>
							{translations.rich("messaging.telegram", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								telegramLink: (chunks) => (
									<a href="https://t.me/kuzminklk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
							})}
						</p>
					</li>
					<li>
						<PixelIcon name="memo" size={22} className={styles.icon} />
						<p>
							{translations.rich("messaging.email", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								emailLink: (chunks) => (
									<a href="mailto:kuzminkdk@gmail.com" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
							})}
						</p>
					</li>
				</ul>
			</section>

			<section className={styles.section} aria-labelledby="social-media">
				<SectionHeader number="02" title={translations("social-media.header")} icon="merperson" />
				<ul className={styles.links}>
					<li>
						<PixelIcon name="camera" size={22} className={styles.icon} />
						<p>
							{translations.rich("social-media.telegram-channel", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								telegramChannelLink: (chunks) => (
									<a href="https://t.me/kuzminklkk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
							})}
						</p>
					</li>
					<li>
						<PixelIcon name="runner" size={22} className={styles.icon} />
						<p>
							{translations.rich("social-media.tiktok-and-instagram-and-youtube", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								tiktokLink: (chunks) => (
									<a href="https://www.tiktok.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
								instagramLink: (chunks) => (
									<a href="https://instagram.com/kuzminklk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
								youtubeLink: (chunks) => (
									<a href="https://www.youtube.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
							})}
						</p>
					</li>
					<li>
						<PixelIcon name="tools" size={22} className={styles.icon} />
						<p>
							{translations.rich("social-media.linkedin", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								linkedinLink: (chunks) => (
									<a href="https://www.linkedin.com/in/kuzminklk/" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
							})}
						</p>
					</li>
					<li>
						<PixelIcon name="toolbox" size={22} className={styles.icon} />
						<p>
							{translations.rich("social-media.dev-and-farcaster", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								devLink: (chunks) => (
									<a href="https://dev.to/kuzminklk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
								farcasterLink: (chunks) => (
									<a href="https://farcaster.xyz/kuzminklk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
							})}
						</p>
					</li>
				</ul>
			</section>

			<section className={styles.section} aria-labelledby="creations">
				<SectionHeader number="03" title={translations("creations.header")} icon="amphora" />
				<ul className={styles.links}>
					<li>
						<PixelIcon name="developer" size={22} className={styles.icon} />
						<p>
							{translations.rich("creations.github", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								githubLink: (chunks) => (
									<a href="https://github.com/kuzminklk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
							})}
						</p>
					</li>
					<li>
						<PixelIcon name="palette" size={22} className={styles.icon} />
						<p>
							{translations.rich("creations.unsplash-and-pixabay", {
								emoji: (chunks) => <Emoji>{chunks}</Emoji>,
								unsplashLink: (chunks) => (
									<a href="https://unsplash.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
								pixabayLink: (chunks) => (
									<a href="https://pixabay.com/" target="_blank" rel="noopener noreferrer">
										{chunks}
									</a>
								),
							})}
						</p>
					</li>
				</ul>
			</section>
		</main>
	)
}
