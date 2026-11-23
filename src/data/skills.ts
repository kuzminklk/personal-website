/**
 * Skill groups shown on the Development page.
 * The values are keys in `messages.*.development.skills.skills`, so the order
 * and grouping live in code while every label stays translatable.
 */
export const skillGroups = [
	"fundamentals",
	"front-end",
	"back-end",
	"blockchain",
	"web-3-front-end",
	"deployment",
	"tools",
	"artificial-intelligence",
	"soft-skills",
	"additional",
] as const

export type SkillGroup = (typeof skillGroups)[number]
