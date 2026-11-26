# CL-0056 — Observe a dissolving mass balance in a closed container

Original 2D/3D sealed apparatus and practical notebook implemented. Final browser/export review is in progress; completion is controlled by the review ledger.

## System boundary and learning goal

Water25–100g and salt1–20g start inside a sealed apparatus. The salt begins in an INTERNAL cup; the outer lid remains closed during transfer. Include cup salt, in-flight salt, released undissolved salt and dissolved salt in the same mass boundary. Apparatus reference tare150g includes fixed vessel/lid/cup/stirrer and trapped air; contents mass is water+salt. No evaporation,spillage,leakage,adsorption orchemical reaction. Do not label dissolved salt as vanished mass or confuse dissolution with melting.

An internal gate releases salt uniformly over10physical seconds. A prescribed0.1s transport delay tracks in-flight salt between release and arrival. This delay is a chosen reference,not a ballistic trajectory/force prediction. Release finishes at10s; last arrival is10.1s. The drawing must distinguish those events andmust not drop the in-flight inventory. Twelve moving weighted clusters represent the transit inventory; they are explanatory markers, not literal grain counts or ballistic trajectories.

## Analytic model

Let S be initial salt,W water,k chosen relaxation0.005–0.08s⁻¹,t physicalseconds0–300,τ=0.1s.

Released=S min(1,t/10); arrived=S min(1,max(0,t−τ)/10); cup=S−released; in-flight=released−arrived.

Capacity C=0.36W g at the chosen25°C reference. Target dissolved mass=min(arrived,C). The phenomenological law is dD/dt=k(target−D),not an empirical stirrer-RPM correlation orfull surface/molecular dissolution solver.

With a=S/10 and active u=max(0,t−τ), the linear target ramp lasts Tramp=min(10,C/a). During the ramp,D=(a/k)[ku+exp(−ku)−1]. After absolute time τ+Tramp,the target M=min(S,C) is constant and D=M−(M−Dend)exp[−k(t−τ−Tramp)]. A series for small ku avoids cancellation. Store the small post-ramp lag directly;do not silently declare finite-time complete dissolution just because a displayed number rounds to its equilibrium value.

Released-undissolved=arrived−D. Cup+in-flight+released-undissolved+D=S at every time. Water remainsW. Whole contents=W+S even while solution mass andcompartment masses change.

## Indication and reference geometry

Gross reference=150+W+S; net contents=gross−150. Reporting resolution0.1g rounds the static-equivalent reference. These are NOT instantaneous force measurements during grain impact orstirring. UI/report must say equivalent static indication andinstruct waiting for a real balance to settle. No sensor calibration/noise/vibration/air-buoyancy model.

Water density0.997g/cm³,NaCl solid density2.165g/cm³ anddissolved partialvolume0.28cm³/g are chosen drawing references. Solution volume=W/0.997+D×0.28;undissolved/cup/in-flight solid volumes use mass/2.165. The partialvolume is an explicitly chosen approximation,not measured solution-volume data. Total represented material volume cancontract as salt dissolves whilemass staysconstant. Any bulk grain packing needs its own declared void fraction;do not count voidspace as extra liquid. Use a 25°C isothermal reference;no enthalpy/heat transfer calculation.

## Guide specification

120s:10s setup hold,100moving presentation seconds cover0–180physical seconds,10s observation hold. Default W50g,S15g,k0.01s⁻¹. At180s some reference salt still remains undissolved. Gross215g,net65g. Do not end with a false all-dissolved badge. Demonstrate source depletion,finite in-flight transfer,shrinking undissolved inventory,solution distribution andconstant whole-system reference reading. Manual controls canreach300physical seconds andcapacity-limited cases.

## Verification

23 targeted tests cover complete compartment budgets atcorners,finite dose/transport,analytic ODE derivatives,ramp/dose transitions,capacity excess,rate comparison,small-time stability,positive finite-time lag,static tare,volume/mass distinction,120s guide andinvalid input. Original SVG and Three.js views have been browser tested with elapsed-only history, three camera targets, gross/net display, dual-axis zoom, responsive theatres and notes. A phone theatre defect collapsed the actual canvas wrapper despite a retained nonzero canvas buffer; corrected the lab-specific descendant selector and bounded caption/notes heights. Earlier-lab patterns require the separately recorded containment audit. This is internal engineering review, not independent expert certification.

The stirrer and representative ions use physical simulation time, so setup and final observation holds do not imply ongoing physical motion. Manual and guided pauses preserve the same physical state.

## Private primary references

Checked2026-11-26 through primary ACS educational search results:
- https://www.acs.org/education/resources/k-8/inquiryinaction/fifth-grade/chapter-4/conservation-of-mass.html
- https://www.acs.org/content/dam/acsorg/education/k-8/inquiry-in-action/fifth-grade/g5-l4.1-bkgd.pdf
ACS supports classroom conservation ofmass during dissolving andincluding all matter inside aclosed boundary. It doesnot certify thechosen relaxation law,transport delay,volume approximation,apparatus tare orofficial Indian board chapter mapping. All explanations andmodel calculations are original. Keep external source references inprivate engineering records,not studentUI/report.
