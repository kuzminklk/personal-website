# Open Graph and Telegram previews

## Problem

Link previews of the site were unreliable in Telegram (and mediocre in other
messengers): sometimes no image, sometimes a generic/broken card, and every page
and language shared the same preview. Two independent causes existed in the old
metadata:

1. **Relative Open Graph URLs.** The root layout had no `metadataBase`, and the
   `openGraph.images[0].url` / `twitter.images` values were relative paths rather
   than absolute URLs. Next.js cannot make those absolute, so the emitted HTML
   contained a relative `og:image` (or a `localhost` fallback). Telegram requires
   an absolute image URL, so it silently dropped the image.
2. **One generic image and one metadata object.** `generateMetadata` had no
   parameters and returned the same title, description, `og:url` (hardcoded with
   a trailing slash) and image for every page and language. The only asset was a
   single root-level social image (since removed) declared as **1200×640** — the
   file itself was 1200×630, so the declared height was wrong — with no
   `og:image:type`, `og:image:width`, `og:image:height` or `og:image:alt`. There
   was no per-page canonical, no `hreflang`, no `og:locale`, and the robot file
   pointed at the site root instead of `/sitemap.xml`.

Additional present-day cause to remember when testing: **Telegram caches link
previews per URL**. A fixed metadata bug can still look “unfixed” in a chat where
the old preview was cached.

## Goal / non-goals

- Goal: every page and every locale exposes a complete, absolute, valid Open
  Graph/Twitter card that Telegram, Facebook/VK, LinkedIn, X and search engines
  can consume.
- Goal: the preview image is on-brand, localized and correctly sized
  (1200×630 PNG) and the pipeline is reproducible without new dependencies.
- Goal: multilingual SEO is consistent: canonical, `hreflang`/`x-default`,
  `og:locale` + alternates, sitemap and JSON-LD all agree.
- Not in scope: per-page unique illustrations (one designed plate is
  parameterized by locale), A/B testing previews, or dynamic rendering at the
  edge. The OG image is a static generated asset.

## Behavior / fixes

### 1. Central URL config

[`src/data/search-engine-optimization.ts`](../../src/data/search-engine-optimization.ts)
owns the canonical origin, `absoluteUrl()` and the locale → OG locale map:

```ts
export const websiteURL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kuzminklk.vercel.app").replace(/\/$/, "")
export const siteName = "kuzminklk"
export function absoluteUrl(path: string) {
	return new URL(path, websiteURL).toString()
}
export function openGraphImagePath(locale: Locale) {
	return `/open-graph/${locale}.png`
}
export const openGraphLocales: Record<Locale, string> = {
	en: "en_US",
	ru: "ru_RU",
	be: "be_BY",
	pl: "pl_PL",
}
```

`NEXT_PUBLIC_SITE_URL` lets preview deployments advertise their real host; the
value is trailing-slash-normalized and never hardcoded in components.

### 2. `metadataBase` in the locale layout

[`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx) sets the base
that makes every relative metadata URL absolute:

```ts
return {
	metadataBase: new URL(websiteURL),
	title: { default: "kuzminklk", template: "%s | kuzminklk" },
	description: translations("description"),
	// authors, robots, openGraph defaults, twitter, verification, viewport…
}
```

It also provides site-wide defaults (title template, description, author,
publisher, keywords, robots/`googleBot` directives, `theme-color`s) and the
global JSON-LD `Person` + `WebSite` graph.

### 3. Per-page, per-locale metadata

Every page exports its own `generateMetadata` and delegates to
[`buildPageMetadata()`](../../src/data/metadata.ts):

```ts
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { locale } = await params
	return buildPageMetadata({ locale: locale as Locale, pathname: "/development", pageKey: "development" })
}
```

`buildPageMetadata` reads `metadata.pages.<pageKey>` from the current locale and
returns:

- `title`, `description`;
- `alternates.canonical` — absolute **localized** URL (e.g. `/ru/программирование`);
- `alternates.languages` — `en`, `ru`, `be`, `pl` and `x-default` → English;
- `openGraph.url` — the canonical URL, `siteName`, full title,
  `locale: openGraphLocales[locale]`, `alternateLocale` for the other three;
- `openGraph.images[0]` — **absolute** `/open-graph/{locale}.png` with
  `width: 1200`, `height: 630`, `type: "image/png"`, localized `alt`;
- `twitter.card = "summary_large_image"` with title, description and image.

Rendered example (English development page):

```html
<meta property="og:title" content="Development | kuzminklk" />
<meta
	property="og:description"
	content="Web interfaces, smart contracts and the technologies Daniel Cosmo works with."
