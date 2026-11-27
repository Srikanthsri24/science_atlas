# CL-0083 · Use chromatography to compare ink samples

In progress;not implemented/reviewed yet.

Inspected frozen CL-0044 inkChromatography.ts: two dyes,chosen K distribution ratios,Rf=1/(1+K),capillary front,normalised wet-domain Gaussian broadening and overlap. Do not reskin it or edit frozen44sources.

New investigation should compare multiple known reference inks against an unknown lane on the same paper with the same solvent front. Record distances from a common pencil origin and calculate Rf with explicit substitution. A matching chromatogram is evidence of consistency,not unique proof of ink identity. Build a deliberate co-migration/ambiguous single-solvent example,and compare a second chosen solvent system. Show how broadening,measurement increments and finite separation can hide components;do not identify a commercial brand or claim forensic certainty. Generic original dye profiles and solvent affinities only;no empiricalbrandcalibration.

Possible architecture: 3knownreferenceprofiles plusunknown drawn from4original formulations;oneextra formulation co-migrates with a reference in solvent1 but separates in solvent2. Conserved per-dye masses and per-lane normalised profiles. Keep front/origin insidepaper and above liquid;reject distance ratios beforefrontcrossesorigin. Model capacity/transport simplifications and Gaussian-vs-peak measurements must be explicit. Multi-condition candidate comparisons should use stated measurement tolerance/resolution,not arbitraryAI matching. Need derive/test exact profiles and observation reading rules before original2D/3Dchamber viewer. Minimum120sguide,workedRf/observation/report,GUIcorners,allviewportchecks thenreview.

Nextread44record/geometry for boundary/massnormalisation pitfalls;createindependent83core/record/tests. Goalall270active,nextpush100,lastpublished75.

## Implemented model checkpoint
inkComparison.ts and8passingtests inchemistry-ink-comparison.test.mjs implemented;TypeScriptpassed. No83record/viewer/UI/routeorbrowserreviewyet;82remainsthereviewedcount. Initialtestsyntaxextraparenthesisfixedbefore8testsran.

Originaldyes:Pblue(S1Rf.25,S2.22),Qyellow(.7,.66),Rblue(.25,.48),Tmagenta(.5,.8). A=P+Q,B=P+T,C=R+T,D=R+Q. Unknownvials1–4mapA–D(default4);studentUIshouldnotrevealrecipeunlessexplicitteachercontrol. AandDco-migrateS1;BandCalsoambiguousS1. S2distinguishesallunderdefaultbaseline-resolutionconditions. No commercialbrand/forensicidentityclaim.

Coreinputs:solventS1/S2,vial1–4,load.2–2mgtotalperlane,widthsigma.04–.2cm,dispersion.00002–.00015cm²/s,capillary.08–.14cm²/s,ruler.05/.1/.2cm,time0–1500s. FourlanesA/B/C/U,eachtwocomponentsequalmass. Front=.8+sqrt(c*tactive),origin2cm,paper12cm,programmedremovalat11.5cmfreezesfrontANDwidth. Mobilisationidealsharp-onsetatfrontcrossingorigin. Wet-domaintruncatedGaussianpercomponentnormalised;dryspotnormalisedoverfullpaper. EqualreferencephasevolumesgiveK=1/Rf−1andwetmobilemassfractionRf;notempiricalphasecalibration.

Conservativenominalresolution=centregap/(4sigma);require>=1.5andfronttravel>=4cmbeforeindividualrulerreadings. ThisavoidsfabricatingindividualRfwhenbandsunresolved. Onlyreportablebanddistancesroundtorulerincrement,Rf=dspot/dfront;boundsusehalf-stepnumerator/denominator. ComparereferencetoUontheSAMEsheet:sortedbanddistance differences<=onerulerstep(=sumoftwohalf-stepallowances),equivalentRfallowance=step/commonfrontreading. Statusconsistent/different/inconclusive;consistencyisnotidentityproof.

Guide120s:12setup+88developmenttofront10cm(8cmaboveorigin)+20inspectionhold,withreferenceclock0–(10−.8)^2/c. Captiondoesnotclaimactualmeasuredrates. Densitycolourfuturemustbequalitativeabsorptiveillustration,notcalibratedspectra.

NextimplementinkComparisonRecord.ts:validateindependentinputs;keepobservationsfromearly/unresolvedcasesasNotestablished. Prefer4lane-rowspertrialandseparatepreparationtableinexport. Workedfronttravel/rounding,sigmaandresolutiondiagnostic,Rfandbounds,referencetolerancecalcs. Acrossrecordsaggregatebysamevial:eachreferenceexcludedifanyeligibledifference,consistentbothsolventsifeligiblematchesS1+S2andnodifference,one-solventconsistentorotherwiseinconclusive. Unresolvedtrialsnevermismatch. Do notlabeluniqueidentity;explainlinearload/no-overloadandfinite-rulerassumptions.

Thenoriginal2Dmulti-lanepaper/profileSVGand3Dwideglasschamberwithlid,clip,originabovesolvent,texturefourlanesandmeasurementruler. Paperwidth~9cm,12cmheight,.03thickness;chamberwidth11/depth5/height13cm;origin2/pool.8. Transversecolourprofileillustrative,longitudinalmassnormalised. Reusefrozen44knowledgewithoutediting44sources. No sourcecaptionhookchangesmidfinalfullguide;afterUIfixesrunfresh120sbothmodes,actualrecords/independentexportvalidator,viewportcases,thenreview.

## Final internal review
Record/report,sharedvisualtexture,2D/3Dviews,nativereadingpanel,UIandroutecompleted.14model/record/visualtests+2cataloguenavigationchecks,2992fulltests,TypeScript,Vite39.02spassed. Bothfreshfull120sguidescompleted/endpointssaved.17GUIdevelopments/68lanescoverallvials×solvents,early/unresolvedstates,controlmin/max,threeincrements,andremoval/timefreeze. ActualHTML9tablesexactinputJSON,1602fieldchecks(1196numeric),799workedresults(715numeric)passedindependentPython. Replayfromnondefault2DlaneAand3DlaneB/paperviewresetsU/chamberat0.5/0.4s;partialresetcheckspaused,notcountedasfullguides.

40finalstandardviewportcasesplus16theatrecasesphone568×320/844×390,tablet1024×768,TV1920×1080bothformats/modespassed. PhoneGLlabelreadabilityfixedwithnativepanelandportraitframing. Shortlandscapecanvas100.8→224/294pxbyside-panelgrid.3Drulernumber/letterbadgesenlargedbeforeguides.17records/plan/conclusion/note2persistreloadandReadycardreturn;consoleempty. Viewport/light restored;proofverified-chromatography.pngandphone-readable-theatre.png. Sourcesfrozen17referencesinreview.json. Internalengineeringreviewonly;noindependentexpert/device/FPS/nativegesture/printercertification.
