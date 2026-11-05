import data from "../data/surface.json";

const LOW_STRIKE = 30;
const HIGH_STRIKE = 42;

const allStrikes = data.axes.x.values as number[];
const first = allStrikes.indexOf(LOW_STRIKE);
const last = allStrikes.indexOf(HIGH_STRIKE);

export const strikes = allStrikes.slice(first, last + 1);
export const maturities = data.axes.y.values as number[];
const grid = (data.crossing.grid as number[][]).map((row) => row.slice(first, last + 1));

function seg(values: number[], v: number) {
  let i = 0;
  while (i < values.length - 2 && v > values[i + 1]) i++;
  return [i, (v - values[i]) / (values[i + 1] - values[i])] as const;
}

/** Bilinear chance of crossing strike k (%) within t years, from 0 to 1. */
export function crossingAt(k: number, t: number): number {
  const [ci, cf] = seg(strikes, k);
  const [ri, rf] = seg(maturities, t);
  return (1 - rf) * ((1 - cf) * grid[ri][ci] + cf * grid[ri][ci + 1]) + rf * ((1 - cf) * grid[ri + 1][ci] + cf * grid[ri + 1][ci + 1]);
}
