# Polish round 2

Base review: `630cb52175854692e7907f6dfe3d2f3ef26b485e`.
Repair implementation: `56e9d4abcde94bbfcbb1000afa20fd7b1b9d2350`.
Deployment: `5e84e7d2-1fbd-4fe8-822b-f2c91a3d70a1` at
<https://flex-meal-templates.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept every decorative editorial label removed. Landing headings now name **Meal preview**, **How it works**, and **Limits and privacy**. | Browser test `390px routes fit the viewport and keep their accessible structure`; copy inventory in [copy-audit.md](copy-audit.md); cold live home screenshot `./.factory/evidence/polish-2/live-home/screenshot-mobile.png`; live `/` check found none of “Live proof”, “Method”, or “Small print”. |
| F-1-2 / F-2-1 | Completed the claim inventory with `template-authoring` and `json-roundtrip`. The authoring test creates non-default calorie and macro ranges, reloads them, checks all four range states, and logs calculated totals. The round-trip test exports the complete sample, erases it, imports that exact file, and compares every restored record. Earlier sample, erase, import-validation, isolation, export, privacy, free, offline, and portion claims remain independently tested. | Tests `@claim:template-authoring` and `@claim:json-roundtrip`; inventory test `every declared claim has exactly one tagged browser test`; all 11 claim commands passed independently in clean clone `/tmp/flex-polish2-clean-J2xtOG/repo`; deployed custom-range and record-equality checks passed at `/app/new` and `/demo`. |
| F-1-3 | Kept route-specific title, description, Open Graph description, Twitter description, canonical, and robots updates. Rewrote metadata with the final vocabulary. | Browser test `routes update title, descriptions, and social descriptions`; live direct checks passed for `/demo`, `/app`, `/app/new`, `/privacy`, `/terms`, and `/missing-page`; `verify-url.sh` results under `./.factory/evidence/polish-2/live-*`. |
| F-2-2 | Replaced the mobile “FMT” abbreviation with **Flex Meals**. Standardized visitor copy on **meal template**, **portion**, and **nutrition ranges** across the landing page, app, metadata, manifest, README, claims, and demo guide. | Copy audit terminology table; live 390 px text scan rejected the former terms; screenshot `./.factory/evidence/polish-2/live-home/screenshot-mobile.png`; browser tests use the final accessible names. |
| F-2-3 | Rebuilt `404.html` and `offline.html` with the broadsheet header, navigation, skip link, main landmark, Privacy and Terms links, Param Factory attribution, version, route metadata, social image, icons, manifest, 44 px targets, and reduced-motion handling. Kept genuine missing resources at HTTP 404. | Browser test `static fallback pages use the complete site skeleton and route metadata`; live `missing.js` returned HTTP 404; zero serious/critical axe findings; screenshots `./.factory/evidence/polish-2/live-404/screenshot-mobile.png` and `./.factory/evidence/polish-2/live-offline/screenshot-mobile.png`. |
| F-2-4 | Invalid `/app/edit` and `/demo/edit` IDs now select missing-page metadata before metadata is applied. Both show the missing H1, title, description, `noindex`, and `/404` canonical. | Browser test `invalid real and demo edit IDs use missing-page metadata`; cold live checks passed for `/app/edit?id=missing` and `/demo/edit?id=missing`. |

## Additional acceptance repair

Mobile inspection found that the hero image’s HTML height overrode its CSS
aspect ratio. The image now uses `height: auto`, renders at 358×239 px on the
390 px viewport, and leaves the complete first-screen facts above 844 px.
Text stays opaque during the 180 ms edition movement, so contrast never drops
during animation.

Evidence: browser test `390px routes fit the viewport and keep their accessible
structure`; screenshot `./.factory/evidence/polish-2/live-home/screenshot-mobile.png`;
local mobile measurement found 390 px document width, no overflow, and the
facts ending at 752 px; the cold live check confirmed the same first-screen
fit.

## Release evidence

- Clean clone `/tmp/flex-polish2-clean-J2xtOG/repo`: `npm ci`; 11/11 claim
  commands run separately; `npm test` passed 12 unit and 20 browser tests;
  `npm run build` passed; `npm audit --audit-level=high` found zero
  vulnerabilities.
- Build output: 11.46 kB gzip JavaScript and 4.02 kB gzip CSS. The live JS and
  CSS SHA-256 hashes exactly match `dist`.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO, 1.61 s LCP, 0 CLS. Live Lighthouse: 100/100/100/100, 1.16 s LCP,
  0 CLS. Reports are `lighthouse-local.json` and `lighthouse-live.json` in the
  polish evidence directory.
- Live cold audit: 29 structure/copy/demo/metadata/privacy/accessibility checks
  and 7 authoring/backup/offline checks passed. No normal-route console error,
  cross-origin request, mobile overflow, or serious/critical axe violation was
  found.

All findings from reviews 1 and 2 are resolved.
