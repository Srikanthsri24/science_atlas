# CL-0050 — Investigate how surface area changes evaporation

In progress. No routed UI or final review is claimed yet. This is the50th listed investigation;publish the25-lab batch only after its actual visualization,record and responsive reviews pass.

## Original controlled comparison

Both samples start with the same20–100mL water amount. Independently chosen exposed areas25–100cm² remain constant while wet. An ideal environment maintains both reference surfaces at37°C with the same prescribed uniform mass flux0.2kg/(m² h). This flux is an original chosen teaching parameter,not a measured material constant or weather prediction. Temperature,airflow and ambient humidity are held fixed by assumption;no empirical relation from those conditions to the chosen flux is claimed.

Rate = mass flux × exposed area. Each sample loses min(initial mass,rate × physical hours),and stops transferring mass once dry. Remaining liquid plus escaped water vapour always equals the initial mass. Fixed reference water density1g/mL approximates volume. Equal initial volumes in unequal areas begin at unequal depths. Under the chosen same flux,the two wet depths fall at equal rates,even though their mass losses differ. After one dries,the initial wet-area ratio no longer describes cumulative loss indefinitely. Zero-denominator ratios remain explicitly undefined.

A representative latent heat2428000J/kg supplies an optional energy extension. The controller replenishes the latent heat needed to maintain temperature;this is not total electrical energy or a solved thermal balance. Sensible heat losses,receiver heat capacity,boundary-layer size/shape effects,changing humidity,surface cooling,contact-line recession,capillarity and condensation are outside this model. The air is an open,infinite sink,not a sealed humidifying chamber.

The120s guide holds setup for15s,compresses24 physical hours into90 moving seconds,and holds the explanation for15s. Default50mL samples with25/100cm² areas lose12/48g respectively over24h;both are still wet. Manual physical window0–72h includes dry-tray cases. Display actual physical hours prominently;do not imply that these mass changes take two physical minutes.

## Planned original apparatus

Paired circular constant-area trays on separate matched temperature-control platforms. Readable area/radius/depth markers,equal initial mass,falling water surfaces,remaining/escaped-water budgets and an elapsed-time comparison plot. Water vapour is invisible:enlarged moving markers must be explicitly illustrative,not steam clouds,boiling bubbles or literal visible molecules. Do not render a sealed hood while assuming constant unsaturated surroundings. Compare equal areas,swapped areas,matched partial loss and dry-state cases. Provide working2D/3D cameras,120s guide,observation table,formula substitutions and an original exam-style report.

## Private primary references

- ACS Middle School Chemistry,Lesson2.2,https://www.acs.org/middleschoolchemistry/lessonplans/chapter2/lesson2.html . Read official lesson on2026-11-26. Supports controlled-variable investigations,liquid-to-vapour state change and the fact that escaped water remains intact water molecules in air. Its heating investigation is not the quantitative area-flux model used here. No lesson passage or media copied.
- OpenStax College Physics2e §14.3,https://openstax.org/books/college-physics-2e/pages/14-3-phase-change-and-latent-heat . Official page previously read in this work. The discussion gives2428kJ/kg for water evaporation around body temperature. Used as a constant representative37°C energy value,not a full temperature-dependent property solver.

References stay outside student-facing UI and reports. No external assets are used.

## Current verification

Nine model tests passed:initial mass/depth;independent SI flux conversion;all domain-corner mass budgets;equal depth loss and wet-area scaling;finite drying/rate cutoff;area swaps/equal-area symmetry;latent energy/power units;explicit120s-to24h guide mapping;invalid/coerced inputs.

Remaining:geometry/camera tests,2D/3D apparatus,clear time-lapse controls,practical notebook/report,actual UI trials,full playback,responsive verification,then the authorized Git push/deployment at50 reviewed labs.
