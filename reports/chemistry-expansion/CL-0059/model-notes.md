# CL-0059 — Grow crystals from a supersaturated solution

Original 2D/3D apparatus,120-second guides and practical/report completed.24 targeted and2499 regression tests,latest TypeScript/build,browser geometry/layout and independent export checks passed. Internal scope and frozen sources are in review.json;this is not independent-expert or measured-kinetics certification.

## Investigation and boundary

Use a prepared, cooled potassium-nitrate solution held at a fixed 20–40°C. Initial water is 50–100g, dissolved charge 20–60g and initial seed 0–1g. The seed is already present at model time zero, after cooling. It contributes to total salt; it is not mass-free and is not described as a catalyst. No hot-solution heating/cooling ramp is simulated. The declared 80°C preparation reference has enough capacity for every allowed dissolved charge, but preparing a metastable solution without premature crystallization is an assumption rather than a guaranteed classroom procedure.

The covered reference vessel retains all water and salt. No evaporation, leakage, reaction, solvent inclusion, hydrate formation or heat balance is modeled. The thermostat is ideal; crystallization/dissolution heat is not calculated. This distinguishes the lab from the existing evaporation-driven crystallization investigation.

## Equilibrium reference and kinetics

Reference solubility is linearly interpolated between 31.6 and 63.9g KNO3 per100g WATER at20/40°C. This is a coarse interpolation, not an exact measured value at intermediate temperatures. Capacity is water mass times this mass-basis solubility divided by100. Do not substitute solution mass or water volume for water mass. The initial hot-preparation reference is169g/100g water at80°C. Solid drawing density is2.109g/cm³ from the verified guidance at16°C;thermal expansion is not modeled.

Let initial dissolved charge be D0, seed mseed, total salt M=D0+mseed and fixed capacity C. The target dissolved inventory is Deq=min(M,C). Its initial departure is A=D0−Deq. With a seed, or if A≤0, activation delay is zero. Without a seed and with A>0, a chosen30–300s induction delay is applied. This delay is illustrative, not a prediction of KNO3 spontaneous nucleation.

After activation, D=Deq+A exp(−kt), with chosen k0.002–0.02s⁻¹. Before activation, the dissolved and initial-solid inventories remain unchanged. Crystal mass is M−D. Stable expm1 and retained-lag forms avoid losing small positive growth or a tiny remaining seed. In an undersaturated sample, the same law dissolves the seed; it must not draw growing crystals in that case. With no seed and insufficient dissolved charge, no solid appears.

Water + dissolved salt + crystal salt is constant. Seeded and unseeded samples differ in initial seed mass as well as activation; comparison labels must disclose this and report new solid separately from initial seed. A negative net growth rate means dissolution. The chosen first-order law is not a surface-area, diffusion, stochastic nucleation, population-balance or measured growth-rate model.

## Guide and next implementation

Default:100g water,40g dissolved charge,0.2g seed,20°C,k0.01s⁻¹. Capacity31.6g; total salt40.2g; equilibrium crystal inventory8.6g. At600s a small finite departure remains, so the UI must not claim exact equilibrium merely because rounded numbers resemble the limit.

Guide120s:10s prepared-sample hold,100s movement spanning0–600 physical seconds,10s observation hold. Manual time0–1200s. Show actual solid volume/mass growth, dissolved inventory reduction, constant water and a meaningful seeded/unseeded comparison. Include an undersaturated seed-dissolution case. Original faceted forms are explanatory reference shapes rather than crystallographic microscopy. Do not invent literal ion counts or calibrated growth velocities.

Practical records must distinguish initial dissolved charge, initial seed, capacity, induction, elapsed active time, remaining dissolved salt, crystal mass, newly formed solid and total salt/water budgets. Include worked substitution, units, result, interpretation and an exam-style report. Avoid an apparent seed-as-catalyst misconception and avoid claiming unchanged total salt between seeded/unseeded samples unless their total charge was actually matched.

## Private primary references and remaining audit

Retrieved2026-11-26:
- MIT Chemistry, Growing Quality Crystals: https://chemistry.mit.edu/facilities-and-centers/x-ray-diffraction-facility/growing-quality-crystals/
  The page supports supersaturation, kinetic inhibition, nucleation and controlled crystal growth. It does not validate this chosen rate or induction delay. Original explanations are used; no passages are copied.
- KEMAPCO technical data sheet, page3: https://kemapco.com/EBV4.0/Root_Storage/EN/Potassium_Nitrate/TDS_NOP_(13-0-46)_Standard.pdf
  Parsed manufacturer sheet gives solid density2.1t/m³ and a solubility curve on a g KNO3/100g water basis. Its text also gives317g/L at20°C; that volume-basis statement is not treated as exactly identical to the mass-basis table. A screenshot request was made, but the available tool response did not expose image pixels for inspection; do not claim a visual curve audit.
- Yara-hosted industry guidance, indexed Table8: https://www.yara.dk/siteassets/yara-denmark/handtering-og-opbevaring/vejledning-for-oplagring-og-transport-af-fast-godning.pdf/
  Official indexed text reports31.6/63.9/169g per100g water at20/40/80°C. Direct full-PDF retrieval exceeded the web tool's content-size limit. Verify the original table from the full document before final scientific review; indexed text alone is not a completed document audit.

Keep these references private. Student UI/reports use company branding only. Class5 placement is editorial and official board mapping remains unverified. This is a virtual educational model; no physical sample, purity, safety or independent-expert certification is implied.

## Completed source and engineering audit

The full84-page Yara-hosted PDF was downloaded and its page20/printed18 rendered and visually inspected. Table8 confirms the selected water-mass solubility values;the density paragraph gives2109kg/m³at16°C. source-verification.json retains factual values,page identity andsource hash. The earlier size-limit/indexed-only concern is resolved. Full source files remain only in ignored tmp/pdfs,not student assets.

Liquid geometry excludes solid interiors;independent signed-volume tests verify both phases.21 reference forms are separate,inside the vessel and submerged across allowed corners.104 actual SVG states,80 3D readouts,121 viewport cases,54 GUI trials and1350 independently calculated exported results passed. Initial undersaturated seeds preserve exact initial mass andzero new solid. Keyboard live-readout scrolling andmobile25step calculations/table were checked. Full limitations are retained in review.json.
