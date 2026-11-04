/** Flip to false to show the W-Comms card as "Going public soon", with no link. */
export const W_COMMS_PUBLIC = true;
export const W_COMMS_URL = "https://github.com/arnavnair229/wcomms";

export const LINKS = {
  email: "arnavnair229@gmail.com",
  linkedin: "https://www.linkedin.com/in/arnav-nair-005b82250/",
  github: "https://github.com/arnavnair229",
  resumePdf: "/resume/Arnav_S_Nair_Resume.pdf",
  kalman: "https://github.com/arnavnair229/kalman-filter-MR",
  surface: "https://github.com/arnavnair229/obesity-vol-surface",
  site: "https://github.com/arnavnair229/arnavnair229.github.io",
};

export const NAV = [
  { id: "research", label: "Research", teaser: "Backtests that show their work", stat: "Sharpe -1.17, reported anyway" },
  { id: "projects", label: "Projects", teaser: "Built with LLM agents", stat: "W-Comms is open source" },
  { id: "portfolio", label: "Portfolio", teaser: "Everything, filterable", stat: "Quant · AI · Open Source" },
  { id: "resume", label: "Resume", teaser: "Morgan Stanley, KKR", stat: "PDF one click away" },
  { id: "contact", label: "Contact", teaser: "Let's talk", stat: "Email, LinkedIn, GitHub" },
] as const;

export type View = "home" | "food" | (typeof NAV)[number]["id"];
