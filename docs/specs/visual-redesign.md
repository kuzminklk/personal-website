# Visual redesign — “observatory archive”

## Problem

The Next.js implementation was functional but visually unfinished: every section
was a plain stack of `h2` + paragraphs, headings were prefixed with raw operating
system emoji, the header/footer were minimal, and the two known to-dos were open
(Open Graph previews looked broken in Telegram and emoji rendered differently on
every OS). There was also no consistent page identity: each page started
differently, some pages had no `h1`, and the navigation gave little sense of the
site’s structure.

## Goal / non-goals

- Goal: give the site one coherent editorial identity that works in light and
  dark mode, feels like a personal archive/observatory, and is consistent across
  all seven sections and four languages.
- Goal: keep the existing content, translations, URLs (except the new locales),
  Next.js stack, performance budget and zero extra runtime dependencies.
- Goal: replace platform-dependent emoji with an on-brand, deterministic icon
  system.
- Not in scope: changing the content structure, adding a CMS, animation
  libraries, or a component library. The site still has no standalone landing
  page — About is the home page.

## Behavior

### Global shell

- **Header**: sticky, blurred paper background, pixel wordmark with a pixel star,
  numbered section links, compact language switcher and theme toggle. Below
  1280 px the links fold into a full-screen menu (dialog, Escape/scroll lock,
  focus moves in, focus returns to the trigger).
- **Footer**: inverted ink panel — note, “made by” signature, section index with
  icons, off-site links, oversized pixel wordmark, © year, `MINSK · UTC+3` and a
  back-to-top link.
- **Theme**: follows the OS by default; the toggle stores an explicit light/dark
  choice in `localStorage` and applies it before first paint, so there is no
  flash of the wrong theme. The optional visible label in the mobile menu uses
  translated theme names (Light/Dark, Светлая/Тёмная, …).
- **Home redirect**: `/` (and `/ru`, `/be`, `/pl`) permanently redirects to the
  localized About page with a 308, preserving the locale. `next.config.ts` no
  longer hardcodes `/` → `/about` because that lost the language.
- **Grain**: a subtle fixed noise layer sits above the page but under no
  interactions (`pointer-events: none`).

### What changed per page

| Page         | Route                         | Redesign                                                                                                                                                                                                                                                                                                                                                    |
| ------------ | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| About (home) | `/about` (and `/` → redirect) | “Dossier” hero: kicker 00, oversized split `h1`, role line, translated skill-tag label, scroll cue, engraved star chart behind a portrait that is pixel art by default and the real photograph on hover. A numbered “Dossier” section (heading translated via `about.dossier`) presents aliases, languages and activities; a pixel divider closes the page. |
| Development  | `/development`                | `PageHeader` 02, two-column intro, ten numbered skill groups, project grid with `ProjectCard` (pixelated screenshot resolving into the real one on hover/focus).                                                                                                                                                                                            |
| Photography  | `/photography`                | `PageHeader` 03, three-column photo grid with portrait tiles spanning two rows, hover index numbers, accessible lightbox, closing Unsplash/Telegram links.                                                                                                                                                                                                  |
| Sports       | `/sports`                     | `PageHeader` 04, two-column intro, five framed `WorkoutVideo` clips with numbered plates and pixel play/pause controls, closing Tik-Tok link.                                                                                                                                                                                                               |
| Books        | `/books`                      | `PageHeader` 05, framed and labelled `NotionEmbed` database plate with an “Open in Notion” fallback.                                                                                                                                                                                                                                                        |
| Writings     | `/writings`                   | `PageHeader` 06, same framed Notion plate treatment for the essays database.                                                                                                                                                                                                                                                                                |
| Connect      | `/connect`                    | `PageHeader` 07, three list sections (Messaging, Social Media, Creation) with per-row pixel icons and separator hairlines.                                                                                                                                                                                                                                  |

### Page identity details

