import type{Chapter}from'./stories';import type{ExpansionKind,Parameters}from'./types';
export const expansionStories:Record<ExpansionKind,Chapter[]>={
  "projectile": [
    {
      "title": "Resolve the launch",
      "focus": "Velocity components",
      "caption": "The launch velocity has horizontal and vertical components.",
      "detail": "Cyan and rose arrows show those components.",
      "observe": "Cyan and rose arrows show those components.",
      "question": "Which force acts during vacuum flight?",
      "answer": "Gravity, downward.",
      "duration": 21
    },
    {
      "title": "Rise toward the apex",
      "focus": "Projectile",
      "caption": "Gravity reduces upward velocity while horizontal velocity remains constant.",
      "detail": "The trajectory curves because only one component accelerates.",
      "observe": "The trajectory curves because only one component accelerates.",
      "question": "Does horizontal velocity fall with vertical velocity?",
      "answer": "No, not without horizontal force.",
      "duration": 23
    },
    {
      "title": "Cross the highest point",
      "focus": "Velocity components",
      "caption": "At the apex vertical velocity is zero while horizontal velocity continues.",
      "detail": "The projectile is still moving and accelerating.",
      "observe": "The projectile is still moving and accelerating.",
      "question": "Is acceleration zero at the apex?",
      "answer": "No. Gravity still acts.",
      "duration": 24,
      "formula": "R = v₀² sin(2θ)/g · T = 2v₀ sinθ/g"
    },
    {
      "title": "Return to launch height",
      "focus": "Landing point",
      "caption": "The projectile descends and returns to its launch height.",
      "detail": "The model stops at first contact without calculating a bounce.",
      "observe": "The model stops at first contact without calculating a bounce.",
      "question": "What fixes the landing event here?",
      "answer": "The return to the original height.",
      "duration": 25
    },
    {
      "title": "Compare launch angles",
      "focus": "Projectile",
      "caption": "Complementary angles have equal ranges for level landing in vacuum.",
      "detail": "Compare 30° and 60°; their peak heights and flight times differ.",
      "observe": "Compare 30° and 60°; their peak heights and flight times differ.",
      "question": "Which angle maximizes range under these assumptions?",
      "answer": "45°.",
      "duration": 27
    }
  ],
  "mirrors": [
    {
      "title": "Meet a concave mirror",
      "focus": "Spherical mirror",
      "caption": "A concave mirror has a real focus in front of the reflecting surface.",
      "detail": "Parallel incoming rays reflect toward the focus in the paraxial model.",
      "observe": "Parallel incoming rays reflect toward the focus in the paraxial model.",
      "question": "What sign is the concave focal length here?",
      "answer": "Positive.",
      "duration": 30
    },
    {
      "title": "Locate a real image",
      "focus": "Reflected image",
      "caption": "Beyond the focal distance, reflected rays can meet in front of the mirror.",
      "detail": "The real image arrow is inverted.",
      "observe": "The real image arrow is inverted.",
      "question": "Is a real mirror image behind the mirror?",
      "answer": "No. It forms in front.",
      "duration": 25
    },
    {
      "title": "Reach the focal plane",
      "focus": "Mirror focus",
      "caption": "An object at the focus gives parallel reflected rays.",
      "detail": "No finite image position exists in the ideal equation.",
      "observe": "No finite image position exists in the ideal equation.",
      "question": "Is the finite image at the vertex?",
      "answer": "No.",
      "duration": 24,
      "formula": "1/f = 1/dₒ + 1/dᵢ · m = −dᵢ/dₒ"
    },
    {
      "title": "Move inside the focus",
      "focus": "Reflected image",
      "caption": "Inside the focus, backward extensions give an upright virtual image.",
      "detail": "Only dashed construction lines pass behind the mirror.",
      "observe": "Only dashed construction lines pass behind the mirror.",
      "question": "Do actual reflected rays meet behind it?",
      "answer": "No. Their extensions do.",
      "duration": 24
    },
    {
      "title": "Try a convex surface",
      "focus": "Spherical mirror",
      "caption": "A convex mirror gives a reduced upright virtual image of this real object.",
      "detail": "Its focus and image lie behind the reflecting surface.",
      "observe": "Its focus and image lie behind the reflecting surface.",
      "question": "Is the virtual image distance positive here?",
      "answer": "No. It is negative.",
      "duration": 28
    }
  ],
  "bernoulli": [
    {
      "title": "Set a steady flow",
      "focus": "Inlet",
      "caption": "The same volume flow passes through the inlet and the throat.",
      "detail": "Particles are advected through a residence-time map based on local area.",
      "observe": "Particles are advected through a residence-time map based on local area.",
      "question": "Does the flow rate become larger in the throat?",
      "answer": "No. Speed rises while area falls.",
      "duration": 28
    },
    {
      "title": "Narrow the passage",
      "focus": "Throat",
      "caption": "A smaller throat area requires higher average speed.",
      "detail": "Area depends on radius squared.",
      "observe": "Area depends on radius squared.",
      "question": "Halving radius changes area by what factor?",
      "answer": "Area becomes one quarter.",
      "duration": 19
    },
    {
      "title": "Compare pressure",
      "focus": "Pressure head",
      "caption": "In horizontal ideal flow, higher speed accompanies lower static pressure.",
      "detail": "Compare the vacuum-referenced pressure heads.",
      "observe": "Compare the vacuum-referenced pressure heads.",
      "question": "Is the displayed column open to atmospheric pressure?",
      "answer": "No. Its stated reference is vacuum.",
      "duration": 21,
      "formula": "Q = Av · P₁ + ½ρv₁² = P₂ + ½ρv₂²"
    },
    {
      "title": "Balance the energy terms",
      "focus": "Throat",
      "caption": "The pressure decrease balances the increase in kinetic-energy density.",
      "detail": "The model omits frictional energy loss.",
      "observe": "The model omits frictional energy loss.",
      "question": "Does this ideal pipe dissipate energy?",
      "answer": "No. Viscous losses are excluded.",
      "duration": 21
    },
    {
      "title": "Widen the throat again",
      "focus": "Throat",
      "caption": "A wider throat brings its speed and pressure closer to the inlet values.",
      "detail": "Equal areas give equal speeds and pressures at equal height.",
      "observe": "Equal areas give equal speeds and pressures at equal height.",
      "question": "What happens when the areas are equal?",
      "answer": "The ideal speeds and pressures match.",
      "duration": 29
    }
  ],
  "capacitor": [
    {
      "title": "Start with empty plates",
      "focus": "Capacitor plates",
      "caption": "An initially uncharged capacitor has zero voltage across its plates.",
      "detail": "An ideal source supplies current through the resistor.",
      "observe": "An ideal source supplies current through the resistor.",
      "question": "What is the initial charging current?",
      "answer": "V₀/R.",
      "duration": 24
    },
    {
      "title": "Build separated charge",
      "focus": "RC resistor",
      "caption": "As capacitor voltage rises, the voltage driving resistor current falls.",
      "detail": "The capacitor-voltage curve rises while current decays.",
      "observe": "The capacitor-voltage curve rises while current decays.",
      "question": "Does charging current remain constant?",
      "answer": "No. It decreases.",
      "duration": 23
    },
    {
      "title": "Measure one RC time",
      "focus": "Capacitor plates",
      "caption": "At one time constant, charging reaches about 63.2% of the source voltage.",
      "detail": "The response is exponential rather than a straight line.",
      "observe": "The response is exponential rather than a straight line.",
      "question": "What fraction remains uncharged after one τ?",
      "answer": "About 36.8%.",
      "duration": 27,
      "formula": "τ = RC · Vc(charge)=V₀(1−e⁻ᵗ/τ) · E=½CVc²"
    },
    {
      "title": "Disconnect and discharge",
      "focus": "Voltage source",
      "caption": "A fully charged capacitor releases stored energy through the resistor when the source is disconnected.",
      "detail": "Current reverses relative to the charging convention.",
      "observe": "Current reverses relative to the charging convention.",
      "question": "Does discharge current have the same sign as charge current here?",
      "answer": "No.",
      "duration": 28
    },
    {
      "title": "Wait five time constants",
      "focus": "Capacitor plates",
      "caption": "After five time constants an ideal discharge retains less than one percent of its initial voltage.",
      "detail": "Stored energy decreases with voltage squared.",
      "observe": "Stored energy decreases with voltage squared.",
      "question": "Does the ideal exponential reach exactly zero at a finite time?",
      "answer": "No. It approaches zero asymptotically.",
      "duration": 28
    }
  ],
  "covalent": [
    {
      "title": "Share an electron pair",
      "focus": "Covalent bond",
      "caption": "A single bond is represented by a shared pair of electrons.",
      "detail": "Markers are symbolic, not electron trajectories.",
      "observe": "Markers are symbolic, not electron trajectories.",
      "question": "Does the stick show a literal rigid rod?",
      "answer": "No. It represents a bond.",
      "duration": 23
    },
    {
      "title": "Bend water",
      "focus": "Lone pair",
      "caption": "Water has two bonds and two lone pairs around oxygen.",
      "detail": "Its atomic geometry is bent, with an approximate 104.5° H–O–H angle.",
      "observe": "Its atomic geometry is bent, with an approximate 104.5° H–O–H angle.",
      "question": "Is water a straight molecule?",
      "answer": "No. It is bent.",
      "duration": 27
    },
    {
      "title": "Build a pyramid",
      "focus": "Central atom",
      "caption": "Ammonia has three bonds and one lone pair around nitrogen.",
      "detail": "Its atomic geometry is trigonal pyramidal.",
      "observe": "Its atomic geometry is trigonal pyramidal.",
      "question": "Are all four electron domains bonds?",
      "answer": "No. One is a lone pair.",
      "duration": 22,
      "formula": "Illustrative stretch energy = bonds × ½k(Δr)² · k=500 N/m"
    },
    {
      "title": "Make a tetrahedron",
      "focus": "Central atom",
      "caption": "Methane has four C–H bonds arranged tetrahedrally.",
      "detail": "Rotate the molecule to see why a flat drawing is incomplete.",
      "observe": "Rotate the molecule to see why a flat drawing is incomplete.",
      "question": "How many lone pairs are shown on carbon?",
      "answer": "None in methane.",
      "duration": 24
    },
    {
      "title": "Stretch without a solver",
      "focus": "Covalent bond",
      "caption": "Imposed equal bond stretch raises an illustrative harmonic energy for either extension or compression.",
      "detail": "The model does not calculate electronic structure or bond breaking.",
      "observe": "The model does not calculate electronic structure or bond breaking.",
      "question": "Does this energy come from a fitted molecular quantum calculation?",
      "answer": "No. It uses a stated teaching spring constant.",
      "duration": 30
    }
  ],
  "chromatography": [
    {
      "title": "Mark the origin",
      "focus": "Stationary phase",
      "caption": "The sample begins on an origin line above the solvent pool.",
      "detail": "All travel distances are measured from that origin.",
      "observe": "All travel distances are measured from that origin.",
      "question": "Should the origin be submerged in the pool?",
      "answer": "No.",
      "duration": 25
    },
    {
      "title": "Move the solvent front",
      "focus": "Solvent front",
      "caption": "The model advances a solvent front up the stationary phase.",
      "detail": "Front speed is imposed rather than predicted from capillary flow.",
      "observe": "Front speed is imposed rather than predicted from capillary flow.",
      "question": "Is front speed solved from solvent chemistry here?",
      "answer": "No. It is an input.",
      "duration": 26
    },
    {
      "title": "Separate the components",
      "focus": "Separated bands",
      "caption": "Different chosen Rf values produce different band-centre speeds.",
      "detail": "The bands spread by an illustrative width rule.",
      "observe": "The bands spread by an illustrative width rule.",
      "question": "Do equal Rf values separate in this model?",
      "answer": "No. Their centres coincide.",
      "duration": 22,
      "formula": "Rf = distance travelled by band centre / distance travelled by solvent front"
    },
    {
      "title": "Measure a ratio",
      "focus": "Separated bands",
      "caption": "Divide each band-centre distance by the solvent-front distance.",
      "detail": "A band travelling 3 cm with a 10 cm front has Rf 0.30.",
      "observe": "A band travelling 3 cm with a 10 cm front has Rf 0.30.",
      "question": "Does Rf have length units?",
      "answer": "No. It is a ratio.",
      "duration": 27
    },
    {
      "title": "Inspect the final development",
      "focus": "Solvent front",
      "caption": "The run ends at a 10 cm front; band distances remain fixed afterward.",
      "detail": "Real Rf values depend on compound, eluent and stationary phase.",
      "observe": "Real Rf values depend on compound, eluent and stationary phase.",
      "question": "Is Rf a universal compound constant?",
      "answer": "No.",
      "duration": 29
    }
  ],
  "equilibrium": [
    {
      "title": "Begin with A",
      "focus": "Forward reaction",
      "caption": "Starting with A only gives a forward rate and initially zero reverse rate.",
      "detail": "The closed model conserves total A plus B.",
      "observe": "The closed model conserves total A plus B.",
      "question": "Is B initially present in this run?",
      "answer": "No.",
      "duration": 27
    },
    {
      "title": "Build the reverse rate",
      "focus": "Reverse reaction",
      "caption": "As B accumulates, its reverse conversion rate rises.",
      "detail": "Forward rate falls as A is depleted.",
      "observe": "Forward rate falls as A is depleted.",
      "question": "Does the reverse reaction wait until equilibrium to start?",
      "answer": "No. It begins as B becomes available.",
      "duration": 21
    },
    {
      "title": "Match the opposing rates",
      "focus": "Dynamic equilibrium",
      "caption": "The system approaches equal forward and reverse rates.",
      "detail": "For unequal rate constants, the concentrations at balance differ.",
      "observe": "For unequal rate constants, the concentrations at balance differ.",
      "question": "Must A and B concentrations match?",
      "answer": "No.",
      "duration": 23,
      "formula": "[B]eq/[A]eq = kf/kr · [A]+[B]=constant"
    },
    {
      "title": "Approach from B instead",
      "focus": "Reverse reaction",
      "caption": "Starting with B only approaches the same final ratio at fixed constants and total.",
      "detail": "Each setting change starts a new closed experiment.",
      "observe": "Each setting change starts a new closed experiment.",
      "question": "Does the initial composition set the final equilibrium ratio?",
      "answer": "No, not at fixed constants in this model.",
      "duration": 28
    },
    {
      "title": "Keep reactions moving",
      "focus": "Dynamic equilibrium",
      "caption": "At equilibrium the composition is steady while both conversions continue.",
      "detail": "Particles remain symbolic; displayed rates carry the calculation.",
      "observe": "Particles remain symbolic; displayed rates carry the calculation.",
      "question": "Have both reactions stopped?",
      "answer": "No. Their rates are equal.",
      "duration": 24
    }
  ],
  "enzyme": [
    {
      "title": "Meet an active site",
      "focus": "Active site",
      "caption": "An enzyme binds a suitable substrate at its active site.",
      "detail": "The geometry is conceptual rather than a named protein structure.",
      "observe": "The geometry is conceptual rather than a named protein structure.",
      "question": "Is the drawn shape a measured molecular structure?",
      "answer": "No.",
      "duration": 26
    },
    {
      "title": "Reach half the maximum rate",
      "focus": "Substrate",
      "caption": "At substrate equal to Km without inhibitor, initial rate is half Vmax.",
      "detail": "Use the curve and marker to compare rate with the limit.",
      "observe": "Use the curve and marker to compare rate with the limit.",
      "question": "What fraction of Vmax occurs at [S]=Km?",
      "answer": "One half.",
      "duration": 29
    },
    {
      "title": "Approach saturation",
      "focus": "Substrate",
      "caption": "Increasing substrate gives progressively smaller rate increases as saturation is approached.",
      "detail": "This is an initial-rate curve, not a depletion trajectory.",
      "observe": "This is an initial-rate curve, not a depletion trajectory.",
      "question": "Is time driving this graph?",
      "answer": "No. Its horizontal axis is substrate concentration.",
      "duration": 26,
      "formula": "v = Vmax[S] / (Km(1+[I]/Ki)+[S])"
    },
    {
      "title": "Add a competitor",
      "focus": "Competitive inhibitor",
      "caption": "An ideal competitive inhibitor increases apparent Km without changing Vmax.",
      "detail": "The inhibited curve shifts toward higher required substrate.",
      "observe": "The inhibited curve shifts toward higher required substrate.",
      "question": "Does Vmax decrease here?",
      "answer": "No.",
      "duration": 24
    },
    {
      "title": "Compare at high substrate",
      "focus": "Active site",
      "caption": "Higher substrate can partly overcome ideal competitive inhibition.",
      "detail": "Finite substrate may still give a rate below Vmax.",
      "observe": "Finite substrate may still give a rate below Vmax.",
      "question": "Does the curve reach its asymptote exactly at finite substrate?",
      "answer": "No.",
      "duration": 23
    }
  ],
  "genetics": [
    {
      "title": "Read parental genotypes",
      "focus": "Parent genotypes",
      "caption": "Each parent contributes one allele through a gamete.",
      "detail": "A and a refer to variants at one locus.",
      "observe": "A and a refer to variants at one locus.",
      "question": "Does each gamete carry both parental alleles here?",
      "answer": "No. It carries one.",
      "duration": 23
    },
    {
      "title": "List the gametes",
      "focus": "Gametes",
      "caption": "An Aa parent supplies A or a with equal probability in this model.",
      "detail": "Homozygous parents have repeated entries in the square.",
      "observe": "Homozygous parents have repeated entries in the square.",
      "question": "What is the probability of a from Aa?",
      "answer": "One half.",
      "duration": 27
    },
    {
      "title": "Combine allele pairs",
      "focus": "Offspring probabilities",
      "caption": "The four Punnett cells are equally likely independent gamete pairings.",
      "detail": "Their genotype labels combine row and column alleles.",
      "observe": "Their genotype labels combine row and column alleles.",
      "question": "Does each cell guarantee one child?",
      "answer": "No. It represents probability.",
      "duration": 24,
      "formula": "Aa × Aa → ¼ AA + ½ Aa + ¼ aa"
    },
    {
      "title": "Group the phenotypes",
      "focus": "Offspring probabilities",
      "caption": "Under complete dominance, AA and Aa share the dominant phenotype.",
      "detail": "For Aa×Aa, the recessive phenotype probability is one quarter.",
      "observe": "For Aa×Aa, the recessive phenotype probability is one quarter.",
      "question": "Can Aa have the dominant phenotype?",
      "answer": "Yes.",
      "duration": 25
    },
    {
      "title": "Try a test cross",
      "focus": "Parent genotypes",
      "caption": "An Aa×aa test cross gives half Aa and half aa in expectation.",
      "detail": "Actual small samples can differ from the expected proportions.",
      "observe": "Actual small samples can differ from the expected proportions.",
      "question": "Must exactly half of two offspring be recessive?",
      "answer": "No. Outcomes are probabilistic.",
      "duration": 27
    }
  ],
  "neuron": [
    {
      "title": "Begin at rest",
      "focus": "Axon membrane",
      "caption": "Before the pulse arrives, the model membrane rests at −70 mV.",
      "detail": "The displayed milliseconds are slowed relative to real time.",
      "observe": "The displayed milliseconds are slowed relative to real time.",
      "question": "Does one display second equal one real physiological second?",
      "answer": "No. It represents one millisecond.",
      "duration": 26
    },
    {
      "title": "Cross the teaching threshold",
      "focus": "Axon membrane",
      "caption": "A stimulus above the chosen threshold triggers the prescribed pulse.",
      "detail": "The threshold is a model choice rather than a measured patient value.",
      "observe": "The threshold is a model choice rather than a measured patient value.",
      "question": "Does larger suprathreshold stimulus make this single pulse taller?",
      "answer": "No. Its template amplitude stays fixed.",
      "duration": 28
    },
    {
      "title": "Read depolarization",
      "focus": "Voltage probe",
      "caption": "At the probe, the potential rises toward a +30 mV peak.",
      "detail": "The local trace is delayed by distance divided by speed.",
      "observe": "The local trace is delayed by distance divided by speed.",
      "question": "At 50 mm and 10 m/s, what is the delay?",
      "answer": "5 ms.",
      "duration": 27,
      "formula": "Delay (ms) = distance (mm) / speed (m/s)"
    },
    {
      "title": "Recover behind the pulse",
      "focus": "Refractory region",
      "caption": "Repolarization and a brief undershoot follow the voltage peak.",
      "detail": "The refractory colouring is prescribed; repeated-stimulus responses are not solved.",
      "observe": "The refractory colouring is prescribed; repeated-stimulus responses are not solved.",
      "question": "Are ion-channel dynamics calculated here?",
      "answer": "No.",
      "duration": 25
    },
    {
      "title": "Test a weaker stimulus",
      "focus": "Axon membrane",
      "caption": "A subthreshold stimulus leaves the membrane at its resting potential in this simplified model.",
      "detail": "The viewer illustrates all-or-none activation rather than graded local potentials.",
      "observe": "The viewer illustrates all-or-none activation rather than graded local potentials.",
      "question": "Does this model simulate all subthreshold membrane responses?",
      "answer": "No. It keeps them at the resting baseline.",
      "duration": 30
    }
  ]
};
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
export function expansionStoryState(kind:ExpansionKind,index:number,u:number):{p:Partial<Parameters>;time:number}{switch(kind){
case'projectile':{const angle=index===4?mix(30,60,u):45,flight=2*15*Math.sin(angle*Math.PI/180)/9.81;return{p:{launchAngle:angle},time:index===0?0:index===1?u*flight/2:index===2?flight/2:index===3?flight/2+u*flight/2:flight}}
case'mirrors':return{p:{mirrorFocus:index===4?-1:1,mirrorDistance:index===2?1:index===3?.5:3},time:0};
case'bernoulli':return{p:{inletRadius:index===4?mix(3,2.5,u):3,throatRadius:index===0?2.5:index===1?mix(2.5,1.2,u):index===4?mix(1.2,2.5,u):1.2},time:u*4};
case'capacitor':return{p:{discharging:index>=3},time:index===0?0:index===1?u:index===2?1:index===3?u*3:3+u*2};
case'covalent':return{p:{moleculeIndex:index<=1?0:index===2?1:2,bondStretch:index===4?mix(-15,15,u):0},time:0};
case'chromatography':return{p:{},time:index===0?0:index===1?u*15:index===2?15+u*20:index===3?35+u*20:55+u*12};
case'equilibrium':return{p:{initialB:index===3?1:0},time:index===0?0:index===1?u*10:index===2?10+u*50:index===3?u*60:100+u*20};
case'enzyme':return{p:{substrate:index===0?0:index===1?2:index===2?mix(2,20,u):index===3?2:mix(2,20,u),inhibitor:index>=3?2:0},time:0};
case'genetics':return{p:{parent2:index===4?2:1,geneticReveal:index<2?0:index===2?Math.min(4,Math.floor(u*4)+1):4},time:0};
case'neuron':return{p:{stimulus:index===4?.5:1.5,probePosition:50,nerveSpeed:10},time:index===0?0:index===1?u*4:index===2?5+u:index===3?6+u*3:u*10};
}}
