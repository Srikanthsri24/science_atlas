# CL-0024 · private engineering review notes

This is an editorial Class 2 investigation about choosing a container for its intended use. Advanced geometry/flow substitutions are teacher extensions. It is not verified board alignment or independent expert certification.

## Model

Matched cylinders: radius 2.5 cm, height 12 cm; capacity 235.619449 mL. Water starts at 50–200 mL. A stand holds the centre 8 cm above the catch tray and tilts linearly toward 0–100° during 20 s, then holds until 30 s. The sealed case has an ideal lid and no hole. The holed case is open to air, with a prescribed 1 mm base-hole radius.

For local coordinates (u,v,w), world vertical position relative to the cylinder centre is u sinθ + v cosθ. The liquid free plane is horizontal in world space. Integrate circular segment area along the cylinder axis to find volume below that plane; invert by 40 bisections for a given volume. Open-rim capacity uses the plane through the lowest rim point; capacity is zero at/above 90°. The independent small-angle result is πR²(H − R tanθ) until the liquid plane intersects the bottom; larger angles require the clipped-cylinder integral.

The base-hole model uses Q = C_d A_h sqrt(2 g h), with g = 981 cm/s², chosen C_d = 0.62 and current positive vertical head from the free surface to the hole. Midpoint integration uses 0.05 s steps. Rim overflow is removed separately. Retained + rim spill + base leak equals initial water at every sampled/interpolated time. A 20×15 cm collection area gives collected depth V/300 cm. The stream is a visual transfer cue, not water inventory in flight.

## Reference basis

TU Delft calculus teaching page, section Torricelli's law: https://tudelft.roelofkoekoek.nl/teaching/calculus/diffeq1/applications.html (accessed 2026-11-25). It supplies the ideal efflux law and cylindrical draining equation used for independent analytical validation. The discharge factor here is explicitly a chosen illustrative parameter, not sourced calibration. Original segment integration and renderer code are project work. No external reference links are shown in the product UI.

## Numerical/visual checks

Tests compare the volume integral with 12,000 independent midpoint slices, half-volume symmetry, known upright/small-angle volumes and inverse surface recovery. Upright hole drainage is checked against the analytical square-root-of-head solution (<0.001 mL difference). Conservation and nonnegative inventories cover every container type and boundary/sample conditions. A clipped 128-sided water mesh has outward winding and agrees with the circular volume to <0.12 mL in tested cases. Its cap and the 2D cutaway share the same plane, which rotates to a horizontal world plane. The mesh is a faceted approximation; readings use the circular integral.

## Limits

Slow-tilt quasistatic geometry only: no sloshing, fluid inertia, resolved viscosity, capillarity, jet flight, calibrated seal behavior or flexible walls. Small-hole timing is illustrative and does not predict every real cup. The ideal lid is watertight. These limits are present in the UI and exported practical report. The guide compares three identical 150 mL, 90° trials over 110 wall seconds, with 30-second model cases and a final explanation. Manual runs are 1× model time.
