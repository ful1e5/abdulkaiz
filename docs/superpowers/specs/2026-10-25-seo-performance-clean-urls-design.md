# SEO, performance and clean-URL overhaul

Date: 2026-10-25
Status: approved for implementation

## Goal

Take the site to 100 in every Lighthouse category that is achievable, make it
production-ready, and serve extensionless URLs for `about`, `portfolio` and
`testimonials`.

## Canonical host

`https://ful1e5.github.io/abdulkaiz/` — confirmed by the site owner as the real
production host.

`abdulkaiz.com` is referenced by every canonical, `og:url`, the sitemap and
`robots.txt`, and **does not resolve** (DNS lookup fails). Those references are
therefore actively harmful: they instruct search engines that the canonical
version of each page lives at a domain that does not exist. All of them are
repointed at the live host.

## Baseline (from the owner's PageSpeed runs, 2026-10-25)

| Category    | Mobile | Desktop |
| ----------- | ------ | ------- |
| Performance | 69     | 92      |
| Accessibility | 92   | 96      |
| Best Practices | 96  | 96      |
| SEO         | 100    | 100     |
| Agentic Browsing | 1/2 | 2/2    |

Mobile metrics: FCP 2.6s, **LCP 7.9s**, TBT 0ms, CLS 0, SI 4.9s.
Desktop metrics: FCP 0.7s, LCP 1.5s, TBT 0ms, CLS 0.093, SI 1.2s.

Scored Performance inputs in Lighthouse 13 are FCP, LCP, TBT, CLS and SI only.
The Insights and Diagnostics panels are advisory. This matters for scoping:
"efficient cache lifetimes" (1,079 KiB) is **not fixable** on GitHub Pages,
which forbids custom `Cache-Control` headers, and is score-neutral in any case.
"Minify CSS/JS" is likewise score-neutral and is deliberately skipped rather
than hand-rolled — a bespoke minifier on 3,400 lines of CSS is a correctness
risk bought with no score.

## 1. URL scheme and path resolution

```
index.html              →  index.html                 →  /abdulkaiz/
about.html              →  about/index.html           →  /abdulkaiz/about/
portfolio.html          →  portfolio/index.html       →  /abdulkaiz/portfolio/
testimonials.html       →  testimonials/index.html   →  /abdulkaiz/testimonials/
```

GitHub Pages serves `about/index.html` at `/abdulkaiz/about/`.

### Asset path resolution

Every asset reference is relative (`style.css`, `content/site.json`,
`assets/…`, `fetch('api/region')`). One directory deeper, all of them break.

Each sub-page therefore carries `<base href="../">` as the first element in
`<head>`; the root page carries none. Every relative URL then resolves
identically at any depth, and the same files keep working whether served from
`/abdulkaiz/` (GitHub Pages) or `/` (a future custom domain). This is preferred
over literal `../` prefixes, which would make each page's paths depth-dependent
and would need rewriting if a page moved.

Verified precondition: no bare `#fragment` anchors exist in any page or in
JS-generated markup. A bare fragment is the one thing `<base>` hijacks (it would
resolve to the root page), so its absence is what makes this safe.
`<link rel=canonical>` and `og:*` are absolute and unaffected.

### Internal links

Become base-relative and **identical on all four pages**: `./`,
`./#services`, `portfolio/`, `testimonials/`, `about/`, `./#service-<id>`.

### Active-nav detection

`script.js:64` uses `location.pathname.split('/').pop() || 'index.html'`. At
`/about/` that yields `''` → `'index.html'`, so **every** page would highlight
Home. Replaced with base-relative slicing:

```js
const basePath = new URL(document.baseURI).pathname; // '/abdulkaiz/' or '/'
const active = location.pathname.slice(basePath.length); // '' | 'about/' | …
```

### Legacy URLs

