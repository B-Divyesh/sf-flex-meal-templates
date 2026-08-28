# Adversarial first-read review 3 — Flex Meal Templates

**Reviewed:** 2026-08-28

**Candidate:** `8898a3e0c1e04371abc6724ed672e740e50fa4a1`

**Live URL:** <https://flex-meal-templates.sociobot.in>

**Verdict:** **FAIL**

The first screen, demo, claim tests, privacy behavior, accessibility checks,
and repaired findings all pass. This review still fails because the live
sitemap does not list every stable product route. PASS requires zero findings.

## Cold first read

Fresh Chromium contexts opened `/` at 390×844 and 1440×900. Nothing was
scrolled before these answers were recorded.

| Question | First-screen answer |
| --- | --- |
| What does it do? | It adjusts a repeated meal's portion, checks the changed portion against saved nutrition ranges, and leaves the meal template unchanged. |
| For whom? | People who repeat meals but vary each portion. |
| What should I click first? | **Try it with sample data**. The adjacent result says, “Open two sample meal templates. Nothing enters your records.” |

The mobile action starts at 424 px and ends at 472 px. The three fact lines end
above 752 px, so the task, audience, primary action, result, offline/local/free
facts, and secondary real-data action all fit inside the 844 px first screen.
The 390 px page has no horizontal overflow. The desktop first screen exposes
the same answers. Neither context produced a console or page error.

## Findings

### F-3-1 — Minor — The sitemap omits stable product routes

**Exact location:** live and repository `sitemap.xml`. It lists `/`, `/demo`,
`/app`, `/privacy`, and `/terms`, but omits the stable routes `/app/new` and
`/demo/new`. Both omitted URLs open real meal-template creation screens with
route-specific titles, descriptions, canonicals, and one H1.

**Why this fails:** The site-structure contract requires `sitemap.xml` to list
every route. The inventory is internally inconsistent: it includes the
`noindex` app and demo workspaces but omits their stable creation routes. A
crawler or route-inventory verifier cannot discover the complete product
surface from the sitemap.

**Concrete fix:** Add
`https://flex-meal-templates.sociobot.in/app/new` and
`https://flex-meal-templates.sociobot.in/demo/new` to `public/sitemap.xml`.
Add a test that compares the sitemap's stable URLs with the stable paths in
the route metadata table, excluding parameterized edit URLs and error/offline
fallback documents by an explicit rule.

## Copy audit

