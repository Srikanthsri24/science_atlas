# CL-0084 · Investigate a separating funnel with two liquid layers

In progress;not implemented/reviewed yet. Goalall270active;83reviewed,75published,nextpush100.

Read frozen CL-0047 layeredLiquids.ts (metered lighter-oil pour,hydrostaticprobe,constantcylinderarea) andCL-0016 oilWater.ts (meteredlayers). Do not reskin them or edit frozen sources. New investigation must drain a real-shaped separatory vessel through a stopcock,collect lower/upper products,switch collection at the interface,and compare recovery with contamination. Explicitly distinguish assumed immiscibility from density ordering.

Proposed geometry: original pear-like lathe profile with radius²(h)=rnecks²+R² sin²(pi h/H),rnecks=.25cm,R=3.4cm,H=12cm. Volume(h)=pi rnecks²h + pi R²[h/2−H sin(2pi h/H)/(4pi)]. Capacity~220mL;twoinitialphases10–80mLeachfit. Invert volume numerically for interface/free-surface heights;liquid meshes must use SAMEprofile andconservevolume. Do not draw linear heights in a pear-shapedfunnel.

Proposed physics: generic immiscibleA(rho1g/mL) andB(chosenrho.75–1.25g/mL). Higherdensityisbottom;atdensitytiegravitydoesnotselectorder,explicitlyinitialiseA-below-Basreferenceconventionandlabelorderingundetermined. Existinginterfaceisassumed,notsettling/molecularimmiscibilitysolver. Stopcockarea~.005–.03cm²,dischargeCd~.5–.8;Q=Cd a sqrt(2*981*Heff) mL/s. Lower-outlet head Heff=hLower+(rhoUpper/rhoLower)*(hTotal−hLower);afterlowerexhaustionupperHeff=hTotal. Quasi-staticpressure/orificeapproximation,no viscosity/emulsion/entrainment/capillarity/jet-holdup. Document potentialidealflowjumpatinterface,do notsmoothfictitiousmassacrossit.

Need derive physicaltime vsremainingvolume efficiently. Firstphase time integral A(h)/Q(h) overlowerheight,uppervolumeconstant andhTotal=inv(V(h)+Vupper). Secondpurephase transformh=u² removes1/sqrt(h)endpoint singularity:integrand2A(u²)/(Cd a sqrt(2*981)). Precompute monotoniccumtimeprofile perpreparation (boundedcache) andinvert;validateagainstindependentRK4/highprecisionquadrature,notjustsamealgorithm. Do not integratehundredsofexpensiveinversionsperanimationframe. Exactphase endpoints preventnegativevolumes.

Capture two receivers with chosen switchingtime relative tointerfacearrival,andvalveopen duration. Fractions of eachfluid ineachreceiverandfunnel mustclose independently;mass=rho*volume. PuritybyMASSandvolumefractionaredifferent. Defaultguide120smeaningfullymovesinterfaces,turnsstopcock,switchescollectionandexplainscontrast;manuallate/earlyswitchcases demonstratecross-contamination.

Optional buteducationalstopperextension: sealedtop idealairpocket P=Patm Vair0/(Vair0+drainedVolume),subtractambientfromhydrostaticoutletpressure,allowonlypositivehead. Closedstopperdoesnotmeaninstantzerooutflow:smalloutflowcreatesunderpressureandstalls;air-entry/bubblingomitted. Forrangesabove stalllikelybeforelowerexhaustion. Findstallroot anduseh=hstall+u² inquadrature toremoveendpointsingularity. dHeff/dh=[98.1((rhoLower−rhoUpper)+rhoUpper A(h)/A(hTotal))+Patm Vair0 A(h)/(Vair0+Vdrained)²]/(98.1rhoLower). Thisisproposal,derive/testbeforeimplementation;donotclaimsealedbubblingphysics. Atmosphere101325Paandg9.81arechosenreferenceconstants.

Next:finaliseinput/procedure/collector model,deriveconservedstates/testcorners,thenoriginal2D/3Dfunnelmesh/animation,workedhydrostatichead/volume/mass/recovery/purityreports,actualGUIandresponsive/exportQA. No84sourceyet.

