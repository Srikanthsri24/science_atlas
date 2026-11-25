# CL-0003 — Sealed-sheet water barrier model

This original teaching model compares four specified sheets and an optional puncture. It is not a calibrated measurement of all paper, cloth, plastic or foil.

A constant-area upper reservoir is sealed around a 5 cm² opening. Starting volume is 10–30 mL in the UI; the numerical model accepts 0–40 mL. After a chosen wetting delay, through-sheet flow is Q = G h, where h = V/A. Since 1 mL = 1 cm³, integrating dV/dt = −GV/A gives V = V₀ exp(−G t/A). Collected water is V₀ − V. Conductance G has units mL s⁻¹ cm⁻¹.

Chosen illustrative parameters:

| Sheet | G | Delay |
|---|---:|---:|
| Uncoated paper | 0.025 | 8 s |
| Open-weave cloth | 0.09 | 2 s |
| Intact plastic | 0 | 0 s |
| Intact foil | 0 | 0 s |
| Punctured sheet | 0.5 | 0 s |

The puncture overrides the conductance and delay. This is a controlled model comparison, not a claim that any hole has this conductance. Edge leakage, absorption, swelling, capillary transport, tearing and sheet deformation are excluded. A finite no-leak result supports only the stated conditions.

Water levels follow the conserved numerical volumes. Vessel geometry is schematic. Droplet markers advance with cumulative leakage and accelerate downwards visually; they do not measure actual droplet size, particle trajectories or surface tension. The guide stages four 60-second trials within 100 seconds and explicitly labels staged time. The independent trial timer advances at 1× speed while the tab is visible and pauses while hidden.

Verification covers conservation, monotonic leakage, lag, intact versus punctured barriers, the derivative of the analytic solution, invalid inputs, report escaping, retained observations and numeric substitutions. Internal engineering review is distinct from independent scientific certification and official board alignment.
