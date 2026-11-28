# CL-0113 implementation checkpoint

In progress; not ready and not counted completed. Reviewed catalogue remains 112/270. Last published batch 100; next push boundary 125. Goal remains active.

Implemented:
- Four prepared references: selected starch, half-starch plus glucose, matched glucose and water.
- Separate finite 2 mL stock, withdrawn/held pipette and delivered vial inventories, including iodine-equivalents, potassium/iodide inventory and carrier mass. No real-food composition inferred.
- Stable selected apparent one-capacity-unit association model with bounded associated/unassociated iodine-equivalent amounts. Capacity and Kd are teaching assumptions, not calibrated starch constants or resolved polyiodide species. Colour cue is qualitative and is not a visibility/detection prediction.
- Six-stage 120-second guide definition: prepare/withdraw/position/dispense/mix/interpret. Numeric endpoint assumes complete mixing. No browser playback has been performed or claimed.

Verification:
- Eight focused core tests passed, including hand calculations, 486 parameter preparations, transfer constraints, zero controls, small positive association and guide bounds.
- Independent 80-digit Decimal reference uses the alternate quadratic-root expression: 624 preparations / 2496 cells / 119808 typed field checks passed.
- Eighteen deliberately corrupted results rejected, including erased trace association and a small held reagent inventory. Remaining-volume cancellation allowances do not weaken direct association checks.
- TypeScript completed with terminal exit 0 and empty log.
- All 112 prior review manifests still validate. All 146 pre-existing staged blobs preserved.

Outstanding: practical record and independent report checks; physical pipette/stock/vial geometry; original 2D/3D apparatus plus labelled schematic helix association; controller/route; complete ≥60-second playback (target 120 s); responsive/text/camera/native input checks; observation eligibility before complete mixing; notebook persistence and actual download audit; final build/regression gates and frozen internal review. Do not add ready/implemented metadata until those requirements are actually met.

Scientific limits to preserve: iodine and iodide are both present; iodide inventory is not assigned into free/complexed species. Apparent capacity units are not glucose monomers, I3-only chains or the mass of a complete starch complex. No calibrated RGB, absorbance, detection threshold, hydrolysis or reaction-rate prediction. Initial no-iodine controls are not negative starch-test conclusions. Sources remain internal engineering provenance, with company-only referrals in the student interface.


## 28 November: practical record, report audit and apparatus geometry
- Added validated input-only practical records, preparation/transfer/response/material-account tables, and 176 worked calculations per observation (44 per control). Null ratios explicitly remain undefined. Original notes are escaped in HTML and input payloads remain reloadable.
- Independent HTML audit passed nine selected preparations: 1584 worked results, 6084 operand checks, 855 table-field checks and 34 undefined results. All table headers/units are checked exactly. Ten deliberately corrupted reports rejected (results, units, arithmetic, missing/duplicate work, table units, control interpretation and identity).
- Core/record/geometry focused suite: 16 tests passed. Geometry covers finite nominal polygon volumes, continuous pipette clearance/transfer, endpoint observation gating and separate left-handed schematic helix coordinates. Geometry/record TypeScript check completed without diagnostics (process no longer live; no retained terminal receipt from the previous context).
- Added the first original 2D SVG apparatus component, including moving pipette/plunger, finite liquid levels, staged delivery droplets and qualitative contact/mixing streaks. This component is not yet routed or browser-reviewed. A fresh TypeScript process was started for the component; inspect its authoritative session/log before restarting.

Still outstanding: 3D scene, schematic helix presentation, controller and route, actual 120-second playback and responsive/text/native/camera checks, notebook persistence/download audit, final build/regression and frozen review. Catalogue remains 112 reviewed, CL-0113 in progress. No batch push is due until 125 reviewed.

Latest verification: re-ran all 16 focused core/record/geometry tests successfully; independent report validation and all 10 corruption checks passed after exact table-header verification was added. TypeScript session 28052 was still confirmed active on the last poll; log is `diagram-typescript.txt`. Do not restart solely because it has not returned yet. The SVG placement was adjusted to reserve title space above the raised pipette; visual browser validation remains outstanding.

TypeScript session 28052 subsequently completed with terminal exit 0 and no diagnostics. Last SVG edits after that process began only adjusted placement arithmetic and labels; final integrated checks are still required.


## Integrated viewer implementation and initial browser checks
Added original 3D stock/vial/pipette/plunger apparatus, finite liquid levels and delivery droplets, mixing rods and qualitative streaks; rotate/pan/zoom/reset, inspection, labels and wall cutaway. Separate nm-scale helix reference prevents conflating molecular and apparatus scales. Portrait 3D uses a two-by-two apparatus layout (not yet covered by the initial responsive matrix, which predates this refinement).
Added controller, route, persistent notebook, four observation tables, all 176 workings and HTML practical download. Record gating is paused plus manual mixed endpoint or guided time >=95. Coupled transfer sliders preserve delivered<=withdrawn; target controls and staged readings remain separate. Added live inventory/readings cards shared by both viewers.
- Browser route opened successfully in existing Chrome tab 1331266177 on local port5182.
- Initial 16 normal-layout viewport cases (390x844,768x1024,1366x768,1920x1080; 2D/3D; both formats) had zero horizontal document overflow. This is an initial bounds check, not comprehensive visual/native testing.
- Found theatre canvas sizing overridden by inline width100%; removed that inline width, applied the existing responsive visual class and verified desktop canvas1134.22x637.99, bottom776.99 within998px viewport.
- Actual 2D guide observed at21.5,43.8,59.4,88.4,106.5,117.5 and completed120 seconds. Record button disabled while playing, enabled at completed120. Saved browser evidence in 2d-playback-running.json and 2d-playback-end.json. Two browser observations recorded (initial manual reference and completed guided reference),352 workings. Plan, conclusion and a literal HTML note entered through UI.
- Full 3D120s guide started after 2D completion; inspect actual timeline before claiming completion or restarting. Browser bindings starchBrowser113/starchTab113/starchViewport113/starchFs113 persist.
- Integrated TypeScript session57942 returned terminal0 with emptylog BEFORE readings/portrait refinements. Integrated Vite build session25972 terminal0 predates latest refinements. Full regression session43911 and later TypeScript31266 were still active on last poll. Do not restart live processes.
Remaining: actual full3D completion, report download and independent audit, notebook reload, stage/controls/device/format/helix/native testing and screenshots, final latestsourcebuild/checks; catalogue remains112 reviewed and113inprogress. Route exists for development but no ready metadata added.


