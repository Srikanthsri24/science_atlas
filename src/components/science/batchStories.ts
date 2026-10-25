import type{Chapter}from'./stories';import type{BatchKind,Parameters}from'./types';
export const batchStories:Record<BatchKind,Chapter[]>={
  "freefall": [
    {
      "title": "Release from rest",
      "focus": "Falling body",
      "caption": "The body starts with zero speed and gravity acts downward.",
      "detail": "Look at the height scale and the initial zero speed.",
      "observe": "Look at the height scale and the initial zero speed.",
      "question": "Is there downward motion at the release instant?",
      "answer": "No. Speed starts at zero.",
      "duration": 26
    },
    {
      "title": "Accelerate in vacuum",
      "focus": "Falling body",
      "caption": "Without drag, downward speed increases by g each second.",
      "detail": "The trajectory follows the constant-acceleration equations.",
      "observe": "The trajectory follows the constant-acceleration equations.",
      "question": "Does mass change vacuum fall time?",
      "answer": "No, in this ideal model.",
      "duration": 21
    },
    {
      "title": "Build air resistance",
      "focus": "Drag force",
      "caption": "Drag grows as speed increases and opposes the fall.",
      "detail": "Compare the upward drag arrow with downward weight.",
      "observe": "Compare the upward drag arrow with downward weight.",
      "question": "Does drag point downward here?",
      "answer": "No. It opposes downward motion.",
      "duration": 23,
      "formula": "Fdrag = ½ρCdAv² · vt = √(2mg/ρCdA)"
    },
    {
      "title": "Approach terminal speed",
      "focus": "Drag force",
      "caption": "As drag approaches weight, acceleration tends toward zero.",
      "detail": "A large frontal area helps the body approach a lower terminal speed.",
      "observe": "A large frontal area helps the body approach a lower terminal speed.",
      "question": "Does zero acceleration mean zero speed?",
      "answer": "No. Constant nonzero speed is possible.",
      "duration": 26
    },
    {
      "title": "Reach the ground",
      "focus": "Ground",
      "caption": "Ground contact ends the drop. Impact speed is recorded separately.",
      "detail": "The model stops without calculating an impact force or bounce.",
      "observe": "The model stops without calculating an impact force or bounce.",
      "question": "Must terminal speed be reached before impact?",
      "answer": "No. The available fall distance may be too short.",
      "duration": 26
    }
  ],
  "spring": [
    {
      "title": "Store elastic energy",
      "focus": "Spring",
      "caption": "Displace the mass. The spring stores elastic potential energy.",
      "detail": "At the turning point velocity is zero.",
      "observe": "At the turning point velocity is zero.",
      "question": "Where is spring potential energy greatest?",
      "answer": "At the largest displacement.",
      "duration": 22
    },
    {
      "title": "Follow the restoring force",
      "focus": "Oscillating mass",
      "caption": "The spring pulls or pushes toward equilibrium.",
      "detail": "Force changes sign when displacement changes sign.",
      "observe": "Force changes sign when displacement changes sign.",
      "question": "What does the minus sign in F = −kx mean?",
      "answer": "Force opposes displacement.",
      "duration": 20
    },
    {
      "title": "Pass equilibrium",
      "focus": "Equilibrium",
      "caption": "At equilibrium the mass moves fastest although spring force is zero.",
      "detail": "Potential energy is minimal and kinetic energy maximal.",
      "observe": "Potential energy is minimal and kinetic energy maximal.",
      "question": "Is acceleration greatest at equilibrium?",
      "answer": "No. It is zero in this model.",
      "duration": 25,
      "formula": "T = 2π√(m/k) · E = ½kA²"
    },
    {
      "title": "Reverse direction",
      "focus": "Oscillating mass",
      "caption": "The mass slows to rest at the opposite turning point.",
      "detail": "Energy has returned to spring potential energy.",
      "observe": "Energy has returned to spring potential energy.",
      "question": "Is the mass permanently stopped there?",
      "answer": "No. The restoring force accelerates it back.",
      "duration": 23
    },
    {
      "title": "Change the mass",
      "focus": "Spring",
      "caption": "A larger mass takes longer to complete an oscillation.",
      "detail": "The period depends on the square root of mass divided by stiffness.",
      "observe": "The period depends on the square root of mass divided by stiffness.",
      "question": "What happens if mass becomes four times larger?",
      "answer": "The period doubles.",
      "duration": 27
    }
  ],
  "waves": [
    {
      "title": "Create a disturbance",
      "focus": "Material point",
      "caption": "A material point oscillates vertically while the pattern travels horizontally.",
      "detail": "Track the gold point on its vertical guide.",
      "observe": "Track the gold point on its vertical guide.",
      "question": "Does this point travel with the crest?",
      "answer": "No. Its horizontal coordinate stays fixed.",
      "duration": 24
    },
    {
      "title": "Measure wavelength",
      "focus": "Wavelength",
      "caption": "One wavelength separates two points in the same phase.",
      "detail": "Compare adjacent crests along the horizontal axis.",
      "observe": "Compare adjacent crests along the horizontal axis.",
      "question": "Is wavelength a time or a distance?",
      "answer": "A distance.",
      "duration": 22
    },
    {
      "title": "Count frequency",
      "focus": "Material point",
      "caption": "Frequency counts complete oscillations per second.",
      "detail": "Count one full rise and fall of the gold point.",
      "observe": "Count one full rise and fall of the gold point.",
      "question": "What is the unit of frequency?",
      "answer": "Hertz, or cycles per second.",
      "duration": 22,
      "formula": "y = A sin[2π(x/λ − ft)] · v = fλ"
    },
    {
      "title": "Connect speed and spacing",
      "focus": "Wave crest",
      "caption": "Increasing frequency at fixed wave speed reduces wavelength.",
      "detail": "The crests become closer together.",
      "observe": "The crests become closer together.",
      "question": "If frequency doubles at fixed speed, what happens to wavelength?",
      "answer": "It halves.",
      "duration": 19
    },
    {
      "title": "Separate motion from transport",
      "focus": "Material point",
      "caption": "The pattern advances while the material point continues to oscillate.",
      "detail": "This model has no boundary reflection or damping.",
      "observe": "This model has no boundary reflection or damping.",
      "question": "Does this show bulk material flowing to the right?",
      "answer": "No. It shows transverse oscillation.",
      "duration": 24
    }
  ],
  "lens": [
    {
      "title": "Place the object",
      "focus": "Object",
      "caption": "The object stands to the left of a converging lens, beyond its focus.",
      "detail": "The object arrow emits the two construction rays.",
      "observe": "The object arrow emits the two construction rays.",
      "question": "What sign does the real object distance have here?",
      "answer": "Positive, under the stated convention.",
      "duration": 27
    },
    {
      "title": "Trace a real image",
      "focus": "Image",
      "caption": "The outgoing rays converge to form an inverted real image.",
      "detail": "The image arrow points below the axis.",
      "observe": "The image arrow points below the axis.",
      "question": "Can a real image be caught on a screen?",
      "answer": "Yes, when a screen is placed at the image plane.",
      "duration": 23
    },
    {
      "title": "Reach the focal plane",
      "focus": "Thin lens",
      "caption": "At the focal distance the emergent rays are parallel.",
      "detail": "There is no finite image position to draw.",
      "observe": "There is no finite image position to draw.",
      "question": "Is the image at the lens centre?",
      "answer": "No. The finite-image solution disappears.",
      "duration": 23,
      "formula": "1/f = 1/dₒ + 1/dᵢ · magnification = −dᵢ/dₒ"
    },
    {
      "title": "Make a magnifier",
      "focus": "Image",
      "caption": "Inside the focal distance, a converging lens gives an upright virtual image.",
      "detail": "Backward extensions meet on the object side.",
      "observe": "Backward extensions meet on the object side.",
      "question": "Do actual outgoing rays meet there?",
      "answer": "No. Their backward extensions do.",
      "duration": 25
    },
    {
      "title": "Try a diverging lens",
      "focus": "Thin lens",
      "caption": "A diverging lens forms an upright virtual image of this real object.",
      "detail": "The negative focal length changes the outgoing ray slope.",
      "observe": "The negative focal length changes the outgoing ray slope.",
      "question": "What is the sign of this image distance?",
      "answer": "Negative.",
      "duration": 27
    }
  ],
  "induction": [
    {
      "title": "Orient the coil",
      "focus": "Magnetic field",
      "caption": "The coil normal begins parallel to the field, giving maximum positive flux.",
      "detail": "The normal is perpendicular to the plane of the coil.",
      "observe": "The normal is perpendicular to the plane of the coil.",
      "question": "Is emf maximal at maximum flux?",
      "answer": "No. Its instantaneous rate of change is zero there.",
      "duration": 28
    },
    {
      "title": "Rotate through a quarter turn",
      "focus": "Rotating coil",
      "caption": "As flux changes most rapidly, the magnitude of emf reaches a maximum.",
      "detail": "The normal becomes perpendicular to the field.",
      "observe": "The normal becomes perpendicular to the field.",
      "question": "What is the flux at this orientation?",
      "answer": "Zero, even though its rate of change is maximal.",
      "duration": 25
    },
    {
      "title": "Reverse the sign",
      "focus": "Rotating coil",
      "caption": "A half turn reverses the direction of flux through the chosen normal.",
      "detail": "The emf then changes sign during the next half cycle.",
      "observe": "The emf then changes sign during the next half cycle.",
      "question": "Does the induced voltage stay positive?",
      "answer": "No. It alternates.",
      "duration": 28,
      "formula": "Φ = BA cos θ · ε = −N dΦ/dt · I = ε/R"
    },
    {
      "title": "Drive the load",
      "focus": "Load resistor",
      "caption": "The resistive current follows the signed induced voltage.",
      "detail": "Electrical energy comes from the external mechanical drive.",
      "observe": "Electrical energy comes from the external mechanical drive.",
      "question": "Does this generator create energy from nothing?",
      "answer": "No. It converts supplied mechanical energy.",
      "duration": 22
    },
    {
      "title": "Add more turns",
      "focus": "Rotating coil",
      "caption": "More turns increase flux linkage and peak emf.",
      "detail": "Visible windings are representative; the selected count enters the calculation.",
      "observe": "Visible windings are representative; the selected count enters the calculation.",
      "question": "What happens to peak emf when turns double?",
      "answer": "It doubles at fixed area, field and speed.",
      "duration": 24
    }
  ],
  "gas": [
    {
      "title": "Confine a gas",
      "focus": "Gas particles",
      "caption": "A confined gas has linked pressure, volume, amount and temperature.",
      "detail": "The markers represent many particles and move much slower than molecules.",
      "observe": "The markers represent many particles and move much slower than molecules.",
      "question": "Does each marker represent one real molecule?",
      "answer": "No. The count is illustrative.",
      "duration": 27
    },
    {
      "title": "Compress at fixed temperature",
      "focus": "Piston",
      "caption": "Reducing volume at fixed temperature increases pressure.",
      "detail": "Heat exchange with a reservoir is implicit in maintaining temperature.",
      "observe": "Heat exchange with a reservoir is implicit in maintaining temperature.",
      "question": "What happens if volume halves?",
      "answer": "Pressure doubles in the ideal model.",
      "duration": 23
    },
    {
      "title": "Warm at fixed volume",
      "focus": "Pressure",
      "caption": "Increasing absolute temperature increases pressure.",
      "detail": "Use the kelvin readout rather than Celsius ratios.",
      "observe": "Use the kelvin readout rather than Celsius ratios.",
      "question": "What happens when kelvin temperature doubles?",
      "answer": "Pressure doubles at fixed n and V.",
      "duration": 19,
      "formula": "PV = nRT · R = 8.314 J/(mol·K)"
    },
    {
      "title": "Add gas",
      "focus": "Gas particles",
      "caption": "More gas in the same volume at the same temperature gives higher pressure.",
      "detail": "Marker count is held representative; amount enters the equation.",
      "observe": "Marker count is held representative; amount enters the equation.",
      "question": "Does amount affect pressure?",
      "answer": "Yes. P is proportional to n at fixed T and V.",
      "duration": 28
    },
    {
      "title": "Recognize the idealization",
      "focus": "Pressure",
      "caption": "The gas equation relates equilibrium states rather than simulating every collision.",
      "detail": "High-density and low-temperature real gases can depart from this relation.",
      "observe": "High-density and low-temperature real gases can depart from this relation.",
      "question": "Is this a real-gas molecular solver?",
      "answer": "No. It is an ideal-gas teaching model.",
      "duration": 27
    }
  ],
  "kinetics": [
    {
      "title": "Start with reactant",
      "focus": "Reactant A",
      "caption": "The vessel begins with reactant A, ready to convert into B.",
      "detail": "Purple markers represent A and gold markers B.",
      "observe": "Purple markers represent A and gold markers B.",
      "question": "Is there product at the initial instant?",
      "answer": "No. This model starts with A only.",
      "duration": 25
    },
    {
      "title": "Follow exponential decay",
      "focus": "Reactant A",
      "caption": "The rate falls as the remaining reactant concentration falls.",
      "detail": "The same fraction reacts in each equal time interval for fixed k.",
      "observe": "The same fraction reacts in each equal time interval for fixed k.",
      "question": "Does first-order concentration fall linearly?",
      "answer": "No. It decays exponentially.",
      "duration": 27
    },
    {
      "title": "Increase temperature",
      "focus": "Activation barrier",
      "caption": "Higher temperature raises the Arrhenius rate constant.",
      "detail": "This is an isothermal comparison; reaction heating is not calculated.",
      "observe": "This is an isothermal comparison; reaction heating is not calculated.",
      "question": "Does temperature affect k in this model?",
      "answer": "Yes.",
      "duration": 23,
      "formula": "[A] = [A]₀e⁻ᵏᵗ · t½ = ln(2)/k"
    },
    {
      "title": "Offer a catalyst pathway",
      "focus": "Activation barrier",
      "caption": "A lower activation barrier speeds the illustrative reaction.",
      "detail": "The final conversion remains one A to one B.",
      "observe": "The final conversion remains one A to one B.",
      "question": "Does the catalyst change the one-to-one total?",
      "answer": "No.",
      "duration": 23
    },
    {
      "title": "Compare half-lives",
      "focus": "Product B",
      "caption": "The half-life depends on k, not on the initial concentration for first-order kinetics.",
      "detail": "A plus B remains equal to the initial concentration.",
      "observe": "A plus B remains equal to the initial concentration.",
      "question": "Does doubling initial concentration double first-order half-life?",
      "answer": "No. The half-life stays the same at fixed k.",
      "duration": 28
    }
  ],
  "ph": [
    {
      "title": "Read a logarithmic scale",
      "focus": "Hydronium",
      "caption": "The initial strong acid has hydronium concentration close to its analytical concentration.",
      "detail": "A stock concentration of 10⁻³ mol/L gives pH close to 3.",
      "observe": "A stock concentration of 10⁻³ mol/L gives pH close to 3.",
      "question": "What does a one-unit pH increase mean for hydronium?",
      "answer": "About ten times lower concentration.",
      "duration": 29
    },
    {
      "title": "Add water",
      "focus": "Dilution",
      "caption": "Dilution reduces the analytical concentration and raises an acid’s pH.",
      "detail": "The control specifies a final-volume divided by stock-volume factor.",
      "observe": "The control specifies a final-volume divided by stock-volume factor.",
      "question": "Does adding water add more acid?",
      "answer": "No. It spreads the same solute through more water.",
      "duration": 25
    },
    {
      "title": "Include water itself",
      "focus": "Hydroxide",
      "caption": "Water contributes hydronium and hydroxide, which cannot be ignored near neutrality.",
      "detail": "The water ion product stays fixed in this 25°C model.",
      "observe": "The water ion product stays fixed in this 25°C model.",
      "question": "Can ideal acid dilution push pH above 7 here?",
      "answer": "No. It approaches 7 from below.",
      "duration": 27,
      "formula": "pH = −log₁₀[H₃O⁺] · [H₃O⁺][OH⁻] = 10⁻¹⁴ at 25°C"
    },
    {
      "title": "Try a strong base",
      "focus": "Hydroxide",
      "caption": "A strong base increases hydroxide and lowers hydronium.",
      "detail": "Its pH lies on the basic side of the scale.",
      "observe": "Its pH lies on the basic side of the scale.",
      "question": "Does more hydroxide imply more hydronium at fixed Kw?",
      "answer": "No. Hydronium decreases.",
      "duration": 24
    },
    {
      "title": "Compare both limits",
      "focus": "Dilution",
      "caption": "Dilute strong base approaches neutrality from above, just as acid approaches from below.",
      "detail": "The colour scale is illustrative, not an identified indicator.",
      "observe": "The colour scale is illustrative, not an identified indicator.",
      "question": "Does neutral always mean pH 7 at every temperature?",
      "answer": "No. That value is tied to Kw at 25°C.",
      "duration": 28
    }
  ],
  "diffusion": [
    {
      "title": "Create a gradient",
      "focus": "Left compartment",
      "caption": "The left compartment begins with a higher solute concentration.",
      "detail": "Both compartments have equal fixed volume.",
      "observe": "Both compartments have equal fixed volume.",
      "question": "Which side initially has more solute per volume?",
      "answer": "The left side.",
      "duration": 21
    },
    {
      "title": "Cross the membrane",
      "focus": "Permeable membrane",
      "caption": "Net solute transfer goes from higher toward lower concentration.",
      "detail": "The model allows this neutral solute to cross without an ATP pump.",
      "observe": "The model allows this neutral solute to cross without an ATP pump.",
      "question": "Is this active transport?",
      "answer": "No. It is passive diffusion.",
      "duration": 27
    },
    {
      "title": "Reduce the difference",
      "focus": "Right compartment",
      "caption": "As the concentration difference falls, the net transfer rate falls.",
      "detail": "The exact solution conserves total solute.",
      "observe": "The exact solution conserves total solute.",
      "question": "Does the net rate stay constant?",
      "answer": "No. It decreases with the gradient.",
      "duration": 22,
      "formula": "dCL/dt = −k(CL−CR) · CL + CR = constant"
    },
    {
      "title": "Reach dynamic equilibrium",
      "focus": "Permeable membrane",
      "caption": "Both compartments approach equal concentrations.",
      "detail": "Molecules still move even when there is no net transfer.",
      "observe": "Molecules still move even when there is no net transfer.",
      "question": "Do molecules stop at equilibrium?",
      "answer": "No.",
      "duration": 21
    },
    {
      "title": "Reverse the gradient",
      "focus": "Right compartment",
      "caption": "Reversing the initial concentration difference reverses net transfer.",
      "detail": "This model tracks solute, not osmotic water flow.",
      "observe": "This model tracks solute, not osmotic water flow.",
      "question": "Is this an osmosis simulation?",
      "answer": "No. Water movement is excluded.",
      "duration": 22
    }
  ],
  "mitosis": [
    {
      "title": "Condense replicated chromosomes",
      "focus": "Chromosomes",
      "caption": "Four replicated chromosomes become visible in this conceptual animal cell.",
      "detail": "Replication already occurred before this sequence begins.",
      "observe": "Replication already occurred before this sequence begins.",
      "question": "Does DNA replication begin during prophase here?",
      "answer": "No. It has already happened.",
      "duration": 23
    },
    {
      "title": "Align at the equator",
      "focus": "Spindle fibres",
      "caption": "Replicated chromosomes align at the spindle equator.",
      "detail": "Each has two sister chromatids, not two separate chromosomes yet.",
      "observe": "Each has two sister chromatids, not two separate chromosomes yet.",
      "question": "How many replicated chromosomes are shown?",
      "answer": "Four.",
      "duration": 23
    },
    {
      "title": "Separate sisters",
      "focus": "Chromosomes",
      "caption": "Sister chromatids separate and become daughter chromosomes.",
      "detail": "The whole unpartitioned cell briefly contains eight chromosomes.",
      "observe": "The whole unpartitioned cell briefly contains eight chromosomes.",
      "question": "What is a separated former chromatid called?",
      "answer": "A chromosome.",
      "duration": 21,
      "formula": "Model: 2n = 4 → two daughter cells, each 2n = 4"
    },
    {
      "title": "Re-form nuclei",
      "focus": "Spindle fibres",
      "caption": "Chromosomes arrive at opposite poles and nuclei re-form.",
      "detail": "Each future nucleus receives a complete set of four.",
      "observe": "Each future nucleus receives a complete set of four.",
      "question": "Do the nuclei receive half the original chromosome number?",
      "answer": "No. Each receives four.",
      "duration": 23
    },
    {
      "title": "Divide the cell",
      "focus": "Daughter cells",
      "caption": "Cytokinesis partitions the cytoplasm, producing two daughter cells.",
      "detail": "Each daughter has four chromosomes; cytokinesis is distinct from nuclear division.",
      "observe": "Each daughter has four chromosomes; cytokinesis is distinct from nuclear division.",
      "question": "Is this meiosis producing haploid gametes?",
      "answer": "No. It is mitosis preserving chromosome number.",
      "duration": 25
    }
  ]
};
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
export function batchStoryState(kind:BatchKind,index:number,u:number):{p:Partial<Parameters>;time:number}{switch(kind){
case'freefall':return{p:{fallHeight:index===3?100:50,fallMass:index===3?.2:1,fallArea:index===3?.3:.08,airDrag:index!==1},time:index===0?0:index===1?u*2.5:index===2?u*3:index===3?u*8:12};
case'spring':{const m=index===4?mix(1,4,u):1,period=2*Math.PI*Math.sqrt(m/20);return{p:{springMass:m},time:index===0?0:index===1?u*period/4:index===2?period/4:index===3?period/4+u*period/4:period*u}}
case'waves':return{p:{waveFrequency:index===3?mix(1,2,u):1},time:index===0?u:index===1?0:index===2?u*2:index===3?u*2:u*3};
case'lens':return{p:{focalLength:index===4?-1:1,objectDistance:index===2?1:index===3?.5:3},time:0};
case'induction':return{p:{turns:index===4?mix(20,40,u):20},time:index===0?0:index===1?u:index===2?1+u*2:index===3?u*4:1};
case'gas':return{p:{gasVolume:index===1?mix(2,1,u):2,temperature:index===2?mix(300,600,u):300,gasMoles:index===3?mix(.1,.2,u):.1},time:u*4};
case'kinetics':return{p:{reactionTemp:index===2?mix(298,318,u):298,catalyst:index===3},time:index===0?0:index===1?u*60:index===2?10:index===3?u*10:u*60};
case'ph':return{p:{isBase:index>=3,acidPower:index===2||index===4?6:3,dilution:index===1?10**u:index===2||index===4?10**(u*3):1},time:0};
case'diffusion':return{p:{leftConcentration:index===4?0:10,rightConcentration:index===4?10:0},time:index===0?0:index===1?u*4:index===2?4+u*16:index===3?20+u*100:u*30};
case'mitosis':return{p:{divisionProgress:Math.min(100,index*20+u*19.999)},time:0};
}}
