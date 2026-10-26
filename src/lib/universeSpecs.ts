import type{UniverseKind,UniverseParameters}from'./universeTypes';
export type UniverseControl={key:keyof UniverseParameters;label:string;unit:string;min:number;max:number;step:number;initial:number;choices?:string[]};
export type UniverseSpec={title:string;subject:string;chapter:string;grade:number;color:string;description:string;controls:UniverseControl[];formula:string;note:string;source:string};
export const universeSpecs:Record<UniverseKind,UniverseSpec>={
  "collision": {
    "title": "When moving bodies meet",
    "subject": "Physics",
    "chapter": "Momentum & collisions",
    "grade": 8,
    "color": "blue",
    "description": "Compare momentum transfer and kinetic-energy loss in a one-dimensional collision.",
    "controls": [
      {
        "key": "ua",
        "label": "First body mass",
        "unit": "kg",
        "min": 0.2,
        "max": 3,
        "step": 0.1,
        "initial": 1
      },
      {
        "key": "ub",
        "label": "Second body mass",
        "unit": "kg",
        "min": 0.2,
        "max": 3,
        "step": 0.1,
        "initial": 1
      },
      {
        "key": "uc",
        "label": "Incoming speed",
        "unit": "m/s",
        "min": 0.5,
        "max": 5,
        "step": 0.1,
        "initial": 2
      },
      {
        "key": "ud",
        "label": "Restitution coefficient",
        "unit": "",
        "min": 0,
        "max": 1,
        "step": 0.1,
        "initial": 1
      }
    ],
    "formula": "p = mv · e = relative separation speed / approach speed",
    "note": "One-dimensional isolated bodies; the second body starts at rest. Contact timing uses fixed 0.2 m radii. Momentum is conserved for all e; kinetic energy only for e=1. No deformation or impact-force calculation. Display repeats one encounter in six seconds.",
    "source": "#company"
  },
  "lever": {
    "title": "Balance around a pivot",
    "subject": "Physics",
    "chapter": "Torque & equilibrium",
    "grade": 7,
    "color": "purple",
    "description": "Move the loads and compare clockwise and anticlockwise moments.",
    "controls": [
      {
        "key": "ua",
        "label": "Left load",
        "unit": "N",
        "min": 2,
        "max": 30,
        "step": 1,
        "initial": 10
      },
      {
        "key": "ub",
        "label": "Right load",
        "unit": "N",
        "min": 2,
        "max": 30,
        "step": 1,
        "initial": 10
      },
      {
        "key": "uc",
        "label": "Left arm",
        "unit": "m",
        "min": 0.5,
        "max": 2,
        "step": 0.1,
        "initial": 1
      },
      {
        "key": "ud",
        "label": "Right arm",
        "unit": "m",
        "min": 0.5,
        "max": 2,
        "step": 0.1,
        "initial": 1.5
      }
    ],
    "formula": "τ = Fr cosθ · balance when F₁r₁ = F₂r₂",
    "note": "Rigid lever with point loads, a 1 kg uniform beam contribution to inertia, gravity 9.81 m/s², illustrative rotational damping 0.7 N·m·s/rad and stops at ±0.35 rad. Torques are calculated; the apparatus is an educational model.",
    "source": "#company"
  },
  "magnet": {
    "title": "Read an invisible field",
    "subject": "Physics",
    "chapter": "Magnetism",
    "grade": 8,
    "color": "indigo",
    "description": "Explore a magnetic dipole and use a movable compass probe to read field direction.",
    "controls": [
      {
        "key": "ua",
        "label": "Dipole moment",
        "unit": "A·m²",
        "min": 0.2,
        "max": 5,
        "step": 0.2,
        "initial": 1
      },
      {
        "key": "ub",
        "label": "Probe x distance",
        "unit": "m",
        "min": 0.2,
        "max": 1.5,
        "step": 0.1,
        "initial": 0.5
      },
      {
        "key": "uc",
        "label": "Probe y distance",
        "unit": "m",
        "min": 0.2,
        "max": 1.5,
        "step": 0.1,
        "initial": 0.5
      }
    ],
    "formula": "B = μ₀/(4πr³) [3(m·r̂)r̂ − m]",
    "note": "Point magnetic dipole in vacuum with moment along +x; probe remains outside the core. Bar, field-line geometry and compass size are schematic. Moving field markers indicate direction, not particles flowing out of a magnet.",
    "source": "#company"
  },
  "motor": {
    "title": "Keep a coil turning",
    "subject": "Physics",
    "chapter": "Electric motors",
    "grade": 9,
    "color": "amber",
    "description": "See how a split-ring commutator keeps the motor torque turning the same way.",
    "controls": [
      {
        "key": "ua",
        "label": "Motor magnetic field",
        "unit": "T",
        "min": 0.1,
        "max": 1,
        "step": 0.05,
        "initial": 0.3
      },
      {
        "key": "ub",
        "label": "Motor current",
        "unit": "A",
        "min": 0.1,
        "max": 2,
        "step": 0.1,
        "initial": 1
      },
      {
        "key": "uc",
        "label": "Motor coil turns",
        "unit": "",
        "min": 10,
        "max": 60,
        "step": 5,
        "initial": 20
      },
      {
        "key": "ud",
        "label": "Rotational damping",
        "unit": "N·m·s/rad",
        "min": 0.001,
        "max": 0.01,
        "step": 0.001,
        "initial": 0.003
      }
    ],
    "formula": "τ = N B I A |sinθ| · J dω/dt = τ − bω",
    "note": "Ideal commutation, uniform field, area 0.002 m², inertia 0.02 kg·m² and initial angle 0.3 rad. Numerical mechanical model with linear damping; no back-emf or inductance. Parameters are teaching choices, not a rated motor.",
    "source": "#company"
  },
  "standing": {
    "title": "The pattern that stands still",
    "subject": "Physics",
    "chapter": "Waves & resonance",
    "grade": 8,
    "color": "blue",
    "description": "Find nodes and antinodes as two opposite travelling waves form a standing wave.",
    "controls": [
      {
        "key": "ua",
        "label": "String length",
        "unit": "m",
        "min": 1,
        "max": 3,
        "step": 0.1,
        "initial": 2
      },
      {
        "key": "ub",
        "label": "String tension",
        "unit": "N",
        "min": 10,
        "max": 100,
        "step": 5,
        "initial": 40
      },
      {
        "key": "uc",
        "label": "Linear mass density",
        "unit": "kg/m",
        "min": 0.005,
        "max": 0.05,
        "step": 0.005,
        "initial": 0.02
      },
      {
        "key": "ud",
        "label": "Harmonic number",
        "unit": "",
        "min": 1,
        "max": 5,
        "step": 1,
        "initial": 2
      }
    ],
    "formula": "fₙ = n/(2L)√(T/μ) · y = A sin(nπx/L)cos(2πft)",
    "note": "Ideal string fixed at both ends, amplitude 0.2 m, no damping. Frequency is physical; one full oscillation is displayed over two seconds to avoid aliasing. Motion is deliberately slowed.",
    "source": "#company"
  },
  "echo": {
    "title": "Measure with a returning sound",
    "subject": "Physics",
    "chapter": "Sound",
    "grade": 7,
    "color": "mint",
    "description": "Send a sound pulse to a wall and use its round-trip delay to infer distance.",
    "controls": [
      {
        "key": "ua",
        "label": "Reflector distance",
        "unit": "m",
        "min": 5,
        "max": 200,
        "step": 5,
        "initial": 50
      },
      {
        "key": "ub",
        "label": "Air temperature",
        "unit": "°C",
        "min": -10,
        "max": 40,
        "step": 1,
        "initial": 20
      }
    ],
    "formula": "distance = sound speed × echo delay / 2",
    "note": "Straight-line reflection in uniform air; approximate speed c=331+0.6T m/s over the exposed temperature range. No attenuation, dispersion or multiple reflections. The round trip is slowed and repeated for visibility.",
    "source": "#company"
  },
  "conduction": {
    "title": "Heat finds a balance",
    "subject": "Physics",
    "chapter": "Thermal physics",
    "grade": 8,
    "color": "rose",
    "description": "Connect two insulated blocks and follow thermal energy toward equilibrium.",
    "controls": [
      {
        "key": "ua",
        "label": "Initial left temperature",
        "unit": "°C",
        "min": 30,
        "max": 100,
        "step": 5,
        "initial": 80
      },
      {
        "key": "ub",
        "label": "Initial right temperature",
        "unit": "°C",
        "min": 0,
        "max": 50,
        "step": 5,
        "initial": 20
      },
      {
        "key": "uc",
        "label": "Mass of each block",
        "unit": "kg",
        "min": 0.2,
        "max": 2,
        "step": 0.1,
        "initial": 1
      },
      {
        "key": "ud",
        "label": "Thermal conductance",
        "unit": "W/K",
        "min": 1,
        "max": 15,
        "step": 1,
        "initial": 5
      }
    ],
    "formula": "Q̇ = G(T₁−T₂) · ΔT(t) = ΔT₀e⁻ᵗ/τ",
    "note": "Two equal masses with heat capacity 900 J/(kg·K), uniform block temperatures, no environmental heat loss. Exact two-compartment heat exchange conserves thermal energy. Geometry and microscopic agitation are symbolic.",
    "source": "#company"
  },
  "capillary": {
    "title": "Water climbs a narrow tube",
    "subject": "Physics",
    "chapter": "Surface phenomena",
    "grade": 9,
    "color": "blue",
    "description": "Compare a wetting rise with a non-wetting depression in a capillary.",
    "controls": [
      {
        "key": "ua",
        "label": "Capillary radius",
        "unit": "mm",
        "min": 0.2,
        "max": 2,
        "step": 0.1,
        "initial": 0.5
      },
      {
        "key": "ub",
        "label": "Contact angle",
        "unit": "°",
        "min": 0,
        "max": 130,
        "step": 5,
        "initial": 30
      },
      {
        "key": "uc",
        "label": "Surface tension",
        "unit": "N/m",
        "min": 0.02,
        "max": 0.08,
        "step": 0.005,
        "initial": 0.072
      }
    ],
    "formula": "h = 2γcosθ / (ρgr)",
    "note": "Static Jurin height for density 1000 kg/m³ and g=9.81 m/s². The approach to height is a staged illustration, not a viscosity-dependent transient solver. Radius and vertical height use different visual scales.",
    "source": "#company"
  },
  "decay": {
    "title": "A clock inside the nucleus",
    "subject": "Physics",
    "chapter": "Nuclear physics",
    "grade": 10,
    "color": "purple",
    "description": "Follow an ensemble through repeated half-lives and distinguish expected counts from single events.",
    "controls": [
      {
        "key": "ua",
        "label": "Half-life",
        "unit": "s",
        "min": 2,
        "max": 30,
        "step": 1,
        "initial": 10
      },
      {
        "key": "ub",
        "label": "Initial parent nuclei",
        "unit": "",
        "min": 20,
        "max": 200,
        "step": 10,
        "initial": 100
      }
    ],
    "formula": "N = N₀e⁻λt · λ = ln2 / t½",
    "note": "Single decay channel, constant decay probability per time. Counts are expected values; marker colour changes are a deterministic illustration, not predictions of which nucleus decays. No isotope-specific radiation dose model.",
    "source": "#company"
  },
  "orbit": {
    "title": "An orbit that changes speed",
    "subject": "Earth & Space",
    "chapter": "Orbital mechanics",
    "grade": 9,
    "color": "indigo",
    "description": "Follow an elliptical orbit and compare the near-Sun and far-Sun parts of the journey.",
    "controls": [
      {
        "key": "ua",
        "label": "Semi-major axis",
        "unit": "AU",
        "min": 0.5,
        "max": 3,
        "step": 0.1,
        "initial": 1
      },
      {
        "key": "ub",
        "label": "Orbital eccentricity",
        "unit": "",
        "min": 0,
        "max": 0.7,
        "step": 0.05,
        "initial": 0.4
      }
    ],
    "formula": "M = E − e sinE · T = 365.256 a³ᐟ² days",
    "note": "Two-body Kepler ellipse around a Sun-mass star; negligible planet mass. Newton iteration solves Kepler’s equation. Orbit orientation, sizes and display time are schematic; not an ephemeris.",
    "source": "#company"
  },
  "titration": {
    "title": "Find the turning point of a titration",
    "subject": "Chemistry",
    "chapter": "Acids, bases & analysis",
    "grade": 9,
    "color": "rose",
    "description": "Add a strong base to a strong acid and follow stoichiometry, pH and the equivalence point.",
    "controls": [
      {
        "key": "ua",
        "label": "Acid concentration",
        "unit": "mol/L",
        "min": 0.02,
        "max": 0.2,
        "step": 0.01,
        "initial": 0.1
      },
      {
        "key": "ub",
        "label": "Base concentration",
        "unit": "mol/L",
        "min": 0.02,
        "max": 0.2,
        "step": 0.01,
        "initial": 0.1
      },
      {
        "key": "uc",
        "label": "Initial acid volume",
        "unit": "mL",
        "min": 10,
        "max": 50,
        "step": 5,
        "initial": 25
      },
      {
        "key": "ud",
        "label": "Base volume added",
        "unit": "mL",
        "min": 0,
        "max": 100,
        "step": 1,
        "initial": 0
      }
    ],
    "formula": "at equivalence: CₐVₐ = CᵦVᵦ",
    "note": "Ideal monoprotic strong acid/base at 25°C, complete reaction and dissociation, Kw=10⁻¹⁴. Includes water autoionization and changing total volume. Indicator colour uses an illustrative phenolphthalein transition (pKa 9.4); no activity correction or weak-acid chemistry.",
    "source": "#company"
  },
  "distillation": {
    "title": "Follow the more volatile component",
    "subject": "Chemistry",
    "chapter": "Separation methods",
    "grade": 9,
    "color": "amber",
    "description": "Watch a binary mixture boil, condense and form an enriched distillate.",
    "controls": [
      {
        "key": "ua",
        "label": "Initial A mole fraction",
        "unit": "",
        "min": 0.1,
        "max": 0.9,
        "step": 0.05,
        "initial": 0.5
      },
      {
        "key": "ub",
        "label": "Relative volatility A/B",
        "unit": "",
        "min": 1.2,
        "max": 5,
        "step": 0.2,
        "initial": 2.5
      },
      {
        "key": "uc",
        "label": "Distillate molar flow",
        "unit": "mol/s",
        "min": 0.005,
        "max": 0.02,
        "step": 0.001,
        "initial": 0.01
      }
    ],
    "formula": "yA = αxA / [1 + (α−1)xA]",
    "note": "Ideal fictional binary mixture with constant relative volatility, initially 1 mol. Differential batch material balance, perfect condensation, no reflux. No real boiling temperatures, azeotropes or compound-specific fit. Run stops after 80% collection.",
    "source": "#company"
  },
  "crystal": {
    "title": "Build the space inside a solid",
    "subject": "Chemistry",
    "chapter": "Crystalline solids",
    "grade": 10,
    "color": "purple",
    "description": "Assemble simple, body-centred and face-centred cubic cells and compare packing.",
    "controls": [
      {
        "key": "ua",
        "label": "Cubic structure",
        "unit": "",
        "min": 0,
        "max": 2,
        "step": 1,
        "initial": 0,
        "choices": [
          "Simple cubic",
          "Body-centred cubic",
          "Face-centred cubic"
        ]
      },
      {
        "key": "ub",
        "label": "Unit-cell edge",
        "unit": "nm",
        "min": 0.2,
        "max": 1,
        "step": 0.05,
        "initial": 0.4
      }
    ],
    "formula": "effective atoms: SC 1 · BCC 2 · FCC 4",
    "note": "Ideal hard-sphere cubic cells. Contact radii and packing efficiencies follow geometric relations. Boundary atoms are drawn whole but their fractional contributions are stated. The construction is explanatory, not crystallization dynamics.",
    "source": "#company"
  },
  "electrolysis": {
    "title": "Split water with charge",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "grade": 10,
    "color": "blue",
    "description": "Compare charge passed with the hydrogen and oxygen produced in ideal water electrolysis.",
    "controls": [
      {
        "key": "ua",
        "label": "Electrolysis current",
        "unit": "A",
        "min": 0.2,
        "max": 3,
        "step": 0.1,
        "initial": 1
      },
      {
        "key": "ub",
        "label": "Gas temperature",
        "unit": "K",
        "min": 280,
        "max": 330,
        "step": 5,
        "initial": 298
      },
      {
        "key": "uc",
        "label": "Gas pressure",
        "unit": "atm",
        "min": 0.8,
        "max": 2,
        "step": 0.1,
        "initial": 1
      }
    ],
    "formula": "n(H₂)=Q/(2F) · n(O₂)=Q/(4F)",
    "note": "Ideal conducting water/electrolyte system with inert electrodes and 100% current efficiency. Gas volumes use the ideal-gas law. Hydrogen evolves at the cathode and oxygen at the anode. No overpotentials or competing electrolyte reactions are modeled.",
    "source": "#company"
  },
  "galvanic": {
    "title": "A chemical source of voltage",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "grade": 10,
    "color": "amber",
    "description": "Follow electrons through a Daniell cell and see how concentration changes its voltage.",
    "controls": [
      {
        "key": "ua",
        "label": "Zinc ion concentration",
        "unit": "mol/L",
        "min": 0.05,
        "max": 2,
        "step": 0.05,
        "initial": 1
      },
      {
        "key": "ub",
        "label": "Copper ion concentration",
        "unit": "mol/L",
        "min": 0.05,
        "max": 2,
        "step": 0.05,
        "initial": 1
      },
      {
        "key": "uc",
        "label": "Cell temperature",
        "unit": "K",
        "min": 280,
        "max": 330,
        "step": 5,
        "initial": 298
      },
      {
        "key": "ud",
        "label": "External resistance",
        "unit": "Ω",
        "min": 20,
        "max": 500,
        "step": 20,
        "initial": 100
      }
    ],
    "formula": "E = 1.10 − RT/(2F) ln([Zn²⁺]/[Cu²⁺])",
    "note": "Ideal Zn/Cu cell with unit metal activities and concentration as activity. Half-cell concentrations are held fixed; E/R is an ideal external-load current without internal resistance. Salt-bridge and electron markers are representative, not a transport/aging solver.",
    "source": "#company"
  },
  "rutherford": {
    "title": "A small target, a large deflection",
    "subject": "Chemistry",
    "chapter": "Atomic structure",
    "grade": 9,
    "color": "indigo",
    "description": "Send an alpha particle past a gold nucleus and compare impact parameter with scattering angle.",
    "controls": [
      {
        "key": "ua",
        "label": "Alpha kinetic energy",
        "unit": "MeV",
        "min": 1,
        "max": 10,
        "step": 0.5,
        "initial": 5
      },
      {
        "key": "ub",
        "label": "Impact parameter",
        "unit": "fm",
        "min": 5,
        "max": 100,
        "step": 5,
        "initial": 30
      }
    ],
    "formula": "tan(χ/2)=k/(2Eb) · k=Z₁Z₂e²/(4πε₀)",
    "note": "Classical repulsive Coulomb scattering, alpha charge +2e and gold nuclear charge +79e. Velocity-Verlet trajectory uses an enlarged zoomed nucleus; no nuclear force, electron screening, recoil or quantum corrections. Formula assumes asymptotic impact conditions.",
    "source": "#company"
  },
  "solubility": {
    "title": "A gas dissolves under pressure",
    "subject": "Chemistry",
    "chapter": "Solutions",
    "grade": 9,
    "color": "mint",
    "description": "Change gas pressure and follow a dissolved concentration toward its Henry-law limit.",
    "controls": [
      {
        "key": "ua",
        "label": "Gas partial pressure",
        "unit": "atm",
        "min": 0.2,
        "max": 5,
        "step": 0.2,
        "initial": 2
      },
      {
        "key": "ub",
        "label": "Henry coefficient",
        "unit": "mol/L/atm",
        "min": 0.01,
        "max": 0.06,
        "step": 0.005,
        "initial": 0.03
      },
      {
        "key": "uc",
        "label": "Exchange rate constant",
        "unit": "s⁻¹",
        "min": 0.02,
        "max": 0.2,
        "step": 0.02,
        "initial": 0.08
      }
    ],
    "formula": "Ceq = kH p · C(t)=Ceq(1−e⁻ᵏᵗ)",
    "note": "Generic ideal dilute gas-solvent system with user-chosen Henry coefficient, fixed temperature and a maintained gas reservoir. First-order mass transfer from initially solute-free liquid. No named-gas fit, reaction or closed-vessel pressure change.",
    "source": "#company"
  },
  "centrifuge": {
    "title": "Separate with a spinning frame",
    "subject": "Chemistry",
    "chapter": "Separation methods",
    "grade": 9,
    "color": "blue",
    "description": "Track ideal particles moving outward in a centrifuge and compare size, density and speed.",
    "controls": [
      {
        "key": "ua",
        "label": "Rotor speed",
        "unit": "rpm",
        "min": 500,
        "max": 4000,
        "step": 250,
        "initial": 2000
      },
      {
        "key": "ub",
        "label": "Particle diameter",
        "unit": "µm",
        "min": 1,
        "max": 10,
        "step": 1,
        "initial": 5
      },
      {
        "key": "uc",
        "label": "Particle-fluid density contrast",
        "unit": "kg/m³",
        "min": 50,
        "max": 500,
        "step": 50,
        "initial": 300
      },
      {
        "key": "ud",
        "label": "Fluid viscosity",
        "unit": "mPa·s",
        "min": 0.7,
        "max": 5,
        "step": 0.1,
        "initial": 1
      }
    ],
    "formula": "dr/dt = Δρ d²ω²r/(18η)",
    "note": "Dilute spherical particles in a co-rotating Newtonian fluid, Stokes drag and terminal radial drift; initial radius 3 cm, wall 8 cm. No Brownian motion, turbulence or particle interactions. Rotor rotation is visually slowed; physical settling time is stated.",
    "source": "#company"
  },
  "heart": {
    "title": "One beat, two circulations",
    "subject": "Biology",
    "chapter": "Human physiology",
    "grade": 6,
    "color": "rose",
    "description": "Follow blood through four heart chambers, the lungs and the body circuit.",
    "controls": [
      {
        "key": "ua",
        "label": "Heart rate",
        "unit": "beats/min",
        "min": 45,
        "max": 150,
        "step": 5,
        "initial": 75
      },
      {
        "key": "ub",
        "label": "Stroke volume",
        "unit": "mL/beat",
        "min": 30,
        "max": 100,
        "step": 5,
        "initial": 70
      }
    ],
    "formula": "cardiac output = heart rate × stroke volume",
    "note": "Conceptual chamber-and-vessel loop with an illustrative contraction waveform. Output is rate×stroke volume, not a pressure/valve-flow solver or patient model. Purple indicates lower oxygenation; real venous blood is dark red, not blue. Organ shape and timing are interpretive.",
    "source": "#company"
  },
  "nephron": {
    "title": "Filter, reclaim, excrete",
    "subject": "Biology",
    "chapter": "Human physiology",
    "grade": 9,
    "color": "mint",
    "description": "Follow filtrate through a schematic nephron and balance water and a freely filtered solute.",
    "controls": [
      {
        "key": "ua",
        "label": "Filtration rate",
        "unit": "mL/min",
        "min": 50,
        "max": 180,
        "step": 10,
        "initial": 120
      },
      {
        "key": "ub",
        "label": "Water reabsorbed fraction",
        "unit": "",
        "min": 0.9,
        "max": 0.995,
        "step": 0.005,
        "initial": 0.99
      },
      {
        "key": "uc",
        "label": "Plasma solute concentration",
        "unit": "mmol/L",
        "min": 1,
        "max": 10,
        "step": 0.5,
        "initial": 5
      },
      {
        "key": "ud",
        "label": "Solute reabsorbed fraction",
        "unit": "",
        "min": 0.5,
        "max": 0.99,
        "step": 0.01,
        "initial": 0.95
      }
    ],
    "formula": "urine flow = filtration × (1−water reabsorption)",
    "note": "Whole-nephron bookkeeping for a generic freely filtered solute, no secretion or protein binding. Fixed fractional reabsorption, no blood-pressure autoregulation or clinical prediction. Tubule geometry and transport markers are schematic.",
    "source": "#company"
  },
  "reflex": {
    "title": "The short route to a response",
    "subject": "Biology",
    "chapter": "Nervous system",
    "grade": 8,
    "color": "purple",
    "description": "Follow a simplified sensory-spinal-motor pathway and compare signal travel delays.",
    "controls": [
      {
        "key": "ua",
        "label": "Sensory path length",
        "unit": "m",
        "min": 0.2,
        "max": 1,
        "step": 0.1,
        "initial": 0.6
      },
      {
        "key": "ub",
        "label": "Motor path length",
        "unit": "m",
        "min": 0.2,
        "max": 1,
        "step": 0.1,
        "initial": 0.6
      },
      {
        "key": "uc",
        "label": "Axonal conduction speed",
        "unit": "m/s",
        "min": 10,
        "max": 80,
        "step": 5,
        "initial": 30
      },
      {
        "key": "ud",
        "label": "Synaptic delay",
        "unit": "ms",
        "min": 1,
        "max": 5,
        "step": 0.5,
        "initial": 2
      }
    ],
    "formula": "latency = sensory length/speed + synaptic delay + motor length/speed",
    "note": "One simplified spinal reflex path with constant conduction speed and one aggregate synaptic delay. No detailed neuron, muscle-force or patient-response model. Pulse motion is slowed; calculated latency is in milliseconds.",
    "source": "#company"
  },
  "replication": {
    "title": "Copy a strand, keep the code",
    "subject": "Biology",
    "chapter": "Molecular genetics",
    "grade": 9,
    "color": "indigo",
    "description": "Move a replication fork and check complementary bases in a semiconservative copy.",
    "controls": [
      {
        "key": "ua",
        "label": "Replication-fork progress",
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": 1,
        "initial": 0
      },
      {
        "key": "ub",
        "label": "Template sequence",
        "unit": "",
        "min": 0,
        "max": 2,
        "step": 1,
        "initial": 0,
        "choices": [
          "Template A",
          "Template B",
          "Template C"
        ]
      }
    ],
    "formula": "base pairing: A↔T · C↔G",
    "note": "Conceptual replication of a short DNA segment, starting from a prepared template. Complementarity and copied-base count are exact. Fork timing, enzyme sizes and strand geometry are schematic; no leading/lagging kinetics, mutation or proofreading solver.",
    "source": "#company"
  },
  "meiosis": {
    "title": "Two divisions, four haploid sets",
    "subject": "Biology",
    "chapter": "Cell division",
    "grade": 9,
    "color": "purple",
    "description": "Follow homolog separation and sister separation to four haploid sets.",
    "controls": [
      {
        "key": "ua",
        "label": "Meiotic stage progress",
        "unit": "%",
        "min": 0,
        "max": 100,
        "step": 1,
        "initial": 0
      }
    ],
    "formula": "one replicated 2n=4 cell → four n=2 products",
    "note": "Conceptual meiosis starting after DNA replication, with two homologous chromosome pairs. First division separates homologs; second separates sisters. Stage durations and spindle geometry are schematic. Crossing-over and stochastic assortment are not explicitly calculated.",
    "source": "#company"
  },
  "transpiration": {
    "title": "From roots to the air",
    "subject": "Biology",
    "chapter": "Plant physiology",
    "grade": 8,
    "color": "mint",
    "description": "Connect stomatal opening and humidity with an illustrative leaf-water loss rate.",
    "controls": [
      {
        "key": "ua",
        "label": "Leaf temperature",
        "unit": "°C",
        "min": 15,
        "max": 40,
        "step": 1,
        "initial": 25
      },
      {
        "key": "ub",
        "label": "Relative humidity",
        "unit": "%",
        "min": 10,
        "max": 90,
        "step": 5,
        "initial": 40
      },
      {
        "key": "uc",
        "label": "Stomatal opening fraction",
        "unit": "",
        "min": 0,
        "max": 1,
        "step": 0.1,
        "initial": 0.6
      },
      {
        "key": "ud",
        "label": "Leaf area",
        "unit": "m²",
        "min": 0.005,
        "max": 0.05,
        "step": 0.005,
        "initial": 0.01
      }
    ],
    "formula": "water flux = gs × VPD / air pressure",
    "note": "Tetens saturation-vapour-pressure approximation, air pressure 101325 Pa, teaching maximum stomatal conductance 0.15 mol/(m²·s), no species calibration. Fixed leaf temperature; no energy balance or hydraulic cavitation solver.",
    "source": "#company"
  },
  "foodweb": {
    "title": "Energy through an ecosystem",
    "subject": "Biology",
    "chapter": "Ecology",
    "grade": 6,
    "color": "mint",
    "description": "Follow one food-chain pathway and compare transferred with untransferred energy.",
    "controls": [
      {
        "key": "ua",
        "label": "Producer energy",
        "unit": "kJ",
        "min": 1000,
        "max": 20000,
        "step": 1000,
        "initial": 10000
      },
      {
        "key": "ub",
        "label": "Transfer efficiency",
        "unit": "",
        "min": 0.05,
        "max": 0.2,
        "step": 0.01,
        "initial": 0.1
      },
      {
        "key": "uc",
        "label": "Trophic levels",
        "unit": "",
        "min": 3,
        "max": 5,
        "step": 1,
        "initial": 4
      }
    ],
    "formula": "energy at level n = producer energy × efficiencyⁿ",
    "note": "One simplified chain within a food web, equal chosen transfer efficiency at each step. Untransferred energy includes respiration, waste and uneaten material, not only heat. No organism-population or full ecosystem simulation.",
    "source": "#company"
  },
  "population": {
    "title": "Growth meets a limit",
    "subject": "Biology",
    "chapter": "Population ecology",
    "grade": 9,
    "color": "blue",
    "description": "Compare early growth with the slowing effect of a fixed carrying capacity.",
    "controls": [
      {
        "key": "ua",
        "label": "Initial population",
        "unit": "",
        "min": 20,
        "max": 80,
        "step": 5,
        "initial": 30
      },
      {
        "key": "ub",
        "label": "Carrying capacity",
        "unit": "",
        "min": 100,
        "max": 1000,
        "step": 50,
        "initial": 300
      },
      {
        "key": "uc",
        "label": "Intrinsic growth rate",
        "unit": "day⁻¹",
        "min": 0.05,
        "max": 0.5,
        "step": 0.05,
        "initial": 0.2
      }
    ],
    "formula": "dN/dt = rN(1−N/K)",
    "note": "Deterministic continuous logistic population, constant carrying capacity and rate, no age structure, migration, predation or random events. Dots are representative; N is an expected continuous model quantity.",
    "source": "#company"
  },
  "watercycle": {
    "title": "The same water, many journeys",
    "subject": "Earth & Space",
    "chapter": "Water cycle",
    "grade": 5,
    "color": "blue",
    "description": "Transfer water among ocean, air, land and ice while conserving the model’s total.",
    "controls": [
      {
        "key": "ua",
        "label": "Evaporation coefficient",
        "unit": "day⁻¹",
        "min": 0.001,
        "max": 0.01,
        "step": 0.001,
        "initial": 0.005
      },
      {
        "key": "ub",
        "label": "Precipitation coefficient",
        "unit": "day⁻¹",
        "min": 0.1,
        "max": 0.6,
        "step": 0.05,
        "initial": 0.3
      },
      {
        "key": "uc",
        "label": "Melting coefficient",
        "unit": "day⁻¹",
        "min": 0.001,
        "max": 0.04,
        "step": 0.001,
        "initial": 0.01
      },
      {
        "key": "ud",
        "label": "Runoff coefficient",
        "unit": "day⁻¹",
        "min": 0.01,
        "max": 0.1,
        "step": 0.01,
        "initial": 0.03
      }
    ],
    "formula": "ocean + atmosphere + land + ice = constant",
    "note": "Four well-mixed reservoirs, initial total 1000 relative water units. Linear transfers and numerical mass-conserving integration. Coefficients are teaching choices, not an Earth/climate calibration; no atmospheric energy or global water budget claim.",
    "source": "#company"
  },
  "seasons": {
    "title": "Tilt changes the sunlight",
    "subject": "Earth & Space",
    "chapter": "Earth–Sun system",
    "grade": 5,
    "color": "amber",
    "description": "Change tilt, latitude and season to compare day length and noon Sun altitude.",
    "controls": [
      {
        "key": "ua",
        "label": "Axial tilt",
        "unit": "°",
        "min": 0,
        "max": 35,
        "step": 1,
        "initial": 23.44
      },
      {
        "key": "ub",
        "label": "Observer latitude",
        "unit": "°",
        "min": -60,
        "max": 60,
        "step": 5,
        "initial": 30
      },
      {
        "key": "uc",
        "label": "Day of model year",
        "unit": "",
        "min": 1,
        "max": 365,
        "step": 1,
        "initial": 80
      }
    ],
    "formula": "solar declination = asin(sin tilt × sin annual angle)",
    "note": "Circular Earth orbit, fixed axis direction, approximate 365.2422-day year and solar constant 1361 W/m². Day length and daily top-of-atmosphere irradiance are geometric, without refraction, atmosphere, terrain or climate.",
    "source": "#company"
  },
  "moon": {
    "title": "Read the Moon’s changing face",
    "subject": "Earth & Space",
    "chapter": "Moon phases",
    "grade": 5,
    "color": "indigo",
    "description": "Connect Sun–Earth–Moon geometry with the illuminated fraction seen from Earth.",
    "controls": [
      {
        "key": "ua",
        "label": "Sun–Moon elongation",
        "unit": "°",
        "min": 0,
        "max": 360,
        "step": 5,
        "initial": 0
      }
    ],
    "formula": "illuminated fraction = (1−cos elongation)/2",
    "note": "Circular coplanar phase geometry with distant sunlight. The Earth-view phase disc is separate from the orbital diagram. Sizes/distances are compressed. Eclipses, libration and lunar topography are omitted.",
    "source": "#company"
  },
  "seismic": {
    "title": "Two arrivals from one quake",
    "subject": "Earth & Space",
    "chapter": "Earthquakes",
    "grade": 8,
    "color": "rose",
    "description": "Compare P and S arrivals and infer source distance from their time separation.",
    "controls": [
      {
        "key": "ua",
        "label": "Source–station distance",
        "unit": "km",
        "min": 20,
        "max": 500,
        "step": 20,
        "initial": 100
      },
      {
        "key": "ub",
        "label": "P-wave speed",
        "unit": "km/s",
        "min": 4,
        "max": 8,
        "step": 0.5,
        "initial": 6
      },
      {
        "key": "uc",
        "label": "S-wave speed",
        "unit": "km/s",
        "min": 2,
        "max": 3.5,
        "step": 0.25,
        "initial": 3.5
      }
    ],
    "formula": "distance = (tS−tP) / (1/vS−1/vP)",
    "note": "Straight paths through a uniform medium, constant speeds and one source-station distance. Wavefronts and seismograms are schematic; no depth inversion, heterogeneous Earth, magnitude estimate or earthquake prediction.",
    "source": "#company"
  }
};
export function universeDefaults(kind:string):UniverseParameters{const p:UniverseParameters={ua:1,ub:1,uc:1,ud:1};const spec=universeSpecs[kind as UniverseKind];if(spec)for(const c of spec.controls)p[c.key]=c.initial;return p}
