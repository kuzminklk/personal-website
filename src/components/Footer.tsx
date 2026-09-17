import { getTranslations } from "next-intl/server"

import styles from "./Footer.module.css"

export async function Footer() {
	const translations = await getTranslations("Footer")

	return (
		<footer className={styles.primary}>
			<h3>
				<em>{translations("madeBy")}</em>
			</h3>
			<h3>
				<a
					target="_blank"
					rel="noopener noreferrer"
					href="https://github.com/kuzminklk/personal-website"
				>
					{translations("source")}
				</a>
			</h3>
			<h3>
				{translations.has("contactFull") ? (
					<a target="_blank" rel="noopener noreferrer" href="https://t.me/kuzminklk">
						{translations("contactFull")}
					</a>
				) : (
					<>
						{translations("contactStripped")}
						<a target="_blank" rel="noopener noreferrer" href="https://t.me/kuzminklk">
							Telegram
						</a>
					</>
				)}
			</h3>
		</footer>
	)
}