Counts treat a hyphenated term, number, URL, or path as one word. Commands are
not sentences. Labels and headings are included so their meaning can be
checked out of context. No sentence exceeds 22 words, no banned marketing
word appears, terminology is consistent, and the two landing actions name
their result. There are no copy findings.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass: direct navigation. |
| Flex Meals | 2 | Pass: readable mobile wordmark. |
| Flex Meal Templates | 3 | Pass: full wordmark. |
| My meals | 2 | Pass: navigation destination. |
| Demo | 1 | Pass: navigation destination. |
| Privacy | 1 | Pass: navigation destination. |
| Adjust portions without changing meal templates | 6 | Pass: task-first H1; `portion-adjust`. |
| For people who repeat meals and want each portion checked against their nutrition ranges. | 14 | Pass: audience and outcome. |
| Try it with sample data | 5 | Pass: result-naming primary action; `demo-sample`. |
| Open two sample meal templates. | 5 | Pass: adjacent result; `demo-sample`. |
| Nothing enters your records. | 4 | Pass: `demo-isolation`. |
| Create your first meal template | 5 | Pass: result-naming action; `template-authoring`. |
| Works offline after the first visit. | 6 | Pass: `offline-reload`. |
| Your records stay in this browser. | 6 | Pass: `local-only`. |
| Free. | 1 | Pass: `free-product`. |
| Export CSV or JSON. | 4 | Pass: `csv-json-export`. |
| A kitchen scale and ingredient slips arranged like a newspaper layout. | 11 | Pass: useful image alt text. |
| One meal template. | 3 | Pass: consistent term. |
| Today’s portion stays editable. | 4 | Pass: `portion-adjust`. |
| Meal preview | 2 | Pass: section-naming heading. |
| Meal template | 2 | Pass: preview label. |
| Weekday overnight oats | 3 | Pass: realistic sample name. |
| 60 g oats · 170 g yogurt · 100 g banana | 9 | Pass: sample contents. |
| Today · 0.75× | 2 | Pass: sample state. |
| Smaller early breakfast | 3 | Pass: sample log name. |
| 60 g 45 g oats · totals update before saving | 9 | Pass: shown change; `portion-adjust`. |
| How it works | 3 | Pass: section-naming heading. |
| Save the meal template | 4 | Pass: task heading; `template-authoring`. |
| Enter each ingredient and its estimated nutrition. | 7 | Pass: concrete instruction. |
| Set the nutrition ranges | 4 | Pass: task heading; `template-authoring`. |
| Choose calorie and macro minimums and maximums for this meal. | 10 | Pass: concrete instruction. |
| Adjust and log | 3 | Pass: task heading. |
| Change the portion or a single ingredient. | 7 | Pass: `portion-adjust`. |
| Then export the record. | 4 | Pass: `csv-json-export`. |
| Limits and privacy | 3 | Pass: section-naming heading. |
| You enter the nutrition estimates for each ingredient. | 8 | Pass: user responsibility. |
| Your meal templates and logs stay in this browser. | 9 | Pass: `local-only`. |
| Export JSON backups or erase this browser’s records. | 8 | Pass: `csv-json-export`, `erase-confirmation`. |
| Adjust portions without copying meal templates. | 6 | Pass: informative footer line; `portion-adjust`. |
| Privacy | 1 | Pass: footer destination. |
| Terms | 1 | Pass: footer destination. |
| Built by Param Factory | 4 | Pass: attribution link. |
| external site | 2 | Pass: screen-reader clarification. |
| Version 1.0.3 | 2 | Pass: matches `package.json`. |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Flex Meal Templates | 3 | Pass: document title. |
| Adjust meal portions and keep each log inside its nutrition ranges. | 11 | Pass: task summary. |
| Flex Meal Templates is for people who repeat meals but change the portion each time. | 15 | Pass: audience. |
| Save meal templates, set nutrition ranges, and adjust a portion before logging. | 12 | Pass: `template-authoring`, `portion-adjust`. |
| The meal template stays unchanged. | 5 | Pass: `portion-adjust`. |
| The app works offline after the first visit. | 8 | Pass: `offline-reload`. |
| Meal templates and logs stay in this browser. | 8 | Pass: `local-only`. |
| The complete product is free to use. | 7 | Pass: `free-product`. |
| Try sample meals | 3 | Pass: section-naming heading. |
| Open `/?demo=1` locally or visit `https://flex-meal-templates.sociobot.in/?demo=1`. | 6 | Pass: direct instruction. |
| The sample opens two meal templates and one earlier log. | 10 | Pass: `demo-sample`. |
| Demo records use a separate browser database and never enter real records. | 12 | Pass: `demo-isolation`. |
| Reset demo restores the bundled sample. | 6 | Pass: `demo-isolation`, `demo-sample`. |
| Run locally | 2 | Pass: section-naming heading. |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass: prerequisite. |
| Vite prints the local URL. | 5 | Pass: developer instruction. |
| Open `/app` for real storage or `/demo` for sample data. | 10 | Pass: developer instruction. |
| Test and build | 3 | Pass: section-naming heading. |
| `npm test` runs calculation tests and Playwright claim tests. | 9 | Pass: verified. |
| The browser version is pinned to Playwright 1.58.2. | 8 | Pass: matches `package.json`. |
| `npm run build` type-checks the app and writes the static site to `dist/`, with `dist/index.html` at its root. | 18 | Pass: verified. |
| To inspect the production build | 5 | Pass: direct instruction. |
| Data controls | 2 | Pass: section-naming heading. |
| Export CSV downloads dated meal logs and calculated nutrition totals. | 10 | Pass: `csv-json-export`. |
| Export JSON downloads every meal template and log as a restorable backup. | 11 | Pass: `csv-json-export`, `json-roundtrip`. |
| Import JSON checks the complete backup, then restores every meal template and log. | 13 | Pass: `validated-json-import`, `json-roundtrip`. |
| Invalid backups are rejected without changing saved records. | 8 | Pass: `validated-json-import`. |
| Erase all records asks for confirmation before clearing the active browser workspace. | 12 | Pass: `erase-confirmation`. |
| Nutrition values are user-entered estimates. | 5 | Pass: necessary limitation. |
| Flex Meal Templates is not medical or dietary advice. | 9 | Pass: necessary limitation. |
| Deployment | 1 | Pass: section-naming heading. |
| Deploy the contents of `dist/` as a static site. | 9 | Pass: developer instruction. |
| `staticwebapp.config.json` provides the SPA fallback, security headers, and asset caching policy. | 11 | Pass: confirmed in the file and live headers. |
| The service worker caches the app shell after the first visit. | 11 | Pass: `offline-reload`. |
| Project notes | 2 | Pass: section-naming heading. |
| Product brief: `.factory/brief.json` | 3 | Pass: document link. |
| Visual system and asset provenance: `.factory/design.md` | 6 | Pass: document link. |
| Demo contract: `.factory/demo.md` | 3 | Pass: document link. |
| Tested product claims: `.factory/claims.json` | 4 | Pass: document link. |
| Build handoff: `.factory/handoff.md` | 3 | Pass: document link. |
| Released under the MIT License. | 5 | Pass: `LICENSE` exists. |
| Built by Param Factory. | 4 | Pass: attribution. |