`about.html`, `portfolio.html`, `testimonials.html` remain as redirect stubs:
`<meta http-equiv="refresh">` + `rel=canonical` to the new URL + `noindex`.
GitHub Pages offers no server-side redirect without re-enabling Jekyll, and
inbound links exist from Upwork and LinkedIn profiles, so these preserve that
signal instead of 404ing. The stub canonicalising to the directory URL keeps
`/about` and `/about/` from being treated as duplicates.

## 2. Build step

`build.py` grows from a seed regenerator into a small generator. Constraints:

- **Never reformats hand-written page bodies.** It replaces only the content
  between markers, byte-for-byte elsewhere. The current script's habit of
  rewriting `content/seed.js` as a single flattened line destroys its
  hand-maintained formatting; the new one emits `indent=2`.
- **Idempotent**: a second run produces no diff. A `--check` mode reports drift
  for use as a pre-commit guard.

Responsibilities:

1. Inject nav and footer markup between `<!--#nav-->` / `<!--#/nav-->` and
   `<!--#footer-->` / `<!--#/footer-->` markers in all four pages, from
   `templates/nav.html` and `templates/footer.html`, substituting the service
   list and contact details from `content/site.json`.
2. Generate `sitemap.xml` and the `robots.txt` sitemap line from one page
   manifest, so canonical URLs have a single source of truth.
3. Regenerate `content/seed.js` (still the offline fallback).
4. Emit the hosting flag used to suppress the `api/region` probe on static
   hosts (§4).

Because GitHub Pages deploys from the branch, generated HTML is committed:
edit source → `python3 build.py` → commit.

## 3. Why nav and footer move into HTML

`script.js:74` and `:80` inject the header and footer at runtime. Raw HTML
therefore contains **zero internal links**: `about`, `portfolio` and
`testimonials` are unreachable to any crawler that does not execute JavaScript,
and the pages are effectively orphaned. Internal linking is a genuine ranking
input, so this is the most substantive SEO fix in the work — more so than
anything Lighthouse's SEO category measures (which is already 100).

`script.js` loses header/footer construction and keeps only behaviour:
current-link highlighting, mobile menu toggle, contact dialog binding.

## 4. Performance

Ordered by measured impact.

### LCP — the dominant problem

The hero portrait is a **1.1 MB PNG injected by JavaScript** (`script.js:307`,
and again at `:842` on the About page) with no dimensions, above the fold on
both pages. LCP cannot begin until `script.js` has parsed *and* four content
`fetch`es have resolved. Mobile LCP is 7.9s against a 1,039 KiB "improve image
delivery" estimate.

Fix: a real `<img>` in the HTML with explicit `width`/`height`,
`fetchpriority="high"`, `decoding="async"`, AVIF/WebP at three widths plus a
JPEG fallback via `srcset`/`sizes`, and a preload for the mobile candidate.

### Render-blocking — 1,920 ms mobile

- CSS is 76 KB and fully render-blocking. Split: critical (nav + hero) inlined
  per page, remainder loaded non-blocking.
- Two separate render-blocking Google Fonts stylesheets plus two `preconnect`s.
  Self-host subset woff2 for the weights actually used (tooling available:
  `pyftsubset`, `fontTools` 4.66.1), with `font-display: swap` and preloads for
  the above-the-fold faces. Removes both third-party connections.

### Other

- Drop the eager `<script src="content/seed.js">` tag — 38 KB on every page that
  is then duplicated by the four JSON fetches. Load on demand only when a fetch
  actually fails.
- Add explicit dimensions to every image to clear "image elements do not have
  explicit width and height" and the desktop CLS 0.093 (whose culprit the report
  names as layout shift).
- `script.js:402` `fetch('api/region')` 404s on GitHub Pages because no Functions
  runtime exists. Chrome logs the failed request, which fails Lighthouse's
  `errors-in-console` and is the sole cause of Best Practices 96. Gate it behind
  the build-emitted hosting flag; also saves a wasted round-trip.
- Non-composited animations (15 elements) and forced reflow are diagnostic-only.
  Addressed opportunistically, never at the cost of the design.

