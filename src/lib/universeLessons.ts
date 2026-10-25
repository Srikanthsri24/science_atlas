import type{Lesson}from'./lessons';
export const universeLessons:Lesson[]=[
  {
    "id": "collision",
    "title": "When moving bodies meet",
    "kind": "collision",
    "subject": "Physics",
    "chapter": "Momentum & collisions",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Compare momentum transfer and kinetic-energy loss in a one-dimensional collision.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Compare momentum transfer and kinetic-energy loss in a one-dimensional collision.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The first body approaches a second body initially at rest. During contact, the interaction transfers momentum between the bodies.",
      "The restitution coefficient sets how quickly the bodies separate after contact. An inelastic collision retains momentum while reducing translational kinetic energy.",
      "At zero restitution, both bodies leave with the same velocity. One-dimensional isolated bodies; the second body starts at rest. Contact timing uses fixed 0.2 m radii. Momentum is conserved for all e; kinetic energy only for e=1. No deformation or impact-force calculation. Display repeats one encounter in six seconds."
    ],
    "terms": {
      "Momentum": "Mass multiplied by velocity, with direction.",
      "Restitution": "Relative separation speed divided by relative approach speed."
    },
    "formula": "p = mv · e = relative separation speed / approach speed",
    "misconception": "The internal contact forces exchange equal and opposite impulses.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Prepare the approach",
        "text": "The first body approaches a second body initially at rest."
      },
      {
        "title": "Make contact",
        "text": "During contact, the interaction transfers momentum between the bodies."
      },
      {
        "title": "Compare outgoing motion",
        "text": "The restitution coefficient sets how quickly the bodies separate after contact."
      },
      {
        "title": "Account for kinetic energy",
        "text": "An inelastic collision retains momentum while reducing translational kinetic energy."
      },
      {
        "title": "Try sticking together",
        "text": "At zero restitution, both bodies leave with the same velocity."
      }
    ],
    "quiz": [
      {
        "question": "What is conserved in this isolated one-dimensional model?",
        "options": [
          "Total momentum",
          "Each body’s speed",
          "Kinetic energy for every restitution",
          "Each body’s momentum"
        ],
        "answer": 0,
        "explanation": "The internal contact forces exchange equal and opposite impulses."
      },
      {
        "question": "For equal masses and an elastic hit on a stationary body…",
        "options": [
          "Both stop",
          "The incoming body stops and the target takes its speed",
          "Energy doubles",
          "The target remains at rest"
        ],
        "answer": 1,
        "explanation": "The elastic one-dimensional equal-mass result transfers the incoming velocity."
      },
      {
        "question": "At restitution zero, the outgoing velocities are…",
        "options": [
          "Equal",
          "Opposite in every case",
          "Infinite",
          "Both necessarily zero"
        ],
        "answer": 0,
        "explanation": "Zero relative separation speed gives a common outgoing velocity."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions",
    "sourceTitle": "OpenStax · Momentum & collisions",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "lever",
    "title": "Balance around a pivot",
    "kind": "lever",
    "subject": "Physics",
    "chapter": "Torque & equilibrium",
    "grades": [
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Move the loads and compare clockwise and anticlockwise moments.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Move the loads and compare clockwise and anticlockwise moments.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "A lever can rotate around its pivot when moments are unbalanced. A force farther from the pivot produces a larger moment at the same angle.",
      "The left and right loads produce opposite rotational effects. An unbalanced lever accelerates until damping or a stop limits its movement.",
      "A smaller force can balance a larger force if its moment arm is proportionally longer. Rigid lever with point loads, a 1 kg uniform beam contribution to inertia, gravity 9.81 m/s², illustrative rotational damping 0.7 N·m·s/rad and stops at ±0.35 rad. Torques are calculated; the apparatus is an educational model."
    ],
    "terms": {
      "Torque": "A force’s rotational effect about an axis.",
      "Equilibrium": "A state with zero net force and net torque."
    },
    "formula": "τ = Fr cosθ · balance when F₁r₁ = F₂r₂",
    "misconception": "The perpendicular moment is force times distance.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Find the pivot",
        "text": "A lever can rotate around its pivot when moments are unbalanced."
      },
      {
        "title": "Read a force arm",
        "text": "A force farther from the pivot produces a larger moment at the same angle."
      },
      {
        "title": "Compare opposing moments",
        "text": "The left and right loads produce opposite rotational effects."
      },
      {
        "title": "Observe the response",
        "text": "An unbalanced lever accelerates until damping or a stop limits its movement."
      },
      {
        "title": "Make a balance",
        "text": "A smaller force can balance a larger force if its moment arm is proportionally longer."
      }
    ],
    "quiz": [
      {
        "question": "10 N acting 2 m from a horizontal pivot gives…",
        "options": [
          "5 N·m",
          "20 N·m",
          "12 N·m",
          "0 N·m"
        ],
        "answer": 1,
        "explanation": "The perpendicular moment is force times distance."
      },
      {
        "question": "At fixed load, doubling the horizontal arm…",
        "options": [
          "Doubles its moment",
          "Halves its moment",
          "Changes no moment",
          "Removes gravity"
        ],
        "answer": 0,
        "explanation": "Torque is proportional to the perpendicular arm."
      },
      {
        "question": "A balanced lever requires…",
        "options": [
          "Equal forces always",
          "Equal distances always",
          "Equal opposing moments",
          "No loads"
        ],
        "answer": 2,
        "explanation": "Unequal loads can balance with unequal arms."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/12-2-examples-of-static-equilibrium",
    "sourceTitle": "OpenStax · Torque & equilibrium",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "magnet",
    "title": "Read an invisible field",
    "kind": "magnet",
    "subject": "Physics",
    "chapter": "Magnetism",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Explore a magnetic dipole and use a movable compass probe to read field direction.",
    "minutes": 12,
    "color": "indigo",
    "objectives": [
      "Explore a magnetic dipole and use a movable compass probe to read field direction.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "A magnetic dipole has an orientation represented by its moment. Outside a bar-like magnet, field direction runs from north toward south.",
      "The compass probe aligns with the local magnetic-field direction. A point dipole’s field weakens rapidly with distance.",
      "A larger dipole moment strengthens the field at the same probe location. Point magnetic dipole in vacuum with moment along +x; probe remains outside the core. Bar, field-line geometry and compass size are schematic. Moving field markers indicate direction, not particles flowing out of a magnet."
    ],
    "terms": {
      "Dipole_moment": "A vector measuring the strength and orientation of a magnetic dipole.",
      "Field_line": "A directional construction tangent to the magnetic field."
    },
    "formula": "B = μ₀/(4πr³) [3(m·r̂)r̂ − m]",
    "misconception": "Dipole magnitude scales as 1/r³.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Locate the dipole",
        "text": "A magnetic dipole has an orientation represented by its moment."
      },
      {
        "title": "Follow the outside direction",
        "text": "Outside a bar-like magnet, field direction runs from north toward south."
      },
      {
        "title": "Place the compass",
        "text": "The compass probe aligns with the local magnetic-field direction."
      },
      {
        "title": "Move farther away",
        "text": "A point dipole’s field weakens rapidly with distance."
      },
      {
        "title": "Change the moment",
        "text": "A larger dipole moment strengthens the field at the same probe location."
      }
    ],
    "quiz": [
      {
        "question": "At a fixed angle, doubling distance from a point dipole makes its field…",
        "options": [
          "Eight times larger",
          "Half as large",
          "One eighth as large",
          "Unchanged"
        ],
        "answer": 2,
        "explanation": "Dipole magnitude scales as 1/r³."
      },
      {
        "question": "A compass needle indicates…",
        "options": [
          "The local field direction",
          "A stream of iron particles",
          "The nearest electric charge always",
          "Only the north pole’s position"
        ],
        "answer": 0,
        "explanation": "Its magnetic moment tends to align with the local magnetic field."
      },
      {
        "question": "Moving dots on the field lines represent…",
        "options": [
          "Material leaving the magnet",
          "Directional highlights",
          "Actual magnetic monopoles",
          "Electric current through air"
        ],
        "answer": 1,
        "explanation": "They are visual direction markers, not matter."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-2/pages/12-4-magnetic-field-of-a-current-loop",
    "sourceTitle": "OpenStax · Magnetism",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "motor",
    "title": "Keep a coil turning",
    "kind": "motor",
    "subject": "Physics",
    "chapter": "Electric motors",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "See how a split-ring commutator keeps the motor torque turning the same way.",
    "minutes": 12,
    "color": "amber",
    "objectives": [
      "See how a split-ring commutator keeps the motor torque turning the same way.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "A current-carrying coil in a magnetic field can experience a torque. The torque accelerates the rotor from its initial nonzero angle.",
      "The commutator reverses current each half turn. Damping opposes rotation as angular speed rises.",
      "Increasing field, current or turn count increases the available peak torque. Ideal commutation, uniform field, area 0.002 m², inertia 0.02 kg·m² and initial angle 0.3 rad. Numerical mechanical model with linear damping; no back-emf or inductance. Parameters are teaching choices, not a rated motor."
    ],
    "terms": {
      "Commutator": "A switch arrangement reversing coil current at suitable rotor positions.",
      "Angular_speed": "Rate of change of rotational angle, in rad/s."
    },
    "formula": "τ = N B I A |sinθ| · J dω/dt = τ − bω",
    "misconception": "The torque scale is NBAI.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Put current in a field",
        "text": "A current-carrying coil in a magnetic field can experience a torque."
      },
      {
        "title": "Begin rotation",
        "text": "The torque accelerates the rotor from its initial nonzero angle."
      },
      {
        "title": "Reverse current at the right time",
        "text": "The commutator reverses current each half turn."
      },
      {
        "title": "Meet the mechanical load",
        "text": "Damping opposes rotation as angular speed rises."
      },
      {
        "title": "Compare inputs",
        "text": "Increasing field, current or turn count increases the available peak torque."
      }
    ],
    "quiz": [
      {
        "question": "Peak motor torque is proportional to…",
        "options": [
          "Current and magnetic field",
          "Only rotor colour",
          "Resistance alone in this prescribed-current model",
          "Zero angle always"
        ],
        "answer": 0,
        "explanation": "The torque scale is NBAI."
      },
      {
        "question": "The commutator’s role is to…",
        "options": [
          "Stop all current",
          "Reverse current each half turn",
          "Create energy",
          "Remove the magnetic field"
        ],
        "answer": 1,
        "explanation": "The reversal maintains a useful turning direction."
      },
      {
        "question": "The modeled motor converts…",
        "options": [
          "Mechanical energy to no output",
          "Electrical input into mechanical motion and losses",
          "No energy",
          "Only light into electricity"
        ],
        "answer": 1,
        "explanation": "Electromagnetic torque transfers electrical input into rotor motion."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-2/pages/11-5-force-and-torque-on-a-current-loop",
    "sourceTitle": "OpenStax · Electric motors",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "standing",
    "title": "The pattern that stands still",
    "kind": "standing",
    "subject": "Physics",
    "chapter": "Waves & resonance",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Find nodes and antinodes as two opposite travelling waves form a standing wave.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Find nodes and antinodes as two opposite travelling waves form a standing wave.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The string endpoints remain at zero displacement. Nodes have zero displacement throughout the cycle.",
      "A higher harmonic fits more half-wavelengths along the same string. Greater tension increases wave speed and therefore frequency.",
      "The standing-wave pattern has stationary nodes even while string material oscillates. Ideal string fixed at both ends, amplitude 0.2 m, no damping. Frequency is physical; one full oscillation is displayed over two seconds to avoid aliasing. Motion is deliberately slowed."
    ],
    "terms": {
      "Node": "A point of zero displacement throughout a standing-wave cycle.",
      "Harmonic": "An allowed fixed-boundary mode at an integer multiple of the fundamental."
    },
    "formula": "fₙ = n/(2L)√(T/μ) · y = A sin(nπx/L)cos(2πft)",
    "misconception": "There are n half-wavelength segments and n+1 node positions.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Fix both ends",
        "text": "The string endpoints remain at zero displacement."
      },
      {
        "title": "Find the nodes",
        "text": "Nodes have zero displacement throughout the cycle."
      },
      {
        "title": "Change harmonic number",
        "text": "A higher harmonic fits more half-wavelengths along the same string."
      },
      {
        "title": "Change tension",
        "text": "Greater tension increases wave speed and therefore frequency."
      },
      {
        "title": "Separate the pattern from travel",
        "text": "The standing-wave pattern has stationary nodes even while string material oscillates."
      }
    ],
    "quiz": [
      {
        "question": "For the nth string harmonic, the number of nodes including ends is…",
        "options": [
          "n−1",
          "n",
          "n+1",
          "Always two"
        ],
        "answer": 2,
        "explanation": "There are n half-wavelength segments and n+1 node positions."
      },
      {
        "question": "Four times the tension at fixed L and μ gives frequency…",
        "options": [
          "Twice as large",
          "Four times as large",
          "Half as large",
          "Unchanged"
        ],
        "answer": 0,
        "explanation": "Frequency scales as √T."
      },
      {
        "question": "A node…",
        "options": [
          "Moves with a travelling crest",
          "Has zero displacement for the whole cycle",
          "Has maximum displacement",
          "Is a massless particle"
        ],
        "answer": 1,
        "explanation": "It is a stationary zero of the standing-wave amplitude."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance",
    "sourceTitle": "OpenStax · Waves & resonance",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "echo",
    "title": "Measure with a returning sound",
    "kind": "echo",
    "subject": "Physics",
    "chapter": "Sound",
    "grades": [
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Send a sound pulse to a wall and use its round-trip delay to infer distance.",
    "minutes": 12,
    "color": "mint",
    "objectives": [
      "Send a sound pulse to a wall and use its round-trip delay to infer distance.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The sound pulse travels from source to reflector. At the reflector the pulse changes its direction of travel.",
      "The return completes a round trip twice the source–reflector distance. Distance is half the sound speed multiplied by the round-trip delay.",
      "In this range, warmer air has a slightly higher sound speed. Straight-line reflection in uniform air; approximate speed c=331+0.6T m/s over the exposed temperature range. No attenuation, dispersion or multiple reflections. The round trip is slowed and repeated for visibility."
    ],
    "terms": {
      "Echo": "A reflected sound arriving after the direct sound.",
      "Round_trip": "Travel from source to reflector and back."
    },
    "formula": "distance = sound speed × echo delay / 2",
    "misconception": "The pulse covers the distance twice.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Send the pulse",
        "text": "The sound pulse travels from source to reflector."
      },
      {
        "title": "Reach the reflector",
        "text": "At the reflector the pulse changes its direction of travel."
      },
      {
        "title": "Receive the echo",
        "text": "The return completes a round trip twice the source–reflector distance."
      },
      {
        "title": "Infer distance",
        "text": "Distance is half the sound speed multiplied by the round-trip delay."
      },
      {
        "title": "Compare air temperatures",
        "text": "In this range, warmer air has a slightly higher sound speed."
      }
    ],
    "quiz": [
      {
        "question": "The factor 1/2 in echo distance accounts for…",
        "options": [
          "Two-way travel",
          "Half the sound being lost",
          "Half the temperature",
          "A slower return speed"
        ],
        "answer": 0,
        "explanation": "The pulse covers the distance twice."
      },
      {
        "question": "At 340 m/s and a 0.2 s echo delay, one-way distance is…",
        "options": [
          "68 m",
          "34 m",
          "1700 m",
          "3.4 m"
        ],
        "answer": 1,
        "explanation": "Distance is 340×0.2/2=34 m."
      },
      {
        "question": "In this model, increasing air temperature makes sound speed…",
        "options": [
          "Slightly higher",
          "Zero",
          "Negative",
          "Always unchanged"
        ],
        "answer": 0,
        "explanation": "The approximate relation is c=331+0.6T."
      }
    ],
    "source": "https://openstax.org/books/college-physics-2e/pages/17-2-speed-of-sound-frequency-and-wavelength",
    "sourceTitle": "OpenStax · Sound",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "conduction",
    "title": "Heat finds a balance",
    "kind": "conduction",
    "subject": "Physics",
    "chapter": "Thermal physics",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Connect two insulated blocks and follow thermal energy toward equilibrium.",
    "minutes": 12,
    "color": "rose",
    "objectives": [
      "Connect two insulated blocks and follow thermal energy toward equilibrium.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The blocks begin with different uniform temperatures. Energy transfers from the hotter block toward the cooler block.",
      "As the temperature difference falls, the transfer rate falls. Equal masses with equal specific heat approach the arithmetic mean of their initial temperatures.",
      "Greater thermal conductance speeds equilibration. Two equal masses with heat capacity 900 J/(kg·K), uniform block temperatures, no environmental heat loss. Exact two-compartment heat exchange conserves thermal energy. Geometry and microscopic agitation are symbolic."
    ],
    "terms": {
      "Thermal_conductance": "Heat-transfer rate per temperature difference, in W/K.",
      "Heat_capacity": "Energy required for a unit temperature increase."
    },
    "formula": "Q̇ = G(T₁−T₂) · ΔT(t) = ΔT₀e⁻ᵗ/τ",
    "misconception": "Equal heat capacities give the mean temperature, 50°C.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Establish a temperature difference",
        "text": "The blocks begin with different uniform temperatures."
      },
      {
        "title": "Make thermal contact",
        "text": "Energy transfers from the hotter block toward the cooler block."
      },
      {
        "title": "Reduce the difference",
        "text": "As the temperature difference falls, the transfer rate falls."
      },
      {
        "title": "Reach a common temperature",
        "text": "Equal masses with equal specific heat approach the arithmetic mean of their initial temperatures."
      },
      {
        "title": "Change the conductance",
        "text": "Greater thermal conductance speeds equilibration."
      }
    ],
    "quiz": [
      {
        "question": "Equal insulated blocks initially at 80°C and 20°C approach…",
        "options": [
          "100°C",
          "60°C",
          "50°C",
          "30°C"
        ],
        "answer": 2,
        "explanation": "Equal heat capacities give the mean temperature, 50°C."
      },
      {
        "question": "Heat-transfer rate decreases because…",
        "options": [
          "The temperature difference decreases",
          "Mass disappears",
          "Energy is destroyed",
          "The blocks stop containing particles"
        ],
        "answer": 0,
        "explanation": "The rate is G times the temperature difference."
      },
      {
        "question": "Increasing conductance changes…",
        "options": [
          "The equilibration timescale",
          "The conserved total energy",
          "The final mean for equal blocks",
          "The definition of temperature"
        ],
        "answer": 0,
        "explanation": "The system approaches the same equilibrium faster."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-2/pages/1-6-mechanisms-of-heat-transfer",
    "sourceTitle": "OpenStax · Thermal physics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "capillary",
    "title": "Water climbs a narrow tube",
    "kind": "capillary",
    "subject": "Physics",
    "chapter": "Surface phenomena",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Compare a wetting rise with a non-wetting depression in a capillary.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Compare a wetting rise with a non-wetting depression in a capillary.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "Surface tension acts where the liquid surface meets the tube. The final capillary height balances surface-tension and gravitational effects.",
      "A narrower tube produces a larger height magnitude under the same conditions. A contact angle greater than 90° gives a depression instead of a rise.",
      "At 90° the ideal static height is zero. Static Jurin height for density 1000 kg/m³ and g=9.81 m/s². The approach to height is a staged illustration, not a viscosity-dependent transient solver. Radius and vertical height use different visual scales."
    ],
    "terms": {
      "Contact_angle": "The angle describing wetting at the solid–liquid–gas junction.",
      "Surface_tension": "Interfacial force per unit length, in N/m."
    },
    "formula": "h = 2γcosθ / (ρgr)",
    "misconception": "Height is proportional to 1/r.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Meet the meniscus",
        "text": "Surface tension acts where the liquid surface meets the tube."
      },
      {
        "title": "Balance the liquid column",
        "text": "The final capillary height balances surface-tension and gravitational effects."
      },
      {
        "title": "Narrow the radius",
        "text": "A narrower tube produces a larger height magnitude under the same conditions."
      },
      {
        "title": "Try a non-wetting angle",
        "text": "A contact angle greater than 90° gives a depression instead of a rise."
      },
      {
        "title": "Compare the limits",
        "text": "At 90° the ideal static height is zero."
      }
    ],
    "quiz": [
      {
        "question": "Halving capillary radius makes ideal height magnitude…",
        "options": [
          "Double",
          "Half",
          "Unchanged",
          "Zero"
        ],
        "answer": 0,
        "explanation": "Height is proportional to 1/r."
      },
      {
        "question": "At contact angle 90°, cosθ is…",
        "options": [
          "1",
          "−1",
          "0",
          "Infinite"
        ],
        "answer": 2,
        "explanation": "The vertical surface-tension contribution is zero."
      },
      {
        "question": "A non-wetting angle above 90° gives…",
        "options": [
          "Always a rise",
          "A depression",
          "No gravity",
          "A negative radius"
        ],
        "answer": 1,
        "explanation": "Cosθ becomes negative."
      }
    ],
    "source": "https://openstax.org/books/college-physics-2e/pages/11-8-cohesion-and-adhesion-in-liquids-surface-tension-and-capillary-action",
    "sourceTitle": "OpenStax · Surface phenomena",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "decay",
    "title": "A clock inside the nucleus",
    "kind": "decay",
    "subject": "Physics",
    "chapter": "Nuclear physics",
    "grades": [
      10,
      11,
      12
    ],
    "description": "Follow an ensemble through repeated half-lives and distinguish expected counts from single events.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Follow an ensemble through repeated half-lives and distinguish expected counts from single events.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The parent-nucleus count represents a statistical ensemble. After one half-life, half the expected parents remain.",
      "Equal half-life intervals remove equal fractions, not equal numbers. The decay constant sets the per-nucleus probability rate.",
      "A small real sample can depart from the smooth expectation. Single decay channel, constant decay probability per time. Counts are expected values; marker colour changes are a deterministic illustration, not predictions of which nucleus decays. No isotope-specific radiation dose model."
    ],
    "terms": {
      "Half_life": "Time for expected parent count to halve.",
      "Activity": "Expected number of decays per unit time."
    },
    "formula": "N = N₀e⁻λt · λ = ln2 / t½",
    "misconception": "Each half-life multiplies the remaining fraction by 1/2.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Start an ensemble",
        "text": "The parent-nucleus count represents a statistical ensemble."
      },
      {
        "title": "Pass one half-life",
        "text": "After one half-life, half the expected parents remain."
      },
      {
        "title": "Compare successive intervals",
        "text": "Equal half-life intervals remove equal fractions, not equal numbers."
      },
      {
        "title": "Relate probability and activity",
        "text": "The decay constant sets the per-nucleus probability rate."
      },
      {
        "title": "Keep the distinction",
        "text": "A small real sample can depart from the smooth expectation."
      }
    ],
    "quiz": [
      {
        "question": "After two half-lives, the expected parent fraction is…",
        "options": [
          "1/2",
          "1/4",
          "1/8",
          "Zero"
        ],
        "answer": 1,
        "explanation": "Each half-life multiplies the remaining fraction by 1/2."
      },
      {
        "question": "A single nucleus’s exact decay time is…",
        "options": [
          "Fixed by this smooth curve",
          "Not predicted by this model",
          "Always one half-life",
          "Always zero"
        ],
        "answer": 1,
        "explanation": "The exponential law gives ensemble probabilities."
      },
      {
        "question": "For a fixed half-life, activity falls because…",
        "options": [
          "Fewer parents remain",
          "The unit of time changes",
          "The decay constant doubles",
          "Energy disappears"
        ],
        "answer": 0,
        "explanation": "Activity is λN with constant λ."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-3/pages/10-3-radioactive-decay",
    "sourceTitle": "OpenStax · Nuclear physics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "orbit",
    "title": "An orbit that changes speed",
    "kind": "orbit",
    "subject": "Earth & Space",
    "chapter": "Orbital mechanics",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Follow an elliptical orbit and compare the near-Sun and far-Sun parts of the journey.",
    "minutes": 12,
    "color": "indigo",
    "objectives": [
      "Follow an elliptical orbit and compare the near-Sun and far-Sun parts of the journey.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The star lies at one focus of the ellipse, not generally its centre. The planet moves more quickly in the near-star part of its orbit.",
      "The planet moves more slowly in the far-star part. Greater eccentricity produces a more elongated orbit.",
      "A larger semi-major axis gives a longer period around the same star. Two-body Kepler ellipse around a Sun-mass star; negligible planet mass. Newton iteration solves Kepler’s equation. Orbit orientation, sizes and display time are schematic; not an ephemeris."
    ],
    "terms": {
      "Semi_major_axis": "Half the longest diameter of an ellipse.",
      "Eccentricity": "A measure of orbital elongation, zero for a circle."
    },
    "formula": "M = E − e sinE · T = 365.256 a³ᐟ² days",
    "misconception": "A Kepler ellipse has the attracting star at a focus.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Locate the focus",
        "text": "The star lies at one focus of the ellipse, not generally its centre."
      },
      {
        "title": "Approach the star",
        "text": "The planet moves more quickly in the near-star part of its orbit."
      },
      {
        "title": "Travel farther out",
        "text": "The planet moves more slowly in the far-star part."
      },
      {
        "title": "Change eccentricity",
        "text": "Greater eccentricity produces a more elongated orbit."
      },
      {
        "title": "Change the orbit size",
        "text": "A larger semi-major axis gives a longer period around the same star."
      }
    ],
    "quiz": [
      {
        "question": "The star is at…",
        "options": [
          "A focus",
          "Every point on the orbit",
          "Always the ellipse centre",
          "The farthest point only"
        ],
        "answer": 0,
        "explanation": "A Kepler ellipse has the attracting star at a focus."
      },
      {
        "question": "A planet moves fastest…",
        "options": [
          "Nearest the star",
          "Farthest from the star",
          "At the same speed everywhere for e>0",
          "Only at a node"
        ],
        "answer": 0,
        "explanation": "Angular-momentum conservation gives faster motion at smaller radius."
      },
      {
        "question": "For the same central star, a larger semi-major axis gives…",
        "options": [
          "A shorter period",
          "A longer period",
          "No period",
          "Zero gravity"
        ],
        "answer": 1,
        "explanation": "Kepler’s third law gives T² proportional to a³."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/13-5-keplers-laws-of-planetary-motion",
    "sourceTitle": "OpenStax · Orbital mechanics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "titration",
    "title": "Find the turning point of a titration",
    "kind": "titration",
    "subject": "Chemistry",
    "chapter": "Acids, bases & analysis",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Add a strong base to a strong acid and follow stoichiometry, pH and the equivalence point.",
    "minutes": 12,
    "color": "rose",
    "objectives": [
      "Add a strong base to a strong acid and follow stoichiometry, pH and the equivalence point.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The initial acid supplies hydronium to the solution. Added hydroxide reacts with hydronium and changes the excess amount.",
      "At equivalence the acid and base stoichiometric amounts match. Beyond equivalence, excess hydroxide controls the pH.",
      "The steep region near equivalence connects small added volumes to large pH changes. Ideal monoprotic strong acid/base at 25°C, complete reaction and dissociation, Kw=10⁻¹⁴. Includes water autoionization and changing total volume. Indicator colour uses an illustrative phenolphthalein transition (pKa 9.4); no activity correction or weak-acid chemistry."
    ],
    "terms": {
      "Equivalence_point": "The point where reacting stoichiometric amounts match.",
      "Endpoint": "An observed indicator or instrument criterion used to stop a titration."
    },
    "formula": "at equivalence: CₐVₐ = CᵦVᵦ",
    "misconception": "Equal concentrations require equal volumes for this 1:1 reaction.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Prepare the acid",
        "text": "The initial acid supplies hydronium to the solution."
      },
      {
        "title": "Add the strong base",
        "text": "Added hydroxide reacts with hydronium and changes the excess amount."
      },
      {
        "title": "Cross equivalence",
        "text": "At equivalence the acid and base stoichiometric amounts match."
      },
      {
        "title": "Continue into base excess",
        "text": "Beyond equivalence, excess hydroxide controls the pH."
      },
      {
        "title": "Read the curve",
        "text": "The steep region near equivalence connects small added volumes to large pH changes."
      }
    ],
    "quiz": [
      {
        "question": "25 mL of 0.1 M acid requires how much 0.1 M base at equivalence?",
        "options": [
          "12.5 mL",
          "25 mL",
          "50 mL",
          "100 mL"
        ],
        "answer": 1,
        "explanation": "Equal concentrations require equal volumes for this 1:1 reaction."
      },
      {
        "question": "This ideal strong acid/base has pH near 7 at equivalence because…",
        "options": [
          "Acid and base amounts match at 25°C",
          "All indicators are neutral",
          "Every titration is neutral",
          "The volume is zero"
        ],
        "answer": 0,
        "explanation": "No stoichiometric acid or base excess remains; water autoionization sets the ideal pH."
      },
      {
        "question": "After adding base beyond equivalence, the solution is…",
        "options": [
          "Basic",
          "Always acidic",
          "Empty",
          "A buffer by definition"
        ],
        "answer": 0,
        "explanation": "Excess hydroxide makes it basic."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/14-7-acid-base-titrations",
    "sourceTitle": "OpenStax · Acids, bases & analysis",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "distillation",
    "title": "Follow the more volatile component",
    "kind": "distillation",
    "subject": "Chemistry",
    "chapter": "Separation methods",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Watch a binary mixture boil, condense and form an enriched distillate.",
    "minutes": 12,
    "color": "amber",
    "objectives": [
      "Watch a binary mixture boil, condense and form an enriched distillate.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The boiling vessel begins with two components. The vapour contains a larger fraction of A than the residual liquid when α>1.",
      "The vapour passes through a condenser and returns to liquid. Removing A-enriched vapour leaves the residue poorer in A.",
      "The collected distillate is enriched relative to the evolving residue. Ideal fictional binary mixture with constant relative volatility, initially 1 mol. Differential batch material balance, perfect condensation, no reflux. No real boiling temperatures, azeotropes or compound-specific fit. Run stops after 80% collection."
    ],
    "terms": {
      "Relative_volatility": "A measure of how strongly one component is favoured in the vapour.",
      "Distillate": "The condensed material collected from the vapour stream."
    },
    "formula": "yA = αxA / [1 + (α−1)xA]",
    "misconception": "The stated equilibrium relation favours A in the vapour.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Begin with a mixture",
        "text": "The boiling vessel begins with two components."
      },
      {
        "title": "Enrich the vapour",
        "text": "The vapour contains a larger fraction of A than the residual liquid when α>1."
      },
      {
        "title": "Condense the vapour",
        "text": "The vapour passes through a condenser and returns to liquid."
      },
      {
        "title": "Change the residue",
        "text": "Removing A-enriched vapour leaves the residue poorer in A."
      },
      {
        "title": "Compare enrichment",
        "text": "The collected distillate is enriched relative to the evolving residue."
      }
    ],
    "quiz": [
      {
        "question": "For α>1 and a mixed liquid, vapour A fraction is…",
        "options": [
          "Greater than liquid A fraction",
          "Always zero",
          "Equal to total moles",
          "Always one"
        ],
        "answer": 0,
        "explanation": "The stated equilibrium relation favours A in the vapour."
      },
      {
        "question": "The condenser changes…",
        "options": [
          "Vapour to liquid",
          "A into a different element",
          "Mass into no mass",
          "The atom count"
        ],
        "answer": 0,
        "explanation": "It removes heat so vapour condenses."
      },
      {
        "question": "This closed accounting preserves…",
        "options": [
          "Component A across residue and receiver",
          "Only the receiver volume",
          "A fixed residue composition",
          "Only temperature"
        ],
        "answer": 0,
        "explanation": "Removed A is accumulated in the collected stream."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/10-3-phase-transitions",
    "sourceTitle": "OpenStax · Separation methods",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "crystal",
    "title": "Build the space inside a solid",
    "kind": "crystal",
    "subject": "Chemistry",
    "chapter": "Crystalline solids",
    "grades": [
      10,
      11,
      12
    ],
    "description": "Assemble simple, body-centred and face-centred cubic cells and compare packing.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Assemble simple, body-centred and face-centred cubic cells and compare packing.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "Eight corners define the cubic unit cell. Eight corner contributions of one eighth give one effective atom.",
      "A body-centred cubic cell adds one whole atom at its centre. A face-centred cubic cell adds six half-shared face atoms.",
      "Hard-sphere contact geometry determines the radius-to-edge relation and packing fraction. Ideal hard-sphere cubic cells. Contact radii and packing efficiencies follow geometric relations. Boundary atoms are drawn whole but their fractional contributions are stated. The construction is explanatory, not crystallization dynamics."
    ],
    "terms": {
      "Unit_cell": "A repeating volume used to describe a crystal lattice.",
      "Packing_fraction": "The fraction of cell volume occupied by the ideal spheres."
    },
    "formula": "effective atoms: SC 1 · BCC 2 · FCC 4",
    "misconception": "Eight cells share that corner in the extended lattice.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Mark the corners",
        "text": "Eight corners define the cubic unit cell."
      },
      {
        "title": "Count fractional shares",
        "text": "Eight corner contributions of one eighth give one effective atom."
      },
      {
        "title": "Add a body centre",
        "text": "A body-centred cubic cell adds one whole atom at its centre."
      },
      {
        "title": "Add face centres",
        "text": "A face-centred cubic cell adds six half-shared face atoms."
      },
      {
        "title": "Compare packing",
        "text": "Hard-sphere contact geometry determines the radius-to-edge relation and packing fraction."
      }
    ],
    "quiz": [
      {
        "question": "A corner atom contributes to one cubic cell by…",
        "options": [
          "1",
          "1/2",
          "1/8",
          "8"
        ],
        "answer": 2,
        "explanation": "Eight cells share that corner in the extended lattice."
      },
      {
        "question": "BCC contains how many effective atoms per cell?",
        "options": [
          "1",
          "2",
          "4",
          "8"
        ],
        "answer": 1,
        "explanation": "Corners contribute one and the body centre contributes one."
      },
      {
        "question": "FCC hard-sphere packing is approximately…",
        "options": [
          "74%",
          "100%",
          "25%",
          "10%"
        ],
        "answer": 0,
        "explanation": "The ideal geometric fraction is π/(3√2), about 0.7405."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/10-6-lattice-structures-in-crystalline-solids",
    "sourceTitle": "OpenStax · Crystalline solids",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "electrolysis",
    "title": "Split water with charge",
    "kind": "electrolysis",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "grades": [
      10,
      11,
      12
    ],
    "description": "Compare charge passed with the hydrogen and oxygen produced in ideal water electrolysis.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Compare charge passed with the hydrogen and oxygen produced in ideal water electrolysis.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "An external source drives charge through a conducting electrolyte system. Hydrogen evolves at the cathode in ideal water electrolysis.",
      "Oxygen evolves at the anode. The ideal hydrogen and oxygen amounts have a two-to-one ratio.",
      "Total charge is current multiplied by elapsed time. Ideal conducting water/electrolyte system with inert electrodes and 100% current efficiency. Gas volumes use the ideal-gas law. Hydrogen evolves at the cathode and oxygen at the anode. No overpotentials or competing electrolyte reactions are modeled."
    ],
    "terms": {
      "Faraday_constant": "Charge per mole of electrons, about 96485 C/mol.",
      "Electrolysis": "A driven electrochemical process using an external electrical source."
    },
    "formula": "n(H₂)=Q/(2F) · n(O₂)=Q/(4F)",
    "misconception": "The overall reaction is 2H₂O→2H₂+O₂.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Complete a conducting path",
        "text": "An external source drives charge through a conducting electrolyte system."
      },
      {
        "title": "Reduce at the cathode",
        "text": "Hydrogen evolves at the cathode in ideal water electrolysis."
      },
      {
        "title": "Oxidize at the anode",
        "text": "Oxygen evolves at the anode."
      },
      {
        "title": "Compare gas quantities",
        "text": "The ideal hydrogen and oxygen amounts have a two-to-one ratio."
      },
      {
        "title": "Apply Faraday’s law",
        "text": "Total charge is current multiplied by elapsed time."
      }
    ],
    "quiz": [
      {
        "question": "Ideal water electrolysis gives H₂:O₂ gas amount ratio…",
        "options": [
          "1:1",
          "1:2",
          "2:1",
          "4:3"
        ],
        "answer": 2,
        "explanation": "The overall reaction is 2H₂O→2H₂+O₂."
      },
      {
        "question": "Hydrogen evolves at the…",
        "options": [
          "Cathode",
          "Anode only",
          "Salt bridge",
          "Power plug"
        ],
        "answer": 0,
        "explanation": "Reduction occurs at the cathode."
      },
      {
        "question": "At fixed current, doubling time doubles…",
        "options": [
          "Charge passed",
          "The Faraday constant",
          "Pressure by definition",
          "The atom count in each molecule"
        ],
        "answer": 0,
        "explanation": "Q=It."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/17-7-electrolysis",
    "sourceTitle": "OpenStax · Electrochemistry",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "galvanic",
    "title": "A chemical source of voltage",
    "kind": "galvanic",
    "subject": "Chemistry",
    "chapter": "Electrochemistry",
    "grades": [
      10,
      11,
      12
    ],
    "description": "Follow electrons through a Daniell cell and see how concentration changes its voltage.",
    "minutes": 12,
    "color": "amber",
    "objectives": [
      "Follow electrons through a Daniell cell and see how concentration changes its voltage.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "Zinc oxidation and copper-ion reduction occur at separate electrodes. Zinc metal oxidizes to zinc ions and supplies electrons to the external wire.",
      "Copper ions accept electrons and can deposit as copper metal. Salt-bridge ions help maintain charge balance between the half-cells.",
      "The Nernst relation adjusts the ideal cell voltage using the stated concentration ratio. Ideal Zn/Cu cell with unit metal activities and concentration as activity. Half-cell concentrations are held fixed; E/R is an ideal external-load current without internal resistance. Salt-bridge and electron markers are representative, not a transport/aging solver."
    ],
    "terms": {
      "Anode": "The electrode where oxidation occurs.",
      "Cathode": "The electrode where reduction occurs."
    },
    "formula": "E = 1.10 − RT/(2F) ln([Zn²⁺]/[Cu²⁺])",
    "misconception": "Zinc oxidation provides electrons for copper-ion reduction.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Separate the half-cells",
        "text": "Zinc oxidation and copper-ion reduction occur at separate electrodes."
      },
      {
        "title": "Release electrons at zinc",
        "text": "Zinc metal oxidizes to zinc ions and supplies electrons to the external wire."
      },
      {
        "title": "Reduce copper ions",
        "text": "Copper ions accept electrons and can deposit as copper metal."
      },
      {
        "title": "Maintain ionic continuity",
        "text": "Salt-bridge ions help maintain charge balance between the half-cells."
      },
      {
        "title": "Change concentrations",
        "text": "The Nernst relation adjusts the ideal cell voltage using the stated concentration ratio."
      }
    ],
    "quiz": [
      {
        "question": "Electrons travel externally in this Daniell cell from…",
        "options": [
          "Zn to Cu",
          "Cu to Zn always",
          "Salt bridge to air",
          "Nowhere"
        ],
        "answer": 0,
        "explanation": "Zinc oxidation provides electrons for copper-ion reduction."
      },
      {
        "question": "The salt bridge carries mainly…",
        "options": [
          "Ions",
          "Electrons through metal",
          "Only photons",
          "No charge"
        ],
        "answer": 0,
        "explanation": "It provides ionic continuity and helps avoid charge buildup."
      },
      {
        "question": "At unit activities, the stated standard cell voltage is…",
        "options": [
          "1.10 V",
          "110 V",
          "0 V",
          "−10 V"
        ],
        "answer": 0,
        "explanation": "The ideal Zn/Cu model uses E°=1.10 V."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/17-2-galvanic-cells",
    "sourceTitle": "OpenStax · Electrochemistry",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "rutherford",
    "title": "A small target, a large deflection",
    "kind": "rutherford",
    "subject": "Chemistry",
    "chapter": "Atomic structure",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Send an alpha particle past a gold nucleus and compare impact parameter with scattering angle.",
    "minutes": 12,
    "color": "indigo",
    "objectives": [
      "Send an alpha particle past a gold nucleus and compare impact parameter with scattering angle.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "A positively charged alpha particle approaches the positively charged nucleus. A larger impact parameter generally produces a smaller deflection.",
      "A smaller impact parameter produces a larger scattering angle. At the same impact parameter, greater incident energy reduces the deflection angle.",
      "The trajectory conserves kinetic plus electrostatic potential energy to numerical accuracy. Classical repulsive Coulomb scattering, alpha charge +2e and gold nuclear charge +79e. Velocity-Verlet trajectory uses an enlarged zoomed nucleus; no nuclear force, electron screening, recoil or quantum corrections. Formula assumes asymptotic impact conditions."
    ],
    "terms": {
      "Impact_parameter": "The perpendicular miss distance of the asymptotic incoming path.",
      "Scattering_angle": "The change between incoming and outgoing travel directions."
    },
    "formula": "tan(χ/2)=k/(2Eb) · k=Z₁Z₂e²/(4πε₀)",
    "misconception": "Their positive nuclear charges produce Coulomb repulsion.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Aim at a small nucleus",
        "text": "A positively charged alpha particle approaches the positively charged nucleus."
      },
      {
        "title": "Compare a wide miss",
        "text": "A larger impact parameter generally produces a smaller deflection."
      },
      {
        "title": "Approach more closely",
        "text": "A smaller impact parameter produces a larger scattering angle."
      },
      {
        "title": "Change kinetic energy",
        "text": "At the same impact parameter, greater incident energy reduces the deflection angle."
      },
      {
        "title": "Check the model limits",
        "text": "The trajectory conserves kinetic plus electrostatic potential energy to numerical accuracy."
      }
    ],
    "quiz": [
      {
        "question": "An alpha particle and a gold nucleus have…",
        "options": [
          "Opposite charges",
          "Positive charges that repel",
          "No charge",
          "Only gravitational attraction"
        ],
        "answer": 1,
        "explanation": "Their positive nuclear charges produce Coulomb repulsion."
      },
      {
        "question": "At fixed energy, reducing impact parameter generally…",
        "options": [
          "Increases deflection",
          "Eliminates the field",
          "Makes every path straight",
          "Changes nuclear charge"
        ],
        "answer": 0,
        "explanation": "The Rutherford relation has a larger angle for smaller b."
      },
      {
        "question": "The displayed nucleus is…",
        "options": [
          "Enlarged for visibility",
          "A measured photograph",
          "A full electron cloud",
          "A gravity well only"
        ],
        "answer": 0,
        "explanation": "The visual scale is chosen to explain the scattering."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/2-2-evolution-of-atomic-theory",
    "sourceTitle": "OpenStax · Atomic structure",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "solubility",
    "title": "A gas dissolves under pressure",
    "kind": "solubility",
    "subject": "Chemistry",
    "chapter": "Solutions",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Change gas pressure and follow a dissolved concentration toward its Henry-law limit.",
    "minutes": 12,
    "color": "mint",
    "objectives": [
      "Change gas pressure and follow a dissolved concentration toward its Henry-law limit.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The gas above the liquid is held at a chosen partial pressure. Gas transfers toward the Henry-law concentration limit.",
      "Higher partial pressure raises the equilibrium dissolved concentration in this ideal model. The chosen Henry coefficient links concentration and pressure.",
      "Net transfer tends toward zero as the maintained-reservoir equilibrium is approached. Generic ideal dilute gas-solvent system with user-chosen Henry coefficient, fixed temperature and a maintained gas reservoir. First-order mass transfer from initially solute-free liquid. No named-gas fit, reaction or closed-vessel pressure change."
    ],
    "terms": {
      "Partial_pressure": "The pressure contribution associated with a component gas.",
      "Henry_coefficient": "The proportionality factor used here in Ceq=kHp."
    },
    "formula": "Ceq = kH p · C(t)=Ceq(1−e⁻ᵏᵗ)",
    "misconception": "Ceq=kHp.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Maintain a gas reservoir",
        "text": "The gas above the liquid is held at a chosen partial pressure."
      },
      {
        "title": "Transfer into the liquid",
        "text": "Gas transfers toward the Henry-law concentration limit."
      },
      {
        "title": "Increase partial pressure",
        "text": "Higher partial pressure raises the equilibrium dissolved concentration in this ideal model."
      },
      {
        "title": "Change the coefficient",
        "text": "The chosen Henry coefficient links concentration and pressure."
      },
      {
        "title": "Approach the limit",
        "text": "Net transfer tends toward zero as the maintained-reservoir equilibrium is approached."
      }
    ],
    "quiz": [
      {
        "question": "With fixed kH, doubling partial pressure doubles…",
        "options": [
          "The ideal concentration limit",
          "The exchange constant necessarily",
          "The molar gas constant",
          "Only the display time"
        ],
        "answer": 0,
        "explanation": "Ceq=kHp."
      },
      {
        "question": "As dissolved concentration approaches Ceq, net transfer…",
        "options": [
          "Falls toward zero",
          "Must increase forever",
          "Changes the gas into metal",
          "Makes pressure negative"
        ],
        "answer": 0,
        "explanation": "The rate is proportional to Ceq−C."
      },
      {
        "question": "These parameters describe…",
        "options": [
          "A generic teaching gas-solvent system",
          "Every real gas exactly",
          "A calibrated medical dose",
          "A full carbonate model"
        ],
        "answer": 0,
        "explanation": "The coefficient is user-selected and reactions are excluded."
      }
    ],
    "source": "https://openstax.org/books/chemistry-2e/pages/11-3-solubility",
    "sourceTitle": "OpenStax · Solutions",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "centrifuge",
    "title": "Separate with a spinning frame",
    "kind": "centrifuge",
    "subject": "Chemistry",
    "chapter": "Separation methods",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Track ideal particles moving outward in a centrifuge and compare size, density and speed.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Track ideal particles moving outward in a centrifuge and compare size, density and speed.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The rotor carries the sample fluid into rotation. A denser spherical particle drifts outward in the co-rotating frame.",
      "Larger particle diameter increases the ideal radial drift coefficient strongly. Higher angular speed increases the radial driving effect.",
      "The tracked particle stops at the modeled tube-wall radius. Dilute spherical particles in a co-rotating Newtonian fluid, Stokes drag and terminal radial drift; initial radius 3 cm, wall 8 cm. No Brownian motion, turbulence or particle interactions. Rotor rotation is visually slowed; physical settling time is stated."
    ],
    "terms": {
      "Relative_centrifugal_force": "Radial acceleration expressed relative to standard gravity.",
      "Stokes_drag": "Low-Reynolds-number drag on a small sphere in a viscous fluid."
    },
    "formula": "dr/dt = Δρ d²ω²r/(18η)",
    "misconception": "Acceleration is ω²r.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Spin the rotor",
        "text": "The rotor carries the sample fluid into rotation."
      },
      {
        "title": "Follow radial separation",
        "text": "A denser spherical particle drifts outward in the co-rotating frame."
      },
      {
        "title": "Change particle size",
        "text": "Larger particle diameter increases the ideal radial drift coefficient strongly."
      },
      {
        "title": "Change rotation speed",
        "text": "Higher angular speed increases the radial driving effect."
      },
      {
        "title": "Reach the wall",
        "text": "The tracked particle stops at the modeled tube-wall radius."
      }
    ],
    "quiz": [
      {
        "question": "Doubling rpm at fixed radius makes centrifugal acceleration…",
        "options": [
          "Four times as large",
          "Twice as large",
          "Half as large",
          "Unchanged"
        ],
        "answer": 0,
        "explanation": "Acceleration is ω²r."
      },
      {
        "question": "In this Stokes model, diameter enters the drift coefficient as…",
        "options": [
          "d²",
          "1/d",
          "d⁰",
          "log d only"
        ],
        "answer": 0,
        "explanation": "The driving-to-drag ratio gives a diameter-squared dependence."
      },
      {
        "question": "Increasing viscosity generally makes ideal settling…",
        "options": [
          "Slower",
          "Faster always",
          "Instantaneous",
          "Independent of drag"
        ],
        "answer": 0,
        "explanation": "The radial drift coefficient is inversely proportional to viscosity."
      }
    ],
    "source": "https://openstax.org/books/university-physics-volume-1/pages/6-4-drag-force-and-terminal-speed",
    "sourceTitle": "OpenStax · Separation methods",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "heart",
    "title": "One beat, two circulations",
    "kind": "heart",
    "subject": "Biology",
    "chapter": "Human physiology",
    "grades": [
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Follow blood through four heart chambers, the lungs and the body circuit.",
    "minutes": 12,
    "color": "rose",
    "objectives": [
      "Follow blood through four heart chambers, the lungs and the body circuit.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "Systemic venous blood returns to the right atrium. The right ventricle sends blood toward the lungs.",
      "Blood returning from the lungs enters the left atrium. The left ventricle pumps blood toward body tissues.",
      "Heart rate multiplied by stroke volume gives cardiac output. Conceptual chamber-and-vessel loop with an illustrative contraction waveform. Output is rate×stroke volume, not a pressure/valve-flow solver or patient model. Purple indicates lower oxygenation; real venous blood is dark red, not blue. Organ shape and timing are interpretive."
    ],
    "terms": {
      "Stroke_volume": "Blood volume ejected by a ventricle per beat.",
      "Cardiac_output": "Blood volume pumped per unit time."
    },
    "formula": "cardiac output = heart rate × stroke volume",
    "misconception": "72×70=5040 mL/min=5.04 L/min.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Enter the right side",
        "text": "Systemic venous blood returns to the right atrium."
      },
      {
        "title": "Go to the lungs",
        "text": "The right ventricle sends blood toward the lungs."
      },
      {
        "title": "Return to the left side",
        "text": "Blood returning from the lungs enters the left atrium."
      },
      {
        "title": "Supply the body",
        "text": "The left ventricle pumps blood toward body tissues."
      },
      {
        "title": "Count cardiac output",
        "text": "Heart rate multiplied by stroke volume gives cardiac output."
      }
    ],
    "quiz": [
      {
        "question": "72 beats/min × 70 mL/beat gives…",
        "options": [
          "5.04 L/min",
          "50.4 L/min",
          "0.504 mL/min",
          "142 L/min"
        ],
        "answer": 0,
        "explanation": "72×70=5040 mL/min=5.04 L/min."
      },
      {
        "question": "Blood leaves the right ventricle toward the…",
        "options": [
          "Lungs",
          "Left atrium directly",
          "Kidney tubule",
          "Aorta directly"
        ],
        "answer": 0,
        "explanation": "The right ventricle supplies the pulmonary circulation."
      },
      {
        "question": "The colour purple here means…",
        "options": [
          "Lower oxygenation as a diagram key",
          "Real blood is blue",
          "No red cells",
          "A measured oxygen saturation"
        ],
        "answer": 0,
        "explanation": "Real venous blood is dark red; colours are explanatory."
      }
    ],
    "source": "https://openstax.org/books/anatomy-and-physiology-2e/pages/19-4-cardiac-physiology",
    "sourceTitle": "OpenStax · Human physiology",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "nephron",
    "title": "Filter, reclaim, excrete",
    "kind": "nephron",
    "subject": "Biology",
    "chapter": "Human physiology",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Follow filtrate through a schematic nephron and balance water and a freely filtered solute.",
    "minutes": 12,
    "color": "mint",
    "objectives": [
      "Follow filtrate through a schematic nephron and balance water and a freely filtered solute.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "Filtration brings water and a freely filtered model solute into the nephron. Filtrate moves along a schematic tubule path.",
      "A chosen fraction of filtered water returns outside the urine stream. A chosen fraction of the freely filtered solute is also reabsorbed.",
      "Excreted solute divided by urine flow gives the urine concentration. Whole-nephron bookkeeping for a generic freely filtered solute, no secretion or protein binding. Fixed fractional reabsorption, no blood-pressure autoregulation or clinical prediction. Tubule geometry and transport markers are schematic."
    ],
    "terms": {
      "Filtration": "Movement into the nephron’s filtrate compartment.",
      "Reabsorption": "Return of filtered material out of the tubular urine pathway."
    },
    "formula": "urine flow = filtration × (1−water reabsorption)",
    "misconception": "The remaining fraction is 1%, so 120×0.01=1.2 mL/min.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Filter into the capsule",
        "text": "Filtration brings water and a freely filtered model solute into the nephron."
      },
      {
        "title": "Follow the tubule",
        "text": "Filtrate moves along a schematic tubule path."
      },
      {
        "title": "Reclaim water",
        "text": "A chosen fraction of filtered water returns outside the urine stream."
      },
      {
        "title": "Reclaim solute",
        "text": "A chosen fraction of the freely filtered solute is also reabsorbed."
      },
      {
        "title": "Account for excretion",
        "text": "Excreted solute divided by urine flow gives the urine concentration."
      }
    ],
    "quiz": [
      {
        "question": "120 mL/min filtration with 99% water reabsorbed gives urine flow…",
        "options": [
          "1.2 mL/min",
          "120 mL/min",
          "12 L/min",
          "0 mL/min always"
        ],
        "answer": 0,
        "explanation": "The remaining fraction is 1%, so 120×0.01=1.2 mL/min."
      },
      {
        "question": "If urine flow falls at fixed excreted solute rate, urine concentration…",
        "options": [
          "Rises",
          "Falls necessarily",
          "Is always zero",
          "Cannot be defined"
        ],
        "answer": 0,
        "explanation": "Concentration is solute amount per liquid volume."
      },
      {
        "question": "This model excludes…",
        "options": [
          "Tubular secretion",
          "Water reabsorption",
          "Filtration rate",
          "Solute bookkeeping"
        ],
        "answer": 0,
        "explanation": "It uses fixed reabsorption fractions and no secretory transport."
      }
    ],
    "source": "https://openstax.org/books/anatomy-and-physiology-2e/pages/25-4-microscopic-anatomy-of-the-kidney",
    "sourceTitle": "OpenStax · Human physiology",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "reflex",
    "title": "The short route to a response",
    "kind": "reflex",
    "subject": "Biology",
    "chapter": "Nervous system",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Follow a simplified sensory-spinal-motor pathway and compare signal travel delays.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Follow a simplified sensory-spinal-motor pathway and compare signal travel delays.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "A receptor initiates a sensory signal in the simplified pathway. The sensory signal travels toward the spinal relay.",
      "A stated synaptic delay adds to the neural path time. A motor signal travels toward the modeled effector.",
      "The model latency sums sensory travel, relay delay and motor travel. One simplified spinal reflex path with constant conduction speed and one aggregate synaptic delay. No detailed neuron, muscle-force or patient-response model. Pulse motion is slowed; calculated latency is in milliseconds."
    ],
    "terms": {
      "Reflex_arc": "A neural pathway linking sensory input to a response.",
      "Conduction_delay": "Travel time associated with signal propagation along an axon."
    },
    "formula": "latency = sensory length/speed + synaptic delay + motor length/speed",
    "misconception": "0.6/30=0.02 s=20 ms.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Detect a stimulus",
        "text": "A receptor initiates a sensory signal in the simplified pathway."
      },
      {
        "title": "Reach the spinal relay",
        "text": "The sensory signal travels toward the spinal relay."
      },
      {
        "title": "Include relay delay",
        "text": "A stated synaptic delay adds to the neural path time."
      },
      {
        "title": "Travel to an effector",
        "text": "A motor signal travels toward the modeled effector."
      },
      {
        "title": "Compare the latency",
        "text": "The model latency sums sensory travel, relay delay and motor travel."
      }
    ],
    "quiz": [
      {
        "question": "At 30 m/s, a 0.6 m path takes…",
        "options": [
          "20 ms",
          "20 s",
          "0.2 ms",
          "180 ms"
        ],
        "answer": 0,
        "explanation": "0.6/30=0.02 s=20 ms."
      },
      {
        "question": "The model’s total latency includes…",
        "options": [
          "Sensory, synaptic and motor delays",
          "Only muscle mass",
          "Only display speed",
          "No synapse"
        ],
        "answer": 0,
        "explanation": "The three stated contributions are added."
      },
      {
        "question": "Doubling conduction speed changes the axonal travel times to…",
        "options": [
          "Half",
          "Double",
          "Unchanged",
          "Zero exactly"
        ],
        "answer": 0,
        "explanation": "Travel time is distance divided by speed."
      }
    ],
    "source": "https://openstax.org/books/anatomy-and-physiology-2e/pages/12-1-basic-structure-and-function-of-the-nervous-system",
    "sourceTitle": "OpenStax · Nervous system",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "replication",
    "title": "Copy a strand, keep the code",
    "kind": "replication",
    "subject": "Biology",
    "chapter": "Molecular genetics",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Move a replication fork and check complementary bases in a semiconservative copy.",
    "minutes": 12,
    "color": "indigo",
    "objectives": [
      "Move a replication fork and check complementary bases in a semiconservative copy.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The short DNA segment has complementary old strands. The construction separates the old strands near a moving fork.",
      "New nucleotides are chosen by complementarity to each template. Each resulting double-stranded segment pairs an old strand with a new strand.",
      "The copied count reaches the template length at completion. Conceptual replication of a short DNA segment, starting from a prepared template. Complementarity and copied-base count are exact. Fork timing, enzyme sizes and strand geometry are schematic; no leading/lagging kinetics, mutation or proofreading solver."
    ],
    "terms": {
      "Complementarity": "Specific pairing of A with T and C with G in DNA.",
      "Semiconservative": "Each daughter double helix retains one parental strand."
    },
    "formula": "base pairing: A↔T · C↔G",
    "misconception": "Apply A↔T and C↔G at each position.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Read the templates",
        "text": "The short DNA segment has complementary old strands."
      },
      {
        "title": "Open a fork",
        "text": "The construction separates the old strands near a moving fork."
      },
      {
        "title": "Add complements",
        "text": "New nucleotides are chosen by complementarity to each template."
      },
      {
        "title": "Keep one old strand",
        "text": "Each resulting double-stranded segment pairs an old strand with a new strand."
      },
      {
        "title": "Finish the segment",
        "text": "The copied count reaches the template length at completion."
      }
    ],
    "quiz": [
      {
        "question": "The complement of ATGC is…",
        "options": [
          "TACG",
          "ATGC",
          "AAAA",
          "CGTA"
        ],
        "answer": 0,
        "explanation": "Apply A↔T and C↔G at each position."
      },
      {
        "question": "Semiconservative replication retains…",
        "options": [
          "One old strand in each daughter double helix",
          "No old strands",
          "Only old strands",
          "No base pairing"
        ],
        "answer": 0,
        "explanation": "Each daughter has one old and one new strand."
      },
      {
        "question": "The fork’s speed here is…",
        "options": [
          "Illustrative rather than a measured polymerase rate",
          "A clinical measurement",
          "Always faster than light",
          "A prediction for all cells"
        ],
        "answer": 0,
        "explanation": "The short-segment construction is staged for explanation."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication",
    "sourceTitle": "OpenStax · Molecular genetics",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "meiosis",
    "title": "Two divisions, four haploid sets",
    "kind": "meiosis",
    "subject": "Biology",
    "chapter": "Cell division",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Follow homolog separation and sister separation to four haploid sets.",
    "minutes": 12,
    "color": "purple",
    "objectives": [
      "Follow homolog separation and sister separation to four haploid sets.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The starting cell has two homologous pairs after DNA replication. The first division separates homologous chromosomes.",
      "Two haploid sets retain replicated chromosomes between divisions. The second division separates sister chromatids.",
      "The final products each have n=2 chromosomes. Conceptual meiosis starting after DNA replication, with two homologous chromosome pairs. First division separates homologs; second separates sisters. Stage durations and spindle geometry are schematic. Crossing-over and stochastic assortment are not explicitly calculated."
    ],
    "terms": {
      "Homologs": "Corresponding chromosomes carrying the same categories of genes.",
      "Haploid": "Having one chromosome set."
    },
    "formula": "one replicated 2n=4 cell → four n=2 products",
    "misconception": "Homologs separate in the first division.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Pair homologs",
        "text": "The starting cell has two homologous pairs after DNA replication."
      },
      {
        "title": "Separate homologs",
        "text": "The first division separates homologous chromosomes."
      },
      {
        "title": "Prepare the second division",
        "text": "Two haploid sets retain replicated chromosomes between divisions."
      },
      {
        "title": "Separate sisters",
        "text": "The second division separates sister chromatids."
      },
      {
        "title": "Form four haploid sets",
        "text": "The final products each have n=2 chromosomes."
      }
    ],
    "quiz": [
      {
        "question": "Meiosis I primarily separates…",
        "options": [
          "Homologous chromosomes",
          "Sister chromatids in every case",
          "Only cytoplasm",
          "DNA bases"
        ],
        "answer": 0,
        "explanation": "Homologs separate in the first division."
      },
      {
        "question": "DNA replication occurs between meiosis I and II…",
        "options": [
          "Not in ordinary meiosis",
          "Once per chromosome at metaphase II",
          "Continuously",
          "Only in gametes afterward"
        ],
        "answer": 0,
        "explanation": "One replication precedes the two meiotic divisions."
      },
      {
        "question": "A starting 2n=4 model ends with…",
        "options": [
          "Four n=2 products",
          "Two 2n=4 products only",
          "Four n=4 products",
          "No chromosomes"
        ],
        "answer": 0,
        "explanation": "The final products are haploid with two chromosomes each."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis",
    "sourceTitle": "OpenStax · Cell division",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "transpiration",
    "title": "From roots to the air",
    "kind": "transpiration",
    "subject": "Biology",
    "chapter": "Plant physiology",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Connect stomatal opening and humidity with an illustrative leaf-water loss rate.",
    "minutes": 12,
    "color": "mint",
    "objectives": [
      "Connect stomatal opening and humidity with an illustrative leaf-water loss rate.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "Water enters a plant-water pathway and can leave through leaf surfaces. Stomatal opening changes the chosen conductance in the teaching model.",
      "Higher relative humidity reduces the vapour-pressure deficit at fixed temperature. Temperature changes saturation vapour pressure and therefore the driving difference.",
      "Flux multiplied by leaf area gives an illustrative water-loss rate. Tetens saturation-vapour-pressure approximation, air pressure 101325 Pa, teaching maximum stomatal conductance 0.15 mol/(m²·s), no species calibration. Fixed leaf temperature; no energy balance or hydraulic cavitation solver."
    ],
    "terms": {
      "Stoma": "A regulated leaf pore involved in gas and water-vapour exchange.",
      "Vapour_pressure_deficit": "The difference between saturation and ambient water-vapour pressure."
    },
    "formula": "water flux = gs × VPD / air pressure",
    "misconception": "The vapour-pressure deficit falls.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Begin with roots and leaves",
        "text": "Water enters a plant-water pathway and can leave through leaf surfaces."
      },
      {
        "title": "Open the stomata",
        "text": "Stomatal opening changes the chosen conductance in the teaching model."
      },
      {
        "title": "Compare humid air",
        "text": "Higher relative humidity reduces the vapour-pressure deficit at fixed temperature."
      },
      {
        "title": "Change leaf temperature",
        "text": "Temperature changes saturation vapour pressure and therefore the driving difference."
      },
      {
        "title": "Read the water loss",
        "text": "Flux multiplied by leaf area gives an illustrative water-loss rate."
      }
    ],
    "quiz": [
      {
        "question": "At fixed temperature, higher humidity generally makes this flux…",
        "options": [
          "Smaller",
          "Larger always",
          "Infinite",
          "Independent of the deficit"
        ],
        "answer": 0,
        "explanation": "The vapour-pressure deficit falls."
      },
      {
        "question": "At zero modeled stomatal opening, stomatal flux is…",
        "options": [
          "Zero",
          "Maximum",
          "Negative by definition",
          "Unchanged"
        ],
        "answer": 0,
        "explanation": "Conductance is proportional to the opening fraction."
      },
      {
        "question": "Doubling leaf area at the same flux per area doubles…",
        "options": [
          "Total water loss",
          "The saturation pressure",
          "The gas constant",
          "The humidity"
        ],
        "answer": 0,
        "explanation": "Total rate is area multiplied by area-specific flux."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants",
    "sourceTitle": "OpenStax · Plant physiology",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "foodweb",
    "title": "Energy through an ecosystem",
    "kind": "foodweb",
    "subject": "Biology",
    "chapter": "Ecology",
    "grades": [
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Follow one food-chain pathway and compare transferred with untransferred energy.",
    "minutes": 12,
    "color": "mint",
    "objectives": [
      "Follow one food-chain pathway and compare transferred with untransferred energy.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The selected producer energy is the starting input to one chain pathway. Only a chosen fraction becomes the next level’s energy input.",
      "Repeated fractional transfer reduces the energy available at higher levels. Untransferred energy is not the same as energy being destroyed.",
      "A longer chain has a smaller top-level input under fixed efficiency. One simplified chain within a food web, equal chosen transfer efficiency at each step. Untransferred energy includes respiration, waste and uneaten material, not only heat. No organism-population or full ecosystem simulation."
    ],
    "terms": {
      "Trophic_level": "A feeding position in a food-chain pathway.",
      "Transfer_efficiency": "The chosen fraction transferred from one level to the next."
    },
    "formula": "energy at level n = producer energy × efficiencyⁿ",
    "misconception": "10000×0.1=1000 kJ.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Start with producers",
        "text": "The selected producer energy is the starting input to one chain pathway."
      },
      {
        "title": "Transfer to a herbivore",
        "text": "Only a chosen fraction becomes the next level’s energy input."
      },
      {
        "title": "Transfer again",
        "text": "Repeated fractional transfer reduces the energy available at higher levels."
      },
      {
        "title": "Account for the rest",
        "text": "Untransferred energy is not the same as energy being destroyed."
      },
      {
        "title": "Compare a longer chain",
        "text": "A longer chain has a smaller top-level input under fixed efficiency."
      }
    ],
    "quiz": [
      {
        "question": "At 10% efficiency, 10000 kJ becomes at the next level…",
        "options": [
          "1000 kJ",
          "10000 kJ",
          "100 kJ",
          "100000 kJ"
        ],
        "answer": 0,
        "explanation": "10000×0.1=1000 kJ."
      },
      {
        "question": "Untransferred energy includes…",
        "options": [
          "Waste, respiration and uneaten material",
          "Only destroyed energy",
          "Only light",
          "No other pathways"
        ],
        "answer": 0,
        "explanation": "It can move into other ecosystem and thermal pathways."
      },
      {
        "question": "This representation is…",
        "options": [
          "One chain path within a web",
          "A census of all species",
          "A calibrated global ecosystem",
          "A model of unlimited growth"
        ],
        "answer": 0,
        "explanation": "Its scope is a simplified pathway with a chosen efficiency."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems",
    "sourceTitle": "OpenStax · Ecology",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "population",
    "title": "Growth meets a limit",
    "kind": "population",
    "subject": "Biology",
    "chapter": "Population ecology",
    "grades": [
      9,
      10,
      11,
      12
    ],
    "description": "Compare early growth with the slowing effect of a fixed carrying capacity.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Compare early growth with the slowing effect of a fixed carrying capacity.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The population begins below a fixed carrying capacity. Early growth can be approximately exponential when N is small relative to K.",
      "As N approaches K, the limiting factor reduces net growth. At N=K the deterministic net growth rate is zero.",
      "Changing r alters the approach speed; changing K alters the model limit. Deterministic continuous logistic population, constant carrying capacity and rate, no age structure, migration, predation or random events. Dots are representative; N is an expected continuous model quantity."
    ],
    "terms": {
      "Carrying_capacity": "The fixed population level limiting growth in this model.",
      "Intrinsic_rate": "The rate parameter of logistic growth."
    },
    "formula": "dN/dt = rN(1−N/K)",
    "misconception": "The factor 1−N/K becomes zero at K.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Begin below capacity",
        "text": "The population begins below a fixed carrying capacity."
      },
      {
        "title": "Grow rapidly",
        "text": "Early growth can be approximately exponential when N is small relative to K."
      },
      {
        "title": "Feel the constraint",
        "text": "As N approaches K, the limiting factor reduces net growth."
      },
      {
        "title": "Approach capacity",
        "text": "At N=K the deterministic net growth rate is zero."
      },
      {
        "title": "Compare rate and capacity",
        "text": "Changing r alters the approach speed; changing K alters the model limit."
      }
    ],
    "quiz": [
      {
        "question": "In the logistic model, growth is zero at…",
        "options": [
          "N=K",
          "Every positive N",
          "N=K/2 only",
          "Every small population"
        ],
        "answer": 0,
        "explanation": "The factor 1−N/K becomes zero at K."
      },
      {
        "question": "At very small N/K, growth is approximately…",
        "options": [
          "Exponential",
          "Instantly zero",
          "A fixed linear loss",
          "Unrelated to r"
        ],
        "answer": 0,
        "explanation": "The density-limitation factor is close to one."
      },
      {
        "question": "The dots represent…",
        "options": [
          "A scaled visualization of a continuous model",
          "Every real individual exactly",
          "Only deaths",
          "A guaranteed future census"
        ],
        "answer": 0,
        "explanation": "No stochastic individual-level process is calculated."
      }
    ],
    "source": "https://openstax.org/books/biology-2e/pages/45-3-environmental-limits-to-population-growth",
    "sourceTitle": "OpenStax · Population ecology",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "watercycle",
    "title": "The same water, many journeys",
    "kind": "watercycle",
    "subject": "Earth & Space",
    "chapter": "Water cycle",
    "grades": [
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Transfer water among ocean, air, land and ice while conserving the model’s total.",
    "minutes": 12,
    "color": "blue",
    "objectives": [
      "Transfer water among ocean, air, land and ice while conserving the model’s total.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "Water is distributed among ocean, atmosphere, land and ice reservoirs. Evaporation transfers water from the ocean to the atmospheric reservoir.",
      "Precipitation transfers atmospheric water toward land water in this four-box model. Freezing and melting transfer water between land and ice.",
      "Reservoir amounts change while their total remains fixed. Four well-mixed reservoirs, initial total 1000 relative water units. Linear transfers and numerical mass-conserving integration. Coefficients are teaching choices, not an Earth/climate calibration; no atmospheric energy or global water budget claim."
    ],
    "terms": {
      "Reservoir": "A model storage compartment for water.",
      "Flux": "A transfer rate between compartments."
    },
    "formula": "ocean + atmosphere + land + ice = constant",
    "misconception": "Every transfer leaves one reservoir and enters another.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Store water in different places",
        "text": "Water is distributed among ocean, atmosphere, land and ice reservoirs."
      },
      {
        "title": "Move water to the air",
        "text": "Evaporation transfers water from the ocean to the atmospheric reservoir."
      },
      {
        "title": "Return precipitation",
        "text": "Precipitation transfers atmospheric water toward land water in this four-box model."
      },
      {
        "title": "Exchange with ice",
        "text": "Freezing and melting transfer water between land and ice."
      },
      {
        "title": "Check conservation",
        "text": "Reservoir amounts change while their total remains fixed."
      }
    ],
    "quiz": [
      {
        "question": "The total model water…",
        "options": [
          "Remains constant",
          "Must grow with evaporation",
          "Vanishes in clouds",
          "Equals only the ocean"
        ],
        "answer": 0,
        "explanation": "Every transfer leaves one reservoir and enters another."
      },
      {
        "question": "Evaporation moves modeled water from…",
        "options": [
          "Ocean to atmosphere",
          "Ice to rock only",
          "Atmosphere to land",
          "Land to no reservoir"
        ],
        "answer": 0,
        "explanation": "The selected transfer is ocean→air."
      },
      {
        "question": "These coefficients are…",
        "options": [
          "Teaching parameters",
          "Official calibrated Earth forecasts",
          "Exact rainfall predictions",
          "A full climate model"
        ],
        "answer": 0,
        "explanation": "They illustrate a conservative reservoir system."
      }
    ],
    "source": "https://www.usgs.gov/special-topics/water-science-school/science/water-cycle",
    "sourceTitle": "USGS · Water cycle",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "seasons",
    "title": "Tilt changes the sunlight",
    "kind": "seasons",
    "subject": "Earth & Space",
    "chapter": "Earth–Sun system",
    "grades": [
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Change tilt, latitude and season to compare day length and noon Sun altitude.",
    "minutes": 12,
    "color": "amber",
    "objectives": [
      "Change tilt, latitude and season to compare day length and noon Sun altitude.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The rotation axis keeps a fixed direction as Earth goes around the Sun. Axial tilt changes the Sun’s declination through the year.",
      "Half an orbit later, the opposite hemisphere is favoured. Latitude changes noon altitude and day length for the same date.",
      "With zero tilt, this geometric seasonal variation disappears. Circular Earth orbit, fixed axis direction, approximate 365.2422-day year and solar constant 1361 W/m². Day length and daily top-of-atmosphere irradiance are geometric, without refraction, atmosphere, terrain or climate."
    ],
    "terms": {
      "Declination": "The Sun’s angular position north or south of Earth’s equatorial plane.",
      "Axial_tilt": "The inclination of the rotation axis relative to the orbital normal."
    },
    "formula": "solar declination = asin(sin tilt × sin annual angle)",
    "misconception": "Tilt changes illumination angle and day length.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Keep the axis directed",
        "text": "The rotation axis keeps a fixed direction as Earth goes around the Sun."
      },
      {
        "title": "Tilt a hemisphere toward the Sun",
        "text": "Axial tilt changes the Sun’s declination through the year."
      },
      {
        "title": "Compare the other season",
        "text": "Half an orbit later, the opposite hemisphere is favoured."
      },
      {
        "title": "Move the observer latitude",
        "text": "Latitude changes noon altitude and day length for the same date."
      },
      {
        "title": "Try zero tilt",
        "text": "With zero tilt, this geometric seasonal variation disappears."
      }
    ],
    "quiz": [
      {
        "question": "The main geometric cause of seasons is…",
        "options": [
          "Axial tilt",
          "Daily rotation alone",
          "A required changing Earth–Sun distance",
          "The Moon’s phase"
        ],
        "answer": 0,
        "explanation": "Tilt changes illumination angle and day length."
      },
      {
        "question": "The two hemispheres generally have…",
        "options": [
          "Opposite seasons",
          "Identical summer dates always",
          "No tilt effect",
          "The same day length everywhere"
        ],
        "answer": 0,
        "explanation": "A hemisphere tilted toward the Sun is paired with the other tilted away."
      },
      {
        "question": "With zero tilt in this circular-orbit model…",
        "options": [
          "Seasonal illumination variation from tilt disappears",
          "Earth stops orbiting",
          "Every day is dark",
          "Gravity becomes zero"
        ],
        "answer": 0,
        "explanation": "The Sun stays on the modeled equatorial plane."
      }
    ],
    "source": "https://spaceplace.nasa.gov/seasons/en/",
    "sourceTitle": "NASA · Earth–Sun system",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "moon",
    "title": "Read the Moon’s changing face",
    "kind": "moon",
    "subject": "Earth & Space",
    "chapter": "Moon phases",
    "grades": [
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Connect Sun–Earth–Moon geometry with the illuminated fraction seen from Earth.",
    "minutes": 12,
    "color": "indigo",
    "objectives": [
      "Connect Sun–Earth–Moon geometry with the illuminated fraction seen from Earth.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "Sunlight illuminates half of the Moon’s sphere. Near new moon, only a small part of the illuminated surface faces Earth.",
      "At a quarter phase, half the visible disc is illuminated. At opposition in this phase-only model, the visible disc is fully illuminated.",
      "The visible illuminated fraction decreases after full moon. Circular coplanar phase geometry with distant sunlight. The Earth-view phase disc is separate from the orbital diagram. Sizes/distances are compressed. Eclipses, libration and lunar topography are omitted."
    ],
    "terms": {
      "Elongation": "The modeled Sun–Moon angular separation as seen from Earth.",
      "Waxing": "Increasing illuminated fraction between new and full phases."
    },
    "formula": "illuminated fraction = (1−cos elongation)/2",
    "misconception": "Quarter describes the orbital phase position.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Place Sun, Earth and Moon",
        "text": "Sunlight illuminates half of the Moon’s sphere."
      },
      {
        "title": "Read a crescent",
        "text": "Near new moon, only a small part of the illuminated surface faces Earth."
      },
      {
        "title": "Reach a quarter",
        "text": "At a quarter phase, half the visible disc is illuminated."
      },
      {
        "title": "Reach full moon",
        "text": "At opposition in this phase-only model, the visible disc is fully illuminated."
      },
      {
        "title": "Return through waning phases",
        "text": "The visible illuminated fraction decreases after full moon."
      }
    ],
    "quiz": [
      {
        "question": "At a quarter phase, the visible illuminated fraction is…",
        "options": [
          "One half",
          "One quarter",
          "Zero",
          "Always full"
        ],
        "answer": 0,
        "explanation": "Quarter describes the orbital phase position."
      },
      {
        "question": "The phase cycle is mainly due to…",
        "options": [
          "Viewing geometry of the sunlit Moon",
          "Earth’s shadow at every phase",
          "The Moon making its own light",
          "Cloud cover"
        ],
        "answer": 0,
        "explanation": "Ordinary phases depend on the relative Sun–Earth–Moon geometry."
      },
      {
        "question": "This phase model predicts eclipses…",
        "options": [
          "No; eclipses are excluded",
          "Every full moon",
          "Every day",
          "Only at quarter phases"
        ],
        "answer": 0,
        "explanation": "The phase geometry deliberately omits eclipse alignment and shadowing."
      }
    ],
    "source": "https://science.nasa.gov/moon/moon-phases/",
    "sourceTitle": "NASA · Moon phases",
    "review": "Editorial draft · expert review pending"
  },
  {
    "id": "seismic",
    "title": "Two arrivals from one quake",
    "kind": "seismic",
    "subject": "Earth & Space",
    "chapter": "Earthquakes",
    "grades": [
      8,
      9,
      10,
      11,
      12
    ],
    "description": "Compare P and S arrivals and infer source distance from their time separation.",
    "minutes": 12,
    "color": "rose",
    "objectives": [
      "Compare P and S arrivals and infer source distance from their time separation.",
      "Use the displayed equation to interpret a changed input.",
      "Distinguish calculated quantities from the stated visual and timing simplifications."
    ],
    "explanation": [
      "The source launches P and S wavefronts into a uniform model medium. The faster P wave reaches the station first.",
      "The slower S wave arrives later. The difference between inverse speeds converts the S−P delay into a distance.",
      "Real Earth structure can change ray paths and travel times. Straight paths through a uniform medium, constant speeds and one source-station distance. Wavefronts and seismograms are schematic; no depth inversion, heterogeneous Earth, magnitude estimate or earthquake prediction."
    ],
    "terms": {
      "P_wave": "A faster compressional seismic body wave in this model.",
      "S_wave": "A slower shear seismic body wave in this model."
    },
    "formula": "distance = (tS−tP) / (1/vS−1/vP)",
    "misconception": "The allowed controls keep vP greater than vS.",
    "activity": "Change one input while holding the others fixed. Compare the calculated values and the animated process; pause at a turning point or transition and explain the result.",
    "steps": [
      {
        "title": "Create two wavefronts",
        "text": "The source launches P and S wavefronts into a uniform model medium."
      },
      {
        "title": "Receive P first",
        "text": "The faster P wave reaches the station first."
      },
      {
        "title": "Receive S later",
        "text": "The slower S wave arrives later."
      },
      {
        "title": "Infer a distance",
        "text": "The difference between inverse speeds converts the S−P delay into a distance."
      },
      {
        "title": "State the limits",
        "text": "Real Earth structure can change ray paths and travel times."
      }
    ],
    "quiz": [
      {
        "question": "Which modeled wave arrives first?",
        "options": [
          "P",
          "S",
          "Both always together",
          "Neither can travel"
        ],
        "answer": 0,
        "explanation": "The allowed controls keep vP greater than vS."
      },
      {
        "question": "At fixed speeds, larger S−P delay indicates…",
        "options": [
          "Greater source–station distance",
          "Smaller distance always",
          "No source",
          "A predicted next earthquake"
        ],
        "answer": 0,
        "explanation": "The lag is d(1/vS−1/vP)."
      },
      {
        "question": "One station’s lag alone gives…",
        "options": [
          "A distance, not a unique surface location",
          "A complete global forecast",
          "Exact earthquake magnitude",
          "No useful model quantity"
        ],
        "answer": 0,
        "explanation": "Additional station geometry is needed for localization."
      }
    ],
    "source": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
    "sourceTitle": "USGS · Earthquakes",
    "review": "Editorial draft · expert review pending"
  }
];
