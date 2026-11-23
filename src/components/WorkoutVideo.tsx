"use client"

import { useEffect, useRef, useState } from "react"

import { PixelPause, PixelPlay } from "@/components/Glyphs"
import styles from "./WorkoutVideo.module.css"

export type WorkoutVideoProps = {
	src: string
	poster: string
	/** Accessible description of the movement, e.g. "Lifting a stone". */
	label: string
	playLabel: string
	pauseLabel: string
	/** Two-digit index displayed in the corner. */
	index: string
}

/**
 * Looping workout clip that respects `prefers-reduced-motion`.
 *
 * Videos only autoplay while they are in the viewport; they pause when
 * scrolled away, can be toggled with the pixel button and never play
 * automatically for visitors who ask for reduced motion.
 */
export function WorkoutVideo({ src, poster, label, playLabel, pauseLabel, index }: WorkoutVideoProps) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [playing, setPlaying] = useState(false)
	const [reducedMotion, setReducedMotion] = useState(false)

	// Detect the motion preference once and react to changes.
	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)")
		const sync = () => setReducedMotion(media.matches)
		sync()
		media.addEventListener("change", sync)
		return () => media.removeEventListener("change", sync)
	}, [])

	// Play only while visible (and not when reduced motion is requested).
	useEffect(() => {
		const video = videoRef.current
		if (!video || reducedMotion) return

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0]
				if (entry.isIntersecting) {
					video.play().catch(() => {
						// Autoplay can be blocked by the browser; the play button
						// remains available.
					})
				} else {
					video.pause()
				}
			},
			{ threshold: 0.35 },
		)

		observer.observe(video)
		return () => observer.disconnect()
	}, [reducedMotion])

	function toggle() {
		const video = videoRef.current
		if (!video) return
		if (video.paused) {
			video.play().catch(() => setPlaying(false))
		} else {
			video.pause()
		}
	}

	return (
		<figure className={styles.figure}>
			<div className={styles.media}>
				<video
					ref={videoRef}
					className={styles.video}
					src={src}
					poster={poster}
					muted
					loop
					playsInline
					preload="metadata"
					aria-label={label}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
				/>
				<span className={styles.index} aria-hidden="true">
					{index}
				</span>
				<button
					type="button"
					className={styles.control}
					onClick={toggle}
					aria-label={playing ? pauseLabel : playLabel}
					title={playing ? pauseLabel : playLabel}
				>
					{playing ? <PixelPause size={16} /> : <PixelPlay size={16} />}
				</button>
			</div>
			<figcaption className={styles.caption}>{label}</figcaption>
		</figure>
	)
}
