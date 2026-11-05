import { useEffect, useRef } from "react";
import jagraImg from "../assets/card-jagra.webp";
import wcommsImg from "../assets/card-wcomms.webp";
import kalman from "../data/kalman.json";
import type { ProjectId } from "../config";
import { KalmanChart } from "./KalmanChart";
import { VolCanvas } from "./VolCanvas";

/** Figures from the resume. The code is private, so the tile has no link. */
const KALSHI_FACTS = [["9", "Kalshi markets"], ["3M", "intraday rows"], ["24k", "trial search, top config rejected"]];

const CARDS: { id: ProjectId; name: string; line: string; tone: string; art: React.ReactNode }[] = [
  {
    id: "kalman", name: "Kalman pairs", line: `Walk-forward Sharpe of ${kalman.metrics.sharpe.toFixed(2)} after costs`, tone: "fan-card-a",
    art: <KalmanChart />,
  },
  { id: "surface", name: "Obesity surface", line: "Implied σ of US obesity thresholds, backtested on CDC data", tone: "fan-card-b", art: <VolCanvas className="absolute inset-0 h-full w-full" /> },
  {
    id: "kalshi", name: "Kalshi trading", line: "ML trading system. Private code, and all results are backtests", tone: "fan-card-e",
    art: (
      <dl className="grid h-full content-center gap-3 px-1">
        {KALSHI_FACTS.map(([v, k]) => <div key={k} className="flex items-baseline gap-3"><dd className="w-[4.5rem] flex-none text-4xl leading-none md:w-24 md:text-5xl">{v}</dd><dt className="label fan-line">{k}</dt></div>)}
      </dl>
    ),
  },
  {
    id: "wcomms", name: "W-Comms", line: "A shared hub for Claude Code agents and the people on one repo", tone: "fan-card-c",
    art: <img src={wcommsImg} alt="The W-Comms town dashboard, where each task is a tower its owner is building" decoding="async" className="object-cover object-left" />,
  },
  {
    id: "jagra", name: "Jagra", line: "Teaser site for a South Asian-inspired functional drinks brand", tone: "fan-card-d",
    art: <img src={jagraImg} alt="Three Jagra bottles: Masala Chai, Mango Lassi and Kesar Pista" decoding="async" className="object-cover object-bottom" />,
  },
];

/** Where the track starts and stops, in card positions: the first card's centre on the right edge, the last card's on the left. */
const range = (w: number, step: number) => [-(w / 2) / step, CARDS.length - 1 + w / 2 / step];

/** Cards ride a circle much wider than the screen, so scrolling carries them along a shallow arc while the stage is pinned. */
export function FeaturedWork() {
  const root = useRef<HTMLElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  const stepOf = (w: number) => (items.current[0]?.offsetWidth ?? 0) + Math.max(24, w * 0.06);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const place = () => {
      frame = 0;
      const box = root.current?.getBoundingClientRect();
      const w = innerWidth, step = stepOf(w);
      if (!box || !box.height || !step) return;
      const p = Math.min(1, Math.max(0, -box.top / (box.height - innerHeight)));
      const [from, to] = range(w, step);
      const t = from + (to - from) * p;
      const radius = w * (w < 768 ? 6 : 3);
      items.current.forEach((el, i) => {
        const a = ((i - t) * step) / radius;
        if (el) el.style.transform = `translate(-50%, -50%) translate(${radius * Math.sin(a)}px, ${radius * (1 - Math.cos(a))}px) rotate(${a}rad)`;
      });
    };
    const queue = () => { frame ||= requestAnimationFrame(place); };
    addEventListener("scroll", queue, { passive: true });
    // Also fires when the Projects tab is shown again, since the section measures 0 while hidden.
    const resize = new ResizeObserver(queue);
    if (root.current) resize.observe(root.current);
    place();
    return () => { removeEventListener("scroll", queue); resize.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  /** A card reached with Tab can be off-screen, so scroll to the point where it is centred. */
  const reveal = (i: number, link: HTMLAnchorElement) => {
    const box = root.current?.getBoundingClientRect();
    if (!box || !link.matches(":focus-visible") || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [from, to] = range(innerWidth, stepOf(innerWidth));
    scrollTo(0, scrollY + box.top + ((i - from) / (to - from)) * (box.height - innerHeight));
  };

  return (
    <section ref={root} aria-labelledby="featured-title" className="fan">
      <div className="fan-stage">
        <h2 id="featured-title" className="fan-title">Featured work</h2>
        <ul className="fan-track">
          {CARDS.map((c, i) => (
            <li key={c.name} ref={(el) => { items.current[i] = el; }} className="fan-item">
              <a href={`#${c.id}`} className={`fan-card ${c.tone}`} onFocus={(e) => reveal(i, e.currentTarget)}>
                <div className="fan-media">{c.art}</div>
                <h3 className="mt-4 text-3xl leading-tight md:text-4xl">{c.name}</h3>
                <p className="label fan-line">{c.line}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
