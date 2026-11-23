### Goal

Daniel Cosmo's (also known as kuzminklk or “Даниил Кузьмин”) personal website. Contains sections about development, photography, sports, books and social media links. Aims to show variety of person's interests and offer an opportunity for cooperation

The site has seven sections (About/home, Development, Photography, Sports, Books, Writings, Connect), each in four locales (English, Russian, Belarusian, Polish), with a custom editorial “observatory archive” design and pixel-art icon system.

### Stack

Programming language: JavaScript → TypeScript  
Environment: Node.js → pnpm  
Framework: React → Next.js 16 (app router, “/src” directory, React Compiler enabled)  
Internationalization: next-intl 4 (locales `en`, `ru`, `be`, `pl`; `localePrefix: "as-needed"`; localized pathnames)  
Markup languages: HTML, CSS (CSS Modules + global design tokens)  
Design: light/dark theme via `<html data-theme>`, Amstelvar variable serif, self-hosted Pixelify Sans pixel font, monospace Red Hat Mono/Noto Sans Mono, custom 16×16 SVG pixel icon sprites, subtle grain overlay  
Search Engine and Social Media Optimization: per-page metadata via `buildPageMetadata`, localized 1200×630 Open Graph images, Twitter cards, hreflang + x-default, localized sitemap, JSON-LD  
Formatting: “.editorconfig”, “.vscode/…”, Prettier, Husky, lint-staged  
Linting: ESLint, TypeScript checks  
Version Control: Git, GitHub

### Commands

- Development server: `pnpm dev`
- Production build: `pnpm build`
- Production server: `pnpm start`
- Lint: `pnpm lint` (ESLint 9 flat config)
- Type check: `pnpm typecheck` (equivalent to `pnpm exec tsc --noEmit`)
- Format code: `pnpm format` (`prettier --write .`)
- Regenerate localized Open Graph images: `pnpm og` (or `node scripts/generate-og.mjs --only=en,ru`; requires Chrome/Chromium, `CHROME_BIN` if not on PATH)
- Regenerate pixel-art bitmap assets: `pnpm pixel-assets` (requires Python 3 + Pillow)
- Before committing: `pnpm lint`, `pnpm typecheck`, `pnpm build`

### Conventions

- **Stay on the Next.js stack.** Do not add a new dependency (runtime or build) without a concrete reason; scripts are deliberately zero-dependency (Node built-ins + Chrome, Pillow for bitmaps).
- **Use design tokens, not raw hex.** Colors, fonts, spacing and motion come from CSS custom properties in `src/app/[locale]/globals.css`. Raw hex is only acceptable where tokens cannot reach: the palette definition, the theme-independent lightbox surface in `PhotoGallery.module.css`, the `theme-color` meta values in `layout.tsx`/`ThemeToggle.tsx`, the standalone OG template and `icon.svg`.
- **Never hardcode raw emoji in TSX.** Use `PixelIcon` for sprites, `Glyphs` for UI glyphs, and `<Emoji>` + `<emoji>…</emoji>` ICU tags for translation content. Sprite data lives in `src/data/pixel-icons.ts` (16×16 token grids: `.` transparent, `k` ink, `d` dim ink, `p` paper, `s` sky, `m` marker); the emoji mapping lives in `src/components/Emoji.tsx`.
- **Translations stay in parity.** Keep identical key sets/order across `src/messages/{en,ru,be,pl}.json`, preserve ICU rich-text tags, emoji characters, brand names and URLs. Descriptions under `metadata.pages.*` feed both SEO and the OG tagline.
- **Localized navigation only.** Import `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `@/i18n/navigation` for internal page links. (`LanguageSwitcher` deliberately renders raw `next/link` anchors because it builds every href itself with `getPathname`.) Page keys and icons are defined once in `pageEntries` (`src/i18n/routing.ts`) and reused by header, footer and sitemap.
- **Per-page metadata is generated.** Every page exports `generateMetadata` and calls `buildPageMetadata({ locale, pathname, pageKey })`; never hand-write canonical, OG or hreflang tags. A new page also needs its internal path + four localized slugs in `routing.pathnames`, an entry in `pageEntries`, and text under `metadata.pages.*` in all four message files.
- **Server components by default.** Add `"use client"` only where state/DOM is required (Header, PhotoGallery, WorkoutVideo, ThemeToggle, LanguageSwitcher). Keep motion CSS-first and honour `prefers-reduced-motion`; videos must not autoplay with reduced motion.
- **Accessibility is part of done:** one `h1` per page, labelled landmarks/dialogs, decorative icons `aria-hidden`, focus management for the menu/lightbox, translated alt text, external links with `rel="noopener noreferrer"`.
- **Comments explain why, not what.** Use the existing section-comment style in CSS (`/* ——— Section ——— */`) and short JSDoc for exported components/helpers. Keep files organized by feature.
- **Documentation changes belong in the same change.** Update `docs/`, `README.md` and this file whenever behavior, commands, paths or design tokens change. Start new specs/ADRs from `docs/specs/_template.md` and `docs/decisions/_template.md`.
- Run `pnpm format` before committing; Husky + lint-staged run Prettier on staged files.

### File map

```text
docs/                      # documentation (README index, design system, development, specs/, decisions/)
public/                    # fonts/, open-graph/*.png, videos/ (compressed mp4 + posters), portrait assets
scripts/
  generate-og.mjs          # localized 1200×630 Open Graph generator
  og-template.html         # OG plate template
  generate-pixel-assets.py # Pillow pipeline: pixel portrait, project thumbnails, apple icon
src/app/
  [locale]/globals.css     # design tokens, reset, typography, layout helpers, motion
  [locale]/layout.tsx      # fonts, metadataBase, theme init script, Header/Footer, JSON-LD
  [locale]/page.tsx        # home → localized /about redirect
  [locale]/<section>/      # page.tsx + page.module.css for about, development, photography,
                           # sports, books, writings, connect
  icon.svg, apple-icon.png # favicon/touch icon (file conventions)
  robots.ts, sitemap.ts    # robots + 28 localized URLs with hreflang alternates
src/components/            # Header, Footer, PageHeader, SectionHeader, ProjectCard, PhotoGallery,
                           # WorkoutVideo, NotionEmbed, PixelIcon, Emoji, Glyphs, Ornaments,
                           # ThemeToggle, LanguageSwitcher (+ *.module.css)
src/data/                  # metadata, search-engine-optimization, structured-data, projects,
                           # photos, skills, pixel-icons
src/i18n/                  # routing.ts, navigation.ts, request.ts
src/messages/              # en.json, ru.json, be.json, pl.json
src/proxy.ts               # next-intl middleware
```
