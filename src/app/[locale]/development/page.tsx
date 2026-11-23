import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { Emoji } from "@/components/Emoji"
import { PageHeader } from "@/components/PageHeader"
import { SectionHeader } from "@/components/SectionHeader"
import { ProjectCard, type Project } from "@/components/ProjectCard"
import { projects } from "@/data/projects"
import { skillGroups } from "@/data/skills"
import { buildPageMetadata } from "@/data/metadata"
import type { Locale } from "@/i18n/routing"

import styles from "./page.module.css"

type PageProps = {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params
	return buildPageMetadata({ locale: locale as Locale, pathname: "/development", pageKey: "development" })
}

export default async function Development() {
	const translations = await getTranslations("development")
	const header = await getTranslations("Header")
	const common = await getTranslations("common")

	return (
		<main id="main" className={styles.development}>
			<PageHeader
				index="02"
				kicker="SECTION / ENGINEERING"
				title={header("development")}
				icon="laptop"
				lede={translations("introduction.fields")}
				meta={["WEB3", "FRONT-END", "AI"]}
			>
				<div className={styles.intro}>
					<p>{translations("introduction.practice")}</p>
					<p>
						{translations.rich("introduction.curriculum", {
							emoji: (chunks) => <Emoji>{chunks}</Emoji>,
							curriculumLink: (chunks) => (
								<a
									href="https://kuzminklk.notion.site/31154d4de03580d7b5ceca5b187846be"
									target="_blank"
									rel="noopener noreferrer"
								>
									{chunks}
								</a>
							),
						})}
					</p>
					<p>
						{translations.rich("introduction.github", {
							emoji: (chunks) => <Emoji>{chunks}</Emoji>,
							githubLink: (chunks) => (
								<a href="https://github.com/kuzminklk" target="_blank" rel="noopener noreferrer">
									{chunks}
								</a>
							),
						})}
					</p>
				</div>
			</PageHeader>

			{/* ——— Skills ——— */}
			<section className={styles.section} aria-labelledby="skills">
				<SectionHeader
					number="01"
					title={translations("skills.header")}
					icon="toolbox"
					aside={`${skillGroups.length} groups`}
				/>
				<ol className={styles.skills}>
					{skillGroups.map((skill) => (
						<li key={skill} className={styles.skill}>
							<span className={styles.skillNumber} aria-hidden="true">
								{String(skillGroups.indexOf(skill) + 1).padStart(2, "0")}
							</span>
							<p className={styles.skillText}>
								{translations.rich(`skills.skills.${skill}`, {
									strong: (chunks) => <strong>{chunks}</strong>,
									emphasize: (chunks) => <em>{chunks}</em>,
								})}
							</p>
						</li>
					))}
				</ol>
			</section>

			{/* ——— Projects ——— */}
			<section className={styles.section} aria-labelledby="projects">
				<SectionHeader
					number="02"
					title={translations("projects.header")}
					icon="floppy"
					aside={`${projects.length} entries`}
				/>
				<p className={styles.projectsIntro}>
					{translations.rich("projects.explore", {
						emphasize: (chunks) => <em>{chunks}</em>,
						emoji: (chunks) => <Emoji>{chunks}</Emoji>,
						githubLink: (chunks) => (
							<a href="https://github.com/kuzminklk" target="_blank" rel="noopener noreferrer">
								{chunks}
							</a>
						),
					})}
				</p>

				<div className={styles.projectsGrid}>
					{projects.map((project) => {
						const translatedProject: Project = {
							id: project.id,
							title: translations(`projects.web-interfaces.${project.id}.title`),
							description: translations.rich(`projects.web-interfaces.${project.id}.description`, {
								emphasize: (chunks) => <em>{chunks}</em>,
								break: () => <br />,
							}),
							imageAlternative: translations(`projects.web-interfaces.${project.id}.image-alternative`),
							github: project.github,
							deployment: project.deployment,
							desktopImage: project.desktopImage,
							mobileImage: project.mobileImage,
							pixelImage: project.pixelImage,
							visitSiteLabel: common("visit-site"),
							sourceCodeLabel: common("view-source"),
						}

						return <ProjectCard key={project.id} project={translatedProject} />
					})}
				</div>
			</section>
		</main>
	)
}
