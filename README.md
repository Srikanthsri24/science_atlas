# Science Atlas 360°

**v0.8:** First 25 dedicated concept lessons in the 408-record inventory, with a visible completion ledger, five-stage animated investigations, original explanations and assessments, and browser-local score/completion storage. 383 concepts remain pending. See [batch report](reports/CONCEPT_BATCH_01.md).

**v0.7:** 60 learning experiences, with 30 new animated 2D/3D laboratories. Each has five guided chapters, controls, equations, assumptions and three quiz questions. Animated demonstrations support pause, replay, scrubbing and browser WebM recording. See [release report](reports/NEXT_THIRTY.md).

Live: https://srikanthsri24.github.io/science_atlas/

For reproducible installation: `npm install -g pnpm@10.28.0`, then `pnpm install --frozen-lockfile`. Run `pnpm test`, `pnpm validate`, and `pnpm build`. GitHub Actions performs these checks before Pages deployment.

**v0.5:** Ten more experiences bring the total to thirty: projectile motion, spherical mirrors, Bernoulli flow, capacitor charge/discharge, covalent molecules, chromatography, reversible reactions, enzymes, Mendelian inheritance and nerve-signal propagation. See [NEXT_TEN_V05.md](reports/NEXT_TEN_V05.md).

**v0.4:** Ten additional experiences bring the total to twenty: free fall/drag, spring motion, travelling waves, thin lenses, induction, ideal gas, reaction rates, pH, diffusion and mitosis. See [NEXT_TEN.md](reports/NEXT_TEN.md) for scope and validation.

**v0.3:** Four more experiences (photosynthesis, breathing, buoyancy and ionic bonding) bring the total to ten. See [NEXT_FOUR.md](reports/NEXT_FOUR.md) for models, assumptions and validation.

**v0.2 science studio upgrade:** see [VISUAL_UPGRADE.md](reports/VISUAL_UPGRADE.md) for the rebuilt models and synchronized explanation player.
Frontend learning platform by VisionariesAI Labs Private Limited. React 19, TypeScript, Vite, SVG and React Three Fiber. No backend, API key, account service, or AI tutor.

## Run
Double-click `run-local.command` on this Mac. Or use Node.js 22.12+:

```sh
npm install
npm run dev
```

The development server prefers port 5180, and prints another port if occupied. The Mac launcher prefers 5181. `npm run build` produces `dist/`, deployable to any static HTTP host. Hash navigation supports deep links without a server rewrite. Do not open index.html directly with file://.

This workspace initially reuses the installed dependencies from the sibling biology project through a node_modules symlink. For a standalone copy, exclude that symlink and run npm install. No existing biology or mathematics sources were modified.

## Available functionality
- Responsive student dashboard, subject discovery, class recommendations, library search, chapter filters, concept detail, curriculum evidence, preferences, and local learning progress.
- Sixty original learning experiences (the original thirty listed here, plus the thirty in the release report): simple pendulum, ideal DC resistor circuit, atomic shell model, animal cell, schematic solar system, refraction/TIR, photosynthesis, lung breathing, buoyancy, ionic bonding, free fall/drag, spring motion, travelling waves, thin lenses, induction, ideal gas, first-order reactions, pH, membrane diffusion, mitosis, projectile motion, spherical mirrors, Bernoulli flow, RC capacitors, covalent molecules, chromatography, reversible reactions, enzyme kinetics, inheritance and nerve signals.
- Detailed SVG diagrams and 3D orbit/zoom/pan for all sixty experiences. 2D diagrams support 1–3× zoom and bounded mouse/touch/keyboard panning. Working controls only. All models display their scientific assumptions and schematic limitations.
- Sliders and equation-derived results for pendulum, Ohm's law and Snell's law. Atom/cell/solar viewers are explanatory schematics, not numerical molecular/physiological/ephemeris solvers.
- Guided model animation synchronized with chapters, focus, captions and timeline scrubbing. Optional browser/device narration reads the active caption; no prerecorded video or AI service.
- Three-question quizzes per lesson with answer explanations, best-score tracking, explicit completion, notes, bookmarks, recent activity and active-tab browsing time.
- Persistent light/dark theme. Progress stored in browser localStorage; JSON backup import/export and confirmed reset.
- Original and extended inventory downloads, source registry and import report.

## Data and verification
408 concepts: all 257 original records preserved plus 151 additions. 55 source-backed partial CBSE Class X 2026–27 concept-presence links. Full official Classes 1–12 textbook mapping across all requested boards remains incomplete. The database marks those gaps explicitly. All scientific lesson content awaits expert review. Editorial class ranges are not official board mappings.

Only the thirty authored experiences have explanations, quizzes and viewers. The other inventory concepts retain pending content fields and show that status in the interface. This release is a functional frontend foundation, not the full production curriculum described in the master brief. No school/teacher administration or multi-user persistence is claimed. No reference screenshot was attached, so the interface follows the provided palette and visual guidance.

See reports/CURRICULUM_REPORT.md for evidence, overlap/categorization findings, source retrieval limits and follow-up work. Original data is unchanged in data/master_topics.original.json. Existing legacy visuals arrays express intent and never determine working feature availability.

## Checks
```sh
npm run validate
npm test
npm run build
```
Twenty-one automated tests check period scaling, energy conservation/damping, circuit calculations, Fresnel power and Brewster incidence, critical angle/TIR, orbital periods, deterministic story boundaries/model state, non-finite inputs and backup integrity. Progress tests check backup round trips and rejection of malformed records. The inventory validator checks source hash, exact legacy field preservation, stable IDs, graph/source references and mapping constraints. Browser QA is recorded in reports/NEXT_FOUR.md and the earlier delivery reports.

Fonts load from Google Fonts when connected; system fonts are used otherwise. Scientific references link to OpenStax/NASA. The app requires no network API at runtime; external references/fonts require a connection. Data, models and lessons are bundled in the static output.
