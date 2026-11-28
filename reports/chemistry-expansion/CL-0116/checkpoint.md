# CL-0116 implementation checkpoint

In progress, not ready.115/270 reviewed;116 next in progress. NextGitpush125reviewed;100published. No116viewer/controller/route/openingmetadata or completed-review claim.

## Core
AddedformalIons.ts with selected H–Ar isotope identities imported from frozen115, integer completed NET transfers (positive=gain, negative=loss), andnone/gain/loss travelling direction. Supported range -min(Z,3)..+3 is formal count exploration, not a physical stability/ground-state claim. No ion configurations assigned.

Reservoir starts20electrons with fixedpositivebackground20chargeunits. While a token travels it is removed from its source and counted in its own transit pool. Atom/reservoir/transit electron and charge inventories conserve exact integer totals. Nuclear identity andmassnumberremainfixed. Comparison and150secondguide:predict0–20,transfer20–110,verify110–130,compare130–150. Guide recordeligible>=130; controller must also requirepaused andnoinflighttoken.

Independent integer/Decimal audit passedall704 admissible formal states/29852 typed fields.16deliberatecorruptions rejected(includingerasedtravellingelectron,doubleendpointcount,wrongnuclearidentity,wrongchargesignanderasedsmallCcharge).

## Geometry
AddedformalIonsGeometry.ts withtwoinventorypanels,staticnuclearreference,explicittransferarc,stableelectronidentitiesand reversiblegain/lossendpointmapping. Gridsarecountslots,notorbitals. Eachinitialatomic/reservoirelectronhasexactlyoneowner(atom,reservoir,transit); travelledtokensare not counted at eitherendpoint. Sourceanddestinationpositionspinexactly;paused deterministic. Portraitpanelsstackvertically.

11focusedcore/geometrytests passedbeforelastboundary-test expansion. Full704statepartition tests coverbothformats,allknownisotopes,alladmissibledirections. Updatedcontinuitytestalsochecksinitial20/final110boundaries;rerunresultmustbeinspected. Core/geometryTypeScript abouttostart;inspectprocess/logbefore restarting.

## Outstanding
Practicalrecord/observationtables/charge-substitutions/examreport andindependentHTMLaudit;original2D/3Dviewers,manualcontrols/controller;actual150secondplaybackbothmodes;responsive/text/native/camerapools;notebookpersistence/download;finalregression/build/frozenreview. Keepreservoirbackgroundandgenericcharge-state limitationsvisible. ProvenanceinSOURCES.md. No backend/APIkey.

Latestfocusedrerun:11tests/11passed/0failedafterinitial/finalboundaryexpansion. TypeScriptcoregeometrysession92321runningatlastobservation;logcore-geometry-typescript.txt.


## Practical snapshots, independent report audit and first 2D viewer

Added formalIonsRecord.ts with validated input-only notebook, four observation tables, 27 worked blocks per snapshot, original notes, procedure/limits and exam-style HTML. Manual records must be completed references. Guided records may deliberately capture an intermediate travelling state, but must match the selected final target and actual guide time. Snapshot labels distinguish intermediate/transit snapshots from verified endpoints. Reaching a target at110seconds does not imply presentation verification at130seconds; tables show both checks.

Each snapshot includes the fixed nuclear identity, atomic/reservoir/in-transit electron and signed-charge counts, total conservation checks, inverse electron-from-charge substitutions, and elementary-charge-to-C conversions. No instrument reading, orbital/configuration, reaction or stability claim invented. All15 focused core/geometry/record tests passed; forged target/time/manual-travelling observations rejected.

Independent HTML audit passed20observations/540workedresults/1160operandchecks/760tablefields. It independently checks guided timing, snapshot classification, endpoint flags, all symbolic formulas, arithmetic operators/operands, result units and three pool rows.13 deliberate report corruptions rejected, including erased travelling electron and falsely verified endpoint.

Added FormalIonsDiagram.tsx (not yet routed or browser-tested): two count panels, fixed nucleus reference, explicit reservoir positive-background label, electron grids, moving third-account marker, current charge/electron sums, token filtering, pointer/keyboard selection and a select control for accessible token inspection. Token IDs can be toggled. Portrait stacks the panels; landscape places them side by side. Counts and total charge are read from model fields, not decorative fixed output. Header position adjusted to reserve room above portrait nucleus. Actual text/path bounds still need browser verification.

Core geometry TypeScript92321 and record TypeScript72750 returned terminal0 with empty logs. New diagram TypeScript started only after confirming72750terminal; inspect diagram-typescript.txt and live session before restarting. No CUA this turn. All115 prior review hashes validate;116 remains in progress, no route/opening metadata.

Next:3D viewer, shared controller/manual gain-loss controls and snapshot recorder, real150splayback both modes, parameter/isotope/phase/responsive/native tests, actual notebook reload/download audit, final regression/build and frozen internal review. Snapshot records are observations, not misleading lab-completion indicators. Nextpush125reviewed;100published.


## Integrated controller and initial browser checks — 28 November

Added the original FormalIonsScene 3D count panels, stable token selection, account filters, token IDs and working camera controls. Added FormalIonsLab with manual isotope/net-transfer references, 150-second guide, paused snapshot recording, four practical tables, 27 calculations per snapshot and downloadable exam report. Added the explicit development route in ChemistryHub. Catalogue implementation metadata remains withheld until the full review passes.

