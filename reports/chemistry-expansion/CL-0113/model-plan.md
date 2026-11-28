# CL-0113 — Investigate starch detection with iodine

In progress: the finite-transfer/apparent-association core is implemented and independently checked. No viewer, report integration or completed review is claimed.

Develop a controlled qualitative starch investigation using known prepared references and a reagent blank, with finite iodine/iodide reagent, actual pipette transfer and mixing, readable observation records and an explicitly schematic helix-association explanation. Avoid inventing starch percentages of real foods or treating every carbohydrate as starch.

Represent iodine together with iodide correctly. Do not present a fixed tri-iodide-only chain, a fixed iodine-per-glucose stoichiometry, exact absorbance calibration or a visual detection threshold as established facts without sufficient evidence. Colour is qualitative; different polysaccharides and structures need appropriate distinctions. A negative/weak visual result is not a universal proof that a food contains no carbohydrate or no starch under every preparation condition.

The numerical design still needs selection: preserve every stock, carrier and solute account; separate measured-reference assumptions from chemical structure claims. A qualitative assay model may be more defensible than invented equilibrium constants or molar absorptivities. If using a selected operational binding-capacity reference, label it explicitly and do not claim molecular stoichiometry or calibrated analytical sensitivity.

The 2D/3D apparatus must visibly withdraw reagent, transfer finite aliquots, mix and compare controls in a ≥60-second explanation (target 120 s). Add an original, labelled schematic of association with a helical region; it must not imply experimentally determined atomic coordinates or a uniquely settled polyiodide structure. Only expose working controls.

Required practical: aim/prediction, sample/reagent preparation, controlled variables, initial and added volumes, colour observations kept distinct from calculations, dilution/finite transfer substitutions where applicable, proper units, result and justified conclusion. Then independently check the model/report, full playback, responsive bounds, camera/native input, notebook persistence and actual downloaded report before setting ready. Official board mapping and independent human expert review remain unclaimed.

## Selected numerical reference
Four preparations: selected starch, half starch plus glucose, matched glucose and water. The full-reference dry-solute g/L setting sets matched dry mass for the first three; half-reference starch/glucose masses are equal. No real-food composition is inferred.

Each sample has its own finite 2 mL iodine/potassium-iodide stock. Withdrawal and delivery are separate bounded settings. Carrier excludes solutes; nominal density is selected as 1 g/mL and volumes are additive. The stock contains ten iodide equivalents per iodine(I2-equivalent) inventory unit. KI amounts track total potassium/iodide inventories, not undissociated molecules or an allocation of free versus complexed iodide.

An optional selected apparent one-capacity-unit association reference solves Kd B = (L − B)(S − B), where S is iodine-equivalent capacity, not glucose monomer concentration. Capacity and Kd are teaching choices, not measured starch constants. The code uses a stable rationalized root; the independent 80-digit reference uses the opposite quadratic expression. Associated/unassociated iodine-equivalent amounts are bookkeeping pools, not resolved I3/I5/etc species or the mass of a complete starch complex.

The qualitative cue is a reference illustration, not calibrated colour, absorbance, visual threshold or analytical detection prediction. All association numbers assume a well-mixed endpoint; during pipetting/mixing the UI must label them as endpoint predictions. No hydrolysis or chemical/thermal kinetics are represented.

The 120-second guide stages preparation, withdrawal, positioning, dispensing, mixing and interpretation. Observation recording should wait for paused complete mixing in guided mode. Initial no-reagent controls can be prepared in manual mode and must not be classified as a negative starch test.
