/** Border characters: snore when idle, stretch toward hovered cards, bounce on click. Desktop-wide only. */
export async function runBuddies() {
  if (!matchMedia("(min-width: 1480px)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { gsap } = await import("gsap");
  const buddies = gsap.utils.toArray<HTMLElement>(".buddy");
  if (!buddies.length) return;

  const food = document.getElementById("food");
  if (food) new IntersectionObserver(([e]) => {
    document.documentElement.classList.toggle("buddies-hidden", e.isIntersecting);
  }).observe(food);

  let idleTimer = 0;
  const wake = () => {
    buddies.forEach((b) => b.classList.remove("snoring"));
    clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => buddies.forEach((b) => b.classList.add("snoring")), 7000);
  };
  wake();
  ["pointermove", "scroll", "keydown"].forEach((e) => addEventListener(e, wake, { passive: true }));

  addEventListener("click", () => {
    wake();
    buddies.forEach((b, i) => {
      const root = b.querySelector(".mascot-root");
      gsap.killTweensOf(root);
      gsap.timeline()
        .to(root, { y: -46, scaleY: 1.08, scaleX: 0.94, duration: 0.18, delay: i * 0.05, ease: "power2.out" })
        .to(root, { y: 0, scaleY: 0.9, scaleX: 1.08, duration: 0.18, ease: "power2.in" })
        .to(root, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1,0.4)" });
    });
  });

  const stretch = (on: boolean) => buddies.forEach((b) => {
    gsap.to(b.querySelector(".mascot-arm-r"), { rotation: on ? -70 : 0, scaleX: on ? 1.55 : 1, duration: on ? 0.3 : 0.2, ease: on ? "back.out(2)" : "power2.out" });
  });
  document.addEventListener("pointerover", (e) => {
    const from = (e.relatedTarget as Element | null)?.closest?.("[data-card]");
    const to = (e.target as Element).closest?.("[data-card]");
    if (to && to !== from) stretch(true);
  });
  document.addEventListener("pointerout", (e) => {
    const from = (e.target as Element).closest?.("[data-card]");
    const to = (e.relatedTarget as Element | null)?.closest?.("[data-card]");
    if (from && !to) stretch(false);
  });
}
