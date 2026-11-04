import { useMemo, useRef, useState } from "react";
import kalman from "../data/kalman.json";
import { grid, maturities, strikes, forwards } from "../lib/surface";

const W = 640, H = 270, L = 72, R = 14, T = 14, B = 36;

/** Walk-forward equity from the repo's results/site-export.json. Crosshair on hover or touch, arrows on keyboard. */
export function EquityChart() {
  const pts = kalman.equity;
  const [i, setI] = useState<number | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  const { path, x, y, ticks, years } = useMemo(() => {
    const vals = pts.map((p) => p.v);
    const lo = Math.floor(Math.min(...vals, 1) * 20) / 20;
    const hi = Math.ceil(Math.max(...vals, 1) * 20) / 20;
    const x = (n: number) => L + (n / (pts.length - 1)) * (W - L - R);
    const y = (v: number) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
    const ticks: number[] = [];
    for (let v = lo; v <= hi + 1e-9; v += 0.05) ticks.push(Math.round(v * 100) / 100);
    const years = pts.map((p, n) => ({ n, yr: p.d.slice(0, 4) })).filter((p, n, a) => n === 0 || p.yr !== a[n - 1].yr);
    return { path: pts.map((p, n) => `${n ? "L" : "M"}${x(n).toFixed(1)} ${y(p.v).toFixed(1)}`).join(""), x, y, ticks, years };
  }, [pts]);

  const move = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const n = Math.round((((clientX - r.left) / r.width) * W - L) / (W - L - R) * (pts.length - 1));
    setI(Math.max(0, Math.min(pts.length - 1, n)));
  };
  const last = pts[pts.length - 1];
  const cur = i === null ? null : pts[i];

  return (
    <figure>
      <figcaption className="mb-2 text-sm font-semibold">Growth of $1, walk-forward, after 5 bps per side costs</figcaption>
      <div className="relative">
        <svg
          ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full touch-pan-y" tabIndex={0} role="img"
          aria-label={`Line chart of out-of-sample equity from ${pts[0].d} to ${last.d}. Ends at ${last.v.toFixed(2)} on a start of 1.00. Use the left and right arrow keys to read values.`}
          onPointerMove={(e) => move(e.clientX)} onPointerDown={(e) => move(e.clientX)} onPointerLeave={() => setI(null)} onBlur={() => setI(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") setI((v) => Math.min(pts.length - 1, (v ?? -1) + 1));
            if (e.key === "ArrowLeft") setI((v) => Math.max(0, (v ?? pts.length) - 1));
          }}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={t === 1 ? "#6d6d76" : "#2c2c33"} strokeWidth="1" />
              <text x={L - 8} y={y(t) + 4} textAnchor="end" fill="#b0aea6" className="num chart-text">{t.toFixed(2)}</text>
            </g>
          ))}
          {years.map((p) => <text key={p.yr} x={x(p.n)} y={H - 8} fill="#b0aea6" className="num chart-text">{p.yr}</text>)}
          <path d={path} fill="none" stroke="#ff5a4f" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {cur && i !== null && (
            <g>
              <line x1={x(i)} x2={x(i)} y1={T} y2={H - B} stroke="#f3f1ea" strokeWidth="1" opacity=".6" />
              <circle cx={x(i)} cy={y(cur.v)} r="4.500" fill="#ff5a4f" stroke="#141418" strokeWidth="2" />
            </g>
          )}
        </svg>
        <div className="num absolute right-2 top-2 rounded-md border border-line bg-ink px-2 py-1 text-xs" aria-live="polite">
          {cur ? `${cur.d}: ${cur.v.toFixed(3)}` : `End: ${last.v.toFixed(3)}`}
        </div>
      </div>
      <details className="mt-2 text-sm text-muted">
        <summary className="cursor-pointer py-2">Table view</summary>
        <div className="max-h-48 overflow-y-auto">
          <table className="num w-full text-left text-xs">
            <thead><tr><th className="py-1">Date</th><th>Equity</th></tr></thead>
            <tbody>{pts.filter((_, n) => n % 20 === 0 || n === pts.length - 1).map((p) => <tr key={p.d}><td className="py-0.5">{p.d}</td><td>{p.v.toFixed(3)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

const MAX_SIGMA = Math.max(...grid.flat().filter((v): v is number => v !== null));

/** The surface as a table: every value readable, empty cells shown as empty. */
export function SurfaceTable() {
  return (
    <figure>
      <figcaption className="mb-2 text-sm font-semibold">Implied σ (logit scale) by threshold and horizon</figcaption>
      <div className="overflow-x-auto">
        <table className="num w-full min-w-[440px] border-separate border-spacing-0.5 text-center text-xs">
          <thead>
            <tr>
              <th scope="col" className="p-1 text-left font-normal text-muted">T \ K</th>
              {strikes.map((k) => <th key={k} scope="col" className="p-1 font-normal text-muted">{k}%</th>)}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, r) => (
              <tr key={maturities[r]}>
                <th scope="row" className="p-1 text-left font-normal text-muted">{maturities[r]}y</th>
                {row.map((v, c) => (
                  <td key={c} className="rounded p-1.5" title={v === null ? "No usable probability" : `K=${strikes[c]}%, T=${maturities[r]}y`}
                    style={{ background: v === null ? "transparent" : `color-mix(in oklab, #ff5a4f ${Math.round((v / MAX_SIGMA) * 58)}%, #1b1b20)` }}>
                    {v === null ? <span className="text-muted">n/a</span> : v.toFixed(3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-muted">
        Brighter means higher σ. n/a means the crossing probability was outside 1% to 99%, so the cell is left empty. Implied forward: {forwards["1"]}% at 1y, {forwards["10"]}% at 10y.
      </p>
    </figure>
  );
}

export function Sparkline() {
  const pts = kalman.equity;
  const vals = pts.map((p) => p.v);
  const lo = Math.min(...vals), hi = Math.max(...vals);
  const d = pts.map((p, n) => `${n ? "L" : "M"}${((n / (pts.length - 1)) * 320).toFixed(1)} ${(170 - ((p.v - lo) / (hi - lo)) * 140).toFixed(1)}`).join("");
  return <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden="true"><path d={d} fill="none" stroke="#ff5a4f" strokeWidth="2.500" /></svg>;
}

export function MiniSurface() {
  return (
    <div className="grid h-full w-full gap-0.5 p-2" style={{ gridTemplateColumns: `repeat(${strikes.length}, 1fr)` }} aria-hidden="true">
      {grid.flat().map((v, i) => <div key={i} className="rounded-sm" style={{ background: v === null ? "#141418" : `color-mix(in oklab, #ff5a4f ${Math.round((v / MAX_SIGMA) * 90)}%, #1b1b20)` }} />)}
    </div>
  );
}
