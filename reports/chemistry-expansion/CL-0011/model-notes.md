# CL-0011 · Ice changing into water — model under development

The model, 2D/3D calorimeter and practical record have passed internal functional review. Evidence is recorded in review.json; no independent expert or official-board certification is claimed.

An ideal insulated lumped-enthalpy calorimeter begins with 100–200 g of ice at −5 °C. Prescribed heater power is 0–60 W and time is 0–600 s. Chosen constant properties are ice heat capacity 2100 J/(kg K), latent heat 334000 J/kg and liquid-water heat capacity 4180 J/(kg K). Ice and water reference densities are 917 and 1000 kg/m³. These approximations are teaching parameters.

Input energy P t first warms ice to 0 °C, then melts it at a constant ideal-mixture temperature, then warms liquid water. The supported domain stays below 4 °C and does not require a boiling model. Sensible ice energy + latent energy + sensible water energy equals input energy. Solid mass + melted mass equals starting mass. Zero heater power leaves the ideal insulated sample unchanged.

Heat losses, gradients, supercooling, evaporation and pressure effects are excluded. A future apparatus should support the shrinking ice above a collecting pool; it should not silently assume an unmodelled floating position. Four tests independently verify thresholds, the latent plateau, energy/mass conservation, boundary domains and temperature continuity. All other review gates remain pending.

The perforated rack is 5 cm above the vessel base. The ideal cylinder has internal radius 5 cm and height 12 cm; the largest supported cube fits inside it and above collected water. Rack displacement and visual drip transit mass are ignored. A geometry test verifies clearance and water level throughout the supported domain. The guide stages the initial warming, plateau and final warming for readability; manual playback compresses model time 15×.
