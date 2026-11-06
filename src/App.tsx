import { useEffect, useRef, useState } from "react";
import { PROJECTS, TABS, type Tab } from "./config";
import { Culinary } from "./components/Culinary";
import { Contact, Portfolio, TechnicalProjects } from "./components/Sections";
import { runIntro } from "./lib/intro";

const projectIds = PROJECTS.map((p) => `#${p.id}`) as string[];

/** Other hashes, such as #resume and #jagra, are places on the Portfolio tab. */
const parse = (hash: string): Tab => (projectIds.includes(hash) ? "technical" : TABS.find((t) => `#${t.id}` === hash)?.id ?? "portfolio");

export default function App() {
  const main = useRef<HTMLElement>(null);
  const navigated = useRef(false);
  const [hash, setHash] = useState("");
  const tab = parse(hash);

  useEffect(() => {
    setHash(location.hash);
    const onHash = () => { navigated.current = true; setHash(location.hash); };
    addEventListener("hashchange", onHash);
    runIntro();
    return () => removeEventListener("hashchange", onHash);
  }, []);

  // Runs once the right tab is showing, so its contents can be measured.
  useEffect(() => {
    if (navigated.current) main.current?.focus({ preventScroll: true });
    const target = hash === "#jagra" ? null : hash.length > 1 && !TABS.some((t) => `#${t.id}` === hash) && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else if (navigated.current && hash !== "#jagra") scrollTo(0, 0);
  }, [hash]);

  const views: [Tab, React.ReactNode][] = [
    ["portfolio", <Portfolio showJagra={hash === "#jagra"} />], ["technical", <TechnicalProjects />], ["culinary", <Culinary />], ["contact", <Contact />],
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
            <a href="#portfolio" className="inline-flex min-h-[44px] items-center font-medium">Arnav Nair</a>
            <nav aria-label="Primary" className="flex gap-3 text-base md:gap-5 md:text-lg">
              {TABS.map((t) => <a key={t.id} className="tab" href={`#${t.id}`} aria-current={tab === t.id ? "page" : undefined}>{t.label}</a>)}
            </nav>
          </div>
        </header>
        <main id="main" ref={main} tabIndex={-1} className="outline-none">
          {views.map(([id, node]) => (
            <section key={id} hidden={tab !== id} aria-label={TABS.find((t) => t.id === id)?.label} className={id === "culinary" ? "" : "mx-auto max-w-[1080px] px-5 pb-16 pt-8 md:pt-12"}>{node}</section>
          ))}
        </main>
      </div>
    </>
  );
}
