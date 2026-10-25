import type{Lesson}from'./lessons';
export const expansionLessons:Lesson[]=[
  {
    "id": "projectile",
    "title": "One launch, two motions",
    "subject": "Physics",
    "chapter": "Mechanics",
    "kind": "projectile",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Launch a projectile and connect horizontal motion, vertical acceleration and the landing range.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Resolve a launch velocity into perpendicular components.",
      "Predict range and peak height for level vacuum trajectories.",
      "Explain why horizontal speed is nonzero at the apex."
    ],
    "explanation": [
      "Projectile motion combines horizontal motion with vertical acceleration. In this ideal model gravity acts downward and there is no air resistance, so horizontal velocity stays constant before landing.",
      "Vertical velocity decreases on the way up, becomes zero at the apex, and points downward on the way down. The highest point is not a point of zero total velocity.",
      "For equal launch and landing heights, flight duration and range follow constant-acceleration equations. Complementary launch angles have equal ranges at fixed speed and gravity; 45° gives the maximum range under these assumptions."
    ],
    "terms": {
      "Range": "Horizontal distance from launch to the first level landing.",
      "Apex": "The highest point of a trajectory."
    },
    "formula": "R = v₀² sin(2θ)/g · T = 2v₀ sinθ/g",
    "misconception": "At the highest point vertical velocity is zero, but horizontal velocity is not.",
    "activity": "Compare launches at 30° and 60°. Record range, peak height and flight duration, then try another gravity.",
    "steps": [
      {
        "title": "Resolve the launch",
        "text": "The launch velocity has horizontal and vertical components."
      },
      {
        "title": "Rise toward the apex",
        "text": "Gravity reduces upward velocity while horizontal velocity remains constant."
      },
      {
        "title": "Cross the highest point",
        "text": "At the apex vertical velocity is zero while horizontal velocity continues."
      },
      {
        "title": "Return to launch height",
        "text": "The projectile descends and returns to its launch height."
      },
      {
        "title": "Compare launch angles",
        "text": "Complementary angles have equal ranges for level landing in vacuum."
      }
    ],
    "quiz": [
      {
        "question": "At the apex, which quantity is zero?",
        "options": [
          "Horizontal velocity",
          "Vertical velocity",
          "Gravitational acceleration",
          "Total velocity always"
        ],
        "answer": 1,
        "explanation": "Only the vertical velocity component is momentarily zero."
      },
      {
        "question": "With no air resistance, horizontal velocity before landing is…",
        "options": [
          "Constant",
          "Always increasing",
          "Always zero",
          "Equal to gravity"
        ],
        "answer": 0,
        "explanation": "There is no horizontal acceleration."
      },
      {
        "question": "At fixed speed and level landing, complementary angles have…",
        "options": [
          "Equal heights",
          "Equal flight times",
          "Equal ranges",
          "No landing"
        ],
        "answer": 2,
        "explanation": "sin(2θ) has the same value for complementary angles."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion",
    "sourceTitle": "OpenStax · Mechanics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "mirrors",
    "title": "The other side of a reflection",
    "subject": "Physics",
    "chapter": "Optics",
    "kind": "mirrors",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Compare concave and convex mirrors and locate real and virtual reflected images.",
    "minutes": 12,
    "color": "indigo",
    "objectives": [
      "Use the real-is-positive mirror convention.",
      "Distinguish image location from physical ray travel.",
      "Recognize the focal-plane limit."
    ],
    "explanation": [
      "A concave spherical mirror has its reflecting surface on the inside of a curved surface. A convex mirror reflects from the outside. Paraxial rays let us use a simple mirror equation.",
      "Under the convention used here, a real object has positive distance. Concave focal length is positive; convex focal length is negative. A positive image distance places a real image in front of the mirror.",
      "Inside a concave mirror’s focal distance, backward extensions of reflected rays meet behind the mirror, producing an upright virtual image. A convex mirror gives an upright reduced virtual image of a real object. At the concave focal plane there is no finite image."
    ],
    "terms": {
      "Paraxial": "Near the optical axis, where small-angle mirror formulas apply.",
      "Magnification": "Signed image height divided by object height."
    },
    "formula": "1/f = 1/dₒ + 1/dᵢ · m = −dᵢ/dₒ",
    "misconception": "A real reflected image is in front of a mirror, unlike a real image behind a converging lens.",
    "activity": "Set f=1 m. Compare object distances 3 m, 1 m and 0.5 m. Change to a convex mirror and inspect backward extensions.",
    "steps": [
      {
        "title": "Meet a concave mirror",
        "text": "A concave mirror has a real focus in front of the reflecting surface."
      },
      {
        "title": "Locate a real image",
        "text": "Beyond the focal distance, reflected rays can meet in front of the mirror."
      },
      {
        "title": "Reach the focal plane",
        "text": "An object at the focus gives parallel reflected rays."
      },
      {
        "title": "Move inside the focus",
        "text": "Inside the focus, backward extensions give an upright virtual image."
      },
      {
        "title": "Try a convex surface",
        "text": "A convex mirror gives a reduced upright virtual image of this real object."
      }
    ],
    "quiz": [
      {
        "question": "Positive image distance for this mirror convention means…",
        "options": [
          "Behind and virtual",
          "In front and real",
          "Inside the glass always",
          "No image"
        ],
        "answer": 1,
        "explanation": "Real reflected rays converge in front of the mirror."
      },
      {
        "question": "A convex mirror viewing a real object gives…",
        "options": [
          "An upright virtual image",
          "Always a real inverted image",
          "No reflection",
          "An image at infinity always"
        ],
        "answer": 0,
        "explanation": "The image distance is negative and magnification positive."
      },
      {
        "question": "At do=f for a concave mirror the reflected rays are…",
        "options": [
          "Stopped",
          "Parallel",
          "All absorbed",
          "Focused at the vertex"
        ],
        "answer": 1,
        "explanation": "There is no finite-image solution in the paraxial equation."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-3/pages/2-2-spherical-mirrors",
    "sourceTitle": "OpenStax · Optics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "bernoulli",
    "title": "When a narrow passage speeds things up",
    "subject": "Physics",
    "chapter": "Fluids",
    "kind": "bernoulli",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Send water through a constriction and compare flow speed with static pressure.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Apply continuity to a changing cross-section.",
      "Compare static pressure and kinetic-energy density.",
      "State the ideal-flow assumptions."
    ],
    "explanation": [
      "For steady incompressible flow, the same volume of fluid crosses every section per second. A smaller cross-sectional area therefore requires a greater average speed.",
      "In a horizontal inviscid flow, Bernoulli’s equation conserves static pressure plus kinetic-energy density along a streamline. Faster flow through a constriction has lower static pressure in this model.",
      "The experiment imposes flow and inlet absolute pressure. The pressure columns use a vacuum reference and compressed heights; they are not open-to-atmosphere laboratory manometers. Real viscosity, losses and cavitation are omitted."
    ],
    "terms": {
      "Volume_flow": "Volume crossing a section per time, in m³/s or L/s.",
      "Pressure_head": "Pressure divided by fluid density and gravitational acceleration."
    },
    "formula": "Q = Av · P₁ + ½ρv₁² = P₂ + ½ρv₂²",
    "misconception": "Lower static pressure at the throat does not mean the fluid loses total mechanical energy in this ideal model.",
    "activity": "Keep flow fixed. Reduce throat radius and compare speed, pressure and pressure-head indicators.",
    "steps": [
      {
        "title": "Set a steady flow",
        "text": "The same volume flow passes through the inlet and the throat."
      },
      {
        "title": "Narrow the passage",
        "text": "A smaller throat area requires higher average speed."
      },
      {
        "title": "Compare pressure",
        "text": "In horizontal ideal flow, higher speed accompanies lower static pressure."
      },
      {
        "title": "Balance the energy terms",
        "text": "The pressure decrease balances the increase in kinetic-energy density."
      },
      {
        "title": "Widen the throat again",
        "text": "A wider throat brings its speed and pressure closer to the inlet values."
      }
    ],
    "quiz": [
      {
        "question": "At fixed Q, halving pipe area makes average speed…",
        "options": [
          "Half",
          "Double",
          "Unchanged",
          "Zero"
        ],
        "answer": 1,
        "explanation": "Q=Av, so speed is inversely proportional to area."
      },
      {
        "question": "In this horizontal ideal constriction, higher speed gives…",
        "options": [
          "Lower static pressure",
          "Higher static pressure always",
          "No pressure",
          "Negative mass"
        ],
        "answer": 0,
        "explanation": "The increase in kinetic-energy density offsets a pressure decrease."
      },
      {
        "question": "Bernoulli’s simple form here omits…",
        "options": [
          "Fluid density",
          "Flow speed",
          "Viscous losses",
          "Static pressure"
        ],
        "answer": 2,
        "explanation": "It assumes steady incompressible inviscid flow."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation",
    "sourceTitle": "OpenStax · Fluids",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "capacitor",
    "title": "Energy between two plates",
    "subject": "Physics",
    "chapter": "Electricity & magnetism",
    "kind": "capacitor",
    "grades": [
      10,
      11,
      12
    ],
    "description": "Charge and discharge a capacitor through a resistor, then measure the time constant.",
    "minutes": 12,
    "color": "amber",
    "objectives": [
      "Relate RC to an exponential time constant.",
      "Compare current and capacitor voltage during charging.",
      "Distinguish stored field energy from charge crossing a dielectric."
    ],
    "explanation": [
      "A capacitor stores separated charge and electric-field energy. In an ideal capacitor charges do not cross the insulating gap between the plates.",
      "In a series RC charging circuit, current begins at V/R and falls as capacitor voltage rises. The time constant τ=RC sets the exponential response: after one τ, charging reaches about 63.2% of the final voltage.",
      "Discharge starts from a fully charged capacitor with the source disconnected. Voltage and current magnitude decay exponentially, with signed current opposite to charging. Real leakage and parasitic circuit elements are excluded."
    ],
    "terms": {
      "Capacitance": "Charge per voltage, measured in farads.",
      "Time_constant": "The RC timescale of exponential charging or discharging."
    },
    "formula": "τ = RC · Vc(charge)=V₀(1−e⁻ᵗ/τ) · E=½CVc²",
    "misconception": "A charging capacitor does not immediately reach the source voltage, and charge does not cross its ideal dielectric.",
    "activity": "Set R=10 kΩ and C=100 µF. Seek to 1 s, compare charging and discharging fractions, then double resistance.",
    "steps": [
      {
        "title": "Start with empty plates",
        "text": "An initially uncharged capacitor has zero voltage across its plates."
      },
      {
        "title": "Build separated charge",
        "text": "As capacitor voltage rises, the voltage driving resistor current falls."
      },
      {
        "title": "Measure one RC time",
        "text": "At one time constant, charging reaches about 63.2% of the source voltage."
      },
      {
        "title": "Disconnect and discharge",
        "text": "A fully charged capacitor releases stored energy through the resistor when the source is disconnected."
      },
      {
        "title": "Wait five time constants",
        "text": "After five time constants an ideal discharge retains less than one percent of its initial voltage."
      }
    ],
    "quiz": [
      {
        "question": "10 kΩ multiplied by 100 µF gives τ of…",
        "options": [
          "1000 s",
          "1 s",
          "0.001 s",
          "10 s"
        ],
        "answer": 1,
        "explanation": "10,000 Ω × 100×10⁻⁶ F = 1 s."
      },
      {
        "question": "After one τ, charging voltage is about…",
        "options": [
          "100%",
          "36.8%",
          "63.2%",
          "0%"
        ],
        "answer": 2,
        "explanation": "1−e⁻¹ is about 0.632."
      },
      {
        "question": "An ideal capacitor dielectric allows…",
        "options": [
          "No charge crossing between plates",
          "A steady metallic current through the gap",
          "Charge destruction",
          "Only positive charges crossing"
        ],
        "answer": 0,
        "explanation": "Charge separates on plates without crossing the ideal insulator."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-2/pages/10-5-rc-circuits",
    "sourceTitle": "OpenStax · Electricity & magnetism",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "covalent",
    "title": "The shape of a shared pair",
    "subject": "Chemistry",
    "chapter": "Chemical bonding",
    "kind": "covalent",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Rotate water, ammonia and methane to connect bonding, lone pairs and molecular geometry.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Identify shared and nonbonding electron pairs.",
      "Compare bent, pyramidal and tetrahedral molecular shapes.",
      "Recognize the limits of ball-and-stick representations."
    ],
    "explanation": [
      "A single covalent bond is represented by a shared electron pair. Ball-and-stick models display atomic arrangement and connectivity, not literal electron paths or measured electron-density surfaces.",
      "Water, ammonia and methane each have four electron domains around the central atom in a simple VSEPR description. Water has two bonding pairs and two lone pairs; ammonia has three and one; methane has four bonding pairs.",
      "Their molecular shapes are bent, trigonal pyramidal and tetrahedral respectively. The viewer uses approximate characteristic angles and lengths. An imposed equal bond stretch has an illustrative harmonic energy, not a quantum-mechanical prediction."
    ],
    "terms": {
      "Lone_pair": "A nonbonding electron pair associated with an atom.",
      "VSEPR": "A model relating electron-domain arrangement to molecular shape."
    },
    "formula": "Illustrative stretch energy = bonds × ½k(Δr)² · k=500 N/m",
    "misconception": "A tetrahedral electron-domain arrangement does not make every molecule’s atomic shape tetrahedral.",
    "activity": "Compare all three molecules in 3D. Toggle pair markers and impose the same positive and negative bond stretch.",
    "steps": [
      {
        "title": "Share an electron pair",
        "text": "A single bond is represented by a shared pair of electrons."
      },
      {
        "title": "Bend water",
        "text": "Water has two bonds and two lone pairs around oxygen."
      },
      {
        "title": "Build a pyramid",
        "text": "Ammonia has three bonds and one lone pair around nitrogen."
      },
      {
        "title": "Make a tetrahedron",
        "text": "Methane has four C–H bonds arranged tetrahedrally."
      },
      {
        "title": "Stretch without a solver",
        "text": "Imposed equal bond stretch raises an illustrative harmonic energy for either extension or compression."
      }
    ],
    "quiz": [
      {
        "question": "Water’s molecular geometry is…",
        "options": [
          "Linear",
          "Bent",
          "Tetrahedral atomic geometry",
          "Square planar"
        ],
        "answer": 1,
        "explanation": "Its two bonds and two lone pairs give a bent atomic geometry."
      },
      {
        "question": "Ammonia has how many lone pairs on nitrogen?",
        "options": [
          "0",
          "1",
          "2",
          "4"
        ],
        "answer": 1,
        "explanation": "Three bonding pairs and one lone pair form four electron domains."
      },
      {
        "question": "A ball-and-stick model shows…",
        "options": [
          "Exact electron trajectories",
          "Literal solid bonds",
          "A representation of atomic arrangement",
          "A full quantum solution"
        ],
        "answer": 2,
        "explanation": "It is a spatial structural representation."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/7-6-molecular-structure-and-polarity",
    "sourceTitle": "OpenStax · Chemical bonding",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "chromatography",
    "title": "Separate a hidden mixture",
    "subject": "Chemistry",
    "chapter": "Separation methods",
    "kind": "chromatography",
    "grades": [
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Develop two bands along a stationary phase and measure their retardation factors.",
    "minutes": 12,
    "color": "rose",
    "objectives": [
      "Measure band and solvent distances from the same origin.",
      "Calculate planar retardation factors.",
      "Explain why equal Rf values prevent spatial separation here."
    ],
    "explanation": [
      "Chromatography separates components through differing interactions with moving and stationary phases. In planar development a solvent front travels along a sheet or plate and components migrate by different amounts.",
      "The planar retardation factor Rf is the band-centre distance from the origin divided by the solvent-front distance from that same origin. It is dimensionless and specific to the experimental conditions.",
      "This model prescribes two Rf values and an illustrative Gaussian width. It demonstrates measurement and overlap, not prediction from solvent identity or molecular chemistry. The origin is kept above the solvent pool."
    ],
    "terms": {
      "Stationary_phase": "The phase fixed in place during separation.",
      "Rf": "Band-centre travel divided by solvent-front travel in planar chromatography."
    },
    "formula": "Rf = distance travelled by band centre / distance travelled by solvent front",
    "misconception": "Rf is not measured from the bottom of the container, and it is not a universal constant independent of solvent and phase.",
    "activity": "Run bands with Rf 0.30 and 0.70. Measure both at a 10 cm solvent front. Repeat with equal Rf values.",
    "steps": [
      {
        "title": "Mark the origin",
        "text": "The sample begins on an origin line above the solvent pool."
      },
      {
        "title": "Move the solvent front",
        "text": "The model advances a solvent front up the stationary phase."
      },
      {
        "title": "Separate the components",
        "text": "Different chosen Rf values produce different band-centre speeds."
      },
      {
        "title": "Measure a ratio",
        "text": "Divide each band-centre distance by the solvent-front distance."
      },
      {
        "title": "Inspect the final development",
        "text": "The run ends at a 10 cm front; band distances remain fixed afterward."
      }
    ],
    "quiz": [
      {
        "question": "A band moves 3 cm and the front 10 cm. Rf is…",
        "options": [
          "3.3 cm",
          "0.30",
          "30 cm",
          "10/3"
        ],
        "answer": 1,
        "explanation": "Rf=3/10, with no units."
      },
      {
        "question": "Distances for Rf begin at…",
        "options": [
          "Container bottom",
          "Origin line",
          "Top edge",
          "Solvent surface only"
        ],
        "answer": 1,
        "explanation": "Both band and front distances use the same origin."
      },
      {
        "question": "Equal chosen Rf values give…",
        "options": [
          "Coincident band centres",
          "Opposite travel directions",
          "Zero solvent speed",
          "Automatic perfect separation"
        ],
        "answer": 0,
        "explanation": "Both centres track the same fraction of front travel."
      }
    ],
    "source": "https://goldbook.iupac.org/terms/view/R05353",
    "sourceTitle": "IUPAC · Planar retardation factor",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "equilibrium",
    "title": "A balance that keeps moving",
    "subject": "Chemistry",
    "chapter": "Chemical equilibrium",
    "kind": "equilibrium",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Watch forward and reverse reactions approach equal rates without requiring equal amounts.",
    "minutes": 12,
    "color": "amber",
    "objectives": [
      "Compare concentration with reaction rate.",
      "Explain dynamic equilibrium.",
      "Predict the final ratio of a reversible first-order pair."
    ],
    "explanation": [
      "In the model reaction A⇌B, A converts to B while B can convert back to A. The rates are kf[A] and kr[B], with a conserved total concentration.",
      "At dynamic equilibrium the two rates match. The equilibrium concentration ratio [B]/[A] is kf/kr, so concentrations need not be equal. Molecular transformations continue in both directions.",
      "An exact exponential solution approaches equilibrium from a chosen initial B fraction. Each control change restarts a new closed run rather than adding matter mid-run. This is a first-order pair, not a general chemical-equilibrium solver."
    ],
    "terms": {
      "Dynamic_equilibrium": "Equal opposing rates with continuing microscopic change.",
      "Rate_constant": "A proportionality factor linking concentration to reaction rate."
    },
    "formula": "[B]eq/[A]eq = kf/kr · [A]+[B]=constant",
    "misconception": "Equal forward and reverse rates do not require equal concentrations.",
    "activity": "Use kf=0.12 and kr=0.06 s⁻¹. Compare runs starting with all A and all B; check the same final ratio.",
    "steps": [
      {
        "title": "Begin with A",
        "text": "Starting with A only gives a forward rate and initially zero reverse rate."
      },
      {
        "title": "Build the reverse rate",
        "text": "As B accumulates, its reverse conversion rate rises."
      },
      {
        "title": "Match the opposing rates",
        "text": "The system approaches equal forward and reverse rates."
      },
      {
        "title": "Approach from B instead",
        "text": "Starting with B only approaches the same final ratio at fixed constants and total."
      },
      {
        "title": "Keep reactions moving",
        "text": "At equilibrium the composition is steady while both conversions continue."
      }
    ],
    "quiz": [
      {
        "question": "At equilibrium the forward and reverse rates are…",
        "options": [
          "Both always zero",
          "Equal",
          "Unrelated",
          "Always equal to concentration"
        ],
        "answer": 1,
        "explanation": "Their equality makes the net concentration change zero."
      },
      {
        "question": "If kf/kr=2, equilibrium B/A is…",
        "options": [
          "0.5",
          "1",
          "2",
          "0"
        ],
        "answer": 2,
        "explanation": "For this first-order pair, kf[A]=kr[B]."
      },
      {
        "question": "A closed A⇌B run conserves…",
        "options": [
          "A only",
          "B only",
          "A plus B",
          "Neither species total"
        ],
        "answer": 2,
        "explanation": "The model converts A and B one-for-one."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/13-3-shifting-equilibria-le-chateliers-principle",
    "sourceTitle": "OpenStax · Chemical equilibrium",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "enzyme",
    "title": "Inside an enzyme’s working curve",
    "subject": "Biology",
    "chapter": "Biochemistry",
    "kind": "enzyme",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Explore substrate saturation and competitive inhibition through initial reaction rates.",
    "minutes": 12,
    "color": "mint",
    "objectives": [
      "Interpret an enzyme saturation curve.",
      "Predict competitive-inhibitor effects on apparent Km.",
      "Distinguish initial rate from substrate depletion."
    ],
    "explanation": [
      "Enzymes accelerate reactions through catalytic pathways and interactions at active sites. A simplified initial-rate model can relate reaction speed to substrate concentration.",
      "Michaelis–Menten kinetics gives a saturating rate: v=Vmax[S]/(Km+[S]). At substrate concentration Km, the uninhibited initial rate is half Vmax.",
      "Ideal competitive inhibition raises apparent Km by a factor 1+[I]/Ki without changing Vmax. The viewer compares initial-rate curves at imposed concentrations; it does not calculate depletion or a time course."
    ],
    "terms": {
      "Vmax": "The limiting initial rate at high substrate in this model.",
      "Km": "Substrate concentration giving half Vmax without inhibitor."
    },
    "formula": "v = Vmax[S] / (Km(1+[I]/Ki)+[S])",
    "misconception": "A competitive inhibitor does not lower Vmax in this ideal model; sufficiently high substrate can approach the same limit.",
    "activity": "Set substrate equal to Km without inhibitor. Add inhibitor and compare apparent Km and initial rate, then raise substrate.",
    "steps": [
      {
        "title": "Meet an active site",
        "text": "An enzyme binds a suitable substrate at its active site."
      },
      {
        "title": "Reach half the maximum rate",
        "text": "At substrate equal to Km without inhibitor, initial rate is half Vmax."
      },
      {
        "title": "Approach saturation",
        "text": "Increasing substrate gives progressively smaller rate increases as saturation is approached."
      },
      {
        "title": "Add a competitor",
        "text": "An ideal competitive inhibitor increases apparent Km without changing Vmax."
      },
      {
        "title": "Compare at high substrate",
        "text": "Higher substrate can partly overcome ideal competitive inhibition."
      }
    ],
    "quiz": [
      {
        "question": "At [S]=Km without inhibitor, v is…",
        "options": [
          "Vmax",
          "Half Vmax",
          "Zero",
          "Twice Vmax"
        ],
        "answer": 1,
        "explanation": "Substituting [S]=Km gives Vmax/2."
      },
      {
        "question": "Ideal competitive inhibition changes…",
        "options": [
          "Vmax only",
          "Neither quantity",
          "Apparent Km, while Vmax stays fixed",
          "The meaning of seconds"
        ],
        "answer": 2,
        "explanation": "It increases the substrate required to approach the same limiting rate."
      },
      {
        "question": "The graph’s horizontal axis represents…",
        "options": [
          "Elapsed time",
          "Substrate concentration",
          "Offspring count",
          "Voltage"
        ],
        "answer": 1,
        "explanation": "The experiment compares initial rates at different substrate concentrations."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/6-5-enzymes",
    "sourceTitle": "OpenStax · Biochemistry",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "genetics",
    "title": "The probability garden",
    "subject": "Biology",
    "chapter": "Genetics",
    "kind": "genetics",
    "grades": [
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Cross parental allele pairs and uncover genotype and phenotype probabilities.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Construct a monohybrid Punnett square.",
      "Distinguish genotype from dominant phenotype.",
      "Interpret probabilities without treating them as family quotas."
    ],
    "explanation": [
      "At one autosomal locus, a diploid parent carries two alleles. In this model an Aa parent contributes A or a to a gamete with equal probability. A homozygous parent contributes the same allele to every gamete.",
      "A Punnett square combines the possible gametes of two parents. Four equally likely cells describe allele-pairing probabilities, which can be grouped into AA, Aa and aa genotypes.",
      "With complete dominance, AA and Aa share the dominant phenotype, while aa has the recessive phenotype. The model excludes linkage, mutation, penetrance and sex linkage. A small family need not match the expected ratio exactly."
    ],
    "terms": {
      "Genotype": "The allele combination at the chosen locus.",
      "Phenotype": "An expressed trait; model AA and Aa share a dominant phenotype."
    },
    "formula": "Aa × Aa → ¼ AA + ½ Aa + ¼ aa",
    "misconception": "Dominant does not mean more common, better or guaranteed in every offspring.",
    "activity": "Compare Aa×Aa with Aa×aa. Explain why the four square cells are possible pairings rather than four required offspring.",
    "steps": [
      {
        "title": "Read parental genotypes",
        "text": "Each parent contributes one allele through a gamete."
      },
      {
        "title": "List the gametes",
        "text": "An Aa parent supplies A or a with equal probability in this model."
      },
      {
        "title": "Combine allele pairs",
        "text": "The four Punnett cells are equally likely independent gamete pairings."
      },
      {
        "title": "Group the phenotypes",
        "text": "Under complete dominance, AA and Aa share the dominant phenotype."
      },
      {
        "title": "Try a test cross",
        "text": "An Aa×aa test cross gives half Aa and half aa in expectation."
      }
    ],
    "quiz": [
      {
        "question": "Aa×Aa gives aa probability of…",
        "options": [
          "0%",
          "25%",
          "50%",
          "100%"
        ],
        "answer": 1,
        "explanation": "One of four equally likely pairings is aa."
      },
      {
        "question": "Under complete dominance, the dominant phenotype occurs in…",
        "options": [
          "AA and Aa",
          "aa only",
          "Aa only",
          "Every genotype always"
        ],
        "answer": 0,
        "explanation": "A is sufficient in this model."
      },
      {
        "question": "A Punnett square predicts…",
        "options": [
          "An exact four-child family",
          "Probabilities of pairings",
          "Which allele is biologically best",
          "All complex traits"
        ],
        "answer": 1,
        "explanation": "It gives probabilities under stated genetic assumptions."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits",
    "sourceTitle": "OpenStax · Genetics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "neuron",
    "title": "A signal along the axon",
    "subject": "Biology",
    "chapter": "Nervous system",
    "kind": "neuron",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Follow a slowed membrane-voltage pulse and probe its delay along an axon.",
    "minutes": 12,
    "color": "rose",
    "objectives": [
      "Read resting, depolarizing and repolarizing potentials.",
      "Relate conduction distance to signal delay.",
      "Distinguish an action-potential template from a channel-kinetics model."
    ],
    "explanation": [
      "A neuron’s membrane potential changes during an action potential. Depolarization is followed by repolarization and, often, a short undershoot before return to rest.",
      "This viewer prescribes a voltage waveform that propagates with a chosen conduction speed. A probe farther along the axon reads the same template later: delay equals distance divided by speed.",
      "The single-stimulus model has a stated illustrative threshold and an all-or-none waveform above it. It does not solve ion-channel currents, repeated firing or synaptic transmission. The experiment at 1× is slowed a thousandfold. Guided chapters stage time separately; physical time is labelled in milliseconds."
    ],
    "terms": {
      "Membrane_potential": "Electrical potential difference across a cell membrane.",
      "Refractory_period": "A period after firing with altered excitability; shown conceptually here."
    },
    "formula": "Delay (ms) = distance (mm) / speed (m/s)",
    "misconception": "The travelling signal is a pattern of membrane-potential changes, not one electron travelling from the beginning to the end of the axon.",
    "activity": "Place the probe at 50 mm and speed at 10 m/s. Look for a 5 ms arrival delay, then move it to 100 mm.",
    "steps": [
      {
        "title": "Begin at rest",
        "text": "Before the pulse arrives, the model membrane rests at −70 mV."
      },
      {
        "title": "Cross the teaching threshold",
        "text": "A stimulus above the chosen threshold triggers the prescribed pulse."
      },
      {
        "title": "Read depolarization",
        "text": "At the probe, the potential rises toward a +30 mV peak."
      },
      {
        "title": "Recover behind the pulse",
        "text": "Repolarization and a brief undershoot follow the voltage peak."
      },
      {
        "title": "Test a weaker stimulus",
        "text": "A subthreshold stimulus leaves the membrane at its resting potential in this simplified model."
      }
    ],
    "quiz": [
      {
        "question": "At 50 mm and 10 m/s, signal delay is…",
        "options": [
          "5 ms",
          "5 s",
          "500 ms",
          "0 ms"
        ],
        "answer": 0,
        "explanation": "1 mm divided by 1 m/s equals 1 ms."
      },
      {
        "question": "Above threshold, this model’s pulse amplitude…",
        "options": [
          "Always doubles",
          "Stays fixed",
          "Becomes negative infinity",
          "Predicts a patient response"
        ],
        "answer": 1,
        "explanation": "It uses an all-or-none prescribed template."
      },
      {
        "question": "The propagating pattern represents…",
        "options": [
          "One electron crossing the whole axon",
          "Local membrane-potential changes",
          "Blood flow",
          "A full ion-channel solver"
        ],
        "answer": 1,
        "explanation": "Neighbouring membrane regions change potential at delayed times."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/35-2-how-neurons-communicate",
    "sourceTitle": "OpenStax · Nervous system",
    "review": "Editorial draft · expert review pending"
  }
];
