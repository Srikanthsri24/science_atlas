# CL-0115 — implementation checkpoint

In progress, not ready. Catalogue114/270reviewed;next115. NextGitpush125reviewed,100published. No115route/openingmetadata/3D/2Dcontrollerorcompleted-reviewclaim.

## Implemented
-`neutralAtoms.ts`:18elementsH–Ar,38selectedknownisotopesfromCIAAW2024;explicitneutralground-stateconfigurationscheckedagainstNIST. Noabundance,atomicweight,stability,bindingenergyornuclearsizeclaims.
-Discretetarget/countingmodelwithvalidatedintegerproton/neutron/electrontokens,missingcounts,nominalmassnumberA,atomicnumberZ,neutralchargebookkeepingincountsof e andcoulombs. Partialbuildsarenotidentifiedphysicalionsornuclei;balancedemptybuildisnotcomplete.
-150secondguide:inspect0–15,protons15–45,neutrons45–75,electrons75–120,verify120–135,compare135–150. Guidebuildsselectedneutralreference;doesnotpretendtoevolveactualatoms.
-`neutralAtomsGeometry.ts`:arbitrarydrawingsites,non-overlappingnucleonlattice,staticlabelledshelloccupancyslots,representativetrays,sequentialtoken-placementarcs. Noelectronorbits,wavefunctionormolecular-scaleclaim. Countsstaycurrentstageddata;timedgeometryrejectsnonmatchingcounts ratherthanadvancingtheguideagain. Totalplaced/tray/transitinventorypreserved. Recordeligibilityrequirescompletebuildandverificationstage>=135.

## Evidence
-11focusedcore/geometrytestspassedincludingalladmissiblepartialcounts(over50000),all38targets,configuration/shellaggregation,isotopecomparison,charge,geometrysites,transferinventory,boundariesandpauseddeterminism.
-IndependentPythoninteger/subshelland80digitDecimalchargereference:1538constructionstates/55534typedfieldcheckspassed.16deliberatelycorruptedresultsrejected,includingerasednonzerocoulombcharge.
-Geometrytestinitiallycaughtsin(pi)endpointresidual7.35e-17andpotentiallinearinterpolationrounding. Fixedbypinningparkedtokenpositionstoexactsite/fromcoordinatesandonlyaddingarcfor0<progress<1;testsnowpass.
-Core/geometryTypeScriptstartedasexecsession27946;inspectauthoritativeterminal/logcore-geometry-typescript.txtbeforerestart. Timed-countguardaddedafterprocessstart;finalintegratedcheckstillneeded.
-PrivateprovenanceinSOURCES.md;NISTconfigurationsandCIAAWrowsretrieved,GoldBookdirect403/CGIunavailablehonestlyrecorded. Noexternalstudentlinksorcopiedassets.

## Outstanding
Practicalrecordwithcount/charge/formulas/substitution/comparison/examreport;independentHTMLaudit/mutations;original2D/3Dviewerswithcleardynamicplacementandincomplete-feedback;controllerandworkingmanualconstruction;150srealplaybackbothmodes;responsive/text/camera/nativechecks;actualnotebook/download/persistence;finalbuild/regressionandfrozeninternalreview. Do notdeclarecompletefromcoretests.


## Practical report and initial interactive 2D viewer

Added `neutralAtomsRecord.ts`: validated input-only records, four tables (construction, paired reference counts/configurations, charge/composition, isotope/element comparison), 40 worked blocks per trial, original student notes, procedure, limits and exam-style HTML. Completed neutral references only; live partial diagrams can show negative residuals and undefined neutron/proton ratios. Target quantities and placed tokens are explicitly distinguished. No experimental mass or hardware readings invented.

Independent exported-report audit passed 38 trials / 1520 worked results / 3116 operand checks / 2090 table-field checks. It verifies original completion constraints, all table headers/units/identities, every symbolic formula, numeric operators/operands and Decimal results. Twelve deliberately corrupted reports rejected. Synthetic reference report covers every selected isotope, includes isotope and element transitions and a reversed large comparison.

Added `NeutralAtomsDiagram.tsx` and separate `neutralAtomDiagramLayout`. The 2D nucleus uses an independent hexagonal flat layout so 3D lattice sites do not project onto each other. Tokens can be selected by pointer or keyboard, with explanatory status; particle filter and labels work in component code. Shell rings remain occupancy guides. Portrait has three trays below the counting diagram; landscape has trays to the left. No route or browser review yet.

Expanded focused suite: 16 tests passed. Flat-layout tests cover all 38 targets, both formats and ten guide stages, non-overlapping nuclear tokens and token-path bounds. Initial header clearance assertion identified insufficient reserved space at the top shell; moved landscape origin from y310 to y322 and retained the 110px clearance requirement. Actual text/SVG browser bounds still need testing; mathematical token bounds alone are not responsive certification.

Prior core TypeScript27946 and record/diagram TypeScript73466 both completed terminal exit0 with empty logs. Latest role/position-only edits and new tests followed the latter process start; final integrated checks remain necessary. All 114 prior review manifests still validate. CL-0115 remains in progress, no opening metadata or ready status.

Next: 3D viewer with token placement, manual builder/controller and comparison panel; actual 150s playback both modes; all selection/keyboard/native/camera/responsive/text checks; notebook persistence and actual download audit; final tests/build and frozen internal review. Keep full 270-lab objective active; next push at125 reviewed.


