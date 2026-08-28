# Flex Meal Templates — polish round 1 handoff

## Released repair — 2026-08-28

Repair commit: `5493b2a85574648a36536d0b2e3ff5906cb267e7` (from review base
`ae4c6e34975fa80f8b2ef055e492ac3feb0903c7`). Static deployment
`6fa4ed5d-0bc9-4146-b320-56790b0c3644` completed successfully at
<https://flex-meal-templates.sociobot.in>.

All three adversarial-review findings are repaired and mapped in
`.factory/polish-1.md`:

- F-1-1: plain, context-bearing landing headings replaced decorative editorial labels.
- F-1-2: the first action now opens `/?demo=1`; its isolated banner/reset flow is tested, and every retained product promise has a declared claim test.
- F-1-3: route-specific title, description, Open Graph, Twitter, canonical, and robots metadata now update for app, demo, legal, and missing routes.

### Exact verification

- Fresh clone `/tmp/flex-meal-templates-clean-ZsUJZk`: `npm ci`; each of the 9 commands in `.factory/claims.json`; `npm test` (12 Vitest + 15 Playwright); `npm run build`; and `npm audit --audit-level=high` all passed.
- Local final gate: `npm test` passed (12 unit + 15 browser tests); `npm run build` produced `dist/`; JavaScript gzip is 11.45 KB and CSS gzip is 4.01 KB.
- Accessibility: Playwright axe found zero serious/critical violations. The live 390×844 cold check covered home, `/?demo=1`, `/demo`, `/app`, `/app/new`, `/privacy`, `/terms`, and a missing route: one `h1`, one `main`, no overflow, and no console/page errors.
- Privacy: the live complete demo request log contained no cross-origin request. No analytics, third-party font, or third-party script is loaded.
- Offline: after service-worker control, a live `/?demo=1` page reloaded offline with “Weekday overnight oats” and the visible offline notice.
- Live identity: `dist/assets/index-ikc4gAYc.js` and the live file share SHA-256 `2ce9c373b2b17908b96e224d69b890ab70b0a28a4b09ad637eb95332b69bef0d`.
- Screenshots: `.factory/evidence/polish-1/live-home-390.png`, `live-demo-query-390.png`, and `live-demo-offline.png`.

### Run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

Known gaps: none. Records intentionally remain local to one browser; export a JSON backup before clearing browser data.

---

# Previous review handoff

## Adversarial first-read review 1 — 2026-08-28

**Result: FAIL.** No product code was changed. The review is recorded in
`.factory/review-1.md` and committed with this handoff.

Cold live checks, the isolated demo, request logging, offline reload,
deep-link/crawl, the historical corrupt-backup regression, and all seven
declared claims passed. The review found three remaining issues: decorative
and context-free landing headings; unlisted/untested user-facing claims
(including the unsupported README “10–30” capacity statement); and reused
landing metadata on non-landing routes.

### How verified

- Fresh live Chromium contexts at 390×844 and desktop; direct demo and offline
  service-worker reload; same-origin request capture.
- Clean temporary clone: `npm ci`, every `.factory/claims.json` command
  separately (7/7 passed), `npm test` (12/12 passed), and `npm run build`
  (`dist/` produced).
- Live malformed-backup regression: invalid backup rejected, real record
  remained after reload, no page errors.

### Next steps

Fix F-1-1 through F-1-3 in `.factory/review-1.md`, then run the full review
checklist from a fresh browser context and clean clone.

---

# Previous verification handoff

## Independent release status — 2026-08-28

**PASS — candidate `541f5032e0ad840c9725e4cbff65bf47983e3fd4` is acceptable
for release at <https://flex-meal-templates.sociobot.in>.**

An independent clean-clone verification ran every command in
`.factory/claims.json` separately (7/7 passed), then `npm test` (Vitest 12/12,
Playwright 12/12), deterministic one-worker Playwright (12/12), production
build, and high-severity dependency audit (0 vulnerabilities). The live
JavaScript, CSS, and service-worker SHA-256 values match the candidate build.

