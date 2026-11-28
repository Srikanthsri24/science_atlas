import json,copy,tempfile
from pathlib import Path
from validate_zinc_protection import validate
original=json.loads(Path('reports/chemistry-expansion/CL-0108/core-reference.json').read_text())
results=[]
def corrupt(name,choose,edit):
 data=copy.deepcopy(original);target=next(c for row in data for c in row['cells']if choose(c));edit(target)
 with tempfile.TemporaryDirectory()as d:
  p=Path(d)/'mutation.json';p.write_text(json.dumps(data))
  try:validate(p)
  except AssertionError:results.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Mutation escaped: '+name)
corrupt('wrong-primary-electron-count',lambda c:c['primaryChargeC']>1,lambda c:c.update(primaryChargeC=c['primaryChargeC']*1.5))
corrupt('wrong-oxygen-reduction-account',lambda c:c['oxygenSuppliedMol']>1e-6,lambda c:c.update(oxygenSuppliedMol=c['oxygenSuppliedMol']*2))
corrupt('missing-external-water',lambda c:c['waterSuppliedG']>1e-4,lambda c:c.update(waterSuppliedG=0))
corrupt('invented-isolated-contact',lambda c:c['id']=='isolated',lambda c:c.update(metalContact=True))
corrupt('current-after-iron-exhaustion',lambda c:c['ironExhausted'],lambda c:c.update(ironCurrentA=1e-6))
corrupt('unaccounted-stock-zinc',lambda c:c['unappliedZincG']>1e-3,lambda c:c.update(unappliedZincG=0))
corrupt('erased-small-post-event-iron-conversion',lambda c:0<c['convertedIronG']<1e-6,lambda c:c.update(convertedIronG=0))
corrupt('wrong-active-phase-current',lambda c:any(s['ironCurrentA']>1e-8 for s in c['stages']),lambda c:next(s for s in c['stages']if s['ironCurrentA']>1e-8).update(ironCurrentA=1))
corrupt('broken-phase-timeline',lambda c:len(c['stages'])>1,lambda c:c['stages'][1].update(startS=c['stages'][1]['startS']+1))
Path('reports/chemistry-expansion/CL-0108/core-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n')
print('PASS',len(results),'mutations rejected')
