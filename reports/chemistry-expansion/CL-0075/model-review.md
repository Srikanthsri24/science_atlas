# CL-0075 model review in progress

Original generic dilute passive-tracer model, not a named chemical calibration. Identical sealed rectangular channels; constant independently chosen D; zero normal flux at walls; zero-thickness initial partition. Longitudinal concentration initially uniform in the left half, zero in the right. No bulk flow, pressure transport, thermal convection, adsorption, chemical reaction or concentrated multicomponent correction.

160-cell conservative no-flux finite-volume Laplacian solved by discrete cosine eigenmodes. Numerical initial-step face flux is finite, whereas the continuum ideal step flux is singular at zero. Independent continuum half-mass Neumann series agrees within 0.0001 absolute mass fraction at tested dimensionless times0.001,0.01,0.1,0.4. This is not an error guarantee for all times or local concentrations. Right-half mass derivative independently agrees with central grid-face transfer. Uniform criterion uses maximum cell concentration deviation at most5% of mean.

Equal-clock trial and matched Dt/L² trial explicitly separated by a reset. Matched progress is not equal physical time. D in m²/s converted to mm²/s; volume mm³ to mL. 28-level truncated Levy–Ciesielski Brownian construction on dimensionless horizon32, deterministic hashed Box–Muller coefficients, 64 reflected representative tracers per channel. Finite tracer counts do not determine continuum concentrations or masses. Statistical variance and temporal covariance/cross-axis checks are numerical ensemble checks, not a proof of pseudorandom independence or molecular dynamics validation.

Private engineering references read2026-11-26 (not student-facing links):
- https://www.comsol.com/multiphysics/diffusion-equation — primary vendor documentation: Fickian flux, constant-D dilute trace species scope, diffusion length squared/time scaling. Original implementation and numerical derivation; no copied passages/assets.
- https://sites.duke.edu/probabilityworkbook/category/stochastic-calculus/construction-of-brownian-motion/ — primary university teaching: Levy Gaussian refinement construction and covariance. The implementation uses equivalent triangular Schauder expansion; original code and finite truncation.

Editorial Class6 placement. No official2026–27 board mapping or independent expert approval claimed. Browser review still in progress; do not mark ready based on this file.
