# CL-0002 — Transparency model work in progress

The pure numerical model is implemented and tested. Viewer, interaction, animation and practical-record work are pending. It is not counted complete.

Chosen, uncalibrated narrowband slab coefficients divide input radiant power into reflected, absorbed, direct-transmitted and forward-diffuse-transmitted channels. Absorption is represented by exponential attenuation; a separate forward-scattering fraction splits transmitted power. The channels conserve radiant power.

Planned comparison: an image-preserving clear sample, a bright but strongly diffusing frosted sample, and a strongly attenuating opaque sample. Zero thickness means the slab is absent. No physical material constants, refraction solver, multiple-scattering transport, luminous-flux calibration or human-vision threshold are claimed.

Next: build recognisable sample plates, light source and target, moving light guides with explicitly slowed display time, a 100-second explanation, manual sample/thickness/source controls, practical trials and an exam-style report.
