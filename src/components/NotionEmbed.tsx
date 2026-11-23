import { PixelArrowUpRight } from "@/components/Glyphs"
import styles from "./NotionEmbed.module.css"

export type NotionEmbedProps = {
	src: string
	title: string
	openUrl: string
	openLabel: string
	/** Small label shown on the frame's top bar. */
	hudLabel?: string
}

/**
 * A Notion database embedded as a framed, labelled plate.
 *
 * Notion's embed needs scripts and storage access, so the iframe is not
 * sandboxed. The frame always offers a direct link to open the database in
 * Notion, which is the fallback if the iframe is blocked (trackers, offline,
 * slow connections).
 */
export function NotionEmbed({ src, title, openUrl, openLabel, hudLabel = "NOTION / PUBLIC" }: NotionEmbedProps) {
	return (
		<div className={styles.embed}>
			<div className={styles.bar}>
				<span className="micro">{hudLabel}</span>
				<a className={styles.open} href={openUrl} target="_blank" rel="noopener noreferrer">
					{openLabel}
					<PixelArrowUpRight size={11} />
				</a>
			</div>
			<iframe className={styles.frame} src={src} title={title} loading="lazy" allowFullScreen />
		</div>
	)
}
