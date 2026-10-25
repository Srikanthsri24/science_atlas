> **Superseded visualization details:** v0.2 rebuilds all six viewers and replaces the caption player. See [VISUAL_UPGRADE.md](VISUAL_UPGRADE.md) for current implementation and QA. This file retains the initial curriculum delivery history.

# Science Atlas 360° frontend delivery

25 October 2026 · VisionariesAI Labs Private Limited

## Delivered

Standalone React/TypeScript frontend. Existing biology and mathematics source projects were not modified. No backend, API key, AI tutor, authentication, or school record service. Production static output is in dist/.

408 searchable concepts (257 originals preserved plus 151 additions), schema, source registry, concept graph, additive change log, hierarchy export and import report. Fifty-five partial CBSE Class X 2026–27 concept-presence links; no complete textbook mappings claimed.

Six original learning experiences: pendulum, ideal DC circuit, atom shell model, animal cell, solar system, refraction/TIR. Each has explanation, learning objectives, terminology, misconception, investigation, timed caption sequence and three-question quiz. All have SVG views; four also support 3D camera controls. Pendulum, circuit and refraction use equation-derived results. Atom/cell/solar models are explanatory schematics, not numerical molecular, physiological or ephemeris solvers. Assumptions and schematic limits appear in each viewer.

Working labels, reset, snapshot, fullscreen, inspection and playback/speed/timeline where appropriate. Notes, bookmarks, best quiz scores, lesson completion, recent activity and active-tab browsing minutes persist locally. Validated backup import/export and confirmed reset available. Theme and class/curriculum preferences persist separately.

## Verification

- TypeScript check and production build passed.
- Inventory validator passed: exact legacy field preservation, SHA-256, stable IDs, source/graph references and explicit pending mapping constraints.
- All six automated tests passed: pendulum period/scaling; Ohm/power; Snell/TIR; non-finite model rejection; progress round trip; malformed backup rejection.
- Chrome production checks passed: dashboard, refraction library search, original concept to authored lesson, 100% quiz scoring, explicit completion and saved 1/6 progress, curriculum evidence screen, numerical refraction output 25.4° for 40° incidence at n1=1/n2=1.5, TIR at 89° for n1=2.4/n2=1, rendered 3D animal cell, mitochondrion selection and explanation.
- Dark theme persisted after reload. Final body colors verified: background rgb(11,18,32), text rgb(248,250,252). Preview returned to light theme.
- Mobile viewport 390px: document width equals viewport width, menu toggle visible. Mobile menu interaction through automation was inconclusive; desktop curriculum navigation passed. No exhaustive device/browser/accessibility audit claimed.
- Browser automation sometimes timed out; final core flow checks were verified after rebinding the tab. Screenshot: dashboard-preview.png.
- Build warning: WebGL vendor chunk remains about 1.13 MB uncompressed / 314 KB gzip. React sharing currently preloads it. Main application chunk is about 258 KB / 33 KB gzip; this is not the entire initial transfer. An empty explicit React chunk is harmless but further bundling optimization is advisable.

## Remaining scope

This is a working frontend foundation, not completion of the entire production-platform master brief. Most inventory concepts still need reviewed original explanations, detailed subtopics, assets and assessments. Full official textbook extraction and all-board Classes 1–12 mapping remain incomplete. Class 1–2 currently have inventory entries but no authored interactive lesson. Expert review, full priority simulation coverage, detailed anatomical meshes, narrated synchronized sequences and comprehensive accessibility/performance audit remain outstanding. Pending concepts and mappings are visibly labeled.

## Run

Double-click run-local.command on this Mac, or install Node.js 22.12+ and run npm install / npm run dev. This workspace reuses sibling installed dependencies through a node_modules symlink; the ZIP excludes that link and development caches. dist/ works on any static HTTP host with hash routing, no API or rewrite required. QA web servers are local development utilities, not an application backend.
