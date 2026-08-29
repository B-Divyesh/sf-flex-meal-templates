# Adversarial first-read review 5 — Flex Meal Templates

**Reviewed:** 2026-08-29  
**Candidate:** `12cdd9bb8c0db7a2f40272577a7ba3a512248ced`  
**Live URL:** <https://flex-meal-templates.sociobot.in>  
**Verdict:** **FAIL**

The landing is clear, the declared claims pass from a clean clone, and the
live demo is isolated. One blocking phone-demo failure remains: the sample
opens to a list of meals, rather than an adjustment in progress.

## Cold first read

Fresh Chromium contexts at 390×844 and 1440×1000 opened `/` with no existing
site data and no scrolling.

| Question | Answer available before scrolling |
| --- | --- |
| What does this do? | It adjusts portions while leaving meal templates unchanged: “Adjust portions without changing meal templates”. |
| Who is it for? | “For people who repeat meals and want each portion checked against their nutrition ranges.” |
| What should I click first? | **Try it with sample data**. Its adjacent text says, “Open two sample meal templates. Nothing enters your records.” |

All three answers are clear at both sizes. The offline, local-storage, and
free/export facts are also visible at 390 px. No console/page errors or
horizontal overflow occurred.

## Findings

### F-5-1 — Blocking — The phone demo does not show the adjustment workflow on its first screen

**Exact location and evidence:** In a fresh 390×844 context, use
**“Try it with sample data”**. The first `/?demo=1` screen correctly shows
**“Demo — sample data, nothing is saved”**, the two named samples, and one
earlier log. It does not show a portion control, calculated nutrition, or
nutrition-range state. The active form begins at y=1035; its **“Portion
multiplier”** input is at y=1135 and nutrition totals begin at y=2062. Only
the beginning of the “BREAKFAST TEMPLATE” label is visible at the viewport
bottom.

**Why a first-time visitor is lost:** The required one-click demo must make
the first screen after clicking already look like the product being used with
realistic sample data. A list proves sample records exist, but it does not
show the job this tool performs: change a portion and compare it with a range.
On the required phone viewport that result is over one viewport away.

**Concrete fix:** Retain the persistent banner and two realistic meal samples,
but make the selected sample's portion control and at least one nutrition
total/range state visible in the initial 390×844 viewport. A compact demo-only
meal picker with the selected adjustment summary immediately below it would do
this. Add a 390×844 Playwright regression that enters `/?demo=1` and asserts
both **“Portion multiplier”** and a nutrition row are in the viewport without
scrolling.

## Copy audit

