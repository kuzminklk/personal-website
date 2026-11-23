import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Emoji } from "@/components/Emoji"
import { PageHeader } from "@/components/PageHeader"
import { SectionHeader } from "@/components/SectionHeader"
import { NotionEmbed } from "@/components/NotionEmbed"
import { buildPageMetadata } from "@/data/metadata"
import type { Locale } from "@/i18n/routing"

import styles from "./page.module.css"

const databaseURL = "https://kuzminklk.notion.site/31154d4de0358084adcdf9aca595fa2f?v=31154d4de035802ca521000ca4f6f8f9"
const embedURL =
	"https://kuzminklk.notion.site/ebd//31154d4de0358084adcdf9aca595fa2f?v=31154d4de035802ca521000ca4f6f8f9"

type PageProps = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params
	return buildPageMetadata({ locale: locale as Locale, pathname: "/books", pageKey: "books" })
}

export default async function Books() {
	const translations = await getTranslations("books")
	const header = await getTranslations("Header")
	const common = await getTranslations("common")

	return (
		<main id="main" className={styles.books}>
			<PageHeader
				index="05"
				kicker="SECTION / READING LOG"
				title={header("books")}
				icon="books"
				lede={translations("introduction.books")}
				meta={["BOOKS", "SUMMARIES", "NOTION"]}
			>
				<div className={styles.intro}>
					<p>
						{translations.rich("introduction.database", {
							emoji: (chunks) => <Emoji>{chunks}</Emoji>,
							notionBooksDatabaseLink: (chunks) => (
								<a href={databaseURL} target="_blank" rel="noopener noreferrer">
									{chunks}
								</a>
							),
						})}
					</p>
					<p>
						<em>{translations("introduction.below")}</em>
					</p>
				</div>
			</PageHeader>

			<section className={styles.section} aria-labelledby="books-database">
				<SectionHeader number="01" title={translations("books.header")} icon="book" aside="NOTION / PUBLIC" />
				<NotionEmbed
					src={embedURL}
					title={translations("embed-title")}
					openUrl={databaseURL}
					openLabel={common("open-in-notion")}
				/>
			</section>
		</main>
	)
}
