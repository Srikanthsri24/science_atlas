# CL-0054 — Plan a separation sequence for a three-component mixture

In progress. Core model, geometry specification and practical report have19 passing targeted tests. Original apparatus UI, actual playback and browser review are still pending; this lab is not ready.

## Procedure and scientific scope
Dry-first teaching protocol: magnet → add water/stir → filter → evaporate filtrate. Plan feedback explains this selected protocol rather than claiming every other order is physically impossible. Selective ideal iron pickup, all undissolved grains retained, lossless transfers, immediate drainage and no liquid retained by paper/residue. No corrosion, adsorption or selective membrane model.

Default5g iron,10g sand,5g NaCl and50g reserved water. Bounds:iron1–10g,sand5–20g,salt1–15g,water5–100g. The whole-system boundary includes reserved water BEFORE addition and water transferred to air AFTER evaporation. Each of the four component masses closes separately.

Rounded chosen isothermal25°C capacity0.36g NaCl pergramwater, consistent with the earlier salt-recovery reference model. Stageprogress0–4 is prescribed procedure interpolation,not physical time,measured dissolution/evaporation kinetics orheater/energy prediction. Guide120s:10s setup,25s perstage,10s conclusion. Exact dry endpoint atprogress4 is a chosen procedural state,not predicted finite physical drying time. No thermal-solubility orsupersaturation model. Clearly label this when implementing UI.

With insufficient water, undissolved salt enters the filter residue with sand. Example15g salt/5g water dissolves1.8g,leaves13.2g salt in filter residue,andrecovers12% ofinitial salt asdishcrystals atdryendpoint. Do not label this residue pure sand orclaim100% salt recovery.

Reference geometry uses waterdensity0.997g/cm³,iron7.87,quartz2.65,NaClcrystal2.165 andchosen drybulkporosity0.4. Dissolvedsalt partial volume0.30cm³/g is an explicit chosen approximation for drawing only,not an experimentally measured solution equation. Geometry never changes component mass ledger. Low liquid can occupy grain-bed voids:occupiedheight=max(drybulkvolume,grainvolume+solutionvolume)/area. Referencegeometry andrepresentative markers mustbe labelled;no measured graincount/rate claim.

Practical record:23 columns and23 worked formula/substitution/result steps pertrial. Distinguish dry tare from wetdish contents andseparate salt recovery from sandresidue purity. Sanitizer excludes invalid savedstates,keepslatest60,boundswriting,escapesHTML andomits external links from studentreport.

## Private engineering references
Checked2026-11-26 using primary educational search results:
- https://edu.rsc.org/experiments/separating-sand-and-salt-by-filtering-and-evaporation/386.article — primary RSC/Nuffield activity supports dissolving salt,filtering sand andevaporating filtrate;no proprietary wording copied.
- https://sites.tufts.edu/middleschoolcheme/2020/06/19/separations-activity/ — university separation activity includes measuring starting iron,sand,salt andmagnetic separation.
- https://www.gvsu.edu/cms4/asset/DE36066F-E528-CF94-8F079306A8293D59/model_lesson.pdf — university lesson lists a separation flowchart.
These support methodselection,not model interpolation rates,apparatus calibration,officialboard chapter mappings orindependentexpert certification. Reference capacity/geometry are chosen teachingapproximations documented separately. Retain references inprivate engineering records,not studentUI/report.


## Completed internal review
Original four-station2D/3D UI,planeditor,120s guides and23-column/23-calculation notebook implemented.20 targeted and2377 totaltests,TypeScript andlatestbuild passed.32 actual GUI trials,736 independentlychecked exportedresults andexactreloadpersistence.101 SVG states,50 3D readouts and126 parameter/layout cases checked. Printed observations splitinto3 tables. Exactconical filterpile replaced earlierconstantarea specification;diagram100% fitswithworking100–300%zoom;shorttheatreminimumfixed. See review.json forscope andlimitations. No independentexpert orofficialboard claim.