- Every section page starts with `PageHeader` (`index`, `kicker`, `h1`, lede,
  metadata chips, pixel icon); nested sections use `SectionHeader` (two-digit
  number, icon, `h2`, optional aside such as `“6 entries”`).
- Index numbers follow navigation order: 02 development, 03 photography,
  04 sports, 05 books, 06 writings, 07 connect; About is 00/01.
- Mobile layouts stack to one column at 730 px; the project grid, photo grid and
  video grid collapse gracefully; long Russian/Belarusian/Polish labels no longer
  overflow because the desktop nav is hidden below 1280 px. `PageHeader` titles
  additionally wrap (`overflow-wrap: anywhere`, `hyphens: auto`) with smaller
  size steps at 730 px and 400 px, so long localized words cannot push the page
  sideways.

### Interaction and motion

- CSS-only entrance animation on direct `<main>` children (staggered rise).
- Hover/focus states on cards, links, buttons and the wordmark star.
- Lightbox and mobile menu manage focus, keyboard input and page scroll lock.
- `prefers-reduced-motion: reduce` removes entrance/transition motion and smooth
  scrolling; workout videos do not autoplay.

## Design notes

- **Direction**: editorial “observatory archive” — cream paper `#f2ecdb`, ink
  `#050310`, light blue `#9fb9d9` (text-safe variant `#3d618c`), muted marker
  `#d9c978`, pixel accents, pixel-art icons, subtle grain.
- **Modules touched**: all `src/app/[locale]/*` page files and their
  `page.module.css`, `globals.css`, `src/components/*` (Header, Footer, new
  PageHeader/SectionHeader/ProjectCard/PhotoGallery/WorkoutVideo/NotionEmbed/
  PixelIcon/Emoji/Glyphs/Ornaments/ThemeToggle/LanguageSwitcher modules), and
  data modules `src/data/{pixel-icons,metadata,search-engine-optimization,
structured-data,skills,projects}.ts`.
- **Type**: the existing Amstelvar variable serif remains the display/body face;
  Pixelify Sans (self-hosted pixel font) and Red Hat Mono/Noto Sans Mono complete
  the system. Details in the [design system](../design-system.md).
- **Constraints**: no new runtime dependencies, no bitmap UI assets (only the
  generated pixel-art images for the portrait, project thumbnails and app icon),
  and every string stays translatable through `next-intl`.
- Old implementation details replaced in this branch: `<span className="emoji">`
  in headings, per-page ad-hoc `<h1>`/`<h2>` markup, plain Notion iframes without
  frames/titles, and the previous single-column project/photo lists.

## Acceptance criteria

- All seven section pages share the same header/footer/PageHeader rhythm, have
  exactly one `h1`, and render correctly at 320, 390, 768, 1024, 1280 and
  1440 px in both themes.
- No raw OS emoji appear in the rendered UI; every translated emoji renders as a
  pixel SVG (`svg.pixel-icon`), and unknown emoji fall back to readable text.
- `/` and the default-locale prefix redirect to the localized About page; the
  chosen language survives the redirect.
- Theme toggle switches instantly, persists across reloads and does not flash on
  load; its mobile-menu label uses translated theme names; system dark mode
  works without an explicit choice.
- Mobile menu opens/closes with mouse, keyboard and Escape, locks background
  scroll and returns focus to the trigger.
- Lightbox opens from every tile, supports ←, → and Escape, traps Tab focus,
  restores focus and locks page scroll.
- Workout videos are delivered as compressed 540×960 H.264 MP4s with no audio
  track and fast-start (~9.6 MB total for five clips); they autoplay only in
  view, pause off-screen, can be toggled, and do not autoplay with reduced
  motion.
- No horizontal overflow at any tested width; no clipped text or overlapping
  elements; links, buttons and external links keep accessible names.
- `pnpm lint`, `pnpm exec tsc --noEmit` and `pnpm build` pass.
