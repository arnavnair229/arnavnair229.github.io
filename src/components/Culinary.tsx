import { useEffect, useRef } from "react";
import bottles from "../assets/jagra-bottles.webp";
import community from "../assets/jagra-community.webp";
import lab from "../assets/jagra-lab.webp";
import { LINKS } from "../config";

/** Words and photos dissolve at the top and bottom of the screen, whichever way you scroll. The fades are set per element, in screen position. */
function useFlow() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = [...(root.current?.querySelectorAll<HTMLElement>(".flow") ?? [])];
    let frame = 0;
    const place = () => {
      frame = 0;
      if (!root.current?.offsetHeight) return;
      const header = document.querySelector<HTMLElement>(".site-header")?.offsetHeight ?? 0;
      const vh = innerHeight;
      const zone = vh * 0.2;
      // The first scene starts right under the header, so the top fade grows in once scrolling begins.
      const topZone = zone * Math.min(1, scrollY / zone);
      items.forEach((el) => {
        const top = el.getBoundingClientRect().top;
        el.style.maskImage = `linear-gradient(transparent ${header - top}px, #000 ${header + topZone - top}px, #000 ${vh - zone - top}px, transparent ${vh - top}px)`;
      });
    };
    const queue = () => { frame ||= requestAnimationFrame(place); };
    addEventListener("scroll", queue, { passive: true });
    // Also fires when the tab is shown, since the section measures 0 while hidden.
    const resize = new ResizeObserver(queue);
    if (root.current) resize.observe(root.current);
    return () => { removeEventListener("scroll", queue); resize.disconnect(); cancelAnimationFrame(frame); };
  }, []);
  return root;
}

export function Culinary() {
  const root = useFlow();
  return (
    <div ref={root}>
      <div className="scene scene-1">
        <div className="scene-inner grid items-center gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10">
          <div className="flow">
            <h1 className="story-title"><a className="story-link" href="#jagra">Jagra</a></h1>
            <p className="story-text mt-4">Heritage made healthy. A functional, Indian-inspired beverage I'm building with my co-founder, Yuvraj. The idea goes back further than the first bottle.</p>
          </div>
          <figure className="flow">
            <img src={community} alt="A group on a lawn, with two people kneeling in front holding up Jagra bottles" width="1600" height="932" loading="lazy" className="story-photo" />
            <figcaption className="story-note mt-2">Early bottles, and some of the people we're making them for.</figcaption>
          </figure>
        </div>
      </div>

      <div className="scene scene-2">
        <div className="scene-inner flow mx-auto !max-w-[58ch] text-center">
          <h2 className="story-h2">It started at home.</h2>
          <p className="story-text mt-4 !max-w-none">My dad loves to cook and loves to eat. Slowly, I picked up the same passion and the same intuition, and I kept exploring new cuisines and flavors. I've always had a knack for cooking, and it turned into optimizing ingredients for health without sacrificing taste.</p>
        </div>
      </div>

      <div className="scene scene-3">
        <div className="scene-inner grid items-center gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-10">
          <figure className="flow order-last md:order-none">
            <img src={bottles} alt="Three early Jagra bottles on a glass table, labeled Heritage Made Healthy" width="992" height="888" loading="lazy" className="story-photo" />
            <figcaption className="story-note mt-2">Early bottles, labels on.</figcaption>
          </figure>
          <div className="flow">
            <h2 className="story-h2">Tradition shouldn't come at a cost.</h2>
            <p className="story-text mt-4 !max-w-[42ch]">That's when I realized there aren't many traditional drinks and foods in the Indian community that aren't juiced up with added processed sugar and unhealthy fats. So Yuvraj and I set out on a mission to build a brand that changes that.</p>
          </div>
        </div>
      </div>

      <div className="scene scene-4">
        <div className="scene-inner grid items-center gap-6 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-10">
          <div className="flow">
            <h2 className="story-h2">In the lab.</h2>
            <p className="story-text mt-4">That mission has us developing the flavors, figuring out our brand image and talking to manufacturers to get a product out there.</p>
          </div>
          <figure className="flow">
            <img src={lab} alt="Two people in a kitchen, with a laptop and ingredients on the counter between them" width="1052" height="1124" loading="lazy" className="story-photo" />
            <figcaption className="story-note mt-2">The lab, for now, is a kitchen counter.</figcaption>
          </figure>
        </div>
      </div>

      <div className="scene scene-5">
        <div className="flow">
          <p className="story-note">Jagra</p>
          <h2 className="story-soon mt-3">Coming soon</h2>
          <p className="story-text mx-auto mt-6">Heritage made healthy.</p>
          <p className="mt-4"><a className="story-link inline-flex min-h-[44px] items-center" href={LINKS.jagra} target="_blank" rel="noopener noreferrer">Visit the site</a></p>
        </div>
      </div>
    </div>
  );
}
