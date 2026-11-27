# CL-0092 · Record and compare repeat measurements

Frontend,notebook,geometry and both viewers now implemented;final internal review is recorded in review.json after verification gates pass.

Use an original digital-balance investigation: repeatedly place the SAME sealed specimen on a balance, wait for a settled reading, record it, remove it, and repeat. Reference specimen mass is known only within this simulation. Compare displayed raw and zero-corrected measurements, mean, range, sample standard deviation and repeatability-only standard uncertainty of the mean. Basic view explains mean/range; advanced statistics must define assumptions and avoid treating repeatability as a complete uncertainty budget.

Reference mass10–100g, chosen loaded-reading noise SD0–1g, fixed zero offset−2..2g, display step0.01/0.1/1g,2–20readings, reproducible seed1–1,000,000. Readings are independently generated pseudo-normal teaching samples then quantized. The empty indication is the same fixed zero offset quantized to the same step (no random empty noise in this simplified model). Correct each displayed loaded reading by subtracting that empty indication. This removes the displayed zero offset but leaves any sub-step residual; repeated readings cannot identify unknown systematic effects or certify the balance. No real data or calibration claim.

Report n, sum, mean, min/max/range, deviations and squares, sample variance with n−1, s and s/√n for n≥2. A one-reading intermediate state has no sample variance/standard uncertainty. Zero displayed spread does not mean zero total uncertainty. No confidence/coverage percentage, automatic95%interval, or combined uncertainty without a justified budget. No independent extra resolution uncertainty term on top of quantized repeatability without avoiding double counting. Increasing n need not make a particular realized prefix's uncertainty monotonically decrease.

120s guide:14s empty/zero check;96s divided among n placement/settle/record/removal cycles;10s conclusion hold. Settled indications shown only during valid reading stages; transient placement is a staged demonstration,not a balance-dynamics/force model. Observations accumulate at record events,without inventing physical elapsed seconds. Manual mode may inspect each individual deterministic trial and compare same-seed preparations. Pause,seek,change preparation and replay must remain deterministic.

Future original2D/3D balance with real selectable pan/specimen/readout,load/unload motion,empty-zero comparison,numbered dot plot and mean/range comparison. Both modes need actual120s playback,baseline/offset/resolution/noise controls,independent report export checks and full responsive matrices before ready status. No source links in productUI.

## Implemented core checkpoint

repeatMeasurements.ts and11focused tests pass.3,600preparation states,hand arithmetic,empty/single-reading null statistics,constant-zero correction,coarse quantization residuals,prefix reproducibility/non-monotonic realized SEM,20,000representative pseudo-normal samples and36,003guide frames tested. Final TypeScript passes. No92record,geometry,viewer,route or actualGUIreview yet.

## Full implementation evidence

Four2D/3D UI components,scopedCSS,route/registry,validated notebook and3-table exam-style export implemented.10worked blocks per recorded reading plus11summary blocks for each of raw/corrected cases.8synthetic series95readings independently4803checks1126blocksPASS;actual downloaded11GUI series85readings independently4649checks1092blocksPASS. Bothactual120sguides completed.180normal+48theatre matrices saved after correcting legend/summary/dense-label spacing. Final regressions3112PASS,14science+2navigation16focusedPASS. Rounded3Dcase,pan/specimen/readout scopes,functional camera/labels;motion is staged and indications withheld while unsettled. No physical device/FPS/nativegesture/print certification.
