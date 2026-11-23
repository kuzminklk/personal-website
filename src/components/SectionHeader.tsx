import type { ReactNode } from "react"

import { PixelIcon } from "@/components/PixelIcon"
import type { PixelIconName } from "@/data/pixel-icons"
import styles from "./SectionHeader.module.css"

export type SectionHeaderProps = {
	/** Two-digit section number, e.g. "01". */
	number: string
	title: ReactNode
	icon: PixelIconName
	/** Optional aside on the right, e.g. a count or a link. */
	aside?: ReactNode
}

/**
 * Section heading: pixel index + icon + display title over a hairline rule.
 * Used instead of bare `<h2>` so every page keeps the same archival rhythm.
 */
export function SectionHeader({ number, title, icon, aside }: SectionHeaderProps) {
	return (
		<div className={styles.head}>
			<div className={styles.titleRow}>
				<span className={styles.number} aria-hidden="true">
					{number}
				</span>
				<PixelIcon name={icon} size={20} className={styles.icon} />
				<h2 className={styles.title}>{title}</h2>
			</div>
			{aside ? <div className={styles.aside}>{aside}</div> : null}
		</div>
	)
}
