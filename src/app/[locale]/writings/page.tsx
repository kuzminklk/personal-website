import { getTranslations } from "next-intl/server"

import styles from "./page.module.css"

export default async function Books() {
	const translations = await getTranslations("writings")

	return (
		<main className={styles.writings}>
			<section className={styles.introduction}>
				<h2>✒️ {translations("introduction.header")}</h2>
				<p>{translations("introduction.topics")}</p>
				<p>
					{translations.rich("introduction.share", {
						emoji: (chunks) => <span className="emoji">{chunks}</span>,
						notionBooksDatabaseLink: (chunks) => (
							<a href="https://kuzminklk.notion.site/31e54d4de03580fda758ff9cd469a547?v=31e54d4de035806b95ac000c27c46c11&source=copy_link">
								{chunks}
							</a>
						),
					})}
				</p>
				<p>
					<em>{translations("introduction.below")}</em>
				</p>
			</section>
			<h1>
				<span className={styles.emoji}>✍🏻</span> {translations("essays.header")}
			</h1>
			<section className={styles.database}>
				<iframe
					src="https://kuzminklk.notion.site/ebd//31e54d4de03580fda758ff9cd469a547?v=31e54d4de035806b95ac000c27c46c11"
					width="100%"
					height="600"
					frameBorder="0"
					allowFullScreen
				/>
			</section>
		</main>
	)
}
