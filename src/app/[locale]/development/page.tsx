import { getTranslations, getMessages } from "next-intl/server"

import type { Project } from "@/components/ProjectCard"
import styles from "./page.module.css"
import { projects } from "@/data/projects"
import { ProjectCard } from "@/components/ProjectCard"

export default async function Home() {
	const translations = await getTranslations("development")
	const messages = await getMessages()
	const skills = Object.keys(messages.development.skills.skills)

	return (
		<main className={styles.development}>
			<h2>👨🏻‍💻 {translations("introduction.header")}</h2>
			<section>
				<p>{translations("introduction.fields")}</p>
				<p>
					{translations.rich("introduction.curricullum", {
						emoji: (chunks) => <span className="emoji">{chunks}</span>,
						curriculumLink: (chunks) => (
							<a
								href="https://kuzminklk.notion.site/31154d4de03580d7b5ceca5b187846be"
								target="blank"
								rel="noopener noreferrer"
							>
								{chunks}
							</a>
						),
					})}
				</p>
				<p>{translations("introduction.practice")}</p>
				<p>
					{translations.rich("introduction.github", {
						emoji: (chunks) => <span className="emoji">{chunks}</span>,
						githubLink: (chunks) => (
							<a href="https://github.com/kuzminklk" target="blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>
			</section>
			<h2>🧰 {translations("skills.header")}</h2>
			<section>
				<ul>
					{skills.map((skill) => (
						<li key={skill}>
							{translations.rich(`skills.skills.${skill}`, {
								strong: (chunks) => <strong>{chunks}</strong>,
								emphasize: (chunks) => <em>{chunks}</em>,
							})}
						</li>
					))}
				</ul>
			</section>
			<h1>
				<span className={styles.emoji}>💾</span> {translations("projects.header")}
			</h1>
			<p>
				{translations.rich("projects.explore", {
					emphasize: (chunks) => <em>{chunks}</em>,
					emoji: (chunks) => <span className="emoji">{chunks}</span>,
					githubLink: (chunks) => (
						<a href="https://github.com/kuzminklk" target="blank" rel="noopener noreferrer">
							{chunks}
						</a>
					),
				})}
			</p>
			<section>
				<h2>💻 {translations("projects.web-interfaces.header")}</h2>
				<div className={styles.grid}>
					{projects.map((project) => {
						const translatedProject: Project = {
							title: translations(`projects.web-interfaces.${project.id}.title`),
							description: translations.rich(`projects.web-interfaces.${project.id}.description`, {
								emphasize: (chunks) => <em>{chunks}</em>,
								break: () => <br />,
							}),
							imageAlternative: translations(
								`projects.web-interfaces.${project.id}.image-alternative`,
							),
							github: project.github,
							deployment: project.deployment,
							desktopImage: project.desktopImage,
							mobileImage: project.mobileImage,
						}

						return <ProjectCard key={project.id} project={translatedProject} />
					})}
				</div>
			</section>
		</main>
	)
}
