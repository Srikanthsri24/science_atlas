# CL-0120 implementation checkpoint

In progress, not reviewed. Core src/lib/chemistry/ionicPhaseComparison.ts and six meaningful tests added; core-tests.txt passes. Paired material is KCl (same verified aqueous reference as CL0119), not NaCl. Solid is explicitly a fixed-lattice ideal transport model; solid conductivity remains null, not a fabricated measured zero. Connected dry/solid apparatus retains applied voltage, inverse readings unavailable. Water retains tiny positive current. Dissolution storyboard is explanatory, never a fabricated conductivity interpolation. 150-second staged guide supplied.

Remaining: original geometry/2D/3D apparatus and explanatory hydration transition, controller, practical tables/worked report, independent numerical/report audit, both uninterrupted guides, native controls/responsive/persistence/download checks, final gates and source-hash review. Do not expose this lab as ready yet. CL0119 reviewed catalogue production build session18051 exited0.119reviewed/270;100published; nextpush125.

## Structural geometry and practical record

Added ionicPhaseGeometry.ts: 24 stable equal-sign-count KCl ions, alternating nearest-neighbour lattice, identity-preserving separation, schematic four-water orientation (O toward K+, H side toward Cl−), bounded opposite AC drift only for excited solution, explicit structural inset scope. Dissolution illustration does not turn on current or interpolate conductivity. Water mode deliberately has no KCl ions; its carrier description identifies H3O+/OH−, and quantitative current remains positive.

Added ionicPhaseRecord.ts: explicit manual/timed provenance validation, three observation tables, applicable SI calculations/substitution/results and unavailable inverse readings, solid transport model condition distinguished from unmeasured solid conductivity. Original exam-style HTML aim/apparatus/safety/procedure/plan/results/limits, escaped notes and embedded original inputs. Paired KCl reference retained in water rows. Sixteen focused model/geometry/report tests passed before final table-label correction; rerun on continuation. Viewers/controller and independent audit not built; CL0120 remains in progress.119/270 reviewed. Next push125.

## Structure viewer implementation

Added IonicStructureViewer.tsx, a structural inset (not yet a complete routed apparatus): selectable 2D projected ions and 3D R3F ions, schematic oxygen/hydrogen water geometry, hydration/lattice visibility controls, native orbit and reset via established BenchStudio, keyboard/select ion access. Uses same deterministic geometry in both views; no decorative duplicate physics. Water inset explicitly says no added KCl ions. Controller/circuit apparatus integration and runtime visual testing remain required before any ready claim.

Latest focused tests rerun after table-label correction:16passed. Core/report TypeScript session40523 and structure TypeScript session20829 started; inspect authoritative terminal handles/logs before rerunning. No browser checks yet for CL0120. Ledger119reviewed/120inprogress unchanged; nextpush125.

## Integrated controller, circuit and first complete guide

Added IonicPhaseViewer.tsx original SVG/3D low-voltage apparatus, source, contacts, material volume and wires, reusing verified119wirepath geometry with solid transport explicitly disabled. Readouts use120state, retaining applied voltage on solid/dry controls. Structure inset now supports externally chosen2D/3D mode and accessible ion selection. IonicPhaseLab.tsx integrates150s staged guide, 4s AC preview, material/reference/geometry/source/phase controls, paused observation gate, persisted notebook, three tables, worked calculations, HTML export. CL0120 development route wired in ChemistryHub; catalogue remains in_progress, no ready claim.

Integrated TypeScript77885 exited0; build57926 log says built11.37s (poll terminal if needed). Sixteenfocusedtests passed. Independent3240circuits/42120typedfields passed;11corruptionsrejected. Independent27reportobservations/252blocks passed includingformula/operator/operand/unit/table/provenance checks;10reportcorruptionsrejected. No clamp or absolute tolerance erases tinypositivewatercurrent. Added export/validate/mutation scripts core and report.

BrowseractualCL0120opened. Firsttheatrecheck exposed stagechildheight:auto!important inheritedfromcommonCSS, clippingapparatus. Localspecificheight100%!important fixesstage; readoutsnowinsidebounds. Structurelightthemeonnavytextcontrastfixed andlatticeprojectionenlarged. Fulluninterrupted2Dguide completed150withReplayguide evidence2d-guide-completion.json/completed-2d.png. Dissolutionstageactualscreenshotinspected; stagedexplanatorysolidreadingremains0untilsolution.

