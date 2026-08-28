# Flex Meal Templates — polish round 3 handoff

## Result

**PASS.** All findings in review rounds 1–3 are resolved in the shipped PWA.
The repair commit is `ed8c9d6c591c4e6afe840578b28f50008d5df826` and is
pushed to `main`. Static deployment
`149a4b66-bb13-4c2e-a34e-44624a0191d8` succeeded at
<https://flex-meal-templates.sociobot.in>.

## What changed

- Added `/app/new` and `/demo/new` to `public/sitemap.xml`.
- Moved the SPA route metadata into `src/routes.ts` and made the sitemap
  inventory derive from that one table, with explicit exclusions for edit,
  404, and offline fallback routes.
- Added the browser test `sitemap lists every stable route in the route
  metadata inventory` so future route additions cannot silently miss the
  sitemap.
- Updated the catalog sentence to a 71-character, verb-first description.

## Verification

### Fresh clone

Clean clone: `/tmp/flex-polish3-clean-zMEClL/repo` at `ed8c9d6`.

- `npm ci` — passed; `npm audit --audit-level=high` reported zero
  vulnerabilities.
- Every command declared by `.factory/claims.json` passed independently:
  `portion-adjust`, `offline-reload`, `local-only`, `csv-json-export`,
  `demo-isolation`, `demo-sample`, `free-product`,
  `validated-json-import`, `template-authoring`, `json-roundtrip`, and
  `erase-confirmation` (11/11).
- `npm test` — passed: 12 Vitest unit tests and 21 Playwright browser tests.
  This includes browser axe coverage, keyboard navigation, mobile overflow,
  metadata, fallback pages, recovery, privacy requests, and offline reload.
- `npm run build` — passed and created `dist/index.html`; production output is
  11.50 kB gzip JavaScript and 4.02 kB gzip CSS.

### Cold live recheck after deployment

- `/opt/fleet/lib/verify-url.sh` passed with no console/page errors on home,
  `?demo=1`, `/app/new`, `/demo/new`, Privacy, Terms, missing SPA route,
  static 404, offline fallback, and both invalid edit URLs. Each had
  `lang=en`, one H1, a main landmark, image alt text, and labelled buttons.
  Screenshots and reports are in `.factory/evidence/polish-3/`.
- A separate fresh Chromium check confirmed the exact seven-url sitemap
  inventory, both newly added creation routes, a genuine missing asset HTTP
  404, no horizontal overflow at 390 px, demo banner/reset/real-mode flow,
  0.75 portion calculation of 386 kcal, same-origin-only demo requests,
  service-worker offline reload, zero console/page errors, and zero
  serious/critical axe violations on all product routes.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/?demo=1` for the isolated sample. See
`.factory/demo.md` for the storage and reset contract.

## Known gaps

None.
