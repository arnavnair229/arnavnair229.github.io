import data from "../data/surface.json";

export const strikes = data.axes.x.values as number[];
export const maturities = data.axes.y.values as number[];
export const grid = data.surface.grid as (number | null)[][];
export const spotPct = data.metadata.spot_obesity_pct;
export const forwards = data.implied_forward_pct as Record<string, number | null>;

/** Columns with data at every maturity. Empty strikes are left out, never filled. */
export const validCols = strikes.map((_, c) => c).filter((c) => grid.every((row) => row[c] !== null));

function seg(values: number[], v: number) {
  let i = 0;
  while (i < values.length - 2 && v > values[i + 1]) i++;
  return [i, (v - values[i]) / (values[i + 1] - values[i])] as const;
}

/** Bilinear sigma at real (K, T) coordinates, inside the region that has data. */
export function sigmaAt(k: number, t: number): number {
  const ks = validCols.map((c) => strikes[c]);
  const [ci, cf] = seg(ks, k);
  const [ri, rf] = seg(maturities, t);
  const v = (r: number, c: number) => grid[r][validCols[c]] as number;
  return (1 - rf) * ((1 - cf) * v(ri, ci) + cf * v(ri, ci + 1)) + rf * ((1 - cf) * v(ri + 1, ci) + cf * v(ri + 1, ci + 1));
}
