# Pixel emoji — custom icon system

## Problem

The old UI used raw operating-system emoji (`👋`, `👨🏻‍💻`, `📸`, …) inside
headings and body copy. Their appearance — and occasionally their presence —
depended on the visitor’s OS, browser and installed emoji font: Apple, Google,
Microsoft and Linux rendered different metaphors, sizes and colours. That broke
the editorial design, made headings inconsistent, and left an open to-do (“change
emoji appearance so it is the same between different operating systems”).

The translation files are a good place to keep emoji as _content_ (they are
pleasant to write, translate and read in JSON), but the rendered result must not
depend on the platform.

## Goal / non-goals

- Goal: every emoji that appears in the UI renders as the same hand-drawn pixel
  sprite on every device, matching the “observatory archive” art direction.
- Goal: icons adapt to light/dark themes and to inverted panels without extra
  assets, and add no runtime dependency or network request.
- Goal: adding a new emoji is a small, local data change; unknown emoji degrade
  gracefully instead of disappearing.
- Not in scope: full emoji coverage, user-provided emoji, animated emoji, or
  generating the sprites at build time. Icons are hand-drawn data.

## Behavior

### Rendering path

1. Translation strings keep emoji wrapped in an ICU rich tag:
   `<emoji>💪</emoji>` (see `src/messages/*.json`).
2. Pages render the string with `next-intl`’s `rich()` and map that tag to the
   component:

   ```tsx
   translations.rich("about.facts.activities", {
   	emoji: (chunks) => <Emoji>{chunks}</Emoji>,
   	sportsLink: (chunks) => <Link href="/sports">{chunks}</Link>,
   })
   ```

3. [`Emoji`](../../src/components/Emoji.tsx) flattens the React children (next-intl
   may pass an array), normalizes the character and resolves it to a sprite name.
4. [`PixelIcon`](../../src/components/PixelIcon.tsx) paints the 16×16 token grid as
   SVG rectangles with the sprite palette.

Because the sprite data is compiled into the page, the icon is visible before any
font/image loads and cannot be “missing” on a platform.

### Emoji → icon mapping

The mapping table lives in `emojiToIcon` in
[`src/components/Emoji.tsx`](../../src/components/Emoji.tsx) and covers 40 keys
pointing at the 34 sprites (several keys intentionally alias one sprite). It
includes arrows, faces, tools and objects used by translations, plus aliases:

```tsx
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
```

Normalization strips variation selectors (`U+FE0F`, `U+FE0E`) and skin-tone
modifiers (`U+1F3FB`–`U+1F3FF`) before lookup, so `🧘🏻`, `🧘` and `🧘️` all find
`meditation`; `👨🏻‍🔬` and `👨‍🔬` both find `scientist`.

### Fallback

If a character is not mapped, `Emoji` renders the original children in a plain
`<span>` (the OS emoji still shows) and, in development only, logs a warning
naming the missing character so the gap is noticed. A missing mapping never
breaks a translation or a build.

## The 16×16 token sprite system

Icon data is a 16-row × 16-character grid of one-character tokens
([`src/data/pixel-icons.ts`](../../src/data/pixel-icons.ts)):

```ts
export type PixelIcon = {
	/** 16 strings of exactly 16 chars. Tokens: "." transparent, "k" ink, "p" paper, "d" dim ink, "s" sky, "m" marker. */
	grid: readonly string[]
	label: string
}
```

| Token | Renders as                      | Purpose                                      |
| ----- | ------------------------------- | -------------------------------------------- |
| `k`   | `currentColor`                  | main ink silhouette — inverts with the theme |
| `d`   | `currentColor` at 45 % opacity  | secondary ink detail                         |
| `s`   | `var(--sky)`                    | light-blue annotation accent                 |
| `m`   | `var(--marker)`                 | muted bookish yellow accent                  |
| `p`   | nothing (surface shows through) | paper / negative-space cut-outs              |
| `.`   | nothing                         | transparent background                       |

`PixelGlyph` merges horizontal runs of the same token into one `<rect>`, so a
typical icon is a few dozen rectangles rather than 256. The SVG uses
`viewBox="0 0 16 16"`, `shapeRendering="crispEdges"` and the global
`.pixel-icon` class (`image-rendering: pixelated; display: inline-block`).
`k` and `d` use `currentColor`, which means one sprite works on paper, on an
inverted `.panel` and in dark mode. `p`/`.` are deliberately unpainted so the
same icon looks right inside inverted chips as well.

