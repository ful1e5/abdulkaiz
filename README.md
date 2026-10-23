# abdulkaiz.com: setup
Static site + Cloudflare Pages Functions (`functions/api/*`) + Decap CMS (`/admin/`).

## Deploy (Cloudflare Pages)
Connect the GitHub repo. Build command: `python3 build.py` (optional) or empty. Output directory: `/`.

## Contact form (stores + emails every message)
Pages project > Settings:
1. **KV**: Storage & Databases > KV > create a namespace (e.g. `leads`). Pages > Settings > Functions > KV namespace bindings: variable name `LEADS`. Every message is saved there as `lead:<time>:<id>`.
2. **Email** via Resend (resend.com, free tier): create an API key and verify your domain. Pages > Settings > Variables and Secrets:
   - `RESEND_API_KEY` (secret), `TO_EMAIL` (where you receive leads), `FROM_EMAIL` (e.g. `Website <hello@abdulkaiz.com>`).
3. Redeploy. If both saving and emailing fail, the visitor sees an error with your email address as a fallback.

## Local preview
`python3 -m http.server` (content works; the contact form and country detection need Functions: `npx wrangler pages dev .`).

## WhatsApp ping on every new lead (optional)
Add these Pages variables (Settings > Variables and Secrets), then redeploy. Email and KV keep working if WhatsApp fails.

**Option A: CallMeBot (free, unofficial, quickest).** Follow the activation steps on callmebot.com to get an API key for your number, then set:
`WA_PROVIDER=callmebot`, `WA_TO=+91XXXXXXXXXX`, `CALLMEBOT_KEY=<key>` (secret).

**Option B: Meta WhatsApp Cloud API (official, more reliable).** Create a template named `new_lead` (category Utility, language English) with the body:
`New website lead from {{1}} ({{2}}): {{3}}`
Then set: `WA_PROVIDER=meta`, `WA_PHONE_ID`, `WA_TOKEN` (permanent System User token, secret), `WA_TO=91XXXXXXXXXX` (digits only, no +), and optionally `WA_TEMPLATE`, `WA_LANG`.
