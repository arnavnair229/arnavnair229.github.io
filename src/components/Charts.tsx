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
      <figcaption className="label mb-2">Growth of $1, walk-forward, after 5 bps per side costs</figcaption>
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
              <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={t === 1 ? "#8a8578" : "#d3cdbe"} strokeWidth="1" />
              <text x={L - 8} y={y(t) + 4} textAnchor="end" fill="#5c584e" className="chart-text">{t.toFixed(2)}</text>
            </g>
          ))}
          {years.map((p) => <text key={p.yr} x={x(p.n)} y={H - 8} fill="#5c584e" className="chart-text">{p.yr}</text>)}
          <path d={path} fill="none" stroke="#b32a18" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          {cur && i !== null && (
            <g>
              <line x1={x(i)} x2={x(i)} y1={T} y2={H - B} stroke="#16150f" strokeWidth="1" opacity=".5" />
              <circle cx={x(i)} cy={y(cur.v)} r="4.500" fill="#b32a18" stroke="#f6f3ec" strokeWidth="2" />
            </g>
          )}
        </svg>
        <div className="num absolute right-0 top-0 bg-paper pl-2" aria-live="polite">
          {cur ? `${cur.d}: ${cur.v.toFixed(3)}` : `End: ${last.v.toFixed(3)}`}
        </div>
      </div>
      <details className="label mt-1">
        <summary className="flex min-h-[44px] cursor-pointer items-center gap-2"><span className="marker" aria-hidden="true" /> Data as a table</summary>
        <div className="max-h-48 overflow-y-auto">
          <table className="num w-full text-left">
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
      <figcaption className="label mb-2">Implied σ (logit scale) by threshold and horizon</figcaption>
      <div className="overflow-x-auto">
        <table className="num w-full min-w-[440px] border-collapse text-center text-[0.8125rem]">
          <thead>
            <tr>
              <th scope="col" className="p-1 text-left font-normal text-muted whitespace-nowrap">T \ K</th>
              {strikes.map((k) => <th key={k} scope="col" className="p-1 font-normal text-muted">{k}%</th>)}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, r) => (
              <tr key={maturities[r]}>
                <th scope="row" className="p-1 text-left font-normal text-muted">{maturities[r]}y</th>
                {row.map((v, c) => (
                  <td key={c} className="p-1.5" title={v === null ? "No usable probability" : `K=${strikes[c]}%, T=${maturities[r]}y`}
                    style={{ background: v === null ? "transparent" : `color-mix(in oklab, #b32a18 ${Math.round((v / MAX_SIGMA) * 34)}%, #f6f3ec)` }}>
                    {v === null ? <span className="text-muted">n/a</span> : v.toFixed(3)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="label mt-2 prose-w">
        Darker means higher σ. n/a means the crossing probability was outside 1% to 99%, so I left the cell empty. Implied forward: {forwards["1"]}% at 1y, {forwards["10"]}% at 10y.
      </p>
    </figure>
  );
}
