# CL-0108 integrated checkpoint — still in progress

## Model correction

Apparatus review exposed an incorrect assumption in the first draft: detached zinc was still counted as a barrier. The corrected model leaves all nominal iron area wetted when zinc is detached and counts both wetted broad zinc faces. Open support rails preserve the separate metal path; their tiny footprints and edge reactions are omitted in nominal areas. Detached zinc may compete for a common oxygen budget without supplying protective charge. Bare-minus-control mass differences are therefore separate from protective electron-equivalent charge.

## Reproducible independent checks

```sh
node --test tests/chemistry-zinc-protection.test.mjs
node scripts/chemistry/export_zinc_protection_reference.mjs
python3 scripts/chemistry/validate_zinc_protection.py reports/chemistry-expansion/CL-0108/core-reference.json
python3 scripts/chemistry/test_zinc_protection_mutations.py
node scripts/chemistry/export_zinc_protection_report.mjs
python3 scripts/chemistry/validate_zinc_protection_report.py reports/chemistry-expansion/CL-0108/reference-practical.html
python3 scripts/chemistry/test_zinc_protection_report_mutations.py
```

Twenty focused tests pass. The corrected 80-digit Decimal reference checks 394 preparations, 1,576 cells and 107,278 field/phase values. Nine core mutations are rejected. A narrow 64-binary64-epsilon inventory error floor handles ill-conditioned newly started channels near exhaustion events; ordinary values retain strict relative comparison. Phase-duration subtraction has a corresponding event-time error allowance. Small-loss-erasure mutations remain rejected. These are computational error bounds, not measurement precision.

Fourteen synthetic reports independently pass 2,470 results, 14,548 numeric checks, 4,952 units, 2,466 expressions and 6,310 operands. The checker validates phase observations, numerical substitution operands and expression operators as well as results. Ten report mutations are rejected, including a wrong operand hidden by a zero product. Seven tables and an exact escaped input-only JSON payload are retained.

## Browser evidence

Both viewers open through the catalogue route. The four-control overview, separated coating layers and dry-carrier reservoir were visually inspected. The first 2D list-key warning was fixed before a fresh reload; no new captured warnings/errors appeared afterward. The full 2D guide ran 0.0951→120 seconds. The full 3D guide ran 0→120, with the moving protective and return cues inspected at 72.2865 seconds. An earlier 3D pass switched viewers at 100 seconds and is not the completion proof; use 3d-guide-full-observations.json.

Six actual observations and literal HTML-like student writing survived reload. The actual button-downloaded browser-practical.html independently passed 1,052 results, 6,148 numeric checks, 2,121 units, 1,048 expressions and 2,668 operands. Trial settings include initial, seven/fourteen-day, open-contact, dry and oxygen-limited observations.

Current integrated TypeScript passed with an empty log; production build passed in 26.39 seconds. Corrected full regression passed 3,375 tests in 188.27 seconds. These checks do not replace final responsive/scope/text bounds, native gestures, paused-frame, all-control effects or the final frozen review. Lab remains in progress.

## Final UI verification checkpoint

The final focused/catalogue tests and TypeScript passed; the final production build completed in 26.60 seconds. The refreshed synthetic report passed all result/expression/operand checks and all ten corrupted-report tests were rejected. The 240-case responsive matrix covered five scopes, two formats, six viewports and normal/theatre in both viewers. These are browser viewport checks, not certification on every physical device. Ten canvas-only button comparisons changed pixels while scientific readings stayed constant. The paused 60-second canvas remained byte-identical; resize preserved time/readings. Twenty numeric endpoint checks passed. Isolation controls and contact-setting labels were corrected and browser checked.

Native drag/wheel remains unverified for this lab. After the user's unlock notification the desktop inventory still returned a locked-Mac error; do not infer success from DOM camera buttons. This is a pending test, not an independent expert review and not a ready lab.

## Native verification and frozen internal review

Native access recovered. Real Chrome left drag and wheel changed the rendered camera, while scientific readings, time and canvas bounds remained unchanged. Labels were restored and the pointer parked outside the canvas before pixel comparisons. See native-gesture-checks.json and native-camera-reviewed.png. All required internal gates are now satisfied; review.json freezes the relevant source hashes. This is an internal functional/numerical review, not independent expert or official curriculum certification.
