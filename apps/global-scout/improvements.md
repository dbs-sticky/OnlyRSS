# Global Scout — Review & Improvement Suggestions

Review of both Classic and Border Chain modes, based on live UI testing at desktop and mobile viewports plus a read of `index.html`, `style.css`, and `script.js`.

## What works well

- Beautiful, restrained visual design — canvas-rendered D3 orthographic globe with smooth rotate/zoom, area-aware auto-zoom per country, and a terracotta pulse that clearly marks the target.
- Chain mode is genuinely clever: green-filled chain, amber "valid next move" candidates with dashed arcs, and white great-circle lines between centroids.
- Autocomplete with word-start matching, keyboard navigation, and a sensible hint escalation (first letter → capital) after wrong guesses.
- Mobile layout adapts cleanly (continent-filter shrinks, facts collapse to 1-column, hint text hidden).

---

## UI / UX issues

### Destructive mode & filter switches
Clicking a mode pill or toggling a continent silently calls `restart()` and wipes the current run. A chain at 12 is gone with one misclick.
**Fix:** confirm if score > 0, or queue the change so it only applies to the next game.

### Chain mode hides the Borders list
`script.js:673-679` explicitly hides the borders section in chain mode. That info is exactly what the player needs to plan the next move — show it.

### Ephemeral error messages
"Already in chain" / "doesn't border" errors are stuffed into `#hint-text` then wiped 400 ms later by `updateHintText()` (`script.js:606-619`). Too fast to read, same orange color as normal hints.
**Fix:** persistent, red-tinted error state that stays until the next keystroke.

### No way to "give up" / reveal the answer
In classic mode, after two wrong guesses the player knows the capital but still can't see the country name without blindly skipping.

### Chain dead-end is abrupt
"No valid moves left" triggers `chainNoMovesLeft` + `showEndgame()` (`script.js:689-694`) with no warning. Warn the player the chain is dead-ending *before* they guess the last possible country, or surface it explicitly in the endgame copy.

### "Session Complete" wording
Reads oddly when the user hit **End Game** at score 0. Branch the wording: "Session Complete" only if `pool.length === 0`, otherwise "Game Ended".

### First-round zoom can hide the globe
If the first picked country is a tiny island, the 12× zoom multiplier animation runs before the user gets global context, and the map appears nearly blank. Consider starting the first round zoomed out, then panning in.

### Input placeholder clips
Shows "Identify this country… (193 remaining) · Enter t…" on the desktop width because the input is ~240 px wide.
**Fix:** move "(N remaining)" to the `#skip-count` span that already exists in the DOM but is never populated (`index.html:86`).

---

## Accessibility

- Zoom controls are `<div>`s, not `<button>`s (`index.html:38-40`) — not keyboard-focusable, no role.
- Canvas globe has no `aria-label` or textual alt; screen readers see nothing.
- Modal lacks `role="dialog"` / `aria-modal`, no focus trap, no `Escape`-to-close handler.
- Correct/incorrect results aren't announced — add an `aria-live="polite"` region.
- Shake animation and pulse ignore `prefers-reduced-motion`.
- Color cues (terracotta pulse vs. amber candidate) are hard to distinguish for deuteranopia — add a shape/pattern cue (outline pattern, icon).
- Autocomplete list isn't a `role="listbox"` with `aria-activedescendant`.

---

## Code issues

### Function declared after use
`script.js:1196` calls `largestPolygonCentroid`, but it is declared on line 1198 *inside* `loadWorld`. Works via hoisting, but is confusing — move it to module scope.

### Dead DOM
- `.input-label` is `display: none` in CSS (`style.css:296-298`) with no state that ever shows it.
- `#skip-count` span is never written to.

### Duplicated state
`chainSet` (ISO2) and `chainNumericSet` (numeric) hold the same membership info. Derive one from the other, or keep a single map `iso2 → numericId`.

### Variable shadowing
`initChain` declares a local `const pool` (`script.js:440`) that shadows the module-level `pool` used in classic mode. Rename to `startPool` or similar.

### Regex rebuilt 3× per keystroke
In `buildAC` the word-start pattern is compiled on lines 757, 764, and 770. Compile once, reuse.

### Wheel zoom is jumpy
10 % per tick, unthrottled (`script.js:1111`) — feels jerky on trackpads. Use a smaller factor and coalesce updates in a `requestAnimationFrame`.

### No flag-image fallback
`flagEmoji()` loads from `flagcdn.com` with no `onerror` handler — broken image if offline or the CDN 404s.

---

## Feature ideas

- **Timer / per-country time** and a "fastest 10" leaderboard in localStorage.
- **Streak counter** alongside score (current/best correct-in-a-row without skip).
- **Share result** button on endgame (Wordle-style emoji grid of correct/skipped).
- **Difficulty toggle**: no-hints mode, or "silhouette only" (hide all other countries' fills).
- **Reverse mode**: given a name, click the country on the globe.
- **Daily challenge** seeded by date so everyone plays the same chain start.
- **Chain-mode max-chain reveal** at game end ("You got 7 — the max from South Africa was 14").
- **Onboarding tooltip** for first-time visit explaining Border Chain mechanics (amber = valid next, green = already chained).
