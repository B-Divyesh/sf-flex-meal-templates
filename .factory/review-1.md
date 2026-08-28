# Adversarial first-read review 1 — Flex Meal Templates

**Reviewed:** 2026-08-28  
**Live URL:** <https://flex-meal-templates.sociobot.in>  
**Verdict:** **FAIL**

The product is usable, the sample demo is isolated, all seven declared claims
passed, and the former corrupt-backup defect is repaired. This remains a FAIL:
the landing has decorative, context-free headings and the landing/README make
user-relevant claims that lack a `.factory/claims.json` entry and test.

## Cold first read

Fresh Chromium contexts opened the live URL at 390×844 and 1440×900 before any
scrolling. Both first screens made these answers clear:

| Question | Observed answer |
| --- | --- |
| What does it do? | “Adjust saved meals as you log.” |
| For whom? | “For people who repeat meals but change portions to match each meal’s nutrition budget.” |
| What should I click? | **Try it with sample data**; adjacent text says “It opens two editable meals. Nothing enters your records.” |

There is no first-screen ambiguity. The primary action is visible without
scrolling on a 390 px phone and names the result.

## Findings

### F-1-1 — Blocking — Decorative and context-free landing headings

**Exact copy / location:** landing eyebrow “The portion edition · Vol. 1”;
section labels “Live proof”, “Method”, and “Small print”; limits heading “A
focused companion, not a food database”; footer label “Original generated
artwork”.

**Why this fails:** These labels rely on the newspaper metaphor rather than
naming content. In a screen-reader heading list, “Live proof”, “Method”, and
“Small print” do not explain what follows. “Companion” is vague marketing
language, while the artwork footer label does not help a visitor use the
product. This violates the required plain-words rule for headings and
decorative labels.

**Concrete fix:** Delete the eyebrow, folio labels, and artwork label. Rename
the limits heading to **Limits and privacy**. Retain **How it works** and use
**Meal preview** instead of “See the change before you log it” if a preview
heading is needed.

### F-1-2 — Blocking — Unlisted, untested product claims remain

**Exact copy / location:**

- Landing: “It opens two editable meals.”
- Landing: “This tool does not search foods, scan barcodes, create meal plans, or give health advice.”
- Landing: “You can export a backup or erase every record.”
- README: “Save 10–30 personal meal templates, set calorie and macro bands, choose ingredient substitutes, and adjust one ingredient before logging.”
- README: “It includes two realistic meal templates and one earlier log.”
- README: “Erase all records requires confirmation and cannot be undone.”

**Why this fails:** No item above has a matching claim entry and `@claim:`
test. “Save 10–30” is particularly misleading: the UI enforces neither a
minimum nor a maximum, so it is not a tested capacity or a documented limit.
Visitors can reasonably rely on the stated sample, scope, backup/erase,
substitute, and ingredient-adjustment behaviour.

**Concrete fix:** Delete each promise or add a separate claim and observable
demo test. Tests must assert the sample starts with two templates and one log;
erase asks for confirmation and clears only the active namespace; a substitute
or ingredient amount changes only the log; and named food-search/barcode/
meal-plan/health-advice functions are absent. Replace the unsupported README
sentence with “Save personal meal templates, set nutrition bands, choose a
saved substitute, and adjust one ingredient before logging.” Do not state a
capacity unless it is enforced and tested.

### F-1-3 — Minor — Non-landing routes retain landing metadata

**Evidence:** Direct live navigation to `/demo`, `/app`, `/app/new`,
`/privacy`, `/terms`, and a missing route updated title and canonical but kept
`meta[name=description]` as “Adjust recurring meal portions, compare nutrition
bands, and export each log without duplicating the meal.” and
`og:description` as “Change portions without changing your saved meal.”

**Why this fails:** Previewing or indexing Privacy, Terms, Demo, or a missing
route describes a meal-adjustment screen instead of the route opened.

**Concrete fix:** Store title, description, Open Graph description, and Twitter
description per route, updating all in `render()`. For example, `/demo` can
say “Try two sample meals without saving records.”

## Copy audit

