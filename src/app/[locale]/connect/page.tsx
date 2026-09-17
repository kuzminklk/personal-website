import { getTranslations } from "next-intl/server"

import styles from "./page.module.css"

export default async function Home() {
	const translations = await getTranslations("connect")

	return (
		<main className={styles.connect}>
			<section>
				<p>
					{translations.rich("telegram-and-telegram-channel", {
						telegramLink: (chunks) => (
							<a href="https://t.me/kuzminklk" target="_blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
						telegramChannelLink: (chunks) => (
							<a target="_blank" href="https://t.me/kuzminklkk" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
				<p>
					{translations.rich("tiktok-and-instagram", {
						tiktokLink: (chunks) => (
							<a href="https://www.tiktok.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
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
					})}
				</p>
				<p>
					{translations.rich("github", {
						githubLink: (chunks) => (
							<a href="https://github.com/kuzminklk" target="blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
				<p>
					{translations.rich("unsplash", {
						unsplashLink: (chunks) => (
							<a href="https://unsplash.com/@kuzminklk" target="_blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
				<p>
					{translations.rich("linkedin", {
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
					{translations.rich("devto-and-farcaster", {
						devtoLink: (chunks) => (
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
		</main>
	)
}
