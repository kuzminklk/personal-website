"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import { pageEntries } from "@/i18n/routing"
import { PixelIcon } from "@/components/PixelIcon"
import { PixelClose, PixelMenu, PixelStar } from "@/components/Glyphs"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ThemeToggle } from "@/components/ThemeToggle"
import styles from "./Header.module.css"

/**
 * Sticky site header.
 *
 * Desktop: brand + numbered navigation + theme/language controls.
 * Below 1280px the navigation folds into a full-screen menu so long Russian,
 * Belarusian and Polish labels never overflow.
 */
export function Header() {
	const translations = useTranslations("Header")
	const pathname = usePathname()

	const [menuOpen, setMenuOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const menuRef = useRef<HTMLDivElement>(null)
	const menuButtonRef = useRef<HTMLButtonElement>(null)

	const items = pageEntries.map((entry, index) => ({
		...entry,
		label: translations(entry.key),
		number: String(index + 1).padStart(2, "0"),
	}))

	// Escape closes the menu, focus moves into it on open, and the page behind
	// it stops scrolling.
	useEffect(() => {
		if (!menuOpen) return

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setMenuOpen(false)
				menuButtonRef.current?.focus()
			}
		}

		document.addEventListener("keydown", onKeyDown)
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"

		// Make the page behind the dialog inert so Tab stays within the header
		// controls and the menu (the close button lives in the header).
		const background = [document.querySelector("main"), document.querySelector("footer")]
		background.forEach((element) => element?.setAttribute("inert", ""))
		menuRef.current?.querySelector<HTMLElement>("a, button")?.focus()

		return () => {
			document.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = previousOverflow
			background.forEach((element) => element?.removeAttribute("inert"))
		}
	}, [menuOpen])

	// A subtle border appears once the page has been scrolled.
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8)
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return (
		<>
			<header className={styles.header} data-scrolled={scrolled || undefined}>
				<div className={styles.inner}>
					<Link href="/about" className={styles.brand} aria-label={translations("home")}>
						<PixelStar size={18} className={styles.brandStar} />
						<span className={styles.wordmark}>kuzminklk</span>
						<span className={styles.brandMeta}>personal archive</span>
					</Link>

					<nav className={styles.desktopNav} aria-label={translations("navigation")}>
						<ul>
							{items.map((item) => {
								const isActive = pathname === item.pathname
								return (
									<li key={item.pathname}>
										<Link
											href={item.pathname}
											className={styles.navLink}
											data-active={isActive || undefined}
											aria-current={isActive ? "page" : undefined}
										>
											<span className={styles.navNumber} aria-hidden="true">
												{item.number}
											</span>
											<span className={styles.navLabel}>{item.label}</span>
										</Link>
									</li>
								)
							})}
						</ul>
					</nav>

					<div className={styles.controls}>
						<div className={styles.desktopLanguage}>
							<LanguageSwitcher />
						</div>
						<ThemeToggle />
						<button
							ref={menuButtonRef}
							type="button"
							className={styles.menuButton}
							onClick={() => setMenuOpen((open) => !open)}
							aria-expanded={menuOpen}
							aria-controls="site-menu"
							aria-label={menuOpen ? translations("close") : translations("menu")}
						>
							{menuOpen ? <PixelClose size={18} /> : <PixelMenu size={18} />}
						</button>
					</div>
				</div>
			</header>

			{/* The full-screen menu lives outside <header>: the header's
			    backdrop-filter would otherwise become the containing block for
			    this fixed-position panel. It only exists in the DOM while open,
			    so hidden links never pollute the tab order. */}
			{menuOpen ? (
				<div
					ref={menuRef}
					id="site-menu"
					className={styles.mobileMenu}
					role="dialog"
					aria-modal="true"
					aria-label={translations("navigation")}
				>
					<nav aria-label={translations("navigation")}>
						<ul className={styles.mobileList}>
							{items.map((item) => {
								const isActive = pathname === item.pathname
								return (
									<li key={item.pathname}>
										<Link
											href={item.pathname}
											className={styles.mobileLink}
											data-active={isActive || undefined}
											aria-current={isActive ? "page" : undefined}
											onClick={() => setMenuOpen(false)}
										>
											<span className={styles.mobileNumber} aria-hidden="true">
												{item.number}
											</span>
											<span className={styles.mobileLabel}>{item.label}</span>
											<PixelIcon name={item.icon} size={22} className={styles.mobileIcon} />
										</Link>
									</li>
								)
							})}
						</ul>
					</nav>

					<div className={styles.mobileFoot}>
						<LanguageSwitcher variant="full" />
						<div className={styles.mobileMeta}>
							<ThemeToggle withLabel />
							<span className="micro">MINSK · UTC+3</span>
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}