Counts treat a hyphenated word, number, URL, and path as one word. No line
exceeds 22 words. The following lists every sentence and contentful heading or
action on the landing page and every sentence in README; flags link to the
findings above.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| The portion edition · Vol. 1 | 5 | F-1-1: decorative; delete. |
| Adjust saved meals as you log | 6 | Pass. |
| For people who repeat meals but change portions to match each meal’s nutrition budget. | 14 | Pass. |
| Try it with sample data | 5 | Pass: result-naming action. |
| It opens two editable meals. | 5 | F-1-2: claim-test or delete. |
| Nothing enters your records. | 4 | Pass: `demo-isolation`. |
| Create your first template | 4 | Pass: result-naming action. |
| Works offline after the first visit. | 6 | Pass: `offline-reload`. |
| Your records stay in this browser. | 6 | Pass: `local-only`. |
| Free. | 1 | Pass: `free-product`. |
| Export CSV or JSON. | 4 | Pass: `csv-json-export`. |
| A kitchen scale and ingredient slips arranged like a newspaper layout. | 11 | Pass: alt text. |
| One base meal. | 3 | Pass. |
| Today’s portions stay editable. | 4 | Pass: `portion-adjust`. |
| Live proof | 2 | F-1-1: decorative; delete. |
| See the change before you log it | 7 | Pass as explanatory copy; use “Meal preview” as heading. |
| Saved meal | 2 | Pass: label. |
| Weekday overnight oats | 3 | Pass: sample name. |
| 60 g oats · 170 g yogurt · 100 g banana | 9 | Pass: sample ingredients. |
| Today · 0.75× | 2 | Pass: sample label. |
| Smaller early breakfast | 3 | Pass: sample name. |
| 60 g 45 g oats · totals update before saving | 9 | Pass: shown calculation. |
| Method | 1 | F-1-1: decorative; delete. |
| How it works | 3 | Pass. |
| Save the base meal | 4 | Pass. |
| Enter each ingredient and its estimated nutrition. | 7 | Pass. |
| Set the meal’s bands | 4 | Pass. |
| Choose calorie and macro ranges for this meal. | 8 | Pass. |
| Adjust and log | 3 | Pass. |
| Change the serving or a single ingredient. | 7 | Pass: `portion-adjust`. |
| Then export the record. | 4 | Pass: `csv-json-export`. |
| Small print | 2 | F-1-1: decorative; delete. |
| A focused companion, not a food database | 7 | F-1-1: vague heading; use “Limits and privacy”. |
| You enter the nutrition estimates. | 5 | Pass. |
| This tool does not search foods, scan barcodes, create meal plans, or give health advice. | 15 | F-1-2: claim-test or remove. |
| Your templates and logs use browser storage. | 7 | Pass: `local-only`. |
| You can export a backup or erase every record. | 9 | F-1-2: erase is unlisted. |
| Adjust recurring meals without making copies. | 6 | Pass: `portion-adjust`. |
| Original generated artwork | 3 | F-1-1: decorative; delete. |

### README

