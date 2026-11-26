"""Independently reconstruct observed calibrated SVG and 3D gas states."""
import json,math,xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
root=Path(__file__).parent;R=8.314462618;area=128*math.sin(2*math.pi/128)/2*1.25**2
def state(t,b):
    n=101.325*.05/(R*298.15);C=3.5*R if b=='piston' else 2.5*R;tau=n*C/.002
    delta=40*(-math.expm1(-min(t,120)/tau))*math.exp(-max(0,t-120)/tau)
    K=298.15+delta;V=50+50*delta/298.15 if b=='piston' else 50;P=101.325 if b=='piston' else 101.325*(1+delta/298.15)
    return dict(K=K,C=K-273.15,V=V,P=P,heatRate=.002*((298.15 if t>=120 else 338.15)-K))
def close(a,b):assert abs(float(a)-b)<max(2e-8,abs(b)*1e-10),(a,b)
count=dict(apparatusStates=0,gasVolumes=0,gaugeNeedles=0,thermometers=0,curvePoints=0,threeDStates=0)
def verify_svg(xml,observed):
    svg=ET.fromstring(xml);portrait=svg.attrib['viewBox']=='0 0 600 900'
    for e in svg.iter():
        if 'data-air-apparatus' in e.attrib:
            b=e.attrib['data-air-apparatus'];t=float(e.attrib['data-time']);s=state(t,b);scale=float(e.attrib['data-scale']);base=float(e.attrib['data-base-y'])
            close(e.attrib['data-volume-ml'],s['V']);close(e.attrib['data-pressure-kpa'],s['P']);close(e.attrib['data-gas-k'],s['K'])
            gas=next(v for v in e if 'data-air-gas'in v.attrib);close(float(gas.attrib['height'])/scale*area,s['V']);close(float(gas.attrib['y'])+float(gas.attrib['height']),base-2*scale);close(gas.attrib['width'],2.5*scale);count['gasVolumes']+=1
            cap=next(v for v in e if 'data-air-cap'in v.attrib);close(float(cap.attrib['y'])+float(cap.attrib['height']),float(gas.attrib['y']));close(cap.attrib['height'],.35*scale)
            gauge=next(v for v in e if 'data-air-gauge'in v.attrib);fraction=(s['P']-60)/100;close(gauge.attrib['data-fraction'],fraction)
            needle=next(v for v in gauge if 'data-air-needle'in v.attrib);gr=36 if portrait else 42;angle=(-120+240*fraction)*math.pi/180
            close(needle.attrib['x2'],(gr-10)*math.sin(angle));close(needle.attrib['y2'],-(gr-10)*math.cos(angle));count['gaugeNeedles']+=1
            thermometer=next(v for v in e if 'data-air-thermometer'in v.attrib);close(thermometer.attrib['data-fraction'],s['C']/90);rects=[v for v in thermometer if v.tag.endswith('rect')];close(rects[1].attrib['height'],70*s['C']/90);count['thermometers']+=1
            arrows=[v for v in e if 'data-air-heat-direction'in v.attrib]
            if abs(s['heatRate'])>1e-12:assert len(arrows)==1 and int(arrows[0].attrib['data-air-heat-direction'])==(1 if s['heatRate']>0 else -1)
            else:assert not arrows
            count['apparatusStates']+=1
        if 'data-air-curve'in e.attrib:
            points=[list(map(float,p.split(','))) for p in e.attrib['points'].split()];assert len(points)==61
            left=85 if portrait else 90;pw=445 if portrait else 840;ph=500 if portrait else 320;volume=e.attrib['data-metric']=='volume';low,high=(15,90) if volume else (60,160)
            for x,y in points:
                t=(x-left)/pw*300;assert -1e-9<=t<=observed+1e-6;s=state(t,e.attrib['data-air-curve']);value=s['V'] if volume else s['P'];close(y,110+ph-(value-low)/(high-low)*ph);count['curvePoints']+=1
            assert abs((points[-1][0]-left)/pw*300-observed)<1e-6
states=[json.loads(x) for x in(root/'rendered-2d.jsonl').read_text().splitlines()];assert len(states)==30
for s in states:
    assert s['doc']==s['w'] and s['pan']['w']>0 and s['pan']['h']>0
    for b in s['clip']:assert b['left']>=-.5 and b['top']>=-.5 and b['left']+b['w']<=b['svgW']+.5 and b['top']+b['h']<=b['svgH']+.5
    verify_svg(s['svg'],float(s['time']))
frames=[json.loads(x) for x in(root/'guide-2d-frames.jsonl').read_text().splitlines()];assert float(frames[-1]['timeline'])==120 and frames[-1]['recordDisabled'] is False
for f in frames:verify_svg(f['svg'],float(f['time']))
three=[json.loads(x) for x in(root/'rendered-3d.jsonl').read_text().splitlines()];assert len(three)==30
for s in three:
    assert s['w']==s['doc'] and len(s['canvas'])==1 and s['canvas'][0]['h']>=70
    assert abs(s['canvas'][0]['h']-s['canvas'][0]['parentH'])<.01
    q=state(float(s['time']),s['boundary']);close(s['volume'],q['V']);close(s['pressure'],q['P']);close(s['gasK'],q['K']);count['threeDStates']+=1
class Phase(HTMLParser):
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'data-air-3d-time'in a:
            s=state(float(a['data-air-3d-time']),a['data-air-3d-boundary']);close(a['data-air-volume-ml'],s['V']);close(a['data-air-pressure-kpa'],s['P']);close(a['data-air-gas-k'],s['K']);count['threeDStates']+=1
frames=[json.loads(x) for x in(root/'guide-3d-frames.jsonl').read_text().splitlines()];assert float(frames[-1]['timeline'])==120 and frames[-1]['recordDisabled'] is False
for f in frames:Phase().feed(f['phase'])
selected=json.loads((root/'selected-boundary-check.json').read_text());assert [s['boundary'] for s in selected]==['piston','rigid','piston']
for s in selected:
    assert float(s['time'])==60
    q=state(float(s['time']),s['boundary']);close(s['volume'],q['V']);close(s['pressure'],q['P']);close(s['gasK'],q['K']);count['threeDStates']+=1
assert selected[0]==selected[2]
(root/'rendered-verification.json').write_text(json.dumps(count,indent=2)+'\n');print(count)
