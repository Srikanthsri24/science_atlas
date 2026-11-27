# Private scientific audit · CL-0093

Read2026-11-27:

- Merck/Sigma-Aldrich product109489 red litmus paper,General description:primary supplier description gives red belowpH4.5 and blue abovepH8.3,and directs quantitative measurement to a different method. This supports broad endpoint interpretation only;it does not certify a generic paper,kinetics or a precise interpolation. https://www.sigmaaldrich.com/US/en/product/mm/109489
- Sol Plaatje University educational acid/base indicator page:acid/base indicator forms differ in colour,blue litmus responds to acids/red to bases,and pure-water neutrality is associated with25°C. Its simple0–14presentation is a teaching range,not a universal bound onpH. https://www.spu.ac.za/Sims/acid_base_indicators.html

Not verified from full document:NCERTgesc104PDF timed out when opened;IITKanpurSATHEEclass10chapter2 mirror returned403. Search snippets are not a completed chapter/year mapping. Do not mark official mapping verified. No NCERTtext or external assets copied into the application. No source links in productUI.

Still required before advanced model implementation:primary water-autoionization/ideal-dilution references,and an honest operational paired-paper response near the transition. Litmus is a mixture/conditioned paper,so no unsupported single-pKa equilibrium curve or exact RGB-to-pH calibration. No unverified real-household-sample pH values.

## Verified model reference and implemented decisions

University of British Columbia courseware section16 was opened and read2026-11-27. It includes water dissociation in a2.0×10⁻⁷Mstrong-acid reference,usesKw≈1.0×10⁻¹⁴at25°C,and derives the charge-balance quadratic. Its numerical example gives H⁺≈2.41×10⁻⁷M,pH≈6.62. https://groups.chem.ubc.ca/courseware/pH/section16/content.html

IUPACGoldBookA00532directopen returned403;its search excerpt alone is not claimed full-document verification. The implemented chosen25°C ideal concentration product is1e−14M². Activities/ionic-strength coefficients,CO₂uptake,weak-acid dissociation,temperature change and finite indicator loading are omitted. pHnumerics implicitly normalize concentration to1mol/L;they are not obtained from paperRGB. No copied source prose.

CorelitmusTests.ts uses complete dissociation and H−OH=±C with H×OH=Kw,major=(C+hypot(C,2√Kw))/2,minor=Kw/major. WatercontrolhasC0. Stock.001–10mM,dilution1–10000,sample1–10mL,two20–100µLaliquots. Aliquot fractions0–1transfer conserved reference solute and liquid volume out of the sample reservoir;individualH/OHmolesare not treated as conserved chemical species. No evaporation,indicator-released acid/base or contamination model. Paper-contact timing is a staged demonstration,not measured kinetics or absorption/transport law.

The qualitative operational paper model uses endpoints only below4.5orabove8.3. Intermediate samples have unresolved colours and no confident classification. The selected known-water control retains the starting red/blue colours as a classroom reference outcome,not a calibrated instantaneous litmus-equilibrium prediction. Unchanged papers do not prove exactneutrality of anunknown. Both papers must be tested before an inference. No fabricated pKa or RGBinterpolation. Volume transfer graphics must not turn clear bulk sample red/blue.

Nine core tests pass:9072inventory/equilibriumstates,501acid/base pairs independently solved by log-space bisection,primaryUBCexample,mirroracid/base,pure-water control,dilutionlimitingbehaviour,broadboundarycases,ordered120sguide/partialobservations,andinvalidinputs. No93record/viewer/GUIreviewyet.

Implementation audit:23numericworkedblocksperobservationcoverconcentration/volumeconversions,aliquotandreference-soluteaccounts,water-inclusivechargecalculation,pH/pOHandresiduals. The independentPythonvalidatoruseslog-spacecharge-balancebisectionratherthantheappquadratic. Concentrationoperand/resultchecksuserelativetolerance2e−10with2e−22absolutefloor;closureoutputsuseexplicitquantity-appropriatefloatingtolerances. Initialparsercountedatruncateddigitfromthefunctionnamelog10;fixedtokenizationbeforechecks,notmathortargetrelaxation. Synthetic9trials953checks207blocks;actual16GUItrials1694checks368blocksPASS. Noexactcolour-to-pHlaworcalibratedpaperkineticsadded.
