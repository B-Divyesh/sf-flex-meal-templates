# Polish round 3

Base candidate: `8898a3e0c1e04371abc6724ed672e740e50fa4a1`.

Repair: `ed8c9d6c591c4e6afe840578b28f50008d5df826`.

Deployment: `149a4b66-bb13-4c2e-a34e-44624a0191d8` at
<https://flex-meal-templates.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the plain, task-naming first screen and section headings: **Meal preview**, **How it works**, and **Limits and privacy**. Decorative editor labels remain absent. | Fresh-clone `npm test` passed the mobile route/structure test; [cold mobile screenshot](evidence/polish-3/live-home/screenshot-mobile.png); <https://flex-meal-templates.sociobot.in/> opened with the task, audience, demo action, result, and facts visible at 390 px. |
| F-1-2 | Retained the complete tested claim inventory: demo sample/isolation, adjustment, authoring, export/import, erase confirmation, local-only storage, offline use, and free use. Unsupported capacity and scope promises remain removed. | All 11 commands from `.factory/claims.json` passed independently in `/tmp/flex-polish3-clean-zMEClL/repo`; [live demo screenshot](evidence/polish-3/live-demo-query/screenshot-mobile.png); <https://flex-meal-templates.sociobot.in/?demo=1> passed the banner, reset, real-mode, calculation, and same-origin-request checks. |
| F-1-3 | Route metadata remains centralized in `src/routes.ts`; each SPA route updates title, description, social description, canonical, and robots state. | Test `routes update title, descriptions, and social descriptions`; [Privacy screenshot](evidence/polish-3/live-privacy/screenshot-mobile.png); live direct checks passed on <https://flex-meal-templates.sociobot.in/privacy>, `/terms`, `/app/new`, `/demo/new`, and `/missing-page`. |
| F-2-1 | Retained `template-authoring` and `json-roundtrip` as one-tagged-test-per-claim behaviours. | Fresh-clone `@claim:template-authoring` and `@claim:json-roundtrip` passed; [new-template screenshot](evidence/polish-3/live-app-new/screenshot-mobile.png); <https://flex-meal-templates.sociobot.in/app/new> loaded with its route-specific metadata and accessible form. |
| F-2-2 | Retained **Flex Meals** on mobile and consistent visitor vocabulary: meal template, portion, nutrition range, substitute, log, and JSON backup. | Test `390px routes fit the viewport and keep their accessible structure`; [home screenshot](evidence/polish-3/live-home/screenshot-mobile.png); <https://flex-meal-templates.sociobot.in/> passed the 390 px no-overflow cold check. |
| F-2-3 | Retained the full broadsheet header/footer, legal links, attribution, metadata, icons, focus, and responsive treatment on static fallback pages. | Test `static fallback pages use the complete site skeleton and route metadata`; [404 screenshot](evidence/polish-3/live-static-404/screenshot-mobile.png) and [offline screenshot](evidence/polish-3/live-offline/screenshot-mobile.png); <https://flex-meal-templates.sociobot.in/404.html> and `/offline.html` passed live verification, while `/missing.js` returned HTTP 404. |
| F-2-4 | Retained missing-page metadata when real or demo edit IDs are absent. | Test `invalid real and demo edit IDs use missing-page metadata`; [real invalid-edit screenshot](evidence/polish-3/live-invalid-real-edit/screenshot-mobile.png); <https://flex-meal-templates.sociobot.in/app/edit?id=missing> and `/demo/edit?id=missing` both returned the Page not found title, one H1, main landmark, and no console error. |
| F-3-1 | Added `/app/new` and `/demo/new` to the sitemap. The stable sitemap paths now derive from the centralized route inventory; edit paths and 404/offline fallbacks are explicitly excluded. | New test `sitemap lists every stable route in the route metadata inventory` passed in the fresh clone; [new route screenshot](evidence/polish-3/live-demo-new/screenshot-mobile.png); live <https://flex-meal-templates.sociobot.in/sitemap.xml> contains exactly `/`, `/app`, `/app/new`, `/demo`, `/demo/new`, `/privacy`, and `/terms`. |

## Release evidence

- Fresh clone `/tmp/flex-polish3-clean-zMEClL/repo`: `npm ci`, every declared
  claim command (11/11), `npm test` (12 unit + 21 browser), `npm run build`,
  and `npm audit --audit-level=high` all passed.
- Cold live checks after deployment found no console or page errors, no
  cross-origin demo request, no mobile overflow, zero serious/critical axe
  violations, and a service-worker-controlled offline demo reload.
- Evidence reports and screenshots: `.factory/evidence/polish-3/`.

All findings from reviews 1, 2, and 3 are resolved; no finding remains.