## Recommended collector simplification for implementation
Prefer a collected-VOLUME threshold rather than a wall-clock switch: switchVolume=clamp(initialLowerVolume+offsetMl,0,totalInitialVolume),offsetMlnegative/positive demonstrates early/late switch. At any snapshot drainedLower=L0−Lremaining,drainedUpper=U0−Uremaining,totalDrained=sum. Receiver1volume=min(totalDrained,switchVolume),R1lower=min(R1volume,drainedLower),R1upper=R1volume−R1lower,R2lower=drainedLower−R1lower,R2upper=drainedUpper−R1upper. This gives exact component balances independent of variable flow. Purity and target recovery use eachcomponent’sdensity;do not substitute total mixture mass for target mass. Assumed no outlet deadvolume/entrainment must be stated;the ideal100%reference endpoint is not guaranteed in real apparatus.

Proposed guide120s:12setup/stopperinspection,46lowerdrain,12valveclosed/interfaceinspection/receiverpositioning,40upperdrain,10result hold. Duringinterfacepause elapsedopen-clockstays atTi and valveflow0;receivercanmove whileflowoff. Sealedstopper/closedvalve/earlyclosurecomparisons should accurately showstalled/incomplete separation,not force thedefaultflowsequence. No84sourceorvalidatedsolver yet. Finaliseparametersemantics beforecode.

## Implemented core checkpoint · not reviewed
Createdsrc/lib/chemistry/separatoryFunnelGeometry.ts andseparatoryFunnel.ts plus7passingtests inchemistry-separatory-funnel.test.mjs. TypeScriptpassed. Vented-onlyreferenceintentional;sealed-headspaceextensionaboveNOTimplementedandmustnotbeexposedasaworkingcontrol. No84record/UI/route/2D/3Dyet.

Actualinputs:volumeA/B10–80mL,rhoB.75–1.25g/mL(A1),opening0or.1–1,Cd.5–.8,switchOffsetMl−20..20,closeAfterSeconds/timeSeconds0–3600. Openingdefault.65:useaselectwith0and.1,.15…1,notarange0..1step.1(whichcannotrepresent.65)orstep.05(whichallowsinvalid.05). Capacity220.257060943mL. Defaultinterface41.649217651s,empty95.178582664s,initialpressure532.12646765Pa,flow1.307586404mL/s. See default-reference.json.

Geometryanalyticvolume/inverseandfunnelRadiusCm MUSTdrivevisualLatheandphaselevels. Lowerflow integral uses768Simpsonpanels;upperh=u² integral removesendpoint singularity. Cumtime inversionlinear,bounded8-entrycache. IndependentRK4validatedlowerheightandupperroot-heightODEswithin0.0005mL;72cornerpreparations×3closures×3thresholds×6timesclosecomponent/massaccounts. Exactinitial/interface/emptyboundariesandphysicalclampspreventfloatingnegativevolumes. Do not editfrozen83sources.

CurveAPI:funnelCurve(q) haslowerIsA,lower/upperinitialMl/densities,conductance,interfaceSeconds,emptySeconds,nullabletimesifopening0. funnelState(q) returnsremaining/componentreceiverinventories,nonlinearinterface/surfaceheight,pressure,instantflow,valveOpen,outletPhase,masspurityandtargetrecovery,currentCollector. Collectionthreshold=clampedlowerinitial+offset;immediatecapture/nooutletholdup. EqualdensitylabelundeterminedwithA-below-Binitialconvention.

Guide120returns{inputs,caption,timingNote};12setupclosed,46lowerdrain,12interfaceclosedhold,40upperdrain,10closedresults. Itrespectsearlyscheduledclosureandzeroopening,labels incomplete recovery. Guideelapsedreferencesexcludestagedclosedinterfacepause. FutureCloseNowbuttonshouldsetcloseAfter=q.timeSeconds,not0(otherwisehistoryreset);reopenfromactiveTimeSecondsifusingaccumulatedopen-referenceclock. Keepclocksemanticsclear.

Nextimplementrecord/reportwithEXACTsanitisedinputJSONfromstart(time-boundaryreproducibility),volume/mass/heights/weightedhead/Torricelliflow,purityvsrecoveryformulas;thenoriginal2D/3Dpear-shapedventedfunnelwithstand,stopcock,receiver-switchingandnativephonereadouts. IndependentGUIexportvalidation,full120sguides,allviewport/theatre/cornerchecksneededbeforeReady.


## Records and apparatus source checkpoint
Added separatoryFunnelRecord.ts (30 columns,13 worked blocks,exact safe JSON,exam HTML), SeparatoryFunnelDiagram.tsx and SeparatoryFunnelScene.tsx using calibrated curved geometry. Nine focused tests and corrected-source full TypeScript pass. Not routed,not browser-reviewed;84 remains in_progress. Next implement Lab.tsx/CSS/route; audit continuous versus staged receiver change,readability,full120s both modes,exports and responsive UI before review. No CUA used this turn.
