# Editorial homepage

## Problem

The About page introduces Daniel, but visitors have to use the global menu to
discover what he makes and does. The opening also gives the portrait and greeting
equal weight without a clear next step.

## Goal

Make the About page work as a welcoming, scannable front door: establish Daniel's
identity, give visitors a concise introduction, and offer direct paths to his
work and interests. Keep the current Next.js and next-intl stack, existing routes,
and monochrome palette with its yellow accent.

## Behavior and design

- Lead with a typographic greeting, portrait, and short introduction.
- Provide prominent links to development, photography, and sports, plus a smaller
  link to the contact page.
- Keep the sections responsive and readable on narrow screens.
- Use translated labels for every new piece of interface copy in the supported
  English and Russian locales.
- Do not add dependencies or claim support for message files that are not
  configured as locales.

## Acceptance criteria

- Both configured locales render the landing page without missing translations.
- Visitors can reach the featured sections and contact page directly.
- The portrait remains responsive and has localized alternative text.
- The change is documented in README and docs and committed independently.
