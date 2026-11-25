# CL-0013 — Salt and sand in water

This is an original fixed-temperature teaching model, not a calibrated dissolution experiment. A first-order approach to a capacity-limited target is used to distinguish rate from capacity and to preserve material accounting.

- Temperature fixed at 25 °C. Approximate NaCl reference capacity: 0.36 g per mL **starting water**. Sand dissolution is neglected over the model timescale.
- Target dissolved mass is min(added mass, capacity). k = 0.01 + 0.04 × stirring s⁻¹ is a chosen teaching parameter.
- D(t) = target × (1 − exp(−kt)). Solid = added − D. Water density is approximated as 1 g/mL; solution mass = water mass + D. Whole mixture mass is conserved.
- Finite time must not be described as exact equilibrium. At 120 s, 20 g salt / 100 mL / stirring 1 leaves 0.049575 g; 50 g leaves 14.089235 g. More water can increase capacity without implying an instantaneous process.
- Concentration shown in the teacher calculation is mass per starting-water volume, not molarity or mass per final solution volume.
- The 3D view uses 74 representative blocks, with edge proportional to the cube root of remaining solid volume. Their displayed count does not represent counted atoms or physical grains. The 2D view is schematic. Cyan material markers are explanatory, not resolved ion trajectories.
- Water level is schematic: final solution volume changes, heat, evaporation, hydrodynamics and sand suspension are excluded. The rod moves, but no fluid-flow solution is claimed.
- The guide lasts 110 seconds: equal-mass salt, sand and excess-salt cases, followed by comparison. Each 120-second model dissolution is compressed 6×. Manual trials use the same model rate.

Internal engineering review includes independent numerical substitution, conservation and boundary tests, a live full guide, a live manual experiment, eight recorded trials, download inspection, persistence, four emulated viewports in both views, camera controls and a clean-load console check. Independent expert certification and official board mapping are not claimed.
