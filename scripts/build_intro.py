"""Build public/intro/hero-intro.webp from the green-screen clips: soft rim, standing pause removed.
Used with: python -I scripts/build_intro.py <clips> public/intro 960 12 55 47 65
Frames 47 to 64 are the pause. After changing them, reset CLICK_MS and CLIP_MS in src/lib/intro.ts."""
import subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter
me, out = Path(sys.argv[1]), Path(sys.argv[2])
width, fps, quality = int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5])
cut = (int(sys.argv[6]), int(sys.argv[7])) if len(sys.argv) > 7 else None
work = me / "work"; work.mkdir(exist_ok=True)
for o in work.glob("*.png"): o.unlink()
RIM = (196, 190, 178)   # neutral, so it reads as edge light and not a sticker outline
RIM_ALPHA = 0.42

def key(frame):
    rgb = np.array(frame.convert("RGB")).astype(np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    top = np.maximum(r, b); excess = g - top
    alpha = 1 - np.clip((excess - 18) / 40, 0, 1)
    clean = np.dstack([r, np.where(excess > 0, top, g), b]).clip(0, 255).astype(np.uint8)
    # Smooth the matte at source resolution, where it has detail, before any scaling.
    src = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.6))
    src = src.point(lambda v: int(np.clip((v - 70) * 255 / 115, 0, 255)))  # steepen back to a clean edge
    src = src.filter(ImageFilter.GaussianBlur(0.8))
    h = round(frame.height * width / frame.width)
    mask = src.resize((width, h), Image.LANCZOS)
    body = Image.fromarray(clean).resize((width, h), Image.LANCZOS).convert("RGBA"); body.putalpha(mask)
    rim_src = src.filter(ImageFilter.GaussianBlur(2.2)).point(lambda v: min(255, v * 3))
    rim = Image.new("RGBA", (width, h), RIM + (0,))
    rim.putalpha(rim_src.resize((width, h), Image.LANCZOS).point(lambda v: int(v * RIM_ALPHA)))
    rim.alpha_composite(body)
    return rim

index = kept = 1
for clip in ("walkon.mp4", "walkoff.mp4"):
    tmp = me / clip.split(".")[0]; tmp.mkdir(exist_ok=True)
    for o in tmp.glob("*.png"): o.unlink()
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(me / clip), "-vf", f"fps={fps}", str(tmp / "f%04d.png")], check=True)
    for p in sorted(tmp.glob("f*.png")):
        if not (cut and cut[0] <= index < cut[1]):
            key(Image.open(p)).save(work / f"o{kept:04d}.png"); kept += 1
        index += 1
target = out / "hero-intro.webp"
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-framerate", str(fps), "-i", str(work / "o%04d.png"), "-c:v", "libwebp_anim", "-lossless", "0", "-q:v", str(quality), "-loop", "1", "-an", "-pix_fmt", "yuva420p", str(target)], check=True)
print(target, f"{target.stat().st_size/1e6:.2f} MB, {kept-1} frames, {(kept-1)/fps:.2f}s")
