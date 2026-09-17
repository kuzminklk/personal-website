import { getTranslations } from "next-intl/server"

import styles from "./page.module.css"

const videos = ["stone", "boxing", "push-ups", "pull-ups", "power-lift"]

export default async function Sports() {
	const translations = await getTranslations("sports")

	return (
		<main className={styles.sports}>
			<section className={styles.introduction}>
				<h2>💪🏻 {translations("introduction.header")}</h2>
				<p>{translations("introduction.workout")}</p>
				<p>{translations("introduction.hardering")}</p>
				<p>{translations("introduction.games")}</p>
				<p>
					{translations.rich("introduction.share", {
						emoji: (chunks) => <span className="emoji">{chunks}</span>,
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
							<a
								href="https://www.youtube.com/@kuzminklk"
								target="_blank"
								rel="noopener noreferrer"
							>
								{chunks}
							</a>
						),
						youtubeLink: (chunks) => (
							<a
								href="https://www.youtube.com/@kuzminklk"
								target="_blank"
								rel="noopener noreferrer"
							>
								{chunks}
							</a>
						),
					})}
				</p>
			</section>
			<h1>
				<span className={styles.emoji}>🎯</span> {translations("activities.header")}
			</h1>
			<section className={styles.activities}>
				{videos.map((video) => (
					<video
						key={video}
						src={`/videos/${video}.mp4`}
						poster={`/videos/${video}-blurred.webp`}
						autoPlay
						loop
						muted
					></video>
				))}
				<p>
					<em>
						{translations.rich("ending", {
							tiktokLink: (chunks) => (
								<a
									href="https://www.tiktok.com/@kuzminklk"
									target="_blank"
									rel="noopener noreferrer"
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
