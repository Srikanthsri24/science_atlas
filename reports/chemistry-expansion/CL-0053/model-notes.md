# CL-0053 — Compare sieving and filtration

Model-only checkpoint:nine tests passed. UI,geometry,record/report andbrowser review remain incomplete. Do not mark ready.

Two independent equal feeds for matched wet-sieving/ordinary fine-filtration comparison. Input liquid is an ALREADY PREPARED SOLUTION volume50–200mL,not water volume before salt dissolution. Reference prepared solution has1g dissolvedNaCl per100mL. Profiles:reference(10g sand,15g gravel,salt solution),salt-free(same grains,no dissolved salt),more-fines(20g sand,10g gravel,salt solution). Each arm has its own complete initial feed;pair initial liquid is2V. No solution density/solvent mass orvolume-of-dissolution prediction is needed. Liquid volume,sand mass,gravel mass anddissolved salt mass close separate budgets.

Reference rigid grains:150µm fine sand and3000µm gravel. Adjustable straight ideal openings:sieve250–4000µm,filter10–250µm. Grain diameter>=opening is retained (zero-clearance equality doesnotpass). These are chosen ideal references,not a manufacturer's sieve/paper grade orpolydisperse realgrain distribution. Dissolved salt follows the liquid in BOTH arms andis not represented as a150µm grain. This statement applies to the modelled ordinary particle-size separation,not all selective membranes oradsorbing media.

Uniform well-mixed feed transfer over60physical seconds is prescribed,f=min(1,t/60),not a hydraulic-rate/clogging prediction. No settling,capacity limits,adsorption,capillary liquid hold,particle bridging orpressure solution. Ideal immediate drainage andzero apparatus holdup assumed. The same prescribed rate makes material-outcome comparison clear;actual equipment can have different resistance/settling/capacity. No drinking-safety claim.

Default atcomplete transfer:perarm100mL prepared solution including1g salt. Sieve500µm retains15g gravel andpasses10g sand. Filter20µm retains25g undissolved grains andpasses no reference grains. Salt concentration inboth collected liquid streams remains1g/100mL;undefined when collection volume iszero. Larger filter openings can pass sand;large enough sieve openings can pass gravel.

Chosen grain density2.65g/cm³ supports displacement volumes:source occupied volume=remaining prepared liquid+remaining solid mass/density;receiver occupied volume=collected prepared liquid+passed solid mass/density. Retainer solid volume=retained mass/density. These three represented occupied volumes sum to the initial prepared liquid+solid volume. If a future retainer uses a bulk packing height,distinguish air-filled voids from grain volume;do not silently add retained liquid that is absent from the current model. Grain glyph counts/visible mesh pitch may be representative andmust be labelled. A magnified opening view should use trueµm/mm relationships,not imply microscope-sized filter holes are visible at a normalbench scale.

Guide specification120s:15s setup,90moving presentation seconds compress60physical seconds,15s conclusion. Proposedmanual120s spans90physical seconds. Setup holds must have no moving liquid. Full browser playback andpause/record behaviour must be tested before ready.

Nine tests independently cover reference retention,component budgets across profile/control corners,dissolved salt,wrong/coarse openings,equality boundaries,finite matched transfer,occupied-volume displacement,guide budgets andinvalid input.

Private engineering references checked2026-11-26:
- https://edu.rsc.org/experiments/separating-sand-and-salt-by-filtering-and-evaporation/386.article
- https://www.rsc.org/cpd/teachers/content/filerepository/CMP/00/000/455/CCE-1-SeparatingASandAndSaltMixture.pdf
RSC primary search results describe sand retained byfiltration while dissolved salt remains in thefiltrate. Directfetch ofarticle/PDF returned405;do not claim full-document extraction orofficial curriculum alignment. Use original explanations. Do not put external source links instudent UI/reports. Model-specific cutoff/transfer/displacement calculations are independently derived chosen teaching approximations.


## Implemented and internally checked
Original 2D/3D paired apparatus and same-scale opening comparisons,120-second guides,34 worked substitutions per trial and21-column practical record are complete.32 actual GUI trials anddownloaded1088-block report independently checked;exact persistence afterreload.63 SVG states and50 3D readouts checked;70 responsive cases.20 targeted and2357 totaltests,TypeScript andproductionbuild passed. See review.json for chosen assumptions andlimits;no independent-expert orofficial-curriculum claim.
