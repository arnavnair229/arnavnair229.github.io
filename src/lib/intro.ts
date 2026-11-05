const CLIP_URL = "/intro/hero-intro.webp";
const CLIP_MS = 10333; // 124 frames at 12 fps
const CLICK_MS = 6200; // the remote is raised and steady
const LOAD_LIMIT_MS = 4000; // past this, skip the clip instead of making people wait
const GRACE_MS = 1000; // leftover trackpad momentum shouldn't cancel the intro on load
const CRT_MS = 1500; // longest turn-on, plus a margin
const END_KEYS = new Set(["Escape", "Enter", " ", "ArrowDown", "PageDown"]);

type Reveal = "full" | "fast" | "instant";

/** Turn the site on like a CRT: dot, line, then the picture snaps open. `fast` is for Skip.
 *  `instant` is for interruptions: a press on a link must not squash the page, or the click is lost. */
function turnOn(mode: Reveal) {
  const c = document.documentElement.classList;
  c.remove("intro-full");
  if (mode === "instant") return;
  c.add(mode === "fast" ? "tv-on-fast" : "tv-on");
  setTimeout(() => c.remove("tv-on", "tv-on-fast"), CRT_MS);
}

/** On every page load: Arnav walks on, waves, clicks the remote, the site turns on, he walks off.
 *  Moving between tabs never reloads the page, so going back to Projects doesn't replay it. */
export function runIntro() {
  if (!document.documentElement.classList.contains("intro-full")) return;

  const layer = document.getElementById("intro-layer");
  const skip = document.getElementById("skip-intro");
  if (!layer || !skip) { turnOn("instant"); return; }

  const started = performance.now();
  let revealed = false;
  let timers: number[] = [];

  const cleanup = () => {
    timers.forEach(clearTimeout);
    timers = [];
    removeEventListener("wheel", onScroll);
    removeEventListener("touchmove", onScroll);
    removeEventListener("keydown", onKey);
    removeEventListener("pointerdown", onPress);
    removeEventListener("hashchange", stop);
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
  function onScroll() {
    if (performance.now() - started > GRACE_MS) stop();
  }
  function onKey(e: KeyboardEvent) {
    if (END_KEYS.has(e.key)) stop();
  }
  function onPress(e: Event) {
    const hit = (e.target as Element).closest?.("a, button");
    if (hit && hit !== skip) stop(); // Skip has its own handler, which plays the turn-on
  }

  skip.hidden = false;
  skip.addEventListener("click", skipNow);
  addEventListener("wheel", onScroll, { passive: true });
  addEventListener("touchmove", onScroll, { passive: true });
  addEventListener("keydown", onKey);
  addEventListener("pointerdown", onPress, { passive: true });
  addEventListener("hashchange", stop);

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
