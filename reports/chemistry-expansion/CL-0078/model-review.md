# CL-0078 — preparation of stated mass concentration

Status: passed internal functional review on2026-11-27. Independent expert certification remains unverified. The implementation notes below retain the historical checks and corrections;final evidence is in review.json.

Procedure reference inspected: University of York, Chemistry Teaching Laboratory,
https://chemtl.york.ac.uk/techniques/quantification/volumetrics/preparing-solutions-from-solids
Weigh known mass; quantitative transfer/rinsing; dissolve before final make-up;
read real meniscus at eye level; stopper and invert; account for temperature.
Original wording and apparatus; no third-party media copied. This reference is
private engineering evidence,not a student-facing source panel.

Distinct from CL-0031 saturation,CL-0038 household-solid comparison and CL-0068
colour dilution: this investigation prepares to FINAL SOLUTION volume,with an
explicit separate dry-solid volume,finite boat residue,rinsing,chosen dissolution
cohorts and volume-setting mistakes. It does not identify a named chemical.

Chosen β=0.6 mL/g apparent dissolved specific volume; solid density2 g/mL;
water density1 g/mL; reference solubility capacity0.5 g per mL water. These are
chosen model assumptions,not values calibrated from the procedure reference.
All supported preparations are undersaturated. Finite water reservoir1.5Vnom.
Each solute cohort has linearly shrinking radius during chosen intervalτ;
constant-rate pour/rinse inputs are integrated analytically. Time is procedural,
not calibrated chemical kinetics. Correct slow procedures wait for full dissolution.
Premature filling can produce later level drift. Quantitative-transfer completeness
and actual target concentration are deliberately separate flags.

Original piecewise conical-frustum flask integrates analytically to its100/250mL
mark. No capillary-equilibrium claim: flat reference surface. Water mesh is a
closed outer occupied solid with a reversed equivalent-residue sphere cavity.
The first mesh-volume test caught wrong cavity winding; fixed before any review.
Tessellation error tested below0.2mL at sampled maximum-mass stages. Single sphere
is an equivalent-volume symbol,not literal crystal morphology. No actual stirring,
inversion CFD or temperature model; mixing currently a scheduled operation.

14 focused tests pass after geometry correction. TypeScript passed before latest
camera focus edits; rerun required. Live route loads,correct final state20g/L,
first GUI observation stored; initial3Dconsole has no warning/error. First screenshot
showed excessive camera whitespace; added flask/balance close-up and tighter bounds.
Actual120s3D guide started; completion and responsive/report checks still pending.
Do not freeze sources or mark catalogue ready until remaining checks complete.

## Final internal functional review
All required checks above completed. See review.json,actual-ui-report.html,download-validation.json,browser-checks.json,responsive*.json and final test/build logs. Camera whitespace corrected;boat moves and duplicate static boat removed;equivalent tiny numerical residue normalised before rendering. No independent expert/official-board/physical-instrument certification claimed.
