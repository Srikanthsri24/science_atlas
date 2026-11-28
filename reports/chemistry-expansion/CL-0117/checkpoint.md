# CL-0117 checkpoint

In progress. No route, viewer or reviewed-status claim yet. CL-0116 reviewed catalogue build46732 returnedterminal0 before this lab began;116ready/117inprogress ledger remains honest. All116 frozen source manifests validate.

Added valencyMolecules.ts: eight selected neutral closed-shell targets (H2,Cl2,HCl,H2O,NH3,CH4,N2,CO2), per-atom neutral valence allowances, explicit target connectivity, placed/tray inventory, single/double/triple bond orders and explicit lone-pair allocation. Each bond-order increment allocates one bookkeeping electron from each endpoint; valence/electron allowance excess rejected. Unassigned placed-atom electrons stay separately counted. Incomplete valid drawings are constructions, never identified physical species. Alternative H-H connection in water inventory remains unfinished and blocks overbonding.

Selected geometry references: bentH2O104.5°, pyramidalNH3106.7° (NIST indexed neutral table), regular tetrahedralCH4 angleacos(-1/3), linearCO2. Equal display bondlength2.2arbitraryunits is not a measured molecular length. No orbitals, rates, energies or stability solver. Sources privately retained inSOURCES.md; no student referral links.

Guide150seconds: predict0–15; sequential atom placement, then bond-order allocation, then lone-pair allocation uniformly over15–125; verify125–140; interpret140–150. This stages diagram building, not chemical synthesis. Guide returns activeaction/progress for future moving apparatus tokens. Recordable guide phase>=140, futurecontroller must also require paused and completed construction. Manual incomplete records should not masquerade as completed practical results; decide explicit observation labelling in record implementation.

Seven focused tests passed, including known electron/bond/lone-pair totals, all incremental states, wrong connectivity, rejected invalid inputs, 0.1second guide sampling, geometry angles and nonmutation. Independent Python audit with hardcoded target identities/connectivity verified12076 constructions/514833integerfields.15 deliberate corruptions rejected. Evidence core-tests.txt, core-reference.json, core-validation.txt, core-mutation-checks.json. TypeScript84283 returnedterminal0; the later ammonia numeric refinement/progressclamp followed its start, so final integrated gates still required later.

Next: geometry interpolation/stable atom/bond/pair identities, complete 2D/3D builder interfaces with working interactions and undo/reset; observation tables, worked substitutions/examHTML and independent actualreport audit; actual150second playback bothmodes, responsive and nativecontrols; fullregression/build and frozeninternalreview. Preserve all earlier frozen sources. No backend/APIkey. Next push125reviewed;100published.


## Geometry and practical record implementation

Added valencyMoleculesGeometry.ts: stable atom tokens, landscape side tray/portrait bottom tray, smooth atom movement, growing single/double/triple bond annotations with continuous offset changes and explicit pending shared/nonbonding electron markers. Pending annotations are not committed inventory electrons. Moving atoms remain in unplaced inventory until committed. Geometry validates the active action against actual allowances; malformed/unknown actions rejected. Lone-pair slots have stable positions even for extra allowed pairs in unfinished manual constructions. World positions are schematic, not physical electron trajectories. Tests check atom identity, exact arrival continuity for all actions/references/formats, pending-vs-committed pair counts, deterministic pause, geometry angles and non-target unfinished allocations.

Added valencyMoleculesRecord.ts: strict timed-snapshot matching to guide state, input-only notebook up to40trials, separate unfinished/completed-before-verification/verified/manual labels. Four tables: preparation, atom/local-shell accounts, bonds, and conserved electron inventory/completion. Each snapshot has9global+6peratom worked substitutions with integer units. Global local-shell sum explicitly counts shared electrons twice, unlike the conserved inventory. Original procedure, model-materials/aim/result/conclusion, safety/limitations and escapedHTML export; literalstudentmarkup stays text. Manualunfinished observations deliberately allowed and labelled; they cannot become verified endpoints.

All16 focused core/geometry/record tests pass. GeometryTypeScript21213terminal0. Newrecord integratedTypeScript tostart next; inspect livehandle/logbefore restarting. Independent report audit, actual2D/3Dcomponents/controller and browser checks still outstanding. No labroute or availabilitymetadata yet; CL-0117 remainsinprogress. Preserve frozen116sources.


## Integrated studio and first browser construction

Added ValencyMoleculesViewer.tsx with original SVG connectivity view and R3F spatial shape view, stable selectable atoms, pending shared/nonbonding markers, annotation/ID toggles and zoom/reset controls. Added lab-scoped valencyMolecules.css with actual-space theatre fitting. Added ValencyMoleculesLab.tsx: target selection, place/return atom, add/remove shared pairs and lone pairs, undo/reset, guide/manual switching, paused snapshot recorder, notebook tables/workings and HTMLdownload. Explicit CL-0117developmentroute added inChemistryHub; no implemented-catalogue metadata until review.

