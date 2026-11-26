"""Verify observed SVG geometry/elapsed curves and actual 3D guide readouts."""
import json, math, xml.etree.ElementTree as ET
from pathlib import Path
root=Path(__file__).parent
area=128*math.sin(2*math.pi/128)/2*1.2**2
unitarea=area/1.2**2
def state(day,condition):
    wet=condition.startswith('wet');reduced='reduced' in condition
    water=2 if wet else 0;y=0 if reduced else .21
    ng=101.325*((50-.15/8-water)/1000)/(8.314462618*298.15)
    no=ng*y;nn=ng*(1-y);cap=min(.15/55.845,no/.75,water/18.015/.5)
    xi=cap*(-math.expm1(-.25*day));tail=math.exp(-.25*day)
    fe=(.15/55.845-cap+cap*tail)*55.845;product=xi*88.851;attached=.25*product;sed=.75*product
    wl=(water/18.015-.5*cap+.5*cap*tail)*18.015;ol=no-.75*cap+.75*cap*tail
    vg=50-fe/8-product/4.2-wl;p=(ol+nn)*8.314462618*298.15/(vg/1000)
    r0=math.sqrt((.15/8)/unitarea)
    return dict(fe=fe,product=product,attached=attached,sed=sed,water=wl,gas=vg,pressure=p,cap=cap,core=r0*(fe/.15)**(1/3),outer=r0*((fe/8+attached/4.2)/(.15/8))**(1/3))
def close(a,b):assert abs(float(a)-b)<max(1e-10,abs(b)*1e-10),(a,b)
checked=dict(sections=0,cells=0,curvePoints=0,threeDFrames=0)
def verify(xml,day=None):
    e=ET.fromstring(xml)
    for g in e.iter():
        if 'data-rust-section' in g.attrib:
            q=state(float(g.attrib['data-time']),g.attrib['data-rust-section']);scale=float(g.attrib['data-scale'])
            close(g.attrib['data-iron-g'],q['fe']);close(g.attrib['data-attached-g'],q['attached']);close(g.attrib['data-sediment-g'],q['sed'])
            for c in g:
                if 'data-rust-core' in c.attrib:close(c.attrib['r'],q['core']*scale)
                if 'data-rust-outer' in c.attrib:close(c.attrib['r'],q['outer']*scale)
            checked['sections']+=1
        if 'data-rust-cell' in g.attrib:
            q=state(float(g.attrib['data-time']),g.attrib['data-rust-cell']);scale=float(g.attrib['data-scale'])
            close(g.attrib['data-gas-ml'],q['gas']);close(g.attrib['data-pressure'],q['pressure'])
            for c in g:
                if 'data-rust-sediment' in c.attrib:close(float(c.attrib['height'])/scale*area,q['sed']/4.2)
                if 'data-rust-water' in c.attrib:close(float(c.attrib['height'])/scale*area,q['water'])
            checked['cells']+=1
        if 'data-rust-curve' in g.attrib:
            points=[list(map(float,p.split(','))) for p in g.attrib['points'].split()];assert len(points)==61
            portrait='0 0 600 900'==e.attrib.get('viewBox');pw=445 if portrait else 840;left=85 if portrait else 90;ph=530 if portrait else 320
            maximum=state(0,'wet_oxygen')['cap']*88.851*1000*1.1
            for x,y in points:
                t=(x-left)/pw*14;assert -1e-12<=t<=day+1e-10
                close(y,110+ph-state(t,g.attrib['data-rust-curve'])['product']*1000/maximum*ph)
                checked['curvePoints']+=1
            close((points[-1][0]-left)/pw*14,day)
states=json.loads((root/'rendered-states.json').read_text());assert len(states)==30
for s in states:
    assert s['doc']==s['w'] and s['pan']['w']>0 and s['pan']['h']>0
    for b in s['clip']:assert b['left']>=-.5 and b['top']>=-.5 and b['left']+b['w']<=b['svgW']+.5 and b['top']+b['h']<=b['svgH']+.5
    verify(s['svg'],14)
guide=json.loads((root/'actual-2d-guide.json').read_text());assert float(guide['frames'][-1]['timeline'])==120
for f in guide['frames']:
    if f.get('section'):verify(f['section'])
    for c in f.get('cells',[]):verify(c)
    # Curve-only fragments are checked against the guide's elapsed time.
    for c in f.get('curves',[]):
        t=(float(ET.fromstring(c).attrib['points'].split()[-1].split(',')[0])-90)/840*14
        timeline_day=max(0,min(14,(float(f['timeline'])-10)/100*14))
        assert abs(t-timeline_day)<.015 # timeline control is rounded to0.1second
        verify('<svg viewBox="0 0 1000 650">'+c+'</svg>',t)
guide3=json.loads((root/'actual-3d-guide.json').read_text());assert float(guide3['frames'][-1]['timeline'])==120
assert guide3['frames'][-1]['recordDisabled'] is False
from html.parser import HTMLParser
class Phase(HTMLParser):
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'data-rust-3d-time' in a:
            q=state(float(a['data-rust-3d-time']),a['data-rust-3d-condition'])
            close(a['data-rust-product-g'],q['product']);close(a['data-rust-pressure'],q['pressure']);checked['threeDFrames']+=1
for f in guide3['frames']:Phase().feed(f['phase'])
(root/'rendered-verification.json').write_text(json.dumps(checked,indent=2)+'\n');print(checked)
