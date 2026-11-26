# CL-0043 — Recover dissolved salt by evaporation

## Model-only development checkpoint — not a reviewed browser lab
Start with100g reference water and5–25g fully dissolved sodium chloride at fixed25°C. A prescribed effective drying coefficient k=0.0002–0.0012s⁻¹ gives W=100exp(−kt)g over0–7200 physical seconds. It is an original declining-rate teaching model, not measured airflow, humidity, heater power or calibrated crystallization kinetics. Water transferred to the atmosphere is100−W; no salt volatility, aerosol entrainment or chemical decomposition is included.

Chosen rounded reference capacity is0.36g NaCl per gram remaining water, consistent in scale with room-temperature saturation. Dissolved D=min(S,0.36W); crystalline C=S−D. Equilibrium is assumed instantaneous; no supersaturation, nucleation delay, impure mixed salts or kinetic growth-law calibration. Saturation onset t*=ln(36/S)/k. Below onset the solution concentrates without crystals. Beyond onset decreasing water lowers dissolved capacity, so crystalline mass grows. Water, dissolved salt, crystals and cumulative transferred vapour must all be accounted. Wet dish contents=W+S; this is not dry recovered salt. No finite supported time removes every gram of water.

Volume approximation, used only for visualization: chosen solution densityρ=1+0.75w g/mL where w=D/(W+D). This is not a fitted density table. Crystalline density uses2.165g/cm³ reference.25 original ideal cubic growth sites on a5×5 grid divide solid volume equally; their count and equal growth are assumptions, not a nucleation prediction. Cubes do not overlap and all corners fit the4cm-radius dish. Liquid height solves A h−N e²min(h,e)=Vsolution, excluding immersed solid. Thus exposed crystals can rise above a residual mother-liquor puddle without inventing liquid volume. All phase masses remain authoritative; no additive water-plus-dissolved-solid volume claim.

Planned120s guide spans7200 physical seconds, showing concentration, onset, crystal growth and a still-wet residue. Manual clock1×; guide compression explicit. Class4 core: observation, salt/water conservation and a conclusion; exponential rate and volume corrections are teacher extensions.

## Private research notes, accessed2026-11-26
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9156811/ — primary research, Water Dynamics in Highly Concentrated Salt Solutions,2022. Table2 gives approximate NaCl saturation concentration and molality; discussion describes weak temperature dependence over288–310K. Supports the room-temperature scale and the need to distinguish dissolved ionic species. It is not a calibration of this drying model or its density approximation.
- https://srdata.nist.gov/solubility/IUPAC/SDS-47/SDS-47.pdf — official IUPAC–NIST compilation located. Browser text fetch exceeded its content limit; full table review was not completed. Do not label the chosen0.36 reference as an extracted certified value.

Public interface/report will use original company explanations without external reference links. Official curriculum mapping, independent expert review and calibrated real-salt/drying behaviour remain unverified.
