from pathlib import Path
import json,re
r=Path(__file__).parent
states=json.loads((r/'3d-readout-states.json').read_text())
for s in states:
 v,a,b,t=map(float,s['parameters']);values=list(map(float,re.findall(r'\d+\.\d+',s['inventory'])))
 expected=[max(0,v-.02*a*t),min(v,.02*a*t),max(0,v-.02*b*t),min(v,.02*b*t)]
 assert len(values)==4 and all(abs(x-y)<.000501 for x,y in zip(values,expected))
 assert abs(float(re.search(r'\d+\.\d+',s['time'])[0])-t)<.000501
end=json.loads((r/'3d-guide-end.json').read_text());assert float(end['guide'])==120 and end['parameters']==['50','25','100','24'] and end['recordEnabled']
print(f'{len(states)} actual3D readouts match independent water budgets;final120-second guide endpoint passed.')
