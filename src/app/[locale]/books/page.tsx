import { getTranslations } from "next-intl/server"

import { Link } from "@/i18n/naviagation"
import styles from "./page.module.css"

export default async function Books() {
	const translations = await getTranslations("books")

	return (
		<main className={styles.books}>
			<section className={styles.introduction}>
				<h2>📖 {translations("introduction.header")}</h2>
				<p>{translations("introduction.books")}</p>
				<p>
					{translations.rich("introduction.database", {
						notionBooksDatabaseLink: (chunks) => (
							<Link href="https://kuzminklk.notion.site/31154d4de0358084adcdf9aca595fa2f?v=31154d4de035802ca521000ca4f6f8f9">
								{chunks}
							</Link>
						),
					})}
				</p>
				<p>
					<em>{translations("introduction.below")}</em>
				</p>
			</section>
			<h1>
				<span className={styles.emoji}>📕</span> {translations("books.header")}
			</h1>
			<section className={styles.database}>
				<iframe
					src="https://kuzminklk.notion.site/ebd//31154d4de0358084adcdf9aca595fa2f?v=31154d4de035802ca521000ca4f6f8f9"
					width="100%"
					height="600"
					frameBorder="0"
					allowFullScreen
				/>
			</section>
		</main>
	)
}
