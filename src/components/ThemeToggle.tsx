"use client"

import { useSyncExternalStore } from "react"
import { useTranslations } from "next-intl"

import { PixelMoon, PixelSun } from "@/components/Glyphs"
import styles from "./ThemeToggle.module.css"

type Theme = "light" | "dark"

/** Event dispatched after an explicit theme choice, so every toggle re-reads. */
const THEME_EVENT = "kuzminklk:themechange"

/**
 * `useSyncExternalStore` is a good fit for the current theme: the source of
 * truth lives on `<html data-theme>` / the OS media query, not in React state.
 * It also keeps SSR safe and avoids "setState inside effect" re-render cascades.
 */
function subscribe(onStoreChange: () => void) {
	const media = window.matchMedia("(prefers-color-scheme: dark)")
	media.addEventListener("change", onStoreChange)
	window.addEventListener(THEME_EVENT, onStoreChange)

	return () => {
		media.removeEventListener("change", onStoreChange)
		window.removeEventListener(THEME_EVENT, onStoreChange)
	}
}

function getSnapshot(): Theme {
	const explicit = document.documentElement.dataset.theme
	if (explicit === "light" || explicit === "dark") return explicit
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

/** During SSR/hydration assume the light theme; the inline script sets the DOM. */
function getServerSnapshot(): Theme {
	return "light"
}

/**
 * Theme toggle.
 *
 * Follows the operating system by default; once used it stores an explicit
 * `light`/`dark` choice in `localStorage` and on `<html data-theme>`. The
 * inline script in `layout.tsx` applies that choice before first paint so the
 * page never flashes the wrong theme.
 */
export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
	const translations = useTranslations("ThemeToggle")
	const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

	const isDark = theme === "dark"
	const label = isDark ? translations("switchToLight") : translations("switchToDark")

	function toggle() {
		const next: Theme = isDark ? "light" : "dark"
		document.documentElement.dataset.theme = next
		// Keep the address-bar colour in sync when the visitor overrides the OS
		// preference (the viewport export only covers the OS-driven case).
		document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
			meta.setAttribute("content", next === "dark" ? "#050310" : "#f2ecdb")
		})
		try {
			localStorage.setItem("theme", next)
		} catch {
			// Storage can be unavailable (private mode, blocked cookies); the
			// theme still switches for the current page.
		}
		window.dispatchEvent(new Event(THEME_EVENT))
	}

	return (
		<button
			type="button"
			onClick={toggle}
			className={styles.toggle}
			data-with-label={withLabel || undefined}
			aria-label={label}
			title={label}
		>
			{isDark ? <PixelSun size={16} /> : <PixelMoon size={16} />}
			{withLabel ? <span className={styles.label}>{isDark ? translations("light") : translations("dark")}</span> : null}
		</button>
	)
}
