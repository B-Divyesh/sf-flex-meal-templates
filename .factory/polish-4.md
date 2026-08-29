# Polish round 4

Base review: `e46b351ed4f1c2f28a82346a63d9bc5ce65b8123`.

Product repair commits: `d2eccebb71dfacd6b8c0eae282bf2356c05b0dae` and
`a82023d0abec33b5d7f661f5466ef529ff8c71e5`.

Deployment: `a3fd57c8-1e14-47b2-b7dd-164e29322759` at
<https://flex-meal-templates.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the task-first headline and section names. The former editorial eyebrow, folio labels, vague headings, and artwork label remain absent. | Test `390px routes fit the viewport and keep their accessible structure`; [live mobile home](evidence/polish-4/live-home/screenshot-mobile.png); cold check at <https://flex-meal-templates.sociobot.in/>. |
| F-1-2 | Kept unsupported capacity and scope promises removed. The sample count, portion changes, exports, isolation, and erase confirmation remain declared and behavior-tested. | Independent clean-clone tests `@claim:demo-sample`, `@claim:portion-adjust`, `@claim:csv-json-export`, `@claim:demo-isolation`, and `@claim:erase-confirmation`; [live demo](evidence/polish-4/live-demo/screenshot-mobile.png); cold flow at <https://flex-meal-templates.sociobot.in/?demo=1>. |
| F-1-3 | Kept per-route titles, descriptions, Open Graph/Twitter descriptions, canonicals, and robots state. | Test `routes update title, descriptions, and social descriptions`; [live Privacy page](evidence/polish-4/live-privacy/screenshot-mobile.png); cold checks at <https://flex-meal-templates.sociobot.in/privacy>, `/terms`, `/app/new`, `/demo/new`, and `/missing-page`. |
| F-2-1 / F-1-2 | Kept template authoring and valid JSON restoration in the claims inventory, each with one observable claim test. | Independent tests `@claim:template-authoring` and `@claim:json-roundtrip`; [live new-meal form](evidence/polish-4/live-app-new/screenshot-mobile.png); cold checks at <https://flex-meal-templates.sociobot.in/app/new> and `/demo`. |
| F-2-2 | Kept **Flex Meals** on mobile and the single vocabulary of meal template, portion, nutrition range, substitute, log, and JSON backup. | Test `390px routes fit the viewport and keep their accessible structure`; [live mobile home](evidence/polish-4/live-home/screenshot-mobile.png); cold 390 px check at <https://flex-meal-templates.sociobot.in/>. |
| F-2-3 | Kept the full header/footer, legal links, attribution, metadata, icons, focus treatment, and responsive broadsheet styling on static 404 and offline pages. | Test `static fallback pages use the complete site skeleton and route metadata`; [live 404](evidence/polish-4/live-404/screenshot-mobile.png) and [live offline page](evidence/polish-4/live-offline/screenshot-mobile.png); cold checks at <https://flex-meal-templates.sociobot.in/404.html> and `/offline.html`; `/missing-polish-4.js` returned 404. |
| F-2-4 | Kept missing-page metadata for invalid real and demo edit IDs. | Test `invalid real and demo edit IDs use missing-page metadata`; [live invalid edit](evidence/polish-4/live-invalid-edit/screenshot-mobile.png); cold checks at <https://flex-meal-templates.sociobot.in/app/edit?id=missing> and `/demo/edit?id=missing`. |
| F-3-1 | Kept `/app/new` and `/demo/new` in the sitemap and tied the file to the stable route inventory. | Test `sitemap lists every stable route in the route metadata inventory`; [live demo creation route](evidence/polish-4/live-demo-new/screenshot-mobile.png); cold check of <https://flex-meal-templates.sociobot.in/sitemap.xml>. |
| F-4-1 | Added manual, per-history-entry scroll ownership. Client navigation saves the departing entry and starts the new entry at zero. Back/Forward restores the destination coordinate after render while `focus({ preventScroll: true })` keeps the destination H1 focused and announced. A delayed-scroll race found during the first live pass was fixed before the final deployment. | Regression `F-4-1 restores Back and Forward scroll positions while focusing each destination H1` passed five repeated local runs and the final clean clone. The cold live run restored home `2186 → 2186` and demo `420 → 420`; [Back viewport](evidence/polish-4/live-f4-back.png), [Forward viewport](evidence/polish-4/live-f4-forward.png), and [live report](evidence/polish-4/live-check.json); checked at <https://flex-meal-templates.sociobot.in/> and `/demo`. |
| Earlier malformed-backup defect | Kept full nested validation before any IndexedDB write and the recovery screen for data produced by the faulty release. | Tests `@claim:validated-json-import rejects malformed backups without changing real records` and `a workspace corrupted by the previous release opens recovery controls`; the deployed JavaScript hash matches the tested `dist` in [live report](evidence/polish-4/live-check.json); cold `/app` check passed. |
| Polish-2 mobile and motion acceptance | Kept the responsive hero aspect ratio, complete first-screen task/action/facts at 390 px, opaque edition transition, and reduced-motion override. | Test `390px routes fit the viewport and keep their accessible structure`; [live mobile home](evidence/polish-4/live-home/screenshot-mobile.png); live Lighthouse recorded 0 CLS. |

## Final verification

- Final clean clone: `/tmp/flex-polish4-final-lyBYHx/repo` at `a82023d`.
- `npm ci` passed with zero audit vulnerabilities.
- Every command in `.factory/claims.json` passed independently: 11/11.
- `npm test` passed: 12 unit tests and 22 Playwright browser tests.
- `npm run build` passed with `dist/index.html`; JavaScript is 36.88 kB
  (11.93 kB gzip) and CSS is 14.67 kB (4.02 kB gzip).
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO, 1.51 s LCP, 0 CLS, and 4 ms total blocking time.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO, 1.05 s LCP, 0 CLS, and 6.5 ms total blocking time.
- The final cold live script passed 80 route, structure, accessibility,
  sandbox, privacy, offline, history, security-header, deployment-hash, 404,
  and sitemap checks. It found no console error, page error, cross-origin demo
  request, serious/critical axe violation, or mobile overflow.

All findings from reviews 1–4 and the earlier malformed-backup defect are
resolved. No acceptance item remains.
