import json,math
from pathlib import Path
r=Path(__file__).parent;cells=json.loads((r/'actual-ui-corner-trials.json').read_text());assert len(cells)==23*17
for i in range(23):
 c=cells[i*17:(i+1)*17];t,w,o,rho,vo,source,hw,ho,z=map(float,c[1:10]);A=math.pi*2.5**2;v=min(o,t);wh=w/A;oh=v/A;top=wh+oh;pw=1000*9.81*max(0,wh-z)*.01;po=rho*1000*9.81*max(0,top-max(z,wh))*.01
 for a,b in zip([vo,source,hw,ho],[v,o-v,wh,oh]):assert abs(a-b)<6e-7,(i,a,b)
 # Probe height is displayed to six decimals; its rounding contributes <=0.00004905 Pa.
 for a,b in zip(map(float,c[11:14]),[pw,po,pw+po]):assert abs(a-b)<.00006,(i,a,b)
 for a,b in zip(map(float,c[14:16]),[w+rho*v,w+rho*o]):assert abs(a-b)<.000001,(i,a,b)
report=(r/'ui-exported-practical.html').read_text();assert report.count('Formula:')==483;assert 'Full 120 s guide' in report
print('23 real UI trials:207 derived values independently verified within displayed-input rounding;actual downloaded report has483 worked calculation blocks.')
