from pathlib import Path
import json,math,re
p=Path(__file__).parent;states=json.loads((p/'3d-readout-states.json').read_text())
for v in states:
 assert v['pageWidth']<=v['width'];assert v['visibleHeight']>=69.9;assert v['canvasMatchesWrapper'];assert v['readoutsInside'] and v['notesInside']
 q=v['inputs'];W,D,T,P,F,C,t=[q[n] for n in ['waterG','dyeMg','initialTemperatureC','netPowerW','coolantFlowMlMin','coolantInletC','timeS']];tb=W*4.18*(100-T)/P;rate=P/2256;dur=.5*W/rate;stop=tb+dur;clamp=lambda delay:max(0,min(dur,t-tb-delay));vap=rate*clamp(0);arr=rate*clamp(3);cdot=F/60*4.18;cap=min(cdot*20,cdot*(100-C)*(-math.expm1(-2/cdot))) if cdot>0 else 0;eta=min(1,cap/P);rec=eta*rate*clamp(4);temp=T+min(P*min(t,stop),W*4.18*(100-T))/(W*4.18)
 a=re.search(r'pot ([\d.]+) °C referencePot ([\d.]+) g · vapour transit ([\d.]+) g · drain ([\d.]+) gReceiver ([\d.]+) g · vented ([\d.]+) g · water budget ([\d.]+) g · pot dye ([\d.]+) mg',v['readout']);assert a,v['readout']
 for x,y,tol in zip(a.groups(),[temp,W-vap,vap-arr,eta*arr-rec,rec,(1-eta)*arr,W,D],[.0051,.000051,.000051,.000051,.000051,.000051,.000051,.0051]):assert abs(float(x)-y)<=tol,(q,x,y)
print(f'PASS:{len(states)} actual3D readouts independently match temperature/water/dye inventories;visiblecanvas wrappers andnotescontained')
