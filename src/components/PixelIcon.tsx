import { pixelIcons, type PixelIconName } from "@/data/pixel-icons"

/** Palette tokens used by the sprite data → actual CSS colours. */
const TOKEN_FILL: Record<string, { fill: string; opacity?: number }> = {
	// "k" ink: inherits the current text colour, so icons invert with the theme.
	k: { fill: "currentColor" },
	// "d" dim ink: secondary detail, text colour at reduced opacity.
	d: { fill: "currentColor", opacity: 0.45 },
	// "s" sky: the light-blue annotation accent.
	s: { fill: "var(--sky)" },
	// "m" marker: the muted bookish yellow.
	m: { fill: "var(--marker)" },
}

// "p" (paper) and "." (transparent) are intentionally not painted: leaving
// them empty makes the sprite show the surface underneath, which means the
// very same SVG looks right on paper, on ink panels and inside inverted chips.

type Rect = { x: number; y: number; width: number; fill: string; opacity?: number }

/** Convert a 16×16 token grid into horizontal runs of rectangles. */
function gridToRectangles(grid: readonly string[]): Rect[] {
	const rectangles: Rect[] = []

	grid.forEach((row, y) => {
		let x = 0

		while (x < row.length) {
			const token = row[x]
			const style = TOKEN_FILL[token]

			if (!style) {
				x += 1
				continue
			}

			// Merge adjacent pixels of the same token into one <rect>.
			let width = 1
			while (x + width < row.length && row[x + width] === token) width += 1

			rectangles.push({ x, y, width, ...style })
			x += width
		}
	})

	return rectangles
}

export type PixelGlyphProps = {
	/** 16 rows of 16 tokens (". k p d s m"). */
	grid: readonly string[]
	size?: number
	className?: string
	label?: string
}

/**
 * Render an arbitrary 16×16 token grid as a pixel glyph.
 *
 * Shared by the `PixelIcon` sprite set and the small UI glyphs (star, sun,
 * arrows) in `Glyphs.tsx`.
 */
export function PixelGlyph({ grid, size = 20, className, label }: PixelGlyphProps) {
	const rectangles = gridToRectangles(grid)

	return (
		<svg
			className={["pixel-icon", className].filter(Boolean).join(" ")}
			width={size}
			height={size}
			viewBox="0 0 16 16"
			shapeRendering="crispEdges"
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			focusable="false"
		>
			{label ? <title>{label}</title> : null}
			{rectangles.map((rectangle) => (
				<rect
					key={`${rectangle.x}-${rectangle.y}-${rectangle.fill}`}
					x={rectangle.x}
					y={rectangle.y}
					width={rectangle.width}
					height={1}
					fill={rectangle.fill}
					fillOpacity={rectangle.opacity}
				/>
			))}
		</svg>
	)
}

export type PixelIconProps = {
	name: PixelIconName
	/** Rendered size in CSS pixels (the sprite is 16×16). */
	size?: number
	className?: string
	/**
	 * Accessible label. Icons are decorative by default because they almost
	 * always sit next to a text label; pass a label only for standalone icons.
	 */
	label?: string
}

/**
 * Hand-drawn pixel-art icon.
 *
 * Every icon is a 16×16 token grid (see `src/data/pixel-icons.ts`) painted as
 * `<rect>` elements. No external icon font, no emoji font, no images: the
 * result is byte-for-byte identical on every operating system, which fixes
 * the "emoji look different / are missing" problem in a way that also fits the
 * pixel-art art direction.
 */
export function PixelIcon({ name, size = 20, className, label }: PixelIconProps) {
	const icon = pixelIcons[name]
	return <PixelGlyph grid={icon.grid} size={size} className={className} label={label} />
}
