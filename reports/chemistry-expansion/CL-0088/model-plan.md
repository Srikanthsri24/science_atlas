# CL-0088 · Observe a heating curve for water · plan only

87 is internally reviewed;88 is in_progress,not implemented. Goal stays all270,nextpush100. Do not edit any frozen87source or reskin49.

## Distinct investigation

Read meltingFreezing.ts (49): pure reference water has an imposed net heat controller,ice/fusion/liquid states,cutoff60°C,no evaporation or apparatus heat. 88 should investigate LIQUID heating and boiling,delivered heater energy,heat losses,beaker heat capacity and escaping water.89 is cooling/freezing,143 compares boiling point of pure/mixed samples,231organicboilingpoint,236boilingelevation. Keep those distinct.

## Candidate model requiring verification and implementation

Open,well-mixed water/beaker reference at a fixed stated pressure. Begin near20°C. Constant water Cp approximation and separate chosen beaker heat capacity. Heater power times a stated coupling factor supplies the combined node;UA(T−Tambient) removes heat. Before boiling,water mass constant and C=m0 Cp+Cb:

C dT/dt = Pin −UA(T−Ta).
T(t)=Ta+Pin/UA+(T0−Ta−Pin/UA) exp(−UA t/C),with stable UA→0 branch.
Boiling can only begin if the equilibrium asymptote exceeds saturation temperature. At equality the approach is asymptotic,not a finite onset. At boiling T=Tb,netlatentpower=Pin−UA(Tb−Ta); mass loss rate=netlatentpower/Lv. Track remaining liquid and escaped vapour separately. At dryout stop heating,do not show an empty beaker continuing to boil.

Energy closure should include ALL initial water sensible warming (including the part subsequently evaporated),beaker warming,latent energy of escaped mass and integrated heat loss. Heater-source inefficiency is a separate account from energy delivered to the node. Do not claim the remaining-water sensible inventory alone closes an open-system balance. Express the equivalent escaped-vapour sensible enthalpy if presenting stored-vs-exported energy. No subboiling evaporation is included unless a separate defensible model is added and tested;state this clearly.

A lagging probe could be a useful extension but must be derived/tested rather than an arbitrary curve. If used,it must not affect the actual water energy budget. Bubbles only at positive boiling flux;marker positions follow physical clock and freeze on pause/holds. Clear heating/boilingcurve with actual sample observations,120sguide and source-vs-sampleenergyaccounts,worked substitutions,examreport. Need apparatus dimension/mass closure and actual GUI/export/responsivechecks before review.

## Primary-source investigation started, NOT finalized constants

Opened NIST Chemistry WebBook water,2026-11-27: https://webbook.nist.gov/cgi/cbook.cgi?Name=water&cTC=on — liquid Shomate Cp and reference molar mass18.0153g/mol. It does NOT alone verify a chosen constant Cp or latent heat at boiling. Follow its phase-change/fluid-properties links for relevant values;distinguish temperature-dependent data from a constant teaching approximation.
Opened IAPWS official IF97 release page: https://iapws.org/technical-guidance/release/IF97-Rev — primary industrial fluid formulation and downloadable release. No numerical saturation table fetched yet. Need verify reference saturation pressure/temperature and latent enthalpy BEFOREcoding. 100°C saturation pressure is about101.4kPa,not exactly101325Pa;use a consistent rounded reference and state its approximation or calculate exact saturation. Do not silently pair exact1atm with exact100°C as precision data. Earlier search snippets are NOT verified numerical sources.

Candidate values Cp~4180JkgK,Lv~2.257MJkg remain PROPOSED ONLY. UA,Cb,coupling are original chosen apparatus references,not calibration. No official textbook/board mappings fabricated. No88source/tests/frontendyet.

## Implemented core (not reviewed/ready)

waterHeating.ts + chemistry-water-heating.test.mjs now exist. Ninefocusedtests pass:26,028densestates,independent event-split numericalintegrationdt0.1→0.05s,192cornerstates,mass/source/thermal/stored-exportedbudgets,onset/dryoutcontinuity,strictzeroatdryout,exactthresholdnoboiling,tinyUA0limit,and120sguide. SourceauditSOURCES.md now verifies rounded100°C/101420Pa/Lv2256400JkgfromNISTIR5078Table1;constantCp4180isexplicitteachingapproximation,notsteamtablefit. OfficialIAPWSsuppTable1page7visuallyinspected,normalboiling373.1243Kat101325Pa. No need entireIF97implementationforfixedroundedreference.

ControlsAPI:waterMassG100–500,heaterPowerW100–1000,coupling0.3–1,lossWK0–8,vesselCapacityJK0–200,timeSeconds0–7200. default250g/700W/.8/2WperK/50JperK/time0. CorefunctionscheckWaterHeating/waterHeatingState/waterHeatingGuide. Guide12setup/60warming/38boiling/10holdifonsetwithin7200;endat20%evaporationor7200cap. Nonboilingguide98s maps0→min(5tau,7200),nomanufacturedplateau. Inputsinitialandambient20Cfixed. Exactboilingat72guide. Inputsparameterchangesmuststartfreshwhenfrontendimplemented.

DryoutstopsmodelclockatactiveSeconds;requestedphysicaltimecanlaterbutnothermalhistoryafterstop. liquidTemperatureCnullwhenempty;temperatureClastvalid100Creference. heatLossAtTemperatureW=UAΔTstillpositiveatdryout;accountedLossPowerW0becauseexperimentstopped. Do notshowemptyvesselwithtemperaturelabelclaimingliquidexists. Electricalblockedenergyseparatefromuncoupledenergy. No88record/geometry/frontend/actualGUIyet. TSC44358pendingatlastpoll. NoCUAthisturn;87frozenunchanged. All270goalactive.

## Practical record and geometry implemented (still not reviewed)

waterHeatingRecord.ts exposes validated exact independent inputs with notes/plan/conclusion,max40trials,safeJSON/HTML export. Three tables9preparation/11thermal/14energycolumns.30workedblocks/trial,including finite/no-onset branches,active-clock/dryout,stablewarmingresponse,losses,sourcecoupling,allinitialwaterwarming,stored/exportedsensible+latentaccounts,densityinterpolation,volumeandlevel. Emptyliquidtemperatureexplicitlyunavailable;lastvalidmodelTseparate. ParameterchangesmuststartfreshinthefutureUI.

waterHeatingGeometry.ts uses saturation-densityanchors20/40/60/80/100C998.16/992.18/983.16/971.77/958.35kgm3,piecewiselinearNEARATMOSPHERICVISUALapprox,notisobarequation.CylindricalR4cm,H12cm,floor.2cm,capacity603.1858ml;max500gwaterat100C521.7311mlfits. Conservesliquidmass/volume/level,thermalexpansionobservablebeforeboilingandfallinglevelduringboiling.Noactualmeniscus/voidfraction/probedisplacementfit. Needclearscopeintheviewers.

Core now returnswarmingDimensionlessTime,warmingResponseFactor,warmingLossFactorfortransparentworkedsubstitution;existingphysicsunchanged.12focusedtests pass (9model+2record+1geometry). Dense26,028states+independenttimeintegrationunchanged. Syntheticreference-record.htmlanddefault-reference.jsonareforcalculationinspectionONLY,notactualGUIobservations. Defaultguidephysicalendpoint466.268549550114s. NO88frontend/routes/actualGUItests/independentexportreviewyet,doNOTcountcomplete. LatestTS2561pendingatlastpollafterdensity/record30changes;earlier90695passedbeforelatestchanges. Nextimplementclear2D/3DandLabcontrols,thenactualfullguides/trials/export/responsive+review.
