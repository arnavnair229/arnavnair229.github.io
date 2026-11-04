import { useEffect, useRef } from "react";
import { NAV } from "./config";
import { Mascot } from "./components/Mascot";
import { Contact, Food, Hero, OpenSource, Portfolio, Projects, Research, Resume } from "./components/Sections";
import { runIntro } from "./lib/intro";
import { runBuddies } from "./lib/buddies";

function NavLinks({ cls }: { cls: string }) {
  return <>{NAV.map((n) => <a key={n.id} data-nav={n.id} href={`#${n.id}`} className={cls}>{n.label}</a>)}</>;
}

const chip = "flex min-h-[44px] items-center justify-center rounded-lg border border-line bg-panel font-semibold transition-colors duration-150 hover:border-sun";

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = root.current!;
    void runIntro(el);
    window.addEventListener("intro-end", () => void runBuddies(), { once: true });
    if (document.documentElement.classList.contains("intro-done")) void runBuddies();

    const startBg = () => import("./lib/volCanvas").then(({ startVolCanvas }) => {
      if (canvas.current) startVolCanvas(canvas.current, reduced);
    });
    if ("requestIdleCallback" in window) requestIdleCallback(startBg, { timeout: 1500 });
    else setTimeout(startBg, 600);

    if (!reduced && matchMedia("(pointer: fine)").matches) {
      void import("lenis").then(({ default: Lenis }) => {
        const lenis = new Lenis({ anchors: { offset: -72 } });
        const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      });
    }
  }, []);

  return (
    <div ref={root}>
      <a href="#main" className="sr-only z-[70] rounded bg-sun px-3 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Skip to content</a>
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />

      <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-40 hidden border-b border-line bg-ink/90 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2">
          <a href="#top" className="font-display text-lg font-bold">Arnav Nair</a>
          <div className="flex gap-2"><NavLinks cls={`${chip} px-4 text-sm`} /></div>
        </div>
      </nav>
      <nav aria-label="Primary, mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 p-1.5 pb-[max(.375rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="grid grid-cols-5 gap-1"><NavLinks cls={`${chip} text-[0.75rem]`} /></div>
      </nav>

      <button id="skip-intro" type="button" hidden className="btn fixed right-4 top-4 z-[65] md:top-16">Skip intro</button>
      <div aria-hidden="true">
        {NAV.map((n) => <div key={n.id} className="fly-card rounded-lg border-2 border-ink bg-sun px-4 py-2 font-semibold text-ink shadow-lg">{n.label}</div>)}
      </div>
      <div aria-hidden="true">
        <div className="buddy buddy-l"><Mascot /></div>
        <div className="buddy buddy-r"><Mascot /></div>
      </div>

      <main id="main">
        <Hero />
        <Research />
        <Projects />
        <Portfolio />
        <OpenSource />
        <Resume />
        <Food />
      </main>
      <Contact />
    </div>
  );
}
