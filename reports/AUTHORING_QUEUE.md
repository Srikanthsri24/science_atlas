# Ongoing 408-concept authoring work

The user explicitly requested continued completion of all 408 concepts, with a tested/published checkpoint every 25. Do not treat an intermediate checkpoint as the final goal.

Published checkpoint: 175 authored/frontend-tested records, 233 pending, plus 60 reusable lab experiences. Scientific independent expert review and official board mappings remain separate from implementation. Do not mark those verified without evidence. Inventory IDs and original fields must remain preserved.

## Next checkpoint

Select 25 genuinely un-authored inventory IDs by comparing `data/frontend-catalog.json` with `data/authored-concepts.json`. Prioritize foundational science and missing biology coverage. Do not count a related lab link as a dedicated concept lesson. Add new scientific models/views where an existing model cannot represent the concept accurately. Rendering 3D is appropriate only when it helps teach the science; use a meaningful 2D investigation otherwise. Keep scopes and approximations explicit.

## Each concept

Provide original explanations at simple/detailed/equation levels, terminology, principles and units, examples, objectives and prerequisites, misconceptions, five clear process stages, genuine interactive visualization, an experiment activity, three valid questions and answer feedback, accessibility text, company attribution and review status. Current content schema and examples are in `data/authored-concepts.json`. All added metadata is additive.

Cross-check scientific facts against primary references and retain research evidence in the sibling science_atlas_research directory outside this published repository. Do not expose third-party reference links in the app or its public downloads. Test equations independently, then test every concept in the actual browser: moving SVG, parameter changes, WebGL where appropriate, all guided chapters, quiz submission and reload-persistent score/completion. Use the isolated local production origin for writing test results, preserving the normal and live learning state.

## Publish gate

Run TypeScript, all automated tests, inventory/ledger validation and production build. Save individual browser test results and a batch report. Update `scripts/concept-ledger.mjs` outputs and run `scripts/prepare-public.mjs`. Commit only this Science Atlas repository, push to main, wait for Actions success and verify live Pages. The final remaining batch will contain 8 records after sixteen complete batches of 25, so final-batch size assertions must allow that tail rather than adding or deleting concepts.

Repository: https://github.com/Srikanthsri24/science_atlas
Live: https://srikanthsri24.github.io/science_atlas/

The initial inventory contains generic legacy scaffolds. Preserve them in the imported data and supply specific authoring content separately; never silently delete or label scaffolds as completed explanations.

## Company-only public attribution

The user explicitly removed third-party reference links and Sources & verification sections from the platform. All public lesson/concept attribution must use `#company` and VisionariesAI Labs Private Limited. Continue scientific cross-checking as development work. Keep research evidence outside this repository, under the sibling science_atlas_research folder; never publish that folder. Do not replace company attribution with external referral URLs. Public reports are intentionally restricted by prepare-public.mjs.
