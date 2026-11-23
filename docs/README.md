# Documentation

Documentation for Daniel Cosmo’s (kuzminklk) personal website — a Next.js 16
App Router project with next-intl, four locales and a custom pixel-art design
system. Start here; each document links to the source files it describes.

## Index

| Document                                                              | Description                                                                                                                |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [Design system](design-system.md)                                     | Palette and theme tokens, three typefaces, typography/layout/spacing, grain, component inventory, motion, accessibility.   |
| [Development](development.md)                                         | Local setup, verification commands, OG/pixel asset regeneration, screenshot QA, project structure and branch workflow.     |
| [Visual redesign](specs/visual-redesign.md)                           | Why and how the “observatory archive” redesign was done, page-by-page behaviour and acceptance criteria.                   |
| [Open Graph & Telegram](specs/open-graph-telegram.md)                 | Root cause of broken Telegram previews, the metadata fixes, the 1200×630 generator, regeneration and testing checklist.    |
| [Pixel emoji](specs/pixel-emoji.md)                                   | Why OS emoji were replaced, the 16×16 token sprite system, emoji mapping, fallbacks and the bitmap asset pipeline.         |
| [Internationalization](specs/i18n-locales.md)                         | Supported locales, localized pathnames, `localePrefix`, hreflang/OG locale, fonts per script, adding a locale/translation. |
| [ADR 0001 — locale code `be`](decisions/0001-locale-code-be.md)       | Why Belarusian uses ISO `be` instead of `by`.                                                                              |
| [ADR 0002 — custom pixel icons](decisions/0002-custom-pixel-icons.md) | Why the project draws its own 16×16 SVG sprites instead of using emoji or an icon library.                                 |

## How these docs are organized

- **`specs/`** — feature specifications: the problem, goals/non-goals, behaviour,
  design notes and acceptance criteria. New specs start from
  [`specs/_template.md`](specs/_template.md).
- **`decisions/`** — short architecture decision records (context, decision,
  alternatives, consequences). New ADRs start from
  [`decisions/_template.md`](decisions/_template.md) and are numbered
  sequentially (`0003-…`).
- **`design-system.md`**, **`development.md`** — cross-cutting references that
  every change should respect.

Keep the documentation in sync with the code in the same change that modifies the
implementation: paths, command names and generated asset names are the most
common things to drift. Every command in these docs reflects this repository’s
actual `package.json` scripts and configuration; re-check them when scripts or
paths change.
