from pathlib import Path
import json,re
p=Path(__file__).parent;states=json.loads((p/'3d-readout-states.json').read_text())
for v in states:
 q=v['values'];I=float(q['Sequence iron grams']);S=float(q['Sequence sand grams']);N=float(q['Sequence salt grams']);W=float(q['Sequence reserved water grams']);P=float(q['Sequence procedure progress']);a,b,f,e=[max(0,min(1,P-j)) for j in range(4)];D=min(N,.36*W)*b;water=W*b*f*(1-e);crystal=D*f-min(D*f,.36*water)
 expected=[P,I*a,S*f,(N-D)*f,crystal,water,W*b*f*e,I+S+N+W];actual=[float(x) for x in re.findall(r'\d+\.\d+',v['inventory'])]
 assert len(actual)==8,(actual,v['inventory']);assert all(abs(x-y)<.000501 for x,y in zip(actual,expected)),(actual,expected)
 assert v['canvasHeight']>0 and v['readoutsInsideStage'] and v['notesInsideStage'] and v['pageWidth']<=v['width']
pause=json.loads((p/'pause-camera-invariance.json').read_text());assert pause['before']['guide']==pause['after']['guide'] and pause['before']['values']==pause['after']['values'] and pause['after']['recordEnabled']
print(f'{len(states)} actual 3D readouts independently match component inventories;pause/reset invariance passed.')
