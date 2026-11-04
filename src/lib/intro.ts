import { NAV } from "../config";

const SEEN_KEY = "intro-seen";
const SHORT_SECONDS = 1.5;

function finish(root: HTMLElement) {
  const c = document.documentElement.classList;
  c.remove("intro-pending", "intro-full", "intro-short");
  c.add("intro-done", "buddies-on");
  root.querySelector(".hero-mascot")?.classList.add("idle");
  try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* private mode: replay is fine */ }
  window.dispatchEvent(new Event("intro-end"));
}

/** Cards fly out of the hero into the nav. A hero character, if present, inflates and wobbles first.
 *  Any scroll, key press or Skip ends it at the final state. */
export async function runIntro(root: HTMLElement) {
  const c = document.documentElement.classList;
  if (!c.contains("intro-pending")) { finish(root); return; }
  // Deep links to a panel go straight to the content.
  if (location.hash.length > 1) { finish(root); return; }

  let gsap: typeof import("gsap").gsap;
  try { ({ gsap } = await import("gsap")); } catch { finish(root); return; }

  const character = root.querySelector<HTMLElement>(".hero-mascot");
  const source = character ?? root.querySelector<HTMLElement>(".hero-title");
  const cards = gsap.utils.toArray<HTMLElement>(".fly-card");
  const target = (id: string) => Array.from(document.querySelectorAll<HTMLElement>(`[data-nav="${id}"]`)).find((n) => n.offsetParent !== null);
  if (!source || !cards.length) { finish(root); return; }

  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  if (character) {
    gsap.set(character, { scale: 0.55, transformOrigin: "50% 100%" });
    [0.7, 0.85, 1].forEach((s) => tl.to(character, { scale: s, duration: 0.42, ease: "back.out(2.4)" }));
    tl.fromTo(character, { scaleX: 1.1, scaleY: 0.9 }, { scaleX: 1, scaleY: 1, duration: 0.9, ease: "elastic.out(1.2,0.28)" });
    tl.to(character, { scaleY: 0.86, scaleX: 1.08, duration: 0.18, ease: "power2.in" });
  }
  tl.addLabel("spit");
  if (character) tl.to(character, { scaleY: 1.08, scaleX: 0.96, duration: 0.14 }, "spit");

  cards.forEach((card, i) => {
    const id = NAV[i].id;
    const fly = { p: 0 };
    let sx = 0, sy = 0, ex = 0, ey = 0;
    tl.to(fly, {
      p: 1,
      duration: 0.72,
      ease: "power2.inOut",
      onStart() {
        const m = source.getBoundingClientRect();
        const t = target(id)?.getBoundingClientRect();
        const w = card.offsetWidth, h = card.offsetHeight;
        sx = m.left + m.width / 2 - w / 2;
        sy = m.top + m.height * 0.4 - h / 2;
        ex = t ? t.left + t.width / 2 - w / 2 : sx;
        ey = t ? t.top + t.height / 2 - h / 2 : sy;
        card.style.visibility = "visible";
      },
      onUpdate() {
        const p = fly.p;
        gsap.set(card, { x: sx + (ex - sx) * p, y: sy + (ey - sy) * p - 170 * 4 * p * (1 - p), rotation: (1 - p) * (i % 2 ? 22 : -22) * Math.sin(p * Math.PI), scale: 0.4 + 0.6 * Math.min(p * 1.6, 1) });
      },
      onComplete() {
        card.style.visibility = "hidden";
        const t = target(id);
        if (t) {
          t.classList.add("landed");
          gsap.fromTo(t, { scale: 1.22 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
        }
      },
    }, `spit+=${0.05 + i * 0.13}`);
  });
  if (character) tl.to(character, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1,0.4)" }, "spit+=0.95");

  if (c.contains("intro-short")) tl.timeScale(tl.duration() / SHORT_SECONDS);

  const skipBtn = document.getElementById("skip-intro");
  if (skipBtn) skipBtn.hidden = false;
  let done = false;
  const end = () => {
    if (done) return;
    done = true;
    tl.kill();
    cards.forEach((card) => { card.style.visibility = "hidden"; });
    if (character) gsap.set(character, { clearProps: "transform" });
    NAV.forEach(({ id }) => document.querySelectorAll<HTMLElement>(`[data-nav="${id}"]`).forEach((n) => { n.classList.remove("landed"); gsap.set(n, { clearProps: "transform" }); }));
    if (skipBtn) skipBtn.hidden = true;
    ["wheel", "touchmove", "keydown", "hashchange"].forEach((e) => removeEventListener(e, end));
    skipBtn?.removeEventListener("click", end);
    finish(root);
  };
  tl.eventCallback("onComplete", end);
  skipBtn?.addEventListener("click", end);
  ["wheel", "touchmove", "keydown", "hashchange"].forEach((e) => addEventListener(e, end, { passive: true }));
}