`PixelIcon` is decorative by default (`aria-hidden="true"`) because icons sit next
to text; pass `label` only when an icon stands alone. Default size is 20 px
(sprites scale crisply at 14–48 px).

The same renderer powers the small UI glyphs in
[`Glyphs.tsx`](../../src/components/Glyphs.tsx): brand star, sun/moon, up-right and
down arrows, check, close, menu, play and pause.

## Add a new icon or emoji

1. **Draw the sprite** — add the name to the `PixelIconName` union and a
   `pixelIcons` entry in [`src/data/pixel-icons.ts`](../../src/data/pixel-icons.ts).
   Every grid must contain exactly 16 strings of exactly 16 characters; keep a
   1 px margin, bold silhouettes, and use `s`/`m` sparingly.
2. **Map the emoji** (if translations use one) — add
   `"🦊": "fox"` to `emojiToIcon` in
   [`src/components/Emoji.tsx`](../../src/components/Emoji.tsx). Include aliases for
   common variants only if they normalize to the same character; skin tones and
   variation selectors are already stripped.
3. **Use it**:
   - in TSX: `<PixelIcon name="fox" size={20} />` or
     `<PixelIcon name="fox" label="Fox" />` when standalone;
   - in a translation: wrap the same emoji in `<emoji>🦊</emoji>` and keep the
     `emoji: (chunks) => <Emoji>{chunks}</Emoji>` mapping in the page’s `rich()`
     call.
4. **Verify**: `pnpm exec tsc --noEmit`, `pnpm lint`, then look at the icon at
   16/32/64 px in both themes (browser zoom or a quick sprite preview page).

Do not replace icons with raw emoji in a page or put emoji directly into JSX:
that re-introduces the platform dependency the system exists to remove.

## Pixel-art image assets

Besides SVG icons, the site uses a small set of generated bitmap pixel-art
assets. They are produced by
[`scripts/generate-pixel-assets.py`](../../scripts/generate-pixel-assets.py) from
real photographs and project screenshots, so the pixel look stays consistent and
reproducible. The script depends only on **Pillow**.

### How it works

- **Portrait** (`public/me.jpg` → `public/me-pixel-light.png`,
  `public/me-pixel-dark.png`, 512×512): crop head/shoulders, grayscale,
  autocontrast (cutoff 1), contrast ×1.18, downscale to a 128×128 pixel grid, then
  **4-tone ordered dithering with a Bayer 8×8 matrix** using the light and dark
  palettes. The result is upscaled ×4 with nearest-neighbour, keeping the pixels
  sharp and print-like. The About page swaps the light/dark plate with the theme
  and reveals the real photo on hover.
- **Project thumbnails** (`src/assets/projects/*-desktop.*` →
  `src/assets/projects/*-pixel.webp`): flatten transparency onto paper, downscale
  to 96 px wide, quantize to 14 adaptive colours with Floyd–Steinberg dithering,
  then upscale ×10 with nearest-neighbour (“chunky” screenshot previews used
  behind the real screenshot in `ProjectCard`).
- **Apple touch icon** (`src/app/apple-icon.png`, 180×180): cream four-point star
  on ink, drawn with `ImageDraw.polygon`.

### Regenerate

```bash
python3 -m pip install Pillow   # once
python3 scripts/generate-pixel-assets.py
```

The script writes `public/me-pixel-light.png`, `public/me-pixel-dark.png`,
`src/assets/projects/*-pixel.webp` and `src/app/apple-icon.png`. Re-run it when
the source portrait or a project screenshot changes, and commit the regenerated
binaries together with the source. Web assets are already optimized (the
portraits are ~6 KB and each project thumbnail 4–14 KB).

Do not hand-edit the generated bitmaps; they are derived artifacts. The hand-drawn
SVG sprites, by contrast, are source files.

## Acceptance criteria

- No raw OS emoji remains visible in the rendered UI (translation emoji are
  always wrapped in `<emoji>` and rendered as `svg.pixel-icon`); an unknown emoji
  still renders readable text.
- Every sprite is exactly 16×16 tokens, renders crisply at 14–48 px, and looks
  correct on light paper, dark ink and inverted panels.
- Theme-aware tokens (`k`, `d`, `s`, `m`) invert automatically; no duplicate
  light/dark sprite sets are needed.
- Instructions for adding an icon require only data + one mapping entry, and the
  fallback path never breaks a page.
- `python3 scripts/generate-pixel-assets.py` reproduces the committed bitmap
  assets (same file paths and sizes) from the repository sources.
