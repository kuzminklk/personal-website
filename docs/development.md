# Development

Setup, verification, asset generation and the project map for the Next.js
implementation of kuzminklk’s personal website.

## Requirements

- **Node.js ≥ 20** and **pnpm** (the repository is a pnpm project; `package.json`
  scripts are the source of truth).
- **Python 3 + Pillow** — only for regenerating the pixel-art bitmap assets.
- **Google Chrome / Chromium** — only for regenerating the Open Graph images and
  for headless screenshot QA. Set `CHROME_BIN` if it is not on `PATH`.
- No database, API keys or external services are required to run the site; the
  Notion embeds are public iframes.

## Local setup

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

`/` redirects to the localized About page (`/about`, `/ru/обо-мне`, …), so use
`http://localhost:3000/about` (or the localized URLs) while developing.

Production build and server:

```bash
pnpm build
pnpm start      # serves the built app on http://localhost:3000
```

Environment variables:

| Variable               | Purpose                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | canonical origin used in metadata, OG URLs and structured data; defaults to `https://kuzminklk.vercel.app` for production and preview deployments |

## Verification

Run these before opening a pull request (and after changing metadata, routing,
components or messages):

```bash
pnpm lint                 # ESLint 9 flat config (eslint-config-next)
pnpm typecheck            # tsc --noEmit
pnpm build                # production build + prerender of all locales
pnpm format               # prettier --write .
```

Notes:

- `pnpm lint` runs `eslint` with no arguments (ESLint 9 lints the project
  directory). Warnings do not fail the command by default; read them.
- `pnpm typecheck` is `tsc --noEmit`; TypeScript is configured with `strict:
true` and `incremental: true`, so `tsconfig.tsbuildinfo` is a generated file
  and must not be committed.
- `next.config.ts` no longer ignores build-time TypeScript errors (the old
  `ignoreBuildErrors` flag was removed), so a type error fails `pnpm build`.
- `pnpm build` writes `.next/`, which is git-ignored. If a production server is
  already running from `.next`, build in a separate worktree/copy or accept the
  restart.
- `pnpm format` is also enforced on commit: Husky runs `lint-staged`, which runs
  `prettier --write` on staged `js/jsx/ts/tsx/json/css/md` files.

## Regenerate the Open Graph images

The localized 1200×630 previews are generated, committed assets. Regenerate them
after changing a `metadata.description` or the OG template:

```bash
pnpm og                              # node scripts/generate-og.mjs, all locales
pnpm og -- --only=en,ru              # only selected locales
node scripts/generate-og.mjs --audit # layout report only, no PNGs
CHROME_BIN=/path/to/chrome pnpm og   # Chrome not on PATH
```

The script needs Google Chrome/Chromium; it validates that every output is a
1200×630 PNG, that the localized tagline fits two lines, and warns above the
400 KB target. Output: `public/open-graph/{en,ru,be,pl}.png`. See
[Open Graph and Telegram previews](specs/open-graph-telegram.md) for the full
pipeline and the Telegram cache caveat.

## Regenerate the pixel-art bitmap assets

The portrait plates, project thumbnails and Apple touch icon are derived images:

```bash
python3 -m pip install Pillow   # once
pnpm pixel-assets               # python3 scripts/generate-pixel-assets.py
```

Inputs: `public/me.jpg` and `src/assets/projects/*-desktop.{png,jpg}`.
Outputs: `public/me-pixel-light.png`, `public/me-pixel-dark.png`,
`src/assets/projects/*-pixel.webp`, `src/app/apple-icon.png`. Commit the source
and the regenerated binaries together. The hand-drawn SVG icon sprites do not
need this step — see [pixel emoji](specs/pixel-emoji.md).

## Workout video assets

The five clips in `public/videos/` are delivered as H.264 MP4s at **540×960**
(9:16), with **no audio track** and a **fast-start** layout (`moov` before `mdat`),
**~9.6 MB total**. Each clip has a matching `*-blurred.webp` poster shown before
playback, and `WorkoutVideo` supplies the labelled play/pause control and
viewport-aware autoplay. When replacing a clip, keep the same encoding profile
and the poster pair in sync; the small, silent, progressive files are what keep
the Sports page light and let the muted preview start quickly.

## Headless-Chrome screenshot QA

There is no committed end-to-end test suite; the redesign was verified with
headless Chrome screenshots and a metadata crawl against the running production
server. Screenshot QA is useful for theme, responsive, overflow and clipping
regressions.

Quick single screenshot (light theme, system appearance):

```bash
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --window-size=1440,1600 --virtual-time-budget=4000 \
  --screenshot=/tmp/about-light.png http://localhost:3000/about
```

Repeat for every page (`/about`, `/development`, `/photography`, `/sports`,
`/books`, `/writings`, `/connect`) and viewport width (the QA pass used **320,
390, 768, 1024 and 1440 px**), then inspect the PNGs visually.

For the **dark theme**, full-page captures, or interactive states (open mobile
menu, open photo lightbox) the CLI flag set is not enough: launch Chrome with
`--remote-debugging-port` and drive it through the Chrome DevTools Protocol from
a small Node script (no dependency needed). The pattern is:

1. `Emulation.setDeviceMetricsOverride` — viewport size, `deviceScaleFactor: 1`,
   `mobile: true` below 800 px;
