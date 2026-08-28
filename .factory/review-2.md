# Adversarial first-read review 2 — Flex Meal Templates

**Reviewed:** 2026-08-28  
**Candidate:** `1c16aeb9b70befd1ad89dc4234e15582d17678da`  
**Live URL:** <https://flex-meal-templates.sociobot.in>  
**Verdict:** **FAIL**

The cold first screen and isolated demo pass. All nine declared claim tests pass
from a clean clone. The product still fails this review because the earlier
unlisted-claims finding was only partly repaired. Three additional copy and
route-structure findings remain.

## Cold first read

Fresh Chromium contexts opened `/` at 390×844 and 1440×900 with no prior site
data. Nothing was scrolled before these answers were recorded.

| Question | Answer available on the first screen |
| --- | --- |
| What does it do? | “Adjust saved meals as you log.” |
| For whom? | “For people who repeat meals but change portions to match each meal’s nutrition budget.” |
| What should I click first? | **Try it with sample data**. Adjacent copy says, “Open two sample meals. Nothing enters your records.” |

All three answers are clear at both widths. The primary action, its result, and
the offline/local/free-export facts are visible without scrolling. The mobile
page has no horizontal overflow. A normal fresh context produced no console or
page error.

## Findings

### F-2-1 / carried-forward F-1-2 — Blocking — Product claims remain unlisted and untested

**Exact copy / location:**

- Landing “How it works”: “Set the meal’s bands” and “Choose calorie and macro ranges for this meal.”
- README introduction: “Save personal meal templates, set nutrition bands, and adjust a meal before logging.”
- README data controls: “Export JSON downloads every template and log as a restorable backup.”
- README data controls: “Import JSON checks the complete backup before replacing the current browser database.”

**Why this fails:** This is the unresolved part of review 1 finding F-1-2.
`portion-adjust` starts with a bundled template and changes only its serving
multiplier. It does not create a personal template or set custom bands. The
untagged “creates a real meal template” browser test is not a listed claim test
and does not set custom bands. `csv-json-export` parses an export, while
`validated-json-import` rejects one malformed file. Neither test imports a
valid exported backup and confirms that its templates and logs are restored.
The words therefore promise two useful outcomes that no `.factory/claims.json`
entry proves. Under the claims contract, an unlisted or untested claim blocks
acceptance even when the implementation appears to support it.

**Concrete fix:** Add a `template-authoring` claim and one tagged test that
creates a personal template with non-default calorie and macro ranges, reloads,
and uses those ranges in a log. Add a `json-roundtrip` claim and one tagged test
that exports known records, changes or clears the workspace, imports that exact
file, and compares every restored template and log. Update each claim’s
`where` field to name the landing page and README. Alternatively, remove the
quoted promises, but template authoring and backup restoration are core enough
to test rather than hide.

### F-2-2 — Minor — The same concepts use several terms, and the mobile brand is an unexplained abbreviation

**Exact copy / location:** mobile header “FMT”; landing/README “nutrition
budget”, “nutrition bands”, “meal’s bands”, and “ranges”; landing “base meal”,
“saved meal”, and “template”; landing/README “serving” and “portion”; README
heading “Try the isolated demo”; README “browser-local storage”.

**Why this fails:** A cold visitor must infer whether a budget, band, and range
are different settings and whether a base meal, saved meal, and template are
different records. “FMT”, “isolated”, and “browser-local” add abbreviations or
technical wording without helping the task. At 390 px the visible wordmark is
only “FMT”.

**Concrete fix:** Show **Flex Meal Templates** or **Flex Meals** in the mobile
header. Use **meal template**, **portion**, and **nutrition ranges** everywhere.
For example: “For people who repeat meals but change portions to match each
meal’s nutrition ranges”; “Set the nutrition ranges”; “Choose calorie and macro
minimums and maximums for this meal”; “Try sample meals”; and “Meal templates
and logs stay in this browser.”

### F-2-3 — Minor — Static fallback pages do not use the standard site skeleton

**Exact location:** live `/missing.js` returns the styled `public/404.html`
with HTTP 404; live `/offline.html` serves `public/offline.html`.

**Why this fails:** Both documents have a main heading and a way back, but they
omit the normal wordmark/header, Privacy and Terms links, footer one-liner,
Param Factory attribution, and version. They also omit the canonical, Open
Graph/Twitter metadata, favicon, and theme color required per route. A visitor
who reaches a genuine network 404 or fallback offline document gets a visibly
different, incomplete shell.

**Concrete fix:** Make both static documents use the same accessible
header/footer skeleton as the SPA while retaining their product-specific
broadsheet treatment. Add route-specific description, canonical, social,
favicon, and theme metadata. Keep the genuine missing-resource response at
HTTP 404.

