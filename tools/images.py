#!/usr/bin/env python3
"""Derives the web-sized portrait variants from the master image.

Run after replacing the master portrait:

    python3 tools/images.py

The master is 1000x1000. The site renders it inside a square/cropped frame and
forces it monochrome, so:
  * the grayscale and the 1.06 contrast step are baked in here rather than left
    to a CSS filter, which keeps a large element off a filter/compositing layer
    and lets AVIF store a single channel instead of three; and
  * variants stay 1:1. The hero frame is 4:5, so `object-fit: cover` trims the
    sides at render; pre-cropping to 4:5 would ship more pixels than those
    frames ever display.

Requires ImageMagick with AVIF + WebP support.
"""

import json
import os
import shutil
import subprocess
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTHS = [400, 700, 1000]
# contrast(1.06) about 0.5 is out = 1.06*in - 0.03, i.e. a level mapping of
# [2.83%, 97.17%] onto [0, 1]
LEVEL = "2.83%,97.17%"


def master():
    with open(os.path.join(ROOT, "content", "site.json"), encoding="utf-8") as fh:
        photo = json.load(fh)["photo"]
    path = os.path.join(ROOT, urllib.parse.unquote(photo))
    if not os.path.exists(path):
        sys.exit("master portrait not found: " + path)
    return path


def run(*args):
    subprocess.run(args, check=True)


def main():
    src = master()
    out_dir = os.path.join(ROOT, "assets", "uploads")
    made = []

    for width in WIDTHS:
        for fmt, extra in (
            ("avif", ["-quality", "62"]),
            ("webp", ["-quality", "78", "-define", "webp:method=6"]),
        ):
            out = os.path.join(out_dir, "portrait-%d.%s" % (width, fmt))
            run(
                "magick", src,
                "-colorspace", "Gray",
                "-level", LEVEL,
                "-resize", "%dx%d" % (width, width),
                "-strip",
                *extra,
                out,
            )
            made.append(out)

    # one broadly supported fallback for browsers with neither avif nor webp
    fallback = os.path.join(out_dir, "portrait-1000.jpg")
    run(
        "magick", src,
        "-colorspace", "Gray",
        "-level", LEVEL,
        "-resize", "1000x1000",
        "-strip",
        "-interlace", "Plane",
        "-quality", "82",
        fallback,
    )
    made.append(fallback)

    total = 0
    for path in made:
        size = os.path.getsize(path)
        total += size
        print("  %-42s %7.1f KB" % (os.path.relpath(path, ROOT), size / 1024))
    print("master: %.1f KB -> %d variants, %.1f KB total"
          % (os.path.getsize(src) / 1024, len(made), total / 1024))


if __name__ == "__main__":
    if not shutil.which("magick"):
        sys.exit("ImageMagick (magick) not found")
    main()
