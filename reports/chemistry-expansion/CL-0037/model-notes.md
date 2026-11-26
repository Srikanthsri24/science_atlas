# CL-0037 — still-water dye diffusion: model checkpoint

Not reviewed or complete. UI, 2D/3D rendering, full guide playback and responsive evidence remain outstanding.

A closed 1–4 mm cube magnifies diffusion without pretending a centimetre-scale beaker mixes instantly. A centred Gaussian spot is the starting condition; injection, settling, buoyancy, advection, chemical changes and calibrated optical response are outside scope.

Reference temperature 298.15 K, viscosity 0.00089 Pa s, effective radius 0.5–1.5 nm, fixed trace mass 0.02 microgram. Radius and viscosity are explicit teaching choices rather than measured food-colouring parameters. Stokes–Einstein determines D; SI m²/s converts to mm²/s by multiplying by 10⁶.

24 finite-volume cells per axis with reflecting boundaries. A discrete cosine eigenbasis exactly advances this semi-discrete diffusion operator; the separable 3D field is the product of its three 1D mass weights divided by voxel volume. Tiny floating roundoff is clamped and normalized. Voxel-integrated variance includes dx²/12 within each cell. The early free-space variance estimate is separately labelled and must not replace the bounded-cell result at late times. Nearly uniform means concentration CV≤0.05, not dye disappearance.

110-second guide includes 80 seconds at 22.5× model speed, representing 1800 model seconds. Manual timeline supports 0–3600 model seconds. These are model outputs, not physical instrument readings.

Ten targeted tests pass: positivity, conservation, reflection, independent explicit finite-volume stepping, early variance, closed-cell uniform limit, dimensionless time scaling, float32 voxel mass, input validation and report escape/substitutions. Independent stepping needed a sufficiently small time step for its first-order temporal truncation error; the model was unchanged.

Private development cross-checks, not student-facing references:
- IUPAC Gold Book, Stokes–Einstein equation: https://mail.goldbook.iupac.org/terms/view/12260 — formula and effective-radius/continuum interpretation.
- NIST CODATA Boltzmann constant: https://physics.nist.gov/cgi-bin/cuu/Value?k — exact 1.380649×10⁻²³ J/K.

No independent expert certification, official board mapping or real-device verification claimed.

## Rendering and review work

2D projects each finite-volume dye column onto the water cell. Its opacity follows an explicitly uncalibrated optical proxy, 1−exp(−40×column mass/area). The 3D volume samples the same 24³ concentration field with trilinear texture interpolation and integrates optical depth over 96 steps per viewing ray. The image is an approximate concentration visualization; displayed mass and spread use the finite-volume ledger, not screen-pixel estimates. No moving decorative particles imply molecular size.

Additional tests check the independent reflecting-wall variance derivative and monotone spread/peak/CV. The latter exposed cancellation in sqrt(N³(Σp²)³−1) close to uniformity. Replaced it with the algebraically identical stable excess formulation q=NΣ(p−1/N)²; CV=√(3q+3q²+q³). This affects tiny numerical noise, not the conserved field. Twelve targeted model/record tests now pass.

Browser testing exposed clipping of expanded 3D measurements in the 260px minimum phone stage. A lab-specific expanded-state minimum height and scroll cap keep the readings within the stage. The camera fits narrow canvas aspect ratios. Internal review remains pending until all saved GUI checks and report evidence are complete.

## Final internal review

37th lab passed internal functional review on 2026-11-26. Both 110-second guides completed, 19 actual rendered fields independently conserve mass and reproduce spread, 24 persisted observation rows match the model and actual downloaded report, and 49 corrected viewport checks pass. Two original clipping failures remain recorded. Full regression 2049/2049, targeted12/12, standalone TypeScript and production build pass. See review.json for exact scope and source hashes.
