#!/usr/bin/env python3
"""Convert webp originals to png so the z-ai image-edit CLI accepts them."""
from PIL import Image
from pathlib import Path

PUBLIC = Path("/home/z/my-project/public")
pairs = [
    ("real-zoe-original.webp", "real-zoe-input.png"),
    ("real-rumi-original.webp", "real-rumi-input.png"),
    ("real-mirae-original.webp", "real-mirae-input.png"),
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
    im.save(d, format="PNG")
    print(f"OK: {src} -> {dst} ({im.size[0]}x{im.size[1]})")