3Dapparatusrenderedandinspected. AttemptedoffscreenWatchbuttonintheatrehadnoeffect;visibleReplayguidebuttonsuccessfullystartedactual3Drun.3d-guide-start.jsonoverwrittenwithactualactivetimeline/Pausevisible. Currenttab1331266177URLCL0120in3DTheatrerunning150sguide; preserveandinspectactualtimelineoncontinuation,do not restartsolelyturnboundary. Browser116/tab120/fs116bindingspersist; CUAphaseclosed. No viewportoverridechanged. No final3Dcompletionyet. Need nativecamera/toggles, allcontrols/phase/source/bounds, responsivebothmodes/apparatus-structure, actualnotebookpersist/downloadaudit, finalgates/reviewfreeze. Source3Dstillminimalbeakerwalls—improveapparatusglassandnormalizedwaveformifneededaftercurrentrun,withrelevantrechecks.119/270reviewed;100published;nextpush125.

## Continued3Dplayback and initial responsive checks

Resumed actual retained3Dguide at33.9seconds (no restart). Inspected3Ddissolutionstage52.7s andmobileaqueousstage screenshot; textreadable aftercontrastfix. 12 initial3DTheatrelayoutcases across6sizes/bothformats passedoverflow/stagefit/canvaspresence, evidenceinitial-3d-theatre-layouts.json (takenwaterstage104.8–108.8s). Viewportrestored. Currentguide137.6secondsandstillplaying,notyetcompletionproof. Existingbrowser116/tab120/viewport116/fs116bindingsremain.

AddedprivateSOURCES.md referencing officialOpenStaxindexedtext forsolid/solutiontransportandwaterorientation, with119NISTprovenance retained. Addedwaterangle/bondgeometrytest;17focusedtestspass. Fullregression started session9869 andpolledlive; inspectsamehandle before rerun.146pre-existingstagedblobsverifiedunchanged.

Next: verifyactual3D150/replaybeforeediting. Refineapparatusglassandtheatreaspectpreservation (currentstagefits but selectedformatdoesnotstrictlyconstraininnercanvas); retestrelevantviewsandlayouts. Thenmanual/recordcontrols/nativeorbit/download/persistencechecks andfinalreview.119ready/120inprogress,notyetpush125.

## Completed3Dguide, aspect refinements, actual notebook export

Actual3Dguide completed150/Replayguide, no consoleerrors; evidence3d-guide-completion.json/completed-3d.png. Full2Dand3Druns preceded subsequent display-onlyglass/aspect changes. Addedoriginaltransparentvesselwalls andinnerapparatusframe preserving16:9/9:16; matchedstructureinnerframe added.48refinedTheatrecasespassed across2modes,2panels,2formats,6sizes, exactratio/fit/overflow/visualpresence; evidence refined-theatre-layouts.json. Actualdesktopportraitapparatusinspected. Viewportrestored.

Recordedmanualsolution,solid,watercontrols; actualtables matched70.4115µA,0idealtransport,0.00275µA respectively. Addedplan/conclusion/literalHTMLnote, reloaded. Actual12729byteHTMLdownload recoveredfromDownloads after browserdownloadawait timedoutandresetCUAkernel. Copiedbrowser-practical.html; independentbrowser-report-validation.txt passed3observations/28blocks; escapedoriginalnote retained. Persistence is evidencedbyactualdownloadafterreload; no screenshotofnotebookyet.

CUAkernelresetmeansbrowser116/tab120/fs116/viewport116bindingsmaybelost. SelectedChromeID1mustbereused. RestoreCua docs, getBrowserID1, nameSession, recoveruserTab1331266177URLCL0120normalview. Lastmodeafterreload2D/defaultsolid. CUAphaseclosedwithcompletion_summary. Do not claim remainingcontrols/nativecamera/responsivenormalviewsverified.

