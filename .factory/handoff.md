# Flex Meal Templates — review 3 handoff

## Result

**FAIL.** The adversarial review is recorded in `.factory/review-3.md`.
The live product passes its cold first screen, isolated demo, all 11 declared
claim tests, offline/privacy checks, prior-finding reconciliation, and
accessibility checks. One minor finding remains: `public/sitemap.xml` omits the
stable `/app/new` and `/demo/new` routes.

No product code was modified.

## What was done

- Opened the live landing page cold in fresh 390×844 and 1440×900 Chromium
  contexts and recorded the task, audience, and first action before scrolling.
- Audited every landing and README sentence, label, heading, and action with
  word counts and plain-language checks.
- Exercised the one-click live demo, logging, reset, real-mode exit, IndexedDB
  separation, and offline reload while recording network requests.
- Read `.factory/claims.json` and ran each of its 11 commands separately from a
  clean clone.
- Re-ran the full test suite and production build from that clone.
- Read every earlier review, polish report, and handoff, then verified every
  earlier finding in both live behavior and current source.
- Checked route metadata, deep links, back-button focus, fallback pages, live
  headers, links, social/icon assets, mobile overflow, reduced motion, and
  product-specific visual identity.
- Ran live factory URL verification and settled Playwright axe scans.

## Verification

Clean clone: `/tmp/flex-review3-clean-bZvvEE/repo` at `8898a3e`.

- `npm ci` — pass; zero reported vulnerabilities.
- Every `.factory/claims.json` command — 11/11 pass.
- `npm test` — 12 unit and 20 browser tests pass.
- `npm run build` — pass; `dist/index.html` exists; JavaScript 11.46 kB gzip;
  CSS 4.02 kB gzip.
- Live JS/CSS SHA-256 values exactly match the clean-clone build.
- Live demo — two sample templates, one prior log, persistent banner, reset,
  real-data isolation, same-origin-only requests, and offline reload pass.
- `/opt/fleet/lib/verify-url.sh` — pass on home, demo, Privacy, Terms, and a
  missing route; no console errors.
- Live axe — zero serious or critical violations on home, demo, Privacy,
  Terms, SPA missing, static 404, and offline pages.
- Link/status crawl — all discovered navigation destinations respond; a
  genuine missing asset returns 404.

## Known gap and next step

Resolve F-3-1 by adding `/app/new` and `/demo/new` to the sitemap and adding a
stable-route inventory test. Re-run the complete review; PASS requires no
remaining finding.
