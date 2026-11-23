import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Emoji } from "@/components/Emoji"
import { PageHeader } from "@/components/PageHeader"
import { SectionHeader } from "@/components/SectionHeader"
import { WorkoutVideo } from "@/components/WorkoutVideo"
import { buildPageMetadata } from "@/data/metadata"
import type { Locale } from "@/i18n/routing"

import styles from "./page.module.css"

const videos = ["stone", "boxing", "push-ups", "pull-ups", "power-lift"] as const

type PageProps = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params
	return buildPageMetadata({ locale: locale as Locale, pathname: "/sports", pageKey: "sports" })
}

export default async function Sports() {
	const translations = await getTranslations("sports")
	const header = await getTranslations("Header")

	return (
		<main id="main" className={styles.sports}>
			<PageHeader
				index="04"
				kicker="SECTION / PHYSICAL PRACTICE"
				title={header("sports")}
				icon="muscle"
				lede={translations.rich("introduction.workout", {
					emoji: (chunks) => <Emoji>{chunks}</Emoji>,
				})}
				meta={["BODYWEIGHT", "WRESTLING", "COLD"]}
			>
				<div className={styles.intro}>
					<p>
						{translations.rich("introduction.hardening", {
							emoji: (chunks) => <Emoji>{chunks}</Emoji>,
						})}
					</p>
					<p>
						{translations.rich("introduction.games", {
							emoji: (chunks) => <Emoji>{chunks}</Emoji>,
						})}
					</p>
					<p>
						{translations.rich("introduction.share", {
							emoji: (chunks) => <Emoji>{chunks}</Emoji>,
							tiktokLink: (chunks) => (
								<a href="https://www.tiktok.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
									{chunks}
								</a>
							),
							telegramLink: (chunks) => (
								<a href="https://t.me/kuzminklk" target="_blank" rel="noopener noreferrer">
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
				</div>
			</PageHeader>

			<section className={styles.section} aria-labelledby="activities">
				<SectionHeader
					number="01"
					title={translations("activities.header")}
					icon="target"
					aside={`${videos.length} clips`}
				/>
				<div className={styles.videos}>
					{videos.map((video, index) => (
						<WorkoutVideo
							key={video}
							src={`/videos/${video}.mp4`}
							poster={`/videos/${video}-blurred.webp`}
							label={translations(`activities.videos.${video}`)}
							playLabel={translations("activities.play")}
							pauseLabel={translations("activities.pause")}
							index={String(index + 1).padStart(2, "0")}
						/>
					))}
				</div>
			</section>

			<p className={styles.ending}>
				<em>
					{translations.rich("ending", {
						tiktokLink: (chunks) => (
							<a href="https://www.tiktok.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</em>
			</p>
		</main>
	)
}
