# Implemented conditional budget — not yet independently reviewed

Ten numeric inputs plus wet/contact booleans control four separate cells. Nominal zinc stock is matched; the portion not applied after the selected scratch remains on a separate tray and is included in the initial/final account. The supplied total face area is nominal, not a pit-growth prediction.

While zinc remains, exposed iron demand is selected j_Fe times defect area; zinc self-demand is selected j_self times remaining coated area. Both are scaled by the common selected oxygen-current capacity. Contact allows a selected zinc-support contribution to replace up to the iron demand; any shortfall remains iron current. Self-consumption and protective supply both consume zinc. At zinc exhaustion the formerly covered iron is exposed; at iron exhaustion its demand stops and the remaining zinc self-current may change. This is an idealized piecewise constant reference, not polarization kinetics or measured coating service life.

Primary charge uses two electron equivalents per converted Fe or Zn. Net reference material is M(OH)₂-equivalent: half a mole O₂ and one mole H₂O supplied per converted metal mole. No unique product composition, precipitation, mature rust chemistry, solution pH, flaking or product volume is predicted. Unchanged carrier plus externally replenished net water/oxygen form an explicitly open account. Initial prepared bath levels will remain reference geometry.

The charge-equivalent iron avoided by zinc supply is distinct from the actual comparison with the bare control, which also contains barrier and exposure-history effects. Intact zinc can self-consume without a scratch; isolated zinc cannot carry protective charge into iron. Numerical nonzero lower bounds and the 1e-9-day minimum positive observation time are validation limits, not physical thresholds.

Current densities, available support and oxygen capacity are supplied teaching references. They are not inferred from standard electrode potential differences, conductivity or real weather. The selected current allocation does not certify complete real protection of large defects.

Independent high-precision verification, apparatus geometry, viewers and practical report remain unfinished. Do not mark this lab reviewed.

## Detached-control correction during apparatus development

The first model treated detached zinc as though it still shielded the covered iron. This was corrected before review: only attached, contacting zinc reduces nominal exposed iron area. Detached zinc rests on open insulating support rails, leaves all nominal iron area wetted and has two wetted broad zinc faces. Edges and the tiny 1% support footprints are neglected in nominal active areas. Zinc self-consumption can compete with iron for a shared oxygen budget even without metallic contact; bare-minus-control iron loss is therefore not itself proof of sacrificial protection. Protective charge remains zero in detached controls.

The corrected independent reference covers 394 preparations and 1,576 cells, with 107,278 field/phase checks and nine rejected mutations. The earlier 392-preparation and 106,364-check figures describe the superseded detached-area interpretation. The first 3D inspection also found a React key warning in the four-face 2D list, fixed in the draft before final browser review.
