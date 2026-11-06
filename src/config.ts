export const LINKS = {
  email: "arnavnair229@gmail.com",
  phone: "(609) 203-0694",
  linkedin: "https://www.linkedin.com/in/arnav-nair-005b82250/",
  github: "https://github.com/arnavnair229",
  resumePdf: "/resume/Arnav_S_Nair_Resume.pdf",
  kalman: "https://github.com/arnavnair229/kalman-filter-MR",
  surface: "https://github.com/arnavnair229/obesity-vol-surface",
  wcomms: "https://github.com/arnavnair229/wcomms",
  jagra: "https://jagra-one.vercel.app/",
};

export const TABS = [
  { id: "portfolio", label: "Portfolio" },
  { id: "technical", label: "Technical Projects" },
  { id: "culinary", label: "Culinary" },
  { id: "contact", label: "Contact" },
] as const;
export type Tab = (typeof TABS)[number]["id"];

/** The Technical Projects tab. Edit the blurbs here. */
export const PROJECTS = [
  {
    id: "kalman", name: "Kalman pairs", link: "Code and full results", href: LINKS.kalman,
    blurb: "At HD Fund I researched and built a Kalman filter statistical arbitrage strategy, backtested at a 60% win rate over 200+ trades and 3 years. I later re-tested the public repo version on EWH/EWZ with no look-ahead, next-day fills, costs and walk-forward parameter selection, and the edge went away.",
  },
  {
    id: "surface", name: "Obesity surface", link: "Code and data", href: LINKS.surface,
    blurb: "This comes from my concern about how Americans eat and what it's doing to their health. I treated CDC obesity data like an options market, pricing the chance of crossing each level by horizon. The forward curve points to 38% in 10 years, but spot has been flat since 2021, with 68% of adults overweight or obese. That plateau doesn't look like better eating: more adults now skip fruit and vegetables daily than in 2017. Each point of obesity is about 2.7 million adults and $5 billion a year in excess medical costs. Backtests show where the model fails, and my state-level food tests didn't confirm a causal link, so that remains a hypothesis. The probabilities are historical frequencies, so nothing here trades.",
  },
  {
    id: "kalshi", name: "Kalshi trading",
    blurb: "An end-to-end ML trading system across 9 Kalshi markets, co-developed in a two-person team with AI coding agents, from data and signals through to order execution. I authored 45 of 106 research reports, used deflated Sharpe, PBO, shuffle nulls and pre-registered holdouts to reject the top config of a 24k-trial search, and wrote a 40-finding audit of the backtester and execution engine. We now trade live markets and paper trade strategies. The code is private, and the returns on my resume are backtests, not live results.",
  },
  {
    id: "wcomms", name: "W-Comms", link: "Repository", href: LINKS.wcomms,
    blurb: "A shared, near-real-time hub for Claude Code agents and the people working on one repo, with a voxel-town dashboard and a learning loop that people approve. It only coordinates: nothing in it can trade, merge or deploy.",
  },
] as const;
export type ProjectId = (typeof PROJECTS)[number]["id"];
