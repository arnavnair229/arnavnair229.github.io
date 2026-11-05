// Bullets are taken word for word from Arnav_S_Nair_Resume_2027.pdf.
export type Role = {
  org: string;
  title: string;
  dates: string;
  place?: string;
  note?: string;
  bullets: string[];
};

export const education = {
  school: "Northeastern University",
  degree: "Bachelor of Science in Business Administration (Dean's List)",
  dates: "December 2026",
  detail: "GPA 3.9/4.0. Major: Mathematics & Finance. Minor: Data Science.",
  coursework: "Stochastic Processes, Fourier Series & PDEs, C++, Applied Econometrics, Derivatives & Risk Management, Investments",
};

export const experience: Role[] = [
  {
    org: "Morgan Stanley",
    title: "Incoming Quantitative Analyst - Fixed Income",
    dates: "Starting January 2027",
    place: "Boston, MA",
    bullets: [],
  },
  {
    org: "Morgan Stanley",
    title: "Quantitative Researcher Intern - Fixed Income",
    dates: "January 2026 – Present",
    place: "Boston, MA",
    note: "Working part time until 2027, deploying AI within the team and pushing production code.",
    bullets: [
      "Built a Python Shiny order management tool for a newly launched SMA product after identifying gaps in Charles River's cross-asset (Corporate & Municipals) data and aggregate views; enables 3 PMs/Traders to evaluate trades across yield, duration/curve risk, cash impact, sector and state allocation, and tax-aware optimizations over 5 portfolios.",
      "Reduced RMSE by 5% on an ML-driven municipal bond bid-offer pricing engine by replacing AdaBoost with XGBoost and engineering new features; conducting ongoing research into hybrid deterministic and ML-based pricing layers to improve model robustness.",
      "Automated 20+ market risk and holdings reports for PMs/Traders via SQL-driven, Python, Tableau, and Excel pipelines.",
    ],
  },
  {
    org: "KKR",
    title: "Institutional Actuarial & Risk Modeling Intern",
    dates: "June 2025 – August 2025",
    place: "New York, NY",
    bullets: [
      "Automated analysis pipelines in Python and Streamlit to visualize surrender and mortality metrics in an interactive dashboard, improving processing time by 95%.",
      "Modeled future cash flows of life and annuity products with stochastic modeling in R3S, incorporating mortality, lapse, and surrender assumptions across 10M+ policyholders.",
      "Spearheaded a DuckDB-backed, object-oriented dashboard for 5+ reinsurance deals, improving efficiency by 70% and providing a scalable framework for future deals.",
    ],
  },
  {
    org: "Kalshi Quantitative Research & Systematic Trading",
    title: "Co-developer, two-person team; built with AI coding agents",
    dates: "July 2026 – Present",
    note: "Private code. We now trade live markets and paper trade strategies. The returns below are backtests, not live results.",
    bullets: [
      "Co-developed an end-to-end ML trading system across 9 Kalshi markets, covering the entire process from data and signal generation to order execution, engineered for real-world constraints (fills, data latency, order handling); walk-forward retraining on 3M intraday rows (5+ years, 10+ sources). Backtested +313% / +753% / +613% (2024 / 2025 / 2026 YTD) on a $2,000 account under adverse-fill stress; +314% for 2026 with realistic data latency.",
      "Authored 45 of 106 research reports and ran large-scale searches (24k trials; nine 2,000-trial Optuna studies; 13,600 walk-forward configs) under purged, embargoed CV; used deflated Sharpe, PBO, shuffle nulls, and pre-registered holdouts to reject the top config of a 24k-trial search.",
      "Wrote a 40-finding validation audit of the backtester and execution engine, making backtests reproducible and closing three silent-failure paths in order handling; identified data latency as the largest backtest-to-forward gap and rebuilt walk-forward on realistic timing.",
    ],
  },
  {
    org: "HD Fund, LLC",
    title: "Head Quantitative Analyst",
    dates: "March 2025 – October 2025",
    note: "I later re-tested the public repo version of this strategy with costs and walk-forward selection. See Kalman pairs under Projects.",
    bullets: [
      "Researched, authored, and implemented a Kalman filter-based statistical arbitrage strategy, running robust backtests and achieving a 60% win rate while tuning entry and exit thresholds for 200+ trades over 3 years.",
      "Collaborated with fundamental analysts and quantitative developers to build a sentiment analysis ML model that produced revenue drivers for 15+ companies, improving accuracy of revenue forecasts by roughly 30%.",
    ],
  },
];

export const skills = [
  ["Python", "Polars, Pandas, Scikit-learn, NumPy, SciPy, Shiny, Streamlit, FastAPI"],
  ["ML", "XGBoost, Optuna, linear regression, clustering"],
  ["Other", "C++, SQL, AWS, Snowflake, Tableau, LLM agents and harness design, AI-assisted development"],
  ["Certifications", "SOA Exam P (Score: 9), WSP: Excel, Accounting & Financial Statement Analysis, Bond & Math Analysis"],
  ["Languages", "English, Mandarin, Hindi"],
] as const;
