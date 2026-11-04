import { useEffect, useRef, useState } from "react";
import { NAV, type View } from "./config";
import { Contact, Food, Home, Portfolio, Projects, Research, Resume } from "./components/Sections";
import { runIntro } from "./lib/intro";

const chip = "flex min-h-[44px] items-center justify-center rounded-lg border border-line bg-panel font-semibold transition-colors duration-150 hover:border-sun";
const VIEWS: View[] = ["home", "food", ...NAV.map((n) => n.id)];
const fromHash = (): View => {
  const h = location.hash.slice(1) as View;
  return VIEWS.includes(h) ? h : "home";
};

export default function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const main = useRef<HTMLElement>(null);
  const [view, setView] = useState<View>("home");

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setView(fromHash());
    const onHash = () => {
      setView(fromHash());
      scrollTo(0, 0);
      main.current?.focus({ preventScroll: true });
    };
    addEventListener("hashchange", onHash);
    runIntro();
    const startBg = () => import("./lib/volCanvas").then(({ startVolCanvas }) => {
      if (canvas.current) startVolCanvas(canvas.current, reduced);
    });
    if ("requestIdleCallback" in window) requestIdleCallback(startBg, { timeout: 1500 });
    else setTimeout(startBg, 600);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const links = (cls: string) => NAV.map((n) => (
    <a key={n.id} data-nav={n.id} href={`#${n.id}`} aria-current={view === n.id ? "page" : undefined} className={cls}>{n.label}</a>
  ));
  const panels: [Exclude<View, "home">, React.ReactNode][] = [
    ["research", <Research />], ["projects", <Projects />], ["portfolio", <Portfolio />],
    ["resume", <Resume />], ["contact", <Contact />], ["food", <Food />],
  ];

  return (
    <>
      <a href="#main" className="sr-only z-[70] rounded bg-sun px-3 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Skip to content</a>
      <div aria-hidden="true" className="tv-screen" />
      <div id="intro-layer" aria-hidden="true" className="intro-layer" />
      <button id="skip-intro" type="button" hidden className="btn fixed right-4 top-4 z-[65]">Skip intro</button>

      <div className="site-shell">
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />

      <nav aria-label="Primary" className="fixed inset-x-0 top-0 z-40 hidden border-b border-line bg-ink/90 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2">
          <a href="#home" className="font-display text-lg font-bold">Arnav Nair</a>
          <div className="flex gap-2">{links(`${chip} px-4 text-sm`)}</div>
        </div>
      </nav>
      <nav aria-label="Primary, mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 p-1.5 pb-[max(.375rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="grid grid-cols-5 gap-1">{links(`${chip} text-[0.75rem]`)}</div>
      </nav>

      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <div hidden={view !== "home"}><Home /></div>
        {panels.map(([id, node]) => (
          <section key={id} hidden={view !== id} aria-label={id}
            className={`mx-auto max-w-6xl px-5 pb-28 pt-6 md:pb-12 md:pt-24 ${view === id ? "view-in" : ""}`}>
            {node}
          </section>
        ))}
      </main>
      </div>
    </>
  );
}
