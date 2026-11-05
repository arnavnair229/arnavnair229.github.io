import { useEffect, useRef } from "react";

/** The real surface as a live wireframe, started once the page is idle. */
export function VolCanvas({ className }: { className: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = () => import("../lib/volCanvas").then(({ startVolCanvas }) => {
      if (ref.current) startVolCanvas(ref.current, reduced);
    });
    if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1500 });
    else setTimeout(start, 600);
  }, []);
  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