All16 focused tests passed again. Prior recordTypeScript20794terminal0. IntegratedTypeScript97918running at last observation; its run began before localAtomLabel refinement, so rerun finalgates after all edits. Inspect livehandle/log before restarting.

Actual Chrome UI: manuallyplaced o,h1,h2, added bothO-H shared pairs, addedtwo oxygen lonepairs, observedCompleted selectedLewisreference andrecorded1snapshot. 3D model rendered. Fixed unreadablysmall atom-ID sprites with a local higher-density AtomLabel and moved them below atoms to avoid electronpair annotations; no frozen shared primitives changed. First3Dwater screenshot savedfirst-3d-water.png.

Full2Dguide started2026-11-28T02:38:17.606Z at0.3seconds, 2Dview (2d-guide-start.json). Tab1331266177retained asunfinishedworkflow. On continuation inspect actualtimeline instead of restarting because the turn ended. CUAphaseclosed; browser116/tab117/fs116bindings validlastseen.

Still outstanding: independent reportaudit/mutations andactualdownload; finishboth150secondguides; alltargets/manualwrongconnectivity/undo/removal/phaseboundary UIchecks; responsive matrix/nativecamera/keyboard; finalregression/build/TypeScript and frozenreview. CL-0117remainsinprogress;116reviewed and100published, nextpush125.


## Independent report audit and complete2Dguide

Added independent PythonHTMLparser/reference auditor: validates timed input reconstruction, selected connectivity/element counts, labels and verification flags, allfour tables, every symbolic formula, arithmetic operand/operator tree, integer result and unit. Exported31reference observations acrossall8targets and guided42.5/125/139.9/140/150s states. Passed765workedresults/2011operandchecks/1604tablefields. Twelve deliberate corruptions rejected (formula,unit,operator,operand,result,unfinished/verifiedlabel,header,atomlocation,electroninventory,time,duplicateworkingkey). Filesexport_valency_molecules_report.mjs,validate_valency_molecules_report.py,test_valency_molecules_report_mutations.py andreport-validation.txt/report-mutation-checks.json.

2Dguide remained2D through actual150seconds; finalwater3atoms/2sharedpairs/2lonepairs/residual0 withreplayavailable. Captured2d-guide-completion.json andcompleted-2d-water.png. Twelve2Dtheatre cases across360x800,390x844,844x390,768x1024,1366x768,1920x1080 andbothformats: noSVGtext outside renderedSVG, pageoverflow orvisualoutside-stage. Evidence2d-theatre-initial-checks.json;viewport restored.

3Dguide started2026-11-28T02:41:25.090Z,observed0.6seconds/mode3D (3d-guide-start.json). Browser tab1331266177 retainedunfinishedworkflow; inspect currenttimeoncontinuation,donotrestartjustbecauseofturnend. CUAphaseclosed.

Newviewer-final-TypeScript session50998 stillrunning atlastobservation; inspect samehandle/log. Integratedbuild31988 polled afterstart; inspectterminal/log before rerunning. Outstanding alltargetmanualconstruction/undo/removal/incorrectconnectivityUIchecks, full3Dguideandnativecamera/responsivechecks, actualnotebookreload/downloadHTMLaudit, finalregression/metadata/build/frozenreview.116ready;117inprogress.


## Internal review complete

Fulluninterrupted3Dguide reached150/replay (3d-guide-completion.json). Native paused/wheel/orbit/reset/zoom/pair/IDchecks passed. All8molecule references constructed manually throughUI, includingN2triple/CO2doublebonds. FourCO2removal/reset actions becomeunfinished and Undo restores complete; wrongH-H water remainsunfinished. KeyboardEnterselection works. Nineinitialrecords/plan/conclusion/literalHTMLnote survivedreload;14records afterwrongconnectionandguided42.5/125/139.9/140observations. Actual100671byteHTMLdownload passed372workings/998operands/833tablefields (browser-report-validation.txt).

12theatre3Dcases pass;24normalcases with14record tables pass, supplement12theatre2Dcases. No horizontaloverflow or injectedimages. Finalconsoleerrors empty. Fullregression78335terminal0:3515passed122.776s, includes expandedexhaustivegraphtest. ViewerTypeScript50998terminal0; sourcebuild31988terminal0/14.27s. Frozenreview30sources; all117prior/currentreviewmanifests validate. Catalogue117ready/118inprogress, publiccatalogue/lists synchronized. Reviewedcatalogue rebuildrunning (see live session returned in tools); inspect before restarting. Nextpush125reviewed;100published.
