from pathlib import Path
import json,re
r=Path(__file__).parent;states=json.loads((r/'3d-readout-states-final.json').read_text())
for s in states:
 A,H,P,F,t=map(float,s['parameters']);Q=A/10000*(H+6)/100/70*1e6;S=min(P+F,Q*t);pore=A*2.5;labelOut=max(0,min(P,S-pore));labelSource=P-min(P,S);labelBed=P-labelOut-labelSource
 expected=[S,labelOut,labelBed,P+F+pore];values=list(map(float,re.findall(r'\d+\.\d+',s['inventory'])));assert len(values)==4 and all(abs(a-b)<.000501 for a,b in zip(values,expected)),(s,values,expected)
 assert abs(float(re.search(r'\d+\.\d+',s['time'])[0])-t)<.000501
end=json.loads((r/'3d-guide-end-final.json').read_text());assert float(end['clock'])==120 and end['parameters']==['28','10','100','200','60'] and end['recordEnabled']
layouts=json.loads((r/'responsive-final.json').read_text())
for s in layouts:
 assert s['pageWidth']<=s['width']
 if s['mode']=='3D':assert s['canvasHeight']>0 and s['legendInsideStage'] and s['readoutsInsideStage']
 else:assert s['svgHeight']>0
p=json.loads((r/'pause-camera-invariance-final.json').read_text());assert p['before']['guide']==p['after']['guide'] and p['before']['parameters']==p['after']['parameters'] and p['recordEnabled'] and p['recordDisabledWhilePlaying']
print(f'{len(states)} final3D readouts match independent water/parcel budgets;final120-second endpoint,pause invariance and{len(layouts)} responsive cases passed.')
