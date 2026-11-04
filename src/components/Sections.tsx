import { useEffect, useRef, useState } from "react";
import headshot from "../assets/about-headshot.jpg";
import kalman from "../data/kalman.json";
import { LINKS, PROJECTS, W_COMMS_PUBLIC, W_COMMS_URL, type ProjectId } from "../config";
import { education, experience, skills } from "../data/resume";
import { EquityChart, SurfaceTable } from "./Charts";

const pct = (v: number) => `${v > 0 ? "+" : ""}${(v * 100).toFixed(1)}%`;
const Ext = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a className="link" href={href} target="_blank" rel="noopener noreferrer">{children}</a>
);

function SurfaceFigure() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = () => import("../lib/volCanvas").then(({ startVolCanvas }) => {
      if (ref.current) startVolCanvas(ref.current, reduced);
    });
    if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 600);
  }, []);
  return (
    <figure>
      <canvas ref={ref} aria-hidden="true" className="h-[190px] w-full md:h-[210px]" />
      <figcaption className="label mt-1">
        Implied σ of US obesity thresholds, from CDC data. <a className="link" href="#surface">The model</a>
      </figcaption>
    </figure>
  );
}

const Facts = ({ rows }: { rows: [string, string, string?][] }) => (
  <dl className="my-6 grid grid-cols-2 border-y border-rule md:grid-cols-4">
    {rows.map(([k, v, sub]) => (
      <div key={k} className="py-3 pr-4">
        <dt className="label">{k}</dt>
        <dd className="text-2xl">{v}</dd>
        {sub && <dd className="label">{sub}</dd>}
      </div>
    ))}
  </dl>
);

function Kalman() {
  const m = kalman.metrics;
  return (
    <>
      <h2 className="text-3xl leading-tight">Kalman-filter pairs trading</h2>
      <p className="prose-w mt-3">
        A dynamic hedge ratio on EWH/EWZ. The first backtest showed a 60% win rate. After I removed look-ahead and added next-day fills, costs and walk-forward parameter selection, the pair has no tradable edge.
      </p>
      <Facts rows={[
        ["Sharpe", m.sharpe.toFixed(2), `95% CI ${m.sharpe_95ci[0].toFixed(2)} to ${m.sharpe_95ci[1].toFixed(2)}`],
        ["CAGR", pct(m.cagr), `${pct(kalman.metrics_0bps.cagr)} with no costs`],
        ["Max drawdown", pct(m.max_drawdown)],
        ["Round trips", String(m.round_trips), `${Math.round(m.win_rate * 100)}% wins`],
      ]} />
      <EquityChart />
      <p className="prose-w mt-4 text-base text-muted">
        5 bps per side, 0.5% a year short borrow, fills at the next close. Each quarter's parameters come from the prior two years only. Engle-Granger p-value on the selection window is {kalman.eg_p_formation.toFixed(2)}, so the pair is not cointegrated. With this few trades, the evidence is weak either way.
      </p>
      <p className="mt-4"><Ext href={LINKS.kalman}>Code and full results</Ext></p>
    </>
  );
}

function Surface() {
  return (
    <>
      <h2 className="text-3xl leading-tight">US obesity threshold surface</h2>
      <p className="prose-w mt-3">
        Option-pricing tools applied to CDC state data: how likely prevalence is to cross a level over a horizon, inverted into an implied σ surface. These are historical frequencies, not risk-neutral prices, and nothing here trades.
      </p>
      <div className="mt-6"><SurfaceTable /></div>
      <div className="prose-w mt-6 grid gap-3">
        <p><strong className="font-semibold">What broke.</strong> Taking drift from a separate model put a false spike in the surface, σ of 0.30 next to 0.03. Using one crossing curve for both removed it.</p>
        <p><strong className="font-semibold">What didn't hold up.</strong> A food-supply index correlated with obesity at 0.96, but calendar year alone reaches 0.98. Detrended, it falls to -0.19 (p=0.52), so it stays a hypothesis.</p>
      </div>
      <p className="mt-4"><Ext href={LINKS.surface}>Code and data</Ext></p>
    </>
  );
}

function Three({ built, broke, learned }: { built: string; broke: string; learned: string }) {
  return (
    <div className="prose-w mt-3 grid gap-3">
      <p><strong className="font-semibold">What I built.</strong> {built}</p>
      <p><strong className="font-semibold">What broke.</strong> {broke}</p>
      <p><strong className="font-semibold">What I learned.</strong> {learned}</p>
    </div>
  );
}

function WComms() {
  return (
    <>
      <h2 className="text-3xl leading-tight">W-Comms</h2>
      <p className="label mt-1">{W_COMMS_PUBLIC ? "Open source · MIT · TypeScript · Cloudflare Workers" : "Going public soon"}</p>
      <Three
        built="A shared, near-real-time hub for Claude Code agents and the people working on one repo: a Cloudflare Worker and Durable Object, MCP tools, hooks, a voxel-town dashboard and a learning loop that humans approve. It only coordinates. Nothing in it can trade, merge or deploy."
        broke="Sign-in failures gave no usable error until I added exact OAuth diagnostics. The town feature took three rounds of review fixes before it merged."
        learned="A hook's output is the only way into a running agent. Anything agents can share becomes instructions to the others, so humans approve it first."
      />
      <p className="mt-4">{W_COMMS_PUBLIC ? <Ext href={W_COMMS_URL}>Repository</Ext> : "Link coming when it goes public."} <span className="text-muted">Live demo coming.</span></p>
    </>
  );
}