Integrated TypeScript returned exit 0 (session 89306); integrated Vite build returned exit 0 (session 57094). All 15 focused tests pass. Independent audits rechecked 704 states/29852 fields and 20 report observations/540 results/1160 operands/760 table fields. The existing 115 frozen review manifests validate, and all 146 pre-existing staged blobs are unchanged.

Chrome local route CL-0116 opens without captured warning/error logs. Initial eight theatre cases cover 390×844, 768×1024, 1366×768 and 1920×1080, both landscape and portrait: no document-width overflow. Evidence: browser-layout-initial.json and 2d-portrait-inflight.png. These are initial checks, not the final responsive review. The uninterrupted 2D 150-second sodium-loss guide was observed through prediction, separate travelling-electron account and arrival; final completion still needs capture. At 135.2 seconds no SVG text lay outside the rendered SVG bounds in desktop landscape.

Outstanding: finish/capture both complete guide modes; 3D visual and native camera interactions; expanded responsive/element/isotope/phase matrix; actual notebook reload/download and independent report audit; final regression and review freeze. This checkpoint does not mark CL-0116 reviewed.


2D guide completion now captured at exactly150seconds with Replay guide available and correct final Na23 counts10atomic/21reservoir/0travelling (2d-guide-completion.json). Browser visual review found two overlapping 3D summary sprites. Fixed their spacing from0.42to1.0worldunit, expanded their backing panel and portrait framing minimum accordingly. Confirmed the corrected desktop landscape visually; screenshot3d-summary-layout-fixed.png. Source build/TS results above precede this small JSX-only layout fix, so rerun final gates before review.

Started uninterrupted3D guide at2026-11-28T02:16:11.132Z, observedtimeline0.3 and canvaspresent. Browser tab1331266177 retained as unfinished workflow. Inspect actual timeline on continuation; do not restart solely because the turn ended. Both guide modes are not yet fully verified:3D still running at last observation.


## Theatre fitting and actual report — next review continuation

The 3D guide reached150 but switched briefly to2D during the responsive matrix; do not claim an uninterrupted3D run from that observation. A clean uninterrupted3D rerun was started2026-11-28T02:20:37.788Z at0.4seconds, mode3D (final-3d-guide-start.json). Inspect current tab1331266177/time before further action.

Found phone portrait needed scrolling to see the entire canvas. Added lab-scoped formalIons.css plus formal-ion-viewer/formal-ion-frame wrappers in both views. Theatre now sizes the visual against the actual remaining frame after tools/footer rather than a fixed360px subtraction. No frozen shared CSS changed. Also moved portrait3D summary lower and expanded framing to prevent overlap with reservoir count. Twenty-four final theatre cases across360x800,390x844,844x390,768x1024,1366x768,1920x1080, bothmodes/bothformats: no page overflow and visual fully within stage. Evidence theatre-fit-checks.json. Initial3D matrix was rechecked after fresh render to avoid stale React layout measurements (browser-3d-layout-initial.json).

Four actual notebook records saved: verified Na23 loss endpoint150s; manualCl35gain1; neutralCl35; pausedMg24loss snapshot42.5s (not endpoint). Plan/conclusion and literalHTML note survivedreload. Fixed unnecessary trailing decimals in displayed snapshot time usingString(time), retaining numeric value. Download completed toDownloads despite browser event observer timeout; actual filecopied tobrowser-practical.html. Independent auditor passed4observations/108workedresults/232operands/152tablefields. Injected-looking note remains text in DOM; no execution observed.

layout-fix-typescript session39388 terminal0, but later JSX/CSS/time-format edits postdate that run. New focused session23838 running at last observation; inspect same handle/log layout-final-focused-tests.txt. Remaining: finish uninterrupted3D; nativecamera/control/filter/keyboard checks; expanded isotope/phase/normal-layout checks; finalTS/build/regression and metadata/reviewfreeze. Keep115reviewed/116inprogress. Current corrected screenshot current-fitted-theatre.png. CUA phase closed; browser bindings now browser116/tab116/fs116 after timeoutkernelreset; old starch/ion bindings gone.


## Internal review complete

Final uninterrupted3D guide observed at35.7,84.1,141,147.1 and150seconds, continuously3D; completionJSON records replay available. Native paused frames byte-identical; wheel/orbit/reset/zoom/IDs/filter each changed output (native-camera-checks.json). All38 isotope choices passedUI counts and bounds. NineMg24 guide phases and keyboardA0 selection passed; six H/O/Ar manualminimum/maximum cases correctly disable the corresponding buttons. Twenty-four normal layouts withfour saved observations add to24theatre fit checks. No finalconsoleerrors.

Final TypeScript52304terminal0; fullregression5403terminal0, all3498passed in133.284s; sourcebuild65995terminal0,18.00s. Review.json freezes33sources. Catalogue now116ready and117inprogress; all116sourcehashmanifests validate viaupdate_progress.py. Generated classlists and publiccatalogue synchronized. Reviewed catalogue rebuild session46732 currentlyrunning; inspect same handle before restarting. Nextpublishingmilestone125;100published. CL-0117implementation-plan.md records scope.
