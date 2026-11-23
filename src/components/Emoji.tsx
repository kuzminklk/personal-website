import type { PixelIconName } from "@/data/pixel-icons"
import { PixelIcon } from "@/components/PixelIcon"

/**
 * Emoji → pixel icon mapping.
 *
 * The translation files still use real emoji characters because they are
 * pleasant to write and translate. At render time every emoji is replaced by
 * a hand-drawn pixel sprite, so the visual result no longer depends on the
 * visitor's operating system, browser or emoji font.
 *
 * Keys are normalised first (variation selectors and skin-tone modifiers are
 * stripped), e.g. "👨🏻‍💻", "👨‍💻" and "🧑🏻‍💻" all resolve to `developer`.
 */
const emojiToIcon: Record<string, PixelIconName> = {
	"👋": "wave",
	"🧑‍🚀": "astronaut",
	"💻": "laptop",
	"📸": "camera",
	"💪": "muscle",
	"📚": "books",
	"📒": "notebook",
	"🤝": "handshake",
	"📜": "scroll",
	"🧭": "compass",
	"📖": "book",
	"📕": "book",
	"📫": "mailbox",
	"🧜‍♂": "merperson",
	"🧜": "merperson",
	"✒": "quill",
	"✍": "writing-hand",
	"🎯": "target",
	"🖼": "frame",
	"💾": "floppy",
	"🎨": "palette",
	"🌿": "leaf",
	"🧘": "meditation",
	"👨‍💻": "developer",
	"🧑‍💻": "developer",
	"👩‍💻": "developer",
	"👨‍🔬": "scientist",
	"🧑‍🔬": "scientist",
	"🧰": "toolbox",
	"👀": "eyes",
	"📔": "journal",
	"📝": "memo",
	"📑": "memo",
	"🛠": "tools",
	"🥰": "smile-heart",
	"🏃": "runner",
	"🎥": "movie-camera",
	"🌲": "tree",
	"🧊": "ice",
	"🏺": "amphora",
}

/** Strip everything that is irrelevant for icon selection. */
export function normaliseEmoji(value: string): string {
	return value
		.replace(/\uFE0F|\uFE0E/g, "") // variation selectors
		.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "") // skin tones
		.trim()
}

/** Resolve any emoji string to a sprite name, or `undefined` if unknown. */
export function emojiToIconName(value: string): PixelIconName | undefined {
	const normalised = normaliseEmoji(value)
	return emojiToIcon[normalised] ?? emojiToIcon[value]
}

/**
 * next-intl passes rich-text tag content as a ReactNode (often an array of
 * strings), so normalise it to a plain string before matching an emoji.
 */
function flattenChildren(children: React.ReactNode): string {
	if (children === null || children === undefined || typeof children === "boolean") return ""
	if (typeof children === "string" || typeof children === "number") return String(children)
	if (Array.isArray(children)) return children.map(flattenChildren).join("")
	return ""
}

export type EmojiProps = {
	children?: React.ReactNode
	/** Pixel size; inline emoji match roughly 1em of body text. */
	size?: number
	className?: string
}

/**
 * Inline emoji substitute used inside translated rich text:
 *
 * ```tsx
 * translations.rich("about.facts.activities", {
 *   emoji: (chunks) => <Emoji>{chunks}</Emoji>,
 * })
 * ```
 *
 * Unknown characters fall back to the plain glyph (with a warning in
 * development) so a missing mapping never breaks a translation.
 */
export function Emoji({ children, size = 20, className }: EmojiProps) {
	const value = flattenChildren(children)
	const name = value ? emojiToIconName(value) : undefined

	if (!name) {
		if (process.env.NODE_ENV === "development" && value) {
			console.warn(`[emoji] No pixel icon mapping for "${value}". Add it to emojiToIcon in src/components/Emoji.tsx.`)
		}
		return <span className={className}>{children}</span>
	}

	return <PixelIcon name={name} size={size} className={className} />
}
