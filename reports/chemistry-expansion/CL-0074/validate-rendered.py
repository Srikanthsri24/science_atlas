"""Independent reconstruction of actual DOM phase heights,band values and3D readings."""
from pathlib import Path
import json,math
p=Path(__file__).parent
source=(p/'validate-ui-record.py').read_text();namespace={'__file__':str(p/'validate-ui-record.py')};exec(source[:source.index('rows=json.loads')],namespace);reference=namespace['reference'];near=namespace['near']
cases=[json.loads(s) for s in (p/'responsive-rendered.jsonl').read_text().splitlines()];checks=0
for c in cases:
 assert c['documentWidth']<=c['width']+1,(c['label'],'overflow')
 assert c['canvas']['w']>100 and c['canvas']['h']>100,(c['label'],'collapsed')
 assert c['canvas']['w']<=c['root']['w']+1,(c['label'],'uncontainedcanvas')
 q={**c['q'],'timeSeconds':c['time']};s=reference(q,c['kind'],c['band'])
 if c['readings']['bMass'] is not None:
  for key,v in [('bMass',s['wholeB']),('aMass',s['wholeA']),('bandB',s['bMass']),('bandA',s['aMass'])]:near(c['readings'][key],v,(c['label'],key));checks+=1
 for column in c['columns']:
  r=reference(q,column['kind'],c['band']);near(column['bMass'],r['wholeB'],(c['label'],'B'));near(column['aMass'],r['wholeA'],(c['label'],'A'));checks+=2;assert len(column['regions'])==len(r['regions']);scale=None;origin=None
  for actual,(a,b,z) in zip(column['regions'],r['regions']):
   for k,v in [('bottom',a),('top',b),('phi',z)]:near(actual[k],v,(c['label'],k));checks+=1
   if b-a>1e-8:
    ratio=actual['height']/(b-a);offset=actual['y']+b*ratio
    if scale is None:scale=ratio;origin=offset
    else:near(ratio,scale,(c['label'],'uniform cm scale'));near(offset,origin,(c['label'],'common baseline'))
   else:near(actual['height'],0,(c['label'],'emptyregion'))
  for band in column['band']:
   for k,v in [('volume',r['volume']),('bMass',r['bMass']),('aMass',r['aMass'])]:near(band[k],v,(c['label'],k));checks+=1
   near(band['height'],(r['hi']-r['lo'])*scale,(c['label'],'scanheight'));near(band['y'],origin-r['hi']*scale,(c['label'],'scanposition'));checks+=2
out={'status':'passed','actualCases':len(cases),'independentRenderedChecks':checks,'noPageOverflow':True,'positiveContainedViewers':True};(p/'independent-rendered-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(out)