Fullregression9869terminal1: ONLYfailurecatalogueopeningmetadatafornewrouteCL0120 (allother3573tests passed; inspectsummarycount). AddedhonestimplementeddescriptioninlabPresentations.ts (notreadyclaim). Targetedcataloguenavigationtestspassed. ApparatusrefinementTypeScript41969terminal0, beforestructurewrapperchange; finalTypeScript/buildstillneededafterallrefinements.17focusedtests pass. Need manualallreferences/source/phase/rangebounds/previewrecordgates, guideprovenanceobservations, nativecameraandvisibility, normalresponsive/darknotebook, actualexpandednotebookdownloadseveralcontrols, finalgatesandre-frozenreview.119ready/120inprogress;nextpush125.

## Control/camera/notebook checks and final gates running

RecoveredCUAwithbrowser120ChromeID1/tab120bclaimed1331266177;fs120,viewport120,nativeTab120bindingsnowpersist. Actual9reference/materialcombinations passed;8rangeboundsplusdisconnectedsourcepassed(reference-controls.json,boundary-controls.json).5quartercyclephases showed correctinstantaneoussign/zeroswhileRMSpositive. Previewdisablesrecordingandpauseenables(phase-preview-checks.json). Fourtimedrecordsat55/139.9/140/150preservedbase/timeandlabels(guided-observation-checks.json).30observationstotal.

Native3Dstructuralorbit/wheel/resetchangedpixels; pausedframesbyte-identical,hydrationtogglechangedpixelsandselecttextcorrect(native-controls.json). Orbitcheckrerunwithbefore/afterframesafterselectiontoavoidfalsepositive. ActualkeyboardEnterselectedchloridein2D;solidlatticeguidestogglechangedpixels. Wiretogglechangedpixels. Apparatusnativeorbit/wheel/resetalltrue(apparatus-camera-checks.json). No finalconsoleerrors.

48normalresponsivecasesrevealed2DlandscapemateriallabelandlowerbeakeroutsideviewBoxatall6sizes. Fixedprojectionbaseline610->540andmateriallabeloffset35->18.12followup2Dapparatuscases(bothformats/sixsizes)passedalltextandrectbounds/nooverflow, corrected-2d-apparatus-layouts.json. Other36initialnormalcasespassed; originalfailureevidenceretainednormal-responsive-layouts.json. Previous48theatrecasespassed,followupcorrectiononlymoves2Dapparatuswithinbounds.

Darkmobile390x844notebookpassednooverflow,3tablesall30rows,11applicablecurrentworks,noinjectedimages;planandliteralHTMLnoteretained. Screenshotdark-mobile-notebook.png. Restoredlight/defaultviewport. Actualexpanded94311byteHTMLdownloadcopiedbrowser-practical-expanded.html;independent30observations/305workedblockspass. Validatornowchecksfulltableheaders/unitsalongsideformula/operator/operand/value/provenance;12reportcorruptionsrejected. Finaldesktopreviewed-desktop.pngsavedin3DsolidstructureTheatre. CUAphaseclosed.

Finalgatehandles:TypeScript60185->final-typescript.txt;Vite75991->final-build.txt;regression94304->final-regression.txt. Inspectandpollsamehandlesoncontinuation,donotrestartsolelytimeout. PriorrefinedTS82750exit0; firstfullregression3573passed/1metadatafailurefixedandtargetednavtestpassed. Newfullrunverifiescorrectedmetadata. Needfinalgatepass,sourcehashfreeze119dependencycore/geometryandall120sources/tests/scripts pluscommonimports;update120ready/121inprogress/generatecatalogue/copypublic/rebuildreadycatalogue. Keepnoexpert/officialboardclaim.119ready/270;nextpush125;100published.

Finalbuild75991terminal0,built17.36s. TypeScript60185andregression94304lastpolledlive; do not restart. AddedplannedCL0121implementation-plan.mdfromactualcataloguetitle(waterelectrolysis/gas-volumeaccounting),statusstillplanneduntil120gatesclose.

## Review closed

FinalTypeScript60185exit0,build75991exit0,regression94304exit0(3574passed/0failed). Frozenreview.jsonwith28sourcehashesandexplicitinternalscope. CL0120ready;CL0121inprogress.120/270reviewed;100published;nextpush125.
