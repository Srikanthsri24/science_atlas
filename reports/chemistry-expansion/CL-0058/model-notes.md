# CL-0058 — Investigate simple distillation of coloured water

Original2D/3D apparatus,120sguides andpractical/report completed.26targeted/2475regression tests,finalTypeScript/build,browsergeometry/layout andindependentexportchecks passed. Internalreview scopeandfrozen sources inreview.json;notindependentexpert orinstrumentcertification.

## Model boundary

Atmospheric100°C reference at101325Pa.50–200g water with5–50mg trace nonvolatile dye. Initialwater15–40°C;chosen netheat80–300W. Warming uses4.18J/(g K),then2256J/g latentwater vaporization. Dye staysinpot;no volatility,entrainment,aerosols,boiling-point elevation,reaction ordecomposition. Trace-dye andapparatus heatcapacity neglected. Netpower alreadyexcludes unspecified heaterlosses,not anelectricalrating. No actualpurity,drinking-safety ormanufacturerperformancecertificate.

A half-initial-water heater cutoff retains50% water andall dye. This is aprescribed control,not boilingdry. Aftercutoff theidealremaining liquid staysat100°C;no residualheat orambientcooling solver. A futureUI mustnot claimameasured stillheadtemperature orshow continuedpoweraftercutoff.

Vapour production rate P/2256 beginsat tb=Wcp(100−T0)/P andstopsafter0.5W/(P/2256). Clamp cumulativegenerated/arrivedmass overthis finite interval. Prescribed3s vapourtransit and1s condensatedrain delaysretain in-flight inventories. They arenot aresolved pressure/volume/velocity model,andthefuturedrawing mustlabel representativetransport accordingly.

Water budget:potwater +vapourintransit +condensateindrain +receiverwater +ventedwater =initialwater. Dye10mgdefault remainsinpot andadds0.01g towholematerialmass. The apparatusisopen/vented;uncapturedvapouris trackedexternally,not silentlydeletedorsealed. Coolingwaterisaseparate circuit andnever addedtodistillate.

## Condenser model

Chosen UA=2W/K,coolant density1g/mL,cp4.18J/(g K),inlet10–40°C,flow0–300mL/min. Cdot=flow/60×density×cp. ForCdot>0,NTU=UA/Cdot,epsilon=1−exp(−NTU),Q_UA=Cdot(100−Tin)epsilon. This follows integratingdT/d(UA)=(100−T)/Cdot foraconstant-saturation-temperaturevapour. It accountsforcoolantwarmingratherthan usingUA×inlet-driving-difference asactualheattransfer.

A separatelychosen maximumcoolantrise20K givesQ_flow=Cdot×20. Capacity=min(Q_UA,Q_flow). Zero flow givescapacity0 withoutdivision byzero. Capturedfraction=min(1,capacity/P),condensedproduction=fraction×arrivedvapour,vented=(1−fraction)×arrivedvapour. Receiverarrival addsthe1s draindelay. CurrentQ=2256×currentcondensationrate;Tout_reference=Tin+Q/Cdot,orTinwhenflow0. No jacketthermalinertia,sensiblecoolingofdistillate,fouling,heatloss,initialair/watervapourmixture,leakpressure ordynamic heattransfermodel. Outputtemperatureisreference coolantresult,not measuredsensorperformance.

DefaultW100g,dye10mg,T025°C,P150W,flow300mL/min,Tin20°C. tb209s,cutoff961s,lastdrop965s. At1000s receiver50g,pot50g,dye10mginpot,concentrationfactor2. Defaultcoolingcapacityexceeds150W;theimperfectcoolingcontrolspermitlessrecoveryandtrackedventwater.

## Guide and forthcoming visualization

120s:10s setuphold,100smovingpresentation spans0–1000physicalseconds,10sobservationhold. Manualtime0–4000coversallparametercorners. Show realwarming beforeboiling,shrinkingdyedpotwater,finitevapourpath,condensinginnerpassage,drain/receiverdrop,risingreceiverlevel andseparatecounterflowcoolingjacket. Coolinginletlower/downstream,outletupper/upstream;neverdepictcoolingwater mixingwithvapour. Receiver/removalmustremainvented. No visiblewater-vapourcloud asliteralsteam;markersareexplanatory. Clearlydistinguishpottemperaturefromheadmeasurement. Use safemodelheatercutoff;do notteachboilingdry.

Practicalneeds observationsbeforeboil,duringtransport/firstarrival,steadycollection,cutoff,lastdrop,insufficient/nocooling. Recordallwaterinventories,dye,heat,phase/referenceT,coolingflow/T,capacity,condensationfraction,recovery andconcentration. Deriveworkedformulaswithunitsandexamreport. ExactGUI,download/reload,120sguides,responsiveandcamera reviewstillrequired.

## Private primary references

Read2026-11-26:
- UniversityofAlberta laboratorytechniques: https://www.chem.ualberta.ca/~orglabtutorials/Techniques%20Extra%20Info/Distillation.html
  Supports vaporization/condensationseparation,lowerinlet/upperoutletcoolingjacket andthermometerplacement. Somehistoricaltextmentionsanemptypot:endpoint here deliberatelyusesahalf-watercutoffanddoesnotinstructboilingdry. ThepagedoesnotvalidatethechosenUA,transportdelays orvirtualconstantvalues.
- RSC searchresult: https://edu.rsc.org/practical/simple-distillation-practical-videos-14-16-years/4018538.article
  Describescoloured-solutiondistillationandthemisconceptionaboutcoolingwateraroundthecondenser. Directpageretrievalreturned405;donotclaimafullpagereview.

Originalequations/content;Class5placementeditorial,notverifiedofficialchaptermapping. Keepreferencesprivate,studentUIandreportcompanyonly.

## Completed engineering verification

82 actual SVGstates independently reconstruct sphericalcap/receiverliquids,weighted inventories,markerpaths andelapsed-only water/heatplots;alltextbounds/overlaps passed.84 actual3Dreadouts independentlymatchphysics;101 responsivecases includefourcameras,bothformats,narrowportrait/shortlandscape theatres andexpandednotes.37 GUItrials,1110 independentworkedresults,threeprinttables andexactwriting/reloadpersistence. Floatingmanualendpointclampedto4000. Coolantpath correctedtotheannulusandjacketendsealsleaveinnerpassageopen. Waterdrawingsuse1cm³/g;dyeshadeisillustrative,notcolourimetry. Fullrundetails/limitations inreview.json.
