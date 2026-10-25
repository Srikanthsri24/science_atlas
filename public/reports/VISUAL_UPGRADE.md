# Science studio and guided explanations · v0.2

This update concentrates on the six existing experiences. It adds no backend, AI dependency, or new curriculum claims.

## What changed

The prior caption-over-still-illustration player has been replaced with one deterministic timeline shared by the model, focused structure, chapter list, captions and progress. Each sequence has four to six authored chapters, observation prompts, a pause-and-think question, formula context where useful, and a direct handoff to the experiment. Playback starts paused. Chapter durations allow reading time; playback speed, previous/next, replay and exact scrubbing use the same clock. Inspecting an object pauses playback and opens its explanation. Optional browser/device narration reads the current caption; it restarts after a seek or pause. Narration quality and availability depend on installed voices; it is not prerecorded audio.

Both modes now use a dark scientific stage with readable annotations and structure inspection. The 2D view supports 1–3× magnification with bounded drag/touch/keyboard panning and view reset; SVG snapshots preserve text styling. All six experiences have 2D and 3D views. Cells and the solar system open in 3D where WebGL 2 is available. 3D supports orbit, pan, zoom, front/top/perspective presets, camera reset, scientific-label toggle, snapshots and fullscreen. Rendering is on demand; scene time advances at a maximum 30 updates per second only during playback. The clock freezes while the browser tab is hidden.

- **Cell:** Open membrane and nuclear envelope, chromatin, nucleolus, rough ER with ribosome markers, folded mitochondrial cristae, stacked Golgi sacs and vesicles. A representative secreted-protein sequence follows membrane exchange, mRNA instructions, translation, ER→Golgi cargo, exocytosis and mitochondrial ATP context. Geometry and trafficking are original interpretive models, not microscopy, anatomy scans or biochemical kinetics.
- **Pendulum:** Physical stand, string and metallic bob; force/velocity arrows and energy bars in 2D. Length, gravity, release angle, mass and viscous damping are adjustable. The underdamped linear small-angle solution starts from rest; energy uses its consistent quadratic potential. Mass changes energy but not period. Angles are constrained to 2–15°.
- **Circuit:** Battery, movable open/closed switch, ceramic resistor, wires and conventional-current markers. The open path has zero steady current. Live current and power follow Ohm’s law; qualitative resistor glow indicates power rather than temperature. Charge is not consumed. No colour-code resistance claim is made for the decorative ceramic grooves.
- **Atom:** Separate proton/neutron clusters, two shell envelopes, correct 2/1, 2/4 or 2/7 occupancy and explicit charge/particle legends. Lithium-6, carbon-12 and fluorine-18 are represented with equal proton/neutron counts. Paths remain symbolic; this does not compute atomic orbitals.
- **Solar system:** Original procedural planet textures, gas-giant bands, Saturn particle-ring interpretation, solar illumination and eight circular orbital paths. Approximate sidereal periods preserve relative angular motion. Distances and body sizes are independently compressed, spin is illustrative and positions are not an ephemeris. Textures are not geographic maps or measured imagery.
- **Optics:** Incident/reflected/transmitted branches, normal and angle arcs, moving wavefront markers, material presets, refracted angle and critical angle. Snell’s law and unpolarized Fresnel equations determine directions and lossless power fractions. Equal indices remove the reflected branch; total internal reflection removes the transmitted branch. Evanescent fields and absorption are omitted.

3D dependencies are now actually lazy: the root HTML preloads React, while Three/R3F loads only on opening the 3D studio. Drei has been removed from this project's dependencies. The 3D vendor chunk remains about 896 KB uncompressed / 240 KB gzip; further optimization for older devices is possible.

## Scientific references

- [OpenStax: Pendulums](https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums)
- [OpenStax: Damped oscillations](https://openstax.org/books/university-physics-volume-1/pages/15-5-damped-oscillations)
- [OpenStax: Refraction](https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction)
- [OpenStax: Eukaryotic cells](https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells)
- [NASA: About the planets](https://science.nasa.gov/solar-system/planets/)

Sources support principles; they do not constitute independent review or endorsement of the software. All authored lesson review status remains pending expert review.

## Validation

Twelve automated tests cover the previous models and backups plus pendulum turning points/energy transfer/conservation/damping, mass independence, Fresnel power conservation and normal incidence, orbital periods, every story's boundaries/deterministic state, and actual circuit/optics parameter changes under guided playback. TypeScript and production builds are checked. Browser results are recorded below after verification.

### Browser verification results

- Production Chrome: all six experiences rendered their SVG diagram and an active 3D canvas; no console errors were recorded during the six-scene pass. Cell cutaways were visually inspected to confirm exposed mitochondrial folds, chromatin/nucleolus, ER and Golgi stacks.
- Pendulum: play advanced time, pause worked, changing length reset the release to rest; 4 m displayed a 4.01 s small-angle period. Camera presets rendered the physical bench.
- Refraction guided player: seeking to the final frame changed the same ray model to n1=1.5/n2=1 at 65°, with no transmitted ray, 100% reflected power and 0% transmitted power. The active chapter, caption, focus and replay state changed together. Replay returned to 0 seconds; playback advanced to 7.14 seconds before pause. The embedded question revealed the correct normal-angle explanation.
- Independent in-app preview: diagram zoom showed 125%; reset returned to the original view. Playback advanced from 0.17 to 5.04 seconds before pause, and the paused slider value remained unchanged across later tool calls.
- 390 px viewport: page width remained 390 px, the sidebar settled fully offscreen, and the player controls/captions/chapter list fitted the mobile layout. A screenshot captured before the sidebar CSS transition had settled showed an intermediate state; the subsequent layout geometry and settled screenshot were correct. Viewport override was reset afterward.
- Optional device narration controls are present, but audible voice quality, timing on all installed voices, downloadable snapshots, fullscreen and touch gestures were not exhaustively tested. No claim of complete cross-browser/device validation or expert scientific certification is made.

Screenshots saved alongside this report show the upgraded cell explanation and studio.
