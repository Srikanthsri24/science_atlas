# CL-0045 — model and verification notes

Internal model work in progress. Not yet a completed laboratory or independent expert review. Class4 placement is editorial, not an official board mapping.

Two separate equal reference aliquots of20–80mL enter an ideal100mL beaker and100mL measuring cylinder at1mL/s each. They are not two views of the same single aliquot. A finite source starts with twice the chosen aliquot; source remaining plus both receivers is conserved. Lumped transfer neglects jet/film inventory, splashing, drainage, evaporation and temperature changes. Readings stay unavailable during transfer, then become available when flow stops. No additional hydrodynamic settling delay is solved.

Original vessel inner radii2.5cm and1.3cm; divisions10mL and1mL. These are teaching specifications, not a manufacturer accuracy class. Prescribed axisymmetric surface h(r)=V/A+a(r²/R²−1/2), a=min(chosen rise,V/A), so radial integration preserves V and the bottom never drops below the vessel floor. Chosen rises0.08cm and0.12cm are illustrative, not a Young–Laplace/contact-angle solution. Each ideal scale is calibrated against the lowest point, with the same height-to-volume relation; a flat-cylinder approximation must not silently replace the compensated relation.

A chosen common scale bias−2 to2mL shifts indicated volume in both vessels. Nominal tick v must appear at the physical meniscus-bottom height for actual volume v−bias, omitting marks outside the supported0–100mL domain. Reporting modes deliberately round either to the nearest marked division or to a tenth of a division. The latter is an exercise convention, not a universal uncertainty rule. Half the selected reporting increment is a rounding-error bound only, not combined measurement uncertainty or a confidence interval. Smaller divisions need not give a smaller actual error in every trial, especially when calibration bias is present. Repeated deterministic reads are not a statistical repeatability study.

## Primary reference consulted

NIST GMP3 (2019), Method of Reading a Meniscus Using Water or Other Wetting Liquid: https://www.nist.gov/system/files/documents/2019/05/14/gmp-3-reading-meniscus-20190507.pdf

Read the accessible8-page PDF text: lowest point of a concave meniscus, stable surface and appropriate eye alignment; radial cross-sectional area relates height error to volume error. It distinguishes reading/calibration practices and systematic effects from repeatability. This informs the observation method, not the chosen vessel radii, capillary surface, fill rate, bias or rounding model. No passage copied into student content. External references remain in private engineering notes, not student UI/report.

## Initial verification

10 model tests passed: finite-source inventory, independent Simpson radial integration, surface minimum and inversion, different vessel heights, undefined moving readings, quantisation bounds, nonzero bias despite fine graduations, reporting modes,120s guide and invalid inputs. Geometry,actual UI,report persistence,full guides and responsive QA remain pending. Do not mark ready based only on model tests.

Additional verification:4 geometry tests independently reconstruct nominal biased graduations from their physical heights, compare the front section against the radial surface and integrate the upward-facing surface mesh. All mesh triangles have positive projected area; the96-sector polygon approximation contains volume within0.1% of the analytic reference.4 notebook/report tests validate imported domains,60-trial retention,20 worked substitutions per trial, unavailable moving readings and HTML escaping.18 targeted tests passed. UI review remains pending.
