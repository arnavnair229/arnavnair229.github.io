const SEEN_KEY = "intro-seen";
const CLIP_URL = "/intro/hero-intro.webp";
const CLIP_MS = 10333; // 124 frames at 12 fps
const CLICK_MS = 6200; // the remote is raised and steady
const LOAD_LIMIT_MS = 2000; // past this, skip the clip instead of making people wait

function markSeen() {
  try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* private mode: replay is fine */ }
}

type Reveal = "full" | "fast" | "instant";

/** Turn the site on like a CRT. `fast` is for repeat visits and Skip. `instant` is for interruptions:
 *  a press on a link must not squash the page, or the release misses it and the click is lost. */
function turnOn(mode: Reveal) {
  const c = document.documentElement.classList;
  c.remove("intro-full", "intro-short");
  if (mode === "instant") return;
  c.add(mode === "fast" ? "tv-on-fast" : "tv-on");
  const shell = document.querySelector(".site-shell");
  const clear = () => c.remove("tv-on", "tv-on-fast");
  shell?.addEventListener("animationend", clear, { once: true });
  setTimeout(clear, 1600); // in case animationend never fires
}

/** First visit: Arnav walks on, waves, clicks the remote, the site turns on, he walks off.
 *  Repeat visits get the turn-on alone. Skip, scroll, tap or any key ends it at once. */
export function runIntro() {
  const c = document.documentElement.classList;
  if (c.contains("intro-short")) { markSeen(); turnOn("fast"); return; }
  if (!c.contains("intro-full")) return;

  const layer = document.getElementById("intro-layer");
  const skip = document.getElementById("skip-intro");
  if (!layer || !skip) { turnOn("instant"); return; }

  let revealed = false;
  let timers: number[] = [];
  const EVENTS = ["wheel", "touchmove", "keydown", "pointerdown", "hashchange"];

  const cleanup = () => {
    timers.forEach(clearTimeout);
    timers = [];
    EVENTS.forEach((e) => removeEventListener(e, stop));
    skip.removeEventListener("click", skipNow);
    skip.hidden = true;
    layer.replaceChildren();
  };
  const reveal = (mode: Reveal) => {
    if (revealed) return;
    revealed = true;
    skip.hidden = true;
    turnOn(mode);
  };
  // Before the click these reveal the site. After it, the clip just goes away.
  function stop() {
    reveal("instant");
    cleanup();
  }
  function skipNow() {
    reveal("fast");
    cleanup();
  }

  markSeen();
  skip.hidden = false;
  skip.addEventListener("click", skipNow);
  EVENTS.forEach((e) => addEventListener(e, stop, { passive: true }));

  const img = new Image();
  img.alt = "";
  img.className = "intro-clip";
  img.width = 960;
  img.height = 549;
  const tooSlow = window.setTimeout(stop, LOAD_LIMIT_MS);
  timers.push(tooSlow);
  img.onerror = stop;
  img.onload = () => {
    if (revealed) return;
    clearTimeout(tooSlow);
    layer.append(img);
    timers.push(window.setTimeout(() => reveal("full"), CLICK_MS));
    timers.push(window.setTimeout(cleanup, CLIP_MS));
  };
  img.src = CLIP_URL;
}