/>
<meta property="og:url" content="https://kuzminklk.vercel.app/development" />
<meta property="og:site_name" content="kuzminklk" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://kuzminklk.vercel.app/open-graph/en.png" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta
	property="og:image:alt"
	content="Cream editorial plate with the pixel kuzminklk wordmark and a localized tagline"
/>
<meta property="og:locale:alternate" content="ru_RU" />
<meta property="og:locale:alternate" content="be_BY" />
<meta property="og:locale:alternate" content="pl_PL" />
<meta name="twitter:card" content="summary_large_image" />
```

### 4. Icons, robots and sitemap

- Icons use the App Router file conventions: `src/app/icon.svg` (16×16 pixel
  star) and `src/app/apple-icon.png` (180×180), instead of the previous
  metadata `icons` entry that pointed at a static SVG.
- [`src/app/robots.ts`](../../src/app/robots.ts) emits `Allow: /`, `Host` and
  `Sitemap: https://kuzminklk.vercel.app/sitemap.xml`.
- [`src/app/sitemap.ts`](../../src/app/sitemap.ts) moved out of `[locale]` and
  emits **28 URLs** (7 pages × 4 locales), each with `alternates.languages` for
  all four locales plus `x-default`, `changeFrequency: "monthly"` and priority
  `1` for About. URLs use the localized pathnames, not `/en/...`.
- `src/data/structured-data.ts` provides `Person`, `WebSite` and `ProfilePage`
  JSON-LD (the latter on About only) with `inLanguage` values matching the
  locales.

## Open Graph image generator

[`scripts/generate-og.mjs`](../../scripts/generate-og.mjs) is a self-contained Node
ESM script (Node ≥ 20 + Chrome/Chromium; no npm dependencies). It writes one
1200×630 PNG per locale to `public/open-graph/{locale}.png`.

### What it does

1. **Discovers locales** by parsing
   `src/i18n/routing.ts` (`locales = [...] as const`) and additionally probes
   `src/messages/{be,by,pl}.json`, so translations that exist before routing is
   wired still produce an image. Missing/empty descriptions fall back to English
   (routed locales are always rendered).
2. **Prepares the tagline** from `src/messages/{locale}.json` →
   `metadata.description`: strips markup, collapses whitespace, typographic
   apostrophes, truncates on a word boundary at ~132 characters with an ellipsis.
3. **Renders** [`scripts/og-template.html`](../../scripts/og-template.html), filling
   `{{LANG}}`, absolute `file://` font URLs (Amstelvar + three Pixelify subsets),
   `{{WORDMARK}}`, `{{TAGLINE}}`, `{{TAGLINE_SIZE_PX}}` and `{{LOCALE_CODE}}`.
4. **Two headless-Chrome passes**:
   - `--dump-dom` on `file://…/locale.html#audit` — the template shrinks the
     tagline between 56 px and 30 px until it fits its 1010 px column in at most
     two lines and reports the fitted size through `document.title`;
   - `--screenshot` with that size baked into the HTML, using
     `--headless=new --no-sandbox --disable-gpu --hide-scrollbars
--force-device-scale-factor=1 --window-size=1200,630
--virtual-time-budget=4000` for deterministic 1200×630 output.
5. **Validates**: PNG signature, exactly 1200×630, tagline still ≤ 2 lines, and
   warns when an asset exceeds the 400 KB soft target. Failures exit non-zero.
6. **Prints a summary** (locale, dimensions, size, fitted tagline size/lines,
   fallback marker and the tagline text).

### The plate

Cream paper `#f2ecdb`, ink `#050310`, sky kicker and marker accent, subtle
fractal grain, 64 px safe margins for Telegram cropping, print registration
ticks, a huge Pixelify Sans `kuzminklk` wordmark, an inverted pixel-star “OG”
stamp, and the localized tagline set in Amstelvar (max two lines). The footer HUD
shows `kuzminklk.vercel.app`, “Personal archive” and the locale code
(`EN`/`RU`/`BE`/`PL`). All fonts are embedded from the same self-hosted files the
site uses.

### Regenerate

```bash
# every locale → public/open-graph/{en,ru,be,pl}.png
node scripts/generate-og.mjs

# only some locales
node scripts/generate-og.mjs --only=en,ru
node scripts/generate-og.mjs --only=pl

# layout debugging: dump fitted size and element boxes, do not write PNGs
node scripts/generate-og.mjs --audit

# Chrome not on PATH:
CHROME_BIN=/path/to/google-chrome node scripts/generate-og.mjs
```

The generator never touches `src/messages/*.json`; regenerate the images after
changing a `metadata.description`. The generated PNGs are committed assets, so a
translation or design change needs a regenerated image in the same change.

## Telegram caching caveat