Live desktop and 390px checks covered first-read/demo entry, adjusted portion
logging, 3× and zero boundaries, inverted-band recovery, malformed-backup
rejection with unchanged IndexedDB, keyboard/focus, reduced motion, offline
reload, privacy request capture, response headers/caching, and axe. No
serious/critical axe findings, console/page errors, cross-origin product
requests, or defects were found. Full exact evidence is in
`.factory/verification-3.md`.

The product remains a static local-only PWA. It has no account, server-side
endpoint, payment, library/CLI API, or sign-in integration; rate-limit,
concurrency, package-consumer, and Entra checks are not applicable.

## Prior repair context

## Release status

Release-blocking finding from verifier report commit `e3eb6d435aa64757b2e499696dce330def4db66f`, candidate `efd2eb4b80936d90fe9df0f676ac1ca03000e319`: **repaired**.

The rejected candidate accepted `{"version":1,"templates":[{}],"logs":[]}`, overwrote real IndexedDB, showed the raw error `Cannot read properties of undefined (reading 'map')`, and rendered an empty body after reload. This was reproduced unchanged before editing.

## Root-cause repair

- Backup validation now checks every nested template, ingredient, substitute, nutrient total, nutrition band, log, date, identifier, text field, and finite numeric field before a write.
- A valid import is written to IndexedDB before in-memory state changes. Invalid JSON or an invalid schema therefore leaves both stored and rendered records unchanged.
- Rejected files show: “That file is not a valid backup. Choose a JSON backup exported by this app. Your records were not changed.” No exception text reaches the UI.
- Stored state is validated on every load. Data already corrupted by the rejected live candidate opens a recovery screen with **Import JSON backup** and confirmed **Erase damaged records** actions instead of crashing.
- The inline reload handler on the storage-error screen was replaced with a CSP-safe delegated action.
- The validated-import behavior is now a declared claim. The public data-control copy and README state the same tested behavior.
- App version is `1.0.1`; manifest start URL is `/app?v=2`; service-worker cache is `flex-meals-v4`, so installed clients receive the repaired shell.

## Exact regression coverage

- `src/store.test.ts` accepts the shipped complete backup and rejects the verifier fixture plus missing nested arrays, incomplete nutrients, inverted bands, invalid dates, malformed log ingredients, missing totals, and non-finite values.
- `@claim:validated-json-import` creates a real saved meal, snapshots its IndexedDB value, imports the verifier's exact malformed fixture, checks the plain error, proves byte-equivalent stored state, reloads successfully, and records zero page errors.
- The legacy-corruption release test writes the exact bad value directly to real IndexedDB, reloads into recovery, erases with confirmation, and reloads a working empty workspace with zero page errors.

## Local verification — 2026-08-28

