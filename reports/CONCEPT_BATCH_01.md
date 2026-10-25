# Concept authoring batch 1 — 25 / 408

This checkpoint authors 25 concept-specific lessons, independent of the existing 60 reusable labs. 383 inventory records still await dedicated authoring. All 408 IDs and original concepts remain preserved.

## Included concepts

- SA-0075 — Free fall in a uniform gravitational field
- SA-0076 — Air resistance
- SA-0077 — Terminal velocity
- SA-0080 — Buoyancy
- SA-0081 — Archimedes principle
- SA-0082 — Apparent loss in weight
- SA-0084 — Angle of contact
- SA-0085 — Bernoulli theorem
- SA-0086 — Capillary action
- SA-0093 — Magnetic field lines
- SA-0094 — Electric current
- SA-0095 — Ohm law
- SA-0096 — Electric circuits
- SA-0097 — Electric motors
- SA-0098 — Electromagnetic induction
- SA-0099 — Generators
- SA-0103 — Concave mirrors
- SA-0104 — Convex mirrors
- SA-0106 — Refraction
- SA-0107 — Lenses
- SA-0112 — Echoes
- SA-0115 — Effective length of seconds pendulum
- SA-0116 — Variation of time period of a simple pendulum
- SA-0118 — Simple harmonic motion
- SA-0119 — Wave motion

## Checks

99 automated tests passed; TypeScript and the production build passed. Browser checks covered all 25 concepts: visible SVG motion, WebGL loading, five guided chapters and three assessment questions. Controls were changed in each model family, and edits pause the simulation. The terminal-velocity height begins at its maximum, so its control must be changed toward the minimum to test it. An Ohm-law assessment scored 100%, and both score and completion survived a reload on an isolated local origin.

Primary scientific references were retrieved for the displayed equations and principles. This is a source cross-check, not independent expert certification or official board mapping. All concepts retain pending independent scientific review and pending curriculum verification.

## Content contract

Each authored concept includes stable content and record IDs, original explanation and simple version, definitions and terms, principles, units/equations, examples, objectives, prerequisites, misconception, five process stages, 2D/3D specs, animation storyboard, simulation and Watch specifications, activity, three questions with feedback, assessment criteria, disabled tutor context, accessibility notes, source links and review states. Legacy scaffold subtopics remain intact in the original inventory; the new content is additive.

## Delivery

GitHub Actions runs tests, inventory/ledger validation and the production build before Pages deployment. Completion ledger: `reports/concept-ledger.json`. In-app route: `#authoring`. Commit checkpoints are created after every 25 tested authored records.
