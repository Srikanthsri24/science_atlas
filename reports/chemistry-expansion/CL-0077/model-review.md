# CL-0077 internal review completed2026-11-27

Authoritative result: review.json.12focused/2912fulltests,TypeScript and build pass. Both actual120s guides and records/device-viewport controls verified internally. Source hashes frozen. Historical development notes below are superseded by the final review.77reviewed locally;75published,lastpush75,nextpush100. Goal270remains active.

# CL-0077 model and implementation in progress

Original combined dry-mass/displaced-volume/density investigation,distinct fromCL0036's volume/overflow exercise andCL0048's paired equal-liquid-volume density comparison. Core,closed-water mesh,record/report and10focusedtests implemented. No UI/viewer browser review yet;not ready.

Chosen insoluble sinking ellipsoid reference:V10–30mL,ρ1.2–8g/mL,water180–240mL,cylinder area20cm²,radius√(20/π),rim22cm,graduations through400mL. Horizontal semiaxes1.6/1.2cm;vertical semiaxis3V/(4πac). Lowering setting0–1.2 references the flat central water plane;cap fraction3f²−2f³ forclampedf0–1. Chosen holder follows this setting quasistatically,not force-driven hydrodynamics. Specimen remains inside vessel/clear of floor/walls across tested full-domain corners.

Wall meniscus profile starts atr1.8cm outside the specimen footprint,rises quadratically to0.12cm atwall. Fixed profile volume0.425705665mL included in scale calibration and conserved water budget. Chosen illustrative calibrated profile,not a contact-angle/Young–Laplace equilibrium prediction. Exact analytical integration independently agrees with Simpson quadrature. Initial/final centralH=(Vcalibrated−Vmeniscus)/A,displacedcap added only for final. Difference cancels fixed meniscus volume.

Mass increments0.01/0.1/1g;volume increments0.5/1/2mL;nearest positive half ties upward. Quantized difference can differ from true specimen volume. Worst-case full-immersion density bounds use mass±rm/2 and volume difference±rv (sum of two half-increment allowances),not statistical confidence intervals and not a complete instrument uncertainty budget. Partial-immersion ratio never labelled valid density;zero-difference division guarded. Chosen waterρ1g/mL,g9.81m/s² forholder-force teacherextension;stored drymass never replaced with apparent submerged weight.

Water triangle mesh includes calibrated wall rise and actual specimen-shaped cavity. Visual tessellationN96,T36,12surface rings;independent signed-tetrahedron integration agrees with conserved carrier water to<0.25mL at24corner/immersion cases. Readings use exact analytic model,not approximate rendered mesh. No bubbles,wet film,absorption,dissolution,air-buoyancy correction,thermal expansion,calibration bias,splash or finite holder volume. Surface texture(if added)mustnot change analytic volume.

120s guide:15dryreading,10transfer,25partiallowering,15partialhold,35finallowering,20fullhold/calculation. Transfer pointer is presentation-only;drymass readout during transfer/immersion mustbe labelled stored earlier drymeasurement. No physical-speed claim. Need original2D/3Dapparatus,real controls/records/exports,persistence/fullguides/device/camera checks before internal review.

Private primary reference actually read2026-11-26: https://openstax.org/books/chemistry-2e/pages/1-4-measurements — density definition,units,mass versus volume and displacement method. Original derivations/code/prose/geometry;no copied passage or assets. EditorialClass6placement;no official2026–27board mapping or independentexpertcertification. Company-only attribution in student interface/report.
