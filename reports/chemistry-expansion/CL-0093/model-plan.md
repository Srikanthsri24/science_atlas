# CL-0093 · Classify solutions with litmus indicators

In progress. First Class7 investigation. No implementation or passed-review claim yet.

Original practical: fresh red and blue litmus papers on a white test tile,clean sample dropper,known acid/base/water controls and a test sample. The student records BOTH papers' initial and final colours before inferring a classification. Animate preparation,sample delivery,contact inspection and comparison for120s. Treat presentation time separately from chemical kinetics;do not invent a rate law or chromatographic colour front.

Primary product evidence supports a broad red-to-blue endpoint interval,not an exact pH meter. Do not colour an acidic bulk solution red just because a paper turns red. Show the colour only on the wetted indicator area;solutions can remain clear. Near-transition samples must permit an inconclusive result. No unchanged-paper observation alone proves a precisely neutral solution. A conditioned red/blue paper test is not equivalent to a single pure indicator dye at instantaneous equilibrium;avoid an unsupported single-pKa interpolation of all litmus colours.

Potential advanced calculation:ideal dilute monoprotic strong acid/base dilution at25°C,including water autoionization so extreme dilution approaches neutrality without crossing it. Source and validate Kw,activity assumptions and charge balance before coding this. Paper material/acid-base loading and assay response must be explicitly limited;do not infer real sample pH from a decorative RGB blend. Basic class lesson should prioritize paired qualitative observations. No household sample has an exact fabricated pH;use chosen reference solutions.

Three-table notebook should include preparation/reference controls,paired paper observations and inference/limitations. Formula substitutions only where applicable:sample/dilution volumes and any actually implemented ideal concentration model. Original exam-style aim,apparatus,procedure,observations,result and student conclusion. Independent report checks,actual120s2D+3D playback,controls,persistence and normal/theatre responsive matrices required before ready. Product references remain company-only. Official board/year mapping pending.

## Implemented core checkpoint

litmusTests.ts andninefocused tests now implement the ideal25°Cprepared-reference calculation,paired qualitative endpoints,conserved sample/aliquot volumes and reference-solute moles,and120sordered two-paper sequence. UBCprimary dilute-acid example and501independent log-space bisection pairs agree. Waterproduct/charge/inventory tests cover9072states. SeeSOURCES.mdfor final chosen controls andassumptions;originalpotential-model questions above are resolved there. Notebook,geometry,2D/3Dviewers,actualGUI/export andresponsive review remain unfinished. Do not mark ready.

## Full implementation and verification checkpoint

Notebook,23worked calculation blocks,3split tables,exact input reconstruction,safe exam-styleHTMLexport,original2D/3Dgeometry andviewers,route andregistry now implemented.13science+2navigation15focused testsPASS;full3125regressionPASS;TypeScript94095PASSexit0;Vite46798PASS/build11.71s. Synthetic9trials953independentchecks207blocksPASS;actual16GUItrials1694checks368blocksPASS.360normal/48theatre/24transientlayoutsPASSaftershorteninganoverlongportraitfooter. Bothpapercontactareas remainseparatefromclearbulkliquid;approachmovementanddeliverymarkersfollowoneclock. Known-water/transitionlimitationspreserved. Final3Dreplayonlatestfixedsourceactuallycompleted120s,asdidthefinalrefined2Dguide;noofficialorindependent-expertcertification.

Internalreviewnowpassed;see review.json. AftertheuserunlockedMac,nativeappdragfailedwithnoWindowsAvailable,butdirectbrowser-tabdragandwheelinputvisiblyorbited/zoomedthepausedscene. Savedbefore/afterproofandnative-gesture-check.json. Touch/rightbuttonpanremainunverified. Camera,theme,viewportandnormalmode restored.
