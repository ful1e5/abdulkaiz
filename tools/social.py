#!/usr/bin/env python3
"""Generates assets/og.png, the social share card.

All four pages reference it as og:image / twitter:image; without it every share
renders a blank preview.

    python3 tools/social.py

Typographic, in the site's own house style: the same near-black surface as the
footer, the same monochrome palette, and the site's actual Poppins rather than a
lookalike. The woff2 subsets in assets/fonts are converted to TTF for the render
(Pillow cannot read woff2).

Rendered with Pillow rather than `magick -annotate`: ImageMagick cannot use the
TTFs fontTools produces here, and it fails *silently* — exit 0, no warning, and
a card with no text on it. Pillow's FreeType path reads them correctly.

Needs Pillow and fontTools. Run tools/fonts.py first if assets/fonts is empty.
"""

import os
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630

INK = "#0a0a0a"  # --ink, the footer surface
WHITE = "#ffffff"
MUTED = "#9a9a9a"  # 7.0:1 on the surface above
LINE = "#2a2a2a"  # --line-dark

NAME = "Abdulkaiz Khatri"
ROLE = "Licensed Design Engineer & Automation Expert"
PAD = 88
NAME_PT, ROLE_PT = 82, 30
NAME_BASE, ROLE_BASE = 320, 392


def ttf(weight, tmpdir):
    """Convert a self-hosted woff2 subset to a TTF Pillow can load."""
    from fontTools.ttLib import TTFont

    src = os.path.join(ROOT, "assets", "fonts", "poppins-%d.woff2" % weight)
    if not os.path.exists(src):
        sys.exit("missing %s — run: python3 tools/fonts.py" % src)
    dst = os.path.join(tmpdir, "poppins-%d.ttf" % weight)
    font = TTFont(src)
    font.flavor = None  # woff2 -> raw sfnt
    font.save(dst)
    return dst


def main():
    from PIL import Image, ImageDraw, ImageFont

    out = os.path.join(ROOT, "assets", "og.png")
    tmpdir = tempfile.mkdtemp(prefix="ogcard-")
    try:
        semibold = ImageFont.truetype(ttf(600, tmpdir), NAME_PT)
        regular = ImageFont.truetype(ttf(400, tmpdir), ROLE_PT)
    except OSError as exc:
        sys.exit("could not load the Poppins subsets: %s" % exc)

    img = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(img)

    # a hairline above the name, echoing the site's rules
    draw.rectangle([PAD, 224, W - PAD, 225], fill=LINE)

    # anchor "ls" = left edge, baseline — keeps the two lines on a known grid
    draw.text((PAD, NAME_BASE), NAME, font=semibold, fill=WHITE, anchor="ls")
    draw.text((PAD, ROLE_BASE), ROLE, font=regular, fill=MUTED, anchor="ls")

    # fail loudly rather than shipping a blank card, which is what ImageMagick
    # did here: nothing above is allowed to silently do nothing
    name_w = draw.textlength(NAME, font=semibold)
    if name_w > W - 2 * PAD:
        sys.exit("name overflows the card: %.0fpx > %dpx" % (name_w, W - 2 * PAD))
    if not img.getcolors(maxcolors=1 << 20) or len(img.getcolors(maxcolors=1 << 20)) < 3:
        sys.exit("card rendered with no text — check the font files")

    img.save(out, optimize=True)
    print(
        "wrote assets/og.png  %dx%d  %.1f KB  (name %.0fpx wide, %dpx available)"
        % (W, H, os.path.getsize(out) / 1024, name_w, W - 2 * PAD)
    )


if __name__ == "__main__":
    main()