Word counts treat a hyphenated word, number, URL, path, or version as one
word. Commands are not sentences. The audit includes contentful labels,
headings, actions, alt text, and footer text as well as prose. Every item is
at or below 22 words. No banned marketing adjective, jargon problem,
metaphor/mood heading, inconsistent visitor term, or non-result-naming button
was found. Claim mappings are included where the copy is a visitor promise.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass |
| Flex Meals | 2 | Pass |
| My meals | 2 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Adjust portions without changing meal templates | 6 | Pass |
| For people who repeat meals and want each portion checked against their nutrition ranges. | 14 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| Open two sample meal templates. | 5 | Pass: `demo-sample` |
| Nothing enters your records. | 4 | Pass: `demo-isolation` |
| Create your first meal template | 5 | Pass: `template-authoring` |
| Works offline after the first visit. | 6 | Pass: `offline-reload` |
| Your records stay in this browser. | 6 | Pass: `local-only` |
| Free. | 1 | Pass: `free-product` |
| Export CSV or JSON. | 4 | Pass: `csv-json-export` |
| A kitchen scale and ingredient slips arranged like a newspaper layout. | 11 | Pass: useful alt text |
| One meal template. | 3 | Pass |
| Today’s portion stays editable. | 4 | Pass: `portion-adjust` |
| Meal preview | 2 | Pass: section name |
| Meal template | 2 | Pass |
| Weekday overnight oats | 3 | Pass: sample name |
| 60 g oats · 170 g yogurt · 100 g banana | 9 | Pass: sample detail |
| Today · 0.75× | 2 | Pass: sample state |
| Smaller early breakfast | 3 | Pass: sample note |
| 60 g 45 g oats · totals update before saving | 9 | Pass: `portion-adjust` |
| How it works | 3 | Pass: section name |
| Save the meal template | 4 | Pass: `template-authoring` |
| Enter each ingredient and its estimated nutrition. | 7 | Pass |
| Set the nutrition ranges | 4 | Pass: `template-authoring` |
| Choose calorie and macro minimums and maximums for this meal. | 10 | Pass: `template-authoring` |
| Adjust and log | 3 | Pass: action-naming step |
| Change the portion or a single ingredient. | 7 | Pass: `portion-adjust` |
| Then export the record. | 4 | Pass: `csv-json-export` |
| Limits and privacy | 3 | Pass: section name |
| You enter the nutrition estimates for each ingredient. | 8 | Pass: explanation |
| Your meal templates and logs stay in this browser. | 9 | Pass: `local-only` |
| Export JSON backups or erase this browser’s records. | 9 | Pass: export/erase claims |
| Adjust portions without copying meal templates. | 6 | Pass: `portion-adjust` |
| Terms | 1 | Pass |
| Built by Param Factory | 4 | Pass |
| (external site) | 2 | Pass |
| Version 1.0.3 | 2 | Pass |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Flex Meal Templates | 3 | Pass |
| Adjust meal portions and keep each log inside its nutrition ranges. | 11 | Pass: `portion-adjust` |
| Flex Meal Templates is for people who repeat meals but change the portion each time. | 15 | Pass |
| Save meal templates, set nutrition ranges, and adjust a portion before logging. | 12 | Pass: authoring/adjustment claims |
| The meal template stays unchanged. | 5 | Pass: `portion-adjust` |
| The app works offline after the first visit. | 8 | Pass: `offline-reload` |
| Meal templates and logs stay in this browser. | 8 | Pass: `local-only` |
| The complete product is free to use. | 7 | Pass: `free-product` |
| Try sample meals | 3 | Pass: section name |
| Open `/?demo=1` locally or visit the live demo URL. | 10 | Pass: instruction |
| The sample opens two meal templates and one earlier log. | 10 | Pass: `demo-sample` |
| Demo records use a separate browser database and never enter real records. | 12 | Pass: `demo-isolation` |
| Reset demo restores the bundled sample. | 6 | Pass: `demo-isolation` |
| Run locally | 2 | Pass: section name |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass: developer prerequisite |
| Vite prints the local URL. | 5 | Pass: instruction |
| Open `/app` for real storage or `/demo` for sample data. | 10 | Pass: instruction |
| Test and build | 3 | Pass: section name |
| `npm test` runs calculation tests and Playwright claim tests. | 9 | Pass: instruction |
| The browser version is pinned to Playwright 1.58.2. | 8 | Pass: instruction |
| `npm run build` type-checks the app and writes the static site to `dist/`, with `dist/index.html` at its root. | 19 | Pass: instruction |
| To inspect the production build: | 5 | Pass: instruction lead-in |
| Data controls | 2 | Pass: section name |
| Export CSV downloads dated meal logs and calculated nutrition totals. | 10 | Pass: `csv-json-export` |
| Export JSON downloads every meal template and log as a restorable backup. | 12 | Pass: `json-roundtrip` |
| Import JSON checks the complete backup, then restores every meal template and log. | 13 | Pass: import claims |
| Invalid backups are rejected without changing saved records. | 8 | Pass: `validated-json-import` |
| Erase all records asks for confirmation before clearing the active browser workspace. | 12 | Pass: `erase-confirmation` |
| Nutrition values are user-entered estimates. | 5 | Pass: explanation |
| Flex Meal Templates is not medical or dietary advice. | 9 | Pass: safety disclaimer |
| Deployment | 1 | Pass: section name |
| Deploy the contents of `dist/` as a static site. | 9 | Pass: instruction |
| `staticwebapp.config.json` provides the SPA fallback, security headers, and asset caching policy. | 11 | Pass: necessary deployment terminology |
| The service worker caches the app shell after the first visit. | 11 | Pass: `offline-reload` |
| Project notes | 2 | Pass: section name |
| Product brief: `.factory/brief.json` | 4 | Pass: link label |
| Visual system and asset provenance: `.factory/design.md` | 7 | Pass: link label |
| Demo contract: `.factory/demo.md` | 4 | Pass: link label |
| Tested product claims: `.factory/claims.json` | 5 | Pass: link label |
| Build handoff: `.factory/handoff.md` | 4 | Pass: link label |
| Released under the MIT License. | 5 | Pass |
| Built by Param Factory. | 4 | Pass |

