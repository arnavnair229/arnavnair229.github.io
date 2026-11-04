# Assets

Drop a file into `src/assets/slots/`, named after the slot with any supported extension, and it appears on the next build. Delete it and the built-in art comes back. No code changes needed.

Supported formats: WebP or AVIF preferred. PNG, JPG, SVG and (for the hero) WebM also work.

| Slot | Where it shows | Ideal size | Max size |
|---|---|---|---|
| `hero-character` | Hero centre: inflates, wobbles and spits the nav cards. Images also appear as border characters on wide screens | 800×800, transparent WebP, PNG or WebM | 2 MB |
| `about-headshot` | Hero, shown when `hero-character` is empty (already filled) | 256×256, square | 60 KB |
| `project-kalman` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-surface` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-wcomms` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-site` | Portfolio grid | 960×540, 16:9 | 150 KB |

With `hero-character` empty, the hero has no character and the cards fly out from your name. The background surface is drawn from `src/data/surface.json`.

To change the W-Comms card state, set `W_COMMS_PUBLIC` in `src/config.ts`.
