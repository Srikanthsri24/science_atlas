"""Mutation checks for CL-0106 independent material-account verifier."""
import json,tempfile,copy
from pathlib import Path
from validate_corrosion_conditions import validate
root=Path('reports/chemistry-expansion/CL-0106');rows=json.loads((root/'core-reference.json').read_text())
wet=next(i for i,r in enumerate(rows)if r['state']['id']=='wet-air'and r['inputs']['hydrationNumber']==3 and r['state']['productReferenceG']>0)
dry=next(i for i,r in enumerate(rows)if r['state']['id']=='dry-air'and r['inputs']['elapsedDays']==14)
tiny=next(i for i,r in enumerate(rows)if r['state']['id']=='wet-air'and r['inputs']['elapsedDays']==1e-12)
late=next(i for i,r in enumerate(rows)if r['state']['id']=='wet-air'and r['inputs']['ironG']==.2 and r['inputs']['accessibleOxygenMol']==.005 and r['inputs']['elapsedDays']==14 and r['inputs']['chosenRatePerDay']==1)
cases=[('tiny-converted-iron-erasure',tiny,'convertedIronG',0),('dry-control-product',dry,'productReferenceG',.001),('missing-hydration-water',wet,'hydrationWaterG',0),('missing-oxygen-product-mass',wet,'productReferenceG',rows[wet]['state']['convertedIronG']),('false-water-availability',dry,'conditionsPresent',True),('late-metal-erasure',late,'remainingIronG',0)]
results=[]
with tempfile.TemporaryDirectory()as folder:
 for name,index,key,value in cases:
  changed=copy.deepcopy(rows);changed[index]['state'][key]=value;path=Path(folder)/(name+'.json');path.write_text(json.dumps(changed))
  try:validate(path)
  except AssertionError:results.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Mutation escaped: '+name)
(root/'core-reference-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print('PASS',len(results),'mutations rejected')
