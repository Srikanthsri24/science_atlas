# Private source and model audit · CL-0089 · 2026-11-27

Internal engineering scope only. No external references added to product UI;no independent expert or official curriculum certification claimed.

## Material references and approximations

- Official IAPWS R10-06(2009),Revised Release on the Equation of State2006 for H2O IceIh: https://iapws.org/technical-guidance/release/Ice-2009 and https://iapws.org/public/documents/S1atB/Ice-Rev2009.pdf . Table6,page12 was downloaded,rendered withPDFium and visually inspected. Near the normal-pressure melting point273.152519K at101325Pa,the table gives cp2096.71391024J/(kgK),density916.721463419kg/m³,and ice enthalpy−333354.873637J/kg. Do not confuse the internal-energy row−333465.403393 with the enthalpy row.
- At the triple point,the same table gives ice enthalpy−333444.253966J/kg. The fluid reference liquid enthalpy is approximately+0.611784J/kg (official IF97 release§5.1,Eq10,previously inspected for88). Their melting enthalpy difference is about333444.866J/kg. The model uses an explicitly rounded333400J/kg reference,not a full pressure-dependent fusion calculation.
- Model freezing0°C at near-normal pressure is rounded;the official normal-pressure melting temperature is273.152519K,not exactly273.15K. Constant ice Cp2100J/(kgK) is a rounded near-melting teaching approximation over the limited subzero range,not the full temperature-dependent EOS. Liquid Cp4180J/(kgK) is likewise a constant reference approximation;see88privateaudit for NISTliquid reference context.
- Historical NBS1939 paper https://nvlpubs.nist.gov/nistpubs/jres/23/jresv23n6p643_A1b.pdf was read for provenance. It reports333.5 INTERNATIONAL joules/g,not modern SI joules as an exact identity. That historical number was NOT directly substituted into the model. The USACEmanual search hit was inaccessibleHTTP403 and not treated as verified contents.

The cold store is a GENERIC chosen effective heat capacity,not pure liquid water below0°C,not a named cold-storage material and not apparatus calibration. Conductance and vessel heat capacity are original reference controls. No heat exchange with the room,evaporation,supercooling,nucleation delay,probe lag or resolved spatial gradients.

## Derived analytic model

Liquid sample/vessel capacityCs=mCpwater+Cv. Before onset,closed-pair heat exchange has rateK(1/Cs+1/Cb),reduced capacityCsCb/(Cs+Cb) and initial temperature difference20−Tb0. ExchangedQ=CredΔT0(1−exp(−rate t));sample cools byQ/Cs,store warms byQ/Cb.

Cold reserve after sample/vessel cooling to0 isR=−CbTb0−20Cs. IfR≤0,no finite freezing onset;R0is an asymptotic approach. IfR>0,onset time follows the two-node solution. At the plateau,Tsample0 and Tstore=−R/Cb exp[−K u/Cb];latent releaseR(1−exp[−K u/Cb]). R<mL gives partial-freezing limit;R=mL reaches complete freezing only asymptotically;R>mL gives finite completion. At completion,Tstore=(mL−R)/Cb. The fully frozen sample/vessel then has capacitymCpice+Cv and follows the closed-pair exponential from those actual endpoint temperatures. No latent-reference jump is allowed.

Water enthalpy reference is ice0°C=0,liquid0°C=mL. Include vesselCvT and cold-storeCbT in the total-energy account. Water sensible release,latent release and vessel release equal store gain. All energies can be signed relative to this reference;negative stored enthalpy is not negative heat capacity.

Zero conductance is a disconnected reference with unchanged temperatures/masses. Supported positive conductance0.1–20W/K bounds a meaningful apparatus range. Finite-time guides do not claim exact equilibrium or complete freezing in asymptotic cases.

## Completed internal checks

13 focused science/record/geometry tests plus two catalogue-navigation tests pass. Core checks cover23,136 dense states,288 corner states,independent enthalpy-ODE Euler0.02→0.01s convergence,pure two-capacity exponential,latent-store exponential,mass/energy/transfer closure,onset/completion continuity,zero contact,capacity equalities and120s guide. Strict negative-zero completion was corrected in the core. Stable analytic temperature difference is used in the late-time heat calculation;display rounding is not used to reconstruct tiny heat rates.

Both2D and3D guides ran through120presentation seconds. Actual18-trial downloaded practical passes independent Python validation:3533 table,result and numeric substitution-operand checks across558 worked blocks. Separate eight-state synthetic reference passes1556 checks;it is not browser proof. Reload restored18rows,plan,conclusion and escaped note text. Previous-turn second endpoint-record click was not retained after ephemeral tab cleanup;current authoritative notebook is18rows (one earlier endpoint plus17new observations),not19.

180 normal cases and48 theatre cases cover both modes,all three inspection scopes,both formats and phone/tablet/laptop/TV viewport widths. Short landscape568x320/844x390 included in theatre checks. Ratios and page overflow checked,with phone and desktop visual inspections. Native panes scroll when needed. Paused physical time228.2542894971282s and heat-arrow transform remained unchanged across theatre/viewport change;resume advanced to81.1601 presentation seconds before another pause. No browser errors/warnings. These are internal engineering and simulated-viewport checks,not independent expert,official-board,physical-device,FPS or native-gesture certification.
