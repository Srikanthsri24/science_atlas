import json,re,math
from pathlib import Path
p=Path(__file__).parent;states=json.loads((p/'3d-readout-states.json').read_text())
for v in states:
 q=v['inputs'];P=q['progress'];f=min(1,P);r=max(0,P-1);a=[float(x) for x in re.findall(r'\d+\.\d+',v['inventory'])]
 if q['sample']=='ice':
  liquid=q['iceMassG']*(f-r);expected=[P,q['iceMassG']-liquid,liquid,334*liquid,q['iceMassG']]
 elif q['sample']=='paper':
  expected=[P,.8*f*(1-r),q['paperMassG']];full=min(q['cuts'],math.floor(f*q['cuts']+8*2.220446049250313e-16*q['cuts']));assert int(re.search(r'(\d+) completed cuts',v['inventory']).group(1))==full;assert int(re.search(r'(\d+) pieces',v['inventory']).group(1))==full+1
 else:
  xi=min(q['bicarbonateG']/84.006,q['acidMmol']/1000)*f;gas=xi*44.009;L=xi*8.314462618*298.15/101325*1000;expected=[P,gas,L,100+q['bicarbonateG']-gas,100+q['bicarbonateG']]
 assert len(a)==len(expected),(a,expected,v['inventory']);assert all(abs(x-y)<.000501 for x,y in zip(a,expected)),(a,expected)
 assert v['canvasHeight']>0 and v['pageWidth']<=v['width'] and v['readoutsInsideStage'] and v['notesInsideStage']
pause=json.loads((p/'pause-camera-invariance.json').read_text());assert pause['before']['guide']==pause['after']['guide'] and pause['before']['inputs']==pause['after']['inputs'] and pause['recordDisabledWhilePlaying'] and pause['after']['recordEnabled']
print(f'{len(states)} actual 3D readouts match independent phase,fragment,gas andmass calculations;pause/reset invariance passed.')
