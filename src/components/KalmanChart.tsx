import kalman from "../data/kalman.json";

const points = kalman.equity.map((p) => ({ t: Date.parse(p.d), v: p.v }));
const first = points[0];
const last = points[points.length - 1];
const TOP = 1.01;
const BOTTOM = 0.84;
const x = (t: number) => ((t - first.t) / (last.t - first.t)) * 100;
const y = (v: number) => ((TOP - v) / (TOP - BOTTOM)) * 100;
// Equity only changes when a trade closes, so it's drawn as steps.
const line = points.map((p, i) => (i ? `H${x(p.t).toFixed(2)}V${y(p.v).toFixed(2)}` : `M0 ${y(p.v).toFixed(2)}`)).join("");
const years = [2025, 2026].map((year) => ({ year, left: x(Date.UTC(year, 0, 1)) }));
const money = (v: number) => `$${v.toFixed(2)}`;

/** Growth of $1 in the walk-forward backtest, from the repo's results. Labels are HTML so they stay one size on any card. */
export function KalmanChart() {
  return (
    <figure role="img" aria-label={`Walk-forward backtest after 5 basis point costs: $1 falls to ${money(last.v)} between ${kalman.equity[0].d} and ${kalman.equity[kalman.equity.length - 1].d}`} className="flex h-full flex-col px-2 pb-2">
      <figcaption className="label">Growth of $1, walk-forward, after costs</figcaption>
      <div className="relative mt-2 min-h-0 flex-1">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
          <line x1="0" x2="100" y1={y(1)} y2={y(1)} stroke="currentColor" strokeOpacity=".35" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          <path d={line} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="label absolute left-0" style={{ top: `calc(${y(1)}% + 4px)` }}>{money(1)}</span>
        <span className="absolute right-0 text-2xl leading-none" style={{ top: `calc(${y(last.v)}% + 6px)` }}>{money(last.v)}</span>
      </div>
      <div aria-hidden="true" className="label relative mt-1 h-5 border-t border-current/30 pt-1">
        <span className="absolute left-0">2024</span>
        {years.map((m) => <span key={m.year} className="absolute" style={{ left: `${m.left}%` }}>{m.year}</span>)}
      </div>
    </figure>
  );
}
