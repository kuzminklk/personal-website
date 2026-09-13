

import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/naviagation"
import styles from "./page.module.css"


export default async function Sports() {
	const translations = await getTranslations("sports")

	return (
		<main className={styles.sports}>
			<section className={styles.introduction}>
				<h2>💪🏻 {translations("introduction.header")}</h2>
				<p>
					{translations("introduction.workout")}
				</p>
				<p>
					{translations("introduction.hardering")}
				</p>
				<p>
					{translations("introduction.games")}
				</p>
				<p>
					{translations.rich("introduction.share", { 
            emoji: (chunks) => <span className="emoji">{chunks}</span>, 
            tiktokLink: (chunks) => <Link href="https://www.tiktok.com/@kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>, 
            telegramLink: (chunks) => <Link href="https://t.me/kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>, 
            instagramLink: (chunks) => <Link href="https://www.youtube.com/@kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>,
						youtubeLink: (chunks) => <Link href="https://www.youtube.com/@kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>  
          })}
				</p>
			</section>
			<h1><span className={styles.emoji}>🎯</span> {translations("activities.header")}</h1>
			<section className={styles.activities}>
				<video src="/videos/stone.mp4" autoPlay loop muted></video>
				<video src="/videos/boxing.mp4" autoPlay loop muted></video>
				<video src="/videos/push-ups.mp4" autoPlay loop muted></video>
				<video src="/videos/pull-ups.mp4" autoPlay loop muted></video>
				<video src="/videos/power-lift.mp4" autoPlay loop muted></video>
				<p>
					<em>
					{translations.rich("ending", {
            tiktokLink: (chunks) => <Link href="https://www.tiktok.com/@kuzminklk" target="_blank" rel="noopener noreferrer">{chunks}</Link>
          })}
					</em>
				</p>
			</section>
		</main>
	)
}