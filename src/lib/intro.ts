import { NAV } from "../config";

const SEEN_KEY = "intro-seen";
const FULL_SECONDS = 4.6;
const SHORT_SECONDS = 1.5;

function finish(root: HTMLElement) {
  const c = document.documentElement.classList;
  c.remove("intro-pending", "intro-full", "intro-short");
  c.add("intro-done", "buddies-on");
  root.querySelector<HTMLElement>(".hero-mascot")?.classList.add("idle");
  try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* private mode: replay is fine */ }
  window.dispatchEvent(new Event("intro-end"));
}

/** Inflate, wobble, spit the cards into the nav. Any scroll, key press or Skip ends it at the final state. */
export async function runIntro(root: HTMLElement) {
  const c = document.documentElement.classList;
  if (!c.contains("intro-pending")) { finish(root); return; }

  let gsap: typeof import("gsap").gsap;
  try { ({ gsap } = await import("gsap")); } catch { finish(root); return; }

  const mascot = root.querySelector<SVGElement>(".hero-mascot");
  const q = (s: string) => mascot?.querySelector(s) ?? null;
  const cards = gsap.utils.toArray<HTMLElement>(".fly-card");
  const visibleTarget = (id: string) =>
    Array.from(document.querySelectorAll<HTMLElement>(`[data-nav="${id}"]`)).find((n) => n.offsetParent !== null);
  if (!mascot || !cards.length) { finish(root); return; }

  gsap.set(mascot, { scale: 0.55, transformOrigin: "50% 100%" });
  const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
  [0.7, 0.85, 1].forEach((s) => {
    tl.to(mascot, { scale: s, duration: 0.42, ease: "back.out(2.4)" });
    tl.to(q(".mascot-mouth"), { scaleX: 0.5, scaleY: 1.6, duration: 0.14 }, "<");
    tl.to(q(".mascot-mouth"), { scaleX: 1, scaleY: 1, duration: 0.14 }, ">");
  });
  tl.fromTo(q(".mascot-belly"), { scaleX: 1.1, scaleY: 0.9 }, { scaleX: 1, scaleY: 1, duration: 1, ease: "elastic.out(1.2,0.28)" });
  tl.to(mascot, { scaleY: 0.86, scaleX: 1.08, duration: 0.18, ease: "power2.in" }, "-=0.2");
  tl.addLabel("spit");
  tl.to(mascot, { scaleY: 1.08, scaleX: 0.96, duration: 0.14 }, "spit");
  tl.to(q(".mascot-mouth"), { scaleX: 1.15, scaleY: 3.6, duration: 0.12 }, "spit");
  tl.to(q(".mascot-arm-l"), { rotation: 34, duration: 0.2 }, "spit");
  tl.to(q(".mascot-arm-r"), { rotation: -34, duration: 0.2 }, "spit");

  cards.forEach((card, i) => {
    const id = NAV[i].id;
    const at = `spit+=${0.05 + i * 0.13}`;
    const fly = { p: 0 };
    let sx = 0, sy = 0, ex = 0, ey = 0, arc = 0, s1 = 1;
    tl.to(fly, {
      p: 1,
      duration: 0.72,
      ease: "power2.inOut",
      onStart() {
        const m = (q(".mascot-mouth") as Element).getBoundingClientRect();
        const t = visibleTarget(id)?.getBoundingClientRect();
        const w = card.offsetWidth, h = card.offsetHeight;
        sx = m.left + m.width / 2 - w / 2;
        sy = m.top + m.height / 2 - h / 2;
        ex = t ? t.left + t.width / 2 - w / 2 : sx;
        ey = t ? t.top + t.height / 2 - h / 2 : sy;
        s1 = t ? Math.max(0.45, Math.min(1, t.width / w)) : 1;
        arc = -Math.min(170, innerHeight * 0.22);
        card.style.visibility = "visible";
      },
      onUpdate() {
        const p = fly.p;
        const scale = 0.3 + 0.9 * Math.sin(Math.min(p * 1.4, 1) * Math.PI / 2) - (1.2 - s1) * p;
        gsap.set(card, { x: sx + (ex - sx) * p, y: sy + (ey - sy) * p + arc * 4 * p * (1 - p), rotation: (1 - p) * (i % 2 ? 22 : -22) * Math.sin(p * Math.PI), scale });
      },
      onComplete() {
        card.style.visibility = "hidden";
        const t = visibleTarget(id);
        if (t) {
          t.classList.add("landed");
          gsap.fromTo(t, { scale: 1.22 }, { scale: 1, duration: 0.3, ease: "back.out(3)" });
        }
      },
    }, at);
  });
  tl.to(q(".mascot-mouth"), { scaleX: 1, scaleY: 1, duration: 0.2 }, "spit+=0.95");
  tl.to([q(".mascot-arm-l"), q(".mascot-arm-r")], { rotation: 0, duration: 0.3 }, "spit+=0.95");
  tl.to(mascot, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1,0.4)" }, "spit+=0.95");

  const short = c.contains("intro-short");
  tl.timeScale(tl.duration() / (short ? SHORT_SECONDS : FULL_SECONDS));

  const skipBtn = document.getElementById("skip-intro");
  if (skipBtn) skipBtn.hidden = false;
  let done = false;
  const end = () => {
    if (done) return;
    done = true;
    tl.kill();
    cards.forEach((card) => { card.style.visibility = "hidden"; });
    gsap.set(mascot, { clearProps: "transform" });
    gsap.set([q(".mascot-mouth"), q(".mascot-arm-l"), q(".mascot-arm-r"), q(".mascot-belly")], { clearProps: "transform" });
    NAV.forEach(({ id }) => document.querySelectorAll<HTMLElement>(`[data-nav="${id}"]`).forEach((n) => { n.classList.remove("landed"); gsap.set(n, { clearProps: "transform" }); }));
    if (skipBtn) skipBtn.hidden = true;
    ["wheel", "touchmove", "keydown"].forEach((e) => removeEventListener(e, end));
    skipBtn?.removeEventListener("click", end);
    finish(root);
  };
  tl.eventCallback("onComplete", end);
  skipBtn?.addEventListener("click", end);
  ["wheel", "touchmove", "keydown"].forEach((e) => addEventListener(e, end, { passive: true }));
}
