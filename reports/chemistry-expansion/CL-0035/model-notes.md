# CL-0035 — Compare melting and dissolving (model checkpoint)

Two physically separate vessels prevent confusing salt dissolution with ice melting/freezing-point depression. Equal starting sample masses are5–20g. The left vessel starts with pure ice at0°C and receives heat from a maintained25°C bath through an explicitly chosen overall conductance0–0.4W/K. The right holds20–150g water at25°C and the same starting mass of sodium chloride, with a chosen still/stirred lumped relaxation rate0.004/0.012s⁻¹. These are not empirically calibrated comparative time measurements.

Use reference latent heat333.5J/g and liquid heat capacity4.18J/(g·K). While ice remains, P=H×25W, molten mass=min(m,Pt/L) and sample temperature0°C. Full-melt time=mL/(25H); H=0 has no finite completion time. Once all ice melts, liquid temperature is25[1−exp(−H(t−tm)/(mcp))]. Cumulative input heat is molten mass×L +mcpT; current heat flow isH(25−T). No vessel heat capacity, melting-front conduction or convection, evaporation, sensible warming of initially subzero ice or heat-transfer coefficient calibration is solved. Constant conductance despite changing sample geometry is a teaching approximation.

At25°C the rounded reference capacity is36g NaCl/100g water, deliberately not the often quoted20°C value35.9. Target dissolved mass=min(initial salt,0.36×water mass). Dissolved mass=target×[1−exp(−kt)] and remaining solid=initial−dissolved. The solution contains solvent plus dispersed sodium/chloride ions; the salt has not become molten salt. The two vessels conserve separate mass budgets. Dissolved mass is included in solution mass and cannot disappear. Finite-time results approach the chosen equilibrium target asymptotically. Saturated residual and stirring effects remain separate.

Worked substitutions distinguish grams salt per100g WATER from mass percent salt in SOLUTION, show the latent plateau and subsequent warming, retain tiny positive values in scientific notation, and identify advanced mathematics as a teacher extension. Initial reference densities0.917g/cm³ ice and2.16g/cm³ compact salt are geometry approximations; no additive solution-volume equation is assumed. Dissolution enthalpy is not solved; an external thermostat maintains the solution temperature.

The110s explanation stages10s preparation,80s advancing900model seconds at11.25×, then20s conclusions. Manual time is intended to be1×. The interface, geometry, practical record, actual animations, responsive checks and final review remain incomplete. Seven model tests passed, including independent numerical enthalpy and dissolved-mass integration, phase-boundary continuity, both mass budgets, isolation control, saturation/residual, denominators, guide and invalid inputs. This does not count as a completed lab.

## Private development provenance

- American Chemical Society, original pedagogical checks for phase change and salt dissolution: https://www.acs.org/middleschoolchemistry/lessonplans/chapter2/lesson5.html and https://www.acs.org/middleschoolchemistry/lessonplans/chapter5/lesson3.html . Used for factual cross-checking; no passage, media, asset or teaching worksheet copied.
- PubChem Sodium Chloride, solubility reference36.0g/100g water at25°C: https://pubchem.ncbi.nlm.nih.gov/compound/5234 .
- USACE engineering-manual reference, fusion333.5kJ/kg: https://www.publications.usace.army.mil/Portals/76/Publications/EngineerManuals/EM_1110-2-1406.pdf . The search-indexed primary-source table supplied the value; directPDF retrieval returned403 and the full document was not inspected.
- USGS qualitative phase/density check: https://www.usgs.gov/water-science-school/science/water-density . Rounded heat capacity and geometry densities are declared reference approximations, not inferred empirical measurements.

Equations, relaxation law choices, explanations and code are original. These private provenance links must not enter product UI/student report exports. Editorial Class3 placement does not imply verified official board mapping.

## Implementation under browser review

Original2D/3D comparison bench and practical/report interface now exist. The left4×4cm interior contains a uniformly shrinking reference ice cube. Before flotation the supported cube excludes its footprint from the water; after flotation the displaced volume equals remaining ice mass at reference water density1g/cm³. Water is rendered as non-overlapping rectangular volumes around/below the cube. Independent tests verify water volume, ice mass, no intersection and a continuous support-to-flotation boundary.

The right has60 equal model cubic grains on an8×8 grid with the four centre sites omitted. Their total compact solid volume equals undissolved mass divided by the declared reference salt density. Worst-case grain sizes fit under the minimum reference fill, remain separated, stay inside the vessel and clear the rotating central stirrer. The solution fill is deliberately labelled schematic: no partial-volume/density relation is used for solution volume. No coloured dissolved-salt particles or resolved vortex is implied.

Students can select both vessels, isolated ice, isolated salt grains and an overhead camera. The canvas is separate from the wrapping measurement panel. Phone theatre captions have a30dvh scroll limit.2D front views show8 front grains from the60-site3D specimen. All camera/view changes preserve model time; observations and report data depend on the physical settings/time, not the camera.

Fourteen targeted tests now pass (seven model plus seven geometry/record/report checks),331 chemistry tests and2021 full regression tests pass. Browser playback, controls, tables, report download, persistence and responsive review are in progress. The lab is not yet marked reviewed.

## Final internal review

The historical model-only/in-progress statements above are superseded by review.json. Both110s guides completed,18 actual GUI records and the downloaded per-trial report were independently checked,14 rendered mass closures agreed, notes survived reload, and57 final viewport/format/measurement checks passed. Long calculation wrapping and short-screen/collapsible measurement layouts were corrected during review. Source dependencies are hashed in the final report. This remains an internal functional/model-consistency review, not independent expert or official-board certification.
