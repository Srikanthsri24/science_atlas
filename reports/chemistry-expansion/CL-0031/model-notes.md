# CL-0031 — Measured salt additions

Original frontend teaching model. Reuses the unchanged CL-0013 approximate NaCl reference capacity of 0.36 g per mL starting water at 25 °C and chosen k=0.05 s⁻¹. Reference water density is 1 g/mL; solid reference density 2.16 g/cm³ is used only to encode remaining solid volume. These are not calibrated dissolution rates, official chapter mappings or independent expert certification.

## Continuous dose input

Each measured portion is 5 g, delivered uniformly over 2 model seconds (q=2.5 g/s), followed by a 120 s hold. All earlier doses complete both stages before the current dose. During transfer, A(t)=A_previous+qt, T(t)=min(A(t),C), and dD/dt=k(T−D). Before capacity crossing, the exact solution is D(t)=T0+qt+(D0−T0)exp(−kt)−(q/k)[1−exp(−kt)]. If the growing target reaches C, split at (C−A_previous)/q and use the constant-target exponential for the remainder. The hold uses D_after=T−(T−D_pour)exp(−k hold). This replaces the initial instantaneous-dose prototype; the prior four-test prototype evidence is superseded by six continuous-transfer model tests, including independent RK4 across all twelve doses.

Solid=added−dissolved. Equilibrium excess=max(0,added−C). Transient residue=solid−equilibrium excess. Finite-time residue alone is not evidence of equilibrium saturation. The ≥99.9% indicator is explicitly near capacity, not exact equilibrium. At eight complete portions in 100 mL water: added40g, C36g, D≈35.997708g, remaining≈4.002292g, excess4g, transient≈0.002292g. More starting water is a fresh experiment, never an unexplained instantaneous dilution.

## Visual accounting

The total60g salt supply is partitioned between the supply container, allocated dose cup and vessel (dissolved+solid). Allocating a new cup is a prepared measurement step; it is not a claimed automatic scoop simulation. The tipping cup shows the changing remaining portion. Its stream is a qualitative delivery indicator, not separately mass-resolved particle trajectories or a fluid solution. The tared balance reads reference water mass plus delivered salt; tare, cup and reserve supply are excluded.

The 3D residual material uses64 representative cubes, edge=cube-root(solid/(64×2.16)), on a permeable support. Their geometric volumes sum to the remaining solid volume; count is not a physical grain count. No surface-area-dependent kinetic law is implied by these blocks. Supports have negligible obstruction. The support radius3.48cm contains every block corner at the largest supported residue and remains within the3.5cm cell. Water geometry depicts only the starting water, with no solution-volume prediction. The 2D whole view is a labelled8-block front slice; inspection shows all64 schematic representatives. Full3D contains64. The supply volume and dose-bed volume use reference density; crystal morphology, ion trajectories, heat and fluid motion are not solved.

Guide110s:10s preparation; eight10s cycles consisting of a2s transfer shown1× and a120s model hold shown15×;20s conclusion. Total model duration976s. Manual dose playback122s is1×. Prepared comparisons reconstruct prior complete holds and are explicitly labelled, never student-observed history.

## Regression fixes found during browser review

The first prepared-comparison browser check caught a reused sugar formatter whose domain was0–10g; it was replaced with a bounded salt-specific0–60g formatter. A dedicated regression test covers larger masses and tiny positive residues, including HTML-safe report output. Historical error logs remain development evidence; final clean-load evidence must be gathered after all fixes. No earlier reviewed lab source is modified.

## Private scientific reference check

American Chemical Society, Middle School Chemistry, 2023 Chapter5 Lesson6 teacher PDF, printed page6: https://www.acs.org/content/dam/acsorg/msc/downloads/chapter-5/lesson-6/ch5-l6-lesson-plan.pdf . Checked2026-11-25. Its NaCl table uses grams per100mL starting water and lists36 at20°C and36.5 at40°C. The existing model's36g/100mL at25°C is a rounded instructional approximation near these values; it is not an exact table entry or a claimed temperature interpolation. This source supports the capacity order/basis, not the chosen rate, transfer duration or3D apparatus. Only factual values are used; all explanatory content and code are original. No external references are exposed in product UI or downloaded student report.
