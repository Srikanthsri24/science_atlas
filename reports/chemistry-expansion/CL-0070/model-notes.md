# CL-0070 — sedimentation before and after flocculation

Current status: scientific core, geometry helpers and practical record engine implemented;22 focused tests pass. Viewers/browser review are still required. Original editorial Class5 placement; numerical formulas are teacher extensions.

## Scope and preparation

Compare two already prepared, matched dilute suspensions: unflocculated primaries and ideal porous aggregates. This compares physical settling before/after preparation; it does not invent a coagulant-dose, aggregation/breakup chemistry or empirical kinetic model. Original water80–120mL, mineral dry solid10–100mg, primary radius1–3µm, chosen dynamic viscosity0.8–1.5mPa·s. Prepared primary counts per aggregate N∈{1,16,36,64,100}; N1 is a genuine no-aggregation control. Chosen mineral/water density2650/1000kg/m³, column area10cm², object bed packing0.6. Uniform starting suspension. Water quantity is original water, not total mixture volume.

## Individual effective object

Chosen Df2 effective radius Rf=r√N, internal dry-solid volume fraction φf=N Vprimary/Veffective=1/√N. Effective wet-object density ρf=ρw+(ρs−ρw)φf includes internal water. Dry object mass is NρsVprimary, so increasing N changes the object count without changing the original dry-solid amount. Fluid-relative low-Re sphere reference vrel=2(ρf−ρw)gRf²/(9µ). Across allowed corners Re<0.04. This uses an equivalent impermeable drag envelope, not measured real-floc shape/permeability. For Df2, R grows while density contrast falls; vrel scales√N, not N.

Initial solid fraction φ0=Vs/(Vwater+Vs), effective object-envelope fraction φobj=φ0/φf<0.005. Dilute zero-volume-flux correction: downward lab/batch velocity v=(1−φobj)vrel; external carrier upward reference uw=φobj*vrel. This enforces φobj*v=(1−φobj)uw. Internal water accompanies the effective object; no empirical hydrodynamic hindering calibration is claimed. Startup inertia is neglected; a terminal relaxation reference is reported.

## Coupled settling fronts and wet bed

Initial mixture V0=Vwater+Vs, H=V0/A. Constant chosen saturated-bed solid fraction β=0.6φf; maximum wet-bed height Bmax=Vs/(Aβ). β>φ0 throughout controls. Let v in cm/s. While partially settled, cloud top zc=H−vt, bed b=Bmax*f and solid balance requires φ0 A(zc−b)+βAb=Vs. Hence f=vt/(H−Bmax), completion=(H−Bmax)/v. Clamp f at1; after completion cloud top meets the fixed wet bed. Do not use f=vt/H while simultaneously growing a finite-volume bed: it breaks the material balance.

Compartment volumes: wetbed Ab; cloud A(zc−b); clear A(H−zc). Dry solid in bed Vs*f, in cloud Vs*(1−f). Water in each mixed compartment is its envelope minus its solid-only volume; clear compartment contains only water. Total original water, solid volume, dry mass, mixture volume and whole-sample mass close independently. Local cloud concentration remains constant until the cloud disappears. Its terminal value is N/A, not a fabricated divide-by-zero result. Clear volume excludes water still held in the saturated porous bed. Clear appearance is not proof of purity or complete treatment.

## Geometry and animation requirements

Closed128-polygon jar with area10cm², inside bottom0.5cm,0.12cm wall,0.15cm base,1.2cm freeboard. Actual wet-bed/cloud/clear envelope triangles preserve exact phase volumes, and a true ring-cap annulus keeps the glass cavity open. Bed/cloud colours denote composite phases, not all-solid/all-water volumes. The real bed is thin; show a labelled uniformly scaled cropped bottom section, not an exaggerated full-jar thickness.

80 enlarged representative height markers follow y=y0−v*t and are removed once captured by the bed. They are explanatory packets, not literal particle/floc counts or extra material volumes. Continuum phase fronts and calculated inventories remain authoritative when marker sampling has sub-packet residuals. Optional microscopic structure uses N connected, nonoverlapping equal-primary cores within the chosen effective spherical drag envelope, coordinates inµm. Each new core touches an earlier neighbour, no core escapes the envelope. This is an illustrative structure consistent with the mass/porosity reference, not a measured real-floc morphology or inferred drag calculation. Label the envelope and units.

120s guide:10setup+75presentationseconds to default floc completion+25presentationseconds to2400physicalseconds+10hold. This ensures75s of actual default-floc descent before its settled comparison. Physical time is explicitly accelerated in two segments. Default primary suspension is still settling at2400s. Manual controls may expose full0–2400s; changing preparation resets fresh samples. No-aggregation control stays identical to primary reference.

## Limitations

Prepared monodisperse references, chosen Df2/effective radius/density and constant bed packing; dilute low-Re sphere drag, volume counterflow and sharp concentration fronts. No binder/coagulant mass, dose optimization, chemical aggregation/breakup kinetics, calibrated permeability or empirical hindering, Brownian transport, wall corrections, turbulence, ongoing compression, startup inertia, decantation, filtration or dissolved-contaminant removal solver. No claim of measured apparatus kinetics or official curriculum mapping.


## Final internal review
Original 2D/3D/practical UI completed. Review evidence records23 focused tests,2767 regressions, both full120second guides,91 responsive viewer cases, independent rendered/state/report calculations and52 persisted GUI observations. See review.json for assumptions and honest scope.
