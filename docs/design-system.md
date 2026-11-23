# Design system — “observatory archive”

The visual language of the site is an editorial “observatory archive”: warm book
paper, deep blue-black ink, a light-blue annotation accent, muted marker yellow,
pixel-art details and three carefully chosen typefaces.

Everything is driven by CSS custom properties in
[`src/app/[locale]/globals.css`](../src/app/[locale]/globals.css); component
styles live next to their components in `*.module.css` files and only consume
semantic tokens, never raw hex values (the deliberate exceptions are documented
in [Rules for contributors](#rules-for-contributors)).

## Typefaces

| Role                    | Family                                | Loading                                                              | Weights / axes                                  | Where it is used                                              |
| ----------------------- | ------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| Display and body serif  | **Amstelvar** (variable)              | `next/font/local` from `public/amstelvar.woff2` (`--font-amstelvar`) | weight + width variable; `font-stretch` 75–90 % | headings, running copy, mobile-menu links                     |
| Pixel accent            | **Pixelify Sans**                     | self-hosted `@font-face` in `globals.css`, three `woff2` files       | 400–700                                         | wordmark, section indices, utility `.pixel`, small HUD labels |
| Monospace UI / metadata | **Red Hat Mono** + **Noto Sans Mono** | `next/font/google` (`--font-red-hat-mono`, `--font-noto-sans-mono`)  | 400, 500                                        | `.micro` labels, tags, links inside copy, buttons, captions   |

Pixelify Sans is self-hosted on purpose so the site and the Open Graph generator
always render the same pixels. Three subsets are registered with `unicode-range`:

- `public/fonts/pixelify-sans-latin.woff2` — Latin, digits, punctuation;
- `public/fonts/pixelify-sans-latin-ext.woff2` — Latin Extended (Polish);
- `public/fonts/pixelify-sans-cyrillic.woff2` — Cyrillic (Russian, Belarusian).

The font is licensed under the SIL Open Font License; the license text ships in
`public/fonts/OFL.txt`. Do not rename the files without updating the `@font-face`
blocks in `globals.css` and the `fontURLs()` map in
[`scripts/generate-og.mjs`](../scripts/generate-og.mjs).

Red Hat Mono carries Latin monospace text; because it has no Cyrillic, the
`--font-mono` stack is reordered for Russian and Belarusian:

```css
html[lang="ru"],
html[lang="be"] {
	--font-mono: var(--font-noto-sans-mono), var(--font-red-hat-mono), ui-monospace, "Courier New", monospace;
}
```

## Palette

Two raw palettes (light paper / dark ink) are declared once, then mapped onto
semantic tokens. Components always use the semantic names.

### Raw tokens

| Light token           | Value       | Dark token           | Value       |
| --------------------- | ----------- | -------------------- | ----------- |
| `--light-paper`       | `#f2ecdb`   | `--dark-paper`       | `#050310`   |
| `--light-paper-soft`  | `#e9e2cf`   | `--dark-paper-soft`  | `#0a0818`   |
| `--light-surface`     | `#f8f4e8`   | `--dark-surface`     | `#0e0b1e`   |
| `--light-ink`         | `#050310`   | `--dark-ink`         | `#f2ecdb`   |
| `--light-ink-soft`    | `#56505f`   | `--dark-ink-soft`    | `#a7a0b4`   |
| `--light-line`        | `#0503102e` | `--dark-line`        | `#f2ecdb2e` |
| `--light-line-strong` | `#05031070` | `--dark-line-strong` | `#f2ecdb70` |
| `--light-sky`         | `#9fb9d9`   | `--dark-sky`         | `#a9c6ea`   |
| `--light-sky-text`    | `#3d618c`   | `--dark-sky-text`    | `#b9d4f4`   |
| `--light-marker`      | `#d9c978`   | `--dark-marker`      | `#e2d18a`   |

### Semantic tokens

| Token           | Light                 | Dark                 | Meaning                                          |
| --------------- | --------------------- | -------------------- | ------------------------------------------------ |
| `--bg`          | `--light-paper`       | `--dark-paper`       | page background                                  |
| `--bg-soft`     | `--light-paper-soft`  | `--dark-paper-soft`  | secondary background, framed plates              |
| `--surface`     | `--light-surface`     | `--dark-surface`     | cards, embeds, image frames                      |
| `--text`        | `--light-ink`         | `--dark-ink`         | primary text; also the inverted-panel background |
| `--text-soft`   | `--light-ink-soft`    | `--dark-ink-soft`    | metadata, captions, inactive navigation          |
| `--line`        | `--light-line`        | `--dark-line`        | hairline rules and borders                       |
| `--line-strong` | `--light-line-strong` | `--dark-line-strong` | interactive borders, emphasis rules              |
| `--sky`         | `--light-sky`         | `--dark-sky`         | light-blue accent fills (pixel icons, HUD)       |
| `--sky-text`    | `--light-sky-text`    | `--dark-sky-text`    | accessible accent **text** and links             |
| `--marker`      | `--light-marker`      | `--dark-marker`      | marker-pen highlight, pixel accents              |

Legacy aliases are kept for older modules and third-party embeds:
`--primary-color`, `--secondary-color`, `--accent-color`, `--primary-font`,
`--secondary-font`.

### Theme resolution

There is no React theme context: the source of truth is the `<html>` element.

1. Default: light palette.
2. No explicit choice + `prefers-color-scheme: dark` → dark palette
   (`:root:not([data-theme])`).
3. Explicit choice: `:root[data-theme="light"]` / `:root[data-theme="dark"]`.

The saved choice lives in `localStorage.theme`. An inline script in
[`src/app/[locale]/layout.tsx`](../src/app/[locale]/layout.tsx) applies it before
first paint, which is why the layout sets `suppressHydrationWarning` on `<html>`.
[`ThemeToggle`](../src/components/ThemeToggle.tsx) writes both the DOM attribute
and `localStorage`, and uses `useSyncExternalStore` to read the browser state
safely during SSR.

`viewport` metadata emits `color-scheme: "light dark"` and two `theme-color`
values (`#f2ecdb` light, `#050310` dark), so mobile browser chrome matches the
paper. Both the inline script and the toggle keep every `meta[name="theme-color"]`
in sync when the visitor overrides the OS preference.

## Typography

The root font size scales gently with the viewport:
`font-size: clamp(1rem, 0.94rem + 0.25vw, 1.125rem)`; line height `1.5`.

| Element / class | Size                                                  | Other properties                                                                |
| --------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `h1`            | `clamp(2.75rem, 1.5rem + 5.2vw, 6rem)`                | uppercase, `font-stretch: 75%`, weight 500, line-height 0.94, tracking −0.025em |
| `h2`            | `clamp(1.5rem, 1.2rem + 1vw, 2.1rem)`                 | `font-stretch: 82%`, weight 550, line-height 1.05                               |
| `h3`            | `1.2rem`                                              | `font-stretch: 90%`, weight 550, line-height 1.2                                |
| `p`             | inherits                                              | `max-width: 68ch`, line-height 1.55, `text-wrap: pretty`                        |
| `small`         | `0.8125rem`                                           |                                                                                 |
| `.micro`        | `0.6875rem` mono                                      | uppercase, letter-spacing 0.14em, `--text-soft`                                 |
| `.pixel`        | inherits (used at `0.625rem`–`1.15rem` in components) | Pixelify Sans, uppercase, `font-synthesis: none`                                |
| `.tag`          | `0.6875rem` mono                                      | bordered chip, uppercase, 0.08em tracking                                       |

Headings use `text-wrap: balance`; italic body text switches Amstelvar’s slant
axis (`font-variation-settings: "slnt" -6`).

Useful utilities defined in `globals.css`:

| Class              | Purpose                                                 |
| ------------------ | ------------------------------------------------------- |
| `.container`       | centred column constrained to `--content-max`           |
| `.rule`            | 1 px hairline spanning the content column               |
| `.micro`           | tiny uppercase mono HUD label                           |
| `.pixel`           | Pixelify Sans label                                     |
| `.sky`             | accessible accent text colour                           |
| `.marker`          | marker-pen underline/highlight gradient                 |
| `.tag`             | bordered uppercase chip                                 |
| `.panel`           | inverted cream-on-ink panel (`background: var(--text)`) |
| `.pixel-icon`      | inline-block pixel SVG, `image-rendering: pixelated`    |
| `.pixel-divider`   | hairline rule with space for a centred glyph            |
| `.skip-link`       | visually hidden until focused “Skip to content” link    |
| `.visually-hidden` | screen-reader-only text                                 |

## Layout and spacing

All layout values are tokens on `:root`:

| Token                   | Value                            | Use                                     |
| ----------------------- | -------------------------------- | --------------------------------------- |
| `--page-padding-inline` | `clamp(1.25rem, 5vw, 4.5rem)`    | page gutters                            |
| `--content-max`         | `78rem`                          | maximum content column                  |
| `--header-height`       | `4.25rem` (`3.75rem` ≤ 730 px)   | sticky header height and scroll padding |
| `--section-gap`         | `clamp(4rem, 8vw, 7.5rem)`       | vertical rhythm between page sections   |
| `--radius`              | `2px`                            | almost-square editorial corners         |
| `--ease-out`            | `cubic-bezier(0.16, 1, 0.3, 1)`  | entrance motion                         |
| `--ease-in-out`         | `cubic-bezier(0.65, 0, 0.35, 1)` | symmetric motion                        |

`<main>` supplies the page frame:

```css
main {
	padding-top: calc(var(--header-height) + clamp(2.5rem, 6vw, 5rem));
	padding-bottom: clamp(5rem, 10vw, 9rem);
	padding-inline: var(--page-padding-inline);
}
```

Page-level blocks then centre themselves with
`max-width: var(--content-max); margin-inline: auto;`. Breakpoints are simple
`max-width: 730px` (mobile) and `max-width: 1279px` (navigation collapses into the
full-screen menu); the header’s “personal archive” meta appears from `1280px`,
numbered nav items from `1500px`, and the footer grid collapses at `980px` and
`560px`.

Section titles get one more guard: `PageHeader`’s `.title` uses
`overflow-wrap: anywhere` and `hyphens: auto` in its base style, then a smaller
`clamp()` at 730 px and a further size reduction (plus tighter tracking) at
400 px, so long localized words such as Russian “Программирование” break inside
the column instead of forcing horizontal scroll.

## Grain overlay

A fixed fractal-noise layer is painted with `body::after`; it is decorative,
non-interactive and almost invisible:

```css
body::after {
	content: "";
	position: fixed;
	inset: 0;
	z-index: 1000;
	pointer-events: none;
	opacity: 0.055;
	mix-blend-mode: multiply;
	background-image: url("data:image/svg+xml,…feTurbulence…");
}
```

In dark mode the blend mode becomes `screen` and opacity drops to `0.035`, so the
noise reads as faint star dust instead of paper grain. The layer must never
receive pointer events or it would block the whole page.

## Icons and ornaments

### Pixel sprite system

Every pictogram is data, not an image font or an external icon library. The
sprite types live in [`src/data/pixel-icons.ts`](../src/data/pixel-icons.ts):

```ts
export type PixelIcon = {
	/** 16 strings of exactly 16 chars. Tokens: "." transparent, "k" ink, "p" paper, "d" dim ink, "s" sky, "m" marker. */
	grid: readonly string[]
	label: string
}
```

| Token | Painted as                          | Themed?             |
| ----- | ----------------------------------- | ------------------- |
| `k`   | `currentColor`                      | yes — inherits text |
| `d`   | `currentColor` at 45 % opacity      | yes                 |
| `s`   | `var(--sky)`                        | yes                 |
| `m`   | `var(--marker)`                     | yes                 |
| `p`   | not painted (surface shows through) | yes — panel-aware   |
| `.`   | transparent                         | —                   |

[`PixelIcon`](../src/components/PixelIcon.tsx) converts each row into merged
`<rect>` runs inside a `16×16` `viewBox`, renders it with
`shapeRendering="crispEdges"` and `image-rendering: pixelated`, and defaults to
`aria-hidden` because icons almost always sit next to a text label. Pass
`label` only for standalone icons. Because `k`/`d` use `currentColor`, the same
sprite is correct on paper, on inverted ink panels and in dark mode without a
second asset.

[`Glyphs.tsx`](../src/components/Glyphs.tsx) contains the small UI glyphs built
on the same grid (`PixelStar`, `PixelSun`, `PixelMoon`, `PixelArrowUpRight`,
`PixelArrowDown`, `PixelCheck`, `PixelClose`, `PixelMenu`, `PixelPlay`,
`PixelPause`). `Emoji` maps translation emoji to sprites — see
[pixel-emoji](specs/pixel-emoji.md).

### Ornaments

[`Ornaments.tsx`](../src/components/Ornaments.tsx) draws decorative SVG from
primitives (no image requests): `StarChart` (engraved star plate behind the About
portrait), `PixelDivider` (hairline + star) and `CornerTicks` (four L-shaped
registration marks for a “technical plate” look). All are `aria-hidden`.

## Component inventory

| Component                                                     | Type   | Responsibilities and notable behaviour                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`Header`](../src/components/Header.tsx)                      | client | Sticky header: star + pixel wordmark, numbered section navigation (numbers only ≥ 1500 px), language switcher (desktop), theme toggle, full-screen menu below 1280 px. Menu is a `role="dialog"` rendered only while open; Escape closes it and returns focus to the trigger; page scroll is locked. |
| [`Footer`](../src/components/Footer.tsx)                      | server | Inverted “colophon” panel: note, signatures, section index with pixel icons, off-site links, giant pixel wordmark, © year and `MINSK · UTC+3` metadata, back-to-top link.                                                                                                                            |
| [`PageHeader`](../src/components/PageHeader.tsx)              | server | Shared page intro: HUD line (`index`, `kicker`, hairline, icon), oversized `h1`, optional lede and metadata chips. Used on every section page.                                                                                                                                                       |
| [`SectionHeader`](../src/components/SectionHeader.tsx)        | server | `h2` with two-digit index, pixel icon, optional aside (counts or labels) over a strong hairline.                                                                                                                                                                                                     |
| [`ProjectCard`](../src/components/ProjectCard.tsx)            | server | Project entry: pixelated screenshot on top, real desktop/mobile screenshot revealed on hover/focus; links to deployment and GitHub with external-link glyphs. Screens ≤ 730 px get the real (mobile) screenshot instead.                                                                             |
| [`PhotoGallery`](../src/components/PhotoGallery.tsx)          | client | Masonry-like photo grid (portrait tiles span two rows). Accessible lightbox rendered through a portal: ←/→/Escape, arrow buttons, focus trap, scroll lock and focus restoration to the opened tile.                                                                                                  |
| [`WorkoutVideo`](../src/components/WorkoutVideo.tsx)          | client | Muted, looping, inline workout clip delivered as a compressed 540×960 H.264 MP4 (no audio track, fast-start). Autoplays only while in the viewport (`IntersectionObserver`, 35 % threshold), pauses off-screen, has a labelled pixel play/pause button and never autoplays with reduced motion.      |
| [`NotionEmbed`](../src/components/NotionEmbed.tsx)            | server | Framed, labelled Notion database iframe plus an “Open in Notion” fallback link. The iframe is intentionally not sandboxed (Notion needs scripts/storage); it has a `title` and `loading="lazy"`.                                                                                                     |
| [`PixelIcon`](../src/components/PixelIcon.tsx) / `PixelGlyph` | server | Renders 16×16 token grids as crisp SVG rectangles; shared by sprite icons and UI glyphs.                                                                                                                                                                                                             |
| [`Emoji`](../src/components/Emoji.tsx)                        | server | Replaces translation emoji with pixel sprites at render time; unknown emoji fall back to the plain character.                                                                                                                                                                                        |
| [`ThemeToggle`](../src/components/ThemeToggle.tsx)            | client | Sun/moon pixel toggle; persists explicit theme; updates `data-theme`, `localStorage` and notifies other toggles via a custom event. The optional visible label (mobile menu) uses translated theme names (`ThemeToggle.light`/`dark`); `aria-label`/`title` use the switch-to-* strings.             |
| [`LanguageSwitcher`](../src/components/LanguageSwitcher.tsx)  | client | Real links to the same page in EN/RU/BE/PL; `hrefLang`, `lang`, native names; active check glyph in the full variant; writes the `NEXT_LOCALE` cookie on click. `compact` (header) and `full` (mobile menu) variants.                                                                                |
| [`Ornaments`](../src/components/Ornaments.tsx)                | server | `StarChart`, `PixelDivider`, `CornerTicks` decorative SVGs.                                                                                                                                                                                                                                          |
| [`Glyphs`](../src/components/Glyphs.tsx)                      | server | Small pixel UI glyphs (star, sun/moon, arrows, check, close, menu, play, pause).                                                                                                                                                                                                                     |

Section indices in `PageHeader` follow the navigation order: development `02`,
photography `03`, sports `04`, books `05`, writings `06`, connect `07`. About is
the home page and uses its own hero (`index 00`) plus a Dossier section (`01`);
the Dossier heading (`about.dossier`) and the hero skill-tags label
(`about.hero.tagsLabel`) are translated.

## Motion

Motion is restrained and CSS-first:

| Effect                 | Definition                                                                                                            |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Page entrance          | `rise` keyframes (opacity + 14 px translate) on `main > *`, 0.6 s `--ease-out`; first five children stagger by 0.07 s |
| Mobile menu            | `menu-in` keyframes (fade + 8 px slide), 200 ms `--ease-out`                                                          |
| Lightbox               | `fade-in`, 160 ms linear                                                                                              |
| Theme / colour changes | 180 ms linear background/colour transition on `body`, 120 ms on links and controls                                    |
| Wordmark star          | 90° rotation on brand hover, 220 ms `--ease-out`                                                                      |
| Scroll cue             | `cue` keyframes on the About page                                                                                     |

`prefers-reduced-motion: reduce` disables all of it globally:

```css
@media (prefers-reduced-motion: reduce) {
	html {
		scroll-behavior: auto;
	}
	*,
	*::before,
	*::after {
		animation-duration: 0.001ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.001ms !important;
	}
}
```

`WorkoutVideo` additionally reads the media query in JavaScript and skips
autoplay/observation, leaving the manual play button available.

## Accessibility notes

- **Skip link**: the layout renders a translated “Skip to content” link that
  targets `#main`; every page starts with `<main id="main">`. `<body id="top">` is
  the back-to-top target.
- **Focus**: one visible focus style, `outline: 2px solid var(--sky-text)` with
  3 px offset. Hover/focus states also change colour and borders, not only
  movement.
- **Landmarks and names**: `header`, `main`, `footer`; every `<nav>` has an
  `aria-label`; the active navigation item has `aria-current="page"` (language
  switcher: `aria-current="true"`); the About skill-tag list has a translated
  `aria-label` (`about.hero.tagsLabel`).
- **Headings**: exactly one `h1` per page (page title); section headings are
  `h2` with machine-readable indexes. Decorative numbers are `aria-hidden`.
- **Icons**: decorative by default (`aria-hidden="true"`); a `label` prop turns
  the SVG into `role="img"` with a `<title>` for standalone use.
- **Dialogs**: the mobile menu is `role="dialog" aria-modal="true"` with
  `aria-expanded`/`aria-controls` on the trigger, Escape handling, initial focus
  and background scroll lock; while it is open, `<main>` and `<footer>` are made
  `inert` so Tab stays inside the header controls and the menu, and the panel
  exists in the DOM only while open. The photo lightbox adds a full Tab focus
  trap, labelled close/previous/next buttons, a polite live counter and focus
  restoration.
- **Forms of media**: images use `alt` from translations; pixel thumbnails and
  the hover portrait photo are `aria-hidden`; the video is muted with
  `playsInline` and a labelled control; the Notion iframe has a `title`.
- **External links** open with `target="_blank"` and
  `rel="noopener noreferrer"`.
- **Colour contrast** (computed from the raw palette, WCAG AA needs 4.5:1 for
  body text): light ink on paper **17.33:1**, soft ink on paper **6.57:1**, sky
  link text on paper **5.41:1**; dark ink on paper **17.33:1**, soft ink
  **8.11:1**, sky link text **13.42:1**; ink on marker **12.25:1**. The footer’s
  inverted metadata line (`.bottom :global(.micro)`) uses a 62 % `--bg` mix and
  measures **6.72:1** on the ink footer (light theme) and **5.60:1** on the cream
  footer (dark theme). All key text pairs pass AA, most pass AAA.
- **Reduced motion**: see [Motion](#motion). Motion is CSS-first; the only
  JavaScript motion logic is the video visibility observer and the lightbox
  focus handling. No JavaScript animation library is installed.

## Theming checklist

When adding UI:

1. Use semantic tokens (`var(--bg)`, `var(--text)`, `var(--sky-text)`, …).
   Never hardcode palette hex in component CSS.
2. Prefer existing utilities (`.micro`, `.tag`, `.pixel`, `.rule`, `.panel`)
   before inventing new ones.
3. Use `data-*` attributes for component state (`data-active`, `data-theme`,
   `data-scrolled`) instead of extra classes where practical.
4. New pictograms go through the sprite system (`PixelIcon` / `Glyphs`), not raw
   emoji or icon images.
5. Check both themes and `prefers-reduced-motion`; mobile first at 320–730 px.

## Rules for contributors

- **Tokens over hex.** Raw hex values are allowed only outside CSS-token scope:
  the palette definition itself, the deliberately theme-independent lightbox
  surface in [`PhotoGallery.module.css`](../src/components/PhotoGallery.module.css)
  (the overlay stays ink-on-cream in both themes), the `theme-color` meta values
  in [`layout.tsx`](../src/app/[locale]/layout.tsx) and
  [`ThemeToggle.tsx`](../src/components/ThemeToggle.tsx) (HTML meta content cannot
  read a CSS variable), the standalone OG template, and the static `icon.svg`
  favicon.
- **Fonts are fixed.** Amstelvar + Pixelify Sans + Red Hat Mono/Noto Sans Mono
  are the three typefaces. A new script (not just a new language) needs new
  subset files and `@font-face`/`unicode-range` updates.
- **16×16 for icons.** Keep the one-pixel margin, bold silhouettes and restrained
  `s`/`m` accents; validate every grid row is exactly 16 characters.
- **Motion is CSS unless it depends on visibility or user intent.** Only the
  video component uses JS motion logic, and it honours reduced motion.
