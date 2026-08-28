# Flex Meal Templates — review 4 handoff

## Result

**FAIL.** This review changed no product code. It recorded one remaining issue:
the SPA resets scroll to the top on browser Back/Forward instead of restoring
the visitor's position. See `F-4-1` in `.factory/review-4.md`.

## What was reviewed

- Ran a cold live first-read check at 390 px and desktop.
- Entered the one-click live demo, logged a sample, reset it, left for the
  empty real workspace, captured requests, and reloaded it offline.
- Crawled every landing link and checked direct routes, metadata, fallback
  pages, missing edit URLs, focus, history, and a genuine 404 response.
- Read all prior review, polish, verification, demo, and handoff documents;
  every earlier finding is verified fixed in `.factory/review-4.md`.

## Verification

Fresh clone: `/tmp/flex-review4-clean-HTGKn8/repo` at `f39e519`.

- `npm ci` passed with zero audit vulnerabilities.
- Every declared claim command passed independently (11/11).
- `npm test` passed: 12 unit and 21 Playwright browser tests.
- `npm run build` passed and produced `dist/` (11.50 kB gzip JavaScript).

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/?demo=1` for the isolated sample.

## Known gap and next step

Implement scroll-state restoration for `popstate` navigation, preserve the
existing destination-H1 focus behaviour, and add the F-4-1 regression test.
