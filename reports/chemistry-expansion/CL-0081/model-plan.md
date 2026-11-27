# CL-0081 · Paired evaporation recovery

Work in progress; no completion/review claim.

Distinct from CL-0043: compare a retained sample with a controlled loss of well-mixed solution to a catcher. Keep a complete water and solute inventory, cool before weighing, and separate wet apparent recovery from dry solute recovery. Generic reference properties and transfer rates are chosen assumptions, not a named chemical calibration.

Initial W=20–100 g, S=1–5 g; capacity c=0.25 g/g water. Prescribed water-only evaporation E=0.05–0.2 g/s; paired solution spill J=0–0.02 g/s. Solute is nonvolatile, crystals are not entrained. No energy/boiling/ambient humidity model. Weighing station freezes material transfer, with an explicitly chosen exponential cooling reference; finite balance resolution does not prove dryness.

Before saturation total mass M=M0−(E+J)t; S=S0(M/M0)^[J/(E+J)]; W=M−S. At saturation S=cW. Thereafter W decreases at E+J/(1+c), S at Jc/(1+c), until W reaches zero. Catcher mass is J times wet time and vapour mass E times wet time. Every compartment must close independently.

Private method reference: University of Massachusetts course, Gravimetric Methods, https://www.ecs.umass.edu/cee/reckhow/courses/572/572bk15/572BK15.html (search excerpt accessed 2026-11-27; full-page fetch timed out). The excerpt supports repeated drying/cooling/weighing as a method; does not validate chosen simulation rates/material. No textbook prose copied; no external reference panel in student interface.

## Implementation checkpoint
Original model,record serializer/report,2Dpairedapparatus,3Dpairedapparatus,UI andworking-previewroute implemented. Seven focusedmodel/recordtests plus two cataloguenavigationtests passed. Fullregressioninprogress. TypeScript passed before catcher-capacity refinement;rerun after final changes. Full2Dguide in progress;3D andresponsiveQA not yet counted. InitialactualGUIcomparisonrecorded.

## Final internal review
Completed both full120sguides.13actualGUItrials,31columns,24workedblockspertrial,4exporttables. Download239numericchecks viaindependentRK4passed;312workedblocks present. Final9focused/2965fulltests,TypeScript,Vite37.60spassed. Initial320pxtextoverflowanddetailcropbleedfixed.20finalviewportcasesallcontained;actual390darkdetail/theatreandkeyboardtablescroll tested.13records/writingspersistreloadandReadyOpenlabreturn. Noindependentexpert/physicalprinter/nativegesturecertification. Sourcesnowfrozenbyreview.json.
