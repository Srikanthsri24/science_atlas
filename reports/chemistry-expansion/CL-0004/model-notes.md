# CL-0004 — Water absorption and retained mass

The investigation compares three specified virtual samples: paper, cloth and plastic. Model parameters are original teaching examples, not calibrated measurements or universal material properties.

Water retained after the same short draining protocol is W = min(V₀, m C [1 − exp(−kt)]), where V₀ is available water (mL), m is dry mass (g), C is a chosen specific capacity (mL/g) and k is a rate constant (s⁻¹). Paper uses C = 3 and k = 0.06; cloth uses C = 2 and k = 0.025; the chosen short-test plastic model uses C = 0 and k = 0. Retained water is bounded by available water and sample capacity.

With the density approximation ρ = 1 g/mL, wet mass = dry mass + ρW. Percentage uptake = 100 × (wet mass − dry mass) / dry mass. The model accepts 0.5–5 g dry mass, 0–30 mL water and 0–180 s. These equations are optional teacher-extension material; the child-level task is to compare observations and mass gain.

The 110-second storyboard starts with dry weighing, then uses separate lower, soak, drain and wet-weigh phases for each sample. Each staged soak represents 60 seconds. Wet weighing occurs after the drain phase, never while the specimen is immersed. Final comparison distinguishes retained water from through-sheet leakage in CL-0003.

Excluded: swelling, evaporation, dissolution, loose surface droplets, temperature effects, detailed pore flow and balances with measurement noise. No result is a real-material certification. Ten model, record and movement tests pass. Topic-specific apparatus, manual workflow, four observation trials, report calculations and four responsive viewport sizes have passed internal functional review; see review.json. This is not independent scientific certification.

The manual workflow locks recording until the drained specimen rests on the pan. Sample placement follows the water surface schematically; buoyancy and displaced-water volume are not solved. An empty-bath control explicitly identifies that no water is available and renders no draining drops. Report records preserve each trial’s actual parameter set.
