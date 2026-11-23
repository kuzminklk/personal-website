import type { ReactNode } from "react"
import Image, { type StaticImageData } from "next/image"

import { PixelArrowUpRight } from "@/components/Glyphs"
import styles from "./ProjectCard.module.css"

export type Project = {
	id: string
	title: ReactNode
	description: ReactNode
	github: string
	deployment: string
	desktopImage: StaticImageData
	mobileImage: StaticImageData
	/** Pixelated copy of the desktop screenshot, revealed on hover. */
	pixelImage?: StaticImageData
	imageAlternative: string
	visitSiteLabel: string
	sourceCodeLabel: string
}

/**
 * Project entry in the "web interfaces" archive.
 *
 * The screenshot starts as a chunky pixel-art thumbnail and resolves into the
 * real screenshot on hover/focus — a small nod to the pixel aesthetic that
 * also keeps the grid calm. Touch devices get the real screenshot directly.
 */
export function ProjectCard({ project }: { project: Project }) {
	return (
		<article className={styles.card}>
			<a
				className={styles.media}
				href={project.deployment}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`${project.visitSiteLabel}: ${project.title}`}
			>
				{project.pixelImage ? (
					<Image className={styles.pixelImage} src={project.pixelImage} alt="" aria-hidden="true" />
				) : null}
				{/* One of the two screenshots is hidden via media queries. */}
				<Image className={styles.desktop} src={project.desktopImage} alt={project.imageAlternative} />
				<Image className={styles.mobile} src={project.mobileImage} alt={project.imageAlternative} />
				<span className={styles.mediaLabel}>
					{project.visitSiteLabel}
					<PixelArrowUpRight size={11} />
				</span>
			</a>

			<div className={styles.body}>
				<h3 className={styles.title}>
					<a href={project.github} target="_blank" rel="noopener noreferrer">
						{project.title}
					</a>
				</h3>
				<p className={styles.description}>{project.description}</p>
				<div className={styles.links}>
					<a href={project.deployment} target="_blank" rel="noopener noreferrer">
						{project.visitSiteLabel}
						<PixelArrowUpRight size={10} />
					</a>
					<a href={project.github} target="_blank" rel="noopener noreferrer">
						{project.sourceCodeLabel}
						<PixelArrowUpRight size={10} />
					</a>
				</div>
			</div>
		</article>
	)
}
