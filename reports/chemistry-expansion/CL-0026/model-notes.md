# CL-0026 · graduated-cylinder model foundation

This Class 3 editorial investigation is about reading a liquid volume and controlling viewing position. It is not yet a completed lab review. The first 25 chemistry labs were published successfully in df6df61; this is the first investigation of the next batch.

## Geometry and water accounting

Ideal inner radius R = 1.25 cm, body height 23 cm, 10–100 mL front graduations at 1 mL intervals. 1 cm³ = 1 mL. A finite target reservoir of 10–100 mL delivers at target/20 mL/s for 20 s. Cylinder plus remaining reservoir always equals the starting target. The guide uses a 50 mL target and does not change its water during the viewing comparisons.

The chosen concave radial surface is h(r) = h_c + a(r/R)². Its area-average height is h_c + a/2, so h_c = V/(πR²) − a/2. Reference edge rise a = 0.1 cm is prescribed, not solved from surface tension/contact angle. For tiny initial volumes, a is reduced to min(0.1, 2V/A) to keep the centre at or above the floor while conserving volume. Independent radial integration verifies the water volume, including the smallest fills. At measurable volumes the full reference rise applies.

Calibrated model mark for M mL is y_mark = M/A − 0.05 cm. The marks therefore align to the lowest central meniscus point, accounting for the prescribed profile volume. Naively using V = A h_c without the meniscus correction would be inconsistent. The 100 mL liquid surface remains below the 23 cm vessel rim.

## Front-scale viewing geometry

The lowest meniscus centre is at z = 0, height h_c. Observer is at z = D (6–12 cm) and relative height offset Δ (−2 to +2 cm). The ideal thin front scale lies at z = R. A straight sight line to the meniscus centre intersects that scale at h_app = h_c + ΔR/D. Applying the model calibration gives V_app = A(h_app + 0.05); the measurable-volume geometric error is AΔR/D. The sign is specific to this front-scale arrangement, not a generic claim about every front/back/circumferential graduation layout. Refraction is excluded.

Nearest-division reading rounds to 1 mL only when the liquid and projected point are within the 10–100 mL marked range. Empty, under-range and off-scale cases return no valid reading; they never clamp an extrapolated number to a misleading endpoint. Half-division 0.5 mL is a rounding-resolution bound, not a claim of total measurement accuracy. Parallax and quantization errors are stored separately.

## Viewer implementation requirements

The 110 s guide begins empty, fills from 10–30 s, then smoothly moves the observer above, below and level while retaining the same 50 mL. Use the `pouring` flag to avoid a stream during the initial paused/intro state. Meniscus geometry and grade positions must use the supplied functions, not a flat liquid surface. Show the bottom of the meniscus, front graduations, observer position and sight line clearly.

For a true eye-view inset, place a perspective camera at (0, fluidBase + h_c + Δ, D) looking toward (0, fluidBase + h_c, 0). Front ticks should lie on the model front plane z = R (only a negligible render offset to prevent z-fighting). Keep this reading view tied to observer controls; a separate freely orbitable overview can show the apparatus. Free orbit must not silently change the apparent measurement while the displayed eye parameters remain fixed. A two-canvas overview plus fixed eye-view inset is one suitable approach. The observation eye can remain hidden during under-range filling, when no valid reading is offered.

A lathed closed water mesh can follow the radial parabolic cap. Record/teacher calculations should show A = πR², delivered and remaining volumes, mean/central meniscus heights, the calibrated mark, the ray-intersection substitution, valid nearest-division result and error decomposition. Primary-age instructions should emphasize the lowest point and eye level, with the more advanced geometry labelled as a teacher extension.

## Private source basis and limits

NIST GMP 3, Reading a Meniscus (2019): https://www.nist.gov/system/files/documents/2019/05/14/gmp-3-reading-meniscus-20190507.pdf . Used to cross-check viewing-plane and meniscus-reading principles. The cylinder dimensions, parabolic profile, straight-line error calculation and teaching calibration are original idealized model choices, not manufacturer measurements or an official curriculum mapping. Reference links remain outside the product UI.

No Young–Laplace solution, optical refraction, thick-glass optics, drainage film, thermal expansion, sloshing or calibration uncertainty is solved. Six passing tests cover the independent volume and ray checks, conservation, 1 mL spacing, rounding, no-reading controls and the 110-second sequence. Viewers, report and browser review are still pending.

## Completed implementation and review

Both viewers, the fixed observer inset and inspection mode, fifteen-trial practical workflow, worked HTML report and note persistence are now implemented and internally reviewed. The input distance is explicitly horizontal D; the separate slanted sight-line distance is sqrt(D² + Δ²). The 3D perspective camera is checked against the exact front-scale ray intersection in 81 fixtures. All 1 mL ticks remain; labels occur every 5 mL in close-ups for legibility. Compact and inspection frames were checked at phone/tablet/laptop/TV viewport sizes, including a 320-pixel landscape stage. See review.json for scope, final source hashes and evidence.