## Latest browser/report results and gate status
- Full3D guide subsequently reached120; saved `3d-playback-end.json` (canvas1, record enabled). Its start was observed immediately after2D completion; no claim of frame-by-frame inspection of every3D moment.
- Recorded three additional manual controls: held1.5/delivered0.5mL, no transfer, no iodine. Five total observations persist after reload, including literal HTML note, plan and conclusion.
- Browser HTML download copied to `browser-practical.html`,317840bytes. Independent report audit passed5trials/880worked results/3380operands/475tablefields/18undefined ratios.
- Portrait3D now uses2x2 placement. Mobile390x844 theatre canvas bounds58.875..331.125x234..718; no horizontal overflow. Single-starch inspection selected throughUI; selected option value should be read from DOM property rather than attribute (getAttribute returnednull, not evidence of failure).
- Saved `mobile-3d-single.png` and `current-3d-delivery.png`. Browser left on single-starch3D deliverystage55, theatre, defaultviewport restored. CUA phase closed with completion summary. Native gestures, complete stage/format/inspection/label matrices, post-refinement dark/mobile checks still outstanding.
- TypeScript31266 terminalexit0 emptylog. Fullregression43911 terminalexit1: one catalogue consistency failure, CL0113 developmentroute lacks openingmetadata. Do not weaken this test or claim fullsuitepasses. Ready status is deliberately pending finalreview; decide finalmetadata only afterremainingverification.
- Latest production build started separately afterreadings/portrait/nominalradius refinements; inspect current process/session before restarting. Priorbuild25972 passed but predatesrefinements.
- Revalidated112priorreviews and146pre-existingstagedblobs unchanged. No push yet; nextboundary125reviewed.


## Final review matrices and controls (28 November)
- Latest pre-catalogue-description production build85242 completed terminal0 in14.56s.
- Browser matrix240cases: six viewport dimensions, two formats, all/four single-reference scopes, normal/theatre;1202D and1203D. No horizontal document overflow; all2D text bounds insideSVG; canvascount1 in3D. This does not certify physical devices, frame rate or arbitrary camera positions.
- Native wheel and drag changed canvas pixels, time/readings remainedpaused55. Paused screenshots byte-identical. Labels, cutaway, zoom-in/out, helix toggle changed pixels. Initial reset check made nochange after zoom-out had already restoredcamera; separate zoom-in/reset check changedpixels successfully. Detailed `native-and-controls.json` preservesboth.
- Nine paused stages tested0,15,30,40,55,70,94.9,95,120: recorddisabled iff time<95. First tool attempt hit malformed floatingpoint string94.80000000000001; fixed test input usingone-decimalformat, no application change.
- Fourteen min/max parameter cases satisfy bounds, step multiples and delivered<=withdrawn. BrowserDOM wrapper does not exposecheckValidity(); checkedactual min/max/step/value properties independently instead.
- Darkmobile390x844 report withall176liveworkings, fourtables5/20/20/20rows, no injectedimages and zero pageoverflow. Lighttheme/defaultviewportrestored. No consoleerrorsreturned during finalinspection. Saved `reviewed-3d-desktop.png`.
- Added genuine implemented-lab description afterviewerchecks; final18focusedtests nowpass includingcataloguerouteconsistency. Finalfullregression28587 andTypeScript79672confirmedlive, logs`final-regression.txt`/`final-typescript.txt`; awaitterminalreceiptsbeforemarkingready. Both commands startedagainstlatestappsourceanddescription. No sourcechangedafterstart.
- Nextlab114researchplancreatedseparately; remainsplanned, notcountedasimplemented.


## Review completed
Final TypeScript79672 terminal0, emptylog. Final fullregression28587 terminal0:3450tests,3450passed,0failed in119.44s. Finalsourcebuild1908 terminal0 in14.54s. Createdpassedinternalreview.json with31frozen sourcehashes, updatedlabstatusready andregeneratedclasslist/progress. Authoritativeledgernow113/270reviewed;114nextplanned. All113reviewmanifestsvalidateand146pre-existingstagedblobsunchanged.
This is an internal functional/numerical review with explicitscientificlimits, not humanexpert/officialboardcertification. Priorpendingdraftretainedasimplementationhistory;review.json isauthoritative.
Reviewedcatalogueproductionrebuild42963startedafterreadycountupdate;inspectterminalreceiptbeforeclaimingdistreflects113. Nextpushboundary125;publishedcountremains100. Next114hasinitialprivateimplementationplan,notimplemented.

Reviewed-catalogue build42963 subsequently completed with terminalexit0; productiondist rebuilt with113reviewedcatalogue.
