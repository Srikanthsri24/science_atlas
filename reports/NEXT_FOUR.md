# Science Atlas 360° · Batch two / v0.3

Added four frontend experiences alongside the six approved experiences. No backend or AI service was introduced. Existing lesson IDs and browser progress format remain unchanged. The dashboard, collection, progress denominator and concept availability links now derive from the ten-lesson registry. The original 408-concept inventory and its official-mapping status remain unchanged.

## Experiences

1. **Powered by sunlight** (`photosynthesis`): original chloroplast cutaway, double envelope, thylakoid stacks and stroma/Calvin-cycle schematic; symbolic water, carbon, energy and product routes. Adjustable photon flux, CO₂ and water availability drive a bounded dimensionless gross-capacity teaching index. It is not a calibrated photosynthesis rate, growth prediction, quantum efficiency, or net oxygen measurement. Temperature, species variation, respiration and biochemical kinetics are omitted. Guided content distinguishes oxygen from water, ATP/NADPH intermediates, G3P and carbon fixation.
2. **Every breath, explained** (`breathing`): original interpretive lung surfaces, lobe/fissure cues, tracheal cartilage, branching airways, rib outlines, moving diaphragm and an enlarged alveolar inset. A prescribed sinusoidal tidal-volume waveform determines flow; linear airway resistance determines the pressure drop needed for that prescribed movement. Rate, volume and resistance are adjustable. Minute ventilation includes dead space and is not alveolar ventilation. This does not model compliance feedback, oxygen saturation, gas diffusion or patient physiology.
3. **The science of staying afloat** (`buoyancy`): supported immersion and free release of a rigid cube in a fixed-level tank. Archimedean buoyancy, weight, displaced volume and upward support/downward restraint are explicit. A deterministic 1D damped release settles a light block or stops a dense block at the floor with a normal reaction. Drag is illustrative; capillarity, waves, added mass and detailed turbulence are omitted. Force-vector lengths are adjusted for readability; numerical values are shown.
4. **Opposites build a crystal** (`ionic`): exact school-level shell bookkeeping for neutral Na/Cl and Na⁺/Cl⁻, an isolated-ion pair potential with Coulomb attraction plus illustrative r⁻⁹ repulsion, and a charge-balanced 4×4×4 rock-salt fragment. The central interior Cl⁻ has six Na⁺ nearest neighbours. The selected pair potential has its minimum at 0.282 nm; it is not total lattice energy or neutral-atom reaction energetics. Electron paths and sizes are schematic. Static ion controls have no nonfunctional playback button; the guided timeline changes ion state, pair spacing and lattice mode.

Each has an original explanation, terminology, objectives, misconception, investigation, source, three-question quiz, 2D/3D views, a five-chapter synchronized explanation, contextual inspection, notes/bookmarks and explicit completion. Scientific review remains pending; editorial class ranges are not verified board mappings. The illustrations and models are original educational interpretations rather than licensed anatomical scans or calibrated biochemical solvers.

## References

- [OpenStax Biology 2e: Overview of Photosynthesis](#company)
- [OpenStax Anatomy and Physiology 2e: The Process of Breathing](#company)
- [OpenStax College Physics 2e: Archimedes’ Principle](#company)
- [OpenStax Chemistry 2e: Ionic Bonding](#company)

These sources support the principles; they do not endorse or independently review the implementation.

## Validation

Twenty-one automated tests pass. New checks cover limiting inputs and saturation, breath volume derivatives/flow/pressure and resistance response, displaced-fluid forces and restraint direction, floating equilibrium and floor support, solver stability across exposed control limits, the pair-potential minimum and negative energy gradient, charge-balanced lattice coordination, invalid inputs and new content/quiz integrity. The deterministic chapter-boundary test now covers all ten stories. TypeScript compiles; the production build is generated. Inventory validation is run without changing legacy data.

Browser observations so far: chloroplast 3D and 2D rendered; light set to zero produced a 0.0% gross-capacity index. Breathing 3D rendered and playback changed volume, airflow and pressure consistently (one observed frame: 0.099 L, 0.250 L/s, −0.50 cmH₂O at R=2). The 2D breathing guided conclusion correctly distinguished total minute ventilation from alveolar ventilation. Free buoyancy release settled at 70.0% immersion with W = Fᵦ = 6.87 N; a guided dense-block final frame retained 9.81 N buoyancy and added 3.92 N floor reaction. The 3D tank rendered with support and force arrows. Ionic formation displayed 10+18 electrons, zero total charge, U = −3.191 eV and attractive pair force at 0.450 nm; lattice mode rendered 64 ions with six-neighbour coordination and charge balance. Guided lattice and sinking-block end states matched their captions. A new buoyancy quiz scored 100%, and completion was reflected in the ten-lesson progress page.

The in-app browser automation timed out and reset during a rendering test; subsequent verification continued in Chrome. Some navigation/CDP calls timed out during initial 3D loading, then the rendered page was verified through fresh accessibility state and screenshots. Do not infer a complete cross-browser/device or performance certification from these checks. Narration, snapshots, fullscreen and touch remain subject to the previously documented limits.

Additional verified UI checks: the new buoyancy assessment scored 100%; explicit completion appeared in a progress dashboard whose denominator is ten. The dashboard stat displayed ten interactive experiences and the four new thumbnail cards. Existing prior lesson completion remained present in that QA browser. A screenshot is saved as `next-four-preview.png`. The breathing guided final caption states 6 L/min at 12 breaths/min × 0.5 L and notes dead-space ventilation.
