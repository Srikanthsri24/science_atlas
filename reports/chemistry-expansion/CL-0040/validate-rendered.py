import json,re,itertools
from pathlib import Path
p=Path('reports/chemistry-expansion/CL-0040');out=[]
for s in json.loads((p/'rendered-states.json').read_text()):
 portrait=s['viewBox'].split()[2]=='600';base=560 if portrait else 350;scale=12000 if portrait else 8500;gap=s['gapMm']/1000;m={'source':0.,'rising':0.,'captured':0.}
 for k in s['kernels']:
  xy=list(map(float,re.findall(r'[-+]?\d*\.?\d+(?:e[-+]?\d+)?',k['transform'])));height=(base-xy[1])/scale
  phase='source' if abs(height)<1e-12 else 'captured' if abs(height-gap)<1e-12 else 'rising';assert phase==k['phase'],(s['case'],k,height)
  m[phase]+=.5*(.8+.4*k['index']/23)
 assert abs(sum(m.values())+36-48)<1e-10
 tx=s['texts']
 for title,key in [('Source iron','source'),('Rising iron','rising'),('Captured iron','captured')]:
  value=float(tx[tx.index(title)+1].split()[0]);assert abs(value-m[key])<=.000501,(s['case'],title,value,m[key])
 recovery=float(tx[tx.index('Iron recovery')+1].replace('%',''));assert abs(recovery-100*m['captured']/12)<=.00501
 purity=tx[tx.index('Product purity')+1];assert purity==('Undefined' if not m['captured'] else '100.00%')
 out.append({'case':s['case'],'timeS':s['time'],'reconstructedIronG':m,'passed':True})
(p/'independent-gui-validation.json').write_text(json.dumps({'method':'No application model imported. Invert actual SVG transforms; classify source/rising/captured from physical height, independently weight declared cohorts and verify all displayed mass and percentage readings.','passed':len(out),'failed':0,'states':out},indent=2)+'\n');print('Independent rendered checks:',len(out))
