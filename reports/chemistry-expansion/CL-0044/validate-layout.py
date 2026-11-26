import json,itertools
from pathlib import Path
p=Path('reports/chemistry-expansion/CL-0044');checks=[]
for f in sorted(p.glob('*.json')):
 d=json.loads(f.read_text())
 if not isinstance(d,dict) or 'noPageOverflow' not in d:continue
 errors=[k for k in ['noPageOverflow','noCanvasOverflow','noFooterClipping'] if not d[k]];a=d['stage']
 for t in d['texts']:
  r=t['rect']
  if r['x']<a['x']-1 or r['right']>a['right']+1 or r['y']<a['y']-1 or r['bottom']>a['bottom']+1:errors.append('outside:'+t['text'])
 for x,y in itertools.combinations(d['texts'],2):
  r,s=x['rect'],y['rect']
  if min(r['right'],s['right'])-max(r['x'],s['x'])>.8 and min(r['bottom'],s['bottom'])-max(r['y'],s['y'])>.8:errors.append('overlap:'+x['text']+'/'+y['text'])
 checks.append({'file':f.name,'passed':not errors,'issues':errors})
(p/'responsive-checks.json').write_text(json.dumps({'passed':all(x['passed'] for x in checks),'checks':checks},indent=2)+'\n');print('Final layout checks:',len(checks),'failures:',[x for x in checks if not x['passed']]);assert all(x['passed'] for x in checks)
