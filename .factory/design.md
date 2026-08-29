# Flex Meal Templates — visual thesis

## Direction

**Monochrome typographic broadsheet.** A saved meal is the standing edition; a logged portion is today's corrected edition. The interface borrows a newspaper's masthead, columns, hairline rules, pull quotes, and compact numeric tables. It avoids dashboard cards, gradients, floating decoration, and food-app photography.

## Palette

- `--paper: #f3efe5` — warm uncoated newsprint; the permanent page background.
- `--ink: #171714` — soft black for type and rules; 15.5:1 on paper.
- `--muted: #5c5a52` — secondary copy; 6.1:1 on paper.
- `--wash: #dfdbd0` — table stripes and controls.
- `--white: #fffdf7` — editable sheets above the page.
- `--mark: #a12c22` — a restrained editor's red for current changes, warnings, and focus accents; 6.8:1 on paper.
- `--success: #245b3a` — saved and within-band states; 7.2:1 on paper.

This is intentionally single-mode. Newsprint is part of the product metaphor, and a dark theme would turn paper into a generic dashboard.

## Type

- Display and editorial headings: `Georgia`, `Times New Roman`, serif. High contrast and tight tracking give the masthead a broadsheet voice without a font download.
- Interface, labels, and figures: `Arial`, `Helvetica`, sans-serif. Uppercase labels and tabular numbers make dense nutrition data scan quickly.
- Body starts at 16px with 1.55 leading. Measure is capped at 68 characters.

No fonts are loaded from a third party. The two system stacks keep the first load small and work offline.

## Spacing and shape

- An 8px base unit: 8, 16, 24, 32, 48, 64, 96.
- Layout uses a 12-column editorial grid on wide screens and one column at 390px.
- Corners stay square. Grouping comes from proximity and 1px rules, not default cards.
- Controls are at least 44px high. Buttons use an ink fill or a paper fill with a 1px ink rule.

## Interaction grammar

- Editing opens a full-width paper sheet in the reading flow.
- Portion changes produce a red delta beside the base figure.
- Nutrition bands read like a classified table: value, range, and a written state.
- Status never relies on color alone. Every mark has text.
- Destructive actions name the meal and require confirmation.

## Motion

The signature transition is an **edition change**: a new sheet rises 8px and settles over 180ms when a template opens. Text stays fully opaque so contrast does not dip during the movement. Buttons compress by 1px on press. No motion loops. Under `prefers-reduced-motion: reduce`, movement is removed and state changes are instant.

## Original asset plan

One generated editorial still life shows a kitchen scale, loose ingredient slips, measuring spoon, and pencilled ratio arcs from directly above. It sits beside the live product preview and supplies the social crop. The art contains no required text. Authored SVG rule marks and app icons use only the product palette.

### Image prompt sheet

Accepted prompt: “Straight-overhead monochrome editorial still life on completely blank warm newsprint: an old mechanical kitchen scale with a clean numberless dial, one measuring spoon, loose rolled oats, a small bowl of black beans, and three blank rectangular ingredient slips. Sparse graphite arcs and simple ruled lines only, with one tiny oxblood red pencil tick. Refined tactile linocut print texture, soft north-window light, charcoal black and bone paper, generous central negative space, balanced newspaper photo composition. Every sheet and surface must be entirely blank: absolutely no letters, words, numbers, symbols, logos, labels, handwriting, printed pages, watermarks, brands, people, or hands. No gradients, neon, 3D render, UI mockup, or distorted utensils.”

Generation command: `/opt/fleet/lib/gen-image.sh "<accepted prompt>" assets/src/meal-edition-clean.png 1536x1024 high`.

Provenance: generated for this product with the Factory Azure `factory-image` deployment on 2026-08-28. The first candidate was rejected for pseudo-text. The accepted candidate was inspected for text, logos, anatomy, seams, and tool distortion. Its 65 KB desktop WebP, 29 KB mobile WebP, and 50 KB social crop are original product assets under the repository's MIT license. The full prompt and review are also stored beside the source PNG.

## Accessibility and responsive intent

Ink and muted text meet WCAG AA on paper. Focus uses a 3px red outline plus offset. At phone width, the demo becomes a compact two-column meal index followed by the selected portion control and nutrition table. Ingredient details and template actions follow the comparison, while every control keeps a 44px target. The artwork moves below the first action so the landing job stays visible without scrolling.
