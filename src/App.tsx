import { useEffect, useRef, useState } from "react";
import { PROJECTS, TABS, type Tab } from "./config";
import { Contact, Projects, Resume } from "./components/Sections";
import { runIntro } from "./lib/intro";

const isProject = (hash: string) => PROJECTS.some((p) => `#${p.id}` === hash);

const parse = (hash: string): Tab => TABS.find((t) => `#${t.id}` === hash)?.id ?? "projects";

/** Opens the tile the hash names and scrolls to it. */
const showProject = () => requestAnimationFrame(() => {
  const tile = document.querySelector<HTMLDetailsElement>(`details${location.hash}`);
  if (!tile) return;
  tile.open = true;
  tile.scrollIntoView();
});

export default function App() {
  const main = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<Tab>("projects");

  useEffect(() => {
    setTab(parse(location.hash));
    if (isProject(location.hash)) showProject();
    const onHash = () => {
      setTab(parse(location.hash));
      main.current?.focus({ preventScroll: true });
      if (isProject(location.hash)) showProject();
      else scrollTo(0, 0);
    };
    addEventListener("hashchange", onHash);
    runIntro();
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const views: [Tab, React.ReactNode][] = [
    ["projects", <Projects />], ["resume", <Resume />], ["contact", <Contact />],
  ];

  return (
    <>
      <a href="#main" className="sr-only z-[70] bg-ink px-3 py-2 text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3">Skip to content</a>
      <div aria-hidden="true" className="tv-screen" />
      <div aria-hidden="true" className="crt"><i className="crt-glow" /><i className="crt-scan" /><i className="crt-line" /><i className="crt-dot" /></div>
      <div id="intro-layer" aria-hidden="true" className="intro-layer" />
      <button id="skip-intro" type="button" hidden className="fixed bottom-5 right-5 z-[65] min-h-[44px] bg-paper px-4 text-ink underline">Skip intro</button>

      <div className="site-shell">
        <header className="site-header sticky top-0 z-40 border-b border-rule bg-paper">
          <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-x-6 px-5">
            <a href="#projects" className="inline-flex min-h-[44px] items-center font-medium">Arnav Nair</a>
            <nav aria-label="Primary" className="flex gap-5">
              {TABS.map((t) => <a key={t.id} className="tab" href={`#${t.id}`} aria-current={tab === t.id ? "page" : undefined}>{t.label}</a>)}
            </nav>
          </div>
        </header>
        <main id="main" ref={main} tabIndex={-1} className="outline-none">
          {views.map(([id, node]) => (
            <section key={id} hidden={tab !== id} aria-label={id} className="mx-auto max-w-[1080px] px-5 pb-16 pt-8 md:pt-12">{node}</section>
          ))}
        </main>
      </div>
    </>
  );
}