## Integrated app and initial live browser checks
Added `NeutralAtomsScene.tsx` and `NeutralAtomsLab.tsx` with selected element/isotope, integer sliders and one-token add/remove controls, clear/complete references, comparison selector, live workings, persistent notebook and download. Development route115 exists; no availability description or ready status yet.

Browser manual build: keyboard Enter selects a 2D token (aria-pressed true); clear model disables recording despite balanced charge; all18 C12 tokens manually added, complete model enables recording. One C12/C13 comparison saved; original plan/conclusion and literal HTML-like note entered.

Actual2D150second guide reached150. At140 seconds recording stilldisabled whileplaying; completed150enabled. Final2Dmatrix96cases: six sizes, bothformats, fourtokenfilters, normal/theatre, noSVGtextclipping orhorizontaloverflow. Actual3Dguide started afterward and still running on lastread112seconds; native3Dtoken click selectedproton3correctly. Do notrestartguidebeforeinspectingactualtimeline.

3Dmatrix96cases passedcanvaspresenceandzeropageoverflow. Portrait trays movedbelowmodel with portrait camera bounds; shell labels moveddiagonallyapart. Expanded geometry testpassesall38targets/portrait3Dpaths. Focusedcore/record/geometry suite17passed. IntegratedTypeScript98149terminal0; laterTypeScript7544terminal0afterportraitchanges. Integratedbuild93919terminal0in14.49s. Sourcepresentationchangesafterfirstcheckwerecoveredbylatercheck.

Cua bindings: atomTab115 is existing Chrome1331266177; selectedbrowser1 via starchBrowser113, viewportstarchViewport113, filesstarchFs113, nativestarchNative113. BrowsercurrentlyTheatre3Dallparticles/light/defaultviewport. PhaseNOTclosed; continue guide and tests, then completion_summary before concludingCUA. NeedPNGproof.

Outstanding:3Dend150, all38isotopeUIstates, record-stageboundaries, element/countcontrols extremes, token/filter/label/reset/nativepausedchecks, darkmobileworkings, actualreportdownloadindependentaudit/reload, finalfullregression/build andfrozenreview. Initialnext116planexistsbutremainsplanned.114reviewed/115inprogress;nextpush125.


## Browser verification completed; final gates running
Both actual guides reached150 seconds. Pausedstagechecks0/15/45/75/119.9/120/134.9disabledrecording;135/150enabled. At140whileplayingrecordingstayeddisabled. All38supportedisotopesselectedandcompletedthroughUIwithmatchingtoken counts andrecordeligibility.

Layoutproof:96initial2D+96initial3D+48largestAr40cases=240 acrosssixviewports,bothformats,normal/theatreandparticlefilters. No2DSVGtextclipping/pageoverflow;onecanvasinall3Dcases. Thisdoesnotcertifyphysicaldevices,FPS,touchorallcameraangles.

Five savedcomparisons(C12/C13,Ar40/C13,Cl37/Cl35,H1/H1,C13/C12),notes/plan/conclusionpersistedafterreload. Actual59835byteHTMLindependentlypassed200workedresults/410operands/275tablefields. Sixintegercountendpointsrecordonlycomplete states. Darkmobile390x844report40liveworkingsand5/10/10/5rowsnooverflow/noinjectedimages. Viewport/lightthemerestored.

Nativewheel/orbitchangedpixels;pausedframessamebytes. Labels,zoomin/out,resetallchangedpixels. Native3Dtokenpickselectedproton3duringconstruction. Noerrorlogentriesreturnedatlastinspection. Savedcurrent-3d-desktop.png;leftlocalChrome1331266177Theatre3DC12complete. CUAphaseclosedwithcompletion_summary.

LatestTypeScript7544terminal0emptylog. Finalbuild64354terminal0in16.20s. Genuineavailabilitydescriptionaddedafterviewerchecks. Finalfullregression32391wasliveonlastpoll;inspectterminalreceiptbeforemarkingready. Draftreviewhas25sourcehashes. All114priorreviewsand146pre-existingstagedblobsunchanged.116remainsplanned.


## CL-0115 internal review completed
Finalregression32391returnedterminal0:3483tests/3483passed/0failed in120.89s. LatestTypeScript7544terminal0,emptylog. Finalsourcebuild64354terminal0in16.20s. Froze25sourcehashesinreview.json, markedreviewfieldspassedandcatalogueready. All115priormanifestsvalidate. Thisisinternalfunctional/numericalreview,notindependenthumanexpertorofficialcurriculumcertification.

Regeneratedclasslist/progressandmirroredpublicJSON.115/270reviewed,next116planned. Reviewedcataloguebuild44764startedafterreadycountchange;inspectterminalreceiptbeforeclaimingdistreflects115.100published,nextpush125reviewed. NoGitindexmutation;146pre-existingstagedblobspreserved.

Localcurrent3DPNGviewedafterbrowserphaseclosedandshowedcompletedC12model/trays/labelswithintheatrecanvas. Next116planexistsbutnoimplementationclaimyet.

Reviewed-catalogue build44764subsequentlycompletedterminalexit0;productiondistrebuiltwith115reviewed.
