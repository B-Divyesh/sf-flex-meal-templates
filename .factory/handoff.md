# Flex Meal Templates — adversarial review 2 handoff

## Result

**FAIL** on candidate `1c16aeb9b70befd1ad89dc4234e15582d17678da`.
No product code was changed. The complete review is in
`.factory/review-2.md`.

The cold mobile/desktop first screen and isolated demo pass. All nine declared
claim commands pass independently. Review 1 finding F-1-2 is only partly fixed:
landing/README copy still promises custom template/range authoring and a
restorable valid JSON import, but no listed tagged test proves those outcomes.
The review also records inconsistent user terminology, incomplete static
404/offline shells, and incorrect edit metadata for missing IDs.

## Verification performed

- Fresh live Chromium at 390×844 and 1440×900, before scroll.
- One-click sample, demo mutation/reset/exit, separate IndexedDB namespaces,
  same-origin request log, and live service-worker offline reload.
- Route metadata, one H1/main, 390 px overflow, pushState/back focus, missing
  routes, all discovered links, response headers, social image, and visual
  identity.
- Factory `verify-url.sh` and settled Playwright axe scans: no console errors
  or serious/critical accessibility violations on the tested normal routes.
- Clean clone `/tmp/flex-review2-clean-DkfkS6`: `npm ci`; every command in
  `.factory/claims.json` separately (9/9 pass); `npm test` (12 unit + 15
  browser tests); `npm run build` (`dist/index.html`, 11.45 kB gzip JS).
- Every earlier review finding was checked live and in code. F-1-1 and F-1-3
  are fixed; F-1-2 is carried forward as blocking F-2-1 / F-1-2.

## Next steps

Resolve F-2-1 through F-2-4 in `.factory/review-2.md`, especially the missing
claim entries/tests, then repeat the entire review rather than testing only the
changed areas.
