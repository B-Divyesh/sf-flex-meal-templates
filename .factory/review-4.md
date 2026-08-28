# Adversarial first-read review 4 — Flex Meal Templates

**Reviewed:** 2026-08-28  
**Candidate:** `f39e51988b8909fd976a0c8eadb79485817b3aae`  
**Live URL:** <https://flex-meal-templates.sociobot.in>  
**Verdict:** **FAIL**

One route-state defect remains. All other checks in this round, including the
cold first read, one-click demo, declared claims, privacy request log, metadata,
and every prior finding, passed.

## Cold first read

Fresh Chromium contexts opened the live home page with no site data at 390 ×
844 and 1440 × 900. No scrolling occurred before recording these answers.

| Question | Answer visible on the first screen |
| --- | --- |
| What does it do? | “Adjust portions without changing meal templates.” |
| For whom? | “For people who repeat meals and want each portion checked against their nutrition ranges.” |
| What should I click first? | **Try it with sample data**. The adjacent text says, “Open two sample meal templates. Nothing enters your records.” |

The headline, audience, primary action, action result, and the offline/local/
free facts were visible at both sizes. The mobile page had no horizontal
overflow and neither context logged a console or page error.

## Findings

### F-4-1 — Minor — Back navigation discards the visitor’s scroll position

**Exact evidence / location:** On the live 390 px home page, scrolling to its
maximum position produced `window.scrollY === 154`. Following **Demo** and
then using the browser Back button returned to `/` and the correct focused H1,
but `window.scrollY === 0`. In
[`src/main.ts`](/work/repo/src/main.ts:277), every `render(true)` calls
`scrollTo({ top: 0, … })`; the `popstate` handler at
[`src/main.ts`](/work/repo/src/main.ts:540) calls `render(true)`.

**Why this fails:** A person who follows a nav link to inspect the demo loses
their place when returning to the landing page. The required route behaviour is
deep links plus Back/Forward restoring both scroll and focus. Focus correctly
lands on the destination H1, but scroll restoration is explicitly overridden.

**Concrete fix:** Before a client-side `pushState`, save the current x/y
coordinates in the current history entry. Store the new route’s initial
position in its entry. On `popstate`, render and restore that entry’s saved
coordinates after DOM rendering; only newly opened routes should scroll to the
top. Keep focusing and announcing the destination H1. Add a Playwright test
that scrolls `/` below the first screen, opens `/demo`, goes Back and Forward,
and asserts the original position is restored within a small pixel tolerance.

## Copy audit