Telegram fetches a preview once per shared URL and caches it, often for a long
time. After deploying fixed metadata or a new PNG:

- the link already sent in a chat can keep the old (broken) preview;
- re-pasting the same URL may return the cached card.

Ways to force a refresh:

1. Send the URL to **[@WebpageBot](https://t.me/WebpageBot)** — it asks Telegram
   to drop the cached preview; then re-share the link (this is the standard
   Telegram-provided workflow).
2. Share the URL in a fresh chat or in **Saved Messages**, and on both desktop
   and mobile clients.
3. While iterating, share `https://kuzminklk.vercel.app/development?preview=2`
   (query-string cache busting) — but remember `og:url` still points at the clean
   canonical URL, so verify the tags with `curl`, not only with the preview.

Do not test with `http://localhost:3000`: Telegram’s servers cannot reach it, and
any `localhost`/relative `og:image` is exactly the bug this work fixed. For
preview deployments, set `NEXT_PUBLIC_SITE_URL` to the deployment host so the
absolute URLs are correct.

## Testing checklist

1. Regenerate assets and confirm the script output: four lines, `1200×630`,
   reasonable sizes, tagline ≤ 2 lines, no English fallback for routed locales.
2. Inspect a development page’s head:

   ```bash
   curl -s http://localhost:3000/development \
     | grep -oE '<meta (property|name)="(og|twitter)[^"]*"[^>]*>|<link rel="(canonical|alternate)"[^>]*>'
   ```

   All URLs must be `https://` absolute, not relative or `localhost`.

3. Repeat for all 7 pages × 4 locales. Check: canonical is the localized URL,
   `og:url` equals canonical, `hreflang` values are `en`, `ru`, `be`, `pl`,
   `x-default` (English), `og:locale` matches the map, alternates list the other
   three, `og:image` is the locale’s PNG with type/width/height/alt, Twitter card
   is `summary_large_image`.
4. Verify the PNGs independently:

   ```bash
   python3 -c "from PIL import Image; import sys; [print(p, Image.open(p).size, Image.open(p).format) for p in sys.argv[1:]]" \
     public/open-graph/*.png
   ```

5. Check `/sitemap.xml` (28 `<url>` entries, alternates, correct origin) and
   `/robots.txt` (`Sitemap: …/sitemap.xml`).
6. Send each locale URL (and one or two deep pages) in Telegram; confirm the large
   image, readable two-line tagline and safe margins at thumbnail size. Use
   @WebpageBot if a cached card refuses to update.
7. Spot-check Facebook Sharing Debugger / LinkedIn Post Inspector / X card
   validator if available — they report the same absolute-tag requirements.

## Acceptance criteria

- Every page × locale emits absolute `og:image` (1200×630, `image/png`, with
  width/height/alt/type), absolute `og:url`, canonical, reciprocal `hreflang`
  and `x-default`, `og:locale` + alternate locales and a Twitter large card.
- `public/open-graph/{en,ru,be,pl}.png` exist at exactly 1200×630 and are
  regenerable with one command without new dependencies.
- The four preview images are on-brand (paper/ink/sky/marker, pixel wordmark,
  localized tagline) and legible at Telegram thumbnail size.
- `/sitemap.xml` lists all 28 localized URLs with alternates; `/robots.txt`
  points to it.
- A link to any locale, newly shared in Telegram after refreshing the cache,
  shows the correct localized preview with the large image.

## Files

| File                                                                                              | Role                                                    |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| [`src/data/search-engine-optimization.ts`](../../src/data/search-engine-optimization.ts)          | origin, `absoluteUrl`, OG locale map, image path helper |
| [`src/data/metadata.ts`](../../src/data/metadata.ts)                                              | `buildPageMetadata` — canonical, hreflang, OG, Twitter  |
| [`src/app/[locale]/layout.tsx`](../../src/app/[locale]/layout.tsx)                                | `metadataBase`, site defaults, JSON-LD, viewport        |
| [`src/app/sitemap.ts`](../../src/app/sitemap.ts) / [`src/app/robots.ts`](../../src/app/robots.ts) | localized sitemap and robots                            |
| [`src/data/structured-data.ts`](../../src/data/structured-data.ts)                                | `Person`, `WebSite`, `ProfilePage` JSON-LD              |
| [`scripts/generate-og.mjs`](../../scripts/generate-og.mjs)                                        | OG render pipeline                                      |
| [`scripts/og-template.html`](../../scripts/og-template.html)                                      | 1200×630 plate template                                 |
| `public/open-graph/*.png`                                                                         | generated localized previews                            |
| `public/fonts/*.woff2`, `public/amstelvar.woff2`                                                  | fonts embedded in the plate                             |
