# Flex Meal Templates — repair handoff

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
- Package/consumer verification, API concurrency, rate-limit behavior, and live identity are not applicable to this static, local-only PWA. The repository contains no package API, backend, account, or authority configuration.

## Deployment and live evidence

The production artifact is `./dist`. Deploy with:

```sh
/opt/fleet/lib/deploy-static.sh flex-meal-templates ./dist
```

Deployment and post-deploy identity evidence are recorded below after upload.

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
