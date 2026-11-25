# CL-0008 · Floating and sinking

Internal engineering review; no official board mapping or independent expert certification is asserted.

Four equal-volume (20 cm³), solid, spherical specimens have chosen densities 600, 900, 2500 and 7800 kg/m³. Their masses are 12, 18, 50 and 156 g. Water density is 1000 kg/m³, g = 9.81 m/s² and prescribed water depth is 150 mm. These are teaching examples, not measured household specimens.

The center starts 40 mm above the water surface with zero velocity. Downward is positive. The submerged spherical-cap volume is πh²(r − h/3), with h clamped to [0, 2r]. Weight minus buoyancy minus quadratic drag drives vertical motion. The illustrative drag coefficient is 0.8; effective wetted drag area is πr² × submerged_fraction^(2/3). A semi-implicit Euler step of 0.001 s integrates a cached 12-second trajectory. A separately implemented half-step reference checks convergence. This is a simplified numerical teaching model, not a general fluid solver.

A sphere contacting the bottom has velocity set to zero (perfectly inelastic contact). Normal support then balances weight minus buoyancy. The floating cases retain slight residual oscillation at 12 seconds; their transient submerged fractions must not be reported as exact static equilibrium. The theoretical equilibrium fraction is density_sphere / density_water. The practical report explicitly distinguishes these values.

Air drag, surface tension, capillarity, added mass, waves, splash, fluid rotation and rebound are excluded. Water level is fixed, approximating a sufficiently broad reservoir. Force-arrow geometry is schematic and unscaled; numerical values are authoritative. Hollow objects and trapped air can alter average density and outcome; this lab compares solid spheres only.

The 110-second guided sequence compares four controlled releases. Manual trials run 12 seconds, can be paused or scrubbed, and record the displayed timestamp, mass, immersion, weight, buoyancy and bottom support. The report contains SI conversions, mass/weight substitution, partial-volume buoyancy and the relevant static or contact comparison.
