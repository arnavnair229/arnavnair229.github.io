import { useState } from "react";
import portrait from "../assets/contact-portrait.webp";
import photo from "../assets/hero-photo.webp";
import { LINKS, PROJECTS } from "../config";
import { education, experience, skills } from "../data/resume";
import { CARDS, FeaturedWork } from "./FeaturedWork";

export function Portfolio({ showJagra }: { showJagra: boolean }) {
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_32%] items-center gap-4 border-b border-rule pb-8 md:grid-cols-[minmax(0,1fr)_260px] md:gap-12">
        <div>
          <h1 className="text-4xl leading-none tracking-tight md:text-7xl">Arnav Nair</h1>
          <p className="prose-w mt-4 text-lg leading-snug md:text-xl">
            I'm a Quantitative Researcher Intern in Fixed Income at Morgan Stanley, working part time before I join full time as a Quantitative Analyst in January 2027. I deploy AI within the team and push production code, bridging the gap between the markets and what AI can do for them through automation and data analysis.
          </p>
        </div>
        <img src={photo} alt="Arnav Nair in a red chair outside, holding a cup of ice cream" width="640" height="800" className="h-auto w-full rounded-2xl object-cover" />
      </div>
      <FeaturedWork showJagra={showJagra} />
      <Resume />
    </>
  );
}

export function TechnicalProjects() {
  return (
    <>
      <h1 className="text-5xl leading-none tracking-tight md:text-7xl">Technical Projects</h1>
      <div className="mt-8 grid gap-3">
        {PROJECTS.map((p) => {
          const card = CARDS.find((c) => c.id === p.id);
          return (
            <article key={p.id} id={p.id} className="panel grid scroll-mt-24 items-start gap-5 p-5 md:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
              <div className={`tech-art ${card?.tone}`}><div className="fan-media">{card?.art}</div></div>
              <div className="prose-w text-base">
                <h2 className="text-3xl leading-tight">{p.name}</h2>
                <p className="label mt-1">{card?.line}</p>
                <p className="mt-3">{p.blurb}</p>
                {"href" in p && <p className="mt-3"><a className="link" href={p.href} target="_blank" rel="noopener noreferrer">{p.link}</a></p>}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

function Resume() {
  const [open, setOpen] = useState(false);
  return (
    <section id="resume" aria-labelledby="resume-title" className="scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <h2 id="resume-title" className="text-5xl leading-none tracking-tight md:text-7xl">Resume</h2>
        <p className="flex flex-wrap gap-2">
          <a className="pill" href={LINKS.resumePdf} download>Download PDF</a>
          <button type="button" className="pill" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide PDF" : "View PDF"}</button>
        </p>
      </div>
      {open && <iframe title="Arnav Nair resume PDF" src={LINKS.resumePdf} className="mt-6 h-[80dvh] w-full rounded-2xl border border-rule bg-white" loading="lazy" />}
      <ol className="mt-8 grid gap-3">
        {experience.map((r, i) => (
          <li key={r.title} className="panel">
            <details open={i === 1}>
              <summary className="grid cursor-pointer grid-cols-[minmax(0,1fr)_1.25rem] gap-x-4 gap-y-1 p-5 md:grid-cols-[minmax(0,1fr)_auto_1.25rem] md:items-baseline md:gap-x-6">
                <span><span className="block text-2xl leading-tight">{r.org}</span><span className="block text-base text-muted">{r.title}{r.place ? `, ${r.place}` : ""}</span></span>
                <span className="label row-start-2 md:row-start-auto">{r.dates}</span>
                <span className="marker col-start-2 row-start-1 text-right md:col-start-3" aria-hidden="true" />
              </summary>
              <div className="px-5 pb-5">
                <div className="prose-w">
                  {r.note && <p className="text-base text-muted">{r.note}</p>}
                  {r.bullets.length > 0
                    ? <ul className={`grid list-disc gap-2 pl-5 text-base ${r.note ? "mt-3" : ""}`}>{r.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                    : <p className="text-base text-muted">Joining full time after the internship.</p>}
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-3 text-base md:grid-cols-2">
        <div className="panel p-5">
          <h3 className="label">Education</h3>
          <p className="mt-2 text-2xl leading-tight">{education.school}</p>
          <p className="mt-1">{education.degree}, {education.dates}</p>
          <p className="mt-1">{education.detail}</p>
          <p className="mt-1 text-muted">{education.coursework}</p>
        </div>
        <div className="panel p-5">
          <h3 className="label">Skills</h3>
          <dl className="mt-2 grid gap-1">
            {skills.map(([k, v]) => <div key={k}><dt className="inline font-semibold">{k}: </dt><dd className="inline text-muted">{v}</dd></div>)}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const rows = [
    { key: "Email", value: LINKS.email, href: `mailto:${LINKS.email}` },
    { key: "Phone", value: LINKS.phone, href: `tel:+1${LINKS.phone.replace(/\D/g, "")}` },
    { key: "LinkedIn", value: "arnav-nair-005b82250", href: LINKS.linkedin, external: true },
    { key: "GitHub", value: "arnavnair229", href: LINKS.github, external: true },
  ];
  return (
    <div className="contact">
      <img src={portrait} alt="Arnav Nair in a navy blazer" width="1000" height="880" className="contact-portrait" />
      <div>
        <h1 className="text-5xl leading-none tracking-tight md:text-6xl">Contact</h1>
        <ul className="contact-list mt-6">
          {rows.map((r) => (
            <li key={r.key}>
              <a className="contact-row" href={r.href} {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <span className="contact-key">{r.key}</span>
                <span className="contact-value">{r.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
