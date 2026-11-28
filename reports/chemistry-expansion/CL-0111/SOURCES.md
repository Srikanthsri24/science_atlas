# Private initial source review — CL-0111

USGS Water Science School, Acid Rain and Water: https://www.usgs.gov/water-science-school/science/acid-rain-and-water — successfully retrieved 27 November 2026; the introductory, causes and stone-effects sections were inspected. Supports distinguishing naturally acidic precipitation from added pollutant-derived acidity, and carbonate-stone dissolution/alteration. It does not calibrate a numerical weathering rate, a chosen acid-equivalent stock or the app's geometry.

USGS archival page https://pubs.usgs.gov/gip/acidrain/5.html — indexed text was available, but direct retrieval returned HTTP 403. Do not claim a full read or bypass access restrictions.

No images or textbook prose were copied. Official curriculum mapping, numerical constants, selected solution model and independent model verification are still pending. Provenance stays in this private engineering report rather than product referral links.

## Reference constants and implementation scope
NIST Special Publication 260-223, *Certification of Standard Reference Material 915c Calcium Carbonate*, https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=935287 — PDF metadata/full-text response retrieved on 27 November 2026; the official indexed extract identifies a 2.71 g/cm³ calcium-carbonate density used for buoyancy correction. An in-document text search timed out; no claim of reading the complete 72-page publication is made. Here 2.71 g/mL is a selected calcite reference, not a certified density/uncertainty for an actual specimen.

The nitric-acid-equivalent concentration, 1000 mL stocks, 1 g/mL prepared density, complete gas stripping, contact partition and uniform thinning are explicit teaching assumptions. They are not sourced weathering measurements. R is calculated from the exact SI Avogadro and Boltzmann constants; conventional atomic weights are listed in the source. Formula-unit and ion accounting are checked separately in an 80-digit Decimal implementation.

Current numerical verification is complete for the tested domain; official board mappings and independent human scientific review remain unclaimed. No external source links are added to the student product.
