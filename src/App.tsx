import { useEffect, useRef, useState } from "react";
import { PROJECTS, TABS, type ProjectId, type Tab } from "./config";
import { Contact, Food, Resume, Work } from "./components/Sections";
import { runIntro } from "./lib/intro";

type Route = { tab: Tab; project: ProjectId };
const DEFAULT_PROJECT: ProjectId = "kalman";

function parse(hash: string, previous: ProjectId): Route {
  const h = hash.slice(1);
  if (PROJECTS.some((p) => p.id === h)) return { tab: "work", project: h as ProjectId };
  if (TABS.some((t) => t.id === h)) return { tab: h as Tab, project: previous };
  return { tab: "work", project: previous };
}

export default function App() {
  const main = useRef<HTMLElement>(null);
  const [route, setRoute] = useState<Route>({ tab: "work", project: DEFAULT_PROJECT });

  useEffect(() => {
    setRoute(parse(location.hash, DEFAULT_PROJECT));
    const onHash = () => {
      const isProject = PROJECTS.some((p) => `#${p.id}` === location.hash);
      setRoute((r) => parse(location.hash, r.project));
      main.current?.focus({ preventScroll: true });
      // On one-column layouts, the chosen project sits below the index, so go to it.
      if (isProject && innerWidth < 768) requestAnimationFrame(() => document.getElementById("project-detail")?.scrollIntoView());
      else if (!isProject) scrollTo(0, 0);
    };
    addEventListener("hashchange", onHash);
    runIntro();
    return () => removeEventListener("hashchange", onHash);
  }, []);

  const views: [Tab, React.ReactNode][] = [
    ["work", <Work project={route.project} />], ["food", <Food />], ["resume", <Resume />], ["contact", <Contact />],
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
            <a href="#work" className="inline-flex min-h-[44px] items-center font-medium">Arnav Nair</a>
            <nav aria-label="Primary" className="flex gap-5">
              {TABS.map((t) => <a key={t.id} className="tab" href={`#${t.id}`} aria-current={route.tab === t.id ? "page" : undefined}>{t.label}</a>)}
            </nav>
          </div>
        </header>
        <main id="main" ref={main} tabIndex={-1} className="outline-none">
          {views.map(([id, node]) => (
            <section key={id} hidden={route.tab !== id} aria-label={id} className="mx-auto max-w-[1080px] px-5 pb-16 pt-8 md:pt-12">{node}</section>
          ))}
        </main>
      </div>
    </>
  );
}
