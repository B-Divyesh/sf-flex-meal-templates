# Independent verification 3 — PASS

**Work order:** `flex-meal-templates-verify-3`  
**Candidate commit:** `541f5032e0ad840c9725e4cbff65bf47983e3fd4`  
**Live URL:** <https://flex-meal-templates.sociobot.in>  
**Verified:** 2026-08-28

## Release decision

**PASS.** The deployed static PWA is byte-identical to the requested candidate,
all declared claims pass from a clean install, and independent local and live
checks found no release-blocking defects.

## Required first checks

### Cold live first read

An uncached Chromium visit to `/` answered the three required questions in
plain words:

- **What it does:** “Adjust saved meals as you log.”
- **For whom:** “For people who repeat meals but change portions to match each
  meal’s nutrition budget.”
- **What to do first:** use the visible **Try it with sample data** link. Its
  adjacent text says it opens two editable meals and does not enter real
  records.

The first screen also displays the offline, local-browser-storage, free, and
CSV/JSON-export facts. This satisfies the plain-words and one-click isolated
demo gate.

### Claims

The clean checkout had `.factory/claims.json`. After `npm ci` (59 packages,
0 audit vulnerabilities), every listed command was run separately against the
configured Playwright demo entry point and passed:

| Claim | Result | Observed assertion |
| --- | --- | --- |
| `portion-adjust` | PASS | 0.75× gives 386 kcal and below-band state, logs, and leaves the 60 g base amount intact. |
| `offline-reload` | PASS | A service-worker-controlled fresh `/demo` reloads offline with the sample and offline notice. |
| `local-only` | PASS | The complete demo log flow records no cross-origin requests. |
| `csv-json-export` | PASS | CSV header/record and JSON templates/logs download and parse. |
| `demo-isolation` | PASS | Demo and real IndexedDB remain separate; reset restores the supplied sample. |
| `free-product` | PASS | Logging/export are available without any buy, pay, or upgrade action. |
| `validated-json-import` | PASS | A malformed backup is rejected without mutating IndexedDB; the saved meal survives reload with no page error. |

## Local candidate verification

- `npm test` — **PASS**: Vitest 12/12 and Playwright Chromium 12/12 (exit 0).
- `CI=1 npm run test:e2e -- --workers=1` — **PASS**, 12/12 (exit 0).
- `npm run build` — **PASS**: TypeScript checks and writes `dist/`.
- `npm audit --audit-level=high` — **PASS**, 0 vulnerabilities.
- Production bundle: JavaScript 34.41 kB / **11.36 kB gzip** and CSS 14.53 kB /
  **4.01 kB gzip**, below the 200 kB JS and 50 kB CSS PWA budgets. Hero WebP
  files are 66 kB desktop and 29 kB mobile.

## Independent live-product exercise

- Normal flow: used `/demo`, changed the multiplier, logged the adjusted meal,
  and opened its editor; the original first base amount remained 60 g.
- Bounds and invalid input: 3× produced 1542 kcal; entering 0 recovered to
  1×. An inverted calorie band was rejected with “Calories minimum must be
  lower than its maximum.” A corrected real template then saved normally.
- Recovery: after saving a real “Verifier meal”, imported
  `{"version":1,"templates":[{}],"logs":[]}`. The app displayed the plain
  invalid-backup message, IndexedDB was byte-equivalent before and after, and
  reload retained the meal without a console or page error.
- Privacy: request capture through a complete live demo log had **no
  cross-origin requests**. There are no analytics, third-party fonts/scripts,
  accounts, sign-in, product APIs, or backend endpoints. Rate-limit,
  concurrency, and Entra checks are therefore not applicable.
- Desktop and 390×844 mobile: `/`, `/demo`, `/app/new`, `/privacy`, `/terms`,
  and a missing route each had one `h1`, one `main`, no horizontal overflow,
  and no console/page errors. Keyboard Tab reaches the skip link first; its
  visible focus is `rgb(161, 44, 34) solid 3px` with a 3px offset. Reduced
  motion removes the edition animation.
- Axe 4.10.2 on live `/`, `/demo`, `/app/new`, `/privacy`, `/terms`, and the
  missing route found **zero serious or critical violations** after the short
  180 ms page-entrance transition settled.
- PWA: a fresh live context was controlled by `/sw.js`, cache
  `flex-meals-v4`, scope `/`, and reloaded `/demo` offline with “Weekday
  overnight oats” plus the offline notice. The worker contains versioned-cache
  cleanup, `skipWaiting`, `clientsClaim`, and the update-available toast path;
  the current deployment had no waiting update.

## Deployment identity and response policy

The live deployment matches this candidate exactly:

| Artifact | SHA-256 |
| --- | --- |
| `assets/index-HcEB1IqC.js` | `aefcfe6fd3bcad2571093c374fbb741bdb1863bbfee2089d9e893a8819e0eadc` |
| `assets/index-BHLcJEU4.css` | `9215c5dede10144fcc6d9ad63f0a2cd9760eca5e76f8fd91c4b9de0c0232d9ad` |
| `sw.js` | `be0f3054572fa7a709eb2d4dcb680fbe603e1d799ba82ba550f97c4ac610660e` |

Live `/`, app/deep-link routes, 404 route, offline page, manifest, worker,
robots, sitemap, and hashed JS all returned 200. HTML carries the expected
CSP (including header `frame-ancestors 'none'`), HSTS, `nosniff`, strict-origin
referrer policy, and restrictive permissions policy. Hashed assets have
`public, max-age=31536000, immutable`; the worker is short cached so it can
update.

## Defects

None found. There are no release-blocking, high, medium, or low defects from
this verification.

## Scope notes

This is a static, browser-local PWA rather than a library, CLI, backend, or
sign-in product. Package-consumer installation, server concurrency/persistence,
429 allowance, and Microsoft Entra authority checks do not apply.
