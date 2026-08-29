# Polish round 5

Base review: `4b083d41ff6230e5a6218d93b0c390b9d8467cea` reviewing candidate `12cdd9bb8c0db7a2f40272577a7ba3a512248ced`.

Product repair: `9ba72e12234abad56a2441aacae187be1241558a`.

Deployment: `552b21e3-a152-46b2-8dc1-28525dccff87` at <https://flex-meal-templates.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the task-first headline and the plain section names **Meal preview**, **How it works**, and **Limits and privacy**. The decorative editorial labels remain absent. | Test `the complete landing promise and first actions fit the initial phone viewport`; [copy audit](copy-audit.md); [live phone home](evidence/polish-5/live-home/screenshot-mobile.png); cold live `/` check in [live-check.json](evidence/polish-5/live-check.json). |
| F-1-2 | Kept unsupported capacity and scope copy removed. The landing now says exactly what opens: two sample meal templates, with one ready to adjust. All retained sample, adjustment, export, isolation, erase, local, offline, free, authoring, and restore claims remain declared and behavior-tested. | Tests `every declared claim has exactly one tagged browser test` and all 11 `@claim:*` tests; [claims inventory](claims.json); clean clone `/tmp/flex-polish5-clean-bS9uHm/repo`; cold live sample/reset/isolation checks in [live-check.json](evidence/polish-5/live-check.json). |
| F-1-3 | Kept route-specific title, description, Open Graph/Twitter description, canonical, and robots state. Updated Demo metadata to describe the ready adjustment. | Test `routes update title, descriptions, and social descriptions`; live checks for `/`, `/app`, `/app/new`, `/demo`, `/demo/new`, `/privacy`, `/terms`, missing routes, and invalid edit IDs in [live-check.json](evidence/polish-5/live-check.json). |
| F-2-1 | Kept `template-authoring` and `json-roundtrip` in the claim inventory with one tagged test each. | Independent clean-clone tests `@claim:template-authoring` and `@claim:json-roundtrip`; full data equality and custom-range assertions in `tests/claims.spec.ts`. |
| F-2-2 | Kept **Flex Meals** on phones and the single vocabulary: meal template, portion, nutrition range, substitute, log, and JSON backup. Updated the verb-first catalog line to 77 characters. | Tests `the catalog description is one verb-first line under 120 characters` and `390px routes fit the viewport and keep their accessible structure`; [copy audit](copy-audit.md); [live phone home](evidence/polish-5/live-home/screenshot-mobile.png). |
| F-2-3 | Kept the complete broadsheet header/footer, legal links, attribution, route metadata, icons, focus treatment, and responsive styling on the static 404 and offline pages. | Test `static fallback pages use the complete site skeleton and route metadata`; live verifier reports and screenshots under [live-404](evidence/polish-5/live-404) and [live-offline](evidence/polish-5/live-offline); `/missing-polish-5.js` returned HTTP 404. |
| F-2-4 | Kept missing-page title, description, social metadata, `noindex`, and `/404` canonical for invalid real and demo edit IDs. | Test `invalid real and demo edit IDs use missing-page metadata`; cold live checks for `/app/edit?id=missing` and `/demo/edit?id=missing` in [live-check.json](evidence/polish-5/live-check.json). |
| F-3-1 | Kept all seven stable routes in the sitemap and tied the expected set to the route inventory. | Test `sitemap lists every stable route in the route metadata inventory`; live `sitemap.xml` checks in [live-check.json](evidence/polish-5/live-check.json). |
| F-4-1 | Kept per-history-entry scroll ownership and H1 focus/announcement on Back and Forward. | Test `F-4-1 restores Back and Forward scroll positions while focusing each destination H1`; cold live check restored home `2186 → 2186` and demo `420 → 420` in [live-check.json](evidence/polish-5/live-check.json). |
| F-5-1 | Reordered the work area to show nutrition results immediately after the portion control. At 390 px, the demo uses a compact two-column meal index and moves secondary template actions after the form. Both samples, the complete portion control, and the calories result now fit without scrolling. | Tests `F-5-1 shows a portion control and nutrition result in the initial phone demo viewport` and `@claim:demo-sample`; [live phone demo](evidence/polish-5/live-f5-demo-390.png); cold live bounding-box check in [live-check.json](evidence/polish-5/live-check.json). |
| Earlier malformed-backup defect | Kept complete nested validation before IndexedDB writes and the recovery path for old malformed data. | Tests `@claim:validated-json-import rejects malformed backups without changing real records` and `a workspace corrupted by the previous release opens recovery controls`. |
| Polish-2 mobile and motion acceptance | Kept the responsive hero, first-screen task/action/facts, 44 px controls, opaque edition transition, and reduced-motion override. The new compact demo remains within the same newsprint visual system. | Tests `the complete landing promise and first actions fit the initial phone viewport`, `390px routes fit the viewport and keep their accessible structure`, and route-wide Axe scans; [live phone home](evidence/polish-5/live-home/screenshot-mobile.png) and [live phone demo](evidence/polish-5/live-f5-demo-390.png). |

## Verification

- Fresh clone `/tmp/flex-polish5-clean-bS9uHm/repo` at `9ba72e12234abad56a2441aacae187be1241558a`: `npm ci` passed with zero vulnerabilities; every command from `.factory/claims.json` passed independently, 11/11.
- The same clean clone passed `npm test` with 12 unit tests and 25 Playwright browser tests. `npm run build` produced `dist/index.html`.
- Production output is 37.19 kB JavaScript (11.98 kB gzip) and 16.36 kB CSS (4.31 kB gzip), within the static-product budgets.
- Local Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.5 s, CLS 0, TBT 0 ms. Report: [lighthouse-local.json](evidence/polish-5/lighthouse-local.json).
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms. Report: [lighthouse-live.json](evidence/polish-5/lighthouse-live.json).
- `/opt/fleet/lib/verify-url.sh` passed on ten live routes. The independent cold live script passed all 105 checks with no console/page errors, no cross-origin demo requests, and zero serious or critical Axe violations.
- Live JavaScript SHA-256 `adf52279a37d722c2ec44e6c3cbda9b97cc596292ba61998ca22395ca9f529b5` matches `dist/assets/index-DCLcbBRo.js` byte for byte.

Every finding from reviews 1–5 and every acceptance item recorded in earlier polish reports is resolved. No severity is deferred.
