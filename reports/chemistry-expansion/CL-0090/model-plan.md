# CL-0090 · Compare heat conductors among materials

Status: in progress; not reviewed or available as a finished lab.

## Investigation

Compare three equal cylindrical rods: copper, aluminium and stainless steel304. Initially all rods and the right-hand thermostat are at25°C. At time zero the left-hand thermostat is set to a chosen25–45°C. End contacts are ideal, lateral surfaces insulated. Geometry and both bath conditions are shared. No melting wax or fake flame: the investigation measures cell temperatures, conducted power, accumulated bath exchange and energy stored in each rod.

Realistic demonstrations must show a spatial temperature profile evolving from the hot end, not uniform recolouring. At long time all rods share the same linear temperature profile but conduct different powers. Distinguish thermal conductivity from thermal diffusivity; heat capacity and density affect transient warming. Thermostats maintain their stated temperatures by supplying/removing energy and are not finite isolated stores as in89.

## Proposed numerical reference

One-dimensional constant-property heat equation. Cell-centred finite-volume rod with48equal cells and half-cell end distances. Conductance kA/dx between cells and2kA/dx to fixed-temperature end baths. Each cell capacity rho Cp A dx. Exact matrix-exponential evolution of this spatial discretisation, using the symmetric operator's eigenmodes sin((i+1/2)pπ/N),p1..N,with eigenvalues −4alpha/dx² sin²(pπ/(2N)). NormN/2 except lastmode normN. Initial uniform25°C; steady state linear at cell centres. Integrate boundary fluxes analytically using stable expm1; compare Qhot−Qcold with cell enthalpy gain. Publish residuals and state the spatial resolution. Full nonnegative heat-flow handling and small-time cancellation need numerical investigation before choosing final implementation.

Controls: common length5–20cm, diameter3–12mm, hotbath25–45°C, physicaltime0–7200s. Default10cm,6mm,45°C. Compare same conditions at equal clocks.120s guide with setup, an expanded early-warming interval, spatial heating, approach to steady and result holds; physical endpoint about six slowest stainless fundamental time constants, capped7200s. Equal-temperature counterexample must remain unchanged with zero heat flow. Diameter changes powers/mass together without changing ideal1D temperature evolution; length changes both conduction resistance and diffusion timescale.

## Visual and practical requirements

Original three-lane 2D rod/contact/thermostat assembly and original3D metal rods with false-colour thermal overlay (clearly labelled,not physical visible glow), inspectable probes, side-profile graphs and moving energy-flow markers tied to computed flow. Show common numeric temperature scale. True16:9/9:16, accessible controls and current numerical readings. No atom-transport interpretation: metal atoms do not stream down a rod with heat. Retain optional material finish view only if it genuinely works.

Notebook: shared preparation, per-material probe temperatures and heat fluxes, storage/throughflow accounts, material k/rho/Cp/alpha, area/length/unit conversion, Fourier steady-power calculation and transient balance. Detailed numeric substitutions, equal-time observations, comparison result and exam report. Human conclusion must distinguish model evidence from a measured material identification.

## Required validation

Independent direct finite-volume time integration with convergent timestep; independent continuum Fourier series at positive times and spatial convergence24→48→96cells; energy balance; initial/steady limits; equal-bath no-motion; length/area scaling; maximum principle and monotonicity; heat flux direction; endpoint discontinuity scope; every input bound; guide. Then actual complete120s playback in both modes,GUI trials/download independent validation,local persistence and responsive/theatre checks. Do not mark ready before all gates pass.
