from pathlib import Path
import json,re
r=Path(__file__).parent;states=json.loads((r/'3d-readout-states-final.json').read_text())
for s in states:
 V,A,RH,F,h=map(float,s['parameters']);initial=V*.997;rate=lambda f:.000025/(f/1000)*.023*(1-RH/100)*A/10000*3600000
 expected=[max(0,initial-rate(10)*h),min(initial,rate(10)*h),max(0,initial-rate(F)*h),min(initial,rate(F)*h)];values=list(map(float,re.findall(r'\d+\.\d+',s['inventory'])))
 assert len(values)==4 and all(abs(a-b)<.000501 for a,b in zip(values,expected))
end=json.loads((r/'3d-guide-end.json').read_text());assert float(end['clock'])==120 and end['parameters']==['50','50','50','2','24'] and end['recordEnabled']
layouts=json.loads((r/'responsive-final.json').read_text())
for s in layouts:
 assert s['pageWidth']<=s['width']
 if s['mode']=='3D':assert s['canvasHeight']>0 and s['legendInsideStage'] and s['readoutsInsideStage']
 else:assert s['svgHeight']>0
pause=json.loads((r/'pause-camera-invariance.json').read_text());assert pause['before']['guide']==pause['after']['guide'] and pause['before']['parameters']==pause['after']['parameters'] and pause['recordEnabled']
print(f'{len(states)} final3D readouts independently match water budgets;120-second endpoint,pause invariance and{len(layouts)} final responsive cases passed.')
