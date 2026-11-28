# CL-0121 — Model electrolysis of water with gas-volume accounting

Planned next sequential investigation; no implementation or review claim.

Build an original virtual two-electrode water-electrolysis apparatus with separate hydrogen and oxygen collection tubes and finite charge accounting. Include an explicit supporting electrolyte assumption; do not imply pure water is a strong conductor. No real chemical experiment is performed. Do not use chloride electrolyte or depict chlorine generation in a water-only model.

Scientific model: supplied regulated DC current and elapsed time determine passed charge. Ideal Faradaic accounting gives n(H2)=Q/(2F), n(O2)=Q/(4F); use matching gas temperature/pressure for a 2:1 dry-gas volume comparison. State current efficiency assumptions, start/stop connection behavior, finite collection capacity and gas-overflow accounting. Bubbles are visual representations, never counted as molecules or used as a direct volume calibration. If wet gas is shown, either apply a documented water-vapour correction or label displayed volumes dry-equivalent; do not silently treat wet gas as dry. Avoid fabricated conductivity, electrode-overpotential or current-voltage predictions.

Learning sequence: identify electrodes and gas paths, connect a virtual source, observe both collections, compare charge/moles/volumes, vary a single parameter, pause and read a meniscus, calculate with units, conclude from the 2:1 relation. Provide >=150-second synchronized 2D/3D explanation, student controls, gas labels and safe virtual-only guidance.

Practical notebook: aim, apparatus, prediction, teacher-supervised real-lab safety note, procedure, time/current/charge/gas-volume observation tables, SI substitutions and worked mole/volume/ratio calculations, gas collection loss versus generated gas if capacity reached, result/conclusion/precautions, persisted records and original HTML export.

Gates: independently derive expected charge/moles/volume arithmetic and limiting cases; test zero-current/disconnected/paused states and material/charge conservation. Original apparatus geometry and visible volume levels must agree with model. Verify full guide playback in both modes, controls/native camera, six viewport sizes/both formats/normal and theatre, real notebook persistence/export, TypeScript/build/regression. Freeze internal review only when evidence passes; retain pending official curriculum mapping and no independent-expert claim.
