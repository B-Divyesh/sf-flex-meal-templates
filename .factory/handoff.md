# Flex Meal Templates — build handoff

## What shipped

- A complete Vite + vanilla TypeScript offline PWA at `/app`.
- Editable meal templates with base ingredients, one optional substitute per ingredient, notes, and calorie, protein, carb, and fat bands.
- A logging sheet with a 0.25×–3× serving multiplier, individual ingredient amount edits, substitutions, live totals, and written below/within/above states.
- Dated logs that preserve the template. CSV log export, full JSON backup and restore, confirmed template deletion, and confirmed irreversible database deletion.
- Browser-local IndexedDB storage with separate `flex-meals-real` and `flex-meals-demo` databases.
- A one-click `/demo` with two realistic meals, a prior log, a persistent sandbox banner, reset, and start-real actions.
- An installable manifest, 192/512/maskable icons, a versioned service worker, offline shell, update notice, and a designed 404.
- Home, demo, app, privacy, and terms routes with history navigation, focus movement, route titles, canonical URLs, sitemap, robots file, and static-host security headers.
- The original monochrome kitchen-scale illustration and responsive WebP derivatives. Prompt, rejection notes, and provenance are in `.factory/design.md` and `assets/src/`.

## Verification on 2026-08-28

- `npm test`: passed 3 Vitest unit tests and 8 Playwright tests.
- Every `.factory/claims.json` command passes against `/demo`.
- Offline claim: passed after setting a fresh Playwright browser context offline and reloading `/demo`; the sample and logging UI remained available.
- Privacy claim: the tested logging flow made only same-origin requests.
- `npm run build`: passed; output is `dist/` with `dist/index.html` at its root.
- Production bundle: 10.53 KB gzip JavaScript and 3.99 KB gzip CSS. Desktop hero is 65 KB; mobile hero is 29 KB.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh`: home and demo returned 200, had one H1, `lang=en`, a main landmark, labelled controls and images, and zero console errors.
- Playwright axe checks: zero serious or critical violations on home, demo, and privacy.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100. LCP 1.5 s, CLS 0, total blocking time 0 ms. Lab Lighthouse does not report INP without a real interaction sample.
- Visual checks at 1440×1000 and 390×844 found no horizontal overflow. Evidence is stored in `.factory/evidence/`.
- `npm audit`: 0 known vulnerabilities.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run preview
```

Deploy the contents of `dist/`. The exact factory build command is `npm run build` and the deploy directory is `./dist`.

## Known limits and next steps

- Data is local to one browser. Clearing site data removes it unless the user exported a JSON backup.
- There is no cross-device sync, food database, barcode lookup, recipe import, or meal-plan generator. These are intentional v1 non-goals.
- Nutrition is based on user-entered estimates and is not health advice.
- The editor stores one substitute per base ingredient in v1. Logged meals can choose that substitute and change its amount.
- A later pilot should measure the brief’s success metric: two adjusted reused-meal logs per week for at least 60% of participants.
