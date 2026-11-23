import { PixelStar } from "@/components/Glyphs"
import styles from "./Ornaments.module.css"

/**
 * Decorative SVG ornaments.
 *
 * These are intentionally drawn from primitives (circles, lines, dots) rather
 * than images: they stay crisp, theme-aware and add zero network weight.
 */

/** Engraved star-chart plate used behind the portrait on the About page. */
export function StarChart({ className }: { className?: string }) {
	// Constellations: pairs of star coordinates (in the 0–400 viewBox).
	const stars = [
		[92, 118],
		[130, 86],
		[150, 150],
		[118, 196],
		[204, 72],
		[244, 120],
		[286, 96],
		[312, 158],
		[270, 206],
		[222, 250],
		[170, 292],
		[108, 320],
		[64, 262],
		[330, 300],
	] as const

	const links = [
		[0, 1],
		[1, 4],
		[4, 6],
		[6, 7],
		[7, 8],
		[8, 9],
		[9, 10],
		[10, 11],
		[11, 12],
		[12, 0],
		[2, 3],
		[3, 5],
		[5, 7],
		[8, 13],
	] as const

	return (
		<svg
			className={[styles.starChart, className].filter(Boolean).join(" ")}
			viewBox="0 0 400 400"
			aria-hidden="true"
			fill="none"
		>
			{/* Orbits */}
			<circle cx="200" cy="200" r="188" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="1 6" />
			<circle cx="200" cy="200" r="150" stroke="currentColor" strokeOpacity="0.28" />
			<circle cx="200" cy="200" r="104" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="3 5" />
			<circle cx="200" cy="200" r="56" stroke="currentColor" strokeOpacity="0.22" />

			{/* Crosshair and tick marks */}
			<line x1="200" y1="12" x2="200" y2="388" stroke="currentColor" strokeOpacity="0.18" />
			<line x1="12" y1="200" x2="388" y2="200" stroke="currentColor" strokeOpacity="0.18" />
			{Array.from({ length: 24 }, (_, index) => {
				const angle = (index / 24) * Math.PI * 2
				const inner = 178
				const outer = index % 6 === 0 ? 190 : 185
				return (
					<line
						key={index}
						x1={200 + Math.cos(angle) * inner}
						y1={200 + Math.sin(angle) * inner}
						x2={200 + Math.cos(angle) * outer}
						y2={200 + Math.sin(angle) * outer}
						stroke="currentColor"
						strokeOpacity="0.4"
					/>
				)
			})}

			{/* Constellation lines */}
			{links.map(([from, to]) => (
				<line
					key={`${from}-${to}`}
					x1={stars[from][0]}
					y1={stars[from][1]}
					x2={stars[to][0]}
					y2={stars[to][1]}
					stroke="var(--sky)"
					strokeOpacity="0.55"
				/>
			))}

			{/* Stars */}
			{stars.map(([x, y], index) => (
				<rect
					key={`${x}-${y}`}
					x={x - (index % 4 === 0 ? 2 : 1)}
					y={y - (index % 4 === 0 ? 2 : 1)}
					width={index % 4 === 0 ? 4 : 2}
					height={index % 4 === 0 ? 4 : 2}
					fill={index % 5 === 0 ? "var(--marker)" : "currentColor"}
				/>
			))}

			{/* HUD labels */}
			<text x="200" y="30" textAnchor="middle" className={styles.chartLabel}>
				N
			</text>
			<text x="200" y="386" textAnchor="middle" className={styles.chartLabel}>
				2026
			</text>
			<text x="26" y="204" className={styles.chartLabel}>
				53°N
			</text>
			<text x="318" y="204" className={styles.chartLabel}>
				27°E
			</text>
		</svg>
	)
}

/** Small centred star between two hairlines. */
export function PixelDivider({ className }: { className?: string }) {
	return (
		<div className={[styles.divider, className].filter(Boolean).join(" ")} aria-hidden="true">
			<PixelStar size={12} />
		</div>
	)
}

/**
 * Four L-shaped corner ticks. Wrap any block in `position: relative` and drop
 * this component inside for the "technical plate" look from the reference.
 */
export function CornerTicks({ className }: { className?: string }) {
	return (
		<div className={[styles.corners, className].filter(Boolean).join(" ")} aria-hidden="true">
			<span />
			<span />
			<span />
			<span />
		</div>
	)
}
