import json,re
from pathlib import Path
r=Path(__file__).parent;states=json.loads((r/'3d-final-renderer-states.json').read_text())
for q in states:
 mg,p,t=map(float,q['parameters']);mode=q['protocol'];m=mg/1000;L=m*334000;H0=L+m*4186*10 if mode=='cool' else -m*2090*10;lo=-m*2090*20;hi=L+m*4186*60;clip=lambda x:max(lo,min(hi,x));ht=t if mode=='heat' else min(t,60) if mode=='cycle' else 0;ct=t if mode=='cool' else max(0,t-60) if mode=='cycle' else 0;Hheat=clip(H0+p*ht);H=clip(Hheat-p*ct);f=max(0,min(1,H/L));temp=H/(m*2090) if H<0 else (H-L)/(m*4186) if H>L else 0;phase='ice' if H<=0 else 'water' if H>=L else 'ice + water';assert abs(float(q['reading'].split()[0])-temp)<.000501;assert q['reading'].endswith('· '+phase)
 numbers=list(map(float,re.findall(r'[-+]?\d*\.?\d+',q['inventory'])));expected=[mg*(1-f),mg*f,Hheat-H0,Hheat-H]
 for i,(a,b) in enumerate(zip(numbers,expected)):assert abs(a-b)<(.000501 if i<2 else .051)
 if phase=='ice + water' and 'caption' in q:assert q['caption'].startswith('At 0°C')
end=json.loads((r/'3d-guide-end-final.json').read_text());assert end['guide']=='120' and end['recordEnabled'];assert end['parameters']==['50','400','120'];assert end['reading'].startswith('-10.000 °C');pause=json.loads((r/'pause-camera-invariance.json').read_text());assert pause['paused']==pause['afterCamera'] and pause['recordEnabled']
print(f'{len(states)} final3D native readouts independently match thermal states;120s final guide endpoint and exact pause/camera invariance passed.')
