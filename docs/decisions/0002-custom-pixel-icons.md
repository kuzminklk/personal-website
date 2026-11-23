# Hand-drawn 16×16 pixel icons instead of OS emoji

## Context

The UI used raw operating-system emoji in headings and body copy. Depending on
the visitor’s platform (Apple, Google, Microsoft, Linux distributions) the same
character rendered as a different metaphor, in a different style, size and
colour — or was missing entirely. This conflicted with the editorial “observatory
archive” art direction, made headings inconsistent and left the project with an
open to-do: “change emoji appearance so it is the same between different
operating systems”. The redesign needed a deterministic, themeable pictogram
system that fits the pixel-art direction and adds no runtime cost.

## Decision

Draw a custom set of **34 hand-drawn 16×16 pixel sprites** as typed data
(`src/data/pixel-icons.ts`) and render them as crisp SVG rectangles
(`PixelIcon`/`PixelGlyph`). Sprites use a six-token language (`.` transparent,
`k` ink, `d` dim ink, `p` paper, `s` sky, `m` marker) where `k`/`d` are
`currentColor` and `s`/`m` are theme variables, so one sprite works in light
mode, dark mode and inverted panels.

Translation files keep emoji as readable content inside ICU `<emoji>` tags;
`Emoji` normalizes variation selectors/skin tones and maps each character to a
sprite at render time. Unknown emoji fall back to the original glyph (with a
development warning) instead of breaking a translation. The same grid language
also powers the small UI glyphs (star, sun/moon, arrows, check, menu, play/pause)
in `Glyphs.tsx`.

## Alternatives

- **System emoji font (status quo)** — platform-dependent appearance, no design
  control, different metrics between OSes; this was the reported problem.
- **Icon library (Lucide/Heroicons/etc.)** — polished line icons, but the wrong
  visual language (not pixel art), an extra dependency and a much larger bundle;
  the site deliberately stays dependency-light.
- **Emoji webfont (Noto Color Emoji)** — consistent rendering, but a multi-megabyte
  font, colour glyphs that cannot inherit the theme colour, and still not pixel
  art; loading it would hurt performance for a handful of characters.
- **Bitmap PNG sprites** — would need multiple densities, cannot adapt to theme
  colours, and would add requests; SVG rectangles stay crisp and tiny.
- **Generate sprites from emoji automatically** — loses the hand-drawn, editorial
  pixel style and produces noisy results at 16×16.

## Consequences

- Emoji render identically on every OS and browser, before any font/image loads.
- Icons are theme-aware for free (`currentColor` + CSS variables) and add no
  network requests or dependencies.
- Translations stay pleasant to write and read; emoji remain content, not UI.
- New pictograms are a small data edit plus one mapping entry, but they are
  maintained by hand: each grid must stay exactly 16×16, and a new translation
  emoji must be mapped or it falls back to the OS glyph.
- Decorative icons are `aria-hidden` by default, so the icon system does not add
  noise to the accessibility tree; standalone icons can pass a `label`.
