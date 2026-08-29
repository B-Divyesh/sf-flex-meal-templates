# Flex Meal Templates — polish round 4 handoff

## Result

**PASS.** Every finding in reviews 1–4 and every earlier polish acceptance
item is resolved. Browser Back and Forward now restore each route's scroll
position while keeping the destination H1 focused and announced.

The final product code is `a82023d0abec33b5d7f661f5466ef529ff8c71e5` on
`origin/main`. Deployment `a3fd57c8-1e14-47b2-b7dd-164e29322759` is live at
<https://flex-meal-templates.sociobot.in>.

## What changed

- Replaced the shared route-change boolean with explicit initial, push, and
  history navigation modes.
- Assigned each history entry its own scroll state. Link navigation saves the
  departing position and starts the new page at the top. Back/Forward restores
  the saved destination position after the DOM is ready.
- Focuses and announces the destination H1 with `preventScroll`, so focus does
  not overwrite the restored viewport.
- Added the F-4-1 Back/Forward regression, including separate home and demo
  positions and H1 focus assertions.
- Updated the verb-first catalog description to 78 characters.
- Preserved the existing broadsheet visual identity, isolated demo databases,
  route metadata, legal/static pages, offline shell, and complete claim suite.

The finding-by-finding record is in [polish-4.md](polish-4.md).

## Exact verification

Final clean clone: `/tmp/flex-polish4-final-lyBYHx/repo` at `a82023d`.

- `npm ci`: passed; zero audit vulnerabilities.
- Every command in `.factory/claims.json`: 11/11 passed independently.
- `npm test`: 12 unit and 22 Playwright browser tests passed.
- `npm run build`: passed; `dist/index.html` exists.
- Build size: 36.88 kB JavaScript (11.93 kB gzip), 14.67 kB CSS
  (4.02 kB gzip), no external font or script.
- F-4-1 regression: five repeated local runs passed, then the clean-clone run
  passed. The cold live run restored home `2186 → 2186` and demo `420 → 420`
  while the correct H1 remained focused.
- Local Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; 1.51 s LCP, 0 CLS, 4 ms total blocking time.
- Live Lighthouse: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; 1.05 s LCP, 0 CLS, 6.5 ms total blocking time.
- `/opt/fleet/lib/verify-url.sh` passed on live home, `?demo=1`, Privacy,
  Terms, `/app/new`, `/demo/new`, invalid edit, 404, and offline pages.
- The final cold live script passed 80 checks: route titles/descriptions,
  one H1/main, 390 px fit, axe, demo log/reset/exit isolation, same-origin
  requests, service-worker offline reload, Back/Forward position and focus,
  CSP/nosniff headers, real asset 404, sitemap inventory, and byte-for-byte
  deployed JavaScript equality.

Evidence is under [evidence/polish-4](evidence/polish-4), including
`live-check.json`, local/live Lighthouse reports, route screenshots, and the
dedicated Back/Forward viewports.

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
