# Practical workflow review — 29 October 2026

All 408 authored concepts have explicit worked numerical calculations or a specific qualitative observation/reasoning guide. Every registered legacy laboratory also resolves to a supported calculation or reasoning path. No generic “substitute it yourself” fallback remains for a registered lab.

## Calculation and observation design

Numerical working separates quantity, formula, substituted values, answer and units. Initial conditions, reference examples, steady-state limits and current instantaneous values are identified; a reference prediction is not presented as a current measured value. Scientific assumptions accompany the working. Qualitative models provide a principle, what to record, a worked reasoning example and a limitation, without invented numerical rates.

New trials retain presentation time and the scientific model clock separately. Older records remain readable; time-dependent calculations requiring a missing scientific clock request a fresh capture. Selected inputs are labelled with units and choice names. Observations use one trial per row with separate reading columns; mode-dependent missing readings are explicitly identified. Tables scroll inside their container on narrow screens. The current state’s working can be read before capturing a trial.

Exam-style HTML reports include student identification fields, aim, apparatus/model materials, theory, prediction, procedure, inputs/observations, worked calculations or reasoning, student result/conclusion, precautions and teacher remarks. Reports escape student text, remain explicit when writing is incomplete, and support browser printing. JSON and CSV exports remain available.

## Evidence

- Automated practical audit: all 408 concepts at 15 actual animated states each (6,120 states), plus every registered laboratory path and parameter/selector endpoints in the numerical families.
- Fresh browser practical pass: 408 unique concepts at 390×844; each opened its experiment, rendered working, captured a trial, populated an observation table, displayed a trial-working panel and exposed report download. No horizontal document overflow or NaN/Infinity working appeared in that pass.
- Shared populated-table and formula layout checks at 320px, 768px, 1366px and 1920px: no horizontal document overflow or text spill; table overflow stayed within its scroll container.
- Pendulum diagram containment checked without overlap into controls. Quantitative aerospace and qualitative classification reports downloaded and inspected for inputs, observations, numerical substitution or worked reasoning.

These checks are not independent scientific certification or physical-device testing. The fresh browser pass checks the practical workflow, not every possible input combination, full animation duration or all visual details of every 3D scene. The separate advanced scene-quality review remains tracked independently.

Validation: 1,376 tests passed; TypeScript, inventory validation and production build passed.

Machine-readable evidence: practical-review.json and practical-browser-review.json. CI runs the practical audit as well as the test suite before deployment.
