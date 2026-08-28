# Demo sandbox

- URL: `https://flex-meal-templates.sociobot.in/?demo=1` (local: `http://localhost:5173/?demo=1`). `/demo` is an equivalent direct route.
- Sample: “Weekday overnight oats” with two substitutes, “Lentil desk lunch” with one substitute, meal-specific nutrition ranges, and one earlier adjusted log.
- Storage: IndexedDB database `flex-meals-demo`, separate from the real `flex-meals-real` database.
- Reset: use **Reset demo** in the persistent red banner. It replaces demo changes with the bundled sample.
- Leave: use **Start for real**. Real mode never reads or writes the demo database.
- Offline: the sample is bundled in the app. Visit once, wait for the service worker, then disconnect and reload `/demo`.
