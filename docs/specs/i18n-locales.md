# Internationalization — four locales

## Problem

The site originally shipped only English and Russian, with a half-finished
Belarusian file named `by.json` (an empty `{}`). The non-standard `by` code is
not a valid BCP 47 / ISO 639-1 language tag: it looks like a country code and is
ignored by search engines and assistive technologies. There were also no
localized pathnames for the new languages, no `hreflang`, no localized metadata
and a sitemap that emitted default-locale URLs with an `/en` prefix.

## Goal / non-goals

- Goal: fully translated English, Russian, Belarusian and Polish websites with
  human-readable localized URLs, valid language tags and consistent multilingual
  SEO.
- Goal: language switching keeps the visitor on the same page, is crawlable and
  survives future visits.
- Not in scope: RTL support, automatic machine translation, per-locale content
  that diverges structurally (all locales share the same page set and message
  keys), or a UI language selector for languages without translations.

## Supported locales

| Locale | Language   | Native name | URL prefix     | OG locale | Notes                            |
| ------ | ---------- | ----------- | -------------- | --------- | -------------------------------- |
| `en`   | English    | English     | none (default) | `en_US`   | default locale, `x-default`      |
| `ru`   | Russian    | Русский     | `/ru`          | `ru_RU`   | Cyrillic URLs                    |
| `be`   | Belarusian | Беларуская  | `/be`          | `be_BY`   | ISO 639-1 `be`, not `by`         |
| `pl`   | Polish     | Polski      | `/pl`          | `pl_PL`   | ASCII slugs, Latin Extended font |

The single source of truth is
[`src/i18n/routing.ts`](../../src/i18n/routing.ts) (`locales`, `defaultLocale`,
`localeOptions`, `pathnames`, `pageEntries`). `Locale` and `AppPathname` are
derived from it, so adding an entry there propagates types to metadata, sitemap
and the switcher.

### Why `be`, not `by`

ISO 639-1 assigns `be` to Belarusian; `by` is the ISO 3166 country code for
Belarus, not a language. Using `be` makes `<html lang="be">`, `hreflang="be"`,
`og:locale="be_BY"` and the URL prefix `/be/...` valid for crawlers and screen
readers. The decision and its consequences are recorded in
[ADR 0001](../decisions/0001-locale-code-be.md).

## Localized pathnames

Every page has a translated, human-readable URL in all four languages. Slavic
URLs use native scripts (percent-encoded on the wire), Polish uses ASCII slugs to
keep links short and copyable.

| Page        | `en`           | `ru`                 | `be`             | `pl`             |
| ----------- | -------------- | -------------------- | ---------------- | ---------------- |
| About       | `/about`       | `/обо-мне`           | `/пра-мяне`      | `/o-mnie`        |
| Development | `/development` | `/программирование`  | `/праграмаванне` | `/programowanie` |
| Photography | `/photography` | `/фотографии`        | `/фатаграфіі`    | `/fotografia`    |
| Sports      | `/sports`      | `/спорт`             | `/спорт`         | `/sport`         |
| Books       | `/books`       | `/книги`             | `/кнігі`         | `/ksiazki`       |
| Writings    | `/writings`    | `/сочинения`         | `/творы`         | `/teksty`        |
| Connect     | `/connect`     | `/связаться-со-мной` | `/звязацца`      | `/kontakt`       |

Examples: `/` → `/about`, `/ru/обо-мне`, `/be/пра-мяне`,
`/pl/programowanie`; the default locale is never prefixed. The pages themselves
use the internal keys (`"/about"`, `"/development"`, …) and `Link`/`getPathname`
translate them per locale.

## How routing works

- **Config**: `defineRouting({ locales, defaultLocale: "en", localePrefix:
"as-needed", pathnames })` in `src/i18n/routing.ts`.
- **`localePrefix: "as-needed"`** means the default locale has no prefix and all
  other locales do. Consequences, verified against the running server:
  - `/` → `308` → localized `/about` (the locale is preserved; middleware sets
    the `NEXT_LOCALE` cookie);
  - `/en` → `307` → `/` (the default prefix is removed);
  - `/ru/about` → `307` → `/ru/обо-мне` (localized slug is canonical);
  - `/be` → `308` → `/be/пра-мяне`;
  - `/ru/обо-мне` → `200`.
- **Middleware**: [`src/proxy.ts`](../../src/proxy.ts) is
  `createMiddleware(routing)` with a matcher that skips `api`, `trpc`, `_next`,
  `_vercel` and files with an extension.
