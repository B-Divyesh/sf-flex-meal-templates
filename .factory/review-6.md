# Adversarial first-read review 6 — Flex Meal Templates

**Reviewed:** 2026-08-29  
**Candidate:** `37eeb2b35e19d9960e84730dbdeab2553bda4106`  
**Live URL:** <https://flex-meal-templates.sociobot.in>  
**Verdict:** **PASS**

No blocking or minor finding remains. This was a full cold, live, and
clean-clone review rather than a diff-only check.

## Cold first read

Fresh 390×844 and 1440×1000 Chromium contexts opened `/` without scrolling.

| Question | First-screen answer |
| --- | --- |
| What does it do? | “Adjust portions without changing meal templates.” |
| For whom? | “For people who repeat meals and want each portion checked against their nutrition ranges.” |
| What should I click? | **Try it with sample data**. “Open two sample meal templates. One is ready to adjust. Nothing enters your records.” |

On the 390 px screen the headline ended at y=281, audience at y=396, demo
action at y=535, real-data action at y=595, and three facts at y=752. All fit
inside 844 px. There was no horizontal overflow, console error, or page error.

## Findings

None.

## Copy audit

Counts treat a hyphenated term, number, path, URL, and code command as one
word. Headings, labels, navigation, and actions are included. No item exceeds
22 words; no jargon, banned marketing adjective, mood heading, inconsistent
visitor term, or unnamed-result action was found. Claim IDs identify the
observable test; developer instructions and safety disclaimers are not product
claims.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass — navigation action. |
| Flex Meals | 2 | Pass — mobile wordmark. |
| Flex Meal Templates | 3 | Pass — full wordmark. |
| My meals | 2 | Pass — destination. |
| Demo | 1 | Pass — destination. |
| Privacy | 1 | Pass — destination. |
| Adjust portions without changing meal templates | 6 | Pass — plain job; `portion-adjust`. |
| For people who repeat meals and want each portion checked against their nutrition ranges. | 14 | Pass — audience/outcome. |
| Try it with sample data | 5 | Pass — result action; `demo-sample`. |
| Open two sample meal templates. | 5 | Pass — `demo-sample`. |
| One is ready to adjust. | 5 | Pass — `demo-sample`. |
| Nothing enters your records. | 4 | Pass — `demo-isolation`. |
| Create your first meal template | 5 | Pass — result action; `template-authoring`. |
| Works offline after the first visit. | 6 | Pass — `offline-reload`. |
| Your records stay in this browser. | 6 | Pass — `local-only`. |
| Free. | 1 | Pass — `free-product`. |
| Export CSV or JSON. | 4 | Pass — `csv-json-export`. |
| A kitchen scale and ingredient slips arranged like a newspaper layout. | 11 | Pass — useful alt text. |
| One meal template. | 3 | Pass. |
| Today’s portion stays editable. | 4 | Pass — `portion-adjust`. |
| Meal preview | 2 | Pass — section name. |
| Meal template | 2 | Pass. |
| Weekday overnight oats | 3 | Pass — sample name. |
| 60 g oats · 170 g yogurt · 100 g banana | 9 | Pass — sample contents. |
| Today · 0.75× | 2 | Pass — sample state. |
| Smaller early breakfast | 3 | Pass — sample log name. |
| 60 g 45 g oats · totals update before saving | 9 | Pass — `portion-adjust`. |
| How it works | 3 | Pass — section name. |
| Save the meal template | 4 | Pass — `template-authoring`. |
| Enter each ingredient and its estimated nutrition. | 7 | Pass. |
| Set the nutrition ranges | 4 | Pass — `template-authoring`. |
| Choose calorie and macro minimums and maximums for this meal. | 10 | Pass. |
| Adjust and log | 3 | Pass — task name. |
| Change the portion or a single ingredient. | 7 | Pass — `portion-adjust`. |
| Then export the record. | 4 | Pass — `csv-json-export`. |
| Limits and privacy | 3 | Pass — section name. |
| You enter the nutrition estimates for each ingredient. | 8 | Pass — scope disclosure. |
| Your meal templates and logs stay in this browser. | 9 | Pass — `local-only`. |
| Export JSON backups or erase this browser’s records. | 8 | Pass — `csv-json-export`, `erase-confirmation`. |
| Adjust portions without copying meal templates. | 6 | Pass — `portion-adjust`. |
| Terms | 1 | Pass — destination. |
| Built by Param Factory | 4 | Pass — labelled external link. |
| external site | 2 | Pass — screen-reader clarification. |
| Version 1.0.4 | 2 | Pass — build label. |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Flex Meal Templates | 3 | Pass — document title. |
| Adjust saved meal portions and keep each log inside its nutrition budget. | 11 | Pass — `portion-adjust`. |
| Flex Meal Templates is for people who repeat meals but change the portion each time. | 15 | Pass — audience. |
| Save meal templates, set nutrition ranges, and adjust a portion before logging. | 12 | Pass — `template-authoring`, `portion-adjust`. |
| The meal template stays unchanged. | 5 | Pass — `portion-adjust`. |
| The app works offline after the first visit. | 8 | Pass — `offline-reload`. |
| Meal templates and logs stay in this browser. | 8 | Pass — `local-only`. |
| The complete product is free to use. | 7 | Pass — `free-product`. |
| Try sample meals | 3 | Pass — section name. |
| Open `/?demo=1` locally or visit <https://flex-meal-templates.sociobot.in/?demo=1>. | 6 | Pass — direct instruction. |
| The sample opens two meal templates, one earlier log, and a portion ready to adjust. | 15 | Pass — `demo-sample`. |
| Demo records use a separate browser database and never enter real records. | 12 | Pass — `demo-isolation`. |
| Reset demo restores the bundled sample. | 6 | Pass — `demo-isolation`, `demo-sample`. |
| Run locally | 2 | Pass — section name. |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass — prerequisite. |
| Vite prints the local URL. | 5 | Pass — instruction. |
| Open `/app` for real storage or `/demo` for sample data. | 10 | Pass — instruction. |
| Test and build | 3 | Pass — section name. |
| `npm test` runs calculation tests and Playwright claim tests. | 8 | Pass — verified. |
| The browser version is pinned to Playwright 1.58.2. | 8 | Pass — matches package. |
| `npm run build` type-checks the app and writes the static site to `dist/`, with `dist/index.html` at its root. | 18 | Pass — verified. |
| To inspect the production build: | 5 | Pass — instruction lead-in. |
| Data controls | 2 | Pass — section name. |
| Export CSV downloads dated meal logs and calculated nutrition totals. | 10 | Pass — `csv-json-export`. |
| Export JSON downloads every meal template and log as a restorable backup. | 12 | Pass — `csv-json-export`, `json-roundtrip`. |
| Import JSON checks the complete backup, then restores every meal template and log. | 13 | Pass — `validated-json-import`, `json-roundtrip`. |
| Invalid backups are rejected without changing saved records. | 8 | Pass — `validated-json-import`. |
| Erase all records asks for confirmation before clearing the active browser workspace. | 12 | Pass — `erase-confirmation`. |
| Nutrition values are user-entered estimates. | 5 | Pass — limitation. |
| Flex Meal Templates is not medical or dietary advice. | 9 | Pass — safety disclaimer. |
| Deployment | 1 | Pass — section name. |
| Deploy the contents of `dist/` as a static site. | 9 | Pass — instruction. |
| `staticwebapp.config.json` provides the SPA fallback, security headers, and asset caching policy. | 11 | Pass — verified. |
| The service worker caches the app shell after the first visit. | 10 | Pass — `offline-reload`. |
| Project notes | 2 | Pass — section name. |
| Product brief: `.factory/brief.json` | 3 | Pass — document link. |
| Visual system and asset provenance: `.factory/design.md` | 6 | Pass — document link. |
| Demo contract: `.factory/demo.md` | 3 | Pass — document link. |
| Tested product claims: `.factory/claims.json` | 4 | Pass — document link. |
| Build handoff: `.factory/handoff.md` | 3 | Pass — document link. |
| Released under the MIT License. | 5 | Pass — licence statement. |
| Built by Param Factory. | 4 | Pass — attribution. |

