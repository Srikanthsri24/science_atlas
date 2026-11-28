# CL-0112 — Compare natural and synthetic fibre absorption

In progress: numerical core implemented and independently checked. Viewers, practical UI and complete review remain outstanding; not counted completed.

Use a matched coupon immersion/lift/drain/weigh investigation, with a clear distinction between polymer/fibre absorption, inter-fibre capillary retention, surface wetting and moisture regain from humid air. A mass gain after a defined immersion and drainage protocol is not, by itself, intrinsic fibre absorption or a prediction of wearer comfort.

Candidate comparisons: cotton, wool, nylon and polyester coupons with disclosed selected capacities and drainable fractions. Do not infer a universal natural-over-synthetic ordering or transplant humid-air NIST uptake percentages into immersed-liquid capacities. Any selected kinetic/drainage parameters are teaching references, not measured constants or a fitted physical textile model. Construction and finishes need explicit control or selectable effects. Consider two independently accounted water compartments so inter-fibre drainage is not silently deleted.

Finite initial water reservoirs, exact dry/coupon/retained/drained/remaining-water accounts, zero-dose controls and repeatable tare/gross/net weighing are required. Normalize retained water by dry mass (g/g and percent) and distinguish wet-basis water content from dry-basis mass gain. Avoid inventing chemically valid fibre swelling geometry from uncalibrated water uptake.

The apparatus should visibly lower coupons, lift, hold to drain over a separately accounted catch tray and weigh without immersing the balance. Keep coupon mass/geometry, bath levels, draining trajectories and displayed measurements consistent. 120-second guide should stage the protocol while clearly separating guide time from selected soak/drain times, with meaningful movement rather than only rotating coupons.

Required review: independent mass/volume accounting, numerical and report arithmetic/operand/unit checks, zero water and no uptake, wetting and retention controls, 2D/3D complete playback, all responsive modes and scope selectors, native camera controls, saved observations with formula substitution, proper exam-style report and actual downloaded-report audit. Official board mapping and independent human expert review remain unclaimed.

## Selected operational reference
Four coupon identities: cotton, wool, nylon and polyester. Per-gram strong/drainable capacities and soak/drain time constants are explicitly selected teaching coefficients, not published material measurements. Shared construction factor scales the drainable capacity; a separate strongly-retained scale and wetting scale are experimental reference controls. An example change in construction can reverse a no-drain ranking.

One common wetting fraction per coupon fills both operational pools proportionally, capped by its finite initial bath. A first-order drain stage moves only drainable water to a separate catch account. Strongly retained water is constant over this selected 0–180 s window; evaporation is omitted. These pool masses are not an experimental separation of internal absorption and inter-fibre retention.

A 1 mg digital indication is computed separately from exact model mass. A 1 pg numerical boundary allowance makes decimal half-division rounding stable; it is not physical balance uncertainty. Report dry-basis gain, wet-basis water fraction and indicated water mass as distinct quantities. The staged 120-second protocol includes dry/lower/soak/lift/drain/weigh/interpret; guide duration and chosen soak/drain time remain distinct.

## Geometry implemented (not yet rendered/reviewed)

A common 5 × 5 cm reference porous-coupon envelope uses a selected dry bulk density of 0.2 g/mL and a selected skeleton density of 1.3 g/mL for all four preparations. These are geometric teaching conventions, not measured densities of the named fibres. Operational retained water fits within the reference void envelope throughout the supported domain; the outer dimensions remain fixed. The display must disclose that it does not predict fibre swelling or microscopic pore geometry.

The 6 × 6 cm bath solves the water level around the submerged portion of the envelope. Internal retained water is excluded from surrounding free water, and envelope displacement is added exactly once. Entry and exit are continuous; horizontal transfers occur above the liquid. Empty-pan indication is used throughout lowering/soaking/lifting/draining/transferring, with coupon mass displayed only at the dry start or after arrival on the pan. The practical UI must allow observation recording only in manual mode or when the coupon is on the balance, and never during playback.

The initial 2D component and readings panel are written but not connected or visually reviewed. Native gestures, complete browser playback, responsive bounds, notebook persistence and actual downloaded-report checks remain outstanding.
