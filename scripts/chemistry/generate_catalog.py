"""Original editorial development catalogue; preserve progress when regenerating exports."""
import csv
import json
from pathlib import Path

groups = [
('Materials around us', '''Sort objects by their material
Compare transparent, translucent and opaque materials
Find waterproof materials
Compare water absorption by paper, cloth and plastic
Sort rough and smooth surfaces
Compare flexible and rigid objects
Find materials attracted to a magnet
Compare floating and sinking everyday objects
Observe a liquid taking the shape of its container
Compare dry sand and wet sand
Observe ice changing into liquid water
Choose a material for a reusable drinking cup'''),
('Everyday mixtures and changes', '''Compare salt and sand in water
Recover visible solids by handpicking
Separate large and small grains with a sieve
Observe oil and water forming layers
Compare water and cooking oil pouring
Mix coloured water and follow the colour
Observe water drying from a shallow dish
Make droplets join on a smooth surface
Compare clay, paper and metal after wetting
Investigate dissolving sugar crystals
Observe water vapour condensing on a cool lid
Identify a suitable container for a liquid'''),
('States, solutions and measurement', '''Compare particle arrangements in solid, liquid and gas
Measure a liquid volume in a graduated cylinder
Use a balance to compare sample masses
Find how stirring changes dissolving time
Compare dissolving in warm and cool water
Compare fine and coarse sugar dissolving
Find when added salt stops dissolving
Compare a solution and a suspension
Filter chalk particles from water
Follow evaporation and condensation in a closed system
Compare melting and dissolving
Investigate volume displacement by an insoluble solid
Observe food colouring spreading through still water
Compare soluble and insoluble household solids'''),
('Separation and material properties', '''Separate rice and husk by winnowing
Separate iron filings from sand magnetically
Recover sand by sedimentation and decantation
Compare filter papers with different pore sizes
Recover dissolved salt by evaporation
Separate a two-colour ink by paper chromatography
Compare beaker and measuring-cylinder readings
Read a meniscus at different eye heights
Investigate floating layers of immiscible liquids
Compare equal-volume samples by density
Observe melting and freezing of a chosen material
Investigate how surface area changes evaporation
Compare evaporation in moving and still air
Follow the path of water through a simple filter bed
Compare sieving and filtration
Plan a separation sequence for a three-component mixture'''),
('Changes and water investigations', '''Distinguish reversible and irreversible material changes
Observe a dissolving mass balance in a closed container
Compare water samples using a turbidity model
Investigate simple distillation of coloured water
Grow crystals from a supersaturated solution
Compare crystal growth during fast and slow cooling
Observe carbon dioxide production from an acid and carbonate
Compare an acid and a base using a cabbage-indicator model
Investigate neutralizing an acidic solution
Observe rust formation with different water and oxygen conditions
Compare corrosion protection by coatings
Compare expansion of air on warming
Investigate gas occupying space in an inverted cup
Compare solution concentration by colour intensity
Investigate the effect of temperature on gas solubility
Compare sedimentation before and after flocculation
Separate a salt-and-sand mixture completely
Design a water-recovery experiment'''),
('Matter and mixtures', '''Classify a material as element, compound or mixture
Compare homogeneous and heterogeneous mixtures
Model diffusion in gases and liquids
Compare physical and chemical changes using particle evidence
Measure density from mass and displaced volume
Prepare a solution with a stated mass concentration
Compare saturation at different temperatures
Construct a solubility curve from trials
Compare solute recovery after evaporation
Separate salt, sand and iron in stages
Use chromatography to compare ink samples
Investigate a separating funnel with two liquid layers
Compare filtration and centrifugation of a suspension
Investigate sublimation as a separation method
Compare pure-substance and mixture melting behaviour
Observe a heating curve for water
Observe a cooling curve and a freezing plateau
Compare heat conductors among materials
Investigate the effect of an insulating layer on cooling
Record and compare repeat measurements'''),
('Acids, bases and reaction evidence', '''Classify solutions with litmus indicators
Compare turmeric-indicator responses
Map cabbage-indicator colour to a chosen pH scale
Compare universal-indicator colours across pH
Investigate neutralization with a temperature readout
Observe acid-carbonate gas formation and limewater evidence
Compare indicators before and after dilution
Investigate acidic and basic oxides with water
Compare the pH of selected food-solution models
Observe a precipitation reaction between two salt solutions
Compare fast and slow reaction observations
Investigate surface area in a dissolving-solid model
Compare reversible phase changes and new-substance formation
Test the conditions required for iron corrosion
Compare rusting with saltwater concentration
Investigate a protective zinc coating
Compare water hardness using a soap-foam model
Compare soap and detergent in hard water
Follow acid-rain effects on a carbonate surface
Compare natural and synthetic fibre absorption
Investigate starch detection with iodine
Compare dissolved and suspended impurities in water'''),
('Particles, reactions and materials', '''Construct and compare neutral atomic models
Form ions by formal electron bookkeeping
Build simple molecules from valency constraints
Compare ionic and covalent particle arrangements
Investigate electrical conduction in selected solutions
Compare a solid ionic sample and its aqueous solution
Model electrolysis of water with gas-volume accounting
Investigate copper electroplating and deposited mass
Compare reactivity through metal-displacement reactions
Observe metal reactions with dilute acid in a chosen model
Compare metal-oxide and non-metal-oxide behaviour
Balance atoms in a simple reaction model
Investigate a combustion triangle using controlled conditions
Compare complete and incomplete combustion of a fuel model
Compare fuel energy per gram using calorimetry
Investigate how oxygen availability changes combustion products
Compare biodegradable and persistent material breakdown models
Investigate adsorption by activated carbon
Compare oil cleanup by adsorption and decantation
Investigate polymer-chain length and a stated property model
Compare thermoplastic and thermoset network structures
Investigate alloy composition and a chosen property model
Compare water purification methods and their limits
Investigate conservation of mass during precipitation'''),
('Atomic and quantitative foundations', '''Measure the density of a regular solid with uncertainty
Separate a colloid from a suspension using scattering evidence
Compare true solution, colloid and suspension particle sizes
Investigate crystallization yield and mother-liquor losses
Compare boiling-point measurements for pure and mixed samples
Investigate fractional distillation with relative volatility
Find a melting-point range from a heating trace
Calculate concentration after successive dilutions
Verify mass conservation in a closed gas-forming reaction
Investigate fixed mass ratios in a chosen compound
Count particles using the mole and Avogadro constant
Convert mass to moles for several substances
Compare empirical and molecular formulas
Determine a hydrate formula from a mass-loss model
Compare isotopes and weighted atomic mass
Simulate Rutherford scattering at different impact parameters
Investigate Bohr energy levels for hydrogen-like atoms
Build electronic configurations and identify valence electrons
Compare atomic and ionic sizes in a stated data set
Construct a periodic-table grouping from electronic structure
Track atom conservation while balancing equations
Model crystal separation from a saturated solution
Compare pressure-volume states of an ideal gas
Compare temperature-volume states at fixed pressure
Compare gas pressure at fixed volume as temperature changes
Model diffusion through a concentration gradient
Determine an unknown concentration by a calibration curve
Compare measurement precision and accuracy with repeated trials'''),
('Chemical reactions and applications', '''Observe magnesium oxidation with atom and mass accounting
Investigate thermal decomposition of a chosen carbonate
Model electrolysis with electrode-product tracking
Compare single-displacement reactions in a metal series
Investigate double-displacement precipitation reactions
Identify oxidation and reduction through electron accounting
Compare endothermic and exothermic energy changes
Measure an acid-base neutralization curve
Find hydrogen-ion concentration from pH
Compare pH before and after tenfold dilution
Compare strong and weak acids at equal formal concentration
Investigate a buffer resisting a small acid addition
Compare salts formed from different acid-base pairs
Model carbon dioxide release from bicarbonate
Compare hydrated and anhydrous salt observations
Investigate crystallization water in copper sulfate
Compare metal extraction by reduction conditions
Investigate galvanic corrosion between dissimilar metals
Compare electroplating thickness at different currents
Build carbon-chain and ring structures
Distinguish saturated and unsaturated hydrocarbon models
Compare ethanol and ethanoic-acid functional behaviour
Investigate esterification equilibrium in a chosen model
Compare soap micelles and oil dispersion
Investigate soap preparation through stoichiometric accounting
Compare soap performance with calcium-ion concentration
Model acid reactions with metals, carbonates and oxides
Investigate how concentration changes initial reaction rate
Compare a catalysed and uncatalysed reaction pathway
Design a controlled corrosion comparison'''),
('Senior chemistry foundations and practicals', '''Prepare a standard sodium-carbonate solution
Prepare a standard oxalic-acid solution
Standardize hydrochloric acid against sodium carbonate
Standardize sodium hydroxide against oxalic acid
Determine sample purity by acid-base titration
Identify a limiting reactant from mass inputs
Calculate percentage yield with product recovery
Determine an empirical formula from composition
Compare gas-law predictions with a chosen nonideal model
Investigate Dalton partial pressures in a gas mixture
Compare gas effusion rates using molar mass
Compare hydrogen emission lines with energy transitions
Inspect atomic orbitals and probability density
Apply Aufbau, Pauli and Hund occupancy rules
Compare periodic trends using a stated element data set
Construct Lewis structures with formal-charge accounting
Predict molecular shapes using VSEPR electron domains
Compare sigma and pi bonding in molecular models
Inspect sp, sp2 and sp3 orbital descriptions
Compare bond polarity and molecular dipole vectors
Compare intermolecular-force contributions in selected examples
Determine calorimeter heat capacity by mixing water
Determine enthalpy of neutralization in a calorimeter
Determine a dissolution enthalpy from temperature change
Investigate Hess-law energy-cycle accounting
Compare Gibbs energy and reaction spontaneity
Investigate reaction quotient and equilibrium direction
Shift an iron-thiocyanate equilibrium by concentration
Shift a cobalt-complex equilibrium in a stated model
Investigate common-ion suppression of weak-acid ionization
Construct a weak-acid titration and buffer region
Compare precipitation thresholds using ionic product and Ksp
Purify a selected solid by recrystallization
Determine the melting point of an organic sample
Determine the boiling point of an organic liquid
Identify selected anions and cations from combined evidence'''),
('Advanced chemistry and analytical practicals', '''Compare molarity, molality and mole fraction for a solution
Investigate Raoult-law vapour-pressure lowering
Compare ideal and nonideal solution behaviour
Determine molar mass from boiling-point elevation
Determine molar mass from freezing-point depression
Investigate osmotic pressure and a van t Hoff factor
Build a Daniell cell and calculate its potential
Investigate Nernst potential as ion concentration changes
Determine a concentration using a concentration cell
Compare conductivity and molar conductivity on dilution
Investigate Kohlrausch-law limiting conductivity
Verify Faraday-law deposited mass in electrolysis
Fit a first-order rate constant from concentration-time data
Distinguish zero-order and first-order kinetic plots
Determine activation energy from an Arrhenius plot
Investigate a thiosulfate-acid turbidity-time model
Compare iodide-persulfate reaction rates
Investigate an iodine-clock threshold model
Compare adsorption isotherms under stated assumptions
Prepare a colloid and compare coagulation conditions
Compare simple-cubic, BCC and FCC unit cells
Calculate packing efficiency and coordination number
Inspect tetrahedral and octahedral void occupancy
Compare Schottky and Frenkel defect bookkeeping
Investigate ligand substitution in a coordination complex
Compare coordination isomers and stereoisomers
Standardize permanganate using a chosen oxalate standard
Estimate iron(II) concentration by permanganate titration
Determine water hardness using an EDTA titration model
Identify an alcohol, phenol or carboxylic-acid sample
Distinguish aldehyde and ketone evidence in selected tests
Identify reducing sugars with a stated reagent model
Investigate protein detection using a biuret-colour model
Compare ester hydrolysis under acidic and basic conditions
Inspect substitution and elimination competition in a chosen model
Compare addition and condensation polymer formation
Compare atom economy, yield and waste in two synthetic routes
Design a multi-stage qualitative-analysis investigation''')]

