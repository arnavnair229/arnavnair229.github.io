import type { ReactNode } from "react";

const files = import.meta.glob("../assets/slots/*.{webp,avif,png,jpg,jpeg,svg}", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

export function slotUrl(name: string): string | null {
  const hit = Object.keys(files).find((p) => p.split("/").pop()?.replace(/\.[^.]+$/, "") === name);
  return hit ? files[hit] : null;
}

/** Shows the file named `slot` from src/assets/slots when it exists, otherwise the built-in art. See ASSETS.md. */
export function AssetSlot({ slot, alt, ratio, children }: { slot: string; alt: string; ratio: string; children: ReactNode }) {
  const url = slotUrl(slot);
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-ink" style={{ aspectRatio: ratio }} data-slot={slot}>
      {url ? <img src={url} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover" /> : children}
    </div>
  );
}
