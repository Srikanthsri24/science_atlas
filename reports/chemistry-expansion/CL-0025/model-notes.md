# CL-0025 · model foundation (not a completed lab review)

Class 3 editorial investigation: compare arrangement, spacing and motion. Three separate, prescribed illustrative samples each contain 64 equal-radius representative particles. This is not a substance-specific heating/cooling or phase-transition calculation.

## Units and assumptions

Particle radius 0.45 reduced length units u; equal mass 1 reduced mass unit m*. Dense/solid region side 4.4 u; dilute gas region side 12 u. Values are chosen teaching scales. Presentation seconds map to reduced model time τ for playback convenience; they are not physical molecular seconds. The same sphere radius in every case prevents the misconception that particles themselves expand to make a gas.

The crystalline solid has 4×4×4 fixed anchors with spacing 1.1 u, independent coordinate oscillations of amplitude 0.035 u and angular frequency 1.7/τ. Its kinetic plus harmonic tether energy is conserved. The solid example shows that fixed arrangement permits vibration; it is not a claim that every solid is crystalline.

The dense and dilute samples use equal-mass hard-sphere elastic collisions. Reflecting prescribed boundaries confine the samples. The dense region substitutes for cohesion; molecular attraction, evaporation, free-surface dynamics and phase equilibrium are not solved. The liquid demonstration is therefore an explicitly limited particle-motion analogy, not a predictive liquid simulation. Dense-sample neighbours actually change during the trajectory. RMS speeds are chosen as 0.65 and 2 u/τ, respectively; changing case is not a calculated temperature change.

Time integration: four 1/240 τ drift/collision steps for each of 1801 saved 60 Hz frames over 30 presentation seconds. Overlaps are corrected symmetrically, with equal-mass normal impulses only for approaching pairs, and reflecting boundaries after each collision-resolution pass. Three resolution passes handle coupled contacts. The initial dense sample is warmed for 5 τ to remove its initial lattice ordering. Trajectories are seeded, deterministic and protected against mutation through returned render data.

## Evidence

Six passing model tests cover count/radius identity, chosen number-density and occupied-volume substitutions, dilute/dense spacing contrast, total oscillator energy, fixed-site solid motion, actual liquid neighbour exchange, displacement definition and deterministic replay. Every stored dense/gas frame was checked for kinetic-energy conservation to 1e−8 reduced energy units and centre separation ≥0.9 − 1e−4 u. Initial close-neighbour cutoff is a teaching measurement of 1.4 u, not a chemical-bond definition. Neighbours that cease to be close are not necessarily broken bonds.

## Private source basis

OpenStax Chemistry, 10.1 Intermolecular Forces: https://openstax.org/books/chemistry/pages/10-1-intermolecular-forces (accessed 2026-11-25). Used to cross-check the qualitative distinctions between fixed-site vibration, close but changing liquid neighbours and dilute independent gas motion. The arbitrary scales and hard-sphere implementation are original project choices, not sourced measurements. Reference links are not part of the product UI.

No completed-lab, official-board or independent expert-review claim is made at this model-only stage.

## Completed viewer and record review

The working 2D/3D viewers now expose all 64 particles, with 16 tracers emphasized in the 2D projection. A motion microscope scales the actual recent XY path; the 3D gold outline locates a selected particle through occlusion. Direction arrows are normalized guides, not speed measurements. Fitted/common scale and camera reset leave scientific readings unchanged. The complete 110-second guide, live manual observation, 0.5×/1×/2× playback, ten GUI observations, report download and persisted notes were checked. Both viewer types were reviewed at phone/tablet/laptop/TV viewport sizes. See review.json for final source hashes and scope.
