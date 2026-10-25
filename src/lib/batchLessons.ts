import type{Lesson}from'./lessons';
export const batchLessons:Lesson[]=[
  {
    "id": "freefall",
    "title": "Falling through air",
    "subject": "Physics",
    "chapter": "Mechanics",
    "kind": "freefall",
    "grades": [
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Drop a body from a tower and compare gravity, drag and terminal speed.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "The body starts with zero speed and gravity acts downward.",
      "Drag grows as speed increases and opposes the fall.",
      "Ground contact ends the drop. Impact speed is recorded separately."
    ],
    "explanation": [
      "A released body accelerates downward under gravity. In a vacuum all bodies released from rest at the same height have the same trajectory, regardless of mass.",
      "Air resistance opposes motion. For this model its magnitude is half the air density times drag coefficient times frontal area times speed squared. Terminal speed occurs when drag balances weight.",
      "The analytic model fixes density and drag coefficient and stops at the ground without a bounce. Terminal speed may not be reached before impact."
    ],
    "terms": {
      "Terminal_speed": "The limiting speed when weight and drag balance.",
      "Frontal_area": "Area presented perpendicular to the motion."
    },
    "formula": "Fdrag = ½ρCdAv² · vt = √(2mg/ρCdA)",
    "misconception": "A heavier object does not fall faster in a vacuum. In air, mass and frontal area both matter.",
    "activity": "Keep area fixed. Compare 0.5 kg and 2 kg drops, then switch drag off and compare impact times.",
    "steps": [
      {
        "title": "Release from rest",
        "text": "The body starts with zero speed and gravity acts downward."
      },
      {
        "title": "Accelerate in vacuum",
        "text": "Without drag, downward speed increases by g each second."
      },
      {
        "title": "Build air resistance",
        "text": "Drag grows as speed increases and opposes the fall."
      },
      {
        "title": "Approach terminal speed",
        "text": "As drag approaches weight, acceleration tends toward zero."
      },
      {
        "title": "Reach the ground",
        "text": "Ground contact ends the drop. Impact speed is recorded separately."
      }
    ],
    "quiz": [
      {
        "question": "In a vacuum, doubling mass at the same release height changes fall time by…",
        "options": [
          "A factor of two",
          "No change",
          "A factor of four",
          "Making it zero"
        ],
        "answer": 1,
        "explanation": "The ideal gravitational acceleration is independent of body mass."
      },
      {
        "question": "At terminal speed, drag is…",
        "options": [
          "Zero",
          "Greater than weight",
          "Equal in magnitude to weight",
          "Always downward"
        ],
        "answer": 2,
        "explanation": "Opposite forces balance, so acceleration is zero."
      },
      {
        "question": "Increasing frontal area at fixed mass makes terminal speed…",
        "options": [
          "Smaller",
          "Larger",
          "Unchanged",
          "Infinite"
        ],
        "answer": 0,
        "explanation": "Terminal speed is inversely proportional to the square root of area."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/6-4-drag-force-and-terminal-speed",
    "sourceTitle": "OpenStax · Mechanics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "spring",
    "title": "The rhythm of a spring",
    "subject": "Physics",
    "chapter": "Oscillations & waves",
    "kind": "spring",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Track a mass on a spring and watch energy shift between motion and deformation.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Displace the mass. The spring stores elastic potential energy.",
      "At equilibrium the mass moves fastest although spring force is zero.",
      "A larger mass takes longer to complete an oscillation."
    ],
    "explanation": [
      "A linear spring exerts a restoring force proportional to displacement from equilibrium: F = −kx. The minus sign indicates the force points toward equilibrium.",
      "For a horizontal frictionless mass and spring, displacement follows a sinusoid and the period is 2π√(m/k). Increasing mass slows the oscillation; increasing stiffness speeds it up.",
      "The mass is fastest at equilibrium and stops momentarily at turning points. Kinetic and spring potential energy exchange while their sum stays constant."
    ],
    "terms": {
      "Stiffness": "Force per unit extension, measured in N/m.",
      "Restoring_force": "A force directed toward equilibrium."
    },
    "formula": "T = 2π√(m/k) · E = ½kA²",
    "misconception": "Zero spring force at equilibrium does not mean zero velocity.",
    "activity": "Quadruple mass and compare periods. Then double amplitude and compare total energy.",
    "steps": [
      {
        "title": "Store elastic energy",
        "text": "Displace the mass. The spring stores elastic potential energy."
      },
      {
        "title": "Follow the restoring force",
        "text": "The spring pulls or pushes toward equilibrium."
      },
      {
        "title": "Pass equilibrium",
        "text": "At equilibrium the mass moves fastest although spring force is zero."
      },
      {
        "title": "Reverse direction",
        "text": "The mass slows to rest at the opposite turning point."
      },
      {
        "title": "Change the mass",
        "text": "A larger mass takes longer to complete an oscillation."
      }
    ],
    "quiz": [
      {
        "question": "Four times the mass gives a period…",
        "options": [
          "Half as long",
          "Twice as long",
          "Four times as long",
          "Unchanged"
        ],
        "answer": 1,
        "explanation": "T is proportional to √m."
      },
      {
        "question": "Speed is greatest at…",
        "options": [
          "A turning point",
          "Equilibrium",
          "Every point equally",
          "Maximum extension only"
        ],
        "answer": 1,
        "explanation": "All the mechanical energy is kinetic at equilibrium."
      },
      {
        "question": "Doubling amplitude makes total energy…",
        "options": [
          "Twice as large",
          "Unchanged",
          "Four times as large",
          "Zero"
        ],
        "answer": 2,
        "explanation": "Energy is proportional to A²."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion",
    "sourceTitle": "OpenStax · Oscillations & waves",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "waves",
    "title": "A wave without a journey",
    "subject": "Physics",
    "chapter": "Oscillations & waves",
    "kind": "waves",
    "grades": [
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Follow a travelling wave while a marked material point stays in its own place.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "A material point oscillates vertically while the pattern travels horizontally.",
      "Frequency counts complete oscillations per second.",
      "The pattern advances while the material point continues to oscillate."
    ],
    "explanation": [
      "A transverse wave has material displacement perpendicular to its direction of travel. A sinusoidal pattern can travel while each material point oscillates about its own position.",
      "Wavelength is the spatial repetition distance. Frequency counts cycles per second. In a nondispersive medium their relationship is v = fλ.",
      "This model shows an infinite travelling sinusoid through a finite viewing window. It has no fixed ends or reflections; it does not calculate tension from material properties."
    ],
    "terms": {
      "Wavelength": "Distance between points one full phase cycle apart.",
      "Frequency": "Cycles per second, measured in hertz."
    },
    "formula": "y = A sin[2π(x/λ − ft)] · v = fλ",
    "misconception": "A crest travels across the window, but the gold material point does not travel with it.",
    "activity": "Hold speed at 2 m/s. Double frequency and compare wavelength. Follow the gold point through a full cycle.",
    "steps": [
      {
        "title": "Create a disturbance",
        "text": "A material point oscillates vertically while the pattern travels horizontally."
      },
      {
        "title": "Measure wavelength",
        "text": "One wavelength separates two points in the same phase."
      },
      {
        "title": "Count frequency",
        "text": "Frequency counts complete oscillations per second."
      },
      {
        "title": "Connect speed and spacing",
        "text": "Increasing frequency at fixed wave speed reduces wavelength."
      },
      {
        "title": "Separate motion from transport",
        "text": "The pattern advances while the material point continues to oscillate."
      }
    ],
    "quiz": [
      {
        "question": "A 2 Hz wave travels at 4 m/s. Its wavelength is…",
        "options": [
          "8 m",
          "2 m",
          "0.5 m",
          "4 Hz"
        ],
        "answer": 1,
        "explanation": "λ = v/f = 4/2 = 2 m."
      },
      {
        "question": "For a transverse wave, displacement is…",
        "options": [
          "Parallel to propagation",
          "Perpendicular to propagation",
          "Always zero",
          "Only forward"
        ],
        "answer": 1,
        "explanation": "Transverse displacement is perpendicular to the wave direction."
      },
      {
        "question": "At fixed speed, increasing frequency makes wavelength…",
        "options": [
          "Longer",
          "Unchanged",
          "Shorter",
          "A time"
        ],
        "answer": 2,
        "explanation": "Wavelength equals speed divided by frequency."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/16-2-mathematics-of-waves",
    "sourceTitle": "OpenStax · Oscillations & waves",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "lens",
    "title": "Where light makes an image",
    "subject": "Physics",
    "chapter": "Optics",
    "kind": "lens",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Move an object across the focal plane and construct real and virtual images.",
    "minutes": 12,
    "color": "indigo",
    "objectives": [
      "The object stands to the left of a converging lens, beyond its focus.",
      "At the focal distance the emergent rays are parallel.",
      "A diverging lens forms an upright virtual image of this real object."
    ],
    "explanation": [
      "A converging thin lens brings paraxial rays initially parallel to its axis toward a focus. A diverging lens spreads them so they appear to originate from a virtual focus.",
      "Using the real-is-positive convention, 1/f = 1/do + 1/di. Real objects here are left of the lens. A positive image distance is real; a negative distance is virtual.",
      "Magnification is −di/do. At a converging lens’s focal distance the outgoing rays are parallel and there is no finite image. This approximation omits lens thickness, diffraction and aberration."
    ],
    "terms": {
      "Real_image": "An image at which outgoing rays actually converge.",
      "Virtual_image": "An image where backward ray extensions intersect."
    },
    "formula": "1/f = 1/dₒ + 1/dᵢ · magnification = −dᵢ/dₒ",
    "misconception": "A virtual image is not where outgoing rays physically meet. Dashed construction lines extend rays backward.",
    "activity": "Use f = 1 m. Compare object distances 3 m, 1 m and 0.5 m, then change to a diverging lens.",
    "steps": [
      {
        "title": "Place the object",
        "text": "The object stands to the left of a converging lens, beyond its focus."
      },
      {
        "title": "Trace a real image",
        "text": "The outgoing rays converge to form an inverted real image."
      },
      {
        "title": "Reach the focal plane",
        "text": "At the focal distance the emergent rays are parallel."
      },
      {
        "title": "Make a magnifier",
        "text": "Inside the focal distance, a converging lens gives an upright virtual image."
      },
      {
        "title": "Try a diverging lens",
        "text": "A diverging lens forms an upright virtual image of this real object."
      }
    ],
    "quiz": [
      {
        "question": "For f = 1 m and do = 3 m, di is…",
        "options": [
          "1.5 m",
          "3 m",
          "−1 m",
          "0 m"
        ],
        "answer": 0,
        "explanation": "1/di = 1 − 1/3 = 2/3."
      },
      {
        "question": "At do = f for a converging thin lens, outgoing rays are…",
        "options": [
          "All absorbed",
          "Parallel",
          "Stopped",
          "Focused at the centre"
        ],
        "answer": 1,
        "explanation": "The finite-image denominator is zero."
      },
      {
        "question": "A diverging lens viewing a real object gives an image that is…",
        "options": [
          "Always real and inverted",
          "Virtual and upright",
          "At infinite distance always",
          "Always the same size"
        ],
        "answer": 1,
        "explanation": "Its negative image distance and positive magnification describe a virtual upright image."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses",
    "sourceTitle": "OpenStax · Optics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "induction",
    "title": "Turn motion into voltage",
    "subject": "Physics",
    "chapter": "Electricity & magnetism",
    "kind": "induction",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Rotate a coil in a magnetic field and compare flux, induced voltage and current.",
    "minutes": 12,
    "color": "amber",
    "objectives": [
      "The coil normal begins parallel to the field, giving maximum positive flux.",
      "A half turn reverses the direction of flux through the chosen normal.",
      "More turns increase flux linkage and peak emf."
    ],
    "explanation": [
      "Magnetic flux through a flat coil turn is BA cos θ, where θ is the angle between the field and the surface normal. Rotating the coil changes the flux.",
      "Faraday’s law gives induced emf as the negative rate of change of flux linkage. A uniformly rotating coil produces a sinusoidal emf. Its sign reverses every half turn.",
      "An external drive supplies the energy. The experiment assumes a purely resistive load and ignores self-inductance and magnetic back reaction. The number of drawn windings is representative."
    ],
    "terms": {
      "Flux": "Magnetic field integrated through a surface, measured in webers.",
      "Emf": "Energy supplied per unit charge, measured in volts."
    },
    "formula": "Φ = BA cos θ · ε = −N dΦ/dt · I = ε/R",
    "misconception": "A strong steady flux does not by itself create emf. A changing flux linkage is required.",
    "activity": "Compare flux and voltage at a quarter turn. Double the turn count and compare peak voltage.",
    "steps": [
      {
        "title": "Orient the coil",
        "text": "The coil normal begins parallel to the field, giving maximum positive flux."
      },
      {
        "title": "Rotate through a quarter turn",
        "text": "As flux changes most rapidly, the magnitude of emf reaches a maximum."
      },
      {
        "title": "Reverse the sign",
        "text": "A half turn reverses the direction of flux through the chosen normal."
      },
      {
        "title": "Drive the load",
        "text": "The resistive current follows the signed induced voltage."
      },
      {
        "title": "Add more turns",
        "text": "More turns increase flux linkage and peak emf."
      }
    ],
    "quiz": [
      {
        "question": "Emf is set by the rate of change of…",
        "options": [
          "Mass",
          "Flux linkage",
          "Resistance alone",
          "Wire colour"
        ],
        "answer": 1,
        "explanation": "Faraday’s law relates emf to changing flux linkage."
      },
      {
        "question": "Doubling turns at unchanged speed and field makes peak emf…",
        "options": [
          "Half",
          "Unchanged",
          "Double",
          "Zero"
        ],
        "answer": 2,
        "explanation": "The peak is NBAω."
      },
      {
        "question": "Energy delivered to the load comes from…",
        "options": [
          "Nothing",
          "Only the magnetic field colour",
          "The external mechanical drive",
          "Charge being destroyed"
        ],
        "answer": 2,
        "explanation": "The rotating drive supplies energy."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-2/pages/13-1-faradays-law",
    "sourceTitle": "OpenStax · Electricity & magnetism",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "gas",
    "title": "A chamber full of possibilities",
    "subject": "Chemistry",
    "chapter": "States of matter",
    "kind": "gas",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Compress, heat and add an ideal gas while tracking the pressure response.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "A confined gas has linked pressure, volume, amount and temperature.",
      "Increasing absolute temperature increases pressure.",
      "The gas equation relates equilibrium states rather than simulating every collision."
    ],
    "explanation": [
      "An ideal gas obeys PV = nRT. Pressure, volume, amount and absolute temperature are linked; kelvin is essential in this equation.",
      "At fixed amount and temperature, pressure is inversely proportional to volume. At fixed amount and volume, pressure is proportional to absolute temperature.",
      "Controls impose equilibrium states; the moving piston is a volume indicator rather than a force-balanced mechanism. Slowed particle markers illustrate motion but do not calculate pressure by collisions. Real gases depart from ideal behaviour."
    ],
    "terms": {
      "Kelvin": "An absolute temperature scale used in gas equations.",
      "Mole": "The SI unit of amount of substance."
    },
    "formula": "PV = nRT · R = 8.314 J/(mol·K)",
    "misconception": "Gas-law temperature ratios use kelvin, not degrees Celsius.",
    "activity": "At fixed n and 300 K, double volume. Restore volume and double temperature to 600 K.",
    "steps": [
      {
        "title": "Confine a gas",
        "text": "A confined gas has linked pressure, volume, amount and temperature."
      },
      {
        "title": "Compress at fixed temperature",
        "text": "Reducing volume at fixed temperature increases pressure."
      },
      {
        "title": "Warm at fixed volume",
        "text": "Increasing absolute temperature increases pressure."
      },
      {
        "title": "Add gas",
        "text": "More gas in the same volume at the same temperature gives higher pressure."
      },
      {
        "title": "Recognize the idealization",
        "text": "The gas equation relates equilibrium states rather than simulating every collision."
      }
    ],
    "quiz": [
      {
        "question": "At constant amount and temperature, doubling volume makes pressure…",
        "options": [
          "Double",
          "Half",
          "Four times",
          "Unchanged"
        ],
        "answer": 1,
        "explanation": "PV is constant under these conditions."
      },
      {
        "question": "The temperature used in PV = nRT is…",
        "options": [
          "Celsius",
          "Fahrenheit",
          "Kelvin",
          "Any scale without conversion"
        ],
        "answer": 2,
        "explanation": "An absolute temperature is required."
      },
      {
        "question": "At fixed volume and temperature, doubling moles makes pressure…",
        "options": [
          "Half",
          "Zero",
          "Unchanged",
          "Double"
        ],
        "answer": 3,
        "explanation": "Pressure is proportional to amount."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law",
    "sourceTitle": "OpenStax · States of matter",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "kinetics",
    "title": "What makes a reaction faster?",
    "subject": "Chemistry",
    "chapter": "Chemical kinetics",
    "kind": "kinetics",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Explore concentration, temperature and a catalyst in a first-order reaction.",
    "minutes": 12,
    "color": "amber",
    "objectives": [
      "The vessel begins with reactant A, ready to convert into B.",
      "Higher temperature raises the Arrhenius rate constant.",
      "The half-life depends on k, not on the initial concentration for first-order kinetics."
    ],
    "explanation": [
      "This teaching reaction converts A into B one-for-one and follows first-order kinetics: concentration decays exponentially. The instantaneous rate is k[A].",
      "Temperature changes the rate constant according to an illustrative Arrhenius model. A catalyst pathway lowers the chosen activation energy while keeping the prefactor fixed.",
      "The parameters do not describe a named chemical. There is no reverse reaction or temperature feedback; particle colours sample the calculated concentrations rather than simulating molecular collisions."
    ],
    "terms": {
      "Half_life": "Time for reactant concentration to fall to half its initial value.",
      "Activation_energy": "An energy barrier associated with a reaction pathway."
    },
    "formula": "[A] = [A]₀e⁻ᵏᵗ · t½ = ln(2)/k",
    "misconception": "A catalyst changes the pathway and rate; it does not increase the reaction’s net energy release.",
    "activity": "Compare half-life at 298 K and 318 K. Then enable the catalyst at the original temperature.",
    "steps": [
      {
        "title": "Start with reactant",
        "text": "The vessel begins with reactant A, ready to convert into B."
      },
      {
        "title": "Follow exponential decay",
        "text": "The rate falls as the remaining reactant concentration falls."
      },
      {
        "title": "Increase temperature",
        "text": "Higher temperature raises the Arrhenius rate constant."
      },
      {
        "title": "Offer a catalyst pathway",
        "text": "A lower activation barrier speeds the illustrative reaction."
      },
      {
        "title": "Compare half-lives",
        "text": "The half-life depends on k, not on the initial concentration for first-order kinetics."
      }
    ],
    "quiz": [
      {
        "question": "For first-order decay the half-life is…",
        "options": [
          "ln(2)/k",
          "k/2",
          "2k",
          "Always 1 s"
        ],
        "answer": 0,
        "explanation": "Setting [A]/[A]₀ = 1/2 gives t½ = ln2/k."
      },
      {
        "question": "A catalyst speeds this model by…",
        "options": [
          "Increasing net energy release",
          "Lowering activation energy",
          "Destroying matter",
          "Removing all reactants instantly"
        ],
        "answer": 1,
        "explanation": "The model selects a lower-barrier pathway."
      },
      {
        "question": "At constant k, doubling initial concentration makes initial rate…",
        "options": [
          "Half",
          "Unchanged",
          "Double",
          "Zero"
        ],
        "answer": 2,
        "explanation": "Rate = k[A]."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/12-5-collision-theory",
    "sourceTitle": "OpenStax · Chemical kinetics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "ph",
    "title": "The logarithmic colour of chemistry",
    "subject": "Chemistry",
    "chapter": "Acids, bases & salts",
    "kind": "ph",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Dilute a strong acid or base and discover the logarithmic pH scale.",
    "minutes": 12,
    "color": "rose",
    "objectives": [
      "The initial strong acid has hydronium concentration close to its analytical concentration.",
      "Water contributes hydronium and hydroxide, which cannot be ignored near neutrality.",
      "Dilute strong base approaches neutrality from above, just as acid approaches from below."
    ],
    "explanation": [
      "In an ideal dilute solution pH is approximated by the negative base-ten logarithm of hydronium concentration. A one-unit pH change corresponds to a tenfold concentration change.",
      "At 25°C, the water ion product links hydronium and hydroxide concentrations. A neutral solution has equal concentrations and pH 7 under these conditions.",
      "The model includes water autoionization and complete dissociation of a monoprotic strong acid or base. Dilution approaches neutrality from either side. The displayed colours are illustrative rather than a specific chemical indicator."
    ],
    "terms": {
      "Hydronium": "H₃O⁺, the hydrated proton represented in aqueous acid models.",
      "pH": "A logarithmic measure approximated here using molar concentration."
    },
    "formula": "pH = −log₁₀[H₃O⁺] · [H₃O⁺][OH⁻] = 10⁻¹⁴ at 25°C",
    "misconception": "Diluting an ideal acid with pure water does not turn it into a base. Water autoionization matters near neutrality.",
    "activity": "Begin with 10⁻³ mol/L acid. Increase the dilution factor tenfold; then explore very dilute acid and base.",
    "steps": [
      {
        "title": "Read a logarithmic scale",
        "text": "The initial strong acid has hydronium concentration close to its analytical concentration."
      },
      {
        "title": "Add water",
        "text": "Dilution reduces the analytical concentration and raises an acid’s pH."
      },
      {
        "title": "Include water itself",
        "text": "Water contributes hydronium and hydroxide, which cannot be ignored near neutrality."
      },
      {
        "title": "Try a strong base",
        "text": "A strong base increases hydroxide and lowers hydronium."
      },
      {
        "title": "Compare both limits",
        "text": "Dilute strong base approaches neutrality from above, just as acid approaches from below."
      }
    ],
    "quiz": [
      {
        "question": "At 25°C, ideal neutral water has pH…",
        "options": [
          "0",
          "7",
          "14",
          "1"
        ],
        "answer": 1,
        "explanation": "Hydronium and hydroxide are both 10⁻⁷ mol/L."
      },
      {
        "question": "Changing pH from 3 to 4 makes hydronium concentration…",
        "options": [
          "Ten times larger",
          "Unchanged",
          "Ten times smaller",
          "Zero"
        ],
        "answer": 2,
        "explanation": "The scale is logarithmic."
      },
      {
        "question": "Pure-water dilution of a strong acid approaches pH 7…",
        "options": [
          "From below",
          "From above",
          "By jumping to 14",
          "Only after becoming basic"
        ],
        "answer": 0,
        "explanation": "Including autoionization prevents crossing neutrality."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/14-2-ph-and-poh",
    "sourceTitle": "OpenStax · Acids, bases & salts",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "diffusion",
    "title": "Across a living membrane",
    "subject": "Biology",
    "chapter": "Cell transport",
    "kind": "diffusion",
    "grades": [
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Reverse a concentration gradient and follow passive solute exchange.",
    "minutes": 12,
    "color": "mint",
    "objectives": [
      "The left compartment begins with a higher solute concentration.",
      "As the concentration difference falls, the net transfer rate falls.",
      "Reversing the initial concentration difference reverses net transfer."
    ],
    "explanation": [
      "Random molecular motion can produce net transport from a region of higher concentration to one of lower concentration. Passive diffusion requires no direct ATP-driven pump.",
      "This model joins two equal-volume, well-mixed compartments through a membrane permeable to a neutral solute. The concentration difference decays exponentially while the sum remains constant.",
      "At equilibrium the two concentrations are equal and net transfer is zero, but molecular movement continues. This model does not include water movement, osmosis, charged solutes or active transport."
    ],
    "terms": {
      "Gradient": "A change in concentration across space.",
      "Dynamic_equilibrium": "Equal opposing average transfers despite continuing microscopic movement."
    },
    "formula": "dCL/dt = −k(CL−CR) · CL + CR = constant",
    "misconception": "Equilibrium does not mean that every molecule stops moving.",
    "activity": "Run a 10-to-0 gradient to equilibrium. Reverse the initial concentrations and compare the sign of net transfer.",
    "steps": [
      {
        "title": "Create a gradient",
        "text": "The left compartment begins with a higher solute concentration."
      },
      {
        "title": "Cross the membrane",
        "text": "Net solute transfer goes from higher toward lower concentration."
      },
      {
        "title": "Reduce the difference",
        "text": "As the concentration difference falls, the net transfer rate falls."
      },
      {
        "title": "Reach dynamic equilibrium",
        "text": "Both compartments approach equal concentrations."
      },
      {
        "title": "Reverse the gradient",
        "text": "Reversing the initial concentration difference reverses net transfer."
      }
    ],
    "quiz": [
      {
        "question": "Net passive diffusion goes initially…",
        "options": [
          "Low to high concentration",
          "High to low concentration",
          "Only upward",
          "Only left to right"
        ],
        "answer": 1,
        "explanation": "A concentration difference drives net movement down the gradient."
      },
      {
        "question": "At dynamic equilibrium…",
        "options": [
          "All movement stops",
          "Net transfer is zero while molecules still move",
          "Solute vanishes",
          "ATP is always required"
        ],
        "answer": 1,
        "explanation": "Opposing transfers balance on average."
      },
      {
        "question": "Equal compartments initially at 10 and 0 mmol/L approach…",
        "options": [
          "10 and 10",
          "0 and 0",
          "5 and 5",
          "20 and 0"
        ],
        "answer": 2,
        "explanation": "Total solute is conserved and volumes are equal."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/5-2-passive-transport",
    "sourceTitle": "OpenStax · Cell transport",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "mitosis",
    "title": "One cell, two complete stories",
    "subject": "Biology",
    "chapter": "Cell division",
    "kind": "mitosis",
    "grades": [
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Follow replicated chromosomes through alignment, separation and daughter-cell formation.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Four replicated chromosomes become visible in this conceptual animal cell.",
      "Sister chromatids separate and become daughter chromosomes.",
      "Cytokinesis partitions the cytoplasm, producing two daughter cells."
    ],
    "explanation": [
      "DNA replication precedes mitosis. The model begins with four replicated chromosomes, each containing two sister chromatids, in a cell with 2n = 4.",
      "Chromosomes condense and align. Sister chromatids separate during anaphase; each becomes a chromosome. Two nuclei re-form, and animal-cell cytokinesis partitions the cytoplasm.",
      "Each daughter receives four chromosomes. The transient whole-cell count after sister separation is eight before partition. Stage timing is conceptual, not a measured cellular simulation; chromosome replication is not replayed during mitosis."
    ],
    "terms": {
      "Sister_chromatids": "Replicated copies of a chromosome joined before separation.",
      "Cytokinesis": "Partition of cytoplasm into daughter cells."
    },
    "formula": "Model: 2n = 4 → two daughter cells, each 2n = 4",
    "misconception": "DNA replication occurs before mitosis, not again at every mitotic stage. Mitosis preserves chromosome number in each daughter.",
    "activity": "Scrub from metaphase to anaphase. Count the replicated chromosomes, then the separated daughter chromosomes.",
    "steps": [
      {
        "title": "Condense replicated chromosomes",
        "text": "Four replicated chromosomes become visible in this conceptual animal cell."
      },
      {
        "title": "Align at the equator",
        "text": "Replicated chromosomes align at the spindle equator."
      },
      {
        "title": "Separate sisters",
        "text": "Sister chromatids separate and become daughter chromosomes."
      },
      {
        "title": "Re-form nuclei",
        "text": "Chromosomes arrive at opposite poles and nuclei re-form."
      },
      {
        "title": "Divide the cell",
        "text": "Cytokinesis partitions the cytoplasm, producing two daughter cells."
      }
    ],
    "quiz": [
      {
        "question": "DNA replication occurs mainly…",
        "options": [
          "Before mitosis in S phase",
          "Only during anaphase",
          "After every spindle movement",
          "Never"
        ],
        "answer": 0,
        "explanation": "S phase precedes mitosis."
      },
      {
        "question": "Sister chromatids separate during…",
        "options": [
          "Metaphase",
          "Anaphase",
          "S phase",
          "Interphase only"
        ],
        "answer": 1,
        "explanation": "They become daughter chromosomes when they separate."
      },
      {
        "question": "A 2n = 4 cell undergoing ordinary mitosis gives daughters with…",
        "options": [
          "2 chromosomes each",
          "8 chromosomes each",
          "4 chromosomes each",
          "No chromosomes"
        ],
        "answer": 2,
        "explanation": "Mitosis preserves the chromosome number per daughter."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle",
    "sourceTitle": "OpenStax · Cell division",
    "review": "Editorial draft · expert review pending"
  }
];
