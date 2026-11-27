# Private reference audit · CL-0090 · 2026-11-27

No outside source links in product UI. Internal engineering review only; no independent expert or official-board certification.

## Verified primary institutional references

- NIST NCNR Reference Tables: https://www.nist.gov/ncnr/neutron-instruments/sample-environment/sample-mounting/reference-tables . Read the table titled physical properties of selected metals at295K. Reference conductivity in W/(m K):copper400,aluminium235,stainless30415. Densities:g/mL8.96,2.70,8,respectively. These are rounded near-ambient reference values,not specimen calibration. The NIST page identifies its underlying handbook sources. Do not mistake235 for aluminium6061-T6:that alloy is different.
- NASA Ames TPSX stainless304 material table: https://tpsx.arc.nasa.gov/Material?id=57 . Standard-condition Cp477J/(kg K),rho7900kg/m³,k14.9W/(m K). Density has assumed/assumed STP flag and property source isunknown;table generalreference Incropera/DeWitt1990. Conductivity temperature table https://tpsx.arc.nasa.gov/MaterialProperty?id=57&property=3 gives14.9 at300K and16.6 at400K. Do not present a constant15 as a validated temperature-dependent law. Proposed model uses NIST rounded8000density and15conductivity,with477Cp reference;mixed rounded reference explicitly stated.
- NIST Chemistry WebBook copper solid Shomate: https://webbook.nist.gov/cgi/cbook.cgi?ID=C7440508&Mask=2 . A17.72891,B28.09870,C−31.25289,D13.97243,E0.068611;Cp=A+Bτ+Cτ²+Dτ³+E/τ² J/(mol K),τ=T/1000. Molar mass63.546g/mol;range298–1358K. Evaluate at298.15K before rounding proposed385J/(kg K). Chase1998 compilation,not new specimen measurement.
- NIST Chemistry WebBook aluminium solid Shomate: https://webbook.nist.gov/cgi/cbook.cgi?ID=C7429905&Mask=2 . A28.08920,B−5.414849,C8.560423,D3.427370,E−0.277375;mass26.9815386g/mol,range298–933K. Evaluate298.15K before rounding proposed900J/(kg K).

The NIST6061-T6 page https://www.nist.gov/mml/acmd/aluminum-6061-t6-uns-aa96061 was inspected but not chosen for this pure-aluminium reference. Its cryogenic fit range ends300K;do not extrapolate that fit into a warm-rod experiment.

## Model provenance

Spatial finite-volume balance and eigenmodes are original mathematical derivation,not claims that these sources specify our illustrated apparatus. Constant properties are chosen near-ambient teaching approximations over25–45°C;the full temperature dependence,contact resistance,side convection,radiation,radial gradients,thermostat lag and mechanical thermal expansion are omitted. Bath boundaries are ideal externally maintained reservoirs. No flow of material down the solid rod is predicted. Numerical spatial discretisation and its error must be stated and independently tested.

## Material heat-capacity calculation

At298.15K,independent Shomate evaluation yields copper24.470514765242726J/(mol K)=385.08347913704597J/(kg K),rounded385;aluminium24.206256018849135J/(mol K)=897.1414261323531J/(kg K),rounded900. Values are recorded in property-reference-calculations.json. Constant-property behaviour outside the reference temperature is explicitly a teaching approximation,not a newly verified full temperature law.

## Initial core verification

heatConductors.ts and9focused tests implemented;no90UI or practical yet.48cell finite-volume exact modal evolution,stable integrated step-response,ideal half-cell bath contacts. Inputs length5–20cm/diameter3–12mm/hot25–45°C/time0–7200s. All three rods share cold/initial25°C.120s guide uses14s setup,96s physical progression,10s result hold;physical endpoint six stainless fundamental decay times,capped7200s.

4,824dense states(3materials×2lengths×2diameters×2hotsettings×201times)respect temperature bounds,nonnegative directional flux within numerical tolerance,monotonic warming and integrated energy closure within1e-6J. Equal-bath cases exactly unchanged. Diameter/length scaling independently checked.24→48→96cells show approximately fourth-fold reduction of spatial error. At dimensionless timesFo.01,.03,.1,1,the largest whole-profile continuum error is0.02835014K for48cells and0.00705080K for96cells. The deliberately coarser24cells reach0.115833K:the initial arbitrary0.06K bound on every grid was inappropriate and was replaced with explicit second-order convergence plus stricter production/fine-grid bounds0.03/0.008K. This was not an alteration of solver output.

