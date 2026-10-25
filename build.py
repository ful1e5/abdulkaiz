#!/usr/bin/env python3
"""Generates the shared chrome, sitemap, robots.txt and the offline seed.

The pages are hand-written. This script only fills the marker regions in them
(<!--#nav--> … <!--#/nav--> and <!--#footer--> … <!--#/footer-->) and writes the
generated files listed below. Everything else in a page is left byte-for-byte
alone, so running it twice produces no diff.

    python3 build.py           write generated output
    python3 build.py --check   report stale output; exit 1 if anything differs

Run it after editing templates/, content/*.json, or a page's markers.
"""

import glob
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE_URL = "https://ful1e5.github.io/abdulkaiz/"

# Set to True only when deploying somewhere that provides the Pages Functions in
# functions/api/. On a static host the region endpoint 404s, and Chrome logs the
# failed request — which fails Lighthouse's errors-in-console audit and is the
# sole cause of the Best Practices score being 96 rather than 100.
HAS_FUNCTIONS = False

# Portrait variants produced by tools/images.py.
PHOTO_WIDTHS = [400, 700, 1000]
PHOTO_ALT = "Portrait of Abdulkaiz Khatri"

# The single source of truth for which pages exist, the URL each is served at,
# and which nav entry is current on it.
PAGES = [
    {
        "file": "index.html", "path": "", "key": "home", "priority": "1.0",
        # the hero portrait is the LCP element, so it has to be in the markup
        # rather than injected by script.js after the content fetches resolve
        "photo": ("photo-hero", "(max-width: 860px) 92vw, 690px"),
    },
    {
        "file": "portfolio/index.html", "path": "portfolio/", "key": "portfolio",
        "priority": "0.8",
    },
    {
        "file": "testimonials/index.html", "path": "testimonials/", "key": "reviews",
        "priority": "0.7",
    },
    {
        "file": "about/index.html", "path": "about/", "key": "about", "priority": "0.7",
        # also above the fold on its page, so it is the LCP candidate there too
        "photo": ("photo-about", "(max-width: 860px) 340px, 360px"),
    },
]


def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as fh:
        return fh.read()


def load_content():
    out = {}
    for path in sorted(glob.glob(os.path.join(ROOT, "content", "*.json"))):
        with open(path, encoding="utf-8") as fh:
            out[os.path.basename(path)[:-5]] = json.load(fh)
    return out


def render_chrome(content, active_key):
    """Fill templates/nav.html and templates/footer.html for one page."""
    site = content.get("site", {})

    def on(match):
        key = match.group(1)
        return ' class="on" aria-current="page"' if key == active_key else ""

    nav = re.sub(r"\{\{ON:([a-z]+)\}\}", on, read("templates/nav.html"))

    services = "\n".join(
        '      <li><a href="./#service-%s">%s</a></li>'
        % (html_escape(s["id"]), html_escape(s["title"]))
        for s in site.get("services", [])
        if s.get("id") and s.get("title")
    )
    email = html_escape(site.get("email", ""))
    footer = read("templates/footer.html")
    footer = footer.replace("{{SERVICES_LIST}}", services)
    footer = footer.replace("{{EMAIL}}", email)
    return nav, footer


