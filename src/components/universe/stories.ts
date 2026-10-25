import type{Chapter}from'../science/stories';import type{UniverseKind,UniverseParameters}from'../../lib/universeTypes';import{universeDefaults}from'../../lib/universeSpecs';
export const universeStories:Record<UniverseKind,Chapter[]>={
  "collision": [
    {
      "title": "Prepare the approach",
      "focus": "First body",
      "caption": "The first body approaches a second body initially at rest.",
      "detail": "Mass and incoming speed set the initial momentum.",
      "observe": "Mass and incoming speed set the initial momentum.",
      "question": "What is conserved in this isolated one-dimensional model?",
      "answer": "The internal contact forces exchange equal and opposite impulses.",
      "duration": 24
    },
    {
      "title": "Make contact",
      "focus": "Second body",
      "caption": "During contact, the interaction transfers momentum between the bodies.",
      "detail": "The model does not calculate the short impact-force waveform.",
      "observe": "The model does not calculate the short impact-force waveform.",
      "question": "For equal masses and an elastic hit on a stationary body…",
      "answer": "The elastic one-dimensional equal-mass result transfers the incoming velocity.",
      "duration": 24
    },
    {
      "title": "Compare outgoing motion",
      "focus": "First body",
      "caption": "The restitution coefficient sets how quickly the bodies separate after contact.",
      "detail": "A value of one represents an elastic collision.",
      "observe": "A value of one represents an elastic collision.",
      "question": "At restitution zero, the outgoing velocities are…",
      "answer": "Zero relative separation speed gives a common outgoing velocity.",
      "duration": 25,
      "formula": "p = mv · e = relative separation speed / approach speed"
    },
    {
      "title": "Account for kinetic energy",
      "focus": "Second body",
      "caption": "An inelastic collision retains momentum while reducing translational kinetic energy.",
      "detail": "Energy can enter deformation, internal motion and sound in a real collision.",
      "observe": "Energy can enter deformation, internal motion and sound in a real collision.",
      "question": "What is conserved in this isolated one-dimensional model?",
      "answer": "The internal contact forces exchange equal and opposite impulses.",
      "duration": 28
    },
    {
      "title": "Try sticking together",
      "focus": "First body",
      "caption": "At zero restitution, both bodies leave with the same velocity.",
      "detail": "They move together after contact in the ideal one-dimensional model.",
      "observe": "They move together after contact in the ideal one-dimensional model.",
      "question": "For equal masses and an elastic hit on a stationary body…",
      "answer": "The elastic one-dimensional equal-mass result transfers the incoming velocity.",
      "duration": 26
    }
  ],
  "lever": [
    {
      "title": "Find the pivot",
      "focus": "Pivot",
      "caption": "A lever can rotate around its pivot when moments are unbalanced.",
      "detail": "The load forces act downward at distances from the pivot.",
      "observe": "The load forces act downward at distances from the pivot.",
      "question": "10 N acting 2 m from a horizontal pivot gives…",
      "answer": "The perpendicular moment is force times distance.",
      "duration": 27
    },
    {
      "title": "Read a force arm",
      "focus": "Left load",
      "caption": "A force farther from the pivot produces a larger moment at the same angle.",
      "detail": "The perpendicular lever arm, not just the beam length, determines torque.",
      "observe": "The perpendicular lever arm, not just the beam length, determines torque.",
      "question": "At fixed load, doubling the horizontal arm…",
      "answer": "Torque is proportional to the perpendicular arm.",
      "duration": 31
    },
    {
      "title": "Compare opposing moments",
      "focus": "Right load",
      "caption": "The left and right loads produce opposite rotational effects.",
      "detail": "At equal opposing moments there is no net load torque.",
      "observe": "At equal opposing moments there is no net load torque.",
      "question": "A balanced lever requires…",
      "answer": "Unequal loads can balance with unequal arms.",
      "duration": 25,
      "formula": "τ = Fr cosθ · balance when F₁r₁ = F₂r₂"
    },
    {
      "title": "Observe the response",
      "focus": "Lever beam",
      "caption": "An unbalanced lever accelerates until damping or a stop limits its movement.",
      "detail": "The model includes a stated inertia, damping coefficient and angular stops.",
      "observe": "The model includes a stated inertia, damping coefficient and angular stops.",
      "question": "10 N acting 2 m from a horizontal pivot gives…",
      "answer": "The perpendicular moment is force times distance.",
      "duration": 29
    },
    {
      "title": "Make a balance",
      "focus": "Pivot",
      "caption": "A smaller force can balance a larger force if its moment arm is proportionally longer.",
      "detail": "The horizontal balance condition is F₁r₁=F₂r₂.",
      "observe": "The horizontal balance condition is F₁r₁=F₂r₂.",
      "question": "At fixed load, doubling the horizontal arm…",
      "answer": "Torque is proportional to the perpendicular arm.",
      "duration": 27
    }
  ],
  "magnet": [
    {
      "title": "Locate the dipole",
      "focus": "North pole",
      "caption": "A magnetic dipole has an orientation represented by its moment.",
      "detail": "The model moment points along the positive x direction.",
      "observe": "The model moment points along the positive x direction.",
      "question": "At a fixed angle, doubling distance from a point dipole makes its field…",
      "answer": "Dipole magnitude scales as 1/r³.",
      "duration": 25
    },
    {
      "title": "Follow the outside direction",
      "focus": "South pole",
      "caption": "Outside a bar-like magnet, field direction runs from north toward south.",
      "detail": "The line markers indicate direction rather than material leaving the magnet.",
      "observe": "The line markers indicate direction rather than material leaving the magnet.",
      "question": "A compass needle indicates…",
      "answer": "Its magnetic moment tends to align with the local magnetic field.",
      "duration": 28
    },
    {
      "title": "Place the compass",
      "focus": "Compass probe",
      "caption": "The compass probe aligns with the local magnetic-field direction.",
      "detail": "The displayed arrow is based on the field components at the chosen point.",
      "observe": "The displayed arrow is based on the field components at the chosen point.",
      "question": "Moving dots on the field lines represent…",
      "answer": "They are visual direction markers, not matter.",
      "duration": 28,
      "formula": "B = μ₀/(4πr³) [3(m·r̂)r̂ − m]"
    },
    {
      "title": "Move farther away",
      "focus": "Compass probe",
      "caption": "A point dipole’s field weakens rapidly with distance.",
      "detail": "At the same angular position its magnitude scales as one over distance cubed.",
      "observe": "At the same angular position its magnitude scales as one over distance cubed.",
      "question": "At a fixed angle, doubling distance from a point dipole makes its field…",
      "answer": "Dipole magnitude scales as 1/r³.",
      "duration": 27
    },
    {
      "title": "Change the moment",
      "focus": "North pole",
      "caption": "A larger dipole moment strengthens the field at the same probe location.",
      "detail": "The bar drawing is a schematic representation of a point-dipole field.",
      "observe": "The bar drawing is a schematic representation of a point-dipole field.",
      "question": "A compass needle indicates…",
      "answer": "Its magnetic moment tends to align with the local magnetic field.",
      "duration": 29
    }
  ],
  "motor": [
    {
      "title": "Put current in a field",
      "focus": "Current-carrying coil",
      "caption": "A current-carrying coil in a magnetic field can experience a torque.",
      "detail": "The turning effect depends on field, current, area, turns and orientation.",
      "observe": "The turning effect depends on field, current, area, turns and orientation.",
      "question": "Peak motor torque is proportional to…",
      "answer": "The torque scale is NBAI.",
      "duration": 28
    },
    {
      "title": "Begin rotation",
      "focus": "Current-carrying coil",
      "caption": "The torque accelerates the rotor from its initial nonzero angle.",
      "detail": "An exactly aligned ideal rotor could otherwise begin at a dead point.",
      "observe": "An exactly aligned ideal rotor could otherwise begin at a dead point.",
      "question": "The commutator’s role is to…",
      "answer": "The reversal maintains a useful turning direction.",
      "duration": 28
    },
    {
      "title": "Reverse current at the right time",
      "focus": "Current-carrying coil",
      "caption": "The commutator reverses current each half turn.",
      "detail": "Ideal switching keeps the electromagnetic torque in the same rotational sense.",
      "observe": "Ideal switching keeps the electromagnetic torque in the same rotational sense.",
      "question": "The modeled motor converts…",
      "answer": "Electromagnetic torque transfers electrical input into rotor motion.",
      "duration": 24,
      "formula": "τ = N B I A |sinθ| · J dω/dt = τ − bω"
    },
    {
      "title": "Meet the mechanical load",
      "focus": "Rotor arm",
      "caption": "Damping opposes rotation as angular speed rises.",
      "detail": "The model balances electromagnetic torque with the stated mechanical dynamics.",
      "observe": "The model balances electromagnetic torque with the stated mechanical dynamics.",
      "question": "Peak motor torque is proportional to…",
      "answer": "The torque scale is NBAI.",
      "duration": 23
    },
    {
      "title": "Compare inputs",
      "focus": "Current-carrying coil",
      "caption": "Increasing field, current or turn count increases the available peak torque.",
      "detail": "This model omits back-emf and electrical inductance.",
      "observe": "This model omits back-emf and electrical inductance.",
      "question": "The commutator’s role is to…",
      "answer": "The reversal maintains a useful turning direction.",
      "duration": 24
    }
  ],
  "standing": [
    {
      "title": "Fix both ends",
      "focus": "Fixed end",
      "caption": "The string endpoints remain at zero displacement.",
      "detail": "The allowed patterns must satisfy both fixed-end boundaries.",
      "observe": "The allowed patterns must satisfy both fixed-end boundaries.",
      "question": "For the nth string harmonic, the number of nodes including ends is…",
      "answer": "There are n half-wavelength segments and n+1 node positions.",
      "duration": 21
    },
    {
      "title": "Find the nodes",
      "focus": "Node",
      "caption": "Nodes have zero displacement throughout the cycle.",
      "detail": "Antinodes between them have the greatest oscillation amplitude.",
      "observe": "Antinodes between them have the greatest oscillation amplitude.",
      "question": "Four times the tension at fixed L and μ gives frequency…",
      "answer": "Frequency scales as √T.",
      "duration": 21
    },
    {
      "title": "Change harmonic number",
      "focus": "String",
      "caption": "A higher harmonic fits more half-wavelengths along the same string.",
      "detail": "The ideal harmonic frequencies are integer multiples of the fundamental.",
      "observe": "The ideal harmonic frequencies are integer multiples of the fundamental.",
      "question": "A node…",
      "answer": "It is a stationary zero of the standing-wave amplitude.",
      "duration": 26,
      "formula": "fₙ = n/(2L)√(T/μ) · y = A sin(nπx/L)cos(2πft)"
    },
    {
      "title": "Change tension",
      "focus": "String",
      "caption": "Greater tension increases wave speed and therefore frequency.",
      "detail": "For fixed mass density, frequency scales with the square root of tension.",
      "observe": "For fixed mass density, frequency scales with the square root of tension.",
      "question": "For the nth string harmonic, the number of nodes including ends is…",
      "answer": "There are n half-wavelength segments and n+1 node positions.",
      "duration": 26
    },
    {
      "title": "Separate the pattern from travel",
      "focus": "Node",
      "caption": "The standing-wave pattern has stationary nodes even while string material oscillates.",
      "detail": "The display slows the physical oscillation to make its structure readable.",
      "observe": "The display slows the physical oscillation to make its structure readable.",
      "question": "Four times the tension at fixed L and μ gives frequency…",
      "answer": "Frequency scales as √T.",
      "duration": 28
    }
  ],
  "echo": [
    {
      "title": "Send the pulse",
      "focus": "Sound source",
      "caption": "The sound pulse travels from source to reflector.",
      "detail": "The speed is an approximate function of uniform air temperature.",
      "observe": "The speed is an approximate function of uniform air temperature.",
      "question": "The factor 1/2 in echo distance accounts for…",
      "answer": "The pulse covers the distance twice.",
      "duration": 24
    },
    {
      "title": "Reach the reflector",
      "focus": "Reflector",
      "caption": "At the reflector the pulse changes its direction of travel.",
      "detail": "This model uses one straight path and one reflection.",
      "observe": "This model uses one straight path and one reflection.",
      "question": "At 340 m/s and a 0.2 s echo delay, one-way distance is…",
      "answer": "Distance is 340×0.2/2=34 m.",
      "duration": 25
    },
    {
      "title": "Receive the echo",
      "focus": "Sound source",
      "caption": "The return completes a round trip twice the source–reflector distance.",
      "detail": "The measured delay includes outgoing and returning travel.",
      "observe": "The measured delay includes outgoing and returning travel.",
      "question": "In this model, increasing air temperature makes sound speed…",
      "answer": "The approximate relation is c=331+0.6T.",
      "duration": 24,
      "formula": "distance = sound speed × echo delay / 2"
    },
    {
      "title": "Infer distance",
      "focus": "Reflector",
      "caption": "Distance is half the sound speed multiplied by the round-trip delay.",
      "detail": "Using the full round-trip length as the one-way distance would double the answer.",
      "observe": "Using the full round-trip length as the one-way distance would double the answer.",
      "question": "The factor 1/2 in echo distance accounts for…",
      "answer": "The pulse covers the distance twice.",
      "duration": 30
    },
    {
      "title": "Compare air temperatures",
      "focus": "Sound source",
      "caption": "In this range, warmer air has a slightly higher sound speed.",
      "detail": "The model omits attenuation, wind and spatially varying temperature.",
      "observe": "The model omits attenuation, wind and spatially varying temperature.",
      "question": "At 340 m/s and a 0.2 s echo delay, one-way distance is…",
      "answer": "Distance is 340×0.2/2=34 m.",
      "duration": 26
    }
  ],
  "conduction": [
    {
      "title": "Establish a temperature difference",
      "focus": "Left block",
      "caption": "The blocks begin with different uniform temperatures.",
      "detail": "Their masses and specific heat determine their heat capacities.",
      "observe": "Their masses and specific heat determine their heat capacities.",
      "question": "Equal insulated blocks initially at 80°C and 20°C approach…",
      "answer": "Equal heat capacities give the mean temperature, 50°C.",
      "duration": 22
    },
    {
      "title": "Make thermal contact",
      "focus": "Thermal contact",
      "caption": "Energy transfers from the hotter block toward the cooler block.",
      "detail": "The heat-transfer rate is conductance multiplied by temperature difference.",
      "observe": "The heat-transfer rate is conductance multiplied by temperature difference.",
      "question": "Heat-transfer rate decreases because…",
      "answer": "The rate is G times the temperature difference.",
      "duration": 25
    },
    {
      "title": "Reduce the difference",
      "focus": "Right block",
      "caption": "As the temperature difference falls, the transfer rate falls.",
      "detail": "The exact two-block solution approaches equilibrium exponentially.",
      "observe": "The exact two-block solution approaches equilibrium exponentially.",
      "question": "Increasing conductance changes…",
      "answer": "The system approaches the same equilibrium faster.",
      "duration": 22,
      "formula": "Q̇ = G(T₁−T₂) · ΔT(t) = ΔT₀e⁻ᵗ/τ"
    },
    {
      "title": "Reach a common temperature",
      "focus": "Thermal contact",
      "caption": "Equal masses with equal specific heat approach the arithmetic mean of their initial temperatures.",
      "detail": "The pair is insulated, so no energy is lost to the environment.",
      "observe": "The pair is insulated, so no energy is lost to the environment.",
      "question": "Equal insulated blocks initially at 80°C and 20°C approach…",
      "answer": "Equal heat capacities give the mean temperature, 50°C.",
      "duration": 32
    },
    {
      "title": "Change the conductance",
      "focus": "Thermal contact",
      "caption": "Greater thermal conductance speeds equilibration.",
      "detail": "It changes the timescale rather than the final insulated-pair temperature.",
      "observe": "It changes the timescale rather than the final insulated-pair temperature.",
      "question": "Heat-transfer rate decreases because…",
      "answer": "The rate is G times the temperature difference.",
      "duration": 21
    }
  ],
  "capillary": [
    {
      "title": "Meet the meniscus",
      "focus": "Liquid column",
      "caption": "Surface tension acts where the liquid surface meets the tube.",
      "detail": "Its vertical effect depends on the contact angle.",
      "observe": "Its vertical effect depends on the contact angle.",
      "question": "Halving capillary radius makes ideal height magnitude…",
      "answer": "Height is proportional to 1/r.",
      "duration": 24
    },
    {
      "title": "Balance the liquid column",
      "focus": "Capillary wall",
      "caption": "The final capillary height balances surface-tension and gravitational effects.",
      "detail": "The displayed approach is illustrative; the static height is calculated.",
      "observe": "The displayed approach is illustrative; the static height is calculated.",
      "question": "At contact angle 90°, cosθ is…",
      "answer": "The vertical surface-tension contribution is zero.",
      "duration": 25
    },
    {
      "title": "Narrow the radius",
      "focus": "Capillary wall",
      "caption": "A narrower tube produces a larger height magnitude under the same conditions.",
      "detail": "Jurin’s relation is inversely proportional to radius.",
      "observe": "Jurin’s relation is inversely proportional to radius.",
      "question": "A non-wetting angle above 90° gives…",
      "answer": "Cosθ becomes negative.",
      "duration": 25,
      "formula": "h = 2γcosθ / (ρgr)"
    },
    {
      "title": "Try a non-wetting angle",
      "focus": "Liquid column",
      "caption": "A contact angle greater than 90° gives a depression instead of a rise.",
      "detail": "The sign comes from the cosine of the contact angle.",
      "observe": "The sign comes from the cosine of the contact angle.",
      "question": "Halving capillary radius makes ideal height magnitude…",
      "answer": "Height is proportional to 1/r.",
      "duration": 29
    },
    {
      "title": "Compare the limits",
      "focus": "Liquid reservoir",
      "caption": "At 90° the ideal static height is zero.",
      "detail": "The model assumes a uniform density and a sufficiently narrow tube.",
      "observe": "The model assumes a uniform density and a sufficiently narrow tube.",
      "question": "At contact angle 90°, cosθ is…",
      "answer": "The vertical surface-tension contribution is zero.",
      "duration": 25
    }
  ],
  "decay": [
    {
      "title": "Start an ensemble",
      "focus": "Parent nucleus",
      "caption": "The parent-nucleus count represents a statistical ensemble.",
      "detail": "The model predicts expected counts, not individual event times.",
      "observe": "The model predicts expected counts, not individual event times.",
      "question": "After two half-lives, the expected parent fraction is…",
      "answer": "Each half-life multiplies the remaining fraction by 1/2.",
      "duration": 22
    },
    {
      "title": "Pass one half-life",
      "focus": "Daughter product",
      "caption": "After one half-life, half the expected parents remain.",
      "detail": "The same fraction survives each additional half-life.",
      "observe": "The same fraction survives each additional half-life.",
      "question": "A single nucleus’s exact decay time is…",
      "answer": "The exponential law gives ensemble probabilities.",
      "duration": 21
    },
    {
      "title": "Compare successive intervals",
      "focus": "Parent nucleus",
      "caption": "Equal half-life intervals remove equal fractions, not equal numbers.",
      "detail": "The decay rate decreases as fewer parent nuclei remain.",
      "observe": "The decay rate decreases as fewer parent nuclei remain.",
      "question": "For a fixed half-life, activity falls because…",
      "answer": "Activity is λN with constant λ.",
      "duration": 24,
      "formula": "N = N₀e⁻λt · λ = ln2 / t½"
    },
    {
      "title": "Relate probability and activity",
      "focus": "Parent nucleus",
      "caption": "The decay constant sets the per-nucleus probability rate.",
      "detail": "Expected activity is λN.",
      "observe": "Expected activity is λN.",
      "question": "After two half-lives, the expected parent fraction is…",
      "answer": "Each half-life multiplies the remaining fraction by 1/2.",
      "duration": 18
    },
    {
      "title": "Keep the distinction",
      "focus": "Daughter product",
      "caption": "A small real sample can depart from the smooth expectation.",
      "detail": "The coloured markers are a deterministic teaching illustration.",
      "observe": "The coloured markers are a deterministic teaching illustration.",
      "question": "A single nucleus’s exact decay time is…",
      "answer": "The exponential law gives ensemble probabilities.",
      "duration": 24
    }
  ],
  "orbit": [
    {
      "title": "Locate the focus",
      "focus": "Star",
      "caption": "The star lies at one focus of the ellipse, not generally its centre.",
      "detail": "The planet’s size and orbit scale are adjusted for viewing.",
      "observe": "The planet’s size and orbit scale are adjusted for viewing.",
      "question": "The star is at…",
      "answer": "A Kepler ellipse has the attracting star at a focus.",
      "duration": 29
    },
    {
      "title": "Approach the star",
      "focus": "Planet",
      "caption": "The planet moves more quickly in the near-star part of its orbit.",
      "detail": "Kepler’s equation links equal time steps to unequal angle steps.",
      "observe": "Kepler’s equation links equal time steps to unequal angle steps.",
      "question": "A planet moves fastest…",
      "answer": "Angular-momentum conservation gives faster motion at smaller radius.",
      "duration": 28
    },
    {
      "title": "Travel farther out",
      "focus": "Elliptical orbit",
      "caption": "The planet moves more slowly in the far-star part.",
      "detail": "Equal time intervals sweep equal areas in the two-body model.",
      "observe": "Equal time intervals sweep equal areas in the two-body model.",
      "question": "For the same central star, a larger semi-major axis gives…",
      "answer": "Kepler’s third law gives T² proportional to a³.",
      "duration": 25,
      "formula": "M = E − e sinE · T = 365.256 a³ᐟ² days"
    },
    {
      "title": "Change eccentricity",
      "focus": "Elliptical orbit",
      "caption": "Greater eccentricity produces a more elongated orbit.",
      "detail": "At zero eccentricity the orbit is circular.",
      "observe": "At zero eccentricity the orbit is circular.",
      "question": "The star is at…",
      "answer": "A Kepler ellipse has the attracting star at a focus.",
      "duration": 20
    },
    {
      "title": "Change the orbit size",
      "focus": "Planet",
      "caption": "A larger semi-major axis gives a longer period around the same star.",
      "detail": "For this Sun-mass system, the period scales as a to the three-halves power.",
      "observe": "For this Sun-mass system, the period scales as a to the three-halves power.",
      "question": "A planet moves fastest…",
      "answer": "Angular-momentum conservation gives faster motion at smaller radius.",
      "duration": 31
    }
  ],
  "titration": [
    {
      "title": "Prepare the acid",
      "focus": "Solution",
      "caption": "The initial acid supplies hydronium to the solution.",
      "detail": "The stock concentration and volume determine its acid amount.",
      "observe": "The stock concentration and volume determine its acid amount.",
      "question": "25 mL of 0.1 M acid requires how much 0.1 M base at equivalence?",
      "answer": "Equal concentrations require equal volumes for this 1:1 reaction.",
      "duration": 23
    },
    {
      "title": "Add the strong base",
      "focus": "Burette",
      "caption": "Added hydroxide reacts with hydronium and changes the excess amount.",
      "detail": "The model includes the increasing total liquid volume.",
      "observe": "The model includes the increasing total liquid volume.",
      "question": "This ideal strong acid/base has pH near 7 at equivalence because…",
      "answer": "No stoichiometric acid or base excess remains; water autoionization sets the ideal pH.",
      "duration": 24
    },
    {
      "title": "Cross equivalence",
      "focus": "Solution",
      "caption": "At equivalence the acid and base stoichiometric amounts match.",
      "detail": "For this ideal strong acid/base at 25°C, pH is approximately 7.",
      "observe": "For this ideal strong acid/base at 25°C, pH is approximately 7.",
      "question": "After adding base beyond equivalence, the solution is…",
      "answer": "Excess hydroxide makes it basic.",
      "duration": 26,
      "formula": "at equivalence: CₐVₐ = CᵦVᵦ"
    },
    {
      "title": "Continue into base excess",
      "focus": "Burette",
      "caption": "Beyond equivalence, excess hydroxide controls the pH.",
      "detail": "The ideal indicator colour shifts through its stated transition range.",
      "observe": "The ideal indicator colour shifts through its stated transition range.",
      "question": "25 mL of 0.1 M acid requires how much 0.1 M base at equivalence?",
      "answer": "Equal concentrations require equal volumes for this 1:1 reaction.",
      "duration": 23
    },
    {
      "title": "Read the curve",
      "focus": "Titration curve",
      "caption": "The steep region near equivalence connects small added volumes to large pH changes.",
      "detail": "Endpoint colour and stoichiometric equivalence are related but distinct ideas.",
      "observe": "Endpoint colour and stoichiometric equivalence are related but distinct ideas.",
      "question": "This ideal strong acid/base has pH near 7 at equivalence because…",
      "answer": "No stoichiometric acid or base excess remains; water autoionization sets the ideal pH.",
      "duration": 29
    }
  ],
  "distillation": [
    {
      "title": "Begin with a mixture",
      "focus": "Residual mixture",
      "caption": "The boiling vessel begins with two components.",
      "detail": "Component A is more volatile in the stated ideal model.",
      "observe": "Component A is more volatile in the stated ideal model.",
      "question": "For α>1 and a mixed liquid, vapour A fraction is…",
      "answer": "The stated equilibrium relation favours A in the vapour.",
      "duration": 23
    },
    {
      "title": "Enrich the vapour",
      "focus": "Vapour and condenser",
      "caption": "The vapour contains a larger fraction of A than the residual liquid when α>1.",
      "detail": "Relative volatility controls the ideal vapour composition.",
      "observe": "Relative volatility controls the ideal vapour composition.",
      "question": "The condenser changes…",
      "answer": "It removes heat so vapour condenses.",
      "duration": 27
    },
    {
      "title": "Condense the vapour",
      "focus": "Condenser jacket",
      "caption": "The vapour passes through a condenser and returns to liquid.",
      "detail": "The receiver collects all condensate in this no-reflux model.",
      "observe": "The receiver collects all condensate in this no-reflux model.",
      "question": "This closed accounting preserves…",
      "answer": "Removed A is accumulated in the collected stream.",
      "duration": 25,
      "formula": "yA = αxA / [1 + (α−1)xA]"
    },
    {
      "title": "Change the residue",
      "focus": "Boiling flask",
      "caption": "Removing A-enriched vapour leaves the residue poorer in A.",
      "detail": "The material balance accounts for A in both vessel and receiver.",
      "observe": "The material balance accounts for A in both vessel and receiver.",
      "question": "For α>1 and a mixed liquid, vapour A fraction is…",
      "answer": "The stated equilibrium relation favours A in the vapour.",
      "duration": 26
    },
    {
      "title": "Compare enrichment",
      "focus": "Receiver",
      "caption": "The collected distillate is enriched relative to the evolving residue.",
      "detail": "This fictional mixture does not claim real compound boiling temperatures or azeotropes.",
      "observe": "This fictional mixture does not claim real compound boiling temperatures or azeotropes.",
      "question": "The condenser changes…",
      "answer": "It removes heat so vapour condenses.",
      "duration": 28
    }
  ],
  "crystal": [
    {
      "title": "Mark the corners",
      "focus": "Corner atom",
      "caption": "Eight corners define the cubic unit cell.",
      "detail": "Each corner belongs to eight neighbouring cells in an extended simple cubic lattice.",
      "observe": "Each corner belongs to eight neighbouring cells in an extended simple cubic lattice.",
      "question": "A corner atom contributes to one cubic cell by…",
      "answer": "Eight cells share that corner in the extended lattice.",
      "duration": 26
    },
    {
      "title": "Count fractional shares",
      "focus": "Corner atom",
      "caption": "Eight corner contributions of one eighth give one effective atom.",
      "detail": "The viewer draws whole spheres to show their centres and contacts.",
      "observe": "The viewer draws whole spheres to show their centres and contacts.",
      "question": "BCC contains how many effective atoms per cell?",
      "answer": "Corners contribute one and the body centre contributes one.",
      "duration": 27
    },
    {
      "title": "Add a body centre",
      "focus": "Interior or face atom",
      "caption": "A body-centred cubic cell adds one whole atom at its centre.",
      "detail": "It therefore contains two effective atoms per cell.",
      "observe": "It therefore contains two effective atoms per cell.",
      "question": "FCC hard-sphere packing is approximately…",
      "answer": "The ideal geometric fraction is π/(3√2), about 0.7405.",
      "duration": 25,
      "formula": "effective atoms: SC 1 · BCC 2 · FCC 4"
    },
    {
      "title": "Add face centres",
      "focus": "Interior or face atom",
      "caption": "A face-centred cubic cell adds six half-shared face atoms.",
      "detail": "Together with the corners, the effective count is four.",
      "observe": "Together with the corners, the effective count is four.",
      "question": "A corner atom contributes to one cubic cell by…",
      "answer": "Eight cells share that corner in the extended lattice.",
      "duration": 24
    },
    {
      "title": "Compare packing",
      "focus": "Interior or face atom",
      "caption": "Hard-sphere contact geometry determines the radius-to-edge relation and packing fraction.",
      "detail": "The assembly is a geometric construction, not crystallization dynamics.",
      "observe": "The assembly is a geometric construction, not crystallization dynamics.",
      "question": "BCC contains how many effective atoms per cell?",
      "answer": "Corners contribute one and the body centre contributes one.",
      "duration": 25
    }
  ],
  "electrolysis": [
    {
      "title": "Complete a conducting path",
      "focus": "Electrolyte",
      "caption": "An external source drives charge through a conducting electrolyte system.",
      "detail": "Pure water alone is a poor conductor; the model assumes a suitable conducting system.",
      "observe": "Pure water alone is a poor conductor; the model assumes a suitable conducting system.",
      "question": "Ideal water electrolysis gives H₂:O₂ gas amount ratio…",
      "answer": "The overall reaction is 2H₂O→2H₂+O₂.",
      "duration": 30
    },
    {
      "title": "Reduce at the cathode",
      "focus": "Cathode",
      "caption": "Hydrogen evolves at the cathode in ideal water electrolysis.",
      "detail": "Two moles of electrons correspond to one mole of hydrogen gas.",
      "observe": "Two moles of electrons correspond to one mole of hydrogen gas.",
      "question": "Hydrogen evolves at the…",
      "answer": "Reduction occurs at the cathode.",
      "duration": 26
    },
    {
      "title": "Oxidize at the anode",
      "focus": "Anode",
      "caption": "Oxygen evolves at the anode.",
      "detail": "Four moles of electrons correspond to one mole of oxygen gas.",
      "observe": "Four moles of electrons correspond to one mole of oxygen gas.",
      "question": "At fixed current, doubling time doubles…",
      "answer": "Q=It.",
      "duration": 22,
      "formula": "n(H₂)=Q/(2F) · n(O₂)=Q/(4F)"
    },
    {
      "title": "Compare gas quantities",
      "focus": "Collection tube",
      "caption": "The ideal hydrogen and oxygen amounts have a two-to-one ratio.",
      "detail": "At the same temperature and pressure, their gas volumes have the same ratio.",
      "observe": "At the same temperature and pressure, their gas volumes have the same ratio.",
      "question": "Ideal water electrolysis gives H₂:O₂ gas amount ratio…",
      "answer": "The overall reaction is 2H₂O→2H₂+O₂.",
      "duration": 29
    },
    {
      "title": "Apply Faraday’s law",
      "focus": "Electrolyte",
      "caption": "Total charge is current multiplied by elapsed time.",
      "detail": "The model assumes complete current efficiency and no competing reactions.",
      "observe": "The model assumes complete current efficiency and no competing reactions.",
      "question": "Hydrogen evolves at the…",
      "answer": "Reduction occurs at the cathode.",
      "duration": 24
    }
  ],
  "galvanic": [
    {
      "title": "Separate the half-cells",
      "focus": "Half-cell solution",
      "caption": "Zinc oxidation and copper-ion reduction occur at separate electrodes.",
      "detail": "The external wire and ionic connection complete the circuit.",
      "observe": "The external wire and ionic connection complete the circuit.",
      "question": "Electrons travel externally in this Daniell cell from…",
      "answer": "Zinc oxidation provides electrons for copper-ion reduction.",
      "duration": 24
    },
    {
      "title": "Release electrons at zinc",
      "focus": "Zinc electrode",
      "caption": "Zinc metal oxidizes to zinc ions and supplies electrons to the external wire.",
      "detail": "The anode is the oxidation site.",
      "observe": "The anode is the oxidation site.",
      "question": "The salt bridge carries mainly…",
      "answer": "It provides ionic continuity and helps avoid charge buildup.",
      "duration": 25
    },
    {
      "title": "Reduce copper ions",
      "focus": "Copper electrode",
      "caption": "Copper ions accept electrons and can deposit as copper metal.",
      "detail": "The cathode is the reduction site.",
      "observe": "The cathode is the reduction site.",
      "question": "At unit activities, the stated standard cell voltage is…",
      "answer": "The ideal Zn/Cu model uses E°=1.10 V.",
      "duration": 22,
      "formula": "E = 1.10 − RT/(2F) ln([Zn²⁺]/[Cu²⁺])"
    },
    {
      "title": "Maintain ionic continuity",
      "focus": "Salt bridge",
      "caption": "Salt-bridge ions help maintain charge balance between the half-cells.",
      "detail": "Electrons use the external conductor, not the salt bridge.",
      "observe": "Electrons use the external conductor, not the salt bridge.",
      "question": "Electrons travel externally in this Daniell cell from…",
      "answer": "Zinc oxidation provides electrons for copper-ion reduction.",
      "duration": 24
    },
    {
      "title": "Change concentrations",
      "focus": "Half-cell solution",
      "caption": "The Nernst relation adjusts the ideal cell voltage using the stated concentration ratio.",
      "detail": "The modeled half-cell concentrations are maintained rather than depleted over time.",
      "observe": "The modeled half-cell concentrations are maintained rather than depleted over time.",
      "question": "The salt bridge carries mainly…",
      "answer": "It provides ionic continuity and helps avoid charge buildup.",
      "duration": 30
    }
  ],
  "rutherford": [
    {
      "title": "Aim at a small nucleus",
      "focus": "Alpha particle",
      "caption": "A positively charged alpha particle approaches the positively charged nucleus.",
      "detail": "The interaction is repulsive in this classical Coulomb model.",
      "observe": "The interaction is repulsive in this classical Coulomb model.",
      "question": "An alpha particle and a gold nucleus have…",
      "answer": "Their positive nuclear charges produce Coulomb repulsion.",
      "duration": 25
    },
    {
      "title": "Compare a wide miss",
      "focus": "Coulomb trajectory",
      "caption": "A larger impact parameter generally produces a smaller deflection.",
      "detail": "The particle experiences a weaker accumulated transverse impulse.",
      "observe": "The particle experiences a weaker accumulated transverse impulse.",
      "question": "At fixed energy, reducing impact parameter generally…",
      "answer": "The Rutherford relation has a larger angle for smaller b.",
      "duration": 23
    },
    {
      "title": "Approach more closely",
      "focus": "Gold nucleus",
      "caption": "A smaller impact parameter produces a larger scattering angle.",
      "detail": "The enlarged nucleus and zoomed trajectory make the encounter visible.",
      "observe": "The enlarged nucleus and zoomed trajectory make the encounter visible.",
      "question": "The displayed nucleus is…",
      "answer": "The visual scale is chosen to explain the scattering.",
      "duration": 25,
      "formula": "tan(χ/2)=k/(2Eb) · k=Z₁Z₂e²/(4πε₀)"
    },
    {
      "title": "Change kinetic energy",
      "focus": "Alpha particle",
      "caption": "At the same impact parameter, greater incident energy reduces the deflection angle.",
      "detail": "The asymptotic scattering formula provides the comparison.",
      "observe": "The asymptotic scattering formula provides the comparison.",
      "question": "An alpha particle and a gold nucleus have…",
      "answer": "Their positive nuclear charges produce Coulomb repulsion.",
      "duration": 25
    },
    {
      "title": "Check the model limits",
      "focus": "Coulomb trajectory",
      "caption": "The trajectory conserves kinetic plus electrostatic potential energy to numerical accuracy.",
      "detail": "Electron screening, nuclear recoil and nuclear forces are excluded.",
      "observe": "Electron screening, nuclear recoil and nuclear forces are excluded.",
      "question": "At fixed energy, reducing impact parameter generally…",
      "answer": "The Rutherford relation has a larger angle for smaller b.",
      "duration": 26
    }
  ],
  "solubility": [
    {
      "title": "Maintain a gas reservoir",
      "focus": "Maintained gas reservoir",
      "caption": "The gas above the liquid is held at a chosen partial pressure.",
      "detail": "The liquid begins with none of the modeled dissolved gas.",
      "observe": "The liquid begins with none of the modeled dissolved gas.",
      "question": "With fixed kH, doubling partial pressure doubles…",
      "answer": "Ceq=kHp.",
      "duration": 28
    },
    {
      "title": "Transfer into the liquid",
      "focus": "Liquid",
      "caption": "Gas transfers toward the Henry-law concentration limit.",
      "detail": "The first-order exchange rate decreases as the concentration difference falls.",
      "observe": "The first-order exchange rate decreases as the concentration difference falls.",
      "question": "As dissolved concentration approaches Ceq, net transfer…",
      "answer": "The rate is proportional to Ceq−C.",
      "duration": 23
    },
    {
      "title": "Increase partial pressure",
      "focus": "Maintained gas reservoir",
      "caption": "Higher partial pressure raises the equilibrium dissolved concentration in this ideal model.",
      "detail": "The Henry coefficient is held fixed.",
      "observe": "The Henry coefficient is held fixed.",
      "question": "These parameters describe…",
      "answer": "The coefficient is user-selected and reactions are excluded.",
      "duration": 24,
      "formula": "Ceq = kH p · C(t)=Ceq(1−e⁻ᵏᵗ)"
    },
    {
      "title": "Change the coefficient",
      "focus": "Liquid",
      "caption": "The chosen Henry coefficient links concentration and pressure.",
      "detail": "It is an input for a generic system rather than a fitted named gas.",
      "observe": "It is an input for a generic system rather than a fitted named gas.",
      "question": "With fixed kH, doubling partial pressure doubles…",
      "answer": "Ceq=kHp.",
      "duration": 28
    },
    {
      "title": "Approach the limit",
      "focus": "Liquid",
      "caption": "Net transfer tends toward zero as the maintained-reservoir equilibrium is approached.",
      "detail": "The model excludes chemical reactions and closed-vessel pressure changes.",
      "observe": "The model excludes chemical reactions and closed-vessel pressure changes.",
      "question": "As dissolved concentration approaches Ceq, net transfer…",
      "answer": "The rate is proportional to Ceq−C.",
      "duration": 26
    }
  ],
  "centrifuge": [
    {
      "title": "Spin the rotor",
      "focus": "Rotor arm",
      "caption": "The rotor carries the sample fluid into rotation.",
      "detail": "The displayed rotation is slowed from the stated rpm.",
      "observe": "The displayed rotation is slowed from the stated rpm.",
      "question": "Doubling rpm at fixed radius makes centrifugal acceleration…",
      "answer": "Acceleration is ω²r.",
      "duration": 23
    },
    {
      "title": "Follow radial separation",
      "focus": "Sedimenting particle",
      "caption": "A denser spherical particle drifts outward in the co-rotating frame.",
      "detail": "Stokes drag balances the effective radial driving force in the model.",
      "observe": "Stokes drag balances the effective radial driving force in the model.",
      "question": "In this Stokes model, diameter enters the drift coefficient as…",
      "answer": "The driving-to-drag ratio gives a diameter-squared dependence.",
      "duration": 27
    },
    {
      "title": "Change particle size",
      "focus": "Sample tube",
      "caption": "Larger particle diameter increases the ideal radial drift coefficient strongly.",
      "detail": "The coefficient scales with diameter squared.",
      "observe": "The coefficient scales with diameter squared.",
      "question": "Increasing viscosity generally makes ideal settling…",
      "answer": "The radial drift coefficient is inversely proportional to viscosity.",
      "duration": 22,
      "formula": "dr/dt = Δρ d²ω²r/(18η)"
    },
    {
      "title": "Change rotation speed",
      "focus": "Rotor arm",
      "caption": "Higher angular speed increases the radial driving effect.",
      "detail": "The model coefficient scales with angular speed squared.",
      "observe": "The model coefficient scales with angular speed squared.",
      "question": "Doubling rpm at fixed radius makes centrifugal acceleration…",
      "answer": "Acceleration is ω²r.",
      "duration": 22
    },
    {
      "title": "Reach the wall",
      "focus": "Sedimenting particle",
      "caption": "The tracked particle stops at the modeled tube-wall radius.",
      "detail": "Brownian motion, interactions and turbulent flow are omitted.",
      "observe": "Brownian motion, interactions and turbulent flow are omitted.",
      "question": "In this Stokes model, diameter enters the drift coefficient as…",
      "answer": "The driving-to-drag ratio gives a diameter-squared dependence.",
      "duration": 23
    }
  ],
  "heart": [
    {
      "title": "Enter the right side",
      "focus": "Right atrium",
      "caption": "Systemic venous blood returns to the right atrium.",
      "detail": "Purple indicates lower oxygenation, not literally blue blood.",
      "observe": "Purple indicates lower oxygenation, not literally blue blood.",
      "question": "72 beats/min × 70 mL/beat gives…",
      "answer": "72×70=5040 mL/min=5.04 L/min.",
      "duration": 22
    },
    {
      "title": "Go to the lungs",
      "focus": "Right ventricle",
      "caption": "The right ventricle sends blood toward the lungs.",
      "detail": "Pulmonary circulation supports gas exchange before return to the left side.",
      "observe": "Pulmonary circulation supports gas exchange before return to the left side.",
      "question": "Blood leaves the right ventricle toward the…",
      "answer": "The right ventricle supplies the pulmonary circulation.",
      "duration": 25
    },
    {
      "title": "Return to the left side",
      "focus": "Left atrium",
      "caption": "Blood returning from the lungs enters the left atrium.",
      "detail": "The left ventricle then supplies the systemic circuit.",
      "observe": "The left ventricle then supplies the systemic circuit.",
      "question": "The colour purple here means…",
      "answer": "Real venous blood is dark red; colours are explanatory.",
      "duration": 23,
      "formula": "cardiac output = heart rate × stroke volume"
    },
    {
      "title": "Supply the body",
      "focus": "Left ventricle",
      "caption": "The left ventricle pumps blood toward body tissues.",
      "detail": "The diagram is a conceptual flow loop, not patient-specific anatomy.",
      "observe": "The diagram is a conceptual flow loop, not patient-specific anatomy.",
      "question": "72 beats/min × 70 mL/beat gives…",
      "answer": "72×70=5040 mL/min=5.04 L/min.",
      "duration": 24
    },
    {
      "title": "Count cardiac output",
      "focus": "Heart outline",
      "caption": "Heart rate multiplied by stroke volume gives cardiac output.",
      "detail": "The contraction waveform illustrates timing without solving pressures or valves.",
      "observe": "The contraction waveform illustrates timing without solving pressures or valves.",
      "question": "Blood leaves the right ventricle toward the…",
      "answer": "The right ventricle supplies the pulmonary circulation.",
      "duration": 25
    }
  ],
  "nephron": [
    {
      "title": "Filter into the capsule",
      "focus": "Glomerular capsule",
      "caption": "Filtration brings water and a freely filtered model solute into the nephron.",
      "detail": "The model uses an imposed whole-nephron filtration rate.",
      "observe": "The model uses an imposed whole-nephron filtration rate.",
      "question": "120 mL/min filtration with 99% water reabsorbed gives urine flow…",
      "answer": "The remaining fraction is 1%, so 120×0.01=1.2 mL/min.",
      "duration": 26
    },
    {
      "title": "Follow the tubule",
      "focus": "Nephron tubule",
      "caption": "Filtrate moves along a schematic tubule path.",
      "detail": "The shape makes the process visible rather than reproducing microscopic scale.",
      "observe": "The shape makes the process visible rather than reproducing microscopic scale.",
      "question": "If urine flow falls at fixed excreted solute rate, urine concentration…",
      "answer": "Concentration is solute amount per liquid volume.",
      "duration": 24
    },
    {
      "title": "Reclaim water",
      "focus": "Reabsorption",
      "caption": "A chosen fraction of filtered water returns outside the urine stream.",
      "detail": "The remainder determines the modeled urine flow.",
      "observe": "The remainder determines the modeled urine flow.",
      "question": "This model excludes…",
      "answer": "It uses fixed reabsorption fractions and no secretory transport.",
      "duration": 24,
      "formula": "urine flow = filtration × (1−water reabsorption)"
    },
    {
      "title": "Reclaim solute",
      "focus": "Nephron tubule",
      "caption": "A chosen fraction of the freely filtered solute is also reabsorbed.",
      "detail": "No secretion or protein binding is included.",
      "observe": "No secretion or protein binding is included.",
      "question": "120 mL/min filtration with 99% water reabsorbed gives urine flow…",
      "answer": "The remaining fraction is 1%, so 120×0.01=1.2 mL/min.",
      "duration": 24
    },
    {
      "title": "Account for excretion",
      "focus": "Urine",
      "caption": "Excreted solute divided by urine flow gives the urine concentration.",
      "detail": "Changing water reabsorption can alter concentration even at fixed solute excretion.",
      "observe": "Changing water reabsorption can alter concentration even at fixed solute excretion.",
      "question": "If urine flow falls at fixed excreted solute rate, urine concentration…",
      "answer": "Concentration is solute amount per liquid volume.",
      "duration": 27
    }
  ],
  "reflex": [
    {
      "title": "Detect a stimulus",
      "focus": "Sensory receptor",
      "caption": "A receptor initiates a sensory signal in the simplified pathway.",
      "detail": "This model begins at neural conduction rather than detailed stimulus transduction.",
      "observe": "This model begins at neural conduction rather than detailed stimulus transduction.",
      "question": "At 30 m/s, a 0.6 m path takes…",
      "answer": "0.6/30=0.02 s=20 ms.",
      "duration": 27
    },
    {
      "title": "Reach the spinal relay",
      "focus": "Spinal cord",
      "caption": "The sensory signal travels toward the spinal relay.",
      "detail": "Travel time is path length divided by conduction speed.",
      "observe": "Travel time is path length divided by conduction speed.",
      "question": "The model’s total latency includes…",
      "answer": "The three stated contributions are added.",
      "duration": 23
    },
    {
      "title": "Include relay delay",
      "focus": "Spinal cord",
      "caption": "A stated synaptic delay adds to the neural path time.",
      "detail": "It is one aggregate delay, not a full spinal-circuit simulation.",
      "observe": "It is one aggregate delay, not a full spinal-circuit simulation.",
      "question": "Doubling conduction speed changes the axonal travel times to…",
      "answer": "Travel time is distance divided by speed.",
      "duration": 26,
      "formula": "latency = sensory length/speed + synaptic delay + motor length/speed"
    },
    {
      "title": "Travel to an effector",
      "focus": "Effector muscle",
      "caption": "A motor signal travels toward the modeled effector.",
      "detail": "The display slows the pulse so the route can be followed.",
      "observe": "The display slows the pulse so the route can be followed.",
      "question": "At 30 m/s, a 0.6 m path takes…",
      "answer": "0.6/30=0.02 s=20 ms.",
      "duration": 25
    },
    {
      "title": "Compare the latency",
      "focus": "Reflex pathway",
      "caption": "The model latency sums sensory travel, relay delay and motor travel.",
      "detail": "Muscle-force development and patient response are not predicted.",
      "observe": "Muscle-force development and patient response are not predicted.",
      "question": "The model’s total latency includes…",
      "answer": "The three stated contributions are added.",
      "duration": 25
    }
  ],
  "replication": [
    {
      "title": "Read the templates",
      "focus": "Template base",
      "caption": "The short DNA segment has complementary old strands.",
      "detail": "A pairs with T, while C pairs with G.",
      "observe": "A pairs with T, while C pairs with G.",
      "question": "The complement of ATGC is…",
      "answer": "Apply A↔T and C↔G at each position.",
      "duration": 23
    },
    {
      "title": "Open a fork",
      "focus": "Replication fork",
      "caption": "The construction separates the old strands near a moving fork.",
      "detail": "The fork marker indicates progress rather than a measured enzyme trajectory.",
      "observe": "The fork marker indicates progress rather than a measured enzyme trajectory.",
      "question": "Semiconservative replication retains…",
      "answer": "Each daughter has one old and one new strand.",
      "duration": 27
    },
    {
      "title": "Add complements",
      "focus": "New complementary base",
      "caption": "New nucleotides are chosen by complementarity to each template.",
      "detail": "The displayed sequence and copied-base count are exact for the short segment.",
      "observe": "The displayed sequence and copied-base count are exact for the short segment.",
      "question": "The fork’s speed here is…",
      "answer": "The short-segment construction is staged for explanation.",
      "duration": 27,
      "formula": "base pairing: A↔T · C↔G"
    },
    {
      "title": "Keep one old strand",
      "focus": "Complementary template base",
      "caption": "Each resulting double-stranded segment pairs an old strand with a new strand.",
      "detail": "This is the idea of semiconservative replication.",
      "observe": "This is the idea of semiconservative replication.",
      "question": "The complement of ATGC is…",
      "answer": "Apply A↔T and C↔G at each position.",
      "duration": 25
    },
    {
      "title": "Finish the segment",
      "focus": "Replication fork",
      "caption": "The copied count reaches the template length at completion.",
      "detail": "Leading/lagging kinetics, mutations and proofreading are outside this model.",
      "observe": "Leading/lagging kinetics, mutations and proofreading are outside this model.",
      "question": "Semiconservative replication retains…",
      "answer": "Each daughter has one old and one new strand.",
      "duration": 24
    }
  ],
  "meiosis": [
    {
      "title": "Pair homologs",
      "focus": "Replicated chromosome",
      "caption": "The starting cell has two homologous pairs after DNA replication.",
      "detail": "The model begins with a replicated 2n=4 set.",
      "observe": "The model begins with a replicated 2n=4 set.",
      "question": "Meiosis I primarily separates…",
      "answer": "Homologs separate in the first division.",
      "duration": 24
    },
    {
      "title": "Separate homologs",
      "focus": "Dividing cell",
      "caption": "The first division separates homologous chromosomes.",
      "detail": "Sister chromatids remain associated in the resulting haploid sets.",
      "observe": "Sister chromatids remain associated in the resulting haploid sets.",
      "question": "DNA replication occurs between meiosis I and II…",
      "answer": "One replication precedes the two meiotic divisions.",
      "duration": 21
    },
    {
      "title": "Prepare the second division",
      "focus": "Replicated chromosome",
      "caption": "Two haploid sets retain replicated chromosomes between divisions.",
      "detail": "No second DNA replication occurs before the second division.",
      "observe": "No second DNA replication occurs before the second division.",
      "question": "A starting 2n=4 model ends with…",
      "answer": "The final products are haploid with two chromosomes each.",
      "duration": 23,
      "formula": "one replicated 2n=4 cell → four n=2 products"
    },
    {
      "title": "Separate sisters",
      "focus": "Daughter chromosome",
      "caption": "The second division separates sister chromatids.",
      "detail": "Each former chromatid is then a daughter chromosome.",
      "observe": "Each former chromatid is then a daughter chromosome.",
      "question": "Meiosis I primarily separates…",
      "answer": "Homologs separate in the first division.",
      "duration": 20
    },
    {
      "title": "Form four haploid sets",
      "focus": "Dividing cell",
      "caption": "The final products each have n=2 chromosomes.",
      "detail": "The construction does not explicitly calculate crossing-over or random assortment.",
      "observe": "The construction does not explicitly calculate crossing-over or random assortment.",
      "question": "DNA replication occurs between meiosis I and II…",
      "answer": "One replication precedes the two meiotic divisions.",
      "duration": 23
    }
  ],
  "transpiration": [
    {
      "title": "Begin with roots and leaves",
      "focus": "Roots",
      "caption": "Water enters a plant-water pathway and can leave through leaf surfaces.",
      "detail": "The diagram focuses on the root-to-air route.",
      "observe": "The diagram focuses on the root-to-air route.",
      "question": "At fixed temperature, higher humidity generally makes this flux…",
      "answer": "The vapour-pressure deficit falls.",
      "duration": 24
    },
    {
      "title": "Open the stomata",
      "focus": "Leaf",
      "caption": "Stomatal opening changes the chosen conductance in the teaching model.",
      "detail": "At zero opening this simplified stomatal flux is zero.",
      "observe": "At zero opening this simplified stomatal flux is zero.",
      "question": "At zero modeled stomatal opening, stomatal flux is…",
      "answer": "Conductance is proportional to the opening fraction.",
      "duration": 25
    },
    {
      "title": "Compare humid air",
      "focus": "Leaf",
      "caption": "Higher relative humidity reduces the vapour-pressure deficit at fixed temperature.",
      "detail": "A smaller deficit lowers the model’s outward water flux.",
      "observe": "A smaller deficit lowers the model’s outward water flux.",
      "question": "Doubling leaf area at the same flux per area doubles…",
      "answer": "Total rate is area multiplied by area-specific flux.",
      "duration": 25,
      "formula": "water flux = gs × VPD / air pressure"
    },
    {
      "title": "Change leaf temperature",
      "focus": "Leaf",
      "caption": "Temperature changes saturation vapour pressure and therefore the driving difference.",
      "detail": "The model holds leaf temperature externally rather than solving an energy balance.",
      "observe": "The model holds leaf temperature externally rather than solving an energy balance.",
      "question": "At fixed temperature, higher humidity generally makes this flux…",
      "answer": "The vapour-pressure deficit falls.",
      "duration": 28
    },
    {
      "title": "Read the water loss",
      "focus": "Stem",
      "caption": "Flux multiplied by leaf area gives an illustrative water-loss rate.",
      "detail": "No species-specific hydraulic or stomatal-control calibration is claimed.",
      "observe": "No species-specific hydraulic or stomatal-control calibration is claimed.",
      "question": "At zero modeled stomatal opening, stomatal flux is…",
      "answer": "Conductance is proportional to the opening fraction.",
      "duration": 24
    }
  ],
  "foodweb": [
    {
      "title": "Start with producers",
      "focus": "Producers",
      "caption": "The selected producer energy is the starting input to one chain pathway.",
      "detail": "This is one path within an ecosystem, not a complete food web.",
      "observe": "This is one path within an ecosystem, not a complete food web.",
      "question": "At 10% efficiency, 10000 kJ becomes at the next level…",
      "answer": "10000×0.1=1000 kJ.",
      "duration": 30
    },
    {
      "title": "Transfer to a herbivore",
      "focus": "Herbivores",
      "caption": "Only a chosen fraction becomes the next level’s energy input.",
      "detail": "The remainder includes respiration, waste and uneaten material.",
      "observe": "The remainder includes respiration, waste and uneaten material.",
      "question": "Untransferred energy includes…",
      "answer": "It can move into other ecosystem and thermal pathways.",
      "duration": 24
    },
    {
      "title": "Transfer again",
      "focus": "Carnivores",
      "caption": "Repeated fractional transfer reduces the energy available at higher levels.",
      "detail": "The same chosen efficiency is used at every step.",
      "observe": "The same chosen efficiency is used at every step.",
      "question": "This representation is…",
      "answer": "Its scope is a simplified pathway with a chosen efficiency.",
      "duration": 25,
      "formula": "energy at level n = producer energy × efficiencyⁿ"
    },
    {
      "title": "Account for the rest",
      "focus": "Untransferred energy",
      "caption": "Untransferred energy is not the same as energy being destroyed.",
      "detail": "Energy is redistributed into other forms and pathways.",
      "observe": "Energy is redistributed into other forms and pathways.",
      "question": "At 10% efficiency, 10000 kJ becomes at the next level…",
      "answer": "10000×0.1=1000 kJ.",
      "duration": 24
    },
    {
      "title": "Compare a longer chain",
      "focus": "Top level",
      "caption": "A longer chain has a smaller top-level input under fixed efficiency.",
      "detail": "The model does not infer organism abundance or a full ecosystem budget.",
      "observe": "The model does not infer organism abundance or a full ecosystem budget.",
      "question": "Untransferred energy includes…",
      "answer": "It can move into other ecosystem and thermal pathways.",
      "duration": 29
    }
  ],
  "population": [
    {
      "title": "Begin below capacity",
      "focus": "Population marker",
      "caption": "The population begins below a fixed carrying capacity.",
      "detail": "The model uses a continuous expected population quantity.",
      "observe": "The model uses a continuous expected population quantity.",
      "question": "In the logistic model, growth is zero at…",
      "answer": "The factor 1−N/K becomes zero at K.",
      "duration": 22
    },
    {
      "title": "Grow rapidly",
      "focus": "Population marker",
      "caption": "Early growth can be approximately exponential when N is small relative to K.",
      "detail": "The resource-limitation factor is then close to one.",
      "observe": "The resource-limitation factor is then close to one.",
      "question": "At very small N/K, growth is approximately…",
      "answer": "The density-limitation factor is close to one.",
      "duration": 27
    },
    {
      "title": "Feel the constraint",
      "focus": "Population marker",
      "caption": "As N approaches K, the limiting factor reduces net growth.",
      "detail": "The per-population effect depends on 1−N/K.",
      "observe": "The per-population effect depends on 1−N/K.",
      "question": "The dots represent…",
      "answer": "No stochastic individual-level process is calculated.",
      "duration": 22,
      "formula": "dN/dt = rN(1−N/K)"
    },
    {
      "title": "Approach capacity",
      "focus": "Population marker",
      "caption": "At N=K the deterministic net growth rate is zero.",
      "detail": "Birth and death processes are not represented separately.",
      "observe": "Birth and death processes are not represented separately.",
      "question": "In the logistic model, growth is zero at…",
      "answer": "The factor 1−N/K becomes zero at K.",
      "duration": 23
    },
    {
      "title": "Compare rate and capacity",
      "focus": "Population marker",
      "caption": "Changing r alters the approach speed; changing K alters the model limit.",
      "detail": "Environmental variation, migration and random events are excluded.",
      "observe": "Environmental variation, migration and random events are excluded.",
      "question": "At very small N/K, growth is approximately…",
      "answer": "The density-limitation factor is close to one.",
      "duration": 26
    }
  ],
  "watercycle": [
    {
      "title": "Store water in different places",
      "focus": "Ocean",
      "caption": "Water is distributed among ocean, atmosphere, land and ice reservoirs.",
      "detail": "The model begins with 1000 relative units in total.",
      "observe": "The model begins with 1000 relative units in total.",
      "question": "The total model water…",
      "answer": "Every transfer leaves one reservoir and enters another.",
      "duration": 25
    },
    {
      "title": "Move water to the air",
      "focus": "Atmosphere",
      "caption": "Evaporation transfers water from the ocean to the atmospheric reservoir.",
      "detail": "The coefficient is a teaching input, not a measured global climate parameter.",
      "observe": "The coefficient is a teaching input, not a measured global climate parameter.",
      "question": "Evaporation moves modeled water from…",
      "answer": "The selected transfer is ocean→air.",
      "duration": 28
    },
    {
      "title": "Return precipitation",
      "focus": "Land water",
      "caption": "Precipitation transfers atmospheric water toward land water in this four-box model.",
      "detail": "Runoff can then return land water to the ocean.",
      "observe": "Runoff can then return land water to the ocean.",
      "question": "These coefficients are…",
      "answer": "They illustrate a conservative reservoir system.",
      "duration": 26,
      "formula": "ocean + atmosphere + land + ice = constant"
    },
    {
      "title": "Exchange with ice",
      "focus": "Ice",
      "caption": "Freezing and melting transfer water between land and ice.",
      "detail": "Changing the melting coefficient changes the reservoir balance.",
      "observe": "Changing the melting coefficient changes the reservoir balance.",
      "question": "The total model water…",
      "answer": "Every transfer leaves one reservoir and enters another.",
      "duration": 23
    },
    {
      "title": "Check conservation",
      "focus": "Ocean",
      "caption": "Reservoir amounts change while their total remains fixed.",
      "detail": "No climate energy balance or global calibration is included.",
      "observe": "No climate energy balance or global calibration is included.",
      "question": "Evaporation moves modeled water from…",
      "answer": "The selected transfer is ocean→air.",
      "duration": 23
    }
  ],
  "seasons": [
    {
      "title": "Keep the axis directed",
      "focus": "Fixed axial direction",
      "caption": "The rotation axis keeps a fixed direction as Earth goes around the Sun.",
      "detail": "The orbit is circular in this teaching model.",
      "observe": "The orbit is circular in this teaching model.",
      "question": "The main geometric cause of seasons is…",
      "answer": "Tilt changes illumination angle and day length.",
      "duration": 27
    },
    {
      "title": "Tilt a hemisphere toward the Sun",
      "focus": "Earth",
      "caption": "Axial tilt changes the Sun’s declination through the year.",
      "detail": "The hemisphere tilted toward the Sun receives a higher noon Sun and longer days at many latitudes.",
      "observe": "The hemisphere tilted toward the Sun receives a higher noon Sun and longer days at many latitudes.",
      "question": "The two hemispheres generally have…",
      "answer": "A hemisphere tilted toward the Sun is paired with the other tilted away.",
      "duration": 32
    },
    {
      "title": "Compare the other season",
      "focus": "Earth",
      "caption": "Half an orbit later, the opposite hemisphere is favoured.",
      "detail": "The Earth–Sun distance remains fixed in the circular model.",
      "observe": "The Earth–Sun distance remains fixed in the circular model.",
      "question": "With zero tilt in this circular-orbit model…",
      "answer": "The Sun stays on the modeled equatorial plane.",
      "duration": 24,
      "formula": "solar declination = asin(sin tilt × sin annual angle)"
    },
    {
      "title": "Move the observer latitude",
      "focus": "Earth",
      "caption": "Latitude changes noon altitude and day length for the same date.",
      "detail": "The geometry includes the possibility of long or short polar-season days within the exposed range.",
      "observe": "The geometry includes the possibility of long or short polar-season days within the exposed range.",
      "question": "The main geometric cause of seasons is…",
      "answer": "Tilt changes illumination angle and day length.",
      "duration": 32
    },
    {
      "title": "Try zero tilt",
      "focus": "Fixed axial direction",
      "caption": "With zero tilt, this geometric seasonal variation disappears.",
      "detail": "Atmosphere, terrain and climate feedbacks are outside the model.",
      "observe": "Atmosphere, terrain and climate feedbacks are outside the model.",
      "question": "The two hemispheres generally have…",
      "answer": "A hemisphere tilted toward the Sun is paired with the other tilted away.",
      "duration": 23
    }
  ],
  "moon": [
    {
      "title": "Place Sun, Earth and Moon",
      "focus": "Moon",
      "caption": "Sunlight illuminates half of the Moon’s sphere.",
      "detail": "The visible fraction of that lit half depends on geometry.",
      "observe": "The visible fraction of that lit half depends on geometry.",
      "question": "At a quarter phase, the visible illuminated fraction is…",
      "answer": "Quarter describes the orbital phase position.",
      "duration": 23
    },
    {
      "title": "Read a crescent",
      "focus": "Earth-view phase",
      "caption": "Near new moon, only a small part of the illuminated surface faces Earth.",
      "detail": "The separate disc shows the Earth-view phase.",
      "observe": "The separate disc shows the Earth-view phase.",
      "question": "The phase cycle is mainly due to…",
      "answer": "Ordinary phases depend on the relative Sun–Earth–Moon geometry.",
      "duration": 26
    },
    {
      "title": "Reach a quarter",
      "focus": "Moon",
      "caption": "At a quarter phase, half the visible disc is illuminated.",
      "detail": "Quarter refers to orbital phase rather than the visible lit-area fraction.",
      "observe": "Quarter refers to orbital phase rather than the visible lit-area fraction.",
      "question": "This phase model predicts eclipses…",
      "answer": "The phase geometry deliberately omits eclipse alignment and shadowing.",
      "duration": 27,
      "formula": "illuminated fraction = (1−cos elongation)/2"
    },
    {
      "title": "Reach full moon",
      "focus": "Earth-view phase",
      "caption": "At opposition in this phase-only model, the visible disc is fully illuminated.",
      "detail": "Eclipses are deliberately omitted.",
      "observe": "Eclipses are deliberately omitted.",
      "question": "At a quarter phase, the visible illuminated fraction is…",
      "answer": "Quarter describes the orbital phase position.",
      "duration": 22
    },
    {
      "title": "Return through waning phases",
      "focus": "Moon",
      "caption": "The visible illuminated fraction decreases after full moon.",
      "detail": "The model does not include topography or libration.",
      "observe": "The model does not include topography or libration.",
      "question": "The phase cycle is mainly due to…",
      "answer": "Ordinary phases depend on the relative Sun–Earth–Moon geometry.",
      "duration": 22
    }
  ],
  "seismic": [
    {
      "title": "Create two wavefronts",
      "focus": "Earthquake source",
      "caption": "The source launches P and S wavefronts into a uniform model medium.",
      "detail": "The chosen P speed is greater than the S speed.",
      "observe": "The chosen P speed is greater than the S speed.",
      "question": "Which modeled wave arrives first?",
      "answer": "The allowed controls keep vP greater than vS.",
      "duration": 28
    },
    {
      "title": "Receive P first",
      "focus": "Seismic station",
      "caption": "The faster P wave reaches the station first.",
      "detail": "Its travel time is distance divided by P speed.",
      "observe": "Its travel time is distance divided by P speed.",
      "question": "At fixed speeds, larger S−P delay indicates…",
      "answer": "The lag is d(1/vS−1/vP).",
      "duration": 23
    },
    {
      "title": "Receive S later",
      "focus": "Seismic station",
      "caption": "The slower S wave arrives later.",
      "detail": "The arrival-time separation grows with distance at fixed speeds.",
      "observe": "The arrival-time separation grows with distance at fixed speeds.",
      "question": "One station’s lag alone gives…",
      "answer": "Additional station geometry is needed for localization.",
      "duration": 21,
      "formula": "distance = (tS−tP) / (1/vS−1/vP)"
    },
    {
      "title": "Infer a distance",
      "focus": "Schematic seismogram",
      "caption": "The difference between inverse speeds converts the S−P delay into a distance.",
      "detail": "One station gives a distance under the model assumptions, not a unique map location.",
      "observe": "One station gives a distance under the model assumptions, not a unique map location.",
      "question": "Which modeled wave arrives first?",
      "answer": "The allowed controls keep vP greater than vS.",
      "duration": 32
    },
    {
      "title": "State the limits",
      "focus": "Earthquake source",
      "caption": "Real Earth structure can change ray paths and travel times.",
      "detail": "This is not an earthquake prediction or magnitude model.",
      "observe": "This is not an earthquake prediction or magnitude model.",
      "question": "At fixed speeds, larger S−P delay indicates…",
      "answer": "The lag is d(1/vS−1/vP).",
      "duration": 25
    }
  ]
};

