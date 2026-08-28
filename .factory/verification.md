# Independent verification — FAIL

**Work order:** `flex-meal-templates-verify-2`  
**Candidate:** `efd2eb4b80936d90fe9df0f676ac1ca03000e319`  
**Live URL:** <https://flex-meal-templates.sociobot.in>  
**Verified:** 2026-08-28

## Release decision

**FAIL — do not release this candidate.** A malformed JSON backup passes the
product's import check, overwrites the real local database, and leaves the
application blank after reload. The user has no in-product recovery route to
erase or replace the corrupt data.

## Required first checks

### Cold first read of the live site

Cold Chromium visit to `/` showed:

- **What it does:** “Adjust saved meals as you log.”
- **For whom:** “For people who repeat meals but change portions to match each
  meal’s nutrition budget.”
- **What to click first:** the visible one-click **Try it with sample data**
  link, with the adjacent explanation that it opens two editable meals and
  does not enter real records.

This meets the plain-words and demo-entry acceptance gate.

### Claims from `.factory/claims.json`

Clean install used `npm ci` (0 audit vulnerabilities). Each declared command
was run separately against the configured Playwright demo entry point; all
passed:

| Claim | Command result | Observable evidence |
| --- | --- | --- |
| `portion-adjust` | PASS | 0.75× updates calories to 386, shows below-band state, logs the record, and preserves the 60 g base amount. |
| `offline-reload` | PASS | Fresh `/demo` service-worker cache reloads offline with the sample and offline notice. |
| `local-only` | PASS | Complete demo log flow recorded no cross-origin request. |
| `csv-json-export` | PASS | CSV header/row and JSON templates/logs were downloaded and asserted. |
| `demo-isolation` | PASS | Real storage remained empty during demo; reset restored the sample. |
| `free-product` | PASS | Logging and export were available with no payment, purchase, or upgrade action. |

`npm test` also completed with exit code 0: Vitest 3/3 and Playwright 10/10.
`npm run build` passed TypeScript and produced `dist/` (10.54 KB gzip JS;
4.01 KB gzip CSS). `npm audit --audit-level=high` reported 0 vulnerabilities.

## Independent functional and non-functional evidence

- Normal flow: live demo changed a serving from 1× to 1.1× and logged it; the
  claimed nutrition/band and template-edit flows are also covered by the
  passing E2E suite.
- Bounds: a live 3× serving produced 1542 kcal; entering 0 recovered to the
  default 1× value rather than writing an invalid log.
- Desktop and 390×844 mobile: no horizontal overflow at 390px; keyboard Tab
  reached the skip link and primary sample action. The primary action's focused
  outline measured as the designed 3px `#a12c22` outline. Reduced-motion
  workspace animation/transition durations measured `0.00001s`.
- Live axe scan of the logged demo found zero serious or critical violations;
  the repository axe tests pass on landing, demo, privacy, mobile routes, and
  the new-template/404 views. No live console or page errors occurred in the
  normal demo, desktop, mobile, or offline flows.
- Privacy: a complete live demo log flow made zero cross-origin requests. No
  sign-in or server-side product endpoint exists, so identity and rate-limit
  requirements are not applicable.
- PWA: a fresh live browser registered a controlled service worker at `/sw.js`;
  after going offline, `/demo` reloaded with “Weekday overnight oats” and the
  visible offline notice. The worker has versioned cache cleanup,
  `skipWaiting`, `clients.claim`, and update-toast code. The manifest declares
  standalone display, versioned `/app?v=1` start URL, and 192/512/maskable
  icons.
- Response policy: live HTML has CSP, HSTS, `nosniff`, strict-origin referrer
  policy, and restrictive permissions policy. Hashed JS is immutable for one
  year. `/`, `/demo`, `/app`, `/app/new`, `/privacy`, `/terms`, a missing
  route, offline page, worker, manifest, robots, and sitemap all returned 200.
- Deployment identity: SHA-256 values of live `index-wxuH4r6O.js`,
  `index-BHLcJEU4.css`, and `sw.js` exactly match the candidate build
  (`8e08dcc…`, `9215c5d…`, and `d3f409c…`, respectively). The live deployment
  is therefore this candidate, not merely an earlier successful deployment.

## Defects

### Critical — malformed JSON import permanently bricks the real workspace

**Reproduction on the live candidate:**

1. Open `/app` in a clean browser context.
2. Choose **Import JSON backup** and provide
   `{"version":1,"templates":[{}],"logs":[]}`.
3. The product accepts it because it checks only `version`, `templates`, and
   `logs` at the top level. It replaces the real IndexedDB data.
4. Reload `/app`.

**Observed result:** the document body is empty and the page error is
`Cannot read properties of undefined (reading 'map')`. Before reload, the app
only displays the same raw technical message in its toast. The records that
were in real storage have been overwritten, and the blank app provides no
export, import, erase, or recovery control.

**Why this blocks release:** README promises import “after validation” and the
acceptance contract requires invalid-input recovery. This is persistent local
data loss plus a non-recoverable app failure caused by a representative corrupt
user backup. Validate the complete backup/template/log schema before replacing
the current database; reject invalid files with a plain recovery message and
leave existing storage untouched. Add a claim or regression test that imports
this malformed fixture, verifies no data mutation, then reloads successfully.

## Scope notes

This is a static local-first PWA, not a library, CLI, backend, or sign-in
product. Consumer packing, concurrency/persistence endpoint testing, 429
allowance testing, and Entra authority testing do not apply.