## Demo, claims, and privacy

- One landing click opened `/?demo=1` directly into the active product. At
  390×844, it showed the persistent banner, both sample meals, the complete
  portion control (y=511–614), and **514 kcal / Within range** (y=656–735).
- The banner said **“Demo — sample data, nothing is saved”** and exposed
  **Reset demo** and **Start for real**. A fresh flow had two rows, three after
  logging, and two after Reset. Start for real reached an empty `/app` with no
  sample meal. Code uses distinct `flex-meals-demo` and `flex-meals-real`
  IndexedDB databases.
- The full live demo flow made no cross-origin request and produced no
  console/page error. After service-worker control, offline `/demo` reload
  retained the sample and showed the offline notice.
- Fresh clone `/tmp/flex-review6-eyqyVs/repo` ran `npm ci` with zero
  vulnerabilities. Each of the 11 commands in `.factory/claims.json` passed
  independently: `portion-adjust`, `offline-reload`, `local-only`,
  `csv-json-export`, `demo-isolation`, `demo-sample`, `free-product`,
  `validated-json-import`, `template-authoring`, `json-roundtrip`, and
  `erase-confirmation`.
- `npm test` passed 12 unit and 25 browser tests (`status: "passed"`), and
  `npm run build` produced `dist/index.html`. JS was 11.98 kB gzip and CSS
  4.31 kB gzip. The live JS SHA-256 matched the fresh build:
  `adf52279a37d722c2ec44e6c3cbda9b97cc596292ba61998ca22395ca9f529b5`.