- Clean install: `npm ci` — passed; 59 packages installed; 0 vulnerabilities.
- Full gate: `npm test` — passed; Vitest 12/12 and Playwright Chromium 12/12.
- Deterministic browser gate: `CI=1 npm run test:e2e -- --workers=1` — 12/12 passed.
- Every command in `.factory/claims.json` was run separately — all seven claims passed.
- Exact regressions: `CI=1 npm run test:e2e -- --workers=1 --grep 'validated-json-import|workspace corrupted'` — 2/2 passed.
- Type/build: `npm run build` — strict TypeScript passed and `dist/index.html` was produced.
- Bundle: 11.36 KB gzip JavaScript and 4.01 KB gzip CSS; both are below the static-PWA budgets. The hero WebP is 66 KB desktop and 29 KB mobile.
- Dependency audit: `npm audit --audit-level=high` — 0 vulnerabilities.
- Desktop and 390×844 Chromium: home, demo, app, new-template, privacy, terms, missing route, malformed-import rejection, and corrupt-state recovery passed with no horizontal overflow or console/page errors.
- Keyboard: skip link, demo entry, slider focus, and arrow-key adjustment passed. Focus remains the designed 3 px editor-red outline; controls retain 44 px minimum targets.
- Accessibility: Playwright axe found zero serious or critical issues on landing, demo, privacy, every 390 px route, the new-template view, and 404. Factory URL checks found a title, `lang=en`, one H1, a main landmark, complete alt text/button names, and zero console errors on home and demo.
- Reduced motion: the existing media query removes the edition animation and control transform; the release test preserves keyboard-operable state changes.
- Privacy: `@claim:local-only` observed a complete demo log flow with zero cross-origin requests. No analytics, third-party script/font, sign-in, or product API exists.
- Offline/update: `@claim:offline-reload` passed from a fresh context after service-worker control, then reloaded `/demo` offline with the bundled sample and visible offline notice. Cache version `flex-meals-v4` and start URL `/app?v=2` were asserted in the built files.
- Response policy: the built SPA fallback, designed 404 rewrite, CSP including header-only `frame-ancestors`, `nosniff`, referrer policy, permissions policy, standalone manifest, icons, and 12-route local crawl all passed.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.5 s, CLS 0, total blocking time 0 ms. INP has no lab value without field interaction data.
- Package/consumer verification, API concurrency, rate-limit behavior, and sign-in authority checks are not applicable to this static, local-only PWA. The repository contains no package API, backend, account, or authority configuration.

## Deployment and live evidence

Repair commit `4f1a97bb90c47af12c54a9771214ad190ecf2915` was pushed to `origin/main`. The production artifact remains `./dist` and was deployed with:

```sh
/opt/fleet/lib/deploy-static.sh flex-meal-templates ./dist
```

Azure Static Web Apps deployment `b6dbb65e-ea1a-439e-8006-5304afedbaa4` uploaded the 283,877-byte artifact successfully. The existing app remains in `centralus`; the custom domain is `Ready` and managed HTTPS returns 200.

- Live SHA-256 matches the local build for `index-HcEB1IqC.js` (`aefcfe6f…`), `index-BHLcJEU4.css` (`9215c5de…`), and `sw.js` (`be0f3054…`). This proves the live identity is the repaired artifact.
- Factory URL checks on live home and demo passed desktop and 390 px captures with the expected route title, `lang=en`, one H1, a main landmark, complete alt/button names, and zero console errors. Evidence is in `.factory/evidence/home/` and `.factory/evidence/demo/`.
- The verifier's exact malformed backup was exercised live after creating a real record. It was rejected with the plain message, IndexedDB remained identical, reload preserved the meal, and no console/page error occurred.
- The previous-candidate corrupt IndexedDB value was also injected live. Reload opened recovery; confirmed erase restored the empty workspace; the next reload remained healthy.
- A fresh live context registered cache `flex-meals-v4`, reloaded the bundled demo offline, retained “Weekday overnight oats,” and showed the offline notice with no errors.
- The live malformed-import flow at 390×844 had no overflow, zero serious/critical axe findings, zero cross-origin requests, and zero console/page errors.
- Live `/`, `/demo`, `/app`, `/app/new`, `/privacy`, `/terms`, missing route, offline page, manifest, service worker, robots, and sitemap all return 200.
- Live headers include the repository CSP, HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and one-year immutable caching for the hashed JavaScript.
- Live Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, total blocking time 0 ms. The report is `.factory/evidence/lighthouse-home.json`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run preview
```

## Known limits and next steps

- Records remain local to one browser. Export JSON before clearing site data.
- There is intentionally no account, sync, food database, barcode lookup, recipe import, meal-plan generator, or health advice.
- Nutrition values remain user-entered estimates.
- No release-blocking gap is known. The next independent verifier should rerun the exact malformed-import and legacy-corruption tests first.
