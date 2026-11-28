import copy,json
from pathlib import Path
from validate_starch_iodine import validate
rows=json.loads(Path('reports/chemistry-expansion/CL-0113/core-reference.json').read_text());validate(rows);out=[]
for key in ['starchG','glucoseG','sampleCarrierG','vialIodineEqMol','vialKiMol','associatedMmolL','associatedIodineEqMol','unassociatedIodineEqMol','unusedCapacityMol','associatedIodineEqG','stockG','pipetteG','vialG','materialResidualG','iodineAtomResidualMol','associationResidualMmolL2']:
 bad=copy.deepcopy([rows[100]]);bad[0]['cells'][0][key]+=.01
 try:validate(bad)
 except AssertionError:out.append({'field':key,'rejected':True})
 else:raise AssertionError('Corruption escaped: '+key)
tiny=next(r for r in rows if r['input']['capacityMmolG']==1e-6);assert 0<tiny['cells'][0]['associatedIodineEqMol']<1e-24
bad=copy.deepcopy([tiny]);bad[0]['cells'][0]['associatedIodineEqMol']=0
try:validate(bad)
except AssertionError:out.append({'field':'erased-tiny-positive-association','rejected':True})
else:raise AssertionError('Erased association escaped')
held=next(r for r in rows if r['input']['withdrawnMl']==2 and 0<r['cells'][0]['pipetteMl']<1e-10)
bad=copy.deepcopy([held]);bad[0]['cells'][0]['pipetteIodineEqMol']=0
try:validate(bad)
except AssertionError:out.append({'field':'erased-small-held-reagent','rejected':True})
else:raise AssertionError('Erased held inventory escaped')
Path('reports/chemistry-expansion/CL-0113/core-mutation-checks.json').write_text(json.dumps(out,indent=2)+'\n');print(len(out),'core corruptions rejected')
