# CL-0036 — Volume displacement by an insoluble solid (model checkpoint)

An ideal graduated vessel has reference cross-section16cm², capacity100mL and flat-level rim height6.25cm. Initial water is40–80mL. Dense insoluble specimens have full volumes5–30cm³: a glass sphere, steel cylinder or stone ellipsoid. Declared reference densities2.5,7.8 and2.7g/cm³ are chosen teaching values, not measured/calibrated materials. All footprints fit within the cylinder; every supported specimen can become fully submerged at the lowest initial-water setting while hanging0.15cm clear of the base. No floating specimen is included.

The hanger holds clear for10s, lowers during10–40s, holds immersed40–60s, withdraws60–90s and remains clear to120s. Quasistatic force balance is a teacher extension; acceleration, drag, bubbles, wetting films, splashes, absorption and thermal changes are excluded. There is no overflow transit inventory: collected water is assigned immediately to the receiver.

For the vertical ellipsoids the immersed-volume fraction at fractional heightu is3u²−2u³, obtained by integrating elliptical horizontal sections. Cylinder fraction isu. A fixed-volume shape is lowered; it never shrinks or dissolves. At each time the highest previous insertion determines the greatest volume that could exclude water at the rim. Captured overflow=max(0, initial water + displaced volume at rim at peak insertion −100mL). It remains captured after withdrawal. Current remaining water=initial−captured. A64-step monotone bisection solves16h−immersedVolume(h−objectBottom)=remaining water. Every supported horizontal solid section has area below16cm², guaranteeing monotonicity.

The exact ledger is: water reading−initial water+captured overflow=currently immersed solid volume. With full immersion this is the solid volume. With partial immersion it is not the full volume. At80mL initial water and30cm³ full solid, the rim reading100mL alone suggests20mL; adding10mL caught overflow recovers30cm³. After withdrawal, the vessel holds70mL and the receiver10mL. Captured water does not automatically return.

Reference Archimedean buoyancy=1000kg/m³×9.81m/s²×immersedVolume×10⁻⁶m³/mL. Solid weight=(density×full volume/1000)×9.81N, and hanger tension=weight−buoyancy. The solid stays clear of the base, so no bottom normal force is included. Equal-volume objects can have different weights but identical fully immersed reading changes.

The110s guide advances the120s prescribed experiment at1.5× over80s, with10s introduction and20s conclusion. Captions are selected from the current actual lowering/hold/withdrawal stage so they stay synchronized with object motion. Manual playback is intended to be1×.

Eight model tests pass: all-shape/volume/water/time conservation; independent cross-section quadrature; full-volume and SI-force substitution; retained overflow after withdrawal; geometric wall/base clearance and different densities; insertion-history hysteresis; worked calculations and guide-caption synchronization; invalid inputs. An initial test incorrectly expected no overflow at50% insertion for the tallest stone: the independently integrated cap is already large enough for some overflow. The no-overflow comparison was corrected to40% insertion rather than changing the model or suppressing overflow. UI, geometry rendering, practical record, live playback, responsive checks and final review remain incomplete. This is not a completed lab.

## Private development provenance

OpenStax University Physics Vol1,14.4, provides the factual cross-check that buoyancy equals the weight of displaced fluid and that displaced volume is the submerged solid volume: https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy . Cross-section integration, peak-history overflow solution, bisection, explanations and code are original. No protected text or asset was copied. This link is private development provenance and must not appear in product UI/student reports. Editorial Class3 placement is not a verified official board mapping.

## Implemented visual/practical system (browser review in progress)

The apparatus now has a lifting stand, turning handwheel, suspension wire, model specimen, graduated reference vessel and overflow receiver. The3D liquid is a closed boundary with the immersed specimen cavity excluded. Ellipsoid cavities use integrated curved surface patches; cylinder cavities use inward side/base/top surfaces as appropriate. The free surface has a hole when the specimen crosses it. Independent signed-triangle volume checks agree with analytic remaining water to within0.2mL, and no liquid-boundary vertices lie inside the solid. Tessellation approximates smooth geometry; displayed readings remain analytic rather than inferred from pixels.

The overflow indicator moves with cumulative captured amount only while its analytic rate is positive. An extra independent finite-difference check validates that rate and confirms it stops at hold/withdrawal. Sixteen targeted tests pass (nine model and seven geometry/record/report checks). The practical validates settings, retains the latest60 observations locally, escapes notes, and supplies original per-trial displacement/overflow/force substitutions in an exam-style report.

Two3D camera modes are available. Complete apparatus includes the whole prescribed motion; eye-level inspection uses a horizontal camera at the current computed surface. Orthographic frustum offsets fit the vessel without moving that eye height. Reset restores the preset after orbiting. Static scale labels are procedural original canvas text. The lavender ring identifies the initial level, not extra water. Readings can collapse separately from the canvas.

The full110s3D guide has completed in the browser. The2D guide, controls, observed data/report, persistence and final layout review remain in progress. No final review is claimed by this interim note.

## Final internal review

The earlier model-only/in-progress checkpoint notes are superseded by review.json. Both110s guides completed,23 GUI observations and the downloaded worked report were independently checked,18 rendered-state volume closures agreed, notes survived reload, and50 saved viewport/format/measurement checks passed. The overflow arrow was moved clear of scale labels and retested during active transfer. Source dependencies are hashed in the final review. No independent expert, official curriculum or physical-device certification is claimed.
