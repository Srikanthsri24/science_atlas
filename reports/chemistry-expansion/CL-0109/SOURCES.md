# Private source review — CL-0109

USGS Water Science School, “Hardness of Water”: https://www.usgs.gov/water-science-school/science/hardness-water
Retrieved successfully via web open, 27 November 2026. Read the definition, soap-scum description and hardness-unit sections. Supports dissolved calcium/magnesium as primary hardness constituents, reaction with soap and reporting hardness as calcium-carbonate equivalent. It does not calibrate this app's foam, provide soap kinetic constants or establish official Indian curriculum mappings. No external assets or textbook prose copied.

Other candidate sources mentioned in planning have not been relied on here pending confirmed retrieval. All numerical soap constants and species assumptions require separate verification before implementation. Scientific provenance stays private; no source/referral links are added to the product UI.

PubChem, Sodium Oleate, CID 23665730: https://pubchem.ncbi.nlm.nih.gov/compound/sodium_oleate — official indexed result inspected 27 November 2026. Formula C18H33NaO2 and rounded molecular weight 304.4 g/mol. The app uses a declared internally consistent conventional-atomic-weight sum (304.44976928 g/mol), not a claim of higher experimental precision. The oleate group is C18H33O2; two groups balance one Ca²⁺ or Mg²⁺.

Constants used (g/mol atomic reference): Ca 40.078, Mg 24.305, Na 22.98976928, Cl 35.45, C 12.011, H 1.008, O 15.999. CaCO3 equivalent mass is 100.086 g/mol. Density 1 g/mL, additive nominal prepared volumes, ideal complete precipitation, proportional limiting allocation and the 1 mmol/L foam-reference threshold are declared model assumptions, not sourced calibration data.
