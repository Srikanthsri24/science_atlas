# CL-0107 core checkpoint

Run from the repository root with the project development dependencies installed:

```sh
node --test tests/chemistry-salt-corrosion.test.mjs
node scripts/chemistry/export_salt_corrosion_reference.mjs
python3 scripts/chemistry/validate_salt_corrosion.py reports/chemistry-expansion/CL-0107/core-reference.json
python3 scripts/chemistry/test_salt_corrosion_mutations.py
node node_modules/typescript/bin/tsc --noEmit
```

Current evidence:18focused tests;882control states;62181independent field checks, including the comparison quantities; eight rejected mutations. Full regression3351tests passed. The source model, prepared-coupon geometry, cumulative histories and generated material reference exist. The notebook/report engine and draft 2D component now exist; there is no connected lab controller, 3D viewer or catalogue-opening route yet. Do not mark this lab reviewed or claim browser validation.

The generated material is original qualitative appearance art. It is not a compositional measurement, empirical dataset or predicted oxide-layer thickness. The image remains inside the project, with its prompt and hash recorded. Sampling must use ClampToEdge; exact pixel-periodic tiling is unverified.

## Notebook and report checkpoint

The record stores source inputs, prediction, observations and conclusion; derived results are recomputed. Each report contains ten observation tables and 133 worked calculations per trial, with formulas, substitutions, units, procedure, key terms and an exam-style result/conclusion section.

Independent Decimal reference verification passed for 18 synthetic trials: 2,394 worked results, 13,307 numeric checks, 2,454 unit checks and 2,377 displayed-expression checks. Ten deliberately corrupted report variants were rejected, including a wrong arithmetic operator with unchanged operands. Regenerate with `node scripts/chemistry/export_salt_corrosion_report.mjs`, then run `python3 scripts/chemistry/validate_salt_corrosion_report.py reports/chemistry-expansion/CL-0107/reference-practical.html` and `python3 scripts/chemistry/test_salt_corrosion_report_mutations.py`.

The final record regression log records 3,355 passing tests and zero failures. The TypeScript log is empty. Draft 2D/readings components are not yet connected or browser-reviewed. No actual student export, responsive viewer, native gesture, or completed-lab review is claimed.

## Connected viewer checkpoint

CL-0107 now has a catalogue route, controller, both viewers, original qualitative texture integration and notebook controls. Scene/controller TypeScript processes completed with exit 0; all 22 focused tests passed. Desktop browser inspection confirmed the paired-bath scene and textured exact-proportion coupon close-up, with no captured console warnings/errors. The saved screenshot is `3d-coupon-draft.png`.

Browser checks rejected conductivity 0 while retaining the last valid 0.02 S/m, accepted the minimum 0.0000055 S/m, changed entered salt to 10%, safely clamped it to 0.05% upon switching to dilute mode, and recorded one paired observation (133 calculated results). These checks do not establish complete device coverage, download correctness, persistence, native gestures or actual uninterrupted guide playback. All remain pending.

## Actual browser review checkpoint

Both actual guides played to 120 seconds and stopped. Timestamped live-reading snapshots are saved in the 2D/3D guide-observations JSON files. A stopped 3D frame was byte-identical across screenshots, with unchanged guide time and readings. Three 2D controls visibly changed SVG text/image/rectangle counts.

The scope matrix contains 120 2D and 72 3D combinations across normal/theatre, landscape/portrait, all five 2D/three 3D scopes, and six device dimensions. These geometric checks found no page overflow, zero-size view or invalid 2D numeric text. They do not prove every label is comfortably readable or every native gesture works. Phone visual inspection identified room for larger annotation text.

Nine actual browser records, prediction, conclusion and literal HTML-like student notes survived reload. The actual downloaded report is saved as browser-practical.html; independent numeric/unit/expression results are in browser-report-validation.txt. Build passed in 15.00 seconds; integrated regression passed 3,355 tests. Native gestures, remaining numeric boundaries and 3D button effect checks remain pending.
