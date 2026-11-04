# Assets

Drop a file into `src/assets/slots/`, named after the slot with any supported extension, and it appears on the next build. Delete it and the built-in art comes back. No code changes needed.

Supported formats: WebP or AVIF preferred, PNG, JPG or SVG also work.

| Slot | Where it shows | Ideal size | Max size |
|---|---|---|---|
| `about-headshot` | Hero, under the buttons (already filled) | 256×256, square | 60 KB |
| `project-kalman` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-surface` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-wcomms` | Portfolio grid | 960×540, 16:9 | 150 KB |
| `project-site` | Portfolio grid | 960×540, 16:9 | 150 KB |

The hero animation and border characters are inline SVG driven by code, so they need no clips. The background surface is drawn from `src/data/surface.json`.

To change the W-Comms card state, set `W_COMMS_PUBLIC` in `src/config.ts`.
