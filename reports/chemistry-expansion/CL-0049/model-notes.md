# CL-0049 — Observe melting and freezing of a chosen material

In progress. No UI or final review is claimed for this lab yet.

## Original investigation

Chosen material: reference pure water at approximately atmospheric pressure. A piecewise enthalpy model starts heat/cycle investigations with ice at −10°C and cooling investigations with water at10°C. The virtual controller imposes a net sample heat rate of50–400W,not an electrical heater efficiency or a solved conduction field. Mass50–100g; physical time0–240s. Constant reference values: ice specific heat2090J/(kg K),water specific heat4186J/(kg K),fusion latent heat334000J/kg. The energy reference is solid ice at0°C. Within the fusion interval,temperature is0°C and added/removed enthalpy changes liquid fraction. Single-phase enthalpy changes temperature.

An ideal controller cuts heat transfer at−20°C and60°C. Requested and actually transferred heating/cooling energy are accounted separately; demand suppressed at a limit is explicitly recorded. The120s reference cycle uses50g and400W,heats for60s and then removes heat for60s. It returns to the initial cold-ice state without a cutoff. No boiling,supercooling,nucleation delay,evaporation,apparatus heat capacity or spatial gradients are solved. Constant phase properties are approximations;no physical-device calibration or independent expert certification is claimed.

## Geometry plan

A squat250mL cylindrical receiver has4cm internal radius. Fixed illustrative densities0.917g/mL ice and1g/mL water determine separate phase volumes. Ice is represented by a shrinking/growing cube,not a solved freezing front or realistic crystal morphology. The square cube's corners fit inside the circular opening at the100g bound. A separate hydrostatic geometry calculation either supports the cube on the floor or floats it at displaced-water weight equilibrium. Liquid inventory is reconstructed by cylinder volume minus submerged ice. Wide-vessel floor support is normal through much of melting;the small remaining cube floats late. Do not animate all ice as floating when too little liquid exists to support it.

## Primary scientific references,private engineering record

- OpenStax College Physics2e §14.2,https://openstax.org/books/college-physics-2e/pages/14-2-temperature-change-and-heat-capacity . Read official text and table14.1 on2026-11-26. Supports sensible heat Q=mcΔT and representative heat capacities,including2090 for ice and4186 for water. Constant values here are approximations,not a temperature-dependent property model.
- OpenStax College Physics2e §14.3,https://openstax.org/books/college-physics-2e/pages/14-3-phase-change-and-latent-heat . Read official text/table14.2 on2026-11-26. Supports latent heat Q=mLf,a0°C reference fusion plateau and334kJ/kg for water. Heat and freezing/cooling use opposite energy transfers. The120s protocol,controller limits,phase-inventory cube and all eventual scenes/content are original.

These references stay outside student-facing UI and reports,per the user's company-branding preference. No external assets or textbook passages were copied.

## Current verification

Ten thermal-model tests and four geometry tests passed. Checks include independent sensible/latent reconstructions,mass and enthalpy budgets,requested-versus-delivered controller energy,melting/freezing plateaus,continuous reversal,complete reference cycle,invalid inputs,cube/cylinder fit,actual liquid displacement and floor/buoyancy force balance. An early test assumed a long floating interval;the independently calculated geometry instead shows late flotation in the wide receiver. Replaced that unsupported duration assumption with explicit10%/99%-melted support/float cases and full force/inventory checks.

Remaining:camera plans and projection checks,2D/3D scenes,thermometer/enthalpy plot,worked practical notebook and report,full playback and actual responsive browser review.
