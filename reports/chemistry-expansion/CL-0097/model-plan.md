# CL-0097 · Neutralization with a temperature readout

In progress; no implementation or review claim yet. Frontend-only original calorimeter scene. Grade7 core: identify warming as reaction evidence; optional quantitative extension explicitly labelled.

Proposed apparatus: finite HCl reservoir above insulated NaOH cup,controlled delivery,stirring rod,temperature probe,temperature-versus-delivered-volume trace and energy accounting inspection. Colourless liquids remain colourless;temperature changes belong to probe/energy annotations,not fabricated pH colour.

Initial same temperature for acid,base and cup;independent initial volumes10–100mL,concentrations0.1–1mol/L,initial20–30°C,calorimeter heat capacity0–50J/K. Exact ranges to validate before implementation. Density1g/mL,solution specific heat4.184J/(g K),nominal neutralization enthalpy−57.3kJ/mol is an explicit selected ideal teaching parameter,not a newly measured experimental result. Complete strong-acid/strong-base dissociation,1:1 stoichiometry,instantaneous ideal mixing/reaction at each controlled delivered-volume state. No arbitrary kinetic curve masquerading as measured chemistry. No heat of dilution,evaporation,heat loss,solvent activity or temperature dependence. Strong acid/base excess must be retained and a warm cup does not prove equivalence.

For delivered acid fraction f:
- VacidDelivered=VacidInitial*f;finite reservoir remaining is exact complement.
- nHCl=CHCl*VacidDelivered/1000;nOHinitial=CNaOH*Vbase/1000.
- xi=min(nHCl,nOHinitial);leftover acid=nHCl−xi;leftover hydroxide=nOHinitial−xi.
- Qreleased=57300*xi J;Qreaction=−Qreleased.
- msolution=(Vbase+VacidDelivered)*1g/mL;Csolution=m*4.184J/(g K).
- ΔT=Qreleased/(Csolution+Ccal);T=Tinitial+ΔT.
- Qsolution=Csolution*ΔT;Qcup=Ccal*ΔT;Qsolution+Qcup+Qreaction closes.
- Calorimeter-corrected inferred enthalpy=−(Qsolution+Qcup)/(1000xi);xi0→not defined. Apparent solution-only estimate=−Qsolution/(1000xi),explicitly omits cup heat.
- Equivalence acid volume=1000*nOHinitial/CHCl;distinguish reachable from beyond finite reservoir.
- Trace temperature versus delivered volume can rise then fall after equivalence due to further same-initial-temperature dilution even in an adiabatic process. Do not falsely attribute that fall to environmental heat loss.

Proposed120s guide: inspect prep/probe,deliver acid gradually for~50s,stir symbolically,inspect balanced energy accounts,compare below/equal/above equivalence and practical calculations. Presentation time staged,not reaction kinetics or actual human pouring-rate calibration. All state accounts derived from same fraction. Precise geometry/guide intervals to be specified and tested next.

Required records: prep/delivery,moles and excess,temperature and heat-capacity/energy accounts,worked substitutions,exam-style aim/apparatus/procedure/observations/result/conclusion/limitations. Independent Python Decimal checker must validate actual button-downloaded report. Real120s2D/3D guide,13+ preparation responsive scope/format/viewport combinations,native orbit/zoom,persistence and controls before ready.

## Implemented scientific core and record2026-11-27

Files neutralizationHeat.ts,neutralizationHeatGeometry.ts,neutralizationHeatRecord.ts.15 focused tests pass.25200 preparations cover finite volumes,moles,analytical charge and signed energy closure;unequal initial amounts,post-equivalence dilution,cup heat capacity and no-reaction undefined results checked. No viewer or ready/review claim yet.

Guide exact120s:0–16prepare;16–76deliver acid linearly from fraction0→1;76–92symbolic stir/inspect;92–106energy;106–120interpret.60s actual delivery movement plus76s stirring. One shared clock;fraction=(t−16)/60 clamped. Presentation time not measured kinetics. Geometry called with guide.inputs;reject mismatched fraction to prevent clock/liquid drift. Manual fraction is direct analytical equilibrium state,not measured reaction completion.

Apparatus centimetres:128-sided cylindrical cup radius3.2,bottom1,rim9,capacity~257mL>200mL maximum. Reservoir radius2.2,bottom14,height8,capacity~121mL>100mL maximum,centre x−2.2. Outlettip(0,12.5),probe x1.5 fromy1.15to11. Cross-sectional area128*sin(2π/128)*r²/2 matches the renderer's polygonal cylinder;liquid heights volume/area. Probe submerged even10mLminimum. Initial acid/base/cup same temperature;no heat loss or delay. Transparent colourless liquid;flow marks are annotations and do not introduce uncounted liquid transit volume. Use authoritative apparatus constants in both viewers. No independent physical probe certification.

Trace is T versus delivered volume,not T versus real time. Includes exact equivalence point if within delivered range so a coarse sample cannot miss true modeled peak. Peak within finite stock is min(available acid volume,equivalence volume). Distinguish reachable equivalence from finite stock exhausted early. Analytical acid/base excess is not free-ion molarity,pH or autoionization calculation.

Record retains7source numeric inputs+note;unknown derived fields discarded.0–40trials,4000character text limits,escaped student text/exactinputJSON.2tables9prep/32observation columns;28worked substitution blocks/trial. Current result and student conclusion separated;model parameter reconstructability explicitly not independent experimental determination. Synthetic12trials,1673independent checks,336workedblocks pass;operand/result/observation/input mutations all rejected. Private reference-report generated from original cases;noactualGUI/exportverifiedyet.
