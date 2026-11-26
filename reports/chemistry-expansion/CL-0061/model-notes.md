# CL-0061 — acid/carbonate gas production

Core implemented,16 focused tests pass. UI not implemented. Editorial Class5 investigation; quantitative stoichiometry and gas-law calculations are teacher extensions.

CaCO3 +2HCl → CaCl2 +CO2 +H2O. Rounded internally consistent molar masses100.086,36.458,110.978,44.009,18.015g/mol preserve the reacting-material mass budget. Extent limit=min(initial carbonate mol,initial acid mol/2). Chosen first-order extent relaxation xi=xiMax*(1-exp(-kt)), not calibrated material kinetics or an acid-concentration rate law. Exponential residual inventories retain finite tails. Noacid/nocarbonate controls give zero product.

Ranges:carbonate0–0.5g,acid10–30mL/0–0.3mol/L,20–35°C,90–110kPa,chosenk0.005–0.03s^-1,time0–600s. Defaultcarbonate0.3g,20mL0.2M acid is acid-limited at0.002molCO2 maximum. An ideal frictionless200mL gas syringe maintains constant pressure.The150mL flask plus5mL tube contain initial air outside the initial liquid and solid volumes; all gas mixes uniformly. Generated gas equivalent volume is xiRT/P, but the gas inside the syringe is AIR/CO2 MIXTURE, not pure collectedCO2. Partition both air andCO2 by current syringe/deadspace volume. Shrinking carbonate releases solid volume, increasing deadspace; piston expansion is gas-equivalent volume minus released solid volume. Initial air mass unchanged and excluded explicitly from reacting-contents budget.

Initial acid-solution drawing density1g/mL, watermass=solutionmass-initialHClmass. Include generatedwater andaqueousCaCl2,remainingHCl,remainingcarbonate andCO2 in material budget. No CO2 dissolution, water vapour, gas leakage, piston friction, pressure rise or heat-balance model. Temperature changes ideal volume only; chosenk held independent.

Guide planned120s:10setup+100evolutionto300physicalseconds+10hold. Manual120s spans600physicalseconds. Need original conicalflask,deliverytube andmoving calibratedpiston; shrinking solid andrate-dependent representative bubbles; elapsed gas-volume/material histories, actual scientific annotations andpracticalrecord. Never render the syringe gas as pureCO2 or confuse cumulativegas with rate.

Private sources: BBC original Measuring production of a gas transcript read in full via web tool; supports CaCO3/HCl products,flask/tube/bung/clamp/syringe apparatus andtime/volume observations. Does not calibrate chosenkinetics,ideal gas,deadspace mixing or modelinputs. RSC original page returned405; do not claim fullpageverified. CCEA official reaction-rate factfile retrieval underway. Keep sources outside studentUI/report.

## Geometry correction and tests

Fixed120mLdeadspace was replaced before visualization: initialdead=150+5−initialacidmL−initialcarbonateG/2.71. Drawing solution volume stays atinitialacidmL,an explicit approximation. Carbonate drawingdensity2.71g/mL;currentdead=150+5−acidmL−remainingcarbonateG/2.71. Gas-equivalentvolume=nRT/P. Piston volume=n*(Vm−100.086/2.71). This preserves totalgasvolume=initialdead+nVm=currentdead+pistonvolume. Idealpressurecontrolledthroughfreepiston. Allmaterialbalances stillclose.

Geometry:128-sidedpolygonflask,baseR3.6cm,5cmshoulder narrowingto0.9cmneck,2cmneck. Baseheightcomputedsoactualclosedcapacity150mL. Liquidandchipsstayinsidebasecylinderatallinputcorners.16equal-weightcubicchips representactualremainingsolidvolume;separated/submerged/contained. Syringepolygoncrosssection10cm²,20cmfulltravel→200mL. Reference tube deadvolume5mL;simple3Droutingwillbeschematic,notclaimedvolumetricunion. Modelhistoryexactendpoints tested. New16tests pass;2D/3DUIstillnotimplemented.
