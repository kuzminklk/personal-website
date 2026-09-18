import { getTranslations } from "next-intl/server"

import styles from "./page.module.css"

export default async function Home() {
	const translations = await getTranslations("connect")

	return (
		<main className={styles.connect}>
			<h2>📫 {translations("messaging.header")}</h2>
			<section>
				<p>
					{translations.rich("messaging.telegram", {
						telegramLink: (chunks) => (
							<a href="https://t.me/kuzminklk" target="_blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
				<p>
					{translations.rich("messaging.email", {
						emailLink: (chunks) => (
							<a href="mailto:kuzminkdk@gmail.com" target="_blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
			</section>
			<h2>🧜🏻‍♂️ {translations("social-media.header")}</h2>
			<section>
				<p>
					{translations.rich("social-media.tiktok-and-instagram-and-youtube", {
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
				<p>
					{translations.rich("social-media.telegram-channel", {
						telegramChannelLink: (chunks) => (
							<a target="_blank" href="https://t.me/kuzminklkk" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
				<p>
					{translations.rich("social-media.linkedin", {
						linkedinLink: (chunks) => (
							<a
								href="https://www.linkedin.com/in/kuzminklk/"
								target="_blank"
								rel="noopener noreferrer"
							>
								{chunks}
							</a>
						),
					})}
				</p>
				<p>
					{translations.rich("social-media.dev-and-farcaster", {
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
			</section>
			<h2>🏺 {translations("creations.header")}</h2>
			<section>
				<p>
					{translations.rich("creations.github", {
						githubLink: (chunks) => (
							<a href="https://github.com/kuzminklk" target="blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
				<p>
					{translations.rich("creations.unsplash-and-pixabay", {
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
			</section>
		</main>
	)
}
