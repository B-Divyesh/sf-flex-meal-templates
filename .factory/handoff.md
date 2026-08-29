# Flex Meal Templates — polish round 5 handoff

## Result

**PASS.** Every finding in reviews 1–5 is resolved. The final phone demo shows both sample meal templates, the selected portion control, and its calorie range result in the initial 390×844 viewport.

The product repair is commit `9ba72e12234abad56a2441aacae187be1241558a` on `origin/main`. Azure Static Web Apps deployment `552b21e3-a152-46b2-8dc1-28525dccff87` is live at <https://flex-meal-templates.sociobot.in>.

## What changed

- Reordered the adjustment workspace so nutrition totals and range states follow the portion control, before ingredient details.
- Added a compact phone-demo layout: the two sample meal templates form a two-column index, while the selected adjustment remains immediately below.
- Moved secondary edit/delete controls below the demo form on phones without removing them; desktop and personal-workspace placement remains unchanged.
- Reworded the first-screen action result to say one sample is ready to adjust.
- Strengthened the `demo-sample` claim and added a dedicated F-5-1 viewport regression with complete bounding-box checks.
- Updated Demo metadata, copy audit, demo contract, visual thesis, PWA cache/version markers, and the verb-first 77-character catalog description.
- Preserved the monochrome newsprint palette, square rules, serif/sans pairing, original still life, and edition-change motion policy.

The finding-by-finding record is in [polish-5.md](polish-5.md).

## Exact verification

Fresh clone: `/tmp/flex-polish5-clean-bS9uHm/repo` at `9ba72e12234abad56a2441aacae187be1241558a`.

- `npm ci`: passed; zero audit vulnerabilities.
- Every command in `.factory/claims.json`: 11/11 passed independently.
- `npm test`: 12 unit tests and 25 Playwright browser tests passed.
- `npm run build`: passed and produced `dist/index.html`.
- Bundle: 37.19 kB JavaScript (11.98 kB gzip); 16.36 kB CSS (4.31 kB gzip).
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; 1.5 s LCP, 0 CLS, 0 ms TBT.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; 1.1 s LCP, 0 CLS, 0 ms TBT.
- Factory URL verifier: passed on live home, `?demo=1`, app, both creation routes, Privacy, Terms, SPA missing, static 404, and offline pages.
- Cold live audit: 105 checks passed across first-screen copy, F-5-1 geometry, route titles/descriptions/canonicals, one H1/main, 390 px fit, legal links, Axe, demo log/reset/exit isolation, same-origin requests, service-worker offline reload, Back/Forward scroll and focus, CSP/nosniff, real asset 404, sitemap, attribution, and deployed-byte equality.
- Live F-5-1 geometry: the complete portion control spans y=509–612 and the calories row spans y=654–733. See [live-check.json](evidence/polish-5/live-check.json) and [live-f5-demo-390.png](evidence/polish-5/live-f5-demo-390.png).
- Live deployed JavaScript SHA-256: `adf52279a37d722c2ec44e6c3cbda9b97cc596292ba61998ca22395ca9f529b5`, identical to `dist/assets/index-DCLcbBRo.js`.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/?demo=1` for the isolated sample.

## Known gaps

None.
