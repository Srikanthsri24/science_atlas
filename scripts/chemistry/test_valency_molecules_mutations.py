import copy,json,sys
from pathlib import Path
from validate_valency_molecules import audit
rows=json.loads(Path(sys.argv[1]).read_text());base=next(r for r in rows if r['input']['targetId']=='H2O'and r['state']['complete']);mutations=[]
for key in ['totalValenceElectrons','trayElectrons','bondOrderTotal','bondElectrons','lonePairCount','nonbondingElectrons','unassignedElectrons','residual']:
 r=copy.deepcopy(base);r['state'][key]+=1;mutations.append((key,r))
for key in ['bondOrderSum','lonePairs','electronsAround','remainingBondAllowance','unassignedElectrons']:
 r=copy.deepcopy(base);r['state']['atoms'][0][key]+=1;mutations.append(('atom.'+key,r))
r=copy.deepcopy(base);r['state']['complete']=False;mutations.append(('false completion',r))
r=copy.deepcopy(base);r['state']['targetConnectivity']=False;mutations.append(('wrong connectivity',r))
for name,r in mutations:
 try:audit([r])
 except AssertionError:continue
 raise AssertionError('Accepted corruption: '+name)
print(json.dumps(dict(rejectedCorruptions=len(mutations),checks=[n for n,_ in mutations])))
