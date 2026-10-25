# Science Atlas 360° — next ten experiences (v0.4)

Delivery date: 26 October 2026 (Asia/Kolkata). Frontend only; no backend, accounts, API credentials or external AI calls. Existing ten lesson IDs and browser progress format remain compatible.

## New authored experiences

| ID | Experience | Quantitative or conceptual basis |
|---|---|---|
| freefall | Falling through air | Analytic release from rest, optional quadratic drag, impact event |
| spring | The rhythm of a spring | Exact undamped horizontal Hookean oscillator, conserved energy |
| waves | A wave without a journey | Travelling transverse sinusoid, fixed-x material point, v=fλ |
| lens | Where light makes an image | Signed thin-lens equation, real/virtual images, focal singularity |
| induction | Turn motion into voltage | Rotating coil, Faraday flux derivative and resistive current |
| gas | A chamber full of possibilities | Imposed ideal-gas equilibrium states, PV=nRT |
| kinetics | What makes a reaction faster? | First-order A→B and illustrative Arrhenius parameters |
| ph | The logarithmic colour of chemistry | Strong acid/base charge balance with water autoionization |
| diffusion | Across a living membrane | Conservative equal-volume compartment exchange |
| mitosis | One cell, two complete stories | Post-replication 2n=4 chromosome bookkeeping and conceptual stages |

Each has original lesson text, objectives, terminology, misconception correction, activity, five guided chapters, accessible SVG, original procedural 3D geometry, controls, inspector context, three assessment questions, reference link and explicit scientific review status. Timelines seek deterministically through the same model functions as the experiment. Static lens and pH studies have no decorative playback. Mitosis uses an explicit stage slider; it does not claim numerical cell kinetics.

## Scientific assumptions

The full assumptions are visible beneath every viewer and recorded in `src/components/science/batchExperience.ts`. Numerical functions live in `src/lib/batchModels.ts`.

- Fall: constant g=9.81 m/s², air density 1.225 kg/m³, Cd=.47, quadratic drag, no wind/buoyancy. Contact stops the body; impact speed retained, no impact force prediction.
- Spring: massless linear spring, frictionless horizontal track. No damping.
- Wave: unbounded nondispersive transverse wave; no boundaries/reflections. This is not a longitudinal sound-wave model.
- Lens: paraxial thin lens, real-is-positive convention; converging/diverging geometry and ray construction. Infinity is handled explicitly. An off-bench image remains reported numerically. 2D is preferred for the exact construction.
- Induction: external constant-speed drive, uniform field, purely resistive load. No self-inductance or mechanical back reaction. Windings are representative.
- Gas: controls impose equilibrium states; particles are symbolic and slowed. Pressure is calculated from PV=nRT, not wall-collision statistics. No real-gas solver.
- Kinetics: irreversible first order, reference k=.03 s⁻¹ at 298 K; Ea 50 or 42 kJ/mol with common prefactor. Invented teaching parameters, not a named chemical. No reaction-heat feedback.
- pH: ideal monoprotic strong acid/base, complete dissociation, 25°C Kw=10⁻¹⁴. Water autoionization prevents crossing neutrality on pure-water dilution. No buffers or titration. Colour is illustrative.
- Diffusion: equal fixed volumes, well mixed, neutral permeant solute, effective exchange k in s⁻¹. Exact exponential decay conserves solute. No water flow, osmosis or active transport.
- Mitosis: starts after S phase with four replicated chromosomes. Sister separation temporarily makes eight chromosomes in the unpartitioned cell; each daughter receives four. Stage times/geometry are illustrative. No meiosis or chromosome replication during the sequence.

All explanations remain editorial drafts pending subject-expert review. Grade recommendations are editorial; no new official board mapping is claimed. No inventory concepts were removed. The existing 257 original / 408 extended records and 55 partial curriculum links are preserved.

## Validation

- 35 automated tests pass: original regressions plus force/energy/derivative, conservation, limiting-case, invalid-input, lesson integrity and all-twenty deterministic timeline tests.
- TypeScript check passes.
- Inventory validator passes (257 original / 408 concepts / 55 partial links).
- Browser smoke checks: all ten new SVG views and all ten WebGL canvases load. All ten guides scrub to their final chapter with matching caption/state. Mitosis daughter counts and 3D scene visually checked. No new runtime errors after correcting a React list-key warning.
- A parameter was changed in each of the ten new browser labs and the resulting model state inspected. Static studies suppress time playback.
- Ten educational references were added to the source registry, distinct from official curriculum mappings.

Source references are attached to each lesson. The official OpenStax sections were opened to verify the reference pages. All assets are original procedural SVG/Three.js geometry; no proprietary assets or copied textbook passages.

## Practical limits

These are educational models, not clinical, engineering or chemical-process predictors. The new batch has desktop Chrome smoke coverage; exhaustive touch-device, assistive-technology and GPU coverage remains pending. The lazy Three.js vendor bundle remains comparatively large; 2D is available if WebGL initialization fails. Optional device voice, fullscreen and export behaviour depend on browser capabilities.

## Delivery checks

Final production build passed. A new spring quiz scored 100%, and explicit completion appeared in the 20-lesson tracker on the separate production-preview origin (5182). Existing preview progress was retained. The production browser reported no runtime errors. Dashboard cards and the lens guide were visually inspected; `next-ten-preview.png` records the production dashboard. The updated standalone ZIP was integrity checked. Main development server remains on port 5181.
