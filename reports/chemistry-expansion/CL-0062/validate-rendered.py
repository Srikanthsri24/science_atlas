"""Independent arithmetic reconstruction of observed DOM/SVG evidence; no app imports."""
import json,math
from pathlib import Path
root=Path(__file__).parent
near=lambda a,b,tol=1e-7: abs(float(a)-float(b))<=tol*max(1,abs(float(b)))
flight=math.sqrt(.16/9.81)
area=128*math.sin(2*math.pi/128)/2*4
frames=json.loads((root/'guide-2d-frames.json').read_text())
for f in frames:
    p=float(f['timeline']);physical=min(65,max(0,(p-10)*.65))
    for sample in f['samples']:
        t=float(sample['time']);assert abs(t-physical)<.05
        arrived=sum(t>=2+i*4+flight for i in range(12))
        assert near(sample['vesselMl'],20+arrived*.05)
        assert near(sample['pigmentMg'],arrived*.025)
        assert near(sample['surfaceY'],1+(20+arrived*.05)/area)
print(f'{len(frames)} observed 2D playback samples reconstructed')
path=root/'rendered-states.json'
if path.exists():
    states=json.loads(path.read_text())
    for d in states:
        assert d['viewport']['scroll']<=d['viewport']['w']+1,d['label']
        inputs={v['label']:v['value'] for v in d['controls']}
        dose=float(inputs['Cabbage Planned indicator dose']);count=int(inputs['Cabbage Programmed drops']);interval=float(inputs['Cabbage Release interval']);stock=float(inputs['Cabbage Chosen stock pigment']);sample=float(inputs['Cabbage Initial sample volume']);t=float(inputs['Cabbage physical time seconds'])
        arrived=0 if dose==0 else sum(t>=2+i*interval+flight for i in range(count))
        released=0 if dose==0 else sum(t>=2+i*interval for i in range(count))
        v=sample+arrived*dose/count;m=arrived*dose/count*stock
        for s in d['samples']:
            assert near(s['data']['vesselMl'],v)
            assert near(s['data']['pigmentMg'],m)
            water=s['rects'][0];scale=float(water['width'])/4
            assert near(float(water['height'])/scale,v/area)
            base=float(water['y'])+(1+v/area)*scale
            for drop in s['drops']:
                i=int(drop['data']['dropIndex']);age=t-(2+i*interval)
                assert 0<=age<flight
                clearance=8-490.5*age**2
                assert near(drop['data']['bottomClearance'],clearance)
                mesh_radius=float(drop['radius'])/scale
                assert near((base-float(drop['cy']))/scale,1+v/area+mesh_radius+clearance)
            assert len(s['drops'])==released-arrived
        if d['svg'] and 'zoom' not in d['label']:
            r=d['svg']
            for text in d['texts']:
                assert text['x']>=r['x']-1 and text['right']<=r['right']+1,(d['label'],text)
                assert text['y']>=r['y']-1 and text['bottom']<=r['bottom']+1,(d['label'],text)
        if d['canvas']:
            r=d['canvas'];w=d['wrapper'];assert r['h']>=70 and r['w']>0
            assert r['x']>=w['x']-1 and r['right']<=w['right']+1
            assert r['y']>=w['y']-1 and r['bottom']<=w['bottom']+1
    print(f'{len(states)} rendered SVG/canvas/layout states reconstructed')
# The 3D guide's actual textual readouts must agree with independent pulse counts.
import re
three=json.loads((root/'guide-3d-frames.json').read_text())
assert float(three[-1]['timeline'])==120 and three[-1]['recordEnabled']
for f in three:
    t=float(f['time']);assert abs(t-min(65,max(0,(float(f['timeline'])-10)*.65)))<.05
    count=sum(t>=2+i*4+flight for i in range(12))
    readings=re.findall(r'([0-9.]+) mg in ([0-9.]+) mL',f['readouts'])
    assert len(readings)==3
    for m,v in readings:assert near(m,count*.025,5.1e-5) and near(v,20+count*.05,5.1e-4)
manual=json.loads((root/'manual-camera-check.json').read_text())
assert not manual['playing']['recordEnabled'] and manual['paused']['recordEnabled']
assert manual['paused']['controls']==manual['afterCamera']['controls']
assert float(next(x['value'] for x in manual['paused']['controls'] if x['label']=='Cabbage physical time seconds'))>0
zoom=json.loads((root/'zoom-keyboard-reset.json').read_text());assert zoom['zoom']['left']>0 and zoom['zoom']['top']>0
assert zoom['fit']['left']==zoom['fit']['top']==0 and zoom['fit']['sw']==zoom['fit']['w'] and zoom['fit']['sh']==zoom['fit']['h']
layout=json.loads((root/'phone-practical-layout.json').read_text());assert layout['blocks']==14 and not layout['overflowing'] and layout['page']==layout['viewport']==390
print('3D guide endpoint, manual playback/camera invariance, keyboard pan/reset and phone calculations verified')