def html_escape(value):
    return (
        str(value)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def photo_img(sizes, eager):
    """A <picture> for the portrait.

    Width/height come from the largest variant so the browser can reserve the
    box before the bytes land (this is what the unsized-images audit and the
    layout shift both hang on). No <link rel=preload> accompanies this: the
    element sits in the markup the preload scanner already reads, and a manual
    preload whose imagesrcset did not match byte-for-byte would double-fetch.
    """
    def srcset(fmt):
        return ", ".join(
            "assets/uploads/portrait-%d.%s %dw" % (w, fmt, w) for w in PHOTO_WIDTHS
        )

    largest = PHOTO_WIDTHS[-1]
    return (
        "<picture>"
        '<source type="image/avif" sizes="%s" srcset="%s" />'
        '<source type="image/webp" sizes="%s" srcset="%s" />'
        '<img src="assets/uploads/portrait-%d.jpg" width="%d" height="%d"'
        ' alt="%s"%s decoding="async" />'
        "</picture>"
    ) % (
        sizes,
        srcset("avif"),
        sizes,
        srcset("webp"),
        largest,
        largest,
        largest,
        PHOTO_ALT,
        ' fetchpriority="high"' if eager else ' loading="lazy"',
    )


def inject(text, name, body):
    """Replace the region between a marker pair, preserving the markers."""
    pattern = re.compile(r"(<!--#%s-->)(.*?)(<!--#/%s-->)" % (name, name), re.S)
    if not pattern.search(text):
        return None
    return pattern.sub(lambda m: m.group(1) + "\n" + body + "\n" + m.group(3), text, count=1)


def apply_host_flags(text):
    """Tell the client whether the Pages Functions backend is present."""
    value = "yes" if HAS_FUNCTIONS else "no"
    return re.sub(
        r"<html([^>]*?)\sdata-functions=\"[^\"]*\"",
        r'<html\1 data-functions="%s"' % value,
        text,
        count=1,
    )


def font_style():
    """The @font-face rules, inlined into each page's head.

    Inlined rather than linked: they are ~1 KB, and a <link> would add a round
    trip on the critical path before any text could pick its face. The url()
    values inside are root-relative, which every page resolves correctly thanks
    to the <base> tag on the sub-pages.
    """
    path = os.path.join(ROOT, "assets", "fonts.css")
    if not os.path.exists(path):
        raise SystemExit("assets/fonts.css missing — run: python3 tools/fonts.py")
    with open(path, encoding="utf-8") as fh:
        return "<style>\n" + fh.read().strip() + "\n</style>"


def build_pages(content):
    """Return {path: text} for every page, with chrome injected."""
    out = {}
    faces = font_style()
    for page in PAGES:
        text = read(page["file"])
        nav, footer = render_chrome(content, page["key"])
        regions = [("nav", nav), ("footer", footer), ("fonts", faces)]
        if page.get("photo"):
            marker, sizes = page["photo"]
            regions.append((marker, photo_img(sizes, eager=True)))
        for name, body in regions:
            updated = inject(text, name, body)
            if updated is None:
                raise SystemExit(
                    "%s: missing <!--#%s--> … <!--#/%s--> markers" % (page["file"], name, name)
                )
            text = updated
        out[page["file"]] = apply_host_flags(text)
    return out


def build_sitemap():
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for page in PAGES:
        lines.append("  <url>")
        lines.append("    <loc>%s%s</loc>" % (SITE_URL, page["path"]))
        lines.append("    <priority>%s</priority>" % page["priority"])
        lines.append("  </url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def build_robots():
    return "User-agent: *\nAllow: /\nSitemap: %ssitemap.xml\n" % SITE_URL


def build_seed(content):
    """The offline fallback. Pretty-printed so it stays reviewable by hand."""
    body = json.dumps(content, ensure_ascii=False, indent=2, sort_keys=True)
    return "window.SEED = %s;\n" % body


def prettier_fmt(path, text):
    """Format generated output the way the repo's .prettierrc would.

    The pre-push hook runs `prettier --write .`, which re-indents the injected
    regions — so without this, pushing left every generated page dirty and
    --check permanently reporting stale. Formatting here instead means the
    written output already matches what prettier produces, and both tools agree
    on what "up to date" means.

    Prettier is resolved by file extension, so only extensions it parses are
    handled; the XML and text files are listed in .prettierignore anyway.
    """
    exe = shutil.which("prettier")
    ext = os.path.splitext(path)[1]
    if not exe or ext not in (".html", ".js"):
        return text
    directory = os.path.dirname(os.path.join(ROOT, path)) or ROOT
    fd, tmp = tempfile.mkstemp(suffix=ext, dir=directory)
    os.close(fd)
    try:
        with open(tmp, "w", encoding="utf-8") as fh:
            fh.write(text)
        # run from the repo root so prettier resolves the project config
        subprocess.run(
            [exe, "--write", os.path.relpath(tmp, ROOT)],
            cwd=ROOT,
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        with open(tmp, encoding="utf-8") as fh:
            return fh.read()
    except (OSError, subprocess.CalledProcessError):
        return text
    finally:
        if os.path.exists(tmp):
            os.remove(tmp)


def collect():
    content = load_content()
    files = build_pages(content)
    files["sitemap.xml"] = build_sitemap()
    files["robots.txt"] = build_robots()
    files["content/seed.js"] = build_seed(content)
    return {path: prettier_fmt(path, text) for path, text in files.items()}


def main():
    check = "--check" in sys.argv
    files = collect()
    stale = []
    for path, text in files.items():
        full = os.path.join(ROOT, path)
        current = None
        if os.path.exists(full):
            with open(full, encoding="utf-8") as fh:
                current = fh.read()
        if current == text:
            continue
        stale.append(path)
        if not check:
            os.makedirs(os.path.dirname(full) or ROOT, exist_ok=True)
            with open(full, "w", encoding="utf-8") as fh:
                fh.write(text)

    if check:
        if stale:
            print("stale (run: python3 build.py)")
            for path in stale:
                print("  " + path)
            return 1
        print("build output is up to date")
        return 0

    if stale:
        for path in stale:
            print("wrote " + path)
    else:
        print("nothing to do — all output already current")
    return 0


if __name__ == "__main__":
    sys.exit(main())
