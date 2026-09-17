import type { ReactNode } from "react"
import Image, { type StaticImageData } from "next/image"

import styles from "./ProjectCard.module.css"

export type Project = {
	title: string | ReactNode | undefined
	description: string | ReactNode | undefined
	github: string
	deployment: string
	desktopImage: StaticImageData
	mobileImage: StaticImageData
	imageAlternative: string
}

export function ProjectCard({ project }: { project: Project }) {
	return (
		<section className={styles.projectCard}>
			<a href={project.github} target="_blank" rel="noopener noreferrer">
				<h3>{project.title}</h3>
			</a>

			<p>{project.description}</p>

			<a href={project.deployment} target="_blank" rel="noopener noreferrer">
				{/* One of the images will be not displayed via CSS rule based on media query */}
				<Image
					className={styles.desktop}
					src={project.desktopImage}
					placeholder="blur"
					alt={project.imageAlternative}
				/>
				<Image
					className={styles.mobile}
					src={project.mobileImage}
					placeholder="blur"
					alt={project.imageAlternative}
				/>
			</a>
		</section>
	)
}
