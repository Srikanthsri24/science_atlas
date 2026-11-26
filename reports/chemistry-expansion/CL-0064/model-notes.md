# CL-0064 — rust formation under water/oxygen conditions

Scientific core, reference phase geometry, practical records and original 2D/3D viewers are implemented;24 focused tests and2614 regression tests pass. Actual browser guides, records and responsive verification passed internal functional review.64/270 labs are reviewed; next publication75.

## Selected material reference

Four matched rigid cells:wet_oxygen,dry_oxygen,wet_reduced_oxygen,dry_reduced_oxygen. Initial iron0.05–0.3g, available wet-cell liquid0.001–2mL, chamber25–100mL, normalO2molefraction0.1–0.3,reducedO2fraction0–0.01,chosenrate0.1–0.6/day,attachedfraction0–1,time0–14days. Defaults0.15g/2mL/50mL/0.21/0/0.25perday/0.25attached. Equal iron,cavity,P,T andgas fractions; initial gas volume differs appropriately when liquid occupies the cell. Dry controls have zero modeled available water. Reduced-oxygen default is idealzero; chosen residual oxygen can demonstrate imperfect exclusion.

FeOOH-equivalent material reference:4Fe+3O2+2H2O→4FeOOH. Atom balanced, not an elementary mechanism or universal rust composition. Internally consistent molar masses55.845/31.998/18.015/88.851g/mol. Per moleFe reacted:0.75molO2 and0.5molwater enter1molFeOOH reference. BinaryO2/N2 ideal reference gas, inertN2molar28.014g/mol. Fixed25C,101.325kPainitial,R8.314462618kPaL/mol/K. Water-vapour/dissolved-O2 storage, heat, pH, electrochemical fields, anaerobic pathways and actual moisture/oxygen transport are omitted.

Capacity=min(initialFe,initialO2/0.75,initialWater/0.5); reactedFe=capacity*(−expm1(−k*t)). Stable limiting residues use (initial−coefficient*capacity)+coefficient*capacity*exp(−k*t). Chosen first-order capacity relaxation is not measured corrosion kinetics. Fe/O/H atom counts, mass, pressure and material partition close. Wholecellmass stays constant. All retained iron-containing phases gain incorporated O/H, but the attached coupon alone may lose mass when product separates into retained sediment. Do not call those the same measurement.

Attached/retained-sediment fraction is explicitly chosen, not observed/calibrated or protective-layer prediction. Both phases use chosen drawing density4.2g/mL; iron8,water1g/mL. These are reference geometry assumptions, not specimen measurements. Product4.2 is a rounded compact goethite-like reference consistent with the Handbook calculated density4.18; that source also lists measured4.28. It is not a measured density for the modeled rust mixture. The initial3g/mL drawing proposal was replaced before UI implementation to avoid overstating compact-phase expansion. Do not substitute unverified Oregon table numbers while keeping the model assumptions unchanged.

## Geometry

128polygon rigid cylindrical cell,radius1.2cm,bottomY0.5cm,cavityheight=cavityvolume/actualpolygonarea. Initial cylindrical iron wire/coupon length1cm, radius derived frominitialmetalvolume. CouponcentreY2cm. Core shrinks homothetically with remainingmetalvolume. Attached product is the difference of two nested closed homothetic cylinders; signedactualtriangles equal attachedproductvolume. Uniform retained-sediment bed at cellbottom, waterabovebed:separate full128polygon cylinders, no geometric volume overlap. This is not actual floc morphology or a settling solver.

Coupon stays above the liquid pool at every permitted corner; a zero-volume schematic wick connects availablewater to coupon in wet references. Wetting/film storage/transport not solved. Do not depict an unconnected dry coupon in water-rich air while implying fully immersed corrosion. Uniformgeometry and capillary connection are chosen visualization assumptions. Gas space=cellcavity−remainingmetal−attachedproduct−sediment−liquidwater; fixedT idealgas pressure uses currentgasvolume and remainingO2+inertmoles.

## Tests and remaining implementation

24 targeted model/geometry/record tests verify atom/mass closure across controls/corners, oxygen/iron/water limiting cases, residualO2, stablepositive tails, rate finite difference, currentgaspressure, phase redistribution without chemistry changes, allactualclosedtriangle volumes, separated water/sediment, coupon/containment, elapsedhistory and120secondguide timing. The working browser records have40 matched trials,23 columns and1160 independently reconstructed downloaded worked results; reload preserves all rows and writing exactly.

Guide implemented120s:10setup+100evolution0–14days+10hold. Only wet/oxygen-present default cell reacts; controls must stay correctly unchanged rather than acquire decorative motion. Need original2D/3Dcomparison/couponcrosssection viewers, physicallylinked rate markers, elapsedhistories, labels andscientificlimits. Working controls only. Add practicaltables, original worked formulas/substitutions/examreport, actual GUI evidence/export/persistence, bothactual120secondguides, independent geometry/responsive/keyboard/camera checks, regression/typecheck/build before markingready.

## Sources

Canadian Conservation Institute primary relevant text read: oxyhydroxide formation, separate corrosion products and moisture/oxygen qualifications. It supports the selected phase family, not the chosen rate or morphology. RSCfullretrieval returned405; search excerpts only. Oregon molar-volume table fullretrieval timedout; not claimed as fullyverified calibration. Physical oxygen/water exclusion can be imperfect; idealzero reference does not prove boiledwater is oxygenfree. Realrust is a mixture. Keep sourcesprivate; no external links in studentUI/export. Classplacementeditorial; formulasteacherextensions. Preserve earlier sourcehashes and146originalstagedblobs.
