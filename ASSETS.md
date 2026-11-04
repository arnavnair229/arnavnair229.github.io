# Assets

Drop a file into `src/assets/slots/`, named after the slot with any supported extension, and it appears on the next build. Delete it and the built-in art comes back. No code changes needed.

Supported formats: WebP or AVIF preferred. PNG, JPG and SVG also work.

| Slot | Where it shows | Ideal size | Max size |
|---|---|---|---|
| `about-headshot` | Home, above your name (already filled) | 256×256, square | 60 KB |
| `project-kalman` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-surface` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-wcomms` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-site` | Portfolio grid | 960×540, 16:9 | 150 KB |

The intro clip is `public/intro/hero-intro.webp` (transparent animated WebP, under 2 MB). Its timing is set in `src/lib/intro.ts`. The background surface is drawn from `src/data/surface.json`.

To change the W-Comms card state, set `W_COMMS_PUBLIC` in `src/config.ts`.