- Every landing/README claim maps to the inventory. No unlisted claim remains.

## History, routes, and visual identity

| Earlier finding | Current verification |
| --- | --- |
| F-1-1 | Fixed: decorative labels remain absent; headings name their sections. |
| F-1-2 / F-2-1 | Fixed: all product promises are declared and independently tested. |
| F-1-3 | Fixed: direct routes have route-specific metadata. |
| F-2-2 | Fixed: “Flex Meals” on mobile; consistent terminology. |
| F-2-3 | Fixed: static 404/offline pages use the full shared skeleton and metadata. |
| F-2-4 | Fixed: invalid edits use missing-page metadata and `/404` canonical. |
| F-3-1 | Fixed: sitemap lists all seven stable routes. |
| F-4-1 | Fixed: Back restored home y=2186; Forward restored demo y=420; H1 focus moved correctly. |
| F-5-1 | Fixed: the initial phone demo shows the adjustment and range result. |
| Malformed-backup defect | Fixed: invalid JSON is rejected before writes; existing records survive. |

The live route crawl covered home, real/demo workspaces and creation pages,
legal pages, missing route, invalid edits, static 404, and offline. All had one
`h1`, one `main`, `lang="en"`, no 390 px overflow, route-specific title,
description, canonical, OG description, and favicon. Every discovered internal
link plus the labelled Param Factory link returned 200; a missing JS asset
returned HTTP 404. Header/footer, Privacy/Terms, robots, sitemap, manifest,
social image, and response-header CSP are present.

The newsprint broadsheet, original kitchen-scale art, serif/sans pair, square
rules, and proofing-red accent match `.factory/design.md` and are not a generic
SaaS template. No third-party font/script, analytics, provider key, decorative
AI feature, or missing obvious leverage was found. CSV export, JSON
backup/restore, offline support, and local-first records cover the useful
extensions implied by the brief.

## What would make this perfect

Keep rerunning the claim, 390 px demo-geometry, live-route, and deployed-byte
checks after future changes. No product change is required now.
