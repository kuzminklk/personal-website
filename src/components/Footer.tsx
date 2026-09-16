

import Link from "next/link"
import { getTranslations } from "next-intl/server"

import styles from "./Footer.module.css"


export async function Footer() {
	const translations = await getTranslations("Footer")

	return (
		<footer className={ styles.primary }>
			<h3><em>{ translations("madeBy") }</em></h3>
			<h3>
				<Link target="_blank" rel="noopener noreferrer" href="https://github.com/kuzminklk/personal-website">
					{ translations("source") }
				</Link>
			</h3>
			<h3>
				{ translations.has("contactFull") ? (
					<Link target="_blank" rel="noopener noreferrer" href="https://t.me/kuzminklk">
						{ translations("contactFull") }
					</Link>
				) : (
					<>
						{ translations("contactStripped") }
						<Link target="_blank" rel="noopener noreferrer" href="https://t.me/kuzminklk">
							Telegram
						</Link>
					</>
				)}
			</h3>
		</footer>
	)
}