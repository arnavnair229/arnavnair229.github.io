/** Border copies of the hero character: settle when idle, lean toward hovered cards, bounce on click. */
export async function runBuddies() {
  if (!matchMedia("(min-width: 1480px)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const buddies = Array.from(document.querySelectorAll<HTMLElement>(".buddy > *"));
  if (!buddies.length) return;
  const { gsap } = await import("gsap");

  addEventListener("click", () => buddies.forEach((b, i) => {
    gsap.killTweensOf(b);
    gsap.timeline()
      .to(b, { y: -46, scaleY: 1.08, scaleX: 0.94, duration: 0.18, delay: i * 0.05 })
      .to(b, { y: 0, scaleY: 0.9, scaleX: 1.08, duration: 0.18, ease: "power2.in" })
      .to(b, { scaleY: 1, scaleX: 1, duration: 0.45, ease: "elastic.out(1,0.4)" });
  }));
  const lean = (on: boolean) => gsap.to(buddies, { rotation: on ? 7 : 0, duration: 0.25, transformOrigin: "50% 100%" });
  document.addEventListener("pointerover", (e) => {
    if ((e.target as Element).closest?.("[data-card]") && !(e.relatedTarget as Element | null)?.closest?.("[data-card]")) lean(true);
  });
  document.addEventListener("pointerout", (e) => {
    if ((e.target as Element).closest?.("[data-card]") && !(e.relatedTarget as Element | null)?.closest?.("[data-card]")) lean(false);
  });
}
