# Changelog

## 3.3.0 (November 2026)

- Surface data updated to the corrected fit, and the blurb now covers the backtest. The wireframe spans 35% to 37%, the strikes with data at every horizon.
- Kalman card redrawn from the repo's results in the site's own style, so its labels stay readable on a phone.
- The intro's click comes at 4.7s, down from 6.2s, and its outline is softer.
- The Featured work section takes less scrolling.
- Food tab hidden until it has content.

## 3.2.0 (November 2026)

- New Featured work section on Projects: five project cards ride a shallow arc as you scroll. With reduced motion or no script, they're a plain grid.
- Project panels and the side index are replaced by expanding tiles with a short blurb. A card or a shared project link opens its tile. Full results stay in each repo.
- The surface figure is gone from the top of the page, with a photo beside the intro in its place.
- Added Jagra, and Kalshi with no outside link because the code is private. Removed This site.
- The tabs are now Projects, Resume, Food and Contact.
- Resume restyled with rounded panels. The text is unchanged.

## 3.1.0 (November 2026)

- New CRT turn-on at the remote click: glowing dot, white line, the picture snaps open with a glitch, and phosphor glow and scanlines fade out.
- The intro now plays on every load and refresh, but not when moving between tabs or returning with the back button. A shared link to a panel goes straight to that panel.
- Leftover scroll momentum and stray key presses no longer cancel the intro, and clicks only cancel it on links and buttons. Skip sits at the bottom right.

## 3.0.0 (November 2026)

- Redesigned as a plain editorial page: paper background, one serif, one accent color, thin rules instead of cards.
- Four tabs: Work, Food, Resume, Contact. Quant and AI projects share one index on the left of Work.
- The surface moved from a full-page background into its own captioned figure.
- Removed the portfolio grid and home tiles, which duplicated the project index.

## 2.2.0 (November 2026)

- New intro: an illustrated Arnav walks on, waves and clicks a remote, the site turns on like a CRT, and he walks off. Repeat visits get the turn-on alone, and reduced-motion visitors go straight to the site.
- Removed the character slot, border characters, flying cards and GSAP.
- Added a home-page line linking the background surface to the research.

## 2.1.0 (November 2026)

- Replaced the long scroll with a one-screen home of tiles and hash-linked panels. Back and forward work, and every panel can be linked to directly.
- Research now has sub-tabs, and resume roles expand and collapse.
- Removed the SVG mascot and Lenis. Added a `hero-character` asset slot that drives the intro and border characters.

## 2.0.0 (November 2026)

- Rebuilt as a prerendered Vite + React + TypeScript + Tailwind site, deployed to GitHub Pages by GitHub Actions.
- New hero: an original mascot inflates, wobbles and spits the nav cards into place. Full sequence on the first visit per session, about 1.5s after that, with a Skip button and a reduced-motion final state.
- Background surface redrawn in raw WebGL from corrected data, with slow motion and cursor parallax.
- Border characters on wide screens: snore when idle, stretch on card hover, bounce on click.
- New sections: Research, AI projects, filterable Portfolio, Open Source, Resume, and a Food stub.
- Experience now matches the 2027 resume. Removed the Markov chain project.
- Kalman and surface charts now use model output from the linked repos, replacing hand-typed data and filled-in cells.
