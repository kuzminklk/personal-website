# Accessible navigation and motion preferences

## Problem

The shared navigation does not provide a keyboard skip link or announce the
current page, and keyboard focus is not consistently visible. Motion-sensitive
visitors can also encounter decorative animation, smooth scrolling, and
autoplaying workout videos.

## Goal / non-goals

- Goal: make navigation usable by keyboard and assistive technology, and honor
  the operating system's reduced-motion preference.
- Not in scope: changing the navigation layout, adding a mobile menu, or
  changing page content.

## Behavior

- A localized skip link is the first focusable item and moves focus to the
  current page's main content.
- The navigation landmark has a localized accessible name, and the active
  destination is announced as the current page.
- Keyboard focus has a visible outline.
- With reduced motion enabled, CSS animations and smooth scrolling are
  suppressed and workout videos do not autoplay. Turning the preference on
  while a video is playing pauses it.

## Design notes

- Use the existing Next.js App Router, CSS modules/global styles, and
  `next-intl` messages.
- Use the browser's `prefers-reduced-motion` media query; no new dependencies.
- Every localized page must expose the same `main-content` fragment target.

## Acceptance criteria

- The skip link is visually hidden until keyboard-focused and works on all
  localized pages.
- The active navigation link exposes `aria-current="page"`.
- Reduced-motion preferences disable CSS animation and video playback.
- Existing navigation labels and page layouts remain unchanged.
