import json,re
from pathlib import Path
p=Path(__file__).parent
states=json.loads((p/'3d-readout-states.json').read_text())
for d in states:
 q=d['parameters'];f=min(1,float(q['timeS'])/60);sand,gravel,c={'reference':(10,15,1),'saltFree':(10,15,0),'moreFines':(20,10,1)}[q['profile']]
 expected=[f*((sand if 150>=float(q['sieveUm']) else 0)+(gravel if 3000>=float(q['sieveUm']) else 0)),f*((sand if 150>=float(q['filterUm']) else 0)+(gravel if 3000>=float(q['filterUm']) else 0)),float(q['solutionMl'])*f,c*float(q['solutionMl'])/100*f]
 actual=[float(n) for n in re.findall(r'\d+\.\d+',d['inventory'])]
 assert len(actual)==4,(d,actual)
 assert all(abs(a-b)<.000501 for a,b in zip(actual,expected)),(actual,expected)
 assert d['canvasHeight']>0 and d['pageWidth']<=d['width'] and d['legendInsideStage'] and d['readoutsInsideStage']
end=json.loads((p/'3d-guide-end.json').read_text());assert float(end['guide'])==120 and float(end['parameters']['timeS'])==60
pause=json.loads((p/'pause-camera-invariance.json').read_text());assert pause['before']['parameters']==pause['after']['parameters'] and pause['before']['guide']==pause['after']['guide'];assert pause['recordDisabledWhilePlaying'] and pause['recordEnabled']
layouts=json.loads((p/'responsive.json').read_text());assert len(layouts)==70
for x in layouts:
 assert x['pageWidth']<=x['width']
 assert x.get('canvasHeight',x.get('svgHeight',0))>0
 if x['mode']=='3D':assert x['legendInsideStage'] and x['readoutsInsideStage']
print(f'{len(states)} actual 3D readouts independently match component budgets;120s endpoint,pause/camera invariance and70 responsive cases passed.')
