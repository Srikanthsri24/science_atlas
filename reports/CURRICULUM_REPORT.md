# Science Atlas 360 curriculum import and verification report

Date: 25 October 2026. Target session: 2026–27.

The original JSON parses successfully and contains 257 unique record IDs across five domains. The extension preserves every original record and every original field value, including all 1,028 subtopic entries. It adds 151 explicitly requested concepts, producing 408 concept records. No records were removed or destructively merged. The original file is retained byte for byte; its SHA-256 is `2c6d1cc1621223a6cd6e283d6d4aacc31a6f5ebc7ae8bc75f1076ce7a015b65a`.

## What has been verified

The official [CBSE 2026–27 curriculum index](https://cbseacademic.nic.in/curriculum_2027.html) and its [Class X Science syllabus](https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf) were inspected. Fifty-five concept records have partial mappings identifying their presence in this syllabus. These mappings include unit, year, class, source pages and explicit verification status. They do not claim that editorial atlas chapter labels are textbook chapters. Chapter and textbook edition remain null until the relevant text is checked.

The same syllabus prescribes NCERT publications, but NCERT is modeled as a publisher and curriculum resource institution, while CBSE remains an examination and curriculum board. ICSE and ISC are qualifications associated with CISCE. The legacy `boards` array is retained unchanged for old consumers; new consumers should use `board_registry`.

The PDF contains an apparent ambiguity between its content table, formative-only lists and final teacher note about year-end assessment. Mappings therefore verify concept presence only. Examination eligibility and summative/formative scope remain `pending_clarification`; they must not be inferred from this import.

## What remains unverified

This is not a complete official textbook transcription for Classes 1–12. There are no fully verified textbook-to-chapter mappings yet. The [NCERT textbook portal](https://ncert.nic.in/textbook.php), [AP textbook portal](https://cse.ap.gov.in/loadacademictextbookpublicview), and [Telangana SCERT portal](https://www.scert.telangana.gov.in/) were located but direct retrieval timed out. The [BIEAP portal](https://bie.ap.gov.in/) was retrieved without syllabus contents; [TGBIE](https://tgbie.cgg.gov.in/) returned forbidden. The official [ISC 2027 regulations](https://www.cisce.org/wp-content/uploads/2025/02/1.-ISC-Regulations.pdf) were located, but subject syllabi were not extracted. No unofficial mirror has been substituted as official evidence.

The [CBSE 2025–26 index](https://cbseacademic.nic.in/curriculum_2026.html) is registered for version retention, but its contents are not imported. Academic-session and examination-year fields are kept separate. A 2027 examination label alone does not establish a 2026–27 academic-session mapping.

All grade browse ranges are editorial recommendations, never official curriculum assignments. All inventory records have pending scientific review. Empty educational-content fields are explicitly null or empty arrays, rather than generated filler. Implemented lesson content and working visualization availability must be provided through the application's lesson/experience registry.

## Inventory findings

- `Classification` appears in biology taxonomy and in scientific skills. These are separate meanings, so both remain.
- `Thermodynamics` appears in physics and chemistry. A proposed graph edge records the overlap without deleting either record.
- Four animal-wide anatomy records are under `Human Body`; they retain their original values with an advisory correction in `known_issues`.
- `Named reactions` is under qualitative analysis. A linked organic concept was added; the legacy record remains unchanged.
- `Real life examples` and `Speed of movement of coil` require a more specific scientific scope.
- A circulation/excretion entry combines concepts and needs reviewed child concepts.
- Every original record repeats the same four subtopic strings. These are writing scaffolds, not 1,028 distinct scientific subtopics. They are preserved and marked for replacement through additive, versioned concept-specific content.
- All original records list 2D, 3D, Watch and Simulate. These values are preserved as legacy intent, not evidence that a working experience exists.

## Files and model

`data/master_topics.original.json` is the immutable source copy. `data/master_topics.extended.json` preserves the legacy root fields and adds schema version, source registry, board registry, academic-year registry, additive change log and a reusable concept graph. `data/curriculum.schema.json` supplies a JSON Schema. `data/sources.json` provides independent source metadata. `reports/import-report.json` records machine-readable counts, corrections, additions, duplicates and limits.

Each concept has a stable `concept_id`. Curriculum links reference that ID rather than duplicate explanations. The required hierarchy is recorded explicitly. Learning objectives, explanations, simulation specifications, questions and accessibility descriptions have typed slots, with pending status. This supports progressive reviewed content authoring without false completion claims.

Run `node scripts/validate-inventory.mjs` from the project directory. The validator checks original field preservation, unique IDs, grade bounds, source and concept reference integrity, partial-mapping constraints, source hash and report counts. It deliberately fails if an import invents a textbook chapter or marks an inventory record as scientifically reviewed.

## Next verification work

Download each official textbook edition with permission, record its edition/year/language and hash, extract its table of contents, then map scientific concepts to exact unit/chapter/topic locations. Retain page references and a reviewer decision per link. Resolve assessment ambiguity with CBSE. Add board-specific chapter coverage only after that evidence exists. A content editor should replace generic subtopic scaffolds with original, scientifically reviewed lessons and validate each simulation independently.
