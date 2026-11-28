# CL-0109 validation checkpoint

This lab is in progress. Model and notebook code exist; no connected viewer or browser review is claimed. Eleven focused tests pass, including a grid of 1,296 preparations, limiting-reagent hand calculations, counterion/material conservation, source-only record validation and HTML escaping. The deterministic guide function was sampled, which does not prove actual playback.

A separate 70-digit Decimal reference imports no app code. It checks 1,419 preparations / 5,676 comparison cells / 244,068 numerical values. Eleven deliberately corrupted values are rejected. Ordinary relative tolerance is 2e-10; absolute floors account for endpoint cancellation (2e-18 mol, 2e-11 g and other displayed quantities). These are numerical tolerances, not experimental precision.

The report includes 38 worked blocks for each of four samples, with explicit formulas, numeric substitutions and units, four tables and the exact escaped source-input payload. Independent report expression/operand verification and actual browser download remain pending. No lab-ready status or expert-review claim is inferred from these checks.

## Report arithmetic checkpoint

TypeScript completed with exit 0 and an empty log. Seven synthetic report trials passed 1,064 independently recomputed worked results and 1,064 expression checks, including AST operator structure, numeric operands and result units. Nine deliberately corrupted reports were rejected, including a subtraction changed to addition at zero dose and a wrong operand hidden by a zero product. The checker does not yet verify every observation table cell or header; that separate requirement remains open. The actual browser download, persistence and display are not tested yet.

## Connected viewer and table checks

Original matched 2D/3D apparatus and controller are connected. The initial theatre overflow was found visually and fixed in lab-scoped CSS. Agitation cues use completed selected cycles rather than an unrelated time oscillator. Fourteen focused/catalogue tests pass; integrated full regression passes 3,387 tests in 111.36 seconds. Final TypeScript passed with empty log and final production build completed in 13.98 seconds.

The independent report validator now also checks exact observation headers and 742 numerical table cells across seven synthetic trials. All eleven corrupted reports are rejected. Browser viewport checks cover 130 2D cases (including SVG text bounds) and 120 3D cases (nonzero canvas and page overflow). These do not certify every physical device or every 3D label collision. Mobile 2D/3D close-ups were visually inspected. No captured browser warnings/errors appeared. A fresh 2D guide ran to 120 seconds without source edits or timeline manipulation. The first 3D run was a preliminary pass with a geometry hot update; only the later fresh run can be used as completion evidence.

## Actual practical and final browser checkpoint

The fresh 3D guide completed 0→69.5506→89.0009→112.3686→120 seconds without source edits, seeking or pausing. At a separately selected paused 72-second agitation frame, two canvas-only PNGs were byte-identical and readings stayed constant. All seven camera/glass/label button comparisons changed pixels without changing scientific readings. All six numeric inputs reached both supported endpoints. The label toggle changed SVG text count from 38 to 2. Recording was disabled while playing and enabled once the React pause commit settled; an immediate post-click observer initially read the pre-commit disabled state, which is recorded honestly in the control evidence.

Six real browser observations were saved: zero dose, 6/15/20 mL, no agitation and a higher-hardness finite-stock comparison. Plan, literal HTML-like note and conclusion survived reload. The actual 305,211-byte downloaded browser-practical.html passed the independent report checker, including all four tables and source-input payload. See browser-report-validation.txt for counts. Dark and light layouts were inspected; the original light preference and default viewport were restored.

Native drag/wheel remains pending: the desktop inventory still reports a locked Mac. Button effects do not substitute for that test. This lab remains in progress with no passed review.json, and has not been published.

## Native verification and frozen internal review

Native access recovered. Real Chrome left drag and wheel changed the rendered camera, while scientific readings, time and canvas bounds remained unchanged. Labels were restored and the pointer parked outside the canvas before pixel comparisons. See native-gesture-checks.json and native-camera-reviewed.png. All required internal gates are now satisfied; review.json freezes the relevant source hashes. This is an internal functional/numerical review, not independent expert or official curriculum certification.
