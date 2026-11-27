"""Physical and numerical mutation challenges for the independent CL-0107 reference."""
import copy,json,tempfile
from pathlib import Path
from validate_salt_corrosion import validate
root=Path('reports/chemistry-expansion/CL-0107');rows=json.loads((root/'core-reference.json').read_text());positive=next(i for i,r in enumerate(rows)if r['state']['convertedIronG']>.001);tiny=next(i for i,r in enumerate(rows)if 0<r['state']['convertedIronG']<1e-20);done=next(i for i,r in enumerate(rows)if r['state']['exhausted']);fresh=next(i for i,r in enumerate(rows)if r['state']['percent']==0);delta=next(i for i,r in enumerate(rows)if r.get('comparison',{}).get('deltaIronLossG',0)!=0)
s=rows[positive]['state'];cases=[('missing-further-oxygen',positive,'furtherOxygenMol',0),('incorrect-cathodic-only-ceiling',positive,'oxygenCeilingAM2',s['oxygenCeilingAM2']*1.5),('product-without-oxygen-water-uptake',positive,'productReferenceG',s['convertedIronG']),('erased-trace-penetration',tiny,'penetrationPerFaceMm',0),('current-after-exhaustion',done,'instantaneousCurrentA',rows[done]['state']['initialCurrentA']),('missing-water-conductivity',fresh,'conductivitySM',0),('missing-makeup-water-input',positive,'externalInputG',s['oxygenSuppliedG'])];results=[]
with tempfile.TemporaryDirectory()as folder:
 for name,index,key,value in cases:
  modified=copy.deepcopy(rows);modified[index]['state'][key]=value;path=Path(folder)/(name+'.json');path.write_text(json.dumps(modified))
  try:validate(path)
  except AssertionError:results.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Mutation escaped: '+name)
 modified=copy.deepcopy(rows);modified[delta]['comparison']['deltaIronLossG']*=-1;path=Path(folder)/'reversed-comparison.json';path.write_text(json.dumps(modified))
 try:validate(path)
 except AssertionError:results.append({'mutation':'reversed-comparison','rejected':True})
 else:raise AssertionError('Comparison mutation escaped')
(root/'core-reference-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print('PASS',len(results),'mutations rejected')