Counts treat a contiguous letter/number/path/URL token as one word. The audit
includes every visitor-facing sentence plus headings, labels, navigation, and
actions so that jargon, context-free headings, and unnamed actions are also
checked. No entry exceeds 22 words. No banned marketing word, metaphor heading,
unexplained abbreviation, or inconsistent product term was found. `CSV` and
`JSON` name the actual export formats and match the result-naming controls.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Skip to main content | 4 | Pass — skip link. |
| Flex Meals | 2 | Pass — mobile wordmark. |
| Flex Meal Templates | 3 | Pass — desktop wordmark. |
| My meals | 2 | Pass — navigation. |
| Demo | 1 | Pass — navigation. |
| Privacy | 1 | Pass — navigation/footer link. |
| Adjust portions without changing meal templates | 6 | Pass — plain job headline. |
| For people who repeat meals and want each portion checked against their nutrition ranges. | 14 | Pass — audience and outcome. |
| Try it with sample data | 5 | Pass — result-naming action. |
| Open two sample meal templates. | 5 | Pass — `demo-sample`. |
| Nothing enters your records. | 4 | Pass — `demo-isolation`. |
| Create your first meal template | 5 | Pass — result-naming action. |
| Works offline after the first visit. | 6 | Pass — `offline-reload`. |
| Your records stay in this browser. | 6 | Pass — `local-only`. |
| Free. | 1 | Pass — `free-product`. |
| Export CSV or JSON. | 4 | Pass — `csv-json-export`. |
| A kitchen scale and ingredient slips arranged like a newspaper layout. | 11 | Pass — descriptive alt text. |
| One meal template. | 3 | Pass — preview caption. |
| Today’s portion stays editable. | 4 | Pass — `portion-adjust`. |
| Meal preview | 2 | Pass — names its section. |
| Meal template | 2 | Pass — label. |
| Weekday overnight oats | 3 | Pass — sample meal name. |
| 60 g oats · 170 g yogurt · 100 g banana | 9 | Pass — sample ingredients. |
| Today · 0.75× | 2 | Pass — sample state. |
| Smaller early breakfast | 3 | Pass — sample log name. |
| 60 g 45 g oats · totals update before saving | 9 | Pass — `portion-adjust`. |
| How it works | 3 | Pass — standard process section. |
| Save the meal template | 4 | Pass — task heading. |
| Enter each ingredient and its estimated nutrition. | 7 | Pass — usable instruction. |
| Set the nutrition ranges | 4 | Pass — task heading. |
| Choose calorie and macro minimums and maximums for this meal. | 10 | Pass — usable instruction. |
| Adjust and log | 3 | Pass — task heading. |
| Change the portion or a single ingredient. | 7 | Pass — `portion-adjust`. |
| Then export the record. | 4 | Pass — `csv-json-export`. |
| Limits and privacy | 3 | Pass — names its section. |
| You enter the nutrition estimates for each ingredient. | 8 | Pass — scope disclosure. |
| Your meal templates and logs stay in this browser. | 9 | Pass — `local-only`. |
| Export JSON backups or erase this browser’s records. | 8 | Pass — `csv-json-export`, `erase-confirmation`. |
| Adjust portions without copying meal templates. | 6 | Pass — `portion-adjust`. |
| Terms | 1 | Pass — footer link. |
| Built by Param Factory | 4 | Pass — attribution link. |
| external site | 2 | Pass — screen-reader clarification. |
| Version 1.0.3 | 2 | Pass — build label. |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Flex Meal Templates | 3 | Pass — document title. |
| Adjust saved meal portions and keep each log inside its nutrition ranges. | 12 | Pass — `portion-adjust`. |
| Flex Meal Templates is for people who repeat meals but change the portion each time. | 15 | Pass — audience. |
| Save meal templates, set nutrition ranges, and adjust a portion before logging. | 12 | Pass — `template-authoring`, `portion-adjust`. |
| The meal template stays unchanged. | 5 | Pass — `portion-adjust`. |
| The app works offline after the first visit. | 8 | Pass — `offline-reload`. |
| Meal templates and logs stay in this browser. | 8 | Pass — `local-only`. |
| The complete product is free to use. | 7 | Pass — `free-product`. |
| Try sample meals | 3 | Pass — useful heading. |
| Open `/?demo=1` locally or visit `https://flex-meal-templates.sociobot.in/?demo=1`. | 6 | Pass — demo entry. |
| The sample opens two meal templates and one earlier log. | 10 | Pass — `demo-sample`. |
| Demo records use a separate browser database and never enter real records. | 12 | Pass — `demo-isolation`. |
| Reset demo restores the bundled sample. | 6 | Pass — `demo-isolation`. |
| Run locally | 2 | Pass — useful heading. |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass — developer prerequisite. |
| Vite prints the local URL. | 5 | Pass — developer instruction. |
| Open `/app` for real storage or `/demo` for sample data. | 10 | Pass — developer instruction. |
| Test and build | 3 | Pass — useful heading. |
| `npm test` runs calculation tests and Playwright claim tests. | 9 | Pass — developer instruction. |
| The browser version is pinned to Playwright 1.58.2. | 8 | Pass — developer instruction. |
| `npm run build` type-checks the app and writes the static site to `dist/`, with `dist/index.html` at its root. | 18 | Pass — developer instruction. |
| To inspect the production build: | 5 | Pass — instruction lead-in. |
| Data controls | 2 | Pass — useful heading. |
| Export CSV downloads dated meal logs and calculated nutrition totals. | 10 | Pass — `csv-json-export`. |
| Export JSON downloads every meal template and log as a restorable backup. | 12 | Pass — `csv-json-export`, `json-roundtrip`. |
| Import JSON checks the complete backup, then restores every meal template and log. | 13 | Pass — `validated-json-import`, `json-roundtrip`. |
| Invalid backups are rejected without changing saved records. | 8 | Pass — `validated-json-import`. |
| Erase all records asks for confirmation before clearing the active browser workspace. | 12 | Pass — `erase-confirmation`. |
| Nutrition values are user-entered estimates. | 5 | Pass — scope disclosure. |
| Flex Meal Templates is not medical or dietary advice. | 9 | Pass — safety disclosure. |
| Deployment | 1 | Pass — useful heading. |
| Deploy the contents of `dist/` as a static site. | 9 | Pass — developer instruction. |
| `staticwebapp.config.json` provides the SPA fallback, security headers, and asset caching policy. | 11 | Pass — developer instruction. |
| The service worker caches the app shell after the first visit. | 11 | Pass — `offline-reload`. |
| Project notes | 2 | Pass — useful heading. |
| Product brief | 2 | Pass — link label. |
| Visual system and asset provenance | 5 | Pass — link label. |
| Demo contract | 2 | Pass — link label. |
| Tested product claims | 3 | Pass — link label. |
| Build handoff | 2 | Pass — link label. |
| Released under the MIT License. | 5 | Pass — license statement. |
| Built by Param Factory. | 4 | Pass — attribution. |

