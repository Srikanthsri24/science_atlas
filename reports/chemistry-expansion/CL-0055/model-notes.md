# CL-0055 — Distinguish reversible and irreversible material changes

In progress: core model only. Thirteen targeted tests pass. UI, geometry, notebook/report integration, actual guide playback and responsive browser review remain incomplete. Do not mark ready.

## Learning distinction

Classroom restoration under a specified operation is different from universal thermodynamic reversibility. Three original investigations will compare:

1. Pure ice at0°C melts under imposed latent energy and refreezes after equal latent energy removal. The material andsolid phase are restored; identical microscopic structure andperfect thermodynamic reversibility are not claimed.
2. Straight cuts in a paper sheet create separate pieces without introducing a new substance. Returning the fragments to alignment doesnot reconnect the cut fibres. This is a physical change that isnot reversed bythe specified classroom operation.
3. Sodium bicarbonate and aqueous acetic acid form dissolved sodium acetate,water andcarbon dioxide. Stopping stirring andreturning the tool doesnot regenerate reactants. This classroom test doesnot claim that chemical synthesis orreaction reversal isimpossible under every conceivable condition.

Classification should be a student prediction checked against observations,not an unexplained completion badge. Do not equate every physical change withreversible or every chemical change withuniversallyirreversible.

## Inputs and models

Common progress0–2:forward fraction=min(1,p);return=max(0,p−1). A return cannot occur before the full forward stage. Inputs are finite andstrictly typed;ice10–100g,paper1–5g,integercuts1–5,bicarbonate1–5g,aceticacid20–100mmol. The sample selector starts a fresh procedure;other sample-specific controls can retain their settings.

Ice:chosen rounded latent heat334J/g,densities ice0.917 andwater0.9998g/cm³. Supply Q=mLf then remove the same energy according toreturnfraction. Temperature is0°C throughout this pure-material phase-boundary model. No sensible heating,supercooling,heatloss,thermal-rate prediction orentropy/thermodynamic-reversibility calculation. Geometry must allow density-dependent volume changes;do not draw equal liquid andice volumes for equal masses.

Paper:10×10cm reference sheet,density0.8g/cm³ andthickness=mass/(density×100cm²). Prescribed straight cuts each10cm long. Completed full cuts increase fragment count;partial cuts alter cut length butnot completed-piece count. Two new cut-edge faces give area2×cutlength×thickness. No fracture mechanics,cutting force orenergy model. Returnalignment closes visible gaps butseams mustremain. Do not redraw an intact sheet aftercuts.

Reaction:CH3COOH+NaHCO3→CH3COONa+H2O+CO2. Starting acetic solution mass100g INCLUDES the acetic acid. Solvent water=100−acidmass,not another100g added toacid. Rounded internally consistent molar masses use Na22.990,C12.011,H1.008,O15.999:NaHCO3 84.006,aceticacid60.052,sodiumacetate82.034,water18.015 andCO2 44.009g/mol. Both reaction sides sum144.058g/mol. Extent=min(initialreactantmoles)×forwardfraction. Preserve every remaining reactant andformed product in the mass ledger.

Reference gas collector is ideal dryCO2 at298.15K and101325Pa withR8.314462618J/(molK),V=nRT/P. This is an ideal drygas equivalent,not a balloonelasticity orreal aqueous gas-yield calibration. All producedCO2 isassigned tothe collector;no CO2 dissolution,water vapour,initial air,deadvolume,leakage orfinitecollector resistance. A frictionless constant-pressure virtual collector remains inside the CLOSED MASS boundary. The system isnot thermally isolated;no reactionenthalpy/temperature/heatbudget prediction. Condensed mass+collectorCO2=initial bicarbonate+100g solution. Do not call gas disappearance fromthe liquid missing mass. No rigid sealedpressure-vessel experiment instructions.

## Guide plan

120 seconds:three40-second demonstrations. Each has4s setup,16s forward,16s return attempt and4s observation hold. Automatic sample switches at40/80s. Final endpoint isreaction/progress2. Ice phase changes,paper cutter/fragments andreaction product/collector movements must be original andclear inboth2D/3D. Tool return isnot reaction reversal;do not animate products turning back into reactants. Actual complete playback,pause/record behaviour andallrenderedviews mustbe tested before ready.

## Private primary references

Checked2026-11-26 using primary ACS educational search results:
- https://www.acs.org/content/dam/acsorg/msc/downloads/chapter-6/lesson-2/ch6-l2-activity-sheet.pdf
- https://www.acs.org/content/dam/acsorg/msc/downloads/chapter-6/lesson-2/ch6-l2-activity-sheet-answers.pdf
- https://www.acs.org/education/resources/k-8/inquiryinaction/fifth-grade/chapter-3/baking-soda-vs-baking-powder.html
ACS supports the reaction/product identities andCO2 observations. These references do not certify thechosen extent interpolation,gas-recovery assumptions,geometry parameters orofficialboard classmapping. Use original educational text;keep external reference links inprivate engineering notes,not studentUI/report. Modelmath is independentlytested;independent expert review isnot claimed.


## Completed internal review
The historical core-only checkpoint above is superseded. Original three-experiment2D/3D UI,23 targetedtests,2400 fullregression,TypeScript/latestbuild,120s actualguides,37 actualGUItrials and509 independentlychecked exportedworkedresults passed.68 SVGstates,70 3D readouts and102 responsivecases checked. Exactsavedwriting/observations afterreload;threepredictionoutcomes andwrong-paper correction checked. Ice liquid geometry excludesimmersedcube;labeltextures nowfitmeasuredtext. See review.json forscope,chosenreferences andlimitations. No independentexpert orofficialboard claim.
