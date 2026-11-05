import { useState } from "react";
import headshot from "../assets/about-headshot.jpg";
import photo from "../assets/hero-photo.webp";
import { LINKS, PROJECTS } from "../config";
import { education, experience, skills } from "../data/resume";
import { FeaturedWork } from "./FeaturedWork";

export function Projects() {
  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_32%] items-center gap-4 border-b border-rule pb-8 md:grid-cols-[minmax(0,1fr)_260px] md:gap-12">
        <div>
          <h1 className="text-4xl leading-none tracking-tight md:text-7xl">Arnav Nair</h1>
          <p className="prose-w mt-4 text-lg leading-snug md:text-xl">
            I do quantitative research in fixed income at Morgan Stanley, as an intern now and an analyst from January 2027. I also enjoy using AI to develop ideas and bring them to fruition.
          </p>
        </div>
        <img src={photo} alt="Arnav Nair in a red chair outside, holding a cup of ice cream" width="640" height="800" className="h-auto w-full rounded-2xl object-cover" />
      </div>
      <FeaturedWork />
      <h2 className="label">More on each project</h2>
      <div className="mt-3 grid items-start gap-3 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <details
            key={p.id} id={p.id} className="panel scroll-mt-24"
            onToggle={(e) => { if (!e.currentTarget.open && location.hash === `#${p.id}`) history.replaceState(null, "", "#projects"); }}
          >
            <summary className="flex min-h-[44px] cursor-pointer items-center justify-between gap-4 p-5">
              <span className="text-2xl leading-tight">{p.name}</span>
              <span className="marker" aria-hidden="true" />
            </summary>
            <div className="px-5 pb-5 text-base">
              <p>{p.blurb}</p>
              {"href" in p && <p className="mt-3"><a className="link" href={p.href} target="_blank" rel="noopener noreferrer">{p.link}</a></p>}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}


export function Resume() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <h1 className="text-5xl leading-none tracking-tight md:text-7xl">Resume</h1>
        <p className="flex flex-wrap gap-2">
          <a className="pill" href={LINKS.resumePdf} download>Download PDF</a>
          <button type="button" className="pill" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide PDF" : "View PDF here"}</button>
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
                    : <p className="text-base text-muted">Joining full-time after the internship.</p>}
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <div className="mt-3 grid gap-3 text-base md:grid-cols-2">
        <div className="panel p-5">
          <h2 className="label">Education</h2>
          <p className="mt-2 text-2xl leading-tight">{education.school}</p>
          <p className="mt-1">{education.degree}, {education.dates}</p>
          <p className="mt-1">{education.detail}</p>
          <p className="mt-1 text-muted">{education.coursework}</p>
        </div>
        <div className="panel p-5">
          <h2 className="label">Skills</h2>
          <dl className="mt-2 grid gap-1">
            {skills.map(([k, v]) => <div key={k}><dt className="inline font-semibold">{k}: </dt><dd className="inline text-muted">{v}</dd></div>)}
          </dl>
        </div>
      </div>
    </>
  );
}

export function Contact() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="min-w-0 flex-1 basis-80">
        <h1 className="text-5xl leading-none tracking-tight md:text-6xl">Contact</h1>
        <ul className="mt-6 grid gap-1 text-xl">
          <li><a className="link inline-flex min-h-[44px] items-center" href={`mailto:${LINKS.email}`}>{LINKS.email}</a></li>
          <li><a className="link inline-flex min-h-[44px] items-center" href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
          <li><a className="link inline-flex min-h-[44px] items-center" href={LINKS.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </div>
      <img src={headshot} alt="Arnav Nair" width="160" height="160" loading="lazy" className="h-40 w-40 object-cover" />
    </div>
  );
}
