# Accessibility improvements

The shared header includes a localized skip-to-main-content link, a named
navigation landmark, and an `aria-current="page"` marker for the active
section. The link becomes visible on keyboard focus, and links and buttons have
a visible `:focus-visible` outline.

The site respects `prefers-reduced-motion`: CSS animation and smooth scrolling
are suppressed, and workout videos do not autoplay. If the preference is
enabled while a workout video is playing, playback pauses. The detailed feature
requirements are in [the accessible navigation specification](./specs/accessible-navigation.md).