### F-2-4 — Minor — Invalid edit deep links show 404 content with edit-page metadata

**Exact evidence:** `/app/edit?id=missing` renders the H1 “Page not found” but
sets the title to “Edit meal — Flex Meal Templates”, description to “Edit a
saved meal template, its ingredients, and its nutrition bands.”, and canonical
to `/app/edit`. `/demo/edit?id=missing` has the same mismatch with demo-edit
metadata.

**Why this fails:** The visible route and its metadata describe different
pages. History/back and the visible error work, but shared or indexed previews
mislabel the missing page.

**Concrete fix:** When edit lookup fails, select the `/404` metadata before
render completes: “Page not found — Flex Meal Templates”, the missing-page
description, `noindex`, and a canonical that does not claim a valid editor.
Add direct tests for missing real and demo edit IDs.

## Copy audit

Counts include words containing a letter or number; punctuation-only marks and
step numbers are excluded. Hyphenated terms, paths, URLs, and version numbers
count as one word. Code blocks are commands rather than sentences. The tables
include headings, labels, actions, visible navigation, footer text, and the
hero image alt text so the jargon, heading, and action checks are complete.
No sentence exceeds 22 words and no banned marketing adjective appears.
Technical package and deployment names in the developer instructions are
necessary in that context. The two landing actions name results.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass. |
| FMT | 1 | F-2-2: unexplained mobile abbreviation. |
| Flex Meal Templates | 3 | Pass. |
| My meals | 2 | Pass: navigation link. |
| Demo | 1 | Pass: navigation link. |
| Privacy | 1 | Pass: navigation link. |
| Adjust saved meals as you log | 6 | Pass: `portion-adjust`. |
| For people who repeat meals but change portions to match each meal’s nutrition budget. | 14 | F-2-2: “budget” conflicts with bands/ranges. |
| Try it with sample data | 5 | Pass: result-naming action; `demo-sample`. |
| Open two sample meals. | 4 | Pass: `demo-sample`. |
| Nothing enters your records. | 4 | Pass: `demo-isolation`. |
| Create your first template | 4 | Pass as an action label; its capability needs F-2-1 claim coverage. |
| Works offline after the first visit. | 6 | Pass: `offline-reload`. |
| Your records stay in this browser. | 6 | Pass: `local-only`. |
| Free. | 1 | Pass: `free-product`. |
| Export CSV or JSON. | 4 | Pass: `csv-json-export`. |
| A kitchen scale and ingredient slips arranged like a newspaper layout. | 11 | Pass: useful image alt text. |
| One base meal. | 3 | F-2-2: use “meal template”. |
| Today’s portions stay editable. | 4 | Pass: `portion-adjust`. |
| Meal preview | 2 | Pass: context-bearing heading. |
| Saved meal | 2 | F-2-2: use “meal template”. |
| Weekday overnight oats | 3 | Pass: realistic sample name. |
| 60 g oats · 170 g yogurt · 100 g banana | 9 | Pass: sample contents. |
| Today · 0.75× | 2 | Pass: sample state label. |
| Smaller early breakfast | 3 | Pass: sample log name. |
| 60 g 45 g oats · totals update before saving | 9 | Pass: shown calculation; `portion-adjust`. |
| How it works | 3 | Pass: context-bearing heading. |
| Save the base meal | 4 | F-2-2: use “Save the meal template”; F-2-1 needs claim coverage. |
| Enter each ingredient and its estimated nutrition. | 7 | Pass: concrete instruction. |
| Set the meal’s bands | 4 | F-2-1 unlisted feature; F-2-2 terminology. |
| Choose calorie and macro ranges for this meal. | 8 | F-2-1 unlisted feature; F-2-2 terminology. |
| Adjust and log | 3 | Pass: task heading. |
| Change the serving or a single ingredient. | 7 | F-2-2: use “portion”; behavior is covered by `portion-adjust`. |
| Then export the record. | 4 | Pass: `csv-json-export`. |
| Limits and privacy | 3 | Pass: context-bearing heading. |
| You enter the nutrition estimates for each ingredient. | 8 | Pass: input responsibility. |
| Your templates and logs use browser storage. | 7 | Pass: `local-only`. |
| Export JSON backups or erase this browser’s records. | 8 | Pass: `csv-json-export`, `erase-confirmation`. |
| Adjust recurring meals without making copies. | 6 | Pass: `portion-adjust`. |
| Privacy | 1 | Pass: footer link. |
| Terms | 1 | Pass: footer link. |
| Built by Param Factory | 4 | Pass: attribution link. |
| external site | 2 | Pass: screen-reader clarification. |
| Version 1.0.2 | 2 | Pass: matches `package.json`. |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Flex Meal Templates | 3 | Pass: document title. |
| Adjust saved meal portions and keep each log inside its nutrition budget. | 12 | F-2-2: use “nutrition ranges”. |
| Flex Meal Templates is for people who repeat meals but change the serving each time. | 15 | F-2-2: use “portion”. |
| Save personal meal templates, set nutrition bands, and adjust a meal before logging. | 13 | F-2-1 unlisted authoring claim; F-2-2 terminology. |
| The original template stays unchanged. | 5 | Pass: `portion-adjust`. |
| The app works offline after the first visit. | 8 | Pass: `offline-reload`. |
| Meal templates and logs stay in browser-local storage. | 8 | F-2-2: say “stay in this browser”. |
| The complete product is free to use. | 7 | Pass: `free-product`. |
| Try the isolated demo | 4 | F-2-2: use “Try sample meals”. |
| Open `/?demo=1` locally or visit <https://flex-meal-templates.sociobot.in/?demo=1>. | 6 | Pass: direct instruction. |
| The sample opens two meal templates and one earlier log. | 10 | Pass: `demo-sample`. |
| Demo records use a separate browser database and never enter real records. | 12 | Pass: `demo-isolation`. |
| Reset demo restores the bundled sample. | 6 | Pass: `demo-isolation`, `demo-sample`. |
| Run locally | 2 | Pass: context-bearing heading. |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass: developer prerequisite. |
| Vite prints the local URL. | 5 | Pass: developer instruction. |
| Open `/app` for real storage or `/demo` for sample data. | 10 | Pass: developer instruction. |
| Test and build | 3 | Pass: context-bearing heading. |
| `npm test` runs calculation tests and Playwright claim tests. | 9 | Pass: verified. |
| The browser version is pinned to Playwright 1.58.2. | 8 | Pass: matches `package.json`. |
| `npm run build` type-checks the app and writes the static site to `dist/`, with `dist/index.html` at its root. | 18 | Pass: verified developer instruction. |
| To inspect the production build | 5 | Pass: context-bearing instruction. |
| Data controls | 2 | Pass: context-bearing heading. |
| Export CSV downloads dated meal logs and calculated nutrition totals. | 10 | Pass: `csv-json-export`. |
| Export JSON downloads every template and log as a restorable backup. | 11 | F-2-1: restoration is untested. |
| Import JSON checks the complete backup before replacing the current browser database. | 12 | F-2-1: valid replacement/round trip is untested. |
| Invalid backups are rejected without changing saved records. | 8 | Pass: `validated-json-import`. |
| Erase all records asks for confirmation before clearing the active browser workspace. | 12 | Pass: `erase-confirmation`. |
| Nutrition values are user-entered estimates. | 5 | Pass: necessary limitation. |
| Flex Meal Templates is not medical or dietary advice. | 9 | Pass: necessary limitation. |
| Deployment | 1 | Pass: context-bearing heading. |
| Deploy the contents of `dist/` as a static site. | 9 | Pass: developer instruction. |
| `staticwebapp.config.json` provides the SPA fallback, security headers, and asset caching policy. | 11 | Pass: developer instruction confirmed in code/live headers. |
| The service worker caches the app shell after the first visit. | 11 | Pass: `offline-reload`. |
| Project notes | 2 | Pass: context-bearing heading. |
| Product brief: `.factory/brief.json` | 3 | Pass: document link. |
| Visual system and asset provenance: `.factory/design.md` | 6 | Pass: document link. |
| Demo contract: `.factory/demo.md` | 3 | Pass: document link. |
| Tested product claims: `.factory/claims.json` | 4 | Pass as a link label; F-2-1 means the inventory is incomplete. |
| Build handoff: `.factory/handoff.md` | 3 | Pass: document link. |
| Released under the MIT License. | 5 | Pass: `LICENSE` exists. |
| Built by Param Factory. | 4 | Pass: attribution. |

