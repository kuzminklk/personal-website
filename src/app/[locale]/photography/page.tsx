import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Emoji } from "@/components/Emoji"
import { PageHeader } from "@/components/PageHeader"
import { SectionHeader } from "@/components/SectionHeader"
import { PhotoGallery, type GalleryPhoto } from "@/components/PhotoGallery"
import { photos } from "@/data/photos"
import { buildPageMetadata } from "@/data/metadata"
import type { Locale } from "@/i18n/routing"

import styles from "./page.module.css"

type PageProps = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params
	return buildPageMetadata({ locale: locale as Locale, pathname: "/photography", pageKey: "photography" })
}

export default async function Photography() {
	const translations = await getTranslations("photography")
	const header = await getTranslations("Header")

	const galleryPhotos: GalleryPhoto[] = photos.map((photo) => ({
		id: photo.id,
		source: photo.source,
		orientation: photo.orientation,
		alt: translations(`gallery.photos.${photo.id}.image-alternative`),
	}))

	return (
		<main id="main" className={styles.photography}>
			<PageHeader
				index="03"
				kicker="SECTION / VISUAL DIARY"
				title={header("photography")}
				icon="camera"
				lede={translations.rich("introduction.objects", {
					emphasize: (chunks) => <em>{chunks}</em>,
					emoji: (chunks) => <Emoji>{chunks}</Emoji>,
				})}
				meta={["NATURE", "PEOPLE", "UNSPLASH"]}
			>
				<p className={styles.share}>
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
			</PageHeader>

			<section className={styles.section} aria-labelledby="gallery">
				<SectionHeader
					number="01"
					title={translations("gallery.header")}
					icon="frame"
					aside={`${photos.length} frames`}
				/>
				<PhotoGallery photos={galleryPhotos} />
			</section>

			<p className={styles.ending}>
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
		</main>
	)
}
