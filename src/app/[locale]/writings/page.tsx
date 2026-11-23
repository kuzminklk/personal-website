import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Emoji } from "@/components/Emoji"
import { PageHeader } from "@/components/PageHeader"
import { SectionHeader } from "@/components/SectionHeader"
import { NotionEmbed } from "@/components/NotionEmbed"
import { buildPageMetadata } from "@/data/metadata"
import type { Locale } from "@/i18n/routing"

import styles from "./page.module.css"

const databaseURL = "https://kuzminklk.notion.site/31e54d4de03580fda758ff9cd469a547?v=31e54d4de035806b95ac000c27c46c11"
const embedURL =
	"https://kuzminklk.notion.site/ebd//31e54d4de03580fda758ff9cd469a547?v=31e54d4de035806b95ac000c27c46c11"

type PageProps = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params
	return buildPageMetadata({ locale: locale as Locale, pathname: "/writings", pageKey: "writings" })
}

export default async function Writings() {
	const translations = await getTranslations("writings")
	const header = await getTranslations("Header")
	const common = await getTranslations("common")

	return (
		<main id="main" className={styles.writings}>
			<PageHeader
				index="06"
				kicker="SECTION / ESSAYS & NOTES"
				title={header("writings")}
				icon="quill"
				lede={translations.rich("introduction.topics", {
					emoji: (chunks) => <Emoji>{chunks}</Emoji>,
				})}
				meta={["PHYSICS", "BIOLOGY", "PHILOSOPHY"]}
			>
				<div className={styles.intro}>
					<p>
						{translations.rich("introduction.share", {
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

			<section className={styles.section} aria-labelledby="essays-database">
				<SectionHeader number="01" title={translations("essays.header")} icon="writing-hand" aside="NOTION / PUBLIC" />
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
