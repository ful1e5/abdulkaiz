# abdulkaiz.com

Static site (plain HTML/CSS/JS) that renders its content from `content/*.json`.
Optional Cloudflare Pages Functions in `functions/api/*` add email delivery and
region-aware pricing; on plain static hosts (GitHub Pages, S3, etc.) the site
still works using its client-side fallbacks.

## Content

Everything visible on the site comes from four JSON files, all directly editable:

| File | Drives |
| --- | --- |
| `content/site.json` | Contact details, intro video, About copy, stats, services, process, experience, education, hero logos, headings |
| `content/portfolio.json` | Portfolio projects and the homepage marquee |
| `content/testimonials.json` | Client reviews |
| `content/pricing.json` | Pricing packages, retainers and regional multipliers |

`content/seed.js` is a generated, inlined copy of those four files (`window.SEED`)
used as an offline fallback so pages still render if a JSON request fails.
Regenerate it after editing any JSON:

```bash
python3 build.py
```

## Deploy

### Cloudflare Pages (full features)

Connect the repo. Build command: `python3 build.py` (optional) or leave empty.
Output directory: `/`.

### GitHub Pages (static only)

Serve the repository root. A `.nojekyll` file is included so the tree is
published as-is. On this host:

- the contact form opens the visitor's email app with the message prefilled
  (no server needed);
- regional pricing falls back to the visitor's timezone/locale instead of
  geo-detection.

## Contact form (Cloudflare Pages only)

Stores every message and emails a copy. In the Pages project settings:

1. **KV** — create a namespace (e.g. `leads`) and bind it as `LEADS`. Each
   message is stored as `lead:<time>:<id>`; a per-IP rate-limit key is set for
   60 seconds.
2. **Email** via [Resend](https://resend.com) — set `RESEND_API_KEY` (secret),
   `TO_EMAIL`, and `FROM_EMAIL` (e.g. `Website <hello@abdulkaiz.com>`).
3. Redeploy. If both storage and email fail, the visitor sees an error with the
   email address as a fallback.

Deployed without those variables, the form degrades to the same mailto fallback
used on static hosts.

## Local preview

```bash
python3 -m http.server          # content works; form + region detection need Functions
npx wrangler pages dev .        # full local parity with Cloudflare Pages
```
