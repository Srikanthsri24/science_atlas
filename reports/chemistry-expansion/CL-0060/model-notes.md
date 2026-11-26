# CL-0060 — Compare crystal growth during fast and slow cooling

Status: in progress. Scientific core and practical-record engine implemented; visualization and browser review remain. Not a completed lab.

## Preparation and model

Equal covered KNO3 solutions, initially at 80°C, contain 50–100 g water and 40–80 g dissolved salt with no initial solid. Even the largest permitted charge fits the smallest hot capacity (84.5 g). Fast linear cooling takes 60–240 s; slow cooling takes 2–5 times as long. Both stop at 20°C. Prescribed temperature is not a heat-balance calculation. No evaporation, solvent inclusion, reaction or thermal expansion.

The audited water-mass solubility reference uses 31.6, 63.9, 110 and 169 g KNO3 per 100 g water at 20, 40, 60 and 80°C. Linear interpolation between points is coarse. Density 2.109 g/cm³ at 16°C is a geometric reference. See private source-verification.json. Sources remain outside the student UI.

Let M be initial salt, X solid mass, D=M−X dissolved mass, C=W*s(T)/100 capacity, sigma=max(D/C−1,0). Effective sites N start at zero. Site formation is B*max(sigma−threshold,0)^2. Every effective site consumes chosen nucleus mass m0=0.0001 g. Equivalent spherical area is (36*pi)^(1/3)*(X/rho)^(2/3)*N^(1/3). Surface growth rate is kg*A*sigma. Total solid rate includes both surface growth and m0*dN/dt. No mass-free nuclei. Fractional effective sites and equivalent radius are ensemble variables, not literal crystal counts or actual crystal habit.

Chosen teaching ranges: kg=0.005–0.05 g/(cm² s), B=0.2–5 s^-1, threshold=0.02–0.2. These are not measured material constants. Physical time 0–2400 s. Do not claim the default fast/slow size relationship holds for all real preparations or every possible parameter set.

## Numerical method and checks

Positive frozen-coefficient integration, production step 0.05 s, midpoint prescribed capacity. Site increments consume available supersaturated mass; the remaining transfer uses a bounded exponential with the newly seeded area. Each step preserves salt and water, nonnegative inventories, and does not overshoot the midpoint capacity. Cooling is monotonic, so this also does not exceed the end-of-step equilibrium solid inventory. Cached trajectories exclude observation time from the key and evaluate fractional terminal steps.

Refinement across 64 preparation/kinetic/program corner combinations compares 0.05 with 0.025 s at 2400 s. Largest relative change in final solid mass, effective sites or equivalent radius was 0.004814327610735711 (0.4815%), for effective sites at water50, salt40, kg0.05, B5, threshold0.2, cooling60 s. This is a finite-step convergence check, not a proof of exact solution or real-world validation. Initial onset traces still need browser/geometry review.

## Practical record

Twenty-two observation columns, bounded local writing and latest60 trials. Each trial retains controls and recomputes results instead of trusting saved derived outputs. Twenty-two calculation blocks distinguish numerical cumulative inventories from instantaneous rates. Nucleus and later surface-growth masses are separate, both included in X. Three print-friendly observation tables, escaped student writing, formula/substitution/results and exam sections. No source links in exported student report. Actual GUI download/persistence checks remain.

## Planned guide

120 presentation seconds: 10 s setup, 100 s evolution spanning 0–1200 physical seconds, 10 s endpoint. Manual playback will span 0–2400 physical seconds. Compare both temperatures while cooling: equal elapsed time is not equal temperature. After both programs reach 20°C, compare mass, effective sites and equivalent size. Original 2D/3D geometry, controls and actual playback are not yet implemented.

## Geometry groundwork

Twenty-one fixed weighted capped rhombic forms show the total solid volume, not the predicted effective population. They are rotated45° to prevent footprint overlap. Shape width/depth1.6s,height0.9s, volume(width*depth/2)*height*11/15. A128-sided4.7cm-radius vessel contains the full solution and all forms; independent triangle-volume checks prove the liquid boundary excludes solid interiors. A continuous inventory sweep across water/salt corners confirms containment, separation, submersion and no overflow. Drawing solution volume uses chosen water1g/cm³ and dissolved partial volume0.45cm³/g, not measured density calibration. An equal-scale mean-equivalent-size inset is still needed so the fixed total-volume forms do not misrepresent individual size.

History samples preserve exact observation endpoints and cooling boundaries without tiny floating-point future evidence. Twenty-four focused tests across core, practical record and geometry pass. UI, actual browser and final regression checks remain.
