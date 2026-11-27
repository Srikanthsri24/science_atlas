# Private source/model audit · CL-0091 · 2026-11-27

No source links in product UI. Internal numerical/engineering scope only;no independent expert or official-board certification.

## Verified reference equations

- U.S. Department of Energy,DOE-HDBK-1012/2-92,Volume2(1992),official copy: https://www.energy.gov/sites/default/files/2026-04/DOE-HDBK-1012-92_VOL2.pdf . The cylindrical-coordinate derivation onPDFpages33–35(printedHT-02pages12–14),especiallyEq2-8,uses radial surface area2πrL and logarithmic radius ratio for cylindrical conduction. Handbook examples use imperial units;our SI equations are derived consistently rather than copying numerical coefficients or material examples. Pipe ends are omitted in that derivation;our separate chosenGother explicitly represents the other lumped paths.
- University of Waterloo,ECE309Chapter8(2003),primary course slides: https://www.mhtlab.uwaterloo.ca/courses/ece309_reza/lecture/chapter8.pdf . PDFpage5,slide10 gives cylindrical resistance ln(r2/r1)/(2πkL);page3,slide5 gives convection resistance1/(hA). PDFpage6,slide12 gives critical cylinder radiusk/h and a heat-flow graph with a maximum at that radius. Pages5/6 were downloaded,rendered withPDFium and visually inspected(/tmp/atlas-conduction-page-5.png,/tmp/atlas-conduction-page-6.png). A search snippet from a different slide set incorrectly described a minimum heat rate and was not used.

Original differentiation of our series side resistance:

Rside=ln(r/r0)/(2πkH)+1/(h2πrH)
dRside/dr=[1/(kr)−1/(hr²)]/(2πH)

At r=k/h,resistance is minimum and conductance/heat rate at FIXED sample–room temperature difference is maximum. Above that radius,the resistance starts increasing,but may still be below the bare reference. This is not a claim that instantaneous power across separate cooling samples peaks there at every common elapsed time:their temperatures differ. Gother is independent ofradius and does not change the fixed-temperature critical radius.

## Properties and chosen apparatus references

- NIST SRM1453a publication: https://www.nist.gov/publications/standard-reference-materials-srm-1453a-expanded-polystyrene-board-thermal-conductivity . Its certificate-model scope is mean temperatures282–314K and bulk density43–53kg/m³. The default warm-water case can place a jacket outside that range. We do NOT extrapolate that certificate,claim the illustrated jacket isSRMfoam,or labelk0.04as a certified product value. The lab uses a GENERIC selected conductivity0.025–1W/(mK),with0.04as a low-conductivity teaching reference and0.4as an optional conductive-cover counterexample. No specific material density/Cp is claimed for the jacket.
- Constant waterCp4180J/(kgK) and density1000kg/m³ are rounded teaching approximations;see the privateCL-0088/0089material audits for liquid-water source context. Geometry does not claim exact hot-water thermal expansion or a calibrated meniscus.
- Inner water radius0.035m,wall outer radius0.036m and vessel rim height0.16m are chosen reference dimensions. Water mass100–500g fixes volume and wetted height. Maxheight≈0.1299m remains below the rim. Thin vessel-wall resistance is neglected. Chosen vessel heat capacity0–150J/K(default75) is independent effective capacity,not calibration from the illustrated wall density.
- Outside convection coefficient5–20W/(m²K)(default8) and lid/bottomGother0–0.2W/K(default0.08) are chosen effective references,not measured room data. Room remains25°C. Initial water/vessel25–65°C. No evaporation,phase change,explicit radiation,air/water spatial CFD,contact resistance or room warming.

The jacket has no thermal storage in this QUASI-STEADY resistance model. Its outer surface is obtained from the instantaneous side-power/convection drop. This does not resolve the initial transient while a real jacket heats,or certify every real thick cover. Any visualization must state the massless-layer approximation and must not invent a transient heat front or water motion that the model does not compute.

## Energy and precision

C=mCp+Cv,G=Gside+Gother,θ(t)=θ0exp(−Gt/C). Released heat uses Cθ0[−expm1(−Gt/C)],stored energyCθ(t),and side/other heat shares their constant conductance fractions. Water/vessel releases are split by capacity. Retained-energy difference uses a stable difference of exponentials rather than subtracting rounded displayed temperatures. Zero-time and isothermal states emit canonical positive0;undefined fractional reductions and finite-interval mean rates are null.

Initial loss-power reduction,current loss-power reduction and accumulated heat reduction are different quantities. Default at13033.343483556642s:bare30.4134113295°C,jacketed37.6954381446°C,retained difference12721.700846J. Initial power reduction42.6182%,accumulated heat reduction21.0545%,but current power reduction−34.5709%because the jacketed water remains warmer. Never label current watts as total heat saved.

## Current implementation checks

insulationCooling.ts and12focused core tests implemented.25,728 dense control-corner/time states verify water inventory,temperature bounds,monotonic cooling,stored/released/room accounts,path/material partitions and surface-temperature drops. Independently integrated temperature+two-path heat ODE converges withRK4 steps240→120→60s. Numeric radial midpoint integration10,000→20,000intervals converges to the logarithmic resistance;the first10,000interval test had1.245e-8K/Wabsolute error versus a1e-8target at a large-resistance case,so the quadrature was refined and the target retained. Solver and target were not weakened.

Critical-radius local derivative/peak and the beyond-critical-but-still-worse-than-bare counterexample pass. Zero thickness,isothermal input,small-time retained difference,late current-vs-cumulative reduction,low-k thickness/bypass comparisons,guide holds and invalid inputs pass. Record, geometry and both viewers are now implemented. Final internal review evidence is recorded separately in review.json.

Positive-thickness equal-rate control is tested at h5/8/10/20using k=h r0 ro ln(ro/r0)/(ro−r0). Qualitative same-rate classification uses an eight-machine-epsilon conductance band;raw conductance,temperature and heat differences remain unchanged and visible. This is numerical-resolution handling,not a claim of measured equivalence.
