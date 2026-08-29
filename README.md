# Flex Meal Templates

Adjust meal portions and keep each log inside its nutrition ranges.

Flex Meal Templates is for people who repeat meals but change the portion each time. Save meal templates, set nutrition ranges, and adjust a portion before logging. The meal template stays unchanged.

The app works offline after the first visit. Meal templates and logs stay in this browser. The complete product is free to use.

## Try sample meals

Open `/?demo=1` locally or visit <https://flex-meal-templates.sociobot.in/?demo=1>. The sample opens two meal templates, one earlier log, and a portion ready to adjust. Demo records use a separate browser database and never enter real records. **Reset demo** restores the bundled sample.

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
- Export JSON downloads every meal template and log as a restorable backup.
- Import JSON checks the complete backup, then restores every meal template and log.
- Invalid backups are rejected without changing saved records.
- Erase all records asks for confirmation before clearing the active browser workspace.

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
