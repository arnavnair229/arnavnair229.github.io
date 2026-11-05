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
  { id: "food", label: "Food" },
  { id: "contact", label: "Contact" },
] as const;
export type Tab = (typeof TABS)[number]["id"];

/** The tiles under the featured cards. Edit the blurbs here. */
export const PROJECTS = [
  {
    id: "kalman", name: "Kalman pairs", link: "Code and full results", href: LINKS.kalman,
    blurb: "A dynamic hedge ratio on EWH/EWZ. My first backtest had a 60% win rate. Then I removed the look-ahead and added next-day fills, costs and walk-forward parameter selection, and the edge went away.",
  },
  {
    id: "surface", name: "Obesity surface", link: "Code and data", href: LINKS.surface,
    blurb: "I applied option-pricing tools to CDC state data: how likely obesity prevalence is to cross a level within a given horizon, inverted into an implied σ surface. The probabilities are historical frequencies, so nothing here trades.",
  },
  {
    id: "kalshi", name: "Kalshi trading",
    blurb: "An ML trading system I co-developed in a two-person team with AI coding agents, running from data and signals through to order execution across Kalshi markets. The code is private, so I can't share more here. All returns are backtests, not live trading.",
  },
  {
    id: "wcomms", name: "W-Comms", link: "Repository", href: LINKS.wcomms,
    blurb: "A shared, near-real-time hub for Claude Code agents and the people working on one repo, with a voxel-town dashboard and a learning loop that people approve. It only coordinates: nothing in it can trade, merge or deploy.",
  },
  {
    id: "jagra", name: "Jagra", link: "Visit the site", href: LINKS.jagra,
    blurb: "A teaser site for a premium, refrigerated, South Asian-inspired functional drinks brand. It tells the brand story, shows the three-bottle lineup and collects emails ahead of launch.",
  },
] as const;
export type ProjectId = (typeof PROJECTS)[number]["id"];
