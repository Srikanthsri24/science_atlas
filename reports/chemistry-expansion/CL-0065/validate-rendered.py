"""Independent two-stage closed-form reference for actual rendered defaults."""
import json,math,xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).parent
def state(t,kind):
    f=1 if kind=='bare' else .05 if kind=='scratched' else 0;p=0 if kind=='ideal' else .02
    film=(1-f)*.25*.005;ng=101.325*((50-.15/8-2-film)/1000)/(8.314462618*298.15);no=.21*ng;nn=.79*ng
    nfe=.15/55.845;caps=[.75*nfe*f,.75*nfe*(1-f)];weights=[f,(1-f)*p];W=sum(weights)
    used=[0.,0.];o=no
    if W:
        first=no*(-math.expm1(-.4*W*t));used=[first*w/W for w in weights];o=no*math.exp(-.4*W*t)
        # Only the exposed default scratched zone can exhaust before30days.
        if kind=='scratched':
            delta=caps[0]*W/weights[0];tau=-math.log1p(-delta/no)/(.4*W)
            if t>=tau:
                oevent=no-delta;o=oevent*math.exp(-.4*weights[1]*(t-tau));used=[caps[0],delta*weights[1]/W+oevent*(-math.expm1(-.4*weights[1]*(t-tau)))]
    fe=[max(0,caps[j]-used[j])/.75*55.845 for j in range(2)];prod=[v/.75*88.851 for v in used];product=sum(used)/.75*88.851
    water=(2/18.015-sum(used)*2/3)*18.015;vg=50-sum(fe)/8-product/4.2-water-film;pressure=(o+nn)*8.314462618*298.15/(vg/1000)
    return dict(f=f,fe=fe,prod=prod,product=product,gas=vg,pressure=pressure,capacity=no/.75)
def close(a,b):assert abs(float(a)-b)<max(1e-9,abs(b)*1e-10),(a,b)
count=dict(sections=0,phaseRectangles=0,curvePoints=0,threeDStates=0)
def svg_verify(xml,day):
    svg=ET.fromstring(xml);portrait=svg.attrib['viewBox']=='0 0 600 900'
    for e in svg.iter():
        if 'data-coating-section' in e.attrib:
            t=float(e.attrib['data-time']);q=state(t,e.attrib['data-coating-section']);scale=float(e.attrib['data-scale']);base=float(e.attrib['data-base-y'])
            for zone in e:
                if 'data-coating-zone' not in zone.attrib:continue
                j=int(zone.attrib['data-coating-zone']);fraction=q['f'] if j==0 else 1-q['f'];area=.25*fraction
                heights=[q['fe'][j]/8/area if area else 0,q['prod'][j]/4.2/area if area else 0,.005 if j==1 and fraction else 0]
                cumulative=0
                for phase,height in zip(['metal','product','film'],heights):
                    rect=next(r for r in zone if f'data-coating-{phase}' in r.attrib);cumulative+=height
                    close(rect.attrib['width'],.5*fraction*scale);close(rect.attrib['height'],height*scale);close(rect.attrib['y'],base-cumulative*scale);count['phaseRectangles']+=1
            count['sections']+=1
        if 'data-coating-curve' in e.attrib:
            points=[list(map(float,p.split(','))) for p in e.attrib['points'].split()];assert len(points)==61
            left=85 if portrait else 90;pw=445 if portrait else 840;ph=530 if portrait else 320
            maximum=state(0,'bare')['capacity']*88.851*1000*1.1
            for x,y in points:
                t=(x-left)/pw*30;assert -1e-10<=t<=day+1e-5;close(y,110+ph-state(t,e.attrib['data-coating-curve'])['product']*1000/maximum*ph);count['curvePoints']+=1
            assert abs((points[-1][0]-left)/pw*30-day)<1e-5
states=json.loads((root/'rendered-states.json').read_text());assert len(states)==30
for s in states:
    assert s['w']==s['doc'] and s['pan']['w']>0 and s['pan']['h']>0
    for b in s['clip']:assert b['left']>=-.5 and b['top']>=-.5 and b['left']+b['w']<=b['svgW']+.5 and b['top']+b['h']<=b['svgH']+.5
    svg_verify(s['svg'],float(s['day']))
guide=json.loads((root/'actual-2d-guide.json').read_text());assert float(guide['frames'][-1]['timeline'])==120 and guide['frames'][-1]['recordDisabled'] is False
for f in guide['frames']:svg_verify(f['svg'],float(f['day']))
responsive=[json.loads(line) for line in (root/'responsive-3d.jsonl').read_text().splitlines()];assert len(responsive)==30
for s in responsive:
    assert s['doc']==s['w'] and len(s['canvas'])==1
    assert s['canvas'][0]['h']>=70 and abs(s['canvas'][0]['h']-s['canvas'][0]['parentH'])<.01
    q=state(float(s['time']),'scratched');close(s['product'],q['product']);close(s['pressure'],q['pressure']);count['threeDStates']+=1
class Phase(HTMLParser):
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'data-coating-3d-time' in a:
            q=state(float(a['data-coating-3d-time']),a['data-coating-3d-kind']);close(a['data-coating-product-g'],q['product']);close(a['data-coating-pressure'],q['pressure']);count['threeDStates']+=1
frames=[json.loads(line) for line in (root/'guide-3d-frames.jsonl').read_text().splitlines()]
assert float(frames[-1]['timeline'])==120 and frames[-1]['recordDisabled'] is False
for f in frames:Phase().feed(f['phase'])
(root/'rendered-verification.json').write_text(json.dumps(count,indent=2)+'\n');print(count)