path = Path('data/chemistry-labs.json')
previous = {r['id']: r for r in json.loads(path.read_text())['labs']} if path.exists() else {}
rows = []
expected = [12,12,14,16,18,20,22,24,28,30,36,38]
for grade, (strand, text) in enumerate(groups, 1):
    titles = text.splitlines()
    assert len(titles) == expected[grade-1], (grade, len(titles))
    for title in titles:
        sequence = len(rows)+1
        record = dict(id=f'CL-{sequence:04d}', sequence=sequence, grade=grade, title=title,
            strand=strand, status='in_progress' if sequence == 1 else 'planned',
            curriculumStatus='editorial_class_path_pending_board_mapping',
            aim=f'{title}. Record the observations and explain the evidence.',
            minimumAnimationSeconds=60,
            review=dict(model='pending',twoD='pending',threeD='pending',responsive='pending',practicalRecord='pending'))
        old = previous.get(record['id'])
        if old:
            assert old['title'] == title, 'Changing stable IDs requires an explicit migration'
            record.update({key:old[key] for key in ['status','review','reviewEvidence','reviewedOn','implementationVersion','modelAssumptions'] if key in old})
        rows.append(record)
assert len(rows) == 270
assert len({r['title'].casefold() for r in rows}) == 270
path.write_text(json.dumps(dict(schemaVersion=1,title='Science Atlas Chemistry Labs — Classes 1–12',
    company='VisionariesAI Labs Private Limited',
    coverageNote='A 270-investigation development catalogue. Class placement is editorial, not certified board alignment. A listed lab is not counted implemented until its review fields pass.',
    labs=rows),indent=2,ensure_ascii=False)+'\n')
out = Path('reports/chemistry-expansion')
out.mkdir(parents=True,exist_ok=True)
lines = ['# Chemistry Labs — Complete Development List','','270 distinct investigations · Classes 1–12 · VisionariesAI Labs Private Limited','',
    'This is the complete development list, not a claim that all labs are finished. Class placement is editorial; official board mappings remain to be checked. Every completed lab requires working 2D and 3D views, meaningful interaction, at least 60 seconds of appropriate guided animation, practical observations and a report.','']
for grade,(strand,_) in enumerate(groups,1):
    lines += [f'## Class {grade} — {strand}','']
    lines += [f"- **{r['id']}** — {r['title']} · {r['status'].replace('_',' ')}" for r in rows if r['grade']==grade]
    lines.append('')
(out/'ALL-270-LABS.md').write_text('\n'.join(lines))
with (out/'ALL-270-LABS.csv').open('w') as f:
    writer=csv.writer(f,lineterminator="\n")
    writer.writerow(['ID','Class','Strand','Laboratory','Status'])
    writer.writerows([[r['id'],r['grade'],r['strand'],r['title'],r['status']] for r in rows])
print('Created 270 unique investigations and class-wise Markdown/CSV lists.')
