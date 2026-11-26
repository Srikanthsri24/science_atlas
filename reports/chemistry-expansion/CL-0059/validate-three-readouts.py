from pathlib import Path
import json,math,re
p=Path(__file__).parent;states=json.loads((p/'3d-readout-states.json').read_text())
for v in states:
 assert v['pageWidth']<=v['width'];assert v['visibleHeight']>=69.9;assert v['canvasMatchesWrapper'];assert v['readoutsInside'] and v['notesInside']
 qs=[v['inputs']['a']]+([v['inputs']['b']] if v['inputs']['paired'] else[]);rows=re.findall(r'Sample ([AB]) · dissolved ([\d.]+) g \+ solid ([\d.]+) g · total ([\d.]+) g · new solid ([-\d.]+) g',v['readout']);assert len(rows)==len(qs)
 for q,row in zip(qs,rows):
  W,D,S,T,k,delay,t=[q[n] for n in ['waterG','dissolvedChargeG','seedG','temperatureC','rateSInv','nucleationDelayS','timeS']];cap=W*(31.6+32.3*(T-20)/20)/100;M=D+S;target=min(M,cap);A=-S if target==M else D-target;tau=delay if S==0 and A>0 else 0;u=max(0,t-tau);lag=A*math.exp(-k*u);diss=target+lag;solid=-lag if A<0 and M==target else S+A*(-math.expm1(-k*u))
  for x,y in zip(row[1:],[diss,solid,M,solid-S]):assert abs(float(x)-y)<=.000051,(q,x,y)
print(f'PASS:{len(states)}actual3Dreadouts independently matchdissolved/solid/seed/total inventories;visiblecanvas wrappers andnotes contained')