- **Request config**: [`src/i18n/request.ts`](../../src/i18n/request.ts) reads the
  locale from `next/root-params` in Next.js 16, validates it with
  `hasLocale(routing.locales, …)` (404 otherwise) and dynamically imports
  `src/messages/{locale}.json`.
- **Navigation**: [`src/i18n/navigation.ts`](../../src/i18n/navigation.ts) exposes
  the locale-aware `Link`, `redirect`, `usePathname`, `useRouter` and
  `getPathname` created by `createNavigation(routing)`. Internal page links import
  `Link` from `@/i18n/navigation`; the language switcher is the deliberate
  exception (it builds every localized href itself with `getPathname`).
- **Home**: the site has no landing page. `src/app/[locale]/page.tsx` calls
  `permanentRedirect(getPathname({ href: "/about", locale }))`, so `/`, `/ru`,
  `/be` and `/pl` all land on the localized About page.
- **Static parameters**: the locale layout exports `generateStaticParams()` from
  `routing.locales`, so all four locales are prerendered.

## Language switcher

[`LanguageSwitcher`](../../src/components/LanguageSwitcher.tsx) shows EN / RU / BE /
PL with native names (`localeOptions`) and two variants: `compact` in the header,
`full` in the mobile menu (with the check glyph and names).

- It renders **real links**, not buttons, so language versions are crawlable,
  middle-clickable and work without JavaScript.
- Hrefs come from `getPathname({ href: pathname, locale })`, so switching keeps
  the current page and maps it to the target locale’s canonical slug.
- Every link carries `lang` and `hrefLang`; the active language has
  `aria-current="true"` (and a check icon in the full variant).
- On click it writes the `NEXT_LOCALE` cookie
  (`path=/; max-age=31536000; samesite=lax`), so later visits to unprefixed URLs
  keep the chosen language; failures to set cookies (private mode) are ignored
  because the navigation itself still works.
- Language names are never translated — a language is always written in its own
  language.

## SEO and metadata per locale

- **`<html lang>`** is the current locale (`layout.tsx` renders
  `<html lang={locale} dir="ltr">`).
- **Canonical** for each page is the absolute localized URL
  (`buildPageMetadata`, see [Open Graph](open-graph-telegram.md)).
- **`hreflang`**: each page emits `<link rel="alternate">` for `en`, `ru`, `be`,
  `pl` plus `x-default` (English). Links are reciprocal: every alternate points
  at the same page in the corresponding locale.
- **Sitemap** ([`src/app/sitemap.ts`](../../src/app/sitemap.ts)): 7 pages × 4
  locales = **28 URLs**, each with `alternates.languages` for all four locales
  and `x-default`. It uses localized pathnames; `/en/...` never appears.
- **Robots** ([`src/app/robots.ts`](../../src/app/robots.ts)) points at
  `/sitemap.xml`.
- **Open Graph**: `og:locale` comes from `openGraphLocales`
  (`en_US`, `ru_RU`, `be_BY`, `pl_PL`) and `og:locale:alternate` lists the other
  three; the preview image is localized (`/open-graph/{locale}.png`).
- **JSON-LD**: `WebSite.inLanguage` lists all locales; the About page’s
  `ProfilePage.inLanguage` is the current locale.
- **Metadata texts**: titles and descriptions live under
  `metadata.pages.<page>.title/description` in each message file; the root
  fallbacks (`metadata.title`, `metadata.description`) are localized too.
- **UI labels**: theme names (`ThemeToggle.light`/`dark`, also used by the
  toggle’s visible label), the About skill-tags label
  (`about.hero.tagsLabel`) and the Dossier heading (`about.dossier`) are message
  keys like any other; all four files currently share **162** leaf keys.

## Fonts per script

- **Amstelvar** (display/body) covers Latin and Cyrillic; it is used for all
  locales.
- **Pixelify Sans** ships three self-hosted subsets: latin (English/Polish
  base), latin-ext (Polish diacritics) and cyrillic (Russian/Belarusian).
- **Monospace**: Red Hat Mono has no Cyrillic, so
  `html[lang="ru"], html[lang="be"]` reorder `--font-mono` to put Noto Sans Mono
  (cyrillic/latin/latin-ext) first. Latin locales keep Red Hat Mono first.