2. `Emulation.setEmulatedMedia` with
   `{ name: "prefers-color-scheme", value: "dark" }` — OS dark mode without
   touching `localStorage`;
3. `Page.navigate`, then `Runtime.evaluate` with `document.fonts.ready` and a
   short settle delay (fonts and the grain layer must be painted);
4. optionally `Runtime.evaluate` to click a selector/button (menu, photo tile)
   before the capture;
5. `Page.captureScreenshot` → write the base64 result to a file.

The temporary QA scripts used for this branch live outside the repository (in
`/tmp`); if screenshot QA becomes routine, promote one to `scripts/` and document
it here. Record the Chrome version with any QA artifacts
(`google-chrome --version`).

Metadata-only checks are cheaper and can run with `curl` against the production
server; see the checklist in
[Open Graph and Telegram previews](specs/open-graph-telegram.md#testing-checklist).

## Project structure

```text
.
├── docs/                        # this documentation set
│   ├── design-system.md
│   ├── development.md
│   ├── decisions/               # ADRs (+ _template.md)
│   └── specs/                   # feature specs (+ _template.md)
├── public/
│   ├── fonts/                   # Pixelify Sans subsets + OFL.txt
│   ├── open-graph/              # generated localized 1200×630 PNGs
│   ├── videos/                  # compressed workout mp4 (540×960) + blurred webp posters
│   ├── amstelvar.woff2          # variable serif
│   ├── me.jpg                   # source portrait
│   └── me-pixel-{light,dark}.png
├── scripts/
│   ├── generate-og.mjs          # localized OG image generator (Node + Chrome)
│   ├── og-template.html         # 1200×630 plate template
│   └── generate-pixel-assets.py # Pillow pipeline for pixel bitmaps
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── globals.css      # design tokens, reset, typography, motion
│   │   │   ├── layout.tsx       # fonts, metadataBase, theme script, Header/Footer
│   │   │   ├── page.tsx         # home → localized /about redirect
│   │   │   ├── about/           # 7 section pages, each page.tsx + page.module.css
│   │   │   ├── development/
│   │   │   ├── photography/
│   │   │   ├── sports/
│   │   │   ├── books/
│   │   │   ├── writings/
│   │   │   └── connect/
│   │   ├── icon.svg             # favicon (file convention)
│   │   ├── apple-icon.png       # 180×180 touch icon (generated)
│   │   ├── robots.ts
│   │   └── sitemap.ts           # 28 localized URLs with hreflang alternates
│   ├── assets/                  # photos/ and projects/ sources (+ pixel thumbnails)
│   ├── components/              # Header, Footer, PageHeader, SectionHeader,
│   │                            # ProjectCard, PhotoGallery, WorkoutVideo,
│   │                            # NotionEmbed, PixelIcon, Emoji, Glyphs, Ornaments,
│   │                            # ThemeToggle, LanguageSwitcher (+ *.module.css)
│   ├── data/                    # metadata, SEO, structured data, projects, photos,
│   │                            # skills, pixel-icons
│   ├── i18n/                    # routing.ts, navigation.ts, request.ts
│   ├── messages/                # en.json, ru.json, be.json, pl.json
│   └── proxy.ts                 # next-intl middleware
├── next.config.ts               # next-intl plugin, React Compiler
├── eslint.config.mjs
├── tsconfig.json
└── package.json                 # scripts, lint-staged, husky prepare
```

## Branch workflow

- **`main`** is production-ready and deploys to Vercel.
- **`typescript-next`** is the long-running Next.js + TypeScript implementation;
  this documentation describes that line of work.
- **`typescript-next-deepseek`** is the branch for this iteration: visual
  redesign, pixel icon system, four locales, Open Graph/Telegram and
  multilingual SEO. It is cut from `typescript-next`; `typescript-next-codex`
  and `typescript-next-copilot` are earlier AI-assistant experiments.
- Work on a branch, keep the tree formatted, run the verification commands above,
  then open a pull request. Never commit `.next/`, `tsconfig.tsbuildinfo` or
  generated binaries that are not produced by the documented scripts.
- Commits run `lint-staged` (Prettier) through Husky; do not bypass hooks with
  `--no-verify`.

## Troubleshooting

| Symptom                                       | Likely cause / fix                                                                                                                                 |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Telegram preview is still the old/broken card | preview cache — refresh with [@WebpageBot](https://t.me/WebpageBot), re-share, see [OG spec](specs/open-graph-telegram.md#telegram-caching-caveat) |
| `og:image` is `localhost` or relative         | `metadataBase`/`NEXT_PUBLIC_SITE_URL` not set in the environment that rendered the page                                                            |
| OG regeneration fails                         | Chrome/Chromium missing from `PATH` (set `CHROME_BIN`) or fonts under `public/` were renamed                                                       |
| Notion iframe is blank                        | tracker blocker/offline; the “Open in Notion” link is the intended fallback                                                                        |
| `pnpm build` fails on TypeScript              | `next.config.ts` no longer ignores type errors — fix the type error instead of re-enabling `ignoreBuildErrors`                                     |
| Cyrillic monospace looks wrong                | `html[lang="ru"]`/`<html lang="be">` must be present; Noto Sans Mono is loaded in the locale layout                                                |
| Port 3000 already in use                      | stop the other server or run `pnpm dev -- --port 3001`                                                                                             |