## Demo, claims, privacy, and sandbox checks

- Fresh live `/?demo=1` showed the banner, **Reset demo**, and **Start for
  real**. It supplied “Weekday overnight oats,” “Lentil desk lunch,” and one
  earlier oats log. Logging then resetting restored the original two names and
  one-log state. Start for real opened an empty real workspace.
- The complete live demo request log contained only
  `https://flex-meal-templates.sociobot.in`; there was no console/page error.
  After service-worker control, offline reload returned 200 and retained the
  sample.
- Fresh clone `/tmp/flex-review5-8lpjY3/repo`: `npm ci`, each of the 11
  commands in `.factory/claims.json`, `npm test`, and `npm run build` passed;
  `dist/` was produced. The independently passing claims were
  `portion-adjust`, `offline-reload`, `local-only`, `csv-json-export`,
  `demo-isolation`, `demo-sample`, `free-product`, `validated-json-import`,
  `template-authoring`, `json-roundtrip`, and `erase-confirmation`.
- No landing or README claim-like sentence is unlisted: the audit maps each
  visitor promise to its declared observable test.

## Earlier finding verification

Every earlier review, polish document, and handoff was read. Each previous
finding is fixed in current source and on the live site.

| Earlier id | Current verification |
| --- | --- |
| F-1-1 | Decorative/mood labels remain absent; live section headings are “Meal preview,” “How it works,” and “Limits and privacy,” as in `landingPage()`. |
| F-1-2 / F-2-1 | The 11-entry inventory has exactly one tagged test per claim; authoring, JSON round-trip, sample, isolation, and erase passed independently. |
| F-1-3 | Live app, demo, new, legal, and missing routes each use route-specific title, description, social description, canonical, and robots values. |
| F-2-2 | The mobile wordmark is “Flex Meals”; visitor copy consistently uses meal template, portion, and nutrition ranges. |
| F-2-3 | Live 404/offline pages have the shared header/footer, legal links, attribution, metadata, favicon, one H1, and main; a missing asset returns 404. |
| F-2-4 | Missing real/demo edit IDs both show page-not-found metadata, `noindex`, and canonical `/404`. |
| F-3-1 | Live sitemap lists exactly `/`, `/app`, `/app/new`, `/demo`, `/demo/new`, `/privacy`, and `/terms`. |
| F-4-1 | A fresh live run restored home y=2186 after Back and Demo y=420 after Forward, with the destination H1 focused. Source persists a per-entry position before `pushState` and restores it on `popstate`. |

## Structure, accessibility, and visual checks

- Home has a descriptive title, `lang`, one H1/main, description, canonical,
  social metadata, favicon, manifest, robots, sitemap, matching theme color,
  and no load console error.
- Direct checks of home, app, new, demo, legal, invalid edit, 404/offline,
  robots, sitemap, and a genuine missing asset found no dead internal route.
  Header/footer are consistent and the external link is labelled external.
- Axe reported zero violations on home, demo, Privacy, Terms, 404, and offline
  at 390 px. The original broadsheet/newsprint system and editorial still life
  match `.factory/design.md` and are distinct from a generic SaaS template.

## Missed leverage

No additional feature is required by the brief. The expected local-first
leverage—CSV export, JSON backup/import, isolated sample data, and offline
use—is present. AI lookup, meal planning, or sync would expand the
privacy-focused portion-template job, not complete an implied missing step.
No decorative AI feature or embedded provider key was found.

## What would make this perfect

Repair F-5-1 and add the proposed initial-viewport regression. The one-click
phone demo would then immediately show a realistic portion adjustment and
nutrition comparison, matching the rest of the product's clarity and evidence.