The terminology table is consistent: **meal template** for the reusable meal,
**log** for one dated use, **portion** or **portion multiplier** for the scale,
**nutrition range** for the desired interval, **substitute** for an ingredient
alternative, **JSON backup** for a restorable copy, **CSV export** for logs,
and **demo** for the isolated sample mode.

## Demo and sandbox verification

- One click on **Try it with sample data** opened `/?demo=1` and settled on
  **Adjust a meal for today**. Its first 390 px screen already showed
  **Weekday overnight oats** and **Lentil desk lunch** with calorie values.
- The persistent banner reads **Demo — sample data, nothing is saved** and
  exposes **Reset demo** and **Start for real**.
- The sample began with two meal templates and one earlier log. Logging added
  a second log. **Start for real** opened an empty real workspace with no demo
  meal. Returning to `/demo` restored the original sample; **Reset demo** also
  restored one log.
- IndexedDB exposed separate `flex-meals-demo` and `flex-meals-real`
  databases. The code selects only the active namespace. No demo meal appeared
  in real mode.
- The complete live demo flow, including logging, leaving, resetting, and
  offline reload, recorded only
  `https://flex-meal-templates.sociobot.in` requests. No analytics, external
  script, external font, tracker, AI endpoint, or provider key request was
  observed.
- After service-worker control, `/demo` reloaded offline with the sample meal
  and the notice **You are offline. Meal templates and logging still work.**
  No console or page error occurred.

The demo and sandbox gate passes.

## Declared claims

A clean clone at `/tmp/flex-review3-clean-bZvvEE/repo` checked out candidate
`8898a3e`. After `npm ci`, every command in `.factory/claims.json` was run
separately.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `portion-adjust` | PASS | 0.75× changed calories to 386 and below range, logged the meal, and retained the 60 g template amount. |
| `offline-reload` | PASS | A service-worker-controlled demo reloaded offline with sample data and the offline notice. |
| `local-only` | PASS | The complete demo log flow produced no cross-origin request. |
| `csv-json-export` | PASS | CSV headers and row count passed; JSON contained both templates and the log. |
| `demo-isolation` | PASS | Demo mutation did not enter real storage; reset restored the sample. |
| `demo-sample` | PASS | Query entry showed the banner, both named meals, one earlier log, reset, and real-mode exit. |
| `free-product` | PASS | Logging and export remained available without a purchase or upgrade action. |
| `validated-json-import` | PASS | A malformed nested backup was rejected and the existing IndexedDB state survived reload. |
| `template-authoring` | PASS | Non-default calorie and macro ranges survived reload and governed a logged meal. |
| `json-roundtrip` | PASS | The exact exported templates and logs were restored after erasure. |
| `erase-confirmation` | PASS | Dismissal preserved data; confirmed demo erasure did not clear real records. |

The 11 claim commands are 11/11 pass, and every claim ID occurs in exactly one
tagged browser test. The live landing, README, Privacy copy, and Terms copy do
not add an unlisted visitor-facing product promise. Privacy details are
covered by `local-only` and `demo-isolation`; the request log confirms their
network boundary. There is no untested claim.

The complete clean-clone `npm test` also passed 12 unit and 20 browser tests.
`npm run build` passed and produced `dist/index.html`; JavaScript is 11.46 kB
gzip and CSS is 4.02 kB gzip.

## History reconciliation

