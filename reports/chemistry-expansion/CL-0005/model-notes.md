# CL-0005 — Surface texture and controlled line scans

Three original synthetic surfaces represent polished-glass, wood-grain and abrasive-sheet examples. Coordinates span 0–10 mm in x and z; heights are in micrometres. No real specimen measurement, friction, tactile sensation or standards-compliant filtering is claimed.

The glass and wood examples use specified smooth periodic height functions. The abrasive example uses deterministic jittered, rotated elliptical grain caps with chosen amplitudes and widths. It is an irregular teaching topography, not a calibrated abrasive material. The bounded height function is shared by the 3D mesh, ideal point probe, 2D section and acquired trace.

A profile contains 101 equally spaced readings over 10 mm: spacing = 10 / (101 − 1) = 0.10 mm. The mean line is removed before calculating mean absolute deviation, RMS deviation and peak-to-valley height. One profile samples one line; direction and position can change the result. Relative grouping has no universal numerical cutoff.

Horizontal rendering scale is 0.3 scene units/mm and vertical height scale is 0.015 scene units/μm, giving 50× relative vertical exaggeration. The mesh samples the analytic field on a grid; it is a rendering approximation. Needle geometry is schematic and no tip convolution is solved.

The 110-second guide includes introduction, three 25-second scans, completed hold states and comparison. Manual scans can run for 25 seconds or explicitly advance the model without waiting. Partial records are locked. Fullscreen guide and experiment pause/resume controls, replay and Escape exit are functional.

Nine model/record tests pass. Five controlled and directional/location comparisons, 505 exported raw readings, formula substitutions, reload persistence, both viewer modes and four responsive viewport sizes passed internal functional review. This is not independent expert certification or official board mapping.
