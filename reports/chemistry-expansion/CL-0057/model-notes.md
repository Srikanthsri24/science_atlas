# CL-0057 — Compare water samples using a turbidity model

Original2D/3D optical bench,120-second guides,practical record andworkedexamreport completed.26 targeted and2449 regression tests,TypeScript/build andbrowser/export reviews passed. See review.json for evidence andlimitations. Internalreview isnot independentexpert orinstrumentcalibration certification.

## Intended investigation

Compare matched100mL samples, a reference blank, slow/faster settling suspensions and a dissolved-colour comparison. Show source light, transmitted light and a detector at90degrees. Keep the direct and side signals distinct. A dark or less transparent sample is not automatically a high particle-scattering sample. Do not infer drinking safety from appearance. No NTU/FNU values or official instrument calibration are claimed.

## Model and units

Inputs: initial suspension0–200mg/L, chosen settling coefficient0–0.02s⁻¹, dissolved-colour absorption0–10m⁻¹, dilution factor1–10, path1–10cm, source1–10mW, physical time0–300s.

A fixed100mL final cell contains100/dmL original sample plus100−100/dmL blank. Starting particle concentration and colour absorption both divide by d. This is a new aliquot, not dilution by increasing the final cell volume. Particle mass in that aliquot is C0/d×0.1L.

The homogeneous upper optical compartment follows C(t)=(C0/d)exp(−kt). Settled mass is m0[1−exp(−kt)] and remains in a bed below the light beam. The small-time expression uses expm1 to avoid cancellation. This is a chosen compartment model, not a resolved settling front, particle-size/Stokes solver, coagulation or natural-water prediction. The future drawing must preserve this compartment interpretation and retained bed.

Scattering coefficient s=0.1C(t)m⁻¹; colour absorption a=a0/d; water background aw=0.02m⁻¹. These coefficients and collection fraction f=0.01 are chosen teaching references, not measured material properties or calibration.

Direct light I=I0 exp[−(s+a+aw)L], blank Iblank=I0 exp(−awL), normalized transmission I/Iblank=exp[−(s+a)L]. Optical density is (s+a)L/ln10. Path is converted from cm to m explicitly.

Illustrative central single-scatter signal at90degrees is I90=I0 f sL exp[−(s+a+aw)L]. Entrance and exit each have half-path attenuation. It is an explanatory one-event collection model, not a full angular/volume radiative-transfer integration. At high optical depth its side signal can decline; never treat it as a universally linear cloudiness meter. Multiple scattering, refraction, cell-wall reflection, bubbles, dust, spectral response, sensor drift/noise and calibration are not simulated.

Compare source-normalized or blank-relative readings rather than claiming a brighter source changes the sample. The simplified signal budget remains bounded by source power. Colour absorbs but contributes no particle side signal in this chosen model; this is not a universal statement about every dissolved material.

## Guide and visualization specification

120seconds:10s setup hold,90s movement covering0–180physical seconds,20s comparison hold. Both samples begin at80mg/L, source5mW, path5cm, no colour, no dilution. Settling coefficients0.002 and0.015s⁻¹ differ. Synchronize particles, retained bed, ray markers and detectors to physical time. No motion during setup/pause/final observation hold. Show weighted representative particles rather than literal particle counts or unvalidated physical velocities.

2D must include matched optical cells, beam path,90degree detector and elapsed-only concentration/signal history. 3D needs true perpendicular detector geometry, physically separate settled bed and upper beam, useful apparatus/optical-path views and appropriate cell transparency. Moving light arrows are explanatory markers, not light-speed rendering. No decorative gas bubbles.

Practical: blank first; prepare matched cells; record time, starting concentration, dilution, aliquot/blank volumes, path, source, colour and settling coefficient; record suspended/settled mass, direct/side signals, normalized transmission and optical density. Repeat matched controls, compare colour-only sample, document limits. Include formula substitutions, units, results and an exam-style conclusion. Do not convert relative optical results into NTU or safety certification.

## Private scientific sources

Read2026-11-26:
- EPA Method180.1, Revision2.0, August1993: https://www.epa.gov/sites/default/files/2015-08/documents/method_180-1_1993.pdf
  Sections2,4,6 and9 support defined-condition calibration,90degree measurement, colour/settling interference and formal quality controls. They do not validate our chosen optical/settling constants or certify this frontend as an EPA instrument. No standard-preparation chemistry is exposed as a student practical.
- USGS turbidity definition retrieved through search: https://www.usgs.gov/labs/national-water-quality-laboratory/science/science-topics/turbidity
  Optical scattering/absorption and transmission are distinct. Direct page retrieval timed out; do not represent this as a full document review.

Keep external references in private engineering evidence, not student-facing UI/reports. Original educational explanations and calculations. Class5 placement is editorial; official board mapping is not verified.

## Implementation review

76 SVG states,67 3Dreadouts,91 viewportcases,31 actualGUItrials and682 independentworkedresults checked. Observed2Ddetector-label and3Dheading/path-label overlap corrected,including distinctoverheadlabelpositions. Canvaschecks measuretheactualvisiblewrapper,notjustretainedbufferheight. Uppertracersusechosenk-scaledphysicaltime;zero-settlingpositionsremainfixed. Lightmarkersshowdirectionwithphysicaltime,andstoponpause/guideholds. Displayrescalingandrepresentativemarkersareexplicit. Studentreporthasthreeprinttables andexactreloadpersistence.
