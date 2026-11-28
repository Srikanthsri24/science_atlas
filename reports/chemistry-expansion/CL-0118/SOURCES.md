# Private scientific provenance — CL-0118

Retrieved28November2026. Internal source references, not student-facing external referrals. EditorialClass8 path remains pending officialboardmapping.

- OpenStax Chemistry2e10.6: https://openstax.org/books/chemistry-2e/pages/10-6-lattice-structures-in-crystalline-solids — inspected official text. NaCl conventional cell contribution and nearest-neighbour reference; extended periodic structure and boundary sharing.
- OpenStax Chemistry2e10.5: https://openstax.org/books/chemistry-2e/pages/10-5-the-solid-state-of-matter — inspected official text. Distinguishes ionic, molecular and covalent-network solids. Do not generalize discrete molecules to all covalent materials. No melting-point/conductivity/solubility values imported; the arrangement alone does not calculate these properties.
- Frozen CL-0117 selectedH2O/CH4/CO2 atom/connectivity/shape references reused by import only. See itsSOURCES.md for geometry/Lewis provenance. No frozen files changed.

Implementation conventions: conventionalNaCl cell edge1normalizedcellunit; alternate chloride-even/sodium-odd sites on thehalf-cell grid. Closed displayed supercell contains redundant boundary copies. Corner/edge/face/interior sharing weights1/8,1/4,1/2,1 give4n³effectiveions ofeachspecies. Raw display copies differ byonechloride; their unweightedcharge−1 is not asserted as the charge of a physical isolated nanocrystal. Periodic neighbours extend beyond displayed boundaries; nearest opposite-charge distance0.5normalizedcellunits. Six physical neighbours retain distinct image IDs even when their canonicalperiodicsiteIDs coincide in a one-cellrepeat. Guide layeropening/scanning is visual inspection, not cleavage/reaction/dynamics.

Molecular comparison is a rack ofwhole selectedmolecules. Positions do not claim crystalpacking, phase, intermolecularforce magnitude or a measured state. No covalent links betweenrackgroups; this is a statementabout the selectedreferenceconstruction, not everycovalentsolid. Displayradius/lengthscales and guide timing arbitrary. No energies or property predictions.
