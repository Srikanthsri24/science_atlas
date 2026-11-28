import copy,json
from pathlib import Path
from validate_water_impurities import validate
rows=json.loads(Path('reports/chemistry-expansion/CL-0114/core-reference.json').read_text());base=next(r for r in rows if r['input']['rinseMl']==1e-12 and r['input']['holdUpFraction']==.2 and r['input']['filteredFraction']==1 and r['input']['dryFraction']==1 and r['input']['retention']==.5)
mutations={
 'erased-trace-rinsed-salt':('rinsedSaltG',0),
 'erased-retained-salt':('cakeSaltG',0),
 'double-counted-rinse':('rinseCarrierG',20),
 'lost-vapour':('vapourG',0),
 'inverted-retention':('retainedSolidG',.1),
 'false-clear-water-safety':('id','safe-drinking-water'),
 'incorrect-dry-observation':('dryObservationReady',False),
 'wrong-mg-per-litre':('apparentRetainedMgL',1),
 'incorrect-salt-fraction':('saltCarryoverFraction',1),
 'unbalanced-material':('materialResidualG',.001),
 'unbalanced-salt':('saltResidualG',.001),
 'unbalanced-particles':('solidResidualG',.001),
 'wrong-tare':('filterDryGrossG',0),
 'receiver-residue-lost':('receiverDryMaterialG',0),
 'wrong-exponential':('rinseRemainingFraction',.5),
 'wrong-rinse-removed-fraction':('rinseRemovedFraction',0),
}
results=[]
for name,(key,value) in mutations.items():
 row=copy.deepcopy(base);assert row['cells'][3][key]!=value,(name,'mutation unchanged');row['cells'][3][key]=value
 try:validate([row])
 except (AssertionError,ValueError,KeyError):results.append({'corruption':name,'rejected':True})
 else:raise AssertionError('Corruption escaped: '+name)
# Cancellation allowances must still reject erasing a tiny but resolved passed pool.
row=copy.deepcopy(next(r for r in rows if r['input']['retention']>.999999999 and r['input']['retention']<1));assert row['cells'][3]['passedSolidG']>0;row['cells'][3]['passedSolidG']=0
try:validate([row])
except AssertionError:results.append({'corruption':'erased-small-passed-solid','rejected':True})
else:raise AssertionError('Small passed solid vanished')
Path('reports/chemistry-expansion/CL-0114/core-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print(len(results),'core corruptions rejected')