## Demo and sandbox verification

- One click from the landing page opened `/?demo=1` at **Adjust a meal for
  today**. The first 390 px screen already showed **Weekday overnight oats**
  and **Lentil desk lunch**, not an onboarding or empty state.
- The persistent banner says **Demo — sample data, nothing is saved** and shows
  **Reset demo** and **Start for real**.
- The sample began with two templates and one earlier log. Logging added a
  second log in IndexedDB `flex-meals-demo`. Entering real mode showed the
  empty-state heading **Build the meal you repeat** in the separate
  `flex-meals-real` database. Returning to demo showed the original one log;
  Reset also restored that state.
- A live full demo flow recorded only
  `https://flex-meal-templates.sociobot.in` requests. No analytics, third-party
  script, font, runtime AI request, or provider key was observed.
- After service-worker control, a fresh live `/demo` context reloaded offline
  with **Weekday overnight oats** and the visible offline notice. It produced
  no console or page error.

The demo and sandbox gate passes.

## Declared claims

A clean clone at `/tmp/flex-review2-clean-DkfkS6` checked out candidate
`1c16aeb`. After `npm ci`, every command from `.factory/claims.json` was run
separately.

| Claim ID | Result | Observable evidence |
| --- | --- | --- |
| `portion-adjust` | PASS | 0.75× produced 386 kcal/below band, logged, and preserved the 60 g base amount. |
| `offline-reload` | PASS | Service-worker-controlled sample reloaded offline and remained usable. |
| `local-only` | PASS | Complete demo log flow recorded no cross-origin request. |
| `csv-json-export` | PASS | CSV header/row and JSON template/log counts passed. |
| `demo-isolation` | PASS | Demo mutation did not enter real storage; reset restored the sample. |
| `demo-sample` | PASS | Query entry showed banner, two named meals, one log, reset, and real-mode exit. |
| `free-product` | PASS | Logging/export were available without payment or upgrade action. |
| `validated-json-import` | PASS | Malformed nested data was rejected; existing IndexedDB state survived reload. |
| `erase-confirmation` | PASS | Dismissal preserved demo data; confirmed demo erase did not erase real data. |

