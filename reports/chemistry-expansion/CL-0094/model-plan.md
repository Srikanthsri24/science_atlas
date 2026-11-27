# CL-0094 · Compare turmeric-indicator responses

In progress:core and practical report implemented;geometry,viewers and browser review still pending.

Use original turmeric-dyed coupons or indicator reference wells,with acid,base and water controls. Show that yellow alone cannot distinguish an acid from a neutral reference. Include a controlled base-then-acid reversal investigation if the finite reagent/film budget is independently validated. This should be a different apparatus from the litmus strips:round reference wells,dyed fibre/film detail,and a metered reversal station.

PrimaryACSeducation supports yellow in acid/neutral conditions and red/orange in sufficiently basic conditions,and notes curcumin's poor water solubility. Start from an explicitly prepared indicator coupon/reference;do not claim that arbitrary turmeric powder dissolves completely in water. Do not copy external recipes,illustrations or exact sample quantities. Avoid an unsupported singlepKa/RGB-to-pH calibration. Transition shades/verynear-neutral cases need an unresolved option;the colour chart is not an exact instrument.

Candidate calculation model:ideal25°Ctrace-indicator aqueous film/well with selected strong-acid/base reference aliquots. Track added water volumes and acid/base equivalents separately;calculate signed excess per total volume,include water autoionization,then compare conservative endpoint classes. Validate charge,waterproduct,reference-equivalent budgets,equal-reagent and excess-reagent controls,small additions and a separately solved equilibrium. Indicator loading,substrate buffering,organic-solvent effects,degradation,CO₂uptake,evaporation,real kinetic rates and adsorption must be omitted explicitly unless actually modelled. Staged application timing is presentation time.

Before coding,choose and justify conservative qualitative endpoint handling from primary sources;do not fabricate a precise measured turmeric transition interval. Use original2D/3D wells and fibre detail,atleast120sguides,clear observations/worked calculations/examreport,independent actual-export checks,persistence and complete responsive/controls testing. Scientific review remains internal;official-board mappings pending.

## Implemented core and record checkpoint

turmericTests.ts now implements the selected4well model and120sguide;turmericTestsRecord.ts implements4tables and130workedblocks/trial.15focusedtestsPASS;independentPythonchecker5416checks1300blocksPASSfor10synthetictrials40wellrecords. FinalTypeScriptpasses. Exactcontrols/defaults/assumptionsandconservativequalitativeendpointpolicyaredocumented inSOURCES.md. No94geometry,2D/3DUI,route,actualGUIexport,responsive/native reviewyet. Do not mark ready.