Independent explicit finite-volume Euler checks refine dimensionless step ratio0.15→0.075→0.005,matching all48temperatures and both boundary integrals. Initial0.075ratio was too coarse for stainless's short10s transient(error0.022864K);finer0.005gives0.001526K,maxerrorrequirement0.004K retained. Copper/aluminium final errors0.000055/0.000064K. Analytic solver unchanged. Positive-time continuum end flux/mean energy checks also pass.

Finite-volume t0 hot-contact flux is resolution-dependent:the ideal continuum hot-boundary step has an instantaneous singularity. Do not portray the finite48cell starting power as an exact physical peak. Exposed maxProfileRoundoffK and heatRoundoffJ quantify clipping of numerical undershoots;integrated energy residual is retained,not forced zero. Reference default at7200s copper residualabout−9.75e-10J. No continuum-exact claim. First-frame thermal false-colour legend and this limitation belong in the eventual explanatory content.

## Practical,geometry and browser verification

32 worked blocks per material,96 per observation. Three split tables retain common preparation,three material temperature/power rows and three material energy rows. Exact independent preparation inputs and bounded notes are persisted;computed readings are reconstructed rather than trusted from storage. At tiny elapsed times,meanRiseK is retained before display addition to25°C and the stored-energy substitution uses that unrounded rise. Displayed operands/results use ten significant figures;small residuals must not be reconstructed from rounded meter readings.

Independent NumPy symmetric-eigendecomposition validator constructs the48-cell finite-volume matrix directly with end diagonal−3,interior−2 and off-diagonal1. It does not import the app solver or use its analytic sine eigenbasis. Seven synthetic reference trials pass3493 table/operand/result checks across672blocks. Actual16-trial browser download independently passes7984checks across1536blocks. Actual records comprise two complete guide endpoints,eight baseline physical observations(including0/10/30/60/90/180/7200/guideend),equal-bath7200s,long/thick60s,all-min/all-max7200s and1e-8s. Three materials per trial. Notes,plan,conclusion and16rows restored after reload. Figures and exact inputs do not constitute physical material measurements.

Final event-paced guide:14ssetup,30s early interval,35s intermediate,31s late approach,10s result hold. Physical stages are30(L/10cm)²s,180(L/10cm)²s,and six slow steel fundamental times. Default endpoint1547.118748717566s. Initial uniform time mapping was revised after browser observation showed copper/aluminium warming was too brief to follow. Old partial run stopped at99.4567s is not counted as a complete final guide. Revised2D and3D each actually ran120s. 3D label/camera refinements during its continuous run do not alter the shared clock. Core pacing continuity and length scaling tested.

Geometry is in centimetres;all48segments sum to actual rod length with correct diameter/volume. Four energy markers per rod use integrated local-face heat from right-side stored energy plus cold-meter heat,with shared20J phase period. They show energy transfer,not atoms or literal packet travel. False colour shares a fixed25–45°C scale. Material-finish toggle removes that overlay. Portrait3D rotates the apparatus so rods use the tall screen;camera bounds and label positions follow the rotation.

210normal cases(three preparations ×seven combined2D/3D scopes ×twoformats ×fivewidths320/390/820/1280/1920)and56theatre cases(seven scopes ×twoformats ×568x320/844x390/1024x768/1920x1080)pass ratios,nonzero media sizes,page overflow,text clipping and2D text-overlap checks. Initial overlap at the largest rod diameter in portrait was fixed by moving material-name baselines;15targeted rechecks across three probe positions and fivewidths pass. Early landscape legend/name/footer collisions and3D oversized label occlusion were fixed after screenshot inspection. Savednormal/theatre matrices reflect the corrected layouts.

At36guide seconds,the paused physical clock is22s. Eleven visible energy-arrow transforms remain identical across theatre/viewport changes;resume advanced to52.4391guide seconds before another pause. Camera orbit±zoom±reset,allmaterial scopes,probes,labels andtemperature-colour controls exercised. Final screenshots verified-conductors.jpg,material-finish.jpgandphone-conduction.jpg. Native data panes scroll as needed. Final console log empty;theme/viewport/theatre restored. These are simulated-viewport/internal checks,not physical-device,FPS,native-gesture or printer certification.

Cua observation timeout reset the tool kernel once;the existing live tab was rebound from fresh inventory(Chrome ID3 at that time,tab1331265968),without restarting the running final guide. The native-app inventory reported a locked Mac,but Chrome browser DOM and screenshots remained usable. This was not an application failure or evidence that playback stopped.

17focused science/record/geometry/pacing tests plus2navigation tests pass;full3080regression passed after pacing changes. Final compilation/build results are recorded in review/checkpoint once they finish.

Final checks completed:TypeScript77711exit0 and production Vite67623exit0(11.51s). Internal review freezes18source/shared files in review.json. Catalogue now marks90ready and91in_progress;official board mapping remains pending.
