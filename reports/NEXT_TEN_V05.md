# Science Atlas 360° v0.5 — ten more experiences

Delivery: 26 October 2026, Asia/Kolkata. Frontend-only release; no backend or API credentials. Thirty authored experiences, ninety quiz questions. The first twenty lesson IDs, order and progress format remain compatible.

## Authored scope

| ID | Experience | Model |
|---|---|---|
| projectile | One launch, two motions | Exact vacuum trajectory, constant gravity, level landing |
| mirrors | The other side of a reflection | Signed paraxial spherical-mirror equation, real/virtual construction |
| bernoulli | When a narrow passage speeds things up | Continuity and Bernoulli pressure balance, advected tracers |
| capacitor | Energy between two plates | Exact ideal RC charge and discharge |
| covalent | The shape of a shared pair | Water, ammonia, methane spatial geometry; imposed harmonic bond stretch |
| chromatography | Separate a hidden mixture | Prescribed planar Rf bands and solvent-front measurement |
| equilibrium | A balance that keeps moving | Exact reversible first-order A⇌B relaxation |
| enzyme | Inside an enzyme’s working curve | Michaelis–Menten initial rate with competitive inhibition |
| genetics | The probability garden | Exact single-locus Punnett probabilities and complete dominance |
| neuron | A signal along the axon | Delayed prescribed action-potential template with explicit physical units |

Each includes original explanation, three learning objectives, terminology, misconception correction, activity, five guided chapters, SVG, procedural Three.js scene, scientific controls, structure-inspector context, three quiz questions and source link. The latest ten cards are featured on the dashboard. Existing lessons and all inventory records are retained.

## Scientific boundaries

Full assumptions are visible in the viewer and stored in `src/components/science/expansionExperience.ts`; equations are in `src/lib/expansionModels.ts`.

- Projectile: point body, constant g, no air/wind/spin, equal launch/landing height. Stops on first landing. Common x/y distance scale.
- Mirrors: real-is-positive convention, positive concave f, negative convex f. Reflected real images are in front; virtual images behind. No finite image at dₒ=f. Surface curvature is schematic; no exact surface ray tracing or aberration solver.
- Bernoulli: uniform-density water, imposed Q and inlet absolute pressure 120 kPa, horizontal inviscid steady flow. Pressure heads reference vacuum and are vertically compressed. Tracer residence times integrate local cross-section through smooth tapers. No losses or cavitation prediction; exposed bounds keep pressure positive.
- RC: R in kΩ, C in µF; τ in seconds. Discharge is a fresh run from a fully charged capacitor with source disconnected. Signed current reverses. No ESR, leakage or dielectric breakdown.
- Covalent: approximate characteristic water/ammonia/methane lengths and angles, symbolic electron domains. Bond stretch is imposed, with k=500 N/m per bond as an explicit teaching choice. No quantum-electronic or bond-breaking calculation.
- Chromatography: prescribed Rf inputs, solvent front capped at 10 cm, illustrative Gaussian width. Origin above solvent pool. No solvent-specific prediction or adsorption/capillarity solver. Planar Rf is not the column retention factor k.
- Equilibrium: constant-volume closed reversible first-order pair, conserving A+B. Controls restart the initial-value problem; no mid-run injection or general equilibrium-constant calculation.
- Enzyme: initial-rate competitive Michaelis–Menten model. Apparent Km increases; Vmax stays fixed. No depletion, named-enzyme parameter fitting or time playback.
- Genetics: one autosomal locus, two equiprobable gametes from a heterozygote, independent fertilization, complete dominance. No linkage, penetrance, selection or sex linkage. A Punnett square describes probabilities, not four guaranteed offspring. Guided cells are progressively revealed.
- Neuron: one prescribed delayed voltage waveform, −70 mV resting, +30 mV peak, −80 mV undershoot, 4 ms template. Threshold of 1 model unit is illustrative. No ion-channel solver, repeated-stimulus dynamics, synapse or clinical prediction. At experiment speed 1×, one display second represents one physical millisecond; guided chapters stage time separately. Physical elapsed time is labelled.

All new content awaits scientific expert review. Class recommendations remain editorial; no new official curriculum mappings are claimed.

## Sources and retrieval record

OpenStax reference sections were opened for projectile motion, spherical mirrors, Bernoulli flow, RC circuits, molecular geometry, chemical equilibrium, enzymes, inheritance and neuron communication. The first attempted mirror URL was corrected to the actual spherical-mirrors section.

The IUPAC planar retardation-factor definition was located through official-domain search. The current full page returned HTTP 403 and the historical page HTTP 502 to the research tool. Its source status records the access limitation. A supplementary NCBI Assay Guidance Manual reference for enzyme mechanisms was found via search; full-page retrieval returned a browser-check interstitial. It is recorded separately without claiming full-page verification. All lesson text and visual assets are original.

## Validation

- 48 automated tests pass, including all original regressions, deterministic chapter states for thirty guides, stable first-twenty IDs, ninety-question registry integrity, model equations, conservation, input bounds and physical-unit checks.
- Projectile checks conserve mechanical energy and horizontal velocity during flight.
- Bernoulli checks enforce Q=Av, equal pressure-plus-kinetic-energy terms and positive pressures across exposed bounds; tracer speed scales correctly with cross-section.
- RC checks validate τ, 63.2%/36.8% fractions, current sign, dQ/dt and energy.
- Molecular checks verify normalized directions and stated pairwise angles for all three molecules.
- Chromatography checks enforce distance ratios, equal-Rf overlap and the stopped front.
- Equilibrium checks conserve total and approach equal rates from either initial side.
- Enzyme checks cover half-saturation, competitive apparent Km and fixed Vmax.
- Punnett checks cover all nine parental combinations and exact row/column allele pairing.
- Neuron checks verify continuity, delayed arrival, threshold and fixed suprathreshold amplitude.
- TypeScript check and inventory validator pass: 257 original records, 408 concepts and 55 partial curriculum links retained.
- Desktop Chrome smoke checks: all ten SVG views, all ten WebGL canvases and all ten guided endpoints load. Scientific inputs were changed in each lab. Live chromatography measured 9.50 cm for Rf=.95 at a 10 cm front. The nerve guide showed +30 mV at 6 ms for a 50 mm probe and 10 m/s conduction.
- A React list-key warning observed during development was corrected before delivery.

No exhaustive mobile, assistive-technology, browser/GPU, optional device voice, fullscreen or snapshot-export certification is claimed for this batch. The existing lazy Three.js bundle remains large; 2D fallback remains available. These models are for learning, not engineering or clinical prediction.
