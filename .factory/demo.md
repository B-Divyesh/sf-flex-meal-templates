# Demo sandbox

- URL: `https://flex-meal-templates.sociobot.in/demo` (local: `http://localhost:5173/demo`).
- Sample: “Weekday overnight oats” with two substitutions, “Lentil desk lunch” with one substitution, meal-specific nutrition bands, and one earlier adjusted log.
- Storage: IndexedDB database `flex-meals-demo`, separate from the real `flex-meals-real` database.
- Reset: use **Reset demo** in the persistent red banner. It replaces demo changes with the bundled sample.
- Leave: use **Start for real**. Real mode never reads or writes the demo database.
- Offline: the sample is bundled in the app. Visit once, wait for the service worker, then disconnect and reload `/demo`.
