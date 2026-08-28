# Flex Meal Templates

Adjust saved meal portions and keep each log inside its nutrition budget.

Flex Meal Templates is for people who repeat meals but change the serving each time. Save 10–30 personal meal templates, set calorie and macro bands, choose ingredient substitutes, and adjust one ingredient before logging. The original template stays unchanged.

The app works offline after the first visit. Meal templates and logs stay in browser-local IndexedDB. It has no account, food search, barcode lookup, analytics, or health advice.

## Try the isolated demo

Open `/demo` locally or visit <https://flex-meal-templates.sociobot.in/demo>. It includes two realistic meal templates and one earlier log. Demo records use a separate IndexedDB database and never enter real records. **Reset demo** restores the bundled sample.

## Run locally

Requirements: Node.js 20 or newer and npm.

```sh
npm ci
npm run dev
```

Vite prints the local URL. Open `/app` for real storage or `/demo` for sample data.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs calculation tests and Playwright claim tests. The browser version is pinned to Playwright 1.58.2. `npm run build` type-checks the app and writes the static site to `dist/`, with `dist/index.html` at its root.

To inspect the production build:

```sh
npm run preview
```

## Data controls

- Export CSV downloads dated meal logs and calculated nutrition totals.
- Export JSON downloads every template and log as a restorable backup.
- Import JSON checks the complete backup before replacing the current browser database.
- Invalid backups are rejected without changing saved records.
- Erase all records requires confirmation and cannot be undone.

Nutrition values are user-entered estimates. Flex Meal Templates is not medical or dietary advice.

## Deployment

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` provides the SPA fallback, security headers, and asset caching policy. The service worker caches the app shell after the first visit.

## Project notes

- Product brief: [.factory/brief.json](.factory/brief.json)
- Visual system and asset provenance: [.factory/design.md](.factory/design.md)
- Demo contract: [.factory/demo.md](.factory/demo.md)
- Tested product claims: [.factory/claims.json](.factory/claims.json)
- Build handoff: [.factory/handoff.md](.factory/handoff.md)

Released under the [MIT License](LICENSE). Built by Param Factory.
