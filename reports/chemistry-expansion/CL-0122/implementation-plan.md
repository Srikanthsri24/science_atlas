# CL-0122 — Copper electroplating and deposited mass

Next sequential investigation; not implemented or reviewed yet.

Use a virtual copper anode and a masked conductive cathode with a defined exposed face in an adequate copper(II) electrolyte. Supplied regulated current, unity current efficiency and Cu2+ +2e− -> Cu bookkeeping; no predicted voltage/transport rate. Verify copper molar mass/density from primary sources before quantitative implementation. Preserve source history and finite anode inventory; explicitly account for source cutoff at depletion instead of creating copper or claiming unused requested charge passed through the ideal copper-only reaction.

Conserve copper: anode loss equals cathode gain; ideal well-mixed bath has no net copper change with a soluble copper anode. Any aqueous-ion animation is a labelled explanatory representation, not one-to-one measured molecular trajectories or a transport solver. Model surface coating mass and average thickness using masked exposed area and documented density. Use a separate magnified cross-section with explicit scale if real coating thickness is too small to see.

Provide original2D/3Dapparatus, visible current/ion transfer and deposition, balance readings, selectable electrodes, >=150s explanation, controlled intervals/pause, current/source history, bounded geometry and finite material. Practical tables should contain initial/final anode/cathode masses, passed charge, deposited mass, area/thickness, conservation residuals, SI substitutions and exam-style conclusions/limitations. Persistence/originalescapedHTMLexport required.

Gates: independent Faraday/mass/thickness and finite-inventory checks, geometry/camera bounds, report operand/unit/provenance audit and corruption rejection, actual full playback/control/native camera/responsive/notebook/export checks, TypeScript/build/regression and frozen internal review. No official curriculum or independent expert claim.
