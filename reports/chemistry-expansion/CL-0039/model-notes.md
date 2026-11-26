# CL-0039 — rice and loose-husk winnowing: model/report checkpoint

In progress. Not reviewed or counted as a completed lab. The mathematical model, structured calculations and report logic are implemented; UI, animated 2D/3D views, actual observations/report download and responsive browser review remain outstanding.

## Scientific scope

Independent kernels fall from rest through uniform horizontal air. Newton's equation uses vector quadratic drag F=½ρCdA|u−v|(u−v), plus downward gravity. The full relative-speed magnitude couples horizontal and vertical drag; it is not two independent component-squared laws. Density1.2kg/m³ and gravity9.81m/s² are explicit reference constants. Effective kernel mass, projected area and Cd are illustrative, not measured crop data. No lift, rotation-dependent area, turbulence, collisions, aerodynamic shielding, buoyancy or resuspension is solved.

Rice base reference:25mg per kernel,8mm² effective area,Cd0.8. Loose-husk base reference:2mg,25mm²,Cd1.1. Twenty-four deterministic variants per material vary mass/area by±15% and Cd by±10%; this is a chosen reference ensemble, not an empirical probability distribution. Each magnified trajectory marker represents1000 independent identical kernels, never a physical clump with a different drag-to-mass ratio. Rice initial mass600g; husk48g; total648g.

One cohort is released every1.2s from model2s through58.4s. Wind0–6m/s, height0.5–1.5m, near-mat divider0.25–1.5m, far mat ending6m. Source, airborne, near, far and outside-floor inventories independently retain both materials. On contact, ideal capture surfaces hold kernels without bounce or subsequent blowing; material beyond the mats remains in the floor ledger. This is not a prediction of real mat adhesion or farm yield. Winnowing handles already loose husk; it does not hull attached rice husks.

## Numerical verification

RK4 at2.5ms with a linearly interpolated collection-plane event. Reference height/wind route sets are cached with at most8 configurations; changing the divider reclassifies actual landing coordinates without recomputing flight. UI playback will interpolate precomputed routes, avoiding repeated integration each frame. The75s model window fully covers this chosen feed schedule; a planned110s guide includes10s introduction,80s at0.9375× model time and20s closing comparison. No guide playback has been browser-verified yet.

Independent still-air solution: vy=−vt tanh(gt/vt), y=H−vt²/g ln cosh(gt/vt), vt=√(2mg/(ρCdA)). For selected rice/husk variants0,11,23 at heights0.5/1.5m, the2.5ms RK4 grid showed maximum velocity error3.83×10⁻⁹m/s and position error3.47×10⁻¹⁰m before the interpolated impact. At5ms these were6.26×10⁻⁸m/s and5.54×10⁻⁹m. Tests bound velocity error below10⁻⁸m/s and position below10⁻⁹m. Impact convergence at wind3/6m/s and selected endpoint variants is checked against a halved step. The finite drop does not necessarily reach the hypothetical still-air terminal speed.

Signed-zero drag components are normalized to zero for clean unit substitutions. An initially overstrict analytic velocity assertion exposed the expected finite-step truncation error; measured refinement informed the smaller default step and explicit tolerance rather than hiding the discrepancy.

Fifteen targeted tests pass:10 model/calculation tests and5 record/report tests. They cover mass conservation through all inventories across supported corners, the independent analytic fall, vector force direction and units, impact refinement, still-air failure to separate, divider independence, high-wind rice loss/outside husk, interpolation/capture, bounded inputs, guide timing, structured calculations, record validation/retention/escaping, undefined empty fractions and provisional recovery.

## Worked practical structure

Separate fields for formula, current-value substitution, numerical result, unit, applicability and model note. Force calculations apply only while airborne; source support or capture is stated otherwise. Kernel forces and weighted bulk mass are kept distinct. Near purity is undefined when empty, not0% or100%. Overall recovery uses all initial rice and remains provisional until all cohorts land. Numerical future landing positions are explicitly predictions, not observations of unreleased material. The report records all collection fractions plus source/air inventories and supplies exam-style aim, apparatus, procedure, results, conclusion and limitations. HTML input is escaped and no external links appear in student output. Actual browser report download and persistence still need verification.

Illustrative reference outcomes only (not empirical yield): still air at1.2m gives600g rice plus48g husk on the near mat (92.5926% rice purity,100% rice recovery); wind3m/s at1.2m separates this reference ensemble perfectly at the0.5m divider; wind6m/s at1.5m sends all reference rice to the far mat and all reference husk outside6m, leaving near purity undefined and near rice recovery0%. Do not present perfect reference separation as measured farm performance.

## Private development cross-checks

These references support the general equation/qualitative principle, not the chosen kernel data or an official class mapping. No source links are placed in student UI/reports.

- NASA Glenn, Drag Equation: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/drag-equation/ — quadratic drag depends on fluid density, reference area, Cd and relative speed.
- NASA Glenn, Factors that Affect Drag: https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/factors-that-affect-drag/ — relative particle/air speed and shape matter.
- FAO, A Guide to Forest Seed Handling, cleaning by blowing: https://www.fao.org/4/ad232e/AD232E06.htm — separation depends on weight, resistance/shape and airflow. This is qualitative seed-cleaning context, not a rice calibration.
- FAO, Module5: https://www.fao.org/4/a0812e/a0812e05.pdf — wind/fan winnowing separates loose light chaff from grain.

No independent expert, official-board, measured instrument or physical-device certification claimed.
