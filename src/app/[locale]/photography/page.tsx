import Image from "next/image"
import { getTranslations } from "next-intl/server"

import styles from "./page.module.css"
import { photos } from "@/data/photos"

export default async function Home() {
	const translations = await getTranslations("photography")

	return (
		<main className={styles.photography}>
			<section className={styles.introduction}>
				<h2>🎨 {translations("introduction.header")}</h2>
				<p>
					{translations.rich("introduction.objects", {
						emphasize: (chunks) => <em>{chunks}</em>,
					})}
				</p>
				<p>
					{translations.rich("introduction.share", {
						emphasize: (chunks) => <em>{chunks}</em>,
						unsplashLink: (chunks) => (
							<a href="https://unsplash.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
						telegramChannelLink: (chunks) => (
							<a href="https://t.me/kuzminklkk" target="_blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
			</section>
			<h1>
				<span className={styles.emoji}>🖼️</span> {translations("gallery.header")}
			</h1>
			<section className={styles.gallery}>
				{photos.map((photo) => {
					return (
						<Image
							key={photo.source.src}
							src={photo.source}
							alt={translations(`gallery.photos.${photo.id}.image-alternative`)}
							className={photo.orientation === "portrait" ? styles.portrait : styles.landscape}
							placeholder="blur" /* sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" */
						/>
					)
				})}
				<p>
					<em>
						{translations.rich("ending", {
							unsplashLink: (chunks) => (
								<a href="https://unsplash.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
									{chunks}
								</a>
							),
							telegramChannelLink: (chunks) => (
								<a href="https://t.me/kuzminklkk" target="_blank" rel="noopener noreferrer">
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