## 5. SEO

Lighthouse SEO already reads 100 because it only verifies a canonical *exists
and is well-formed*, not that it resolves. The real work:

- Repoint canonicals, `og:url`, sitemap and `robots.txt` at the live host
  (see **Canonical host** above).
- Create the missing `assets/og.png` — referenced by all four pages, 404s today.
  1200×630 typographic card in the site's monochrome house style, plus
  `og:image:width` / `height` / `alt` and `twitter:image`.
- Structured data: keep `Person` + `ProfessionalService` on home; add `FAQPage`
  (the Q&A already exists verbatim in `content/site.json`), `BreadcrumbList` on
  sub-pages, `ItemList` for the portfolio.
- Crawlable nav and footer (§3).
- Audit `<h1>` counts and heading order per page; drop the dead `keywords` meta.

## 6. Accessibility

Precise causes identified, not guessed:

| Failure | Cause | Fix |
| --- | --- | --- |
| Contrast (both form factors) | `--faint: #9a9a9a` is **2.81:1** on white, needs 4.5:1. Used as text in 9 places, including `.eyebrow` at 12.5px — far below the large-text exemption | Retune **per surface**. A single token cannot be fixed globally: `.svc-sec` has no background of its own (it sits on a viewport-pinned colour wash), and `.footer` is `background: var(--ink)` with white text. Light, wash and black each get a measured value |
| Links lack a discernible name (mobile only) | `style.css:3235` sets `display:none` on `.uplink span` below 860px. `display:none` removes the node from the accessibility tree, and the only sibling is an `aria-hidden` SVG — so the link has **no accessible name at all** | Constant `aria-label` on the anchor. This also closes the Agentic Browsing failure, which is the same element |
| Identical links, same purpose (both) | "See my work" appears twice on `index.html` — `#work` (line 129) and `portfolio.html` (line 270) | Distinct accessible names per destination |

`.vh` was audited and is correctly clip-based (`clip-path: inset(50%)`), not
`display:none`, so the hero's visually-hidden tagline is already exposed to
assistive technology. No change needed.

## 7. Target and honest limits

Committed: SEO 100, Accessibility 100, Best Practices 100, Agentic Browsing 2/2,
desktop Performance 100.

**Mobile Performance is not promised.** Mobile already scores TBT 0 and CLS 0,
banking 55 of the 100 weighted points before any change, so the headroom is
real — but LCP against a photo on emulated Slow 4G is the one input that cannot
be guaranteed ahead of measurement. Expected 95–100. If it lands short, the
actual number and the specific design trade-off involved will be reported rather
than masked by relabelling or hiding the LCP element.

## 8. Verification

- Lighthouse mobile + desktop on all four pages, served locally with the real
  `/abdulkaiz/` base path reproduced, then re-run against the deployed URL.
- Functional: legacy URLs redirect, new URLs return 200, no 404s anywhere,
  base-relative paths resolve, in-page anchors work, mobile menu works, contact
  dialog works, active-nav highlighting is correct on every page.
- `build.py --check` clean.

## Files

| Path | Change |
| --- | --- |
| `build.py` | Rewritten as generator + `--check` |
| `templates/nav.html`, `templates/footer.html` | New — single source for chrome |
| `index.html` | Head rework, markers, LCP image, no seed tag |
| `about/`, `portfolio/`, `testimonials/` `index.html` | Moved, `<base>`, head rework, markers |
| `about.html`, `portfolio.html`, `testimonials.html` | Redirect stubs |
| `script.js` | Path handling, drop chrome injection, seed fallback, region gating, image markup |
| `style.css` | Contrast tokens, critical split |
| `sitemap.xml`, `robots.txt` | Generated |
| `assets/og.png` | New social card |
| `assets/uploads/` | Optimized portrait variants |
| `assets/fonts/` | Self-hosted subset woff2 |
| `README.md` | Document build step, URL scheme, deploy |