| Copy | Words | Result |
| --- | ---: | --- |
| Adjust saved meal portions and keep each log inside its nutrition budget. | 11 | Pass. |
| Flex Meal Templates is for people who repeat meals but change the serving each time. | 15 | Pass. |
| Save 10–30 personal meal templates, set calorie and macro bands, choose ingredient substitutes, and adjust one ingredient before logging. | 19 | F-1-2: unsupported capacity/feature bundle. |
| The original template stays unchanged. | 5 | Pass: `portion-adjust`. |
| The app works offline after the first visit. | 8 | Pass: `offline-reload`. |
| Meal templates and logs stay in browser-local IndexedDB. | 8 | Pass: `local-only`; “browser storage” is plainer. |
| It has no account, food search, barcode lookup, analytics, or health advice. | 12 | F-1-2: unlisted scope claim. |
| Open `/demo` locally or visit https://flex-meal-templates.sociobot.in/demo. | 6 | Pass. |
| It includes two realistic meal templates and one earlier log. | 10 | F-1-2: “realistic” is empty and sample count is untested. |
| Demo records use a separate IndexedDB database and never enter real records. | 11 | Pass: `demo-isolation`; “browser database” is plainer. |
| Reset demo restores the bundled sample. | 5 | Pass: `demo-isolation`. |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass: developer prerequisite. |
| Vite prints the local URL. | 5 | Pass: developer instruction. |
| Open `/app` for real storage or `/demo` for sample data. | 9 | Pass. |
| `npm test` runs calculation tests and Playwright claim tests. | 8 | Pass: developer instruction. |
| The browser version is pinned to Playwright 1.58.2. | 8 | Pass: developer instruction. |
| `npm run build` type-checks the app and writes the static site to `dist/`, with `dist/index.html` at its root. | 18 | Pass: developer instruction. |
| To inspect the production build: | 5 | Pass: heading fragment. |
| Export CSV downloads dated meal logs and calculated nutrition totals. | 9 | Pass: `csv-json-export`. |
| Export JSON downloads every template and log as a restorable backup. | 10 | Pass: `csv-json-export`. |
| Import JSON checks the complete backup before replacing the current browser database. | 11 | Pass: `validated-json-import`. |
| Invalid backups are rejected without changing saved records. | 7 | Pass: `validated-json-import`. |
| Erase all records requires confirmation and cannot be undone. | 8 | F-1-2: unlisted erase behaviour. |
| Nutrition values are user-entered estimates. | 5 | Pass. |
| Flex Meal Templates is not medical or dietary advice. | 9 | Pass: necessary disclaimer. |
| Deploy the contents of `dist/` as a static site. | 9 | Pass: developer instruction. |
| `staticwebapp.config.json` provides the SPA fallback, security headers, and asset caching policy. | 8 | Pass: necessary deployment terminology. |
| The service worker caches the app shell after the first visit. | 10 | Pass: `offline-reload`. |
| Released under the MIT License. | 5 | Pass. |
| Built by Param Factory. | 4 | Pass. |

## Demo, claims, history, and structure checks

- The first click opened `/demo` directly into **Adjust a meal for today** with
  “Weekday overnight oats” and “Lentil desk lunch” already usable. The
  persistent banner said **“Demo — sample data, nothing is saved”** and exposed
  **Reset demo** and **Start for real**.
- In a fresh context, changing the multiplier to `0.75` produced `386 kcal`.
  The clean-clone `demo-isolation` test confirmed reset restores the sample and
  real/demo IndexedDB namespaces remain separate.
- In a fresh live context, after service-worker control, `/demo` reloaded
  offline with “Weekday overnight oats” and the offline notice. Its complete
  request log contained only same-origin requests and no console/page error.
- A fresh temporary clone ran `npm ci` and every listed claim command
  separately: `portion-adjust`, `offline-reload`, `local-only`,
  `csv-json-export`, `demo-isolation`, `free-product`, and
  `validated-json-import` all passed. `npm test` passed (12 tests) and
  `npm run build` produced `dist/`.
- The one prior finding (malformed backup corrupts records) is **fixed** in
  code and live. `src/store.ts` validates before writing, its tagged claim
  passed, and live rejected `{"version":1,"templates":[{}],"logs":[]}` with
  the plain no-change message. A real “Reviewer breakfast” record remained
  after reload with no page error.
- 390 px and desktop checks found one `h1`, one `main`, no overflow, visible
  focus, and no errors. All crawled local/deep/demo links and the external
  Param Factory link returned 200. Header/footer, Privacy/Terms, title,
  language, canonical, favicon, manifest, robots, sitemap, CSP, routing,
  back/focus/live announcement, and styled missing route are present.
- The broadsheet identity is distinct, not a generic SaaS template. Export and
  import cover the obvious leverage for this local-first tool. AI, sync,
  food lookup, and barcode scanning are not implied by the brief; no decorative
  AI feature or provider key was found.

## What would make this perfect

Remove the decorative editorial labels; make every retained heading name its
section; delete or claim-test every visitor-facing promise; and set description
and social description per route. Then rerun this entire clean-clone and
fresh-browser checklist.
