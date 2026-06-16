#!/usr/bin/env python3
"""Replace the original quiz images with the cleaned versions (PNG -> WebP)."""
from PIL import Image
from pathlib import Path

PUBLIC = Path("/home/z/my-project/public")
pairs = [
    ("real-zoe-clean.png",   "real-zoe.webp"),
    ("real-rumi-clean.png",  "real-rumi.webp"),
    ("real-mirae-clean.png", "real-mirae.webp"),
]
for src, dst in pairs:
    s = PUBLIC / src
    d = PUBLIC / dst
    if not s.exists():
        print(f"MISSING: {s}")
        continue
    im = Image.open(s)
    if im.mode != "RGB":
        im = im.convert("RGB")
    im.save(d, format="WEBP", quality=88, method=6)
    print(f"OK: {src} -> {dst} ({im.size[0]}x{im.size[1]}, {d.stat().st_size} bytes)")

# Cleanup: remove input/clean PNGs and -original.webp backups we no longer need
for f in ["real-zoe-input.png", "real-rumi-input.png", "real-mirae-input.png",
          "real-zoe-clean.png", "real-rumi-clean.png", "real-mirae-clean.png"]:
    p = PUBLIC / f
    if p.exists():
        p.unlink()
        print(f"removed temp: {f}")