Each ID appears in exactly one tagged test. The claim commands were 9/9 pass.
`npm test` then passed 12 unit and 15 browser tests. `npm run build` produced
`dist/index.html`; JavaScript was 11.45 kB gzip and CSS was 4.01 kB gzip.
F-2-1 is still blocking because the copy inventory contains claims outside
these nine entries.

## History reconciliation

| Earlier finding | Live and code result |
| --- | --- |
| F-1-1 — decorative/context-free headings | **Fixed.** The eyebrow, folio labels, “Live proof”, “Method”, “Small print”, companion heading, and artwork label are absent. Current section headings identify their content. |
| F-1-2 — unlisted product claims | **Half-fixed; blocking again as F-2-1 / F-1-2.** Sample count and erase confirmation gained claim tests, but template/band authoring and restorable valid import remain outside the claim inventory. |
| F-1-3 — landing metadata reused on other routes | **Fixed for the listed routes.** `/demo`, `/app`, `/app/new`, `/privacy`, `/terms`, and an ordinary missing SPA path update title, description, OG/Twitter description, canonical, and robots. F-2-4 is a narrower invalid-edit branch. |
| Earlier handoff’s malformed-backup defect | **Fixed.** Full nested validation occurs before writing; its clean-clone claim test passed and recovery code remains present. |

No earlier item was accepted merely because the polish or handoff called it
fixed.

## Structure, accessibility, and identity

- Home, demo, app, new-meal, Privacy, Terms, and ordinary missing SPA routes
  each have one H1, one main, route-specific title/description/canonical,
  consistent SPA header/footer, and zero 390 px overflow. Home title follows
  **Product — what it does**; legal/demo titles follow their route pattern.
- SPA navigation uses `pushState`. Clicking Privacy and then using Back moved
  focus to the new H1 both times. The route announcer is present.
- Every discovered internal link and the Param Factory attribution destination
  returned 200. Genuine missing static resources return the designed document
  with 404 status; its incomplete skeleton is F-2-3.
- `verify-url.sh` passed title, `lang=en`, one H1, main, alt text, button names,
  and console checks. Settled live axe scans of home, demo, Privacy, Terms, and
  missing-page views found zero serious or critical violations. Keyboard entry,
  44 px controls, visible focus, reduced-motion rules, and labelled forms are
  also covered by the passing release tests.
- Canonical, OG/Twitter tags, SVG favicon, apple-touch icon, manifest,
  `robots.txt`, sitemap, CSP/header policy, and a real 1200×630 social image are
  present. F-2-3 lists the fallback-document exceptions.
- The warm monochrome broadsheet, square rules, serif/sans pairing, editorial
  table rhythm, and original still-life art are recognisably product-specific.
  It is not a generic centered SaaS hero or feature-card template.

## Missed leverage

No additional AI feature is implied. Meal data is user-entered and arithmetic
is deterministic; runtime model use would add cost, network dependence, and
privacy complexity without completing the core job. CSV export and JSON
import/export are the obvious local-first leverage. The missing leverage is
proof of the existing valid restore workflow, already captured in F-2-1, not
sync or decorative AI.

## What would make this perfect

Add tagged claims for custom template/range authoring and a valid JSON
export/import round trip; standardise the user vocabulary; bring the 404 and
offline documents into the normal shell; and apply missing-page metadata to
invalid edit IDs. Then rerun every claim command and this entire cold-browser,
demo-isolation, offline, copy, routing, link, and accessibility checklist from
scratch. PASS requires zero remaining findings and no untested claim.
