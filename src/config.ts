/** Flip to false to show W-Comms as "Going public soon", with no link. */
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

export const TABS = [
  { id: "work", label: "Work" },
  { id: "food", label: "Food" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
] as const;
export type Tab = (typeof TABS)[number]["id"];

export const PROJECTS = [
  { id: "kalman", group: "Quant", name: "Kalman pairs" },
  { id: "surface", group: "Quant", name: "Obesity surface" },
  { id: "wcomms", group: "AI", name: "W-Comms" },
  { id: "site", group: "AI", name: "This site" },
] as const;
export type ProjectId = (typeof PROJECTS)[number]["id"];
