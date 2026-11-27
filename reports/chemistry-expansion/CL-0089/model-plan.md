# CL-0089 · Cooling curve and freezing plateau · design only

88 is internally reviewed;89 in_progress,not implemented. Full goal270,nextpush100. Preserve all frozen88files. Distinguish49 (imposed net-power pure-water fusion/cycle with no reservoir) and88 (open heating/boiling/escaped vapour).

## Proposed distinct experiment: finite cold-store capacity

Compare a water sample against a finite reference cold store through a stated thermal conductance. No imposed temperature ramp. Reservoir capacity may be too small to reach freezing,may support only partial freezing,or may permit complete freezing and subsequent ice cooling. This gives a substantive investigation beyond reskinning49.

Use a chosen effective cold-store heat capacity Cb(J/K),initial reference temperature Tb0 below0°C,water/vessel initially20°C and thermal conductanceK(W/K). Do NOT call the cold store pure liquid water below0°C;it is a generic original reference cold store,not a calibrated material. Heat loss to room omitted for the closed two-node energy account. No invented supercooling/nucleation timeline.

Candidate analytic derivation to implement/test:

1. Before freezing,Cs=m Cpwater+Cvessel,difference ΔT evolves exp[−K(1/Cs+1/Cb)t]. Weighted equilibrium temperatureTeq=(Cs Ts0+Cb Tb0)/(Cs+Cb) remains fixed. IfTeq≥0,no finite0°C sample crossing (equality is asymptotic). IfTeq<0,solve first0°C crossing;derive bath temperature from conservation.
2. On the freezing plateau Ts=0,Tb(t)=Tb,onset exp[−K(t−tonset)/Cb]. Released latent energy equals bath energy gain Cb(Tb−Tb,onset). Maximum latent reserve is Cb(−Tb,onset). If that reserve≤mL,there is no finite full-freezing event;at equality completion is only asymptotic. Otherwise derive completion root from latent budget. Track liquid and ice masses independently.
3. After full freezing,sample capacity becomes m Cpice+Cvessel and the coupled two-node difference again decays exponentially from the actual completion temperatures. The final equilibrium is below0°C. Never create energy by swapping heat capacities without preserving latent reference enthalpy.
4. Use a single water enthalpy reference: ice at0 has0,liquid at0 hasmL,liquid sensible above0,and ice sensible below0. Include vessel heat and cold-store energy. Total energy must be conserved through both events,including partial-freezing limits.

Candidate default ONLY,not validated constants:water100g,vessel50J/K,coldstore3000J/K at−20°C,conductance10W/K. It should have enough cold reserve for full freezing;derive event times before any guide timings. Candidate waterCp4180,iceCp~2090,L~334000J/kg require source verification/appropriate rounded references BEFOREcoding;existing49values alone are not independent validation. No89sources/tests/frontendyet.

## Planned practical and visualization

Temperature traces for sample AND reservoir,water/ice mass account,heat exchanged and total-energy closure. Show no-freezing/partial/full outcomes at common physical times.120s event-paced explanation with pause/holds and meaningful physical clock. Volume/density geometry and markers must obey phase mass;no arbitrary white fade labelled freezing. Two-node thermal contact is lumped,not resolved CFD or crystallographic nucleation.30? Do not predeclare number of workings;include all applicable substitutions and an exam-style result from actual observations. Need primary sources,independent time integration,edge-event continuity,actualGUI/exports/responsive checks before review.

## Core implemented (not reviewed/ready)

waterCooling.ts andchemistry-water-cooling.test.mjsnowexist.9focusedtestsPASS(23,136dense/288cornerstates,independententhalpyODE0.02→0.01s,pair/latentexponentials,energy/mass,events,equalities,disconnection,guide). Materialconstantsfinalizedasroundedteachingreferences:0°Cnear101325Pa,Cpwater4180,Cpice2100,L333400J/kg;primaryIAPWSiceTable6visuallyinspected/privateSOURCES.md. NotexactfullEOS. Do notreuseproposal334000/2090asifcorevalues.

ControlswaterMassG100–500,vesselCapacityJK0–200,storeCapacityJK500–5000,storeInitialC−25..−5,conductanceWK0OR0.1–20,timeSeconds0–7200. Default100g/50JK/3000JK/−20C/10WK. Outcomes disconnected/no-freeze/partial/complete-at-infinity/complete. onsetSeconds/completionSecondsnullwhennoFINITEevent;limitingIceFraction/sample/storetemperaturesseparatefromcurrentstate. Phase disconnected/liquid-cooling/freezing/ice-cooling. sampleC/storeC,liquidG/iceG/accountedG,heatRateW,iceGrowthGS and signedstoredenthalpy/releasedcomponents/3residualsexposed. All heat flows sample→store,not to an external thermostatic bath.

Guide120:12setup,30coolto0,50freezing,18icecool,10holdforcompletecase;partial/equality30cool+68plateauto5storetimeconstants;noonset98coolto5pretimeconstants,allcap7200;zero-contactclock360swithoutmovingheat. Actualendpointisfinite,notexactequilibrium. Initialnegative0atfullcompletionfixedtocanonical0.

No89practicalrecord/geometry/viewers/actualGUIyet. NextrecordwithbothTtraces,latentmassandclosedenergyaccounts,geometrythatpreservesphasevolumesandclearlylabelspositionsschematic(notpredictedcrystalfront/buoyancy),then2D/3D120sguide/fullactualchecks. TSC41782pendingatlastpoll. Preserve88frozenfiles. Fullgoal270active,nextpush100.
