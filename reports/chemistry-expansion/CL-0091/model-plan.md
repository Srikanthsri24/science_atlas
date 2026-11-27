# CL-0091 · Effect of an insulating layer on cooling

In progress; plan only. No reviewed implementation or verified material constants yet.

## Investigation

Compare matched vessels containing initially warm water,one bare and one with a cylindrical reference jacket. Keep water mass,initial/ambient temperatures and other conditions equal. Read both temperatures at common physical times and retain a closed heat-loss account. Distinguish this room-cooling model from89's isolated finite cold store and90's spatial solid-rod conduction.

## Proposed model to verify

Well-mixed water plus a chosen vessel heat capacity. Constant effective specific heat,side convection coefficient and jacket conductivity. Thin vessel-wall thermal resistance may be neglected only if explicitly stated;do not claim a calibrated glass apparatus. Jacket heat capacity and its transient thermal storage omitted in a quasi-steady resistance approximation. No evaporation,phase changes,room temperature evolution or radiation separate from the chosen effective loss references.

Proposed side resistance for wrapped vessel:

Rjacket=ln(router/rinner)/(2πkH)
Routside=1/(h2πrouter H)
Gside=1/(Rjacket+Routside)

For the bare vessel,router=rinner,Rjacket=0. Keep an explicitly chosen lid/bottom heat-loss path Gother in parallel. TotalG=Gside+Gother,C=mCp+Cvessel,and T=Tamb+(Tinitial−Tamb)exp(−Gt/C). Meter heat loss Q=C(Tinitial−T),partitioned between side/other paths according to their constant conductances. Compare matched states,mean cooling rates,current powers and room heat gain. A finite guide endpoint is not exact room equilibrium.

Geometry must agree with water inventory:chosen constant reference density and cylindrical radius give actual water height m/(rhoπr²);vessel rim must contain the full control range. Only the wetted-side area should be used if H is the water depth. Show exactly which side/lid/bottom paths are included. Sleeve/jacket thickness changes outer convection area as well as conduction resistance.

Investigate the critical-radius counterexample mathematically before exposing it. For a cylindrical jacket with constant h,k and negligible jacket heat capacity,the side resistance derivative changes sign at router=k/h. A high-conductivity cover can initially increase heat loss by increasing outside area;do not label every cover as an effective insulator. Low-conductivity teaching references need primary source verification or must remain generic chosen properties. Proposed constants/controls are not yet final.

## Visual and practical implementation

Matched original2D and3D vessels with actual water levels,clear bare/wrapped identities,a real jacket cutaway and optional material visibility where functional. Heat-flow markers tied to calculated cumulative energy,not decorative steam. Thermometers and temperature-history curves show real model states. Thermal colour is a labelled visualization,not glowing water.120s explanation should allocate time to preparation,early cooling,comparison and results;physical time distinct from presentation time. True16:9/9:16,phone/tablet/laptop/TV and theatre checks.

Notebook stores independent inputs and both vessels' temperatures,powers,side/other heat losses and residuals. Formula substitution:SI conversions,water height/area,total heat capacity,cylindrical resistance,convection resistance,parallel loss paths,time constants,exponential temperatures,current powers,cumulative heat and percentage differences with safe equal/zero-thickness cases. Auto aim/procedure,observations,calculated result and student conclusion in an exam-style export.

## Gates before review

Verify primary property/source assumptions;independent ODE and closed-form comparisons;water mass/geometry;heat partition and energy closure;zero thickness,equal ambient/initial temperature,limiting k and h;critical-radius derivative if included;one-variable comparisons;bounded inputs. Then both actual120s playbacks,actual GUI trials/download with independent validator,pause/persistence,accessible control checks and normal/theatre responsive matrices. No ready status before these pass.

## Implemented core decisions

Core now implements a GENERIC jacket rather than extrapolating a named foam certificate. Default400gwater,10mmjacket,k0.04W/(mK),h8W/(m²K),vessel75J/K,otherG0.08W/K,initial65°C,room25°C. Radius/waterheight and all limitations inSOURCES.md. Controls matchinsulationCooling.ts;time0–14400s. Exposes both vessel temperatures,outer-jacket surface,all resistances/conductances,powers,path/material heat accounts,critical-radius derivative and distinct initial/current/cumulative reduction percentages. Guide120s:14setup,35early to0.25bareτ,61later to min(2bareτ,14400s),10hold. Frontend, record, geometry and both viewers are now implemented; see review.json for final verification.