export function universePresentation(kind:UniverseKind,index:number,progress:number,elapsed:number):{p:UniverseParameters;time:number}{const p=universeDefaults(kind),phase=((elapsed%6)+6)%6/6;switch(kind){
case'collision':p.ud=index<3?1:index===3?.5:0;break;
case'lever':if(index===3)p.ub=p.ua*p.uc/p.ud;if(index===4)p.uc=.5+phase*1.5;break;
case'magnet':p.ub=.3+phase*1.1;p.uc=.3+.6*Math.sin(phase*Math.PI)**2;break;
case'standing':p.ud=[1,2,3,2,4][index];break;
case'capillary':p.ub=index===3?110:index===4?90:30;break;
case'orbit':p.ub=[.1,.4,.4,.65,.2][index];break;
case'titration':{const eq=p.ua*p.uc/p.ub;p.ud=index===0?phase*5:index===1?phase*.8*eq:index===2?eq*(.85+.3*phase):index===3?eq*(1.1+.9*phase):2*eq*phase;break}
case'crystal':p.ua=index<2?0:index===2?1:2;break;
case'replication':p.ua=phase*100;break;
case'meiosis':p.ua=Math.min(99.999,index*20+phase*19.999);break;
case'transpiration':if(index===1)p.uc=.1+phase*.9;if(index===2)p.ub=10+phase*80;break;
case'foodweb':p.uc=index===4?5:4;break;
case'seasons':p.uc=1+phase*364;if(index===4)p.ua=0;break;
case'moon':p.ua=phase*360;break;
}return{p,time:elapsed}}
