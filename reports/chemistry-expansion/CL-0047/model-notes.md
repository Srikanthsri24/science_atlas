# CL-0047 — floating immiscible layers

Model work in progress. No completed UI,independent expert review,official-board mapping or calibrated real-liquid claim. Class4 placement follows the editorial catalogue.

A250mL ideal cylinder of radius2.5cm begins with50–150mL reference water. A finite20–80mL reference oil reservoir delivers1mL/s. Reference water density is the chosen rounded value1g/mL; selected oil density0.8–0.95g/mL is always lower. These model values are not a commercial oil specification or a temperature calibration. Water and oil are assumed immiscible,incompressible,already separated and quasi-static. Density contrast alone does not establish immiscibility. No alcohol phase is added: miscible liquids must not be misrepresented as permanently separate just because their densities differ.

Oil forms the upper layer as it arrives. hwater=Vwater/A and hoil=Vreceived/A; the water interface height remains fixed. Maximum contained volume230mL stays below250mL capacity. Source oil plus received oil is conserved,as are total volume and total mass. The lumped transfer omits jet/wall-film inventory,splashing,evaporation,mutual solubility,emulsification and transient mixing. Flat interfaces omit capillarity and any curved-interface pressure jump. A transparent pour trace must be labelled illustrative rather than counted as an extra mass compartment.

The nonintrusive probe height is0–13cm from the floor. Water and oil weights above it contribute separately to gauge pressure: sum(rho_i g h_i). Convert g/mL to kg/m³ with×1000 and cm to m with×0.01. The ambient reference is uniform; air weight is neglected. At the free surface and in air,gauge pressure is zero in this model. At the water/oil interface,pressure is continuous while its height gradient changes with density. At the base,pA equals the weight of liquid in the cylinder; reservoir weight is not part of receiver pressure. A tiny1e-9cm classification tolerance distinguishes surface/interface labels without changing the continuous pressure calculation.

Class4 core: identify distinct layers,compare interface/free-surface heights and record measured volumes. Mass accounting and hydrostatic pressure are teacher extensions. Probe displacement is omitted. Changing the chosen density means a different reference trial,not a thermal-density process within one run.

The120s guide has15s introduction,60s of oil transfer,then a moving pressure probe through water,interface,oil and air. The probe returns to the base before the final explanation. Guide physical time spans0–80s; after the oil is fully transferred,probe movement is a quasi-static measurement demonstration. The probe path is continuous at75,95 and105s.

## Primary references consulted

American Chemical Society,Lesson3.5:Density:Sink and Float for Liquids: https://www.acs.org/middleschoolchemistry/lessonplans/chapter3/lesson5.html

Read the accessible lesson text. Its oil/water demonstration connects layer order with density and also identifies limited mixing as necessary for the layered example. This supports the qualitative investigation; the present equations,parameters,geometry and animation are original. No third-party illustrations or passages are copied.

OpenStax,College Physics2e,11.4Variation of Pressure with Depth in a Fluid: https://openstax.org/books/college-physics-2e/pages/11-4-variation-of-pressure-with-depth-in-a-fluid

Read the accessible section. It derives pressure from supported fluid weight,volume,density and depth. Applying that balance separately to the two reference layers gives the chosen probe model. No numerical calibration,official school mapping or independent review follows from this reference. Links stay in private engineering notes,not student UI/reports.

## Initial verification

11 model tests passed:zero-oil start,source/receiver volume and mass budgets,geometric heights/capacity,independent base weight/area balance,interface continuity,independent midpoint integration of the density column,pressure gradients,density changes,phase classification,continuous120s guide and input validation. Numerical integration agrees within0.015Pa over the supported cases; exact algebraic identities use tighter tolerances. UI,3D assets,actual observations,worked report,full browser playback and responsive review remain pending.
