# Flex Meal Templates — repair handoff

## Repair scope

Repaired candidate `f46de3ea6156f31e983187878e28cecd9280651b` for work order `flex-meal-templates-repair-1`. The candidate tree contains the original `.factory/handoff.md` and evidence JSON, but no separate `.factory/verification*` report. The controller-provided `@claim:offline-reload` failure was therefore treated as the authoritative independent finding and reproduced unchanged before edits.

## Findings and root-cause repairs

- **Offline demo reload:** `CI=1 npm run test:e2e -- --grep @claim:offline-reload --workers=1` failed because the offline shell loaded while its hashed JavaScript and CSS returned 503. Vite adds `Vary: Origin`; precache installation and page requests used different Origin headers, so the Cache API rejected the same-URL entries. Service-worker lookups now use `ignoreVary` for same-origin precached files and the cache version is `flex-meals-v3`.
- **Demo/real isolation edge:** the expanded isolation regression reproduced a lost real save after Demo → Home → Create your first template. `saveTemplate` now binds the store to the current route's real or demo namespace before every save.
- **390px form overflow:** `/app/new` measured 439px inside a 390px viewport. Grid children and inputs now permit shrinking to their available column width.

The offline claim now asserts the initial “Weekday overnight oats” sample, the same sample plus the visible offline status after an offline reload, an empty real workspace after leaving demo, and the restored isolated sample on return. The demo-isolation claim also covers a real save through the landing page and proves it never appears in demo storage.

## Verification evidence — 2026-08-28

- Clean install: `npm ci` — passed; 0 audit findings.
- Unit: `npm run test:unit` — 3/3 passed.
- Required deterministic browser run: `CI=1 npm run test:e2e -- --workers=1` — 10/10 passed, including every claim.
- Normal release command: `npm test` — 3 unit and 10 Playwright tests passed with the configured parallel runner.
- Exact controller regressions: `CI=1 npm run test:e2e -- --workers=1 --grep '@claim:(offline-reload|demo-isolation)'` — 2/2 passed.
- Type and production build: `npm run build` — strict TypeScript passed and `dist/index.html` was produced.
- Bundle: 10.54 KB gzip JavaScript and 4.01 KB gzip CSS. Package/consumer verification is not applicable to this static PWA.
- Browser QA: desktop Chromium and 390×844 Chromium passed route structure, no-overflow, console, keyboard-only demo/slider operation, and reduced serious/critical axe checks. Home, demo, new-template, privacy, terms, and 404 states were exercised.
- Accessibility: Playwright axe found zero serious/critical violations. The factory URL verifier found one H1, `lang=en`, a main landmark, complete image/button names, and zero console errors on home and demo. Updated evidence is in `.factory/evidence/home/` and `.factory/evidence/demo/`.
- Privacy: `@claim:local-only` observed the complete demo log flow and found zero cross-origin requests.
- Offline/update: the first-visit cache, controller takeover, offline `/demo` reload, visible saved sample/status, cache-version update, and demo/real separation passed in a fresh browser context.
- Response policy: parsed the built `staticwebapp.config.json` and asserted SPA fallback, designed 404 rewrite, CSP, content-type, referrer, and permissions headers. The built manifest has standalone display, a versioned start URL, and 192/512/maskable icons.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.4 s, CLS 0, total blocking time 0 ms. Lab Lighthouse does not report INP without field interaction data. Report: `.factory/evidence/lighthouse-home.json`.
- Dependency audit: `npm audit --audit-level=high` — 0 vulnerabilities.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

Artifact class remains `pwa-offline`. Deploy the contents of `./dist` with `/opt/fleet/lib/deploy-static.sh flex-meal-templates ./dist`.

## Known limits

- Records remain local to one browser; users should export JSON before clearing site data.
- There is intentionally no account, sync, food database, barcode lookup, recipe import, meal-plan generator, or health advice.
- Nutrition remains based on user-entered estimates.
