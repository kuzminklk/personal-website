

"use client"


import { useTheme } from "next-themes"

import styles from "./ThemeSwitcher.module.css"


const themes = ["light", "dark", "system"] as const

const icons = {
	light: "☀️",
	dark: "🌙",
	system: "🖥️",
}

const labels = {
	light: "Light theme",
	dark: "Dark theme",
	system: "System theme",
}

export function ThemeSwitcher() {
	const {theme, setTheme} = useTheme()
	const currentIndexOfTheme = themes.indexOf(theme as (typeof themes)[number])
	const nextTheme = themes[(currentIndexOfTheme + 1) % themes.length]

	return (
		<button onClick={() => setTheme(nextTheme)} aria-label={`Theme: ${labels[theme as keyof typeof labels]}. Switch to ${labels[nextTheme]}`} className={styles.switcher}>
			{icons[theme as keyof typeof icons]}
		</button>
	)
}