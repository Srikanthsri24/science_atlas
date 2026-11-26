# CL-0047 — visualization and practical plan

Original250mL glass receiver with fixed lower blue water and growing upper gold reference oil. Graduated controlled-plunger oil source,slow1mL/s pour trace,a marked interface and free surface. Source loses exactly the volume the receiver gains. Render each liquid's actual cylindrical volume; do not animate displaced water or an invented permanent third phase. Interface is absent at the zero-oil start.

2D: calibrated receiver/source sections and linked pressure-versus-height plot. Mark the probe and each liquid's pressure contribution. Large portrait readouts and a taller magnified measurement region from the beginning; do not shrink the desktop overview into unreadable mobile labels. Show volume,mass and pressure with explicit units. Distinguish source inventory from receiver inventory.

3D: original receiver,finite dispenser,stand,nozzle and movable probe. Complete apparatus,receiver-focused and interface/probe inspection views with tested world-space camera bounds. Default focused view should keep the changing layers clear; explicitly identify any source outside an isolated view. Realistic transparent materials and level growth must follow the model. Use persistent line/geometry buffers and memoized observation rendering rather than allocating resources or rebuilding saved tables every animation frame.

120s guide:identify initial water,add oil for60s,lift the probe through both phases into air,then lower it to the base and reconcile pressure force with liquid weight. Manual time0–80s. Changing source/volume/density starts a fresh matched run; moving the pressure probe changes only the measurement position. Presets should target water,interface,oil,free surface and air without inventing an oil interface before oil arrives.

Practical:predict layer order;record physical time,chosen densities,water/oil/source volumes,interface/free-surface heights,phase masses,probe height/phase and each pressure contribution. Worked substitutions for A=πr²,h=V/A,m=rhoV,unit conversions,p=sum(rho gh),pA=mg and total budgets. Formal report includes aim,apparatus,method,observations,results,conclusion and limitations. Hydrostatics is a teacher extension. Compare matched cases; never infer immiscibility from density alone.

Verify both2D/3D and16:9/9:16,normal/theatre,320px phone throughTV,short landscape,dark theme,expanded panels,actual note/record reload and downloaded report. Check all material/volume limits,zero oil,flow completion,interface pressure and an above-surface probe. A model test is not a completed lab; keep status in progress until actual views,animation and practical workflow pass.

The prescribed constant-rate source should be presented as a metered dispenser or controlled plunger,not an unregulated gravity drain whose changing head would imply a different flow law.
