import copy,json,sys
from pathlib import Path
from validate_particle_arrangements import validate
rows=json.loads(Path(sys.argv[1]).read_text());base=rows[0];cases=[]
for key in['rawSodium','rawChloride','effectiveSodium','effectiveChloride','formulaUnits','weightedChargeUnits','rawBoundaryCopyChargeUnits','selectedShownNeighbours','selectedOutsideNeighbours','molecularAtoms','molecularBondOrder','molecularIntergroupCovalentBonds']:
 r=copy.deepcopy(base);r['state'][key]+=1;cases.append((key,r))
r=copy.deepcopy(base);r['state']['groups'][1]['weight']=1;cases.append(('corner sharing erased',r))
r=copy.deepcopy(base);r['state']['neighbours'][0]['distanceCellUnits']=1;cases.append(('nearest-neighbour distance',r))
r=copy.deepcopy(base);r['state']['neighbours'][0]['species']=r['state']['selected']['species'];cases.append(('neighbour charge identity',r))
r=copy.deepcopy(base);r['state']['molecularElements'][next(iter(r['state']['molecularElements']))]+=1;cases.append(('molecular atom ratio',r))
for name,r in cases:
 try:validate([r])
 except AssertionError:continue
 raise AssertionError('Accepted corruption: '+name)
print(json.dumps(dict(rejectedCorruptions=len(cases),checks=[name for name,_ in cases])))
