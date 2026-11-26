# CL-0041 — sedimentation and decantation model draft

Original internal teaching reference. No UI, browser or independent expert review is claimed. Class4 placement is editorial and official board mappings remain pending.

Initial sample:2g spherical quartz reference and100mL water. Chosen/reference density2650kg/m³, water density1000kg/m³, viscosity0.001Pa s, g9.81m/s². Radius35–75µm gives diameter70–150µm, a fine-sand size reference, rather than falsely calling micron-sized clay/silt particles sand. Natural grain shape, mineral composition and size distribution are not calibrated.

Terminal force balance is6πµrv[1+0.15Re^0.687]=(ρp−ρw)(4πr³/3)g, with diameter-based Re=2rρw v/µ. Bisection solves the monotonic balance. The corrected speed is below the Stokes-only estimate. Re remains below the correlation's1000 limit in the supported range; this does not certify accuracy for real angular sand. The model starts in the terminal regime; startup acceleration, walls, hindered settling, flocculation and fluid return flow are omitted. Initial solid fraction is less than1% by volume.

Constant source cross-section0.00125m²; initial occupied volume includes both water and quartz. Growing saturated sediment bed uses packing fraction0.6. For uniform suspension, f=min[1,vt/(H−Bmax)], Bmax=Vs/(A×0.6). Settled plus suspended sand remains2g; clear upper water, cloud water and bed-pore water sum to100mL.

Decantation is an ideal top-layer withdrawal from a frozen settling snapshot. This is a sampling/separation reference, not a numerical tilting/pouring flow model. The withdrawal parameter is total mixture volume0–80mL, not pure-water volume. Remove clear water first; any further volume samples the uniform suspension cloud. The packed bed is undisturbed. Receiver sand volume is subtracted from mixture volume to obtain receiver water. Source plus receiver conserve2g quartz,100g reference water,102g total, and100+2/2.65mL additive phase volume. Settling is deliberately frozen during this instantaneous ideal withdrawal; staged transfer animation must disclose this. Do not advance physical settling time during staged transfer or imply resuspension/continued-settling dynamics are solved.

The source residue remains wet. After complete settling and80mL withdrawal, the reference source contains20g water+2g sand=22g wet residue, not22g dry sand. Retained sand percentage includes source suspension and sediment; it is potential retained sand, not dry recovery. Receiver water mass fraction is undefined with no sample and refers only to the two included constituents, not chemical or microbiological purity.

110s guide compares two fresh50µm-radius samples: wait2s and withdraw80mL; then reset, wait20s and withdraw the same80mL. Physical settling seconds and staged transfer progress must be displayed separately. Enlarged illustrations must not be counted as actual resolved grains.

Private principle checks, excluded from student UI and reports:
- [NCERT upper-primary science-kit manual](https://www.ncert.nic.in/pdf/publication/otherpublications/Manual_of_Upper_Primary_Science_Kit-Class_VI_VII_VIII.pdf): sedimentation/decantation concept support, not an official Class4 mapping.
- [COMSOL particle tracing manual](https://doc.comsol.com/6.3/doc/com.comsol.help.particle/ParticleTracingModuleUsersGuide.pdf): Schiller–Naumann correlation.
- [OpenFOAM original correlation implementation](https://cpp.openfoam.org/v12/SchillerNaumann_8C_source.html): independent formula/diameter-based Reynolds cross-check.
- [University of Virginia Stokes flow lecture](https://galileo.phys.virginia.edu/classes/311/notes/fluids2/node7.html): low-Reynolds-number limit and force balance.

References support principles and formula scope, not chosen parameters or measured recovery. Explanations and implementation are original.
