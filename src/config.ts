export const LINKS = {
  email: "arnavnair229@gmail.com",
  linkedin: "https://www.linkedin.com/in/arnav-nair-005b82250/",
  github: "https://github.com/arnavnair229",
  resumePdf: "/resume/Arnav_S_Nair_Resume.pdf",
  kalman: "https://github.com/arnavnair229/kalman-filter-MR",
  surface: "https://github.com/arnavnair229/obesity-vol-surface",
  wcomms: "https://github.com/arnavnair229/wcomms",
  jagra: "https://jagra-one.vercel.app/",
};

export const TABS = [
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
] as const;
export type Tab = (typeof TABS)[number]["id"];

/** The tiles under the featured cards. Edit the blurbs here. */
export const PROJECTS = [
  {
    id: "kalman", name: "Kalman pairs", link: "Code and full results", href: LINKS.kalman,
    blurb: "At HD Fund I researched and built a Kalman filter statistical arbitrage strategy, backtested at a 60% win rate over 200+ trades and 3 years. I later re-tested the public repo version on EWH/EWZ with no look-ahead, next-day fills, costs and walk-forward parameter selection, and the edge went away.",
  },
  {
    id: "surface", name: "Obesity surface", link: "Code and data", href: LINKS.surface,
    blurb: "I applied option-pricing tools to CDC state data: how likely obesity prevalence is to cross a level within a given horizon, inverted into an implied σ surface. Then I backtested it. A default setting in my model was flattening the curves, so forecasts of 68% were coming true 91% of the time. With it removed, they came true 65% of the time. On 2025, a year the models never saw, the fix won at 1 year and lost at 3, and the forecasts ran high at every horizon, since the rise in obesity looks to have paused. The probabilities are historical frequencies, so nothing here trades.",
  },
  {
    id: "kalshi", name: "Kalshi trading",
    blurb: "An end-to-end ML trading system across 9 Kalshi markets, co-developed in a two-person team with AI coding agents, from data and signals through to order execution. I authored 45 of 106 research reports, used deflated Sharpe, PBO, shuffle nulls and pre-registered holdouts to reject the top config of a 24k-trial search, and wrote a 40-finding audit of the backtester and execution engine. We now trade live markets and paper trade strategies. The code is private, and the returns on my resume are backtests, not live results.",
  },
  {
    id: "wcomms", name: "W-Comms", link: "Repository", href: LINKS.wcomms,
    blurb: "A shared, near-real-time hub for Claude Code agents and the people working on one repo, with a voxel-town dashboard and a learning loop that people approve. It only coordinates: nothing in it can trade, merge or deploy.",
  },
  {
    id: "jagra", name: "Jagra", link: "Visit the site", href: LINKS.jagra,
    blurb: "A functional, Indian-inspired beverage: heritage made healthy. This is its teaser site, with the three-bottle lineup and an email list ahead of launch.",
  },
] as const;
export type ProjectId = (typeof PROJECTS)[number]["id"];