Every earlier review, polish report, and handoff was read. Each earlier item
was checked on the live site and in current code rather than accepted from its
status label.

| Earlier finding | Current result |
| --- | --- |
| F-1-1 — decorative/context-free headings | **Fixed.** The named decorative labels remain absent. Live landing headings are **Meal preview**, **How it works**, and **Limits and privacy**; source matches. |
| F-1-2 / F-2-1 — unlisted authoring and restore claims | **Fixed.** `template-authoring` and `json-roundtrip` are listed once each and their independent clean-clone commands pass. |
| F-1-3 — landing metadata reused on other routes | **Fixed.** Live app, demo, new-meal, legal, and missing routes use route-specific title, description, Open Graph/Twitter text, canonical, and robots values. |
| F-2-2 — inconsistent terms and mobile “FMT” | **Fixed.** The live mobile wordmark is **Flex Meals**. Landing, app, README, metadata, manifest, and claims use meal template, portion, and nutrition range consistently. |
| F-2-3 — incomplete static 404/offline skeleton | **Fixed.** Both live documents have the normal header/footer, legal links, attribution, version, metadata, icons, 44 px controls, and zero serious/critical axe findings. A genuine missing asset returns HTTP 404. |
| F-2-4 — invalid edit links retain editor metadata | **Fixed.** Both invalid real and demo edit URLs show **Page not found**, missing-page metadata, `noindex`, and the `/404` canonical. |
| Earlier malformed-backup corruption defect | **Fixed.** Nested validation occurs before storage writes; the claim test preserves the prior database and reloads without an error. |
| Polish-2 responsive hero and motion checks | **Fixed.** The 390 px page has no overflow, all first-screen facts fit, text remains opaque, and reduced motion removes transitions. |

No earlier finding regressed. F-3-1 is a new route-inventory finding.

## Structure, accessibility, links, and identity

- Home follows **Product — what it does** and is 49 characters. Demo, app,
  creation, edit, Privacy, Terms, missing, 404, and offline routes use their
  own plain titles. Checked routes have exactly one H1, one main landmark,
  route-specific descriptions and canonicals, Open Graph/Twitter metadata,
  the SVG favicon, 180 px Apple icon, and product social image at 1200×630.
- SPA navigation uses `pushState`. Live navigation to Privacy focused its H1;
  Back returned to the landing H1 at scroll position 0. The polite route
  announcer and reduced-motion path are present. Direct deep links render the
  expected state. F-3-1 is the remaining route-inventory defect.
- Every discovered internal navigation URL returned 200. The Param Factory
  external link returned 200. `/missing.js` returned 404 with the designed
  fallback. No dead link was found.
- Live `verify-url.sh` checks passed on home, demo, Privacy, Terms, and a
  missing route: `lang=en`, one H1, main, alt text, labelled buttons, and no
  console error. Settled live axe scans of home, demo, Privacy, Terms, SPA
  missing, static 404, and offline pages found zero serious or critical
  violations. Keyboard claim/release tests pass; focus is visible; controls
  are at least 44 px; forms are labelled; and reduced motion is respected.
- Live CSP, `nosniff`, referrer policy, permissions policy, canonical/social
  assets, manifest, robots file, SPA fallback, and genuine asset 404 behavior
  are present. Twenty repeated root requests returned 200 after one earlier,
  non-repeating transient response during the crawl.
- The warm newsprint palette, square rules, serif/sans type pairing, editorial
  grid, nutrition tables, and original kitchen-scale still life match the
  repository's broadsheet thesis. The page is visually specific to meal
  templates and does not use a generic centered SaaS hero, icon-card grid, or
  gradient decoration.

## Missed leverage

No additional AI step is implied. Nutrition arithmetic is deterministic and
the user supplies the estimates; runtime model use would add cost, network
dependence, and privacy risk without completing the core task. The expected
local-first leverage is present: CSV log export, validated JSON backup and
restore, offline use, substitutes, and isolated sample data. Sync is not an
obvious omission because it would contradict the explicit browser-only model
unless accounts and a privacy boundary were added. No decorative AI feature
or embedded provider key exists.

## What would make this perfect

Add the two stable creation routes to the sitemap and add a route-to-sitemap
inventory test. Then rerun all 11 claim commands and the complete cold mobile,
desktop, demo isolation, offline, copy, metadata, link, focus, accessibility,
and history checklist. With that single finding removed and no regression,
the review would have nothing left to report and could pass.
