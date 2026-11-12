"use client"

import { useEffect, useRef, useSyncExternalStore } from "react"

const reducedMotionQuery = "(prefers-reduced-motion: reduce)"

function subscribeToMotionPreference(onChange: () => void) {
	const mediaQuery = window.matchMedia(reducedMotionQuery)
	mediaQuery.addEventListener("change", onChange)
	return () => mediaQuery.removeEventListener("change", onChange)
}

function getMotionPreference() {
	return window.matchMedia(reducedMotionQuery).matches
}

function getServerMotionPreference() {
	return true
}

export function WorkoutVideo({ src, poster }: { src: string; poster: string }) {
	const videoRef = useRef<HTMLVideoElement>(null)
	const prefersReducedMotion = useSyncExternalStore(
		subscribeToMotionPreference,
		getMotionPreference,
		getServerMotionPreference,
	)

	useEffect(() => {
		if (prefersReducedMotion) {
			videoRef.current?.pause()
		}
	}, [prefersReducedMotion])

	return (
		<video
			ref={videoRef}
			src={src}
			poster={poster}
			autoPlay={!prefersReducedMotion}
			loop
			muted
			playsInline
			aria-hidden="true"
		/>
	)
}
