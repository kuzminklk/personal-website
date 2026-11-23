import { PixelGlyph } from "@/components/PixelIcon"

/**
 * Small hand-drawn UI glyphs that are not part of the emoji sprite set:
 * brand star, theme icons, navigation arrows. Same 16×16 token language as
 * `src/data/pixel-icons.ts` so everything feels like one pixel system.
 */

// Shared prop shape for all glyphs.
type GlyphProps = {
	size?: number
	className?: string
	label?: string
}

/** Four-point brand star used next to the wordmark. */
export function PixelStar({ size = 16, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				".......kk.......",
				".......kk.......",
				"......kkkk......",
				"....kkkkkkkk....",
				".....kkkkkk.....",
				"..k...kkkk...k..",
				"..kkkkkkkkkkkk..",
				"..kkkkkkkkkkkk..",
				"..k...kkkk...k..",
				".....kkkkkk.....",
				"....kkkkkkkk....",
				"......kkkk......",
				".......kk.......",
				".......kk.......",
				"................",
			]}
		/>
	)
}

/** Sun glyph shown while the dark theme is active (button switches to light). */
export function PixelSun({ size = 16, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				".......ss.......",
				"...s...ss...s...",
				"....s..ss..s....",
				".....kkkkkk.....",
				"....kkkkkkkk....",
				"..kkkkkkkkkkkk..",
				"..kkkkkkkkkkkk..",
				"..kkkkkkkkkkkk..",
				"..kkkkkkkkkkkk..",
				"....kkkkkkkk....",
				".....kkkkkk.....",
				"....s..ss..s....",
				"...s...ss...s...",
				".......ss.......",
				"................",
			]}
		/>
	)
}

/** Crescent glyph shown while the light theme is active. */
export function PixelMoon({ size = 16, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				"......kkkk......",
				"....kkkkkkkk....",
				"...kkkkkkkkk....",
				"..kkkkkkkkkk....",
				"..kkkkkkkkk.....",
				".kkkkkkkkkk.....",
				".kkkkkkkkk......",
				".kkkkkkkkk......",
				"..kkkkkkkkk.....",
				"..kkkkkkkkkk....",
				"...kkkkkkkkk....",
				"....kkkkkkkk....",
				"......kkkk......",
				"................",
				"................",
			]}
		/>
	)
}

/** Diagonal "opens in a new tab / go to site" arrow. */
export function PixelArrowUpRight({ size = 12, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				"............kk..",
				"...........kkk..",
				"..........kkkk..",
				".........kk.kk..",
				"........kk......",
				".......kk.......",
				"......kk........",
				".....kk.........",
				"....kk..........",
				"...kk...........",
				"..kk............",
				".kk.............",
				"kk..............",
				"................",
				"................",
			]}
		/>
	)
}

/** Down arrow used by the "scroll / back to top" affordances. */
export function PixelArrowDown({ size = 14, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				".......kk.......",
				".......kk.......",
				".......kk.......",
				".......kk.......",
				".......kk.......",
				".......kk.......",
				"..kk...kk...kk..",
				"...kk..kk..kk...",
				"....kk.kk.kk....",
				".....kkkkkk.....",
				"......kkkk......",
				".......kk.......",
				"................",
				"................",
				"................",
			]}
		/>
	)
}

/** Check mark used for the active language. */
export function PixelCheck({ size = 12, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				"................",
				"..............k.",
				".............kk.",
				"............kk..",
				"...........kk...",
				"..k.......kk....",
				".kkk.....kk.....",
				"...kkk..kk......",
				".....kkkk.......",
				"......kkk.......",
				".......k........",
				"................",
				"................",
				"................",
				"................",
			]}
		/>
	)
}

/** Close (X) glyph for the mobile menu. */
export function PixelClose({ size = 16, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				".kk..........kk.",
				"..kk........kk..",
				"...kk......kk...",
				"....kk....kk....",
				".....kk..kk.....",
				"......kkkk......",
				"......kkkk......",
				".....kk..kk.....",
				"....kk....kk....",
				"...kk......kk...",
				"..kk........kk..",
				".kk..........kk.",
				"................",
				"................",
				"................",
			]}
		/>
	)
}

/** Three-bar menu glyph. */
export function PixelMenu({ size = 16, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				"................",
				"..kkkkkkkkkkkk..",
				"..kkkkkkkkkkkk..",
				"................",
				"................",
				"..kkkkkkkkkkkk..",
				"..kkkkkkkkkkkk..",
				"................",
				"................",
				"..kkkkkkkkkkkk..",
				"..kkkkkkkkkkkk..",
				"................",
				"................",
				"................",
				"................",
			]}
		/>
	)
}

/** Play triangle for video controls. */
export function PixelPlay({ size = 16, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				"....kk..........",
				"....kkkk........",
				"....kkkkkk......",
				"....kkkkkkkk....",
				"....kkkkkkkkkk..",
				"....kkkkkkkkkkkk",
				"....kkkkkkkkkkkk",
				"....kkkkkkkkkk..",
				"....kkkkkkkk....",
				"....kkkkkk......",
				"....kkkk........",
				"....kk..........",
				"................",
				"................",
				"................",
			]}
		/>
	)
}

/** Pause bars for video controls. */
export function PixelPause({ size = 16, className, label }: GlyphProps) {
	return (
		<PixelGlyph
			label={label}
			size={size}
			className={className}
			grid={[
				"................",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"....kkkk..kkkk..",
				"................",
				"................",
				"................",
				"................",
			]}
		/>
	)
}
