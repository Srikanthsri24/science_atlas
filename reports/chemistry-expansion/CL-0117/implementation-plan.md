# CL-0117 — Build simple molecules from valency constraints

Status: in progress, not reviewed or available as a completed lab.

Implement a constrained builder for selected simple neutral covalent molecules, progressing from hydrogen/chlorine to water, ammonia and methane. A selected target supplies a verified composition/connectivity reference; learners place atoms and bonds. Count each atom identity and bond order exactly once. Show remaining valence allowance and distinguish incomplete diagrams from completed target connectivity. Valence-count satisfaction alone does not prove molecular identity, stability, shape or an actual synthesis.

Use original 2D Lewis/connectivity diagrams and 3D selectable ball-and-stick models with target-specific geometry and explicit schematic scale. Do not derive molecular shape from valency alone. Track paired bonding electrons and nonbonding pairs where represented; do not depict moving orbital paths. Provide a staged guide of at least60seconds, manual construction, undo/reset and clear completion criteria.

Practical record: aim/prediction, selected composition, atom counts, bond-order sums per atom, unfilled allowances, molecular formula, electron accounting where applicable, observations/result/conclusion and original exam-style HTML. Include formula substitutions with correct integer units. No fictitious measured apparatus result.

Before implementation: verify selected molecule geometries and charge/electron rules from authoritative chemistry references, retaining provenance privately. Then implement model, independent reference checker, original viewers/controller, report, meaningful tests and actual responsive/browser interactions. Keep frozen CL-0116 sources unchanged. Nextpublish125reviewed;116reviewed at start.