A new locale in a script not covered above needs a new subset file, an
`@font-face` block with `unicode-range` in `globals.css`, and the same font in
the OG generator’s `fontURLs()`.

## Add a new locale

1. **Routing** — add the code to `locales` in `src/i18n/routing.ts`, add the
   translated pathname to every page in `pathnames`, and add an entry to
   `localeOptions` (short label + native name).
2. **Messages** — create `src/messages/{locale}.json` with the exact same
   structure/order as `en.json` (all 162 leaf keys at the time of writing), ICU
   rich-text tags, emoji and brand names preserved.
3. **OG locale** — add the language/territory code to `openGraphLocales` in
   `src/data/search-engine-optimization.ts` (typed `Record<Locale, string>`, so
   TypeScript enforces it).
4. **Fonts** — confirm Pixelify Sans covers the script; add a subset and
   `@font-face`/`--font-mono` handling if it does not.
5. **Preview images** — `node scripts/generate-og.mjs` (it reads `locales` from
   routing automatically) and verify the new PNG is 1200×630 and the tagline
   fits two lines.
6. **Verify** — `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`; then check
   `/sitemap.xml` (now 5 × 7 URLs), the `hreflang` links, the switcher, the
   `og:locale`, and that `/xx` redirects to the localized home.

No middleware or layout changes are required: `src/proxy.ts`,
`generateStaticParams`, the switcher, sitemap and metadata all derive from
`routing.ts`.

## Add or change a translation

- Edit **all four** message files, not one. Keep keys in the same order and never
  rename or translate ICU tag names (`<strong>`, `<emphasize>`, `<emoji>`,
  `<sportsLink>`, `<notionBooksDatabaseLink>`, …).
- Keep `<emoji>…</emoji>` content as the same emoji as the English source — it is
  replaced by a pixel sprite at render time (see [pixel emoji](pixel-emoji.md)).
- Keep proper names, URLs, `Web3`/`AI`, technology names and the e-mail
  unchanged.
- ICU plural/selection syntax must stay valid; interpolations such as
  `{current} / {total}` keep the same placeholder names in every locale.
- Update `metadata.pages.*` too — descriptions feed both SEO and the OG tagline.

### Translation parity validation

There is no committed parity script yet; the temporary audit used a small Node
check. Run this before committing a translation change (it exits non-zero on a
missing/extra key and prints the diff):

```bash
node - <<'EOF'
const fs = require("fs")
const locales = ["en", "ru", "be", "pl"]
const flatten = (value, prefix = "") =>
  Object.entries(value).flatMap(([key, child]) =>
    child && typeof child === "object" ? flatten(child, `${prefix}${key}.`) : [`${prefix}${key}`],
  )
const keys = Object.fromEntries(
  locales.map((locale) => [locale, new Set(flatten(JSON.parse(fs.readFileSync(`src/messages/${locale}.json`, "utf8"))))]),
)
let failed = false
for (const locale of locales.slice(1)) {
  const missing = [...keys.en].filter((key) => !keys[locale].has(key))
  const extra = [...keys[locale]].filter((key) => !keys.en.has(key))
  if (missing.length || extra.length) {
    failed = true
    console.error(`${locale}: missing ${missing.length}, extra ${extra.length}`, { missing, extra })
  }
}
console.log(failed ? "✖ translation key parity failed" : `✓ ${locales.length} locales share ${keys.en.size} keys`)
process.exitCode = failed ? 1 : 0
EOF
```

Also check that rich-text tag names per string match the English source (the QA
audit’s temporary scripts did this); an unmapped or malformed rich-text tag makes
`next-intl` throw at render time.

## Acceptance criteria

- Exactly the four locales `en`, `ru`, `be`, `pl` are routable; all seven pages
  exist in each, with localized slugs and absolute canonical URLs.
- `<html lang>` matches the locale; `hreflang` + `x-default` links are absolute,
  reciprocal and present on every page; the sitemap contains 28 correct URLs.
- `/` redirects to the localized About page and the language survives; `/en`
  redirects to the unprefixed URL; `/ru/about` redirects to `/ru/обо-мне`.
- The switcher links to canonical localized URLs, works without JavaScript,
  exposes `lang`/`hrefLang`/`aria-current`, and persists via `NEXT_LOCALE`.
- Cyrillic monospace text uses Noto Sans Mono; Polish diacritics use the
  latin-ext pixel subset; nothing falls back to a missing glyph.
- All four message files pass the key-parity check and keep ICU tags intact.
