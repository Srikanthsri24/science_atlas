# Concept authoring batch 4 — 100 / 408

This checkpoint adds 25 dedicated concept lessons. 308 inventory records remain pending. Original IDs and headings are preserved; authored explanations and models are additive.

## Concepts

- SA-0028 — Photosynthesis
- SA-0029 — Transpiration
- SA-0044 — Mendelian genetics
- SA-0051 — Food chains
- SA-0053 — Population ecology
- SA-0279 — Mitosis
- SA-0280 — Meiosis
- SA-0283 — Human heart
- SA-0284 — Blood circulation
- SA-0287 — Lung breathing
- SA-0290 — Neuron signal transmission
- SA-0291 — Reflex arc
- SA-0311 — DNA replication
- SA-0273 — Chloroplasts
- SA-0014 — Reflex action in animals
- SA-0018 — Respiration in human beings
- SA-0268 — Cell membrane and transport
- SA-0271 — Nucleus
- SA-0275 — Golgi apparatus
- SA-0209 — Earthquakes
- SA-0211 — Water cycle
- SA-0218 — Moon
- SA-0221 — Seasons
- SA-0398 — Planetary motion
- SA-0216 — Solar system

## Verification

188 automated tests pass. Each of the 25 records was checked in the browser for moving SVG content, working parameter changes and pause behaviour, WebGL loading, five guided chapters, and three assessment questions. Individual results are in `browser-batch-04.json`. TypeScript, inventory validation and the production build are required before publishing.

Scientific statements were cross-checked against the linked primary references. That is distinct from independent expert review, which remains pending. No new official board mapping is asserted. All model assumptions and staged time scales remain visible.

## Assessment persistence

All 50 concepts in batches 3 and 4 were individually answered, submitted and reloaded on the isolated production-build origin `127.0.0.1:5182`. Every expected answer set received 100%; every best score and completion state survived reload. Individual results: `assessment-batches-03-04.json`. The normal learning origin and live site were not used to store test scores.

The expanded inventory now links to each authored content ID through additive `authored_content_ref` metadata. Original scientific headings and original data fields remain intact.

## Interaction regression

Changing a parent genotype during the first guided stage now reveals all four Punnett outcomes in the student-controlled study. A browser check of AA×Aa showed two AA cells, two Aa cells and the correct 100% dominant-phenotype expectation. Golgi export chapters switch their scene focus from the Golgi apparatus to the secretory vesicle.
