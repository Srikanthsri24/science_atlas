import copy,json
from pathlib import Path
from validate_neutral_atoms import validate
rows=json.loads(Path('reports/chemistry-expansion/CL-0115/core-reference.json').read_text());base=next(r for r in rows if r['input']=={'isotopeId':'C-12','protons':6,'neutrons':6,'electrons':6});partial=next(r for r in rows if r['input']['isotopeId']=='Ar-40'and r['state']['chargeUnits']>0)
mutations=[('wrong-protons',['inputs','protons'],5),('wrong-neutron-target',['target','neutronTarget'],7),('wrong-mass-number',['massNumber'],12.5),('mass-number-treated-as-atomic-number',['atomicNumber'],12),('missing-nucleon',['placedNucleons'],11),('wrong-ground-configuration',['target','configuration'],'1s2 2s2 2p3'),('wrong-shell-distribution',['placedShells'],[2,3]),('wrong-element-symbol',['target','symbol'],'N'),('wrong-neutral-electron-target',['target','electronTarget'],7),('false-incomplete-status',['complete'],False),('false-charge-balance',['netChargeBalanced'],False),('charge-unit-conversion',['protonChargeC'],6),('lost-electron-charge',['electronChargeC'],0),('wrong-missing-total',['missingTotal'],1),('invented-mass-unit',['massNumber'],'12 u')]
results=[]
for name,path,value in mutations:
 row=copy.deepcopy(base);obj=row['state']
 for k in path[:-1]:obj=obj[k]
 assert obj[path[-1]]!=value;obj[path[-1]]=value
 try:validate([row])
 except (AssertionError,ValueError,KeyError):results.append({'corruption':name,'rejected':True})
 else:raise AssertionError(name)
row=copy.deepcopy(partial);row['state']['chargeC']=0
try:validate([row])
except AssertionError:results.append({'corruption':'erased-nonzero-small-coulomb-charge','rejected':True})
else:raise AssertionError('Coulomb charge erased')
Path('reports/chemistry-expansion/CL-0115/core-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print(len(results),'corruptions rejected')
