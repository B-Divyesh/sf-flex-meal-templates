# Adjust Meal Portions — Seven-Day Review

**Reviewed:** 2026-09-06  
**Verdict:** **PASS**  
**Findings:** 0  
**Untested public claims:** 0  
**Live URL:** <https://flex-meal-templates.sociobot.in>  
**Implementation reviewed:** `9ba72e12234abad56a2441aacae187be1241558a` (`fix: show live meal adjustment in phone demo`)  
**Documentation baseline:** `a4d95c272722bd362a3f2e5f427b0fc25d7313c0` (`docs: record adversarial review 6`)

The documentation commits after the implementation candidate do not change
the shipped application. A fresh build from the current checkout produced
`index-DCLcbBRo.js`; its SHA-256 is
`adf52279a37d722c2ec44e6c3cbda9b97cc596292ba61998ca22395ca9f529b5`, exactly
matching the live JavaScript. The live product is therefore the reviewed
implementation.

## First screen

Fresh, separate Chromium contexts opened the live home page at 1440×1000 and
390×844. Nothing was scrolled before recording the result.

| Question | Answer on the first screen |
| --- | --- |
| Job | Adjust portions without changing meal templates. |
| Audience | People who repeat meals and want each portion checked against their nutrition ranges. |
| First action | **Try it with sample data**. It says that it opens two sample meal templates, one ready to adjust, without entering records. |

The phone view had no horizontal overflow. Its primary action was visible at
y=424–472. The desktop action was visible at y=681–729. Both pages had one
`h1`, a `main` landmark, the expected title, and no console or page errors.

## Sample and product paths

- One click opened `/?demo=1` with the persistent **“Demo — sample data,
  nothing is saved”** label, **Reset demo**, and **Start for real**.
- The live phone sample showed Weekday overnight oats and Lentil desk lunch.
  At y=505–608 it showed the complete portion control; at y=651–730 it showed
  the 514 kcal range result, all inside the initial 844 px viewport.
- Normal path: changing the portion to 1.1 and logging produced the dated
  adjusted record. Reset restored the supplied sample. Starting for real
  opened the empty real workspace, not any sample data.
- Invalid and boundary path: a zero portion recovered to `1`; 3× is exercised
  by the browser suite. Malformed JSON is rejected without writing records;
  custom inverted ranges are rejected by the suite. JSON export, erase, and
  restore paths are exercised by declared claim tests.
- Recovery path: the current suite opens recovery controls for data corrupted
  by the earlier release. The live invalid-backup path and reload preservation
  are covered by `validated-json-import`.

## Claims and local build

This started from the clean checkout at documentation baseline
`a4d95c272722bd362a3f2e5f427b0fc25d7313c0`. `npm ci` and
`npm audit --audit-level=high` passed with zero vulnerabilities. Every command
listed in `.factory/claims.json` was run separately and passed:

| Claim | Result |
| --- | --- |
| `portion-adjust` | PASS |
| `offline-reload` | PASS |
| `local-only` | PASS |
| `csv-json-export` | PASS |
| `demo-isolation` | PASS |
| `demo-sample` | PASS |
| `free-product` | PASS |
| `validated-json-import` | PASS |
| `template-authoring` | PASS |
| `json-roundtrip` | PASS |
| `erase-confirmation` | PASS |

`npm test` passed: 12 Vitest tests and 25 Playwright tests. `npm run build`
passed and created `dist/index.html`. The initial JavaScript is 37,190 bytes
(11,980 bytes gzip) and CSS is 16,363 bytes (4,310 bytes gzip), within the
static PWA budgets. The landing and README claims were cross-checked against
the inventory; each has a matching observable claim test. No unlisted or
untested public product claim was found.

## Live checks

- `/opt/fleet/lib/verify-url.sh` passed on the live home page: title, `lang`,
  `main`, image alt text, labelled buttons, visible content, and console
  checks all passed. The measured load was 592 ms.
- Live Axe on the 390 px demo found zero violations, including zero serious or
  critical violations. The skip link is first in keyboard order and has a
  3 px `rgb(161, 44, 34)` focus outline. Existing browser checks cover Enter
  and Arrow-key portion adjustment. Reduced-motion mode reduces animation and
  transition durations to 0.01 ms.
- The route crawl covered home, demo, real workspace, new-template page,
  Privacy, Terms, SPA 404, invalid real/demo edit IDs, and the offline page.
  Each had one `h1`, `main`, `lang="en"`, no phone overflow, route-specific
  title/canonical, and no errors. All discovered internal links returned 200.
  A missing asset deliberately returned HTTP 404 and its styled fallback gave
  a route back; this is expected, not a defect.
- Privacy: a live complete demo flow made no cross-origin requests. The app has
  no account, API, tracker, or backend tenant. Tenant isolation, restart
  persistence, health, and 429/`Retry-After` checks do not apply to this static
  browser-local PWA.
- PWA: a fresh controlled live context used cache `flex-meals-v7`, then reloaded
  `/demo` while offline with the sample and the visible offline notice. The
  manifest, icons, service worker, robots, sitemap, legal pages, CSP,
  `nosniff`, referrer policy, and permissions policy are present.

## Earlier findings

| Earlier item | Current disposition |
| --- | --- |
| F-1-1 decorative headings | Fixed; headings now name their content. |
| F-1-2 / F-2-1 unlisted or untested claims | Fixed; 11 declared claims passed independently. |
| F-1-3 route metadata | Fixed; live direct routes use route-specific metadata. |
| F-2-2 terminology and mobile wordmark | Fixed; current mobile wordmark is “Flex Meals” and the terms are consistent. |
| F-2-3 fallback skeleton | Fixed; static offline and 404 pages use the site structure and metadata. |
| F-2-4 invalid edit metadata | Fixed; both invalid edit routes render missing-page metadata. |
| F-3-1 sitemap | Fixed; all seven stable routes are listed. |
| F-4-1 Back/Forward history | Fixed; current browser regression test passes. |
| F-5-1 phone demo viewport | Fixed; live portion and calorie controls are in the initial phone viewport. |
| Malformed-backup data loss | Fixed; malformed JSON is rejected before writes and recovery remains available. |

## Result

**PASS.** This review has zero findings of every severity and zero untested
public claims.
