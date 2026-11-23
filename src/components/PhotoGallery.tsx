"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Image, { type StaticImageData } from "next/image"
import { useTranslations } from "next-intl"

import { PixelArrowDown, PixelClose } from "@/components/Glyphs"
import styles from "./PhotoGallery.module.css"

export type GalleryPhoto = {
	id: string
	source: StaticImageData
	alt: string
	orientation: "portrait" | "landscape"
}

/**
 * Photo gallery with an accessible lightbox.
 *
 * - The grid is a real list of buttons, so it is keyboard operable.
 * - The lightbox is rendered through a portal to escape the animated `<main>`
 *   stacking context and supports ←/→, Escape, arrow buttons and a focus trap.
 * - Page scroll is locked while the lightbox is open and focus returns to the
 *   photo that was opened.
 */
export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
	const translations = useTranslations("photography.lightbox")
	const galleryTranslations = useTranslations("photography.gallery")

	const [activeIndex, setActiveIndex] = useState<number | null>(null)
	const dialogRef = useRef<HTMLDivElement>(null)
	const closeButtonRef = useRef<HTMLButtonElement>(null)
	const tileRefs = useRef<Array<HTMLButtonElement | null>>([])

	const activePhoto = activeIndex === null ? null : photos[activeIndex]

	const close = useCallback(() => {
		setActiveIndex((index) => {
			// Restore focus to the tile that was opened.
			if (index !== null) tileRefs.current[index]?.focus()
			return null
		})
	}, [])

	const showPrevious = useCallback(() => {
		setActiveIndex((index) => (index === null ? null : (index - 1 + photos.length) % photos.length))
	}, [photos.length])

	const showNext = useCallback(() => {
		setActiveIndex((index) => (index === null ? null : (index + 1) % photos.length))
	}, [photos.length])

	// Keyboard support + scroll lock + initial focus.
	useEffect(() => {
		if (activeIndex === null) return

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				event.preventDefault()
				close()
				return
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault()
				showPrevious()
				return
			}
			if (event.key === "ArrowRight") {
				event.preventDefault()
				showNext()
				return
			}
			if (event.key !== "Tab") return

			// Simple focus trap: keep Tab inside the dialog.
			const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
				'button, [href], [tabindex]:not([tabindex="-1"])',
			)
			if (!focusable || focusable.length === 0) return
			const first = focusable[0]
			const last = focusable[focusable.length - 1]
			if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault()
				first.focus()
			} else if (event.shiftKey && document.activeElement === first) {
				event.preventDefault()
				last.focus()
			}
		}

		document.addEventListener("keydown", onKeyDown)
		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = "hidden"
		closeButtonRef.current?.focus()

		return () => {
			document.removeEventListener("keydown", onKeyDown)
			document.body.style.overflow = previousOverflow
		}
	}, [activeIndex, close, showNext, showPrevious])

	const counter = useMemo(() => {
		if (activeIndex === null) return ""
		return translations("counter", { current: activeIndex + 1, total: photos.length })
	}, [activeIndex, photos.length, translations])

	return (
		<>
			<p className={styles.hint}>{galleryTranslations("hint")}</p>

			<ul className={styles.grid}>
				{photos.map((photo, index) => (
					<li key={photo.id} className={styles.item} data-orientation={photo.orientation}>
						<button
							ref={(element) => {
								tileRefs.current[index] = element
							}}
							type="button"
							className={styles.tile}
							onClick={() => setActiveIndex(index)}
							aria-label={photo.alt}
						>
							<Image
								src={photo.source}
								alt={photo.alt}
								className={styles.image}
								placeholder="blur"
								sizes="(max-width: 730px) 100vw, (max-width: 1100px) 50vw, 33vw"
							/>
							<span className={styles.index} aria-hidden="true">
								{String(index + 1).padStart(2, "0")}
							</span>
						</button>
					</li>
				))}
			</ul>

			{activePhoto
				? createPortal(
						<div
							ref={dialogRef}
							className={styles.overlay}
							role="dialog"
							aria-modal="true"
							aria-label={activePhoto.alt}
							onClick={(event) => {
								// Clicking the backdrop (but not the figure) closes.
								if (event.target === event.currentTarget) close()
							}}
						>
							<button
								ref={closeButtonRef}
								type="button"
								className={styles.close}
								onClick={close}
								aria-label={translations("close")}
							>
								<PixelClose size={18} />
							</button>

							<button
								type="button"
								className={`${styles.nav} ${styles.previous}`}
								onClick={showPrevious}
								aria-label={translations("previous")}
							>
								<PixelArrowDown size={18} />
							</button>

							<figure className={styles.figure}>
								<Image src={activePhoto.source} alt={activePhoto.alt} className={styles.full} sizes="92vw" priority />
								<figcaption className={styles.caption}>
									<span>{activePhoto.alt}</span>
									<span aria-hidden="true">·</span>
									<span className={styles.counter} aria-live="polite">
										{counter}
									</span>
								</figcaption>
							</figure>

							<button
								type="button"
								className={`${styles.nav} ${styles.next}`}
								onClick={showNext}
								aria-label={translations("next")}
							>
								<PixelArrowDown size={18} />
							</button>
						</div>,
						document.body,
					)
				: null}
		</>
	)
}
