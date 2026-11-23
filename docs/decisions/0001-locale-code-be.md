# Locale code `be` for Belarusian (not `by`)

## Context

The site was adding Belarusian as a third language next to English and Russian.
The old repository already had a placeholder message file named
`src/messages/by.json` (an empty `{}`), apparently following the informal habit of
writing “BY” for Belarus. Locale codes are not only URL prefixes: they appear in
`<html lang>`, `hreflang` alternates, `og:locale`, the sitemap and `Accept-Language`
negotiation. Search engines and assistive technologies expect a valid BCP 47
language tag, and `by` is the ISO 3166 country code — not an ISO 639 language
code.

## Decision

Use the ISO 639-1 language code **`be`** everywhere: `locales = ["en", "ru", "be",
"pl"]`, URLs under `/be/...`, `<html lang="be">`, `hreflang="be"`, and
`og:locale: be_BY`. The language switcher shows the short label `BE` and the
native name `Беларуская`. The empty `by.json` placeholder was deleted and replaced
by a full `be.json`; for one transition period the OG generator still probes a
legacy `by.json` if it exists, but it is not routed.

## Alternatives

- **Keep `by` for continuity** — invalid BCP 47 tag; breaks/ignores hreflang and
  `lang` semantics, confuses tooling (some libraries interpret `by` as a country
  or reject it), and mixes language and territory namespaces.
- **Use `be-BY` as the application locale** — technically a valid tag, but
  next-intl locales are language-level codes here (`en`, `ru`, `pl` are not
  regional either); it would make URLs `/be-BY/...`, complicate the pathname
  table and the switcher for no gain. Territory is expressed where it belongs,
  in `og:locale` (`be_BY`).
- **Use `be_by`/`by_BY`** — non-standard casing and/or the wrong language subtag;
  same problems as `by`.

## Consequences

- All emitted language tags are valid; `hreflang`/`og:locale`/`html lang` are
  machine-readable and consistent.
- The localized URL space is `/be/пра-мяне`, `/be/спорт`, … and the sitemap
  advertises those URLs.
- Anyone with an old `/by/...` link (there were no routed Belarusian pages before
  this branch, only the empty message file) would not be redirected; the locale
  simply did not exist publicly, so no migration is required.
- Future locale additions should follow the same rule: ISO 639-1 language codes
  for routing, language_TERRITORY pairs only in `openGraphLocales`.
