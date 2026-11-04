# Changelog

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