## Demo, claims, sandbox, and privacy

- Fresh navigation to `/?demo=1` immediately opened **Adjust a meal for
  today**, with “Weekday overnight oats,” “Lentil desk lunch,” and one earlier
  log. The persistent banner read **“Demo — sample data, nothing is saved”**
  and included **Reset demo** and **Start for real**.
- Logging added one row (2 → 3); Reset demo restored the original two rows.
  Starting for real reached an empty real workspace, where the sample meal was
  absent. The code uses separate `flex-meals-demo` and `flex-meals-real`
  IndexedDB databases as documented in `.factory/demo.md`.
- A fresh live context waited for service-worker control, went offline, and
  reloaded `/demo`. Sample data and “You are offline. Meal templates and
  logging still work.” remained visible. Its full demo-flow request log had no
  cross-origin request; no console or page error occurred.
- From fresh clone `/tmp/flex-review4-clean-HTGKn8/repo`, `npm ci` passed with
  zero audit vulnerabilities. Every command in `.factory/claims.json` passed
  independently: `portion-adjust`, `offline-reload`, `local-only`,
  `csv-json-export`, `demo-isolation`, `demo-sample`, `free-product`,
  `validated-json-import`, `template-authoring`, `json-roundtrip`, and
  `erase-confirmation`. `npm test` then passed 12 unit and 21 browser tests;
  `npm run build` passed and created `dist/` (11.50 kB gzip JavaScript).
- Every landing and README claim-like sentence maps to the listed claim IDs in
  the tables above. No unlisted visitor-facing claim was found.

## History reconciliation

| Earlier finding | Current live and code result |
| --- | --- |
| F-1-1 — decorative/context-free headings | **Fixed.** Live headings are task- or section-naming: Meal preview, How it works, and Limits and privacy. The former editorial labels are absent in source and live copy. |
| F-1-2 / F-2-1 — unlisted claims | **Fixed.** The eleven declared claims each have exactly one tagged test. The authoring, import round-trip, sample, and erase behaviours all passed independently. |
| F-1-3 — landing metadata reused | **Fixed.** Direct app, demo, new, legal, and missing routes had route-specific title, description, canonical, Open Graph/Twitter copy, and robots state. |
| F-2-2 — inconsistent terms/mobile FMT | **Fixed.** The live mobile wordmark is Flex Meals; visitor copy consistently uses meal template, portion, and nutrition range. |
| F-2-3 — incomplete static 404/offline shell | **Fixed.** `/404.html` and `/offline.html` have the shared header/footer, legal links, attribution, metadata, icons, and one H1/main. A genuine missing asset returned HTTP 404. |
| F-2-4 — invalid edit metadata | **Fixed.** Both missing real and demo edit IDs show Page not found metadata and canonical `/404`. |
| Earlier malformed-backup data-loss defect | **Fixed.** The `validated-json-import` test rejected a malformed backup without changing a real saved meal; reload remained usable. |
| F-3-1 — missing stable sitemap routes | **Fixed.** Live `sitemap.xml` lists `/`, `/app`, `/app/new`, `/demo`, `/demo/new`, `/privacy`, and `/terms`. |

## Structure and visual checks

- All crawled home links returned HTTP 200: home, My meals, Demo, Privacy,
  `?demo=1`, new meal, Terms, and the Param Factory link. Direct deep links,
  static fallback pages, and missing edit IDs also loaded with one H1 and one
  main landmark and no console errors.
- Titles follow the product/route pattern; the landing title is **Flex Meal
  Templates — Adjust meal portions**. `lang`, meta description, canonical,
  Open Graph/Twitter card, favicon, theme colour, manifest, robots, sitemap,
  CSP, and a genuine 404 response were confirmed.
- Forward navigation, Back, and Forward all focused the destination H1 and
  announced the route. F-4-1 is limited to the lost scroll coordinate.
- The black-newsprint broadsheet, system serif/sans pairing, square rules,
  editorial still life, and restrained red proofing mark are distinct from a
  generic SaaS template and match `.factory/design.md`. No third-party font,
  script, tracker, provider key, or decorative AI feature was found.
- Export/import are the useful local-first leverage implied by the brief and
  are present. Food lookup, barcode scanning, sync, and AI drafting are not
  implied by this meal-template brief.

## What would make this perfect

Restore each history entry’s scroll position on Back and Forward, retain the
existing H1 focus/announcement behaviour, and add the regression test described
in F-4-1. Then rerun this full cold-browser and clean-clone checklist.
