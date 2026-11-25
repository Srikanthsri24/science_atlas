# CL-0006 — Flexible and rigid strip comparison

The original teaching examples compare identical cantilever strips: length 100 mm, width 20 mm and thickness 4 mm. Chosen elastic moduli are 50 MPa for a flexible-polymer model, 10 GPa for a wood-strip model and 200 GPa for a steel-strip model. These are illustrative values, not material certifications.

An added mass of 0–8 g represents a tip force F = m g, with g approximated as 9.81 m/s². I = b t³ / 12; incremental deflection y(x) = F x²(3L − x)/(6EI); free-end deflection = FL³/(3EI). Stress and ideal elastic work are also computed with SI units. At the largest allowed load the most flexible example remains below 5% relative tip deflection and 0.3% maximum bending strain.

Bending is incremental relative to the unloaded reference. Self-weight baseline, clamp compliance, viscoelastic creep, yielding, shear deformation, torsion and dynamic oscillation are excluded. This is a small-deflection, linear, quasi-static model. No specimen is described as perfectly rigid.

A planned 110-second guide loads, holds and unloads all three strips at equal conditions. Visual deflection magnification will be explicit. Five tests pass: independent SI substitution, shape and clamp boundaries, inverse stiffness and elastic work, invalid inputs and loading/unloading stages. Apparatus, practical record and responsive review remain in progress.
