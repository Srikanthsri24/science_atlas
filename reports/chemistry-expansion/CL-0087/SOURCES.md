# Private engineering source audit · CL-0087

Consulted 2026-11-27. No source links added to product UI.

- University of Kiel, J. Carstensen, Thermodynamics and Kinetics II, §2.9 Eutectic phase diagrams: https://www.tf.uni-kiel.de/matwis/amat/td_kin_ii/kap_1/backbone/r_se16.html — fixed eutectic temperature/composition, three-phase invariant and adjacent solid/liquid fields. Actual Pb/Sn example is NOT used as model data.
- University of Houston, An Introduction to Phase Equilibrium: https://www.uh.edu/~jbutler/petrography/phase.html — constant-pressure binary diagram and component-conserving lever rule.

Original derivation: ideal-liquid chemical potential is mu_l,pure+RT ln x; pure solid/liquid difference with equal Cp is mu_l,pure−mu_s = L(1−T/Tm). Equating mu_s and mu_l gives ln x=−L/R(1/T−1/Tm). Eutectic is sum of saturation fractions=1. At an A-rich two-phase state all B is liquid, so nL/n=(1−xA)/(1−xA_liquid); complementary equation for B-rich state. At eutectic both pure solids can melt in the invariant liquid ratio until one is exhausted. H/n=Cp(T−Tinitial)+aLA+bLB, with a,b moles melted per original mole.

Teaching constants are ORIGINAL HYPOTHETICAL reference values, NOT measurements, calibration, or properties of named chemicals: TmA333.15K,TmB353.15K,LA10000J/mol,LB12000J/mol,Cp50J/(mol K) equal in solid/liquid. Initial278.15K,controller maximum363.15K. Pressure fixed; ideal liquid/separate pure solids; no apparatus heat, spatial gradients, mixing enthalpy, finite-rate melting or superheating. An ideal controller supplies specified net sample heat. Do not label heater electrical power. This is a qualitative phase-equilibrium investigation, not a prediction for household mixtures.

Internal engineering review pending. No independent expert or official board verification claimed.
