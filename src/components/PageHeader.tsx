import type { ReactNode } from "react"

import { PixelIcon } from "@/components/PixelIcon"
import type { PixelIconName } from "@/data/pixel-icons"
import { PixelStar } from "@/components/Glyphs"
import styles from "./PageHeader.module.css"

export type PageHeaderProps = {
	/** Section index shown in the HUD line, e.g. "02". */
	index: string
	/** Small uppercase label, e.g. "DEVELOPMENT / WEB & BLOCKCHAIN". */
	kicker: string
	title: ReactNode
	/** Lead paragraph(s); can contain links and pixel emoji. */
	lede?: ReactNode
	icon: PixelIconName
	/** Short metadata chips shown on the right, e.g. ["WEB3", "AI"]. */
	meta?: string[]
	/** Extra prose rendered under the lede. */
	children?: ReactNode
}

/**
 * Shared page intro: HUD line, oversized display title, lede and metadata.
 * Every section page starts with it, which is what gives the site its
 * "archive index" rhythm.
 */
export function PageHeader({ index, kicker, title, lede, icon, meta, children }: PageHeaderProps) {
	return (
		<header className={styles.header}>
			<div className={styles.hud}>
				<span className={styles.index}>
					<PixelStar size={12} />
					{index}
				</span>
				<span className={styles.kicker}>{kicker}</span>
				<span className={styles.hudRule} aria-hidden="true" />
				<PixelIcon name={icon} size={18} className={styles.icon} />
			</div>

			<h1 className={styles.title}>{title}</h1>

			{lede || meta ? (
				<div className={styles.lower}>
					{lede ? <div className={styles.lede}>{lede}</div> : null}
					{meta && meta.length > 0 ? (
						<ul className={styles.meta}>
							{meta.map((item) => (
								<li key={item} className="tag">
									{item}
								</li>
							))}
						</ul>
					) : null}
				</div>
			) : null}

			{children ? <div className={styles.extra}>{children}</div> : null}
		</header>
	)
}
