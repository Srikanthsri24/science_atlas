# CL-0048 — Compare equal-volume samples by density

In progress. This entry is not a completed/reviewed UI lab.

Original ideal investigation: two separate finite reference-liquid supplies each deliver the same target volume at 1 mL/s into identical internal-radius cylinders. The containers may have different empty masses. A virtual ideal balance reports container plus liquid; subtract that container's tare before comparing net liquid masses. Density is net mass divided by the same delivered volume. An empty sample has undefined inferred density, represented by null rather than zero or infinity.

Domain: common target 10–100 mL, chosen densities 0.7–1.5 g/mL, container tares 20–100 g, physical time 0–100 seconds. Cylinder radius 2 cm. No identification of particular commercial fluids is implied. These are chosen reference densities, not measured or calibrated material properties. Both source budgets conserve liquid mass separately. Equal-volume height comparison does not by itself measure density; the net mass reading supplies the second quantity.

The original 120-second guide holds empty-container identification for 15 seconds, transfers paired 80 mL samples for 80 seconds, and then compares the completed readings. The model is quasi-static: no splashing, jet inventory, evaporation, thermal expansion, balance response lag or physical measurement noise is solved. Ambient-pressure liquids, incompressibility and independent finite source inventories are assumptions.

Seven targeted tests pass: tare-only empty state/no zero-volume division; all volume/density/time corners; exact separate mass budgets; independent net-mass/volume reconstruction; reversal of gross ordering by container mass; volume scaling; complete valid guide; rejected invalid/coerced parameters. UI, geometry, notebook and browser review remain pending.

Next implementation: original paired digital-balance apparatus with growing equal-height liquid columns and falling finite source inventories; explicit A/B tags, gross/tare/net readouts, worked subtraction and density calculation. Read-first prediction, matched-volume trials, observation table, preserved written evidence and original exam-style HTML report. Do not suggest that an ideal display resolves real measurement uncertainty or represents manufacturer calibration.