function ThisSite() {
  return (
    <>
      <h2 className="text-3xl leading-tight">This site</h2>
      <Three
        built="A static, prerendered React site with a hand-written WebGL figure, built with Claude Code."
        broke="An audit found the old site's Kalman chart was hand-typed and its surface filled empty cells with made-up values."
        learned="Charts should read model output directly, with the source linked, so anyone can check a claim."
      />
      <p className="mt-4"><Ext href={LINKS.site}>Repository</Ext></p>
    </>
  );
}

const DETAIL: Record<ProjectId, React.ReactNode> = {
  kalman: <Kalman />, surface: <Surface />, wcomms: <WComms />, site: <ThisSite />,
};

export function Work({ project }: { project: ProjectId }) {
  return (
    <>
      <div className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[minmax(0,1fr)_340px] md:items-end">
        <div>
          <h1 className="text-5xl leading-none tracking-tight md:text-7xl">Arnav Nair</h1>
          <p className="prose-w mt-4 text-xl leading-snug">
            I do quantitative research in fixed income at Morgan Stanley, as an intern now and an analyst from January 2027. I build most of my research tools with LLM agents, and I publish the results that fail as well.
          </p>
        </div>
        <SurfaceFigure />
      </div>
      <div className="grid gap-6 pt-6 md:grid-cols-[190px_minmax(0,1fr)] md:gap-12 md:pt-8">
        <nav aria-label="Projects" className="grid grid-cols-2 content-start gap-x-6 md:sticky md:top-20 md:block">
          {(["Quant", "AI"] as const).map((group) => (
            <div key={group} className="md:mb-6">
              <h2 className="label">{group}</h2>
              <ul>
                {PROJECTS.filter((p) => p.group === group).map((p) => (
                  <li key={p.id}><a className="index-link" href={`#${p.id}`} aria-current={p.id === project ? "true" : undefined}>{p.name}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div id="project-detail" className="min-w-0 scroll-mt-4">
          {PROJECTS.map((p) => <article key={p.id} hidden={p.id !== project}>{DETAIL[p.id]}</article>)}
        </div>
      </div>
    </>
  );
}

export function Food() {
  return (
    <>
      <h1 className="text-5xl leading-none tracking-tight md:text-6xl">Food</h1>
      <p className="mt-4 text-muted">Nothing here yet.</p>
    </>
  );
}

export function Resume() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
        <h1 className="text-5xl leading-none tracking-tight md:text-6xl">Resume</h1>
        <p className="flex flex-wrap gap-x-5">
          <a className="link inline-flex min-h-[44px] items-center" href={LINKS.resumePdf} download>Download PDF</a>
          <button type="button" className="link min-h-[44px]" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide PDF" : "View PDF here"}</button>
        </p>
      </div>
      {open && <iframe title="Arnav Nair resume PDF" src={LINKS.resumePdf} className="mt-4 h-[80dvh] w-full border border-rule bg-white" loading="lazy" />}
      <ol className="mt-6 border-t border-rule">
        {experience.map((r, i) => (
          <li key={r.title} className="border-b border-rule">
            <details open={i === 1} className="py-3">
              <summary className="grid cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)] md:grid-cols-[1.25rem_minmax(0,1fr)_auto] md:gap-x-6">
                <span className="marker" aria-hidden="true" />
                <span><span className="text-xl">{r.org}</span><span className="block text-base text-muted">{r.title}{r.place ? `, ${r.place}` : ""}</span></span>
                <span className="label col-start-2 md:col-start-3">{r.dates}</span>
              </summary>
              <div className="prose-w pl-5 md:pl-[1.25rem]">
                {r.note && <p className="mt-3 text-base text-muted">{r.note}</p>}
                {r.bullets.length > 0
                  ? <ul className="mt-3 grid list-disc gap-2 pl-5 text-base">{r.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                  : <p className="mt-3 text-base text-muted">Joining full-time after the internship.</p>}
              </div>
            </details>
          </li>
        ))}
      </ol>
      <div className="mt-8 grid gap-8 text-base md:grid-cols-2">
        <div>
          <h2 className="label">Education</h2>
          <p className="mt-1 text-xl">{education.school}</p>
          <p>{education.degree}, {education.dates}</p>
          <p className="mt-1">{education.detail}</p>
          <p className="mt-1 text-muted">{education.coursework}</p>
        </div>
        <div>
          <h2 className="label">Skills</h2>
          <dl className="mt-1 grid gap-1">
            {skills.map(([k, v]) => <div key={k}><dt className="inline font-semibold">{k}: </dt><dd className="inline text-muted">{v}</dd></div>)}
          </dl>
        </div>
      </div>
    </>
  );
}

export function Contact() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="min-w-0 flex-1 basis-80">
        <h1 className="text-5xl leading-none tracking-tight md:text-6xl">Contact</h1>
        <ul className="mt-6 grid gap-1 text-xl">
          <li><a className="link inline-flex min-h-[44px] items-center" href={`mailto:${LINKS.email}`}>{LINKS.email}</a></li>
          <li><a className="link inline-flex min-h-[44px] items-center" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a className="link inline-flex min-h-[44px] items-center" href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </div>
      <img src={headshot} alt="Arnav Nair" width="160" height="160" loading="lazy" className="h-40 w-40 object-cover" />
    </div>
  );
}
