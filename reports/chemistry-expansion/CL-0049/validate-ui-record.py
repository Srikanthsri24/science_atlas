"""Independently reconstruct actual UI observations and check downloaded report."""
import json,math
from pathlib import Path
r=Path(__file__).parent;a=json.loads((r/'ui-trials-before-reload.json').read_text());b=json.loads((r/'ui-trials-after-reload.json').read_text());assert a==b and len(b)==42*19
written=json.loads((r/'ui-written-before-reload.json').read_text());assert written==json.loads((r/'ui-written-after-reload.json').read_text());assert written['notes'][5].startswith('Late melting:')
for i in range(42):
 q=b[i*19:(i+1)*19];mode=q[1];t,mg,p=map(float,q[2:5]);m=mg/1000;L=m*334000;H0=L+m*4186*10 if mode=='cool' else -m*2090*10;lo=-m*2090*20;hi=L+m*4186*60;clip=lambda h:max(lo,min(hi,h));ht=t if mode=='heat' else min(t,60) if mode=='cycle' else 0;ct=t if mode=='cool' else max(0,t-60) if mode=='cycle' else 0;Hheat=clip(H0+p*ht);H=clip(Hheat-p*ct);qin=Hheat-H0;qout=Hheat-H;f=max(0,min(1,H/L));ms=mg*(1-f);ml=mg*f;temp=H/(m*2090) if H<0 else (H-L)/(m*4186) if H>L else 0;side=(ms/.917)**(1/3) if ms else 0;area=math.pi*16;draft=.917*side;fl=(ml+side*side*draft)/area;floating=ms>0 and ml>0 and fl>=draft;waterline=0 if ml==0 else ml/area if ms==0 else fl if floating else ml/(area-side*side)
 expected=[temp,ms,ml,100*f,qin,qout,qin-qout,H,p*ht-qin,p*ct-qout,waterline,side]
 for j,value in enumerate(expected,5):assert abs(float(q[j])-value)<.000001,(i,j,q[j],value)
 assert q[17]==('No ice' if ms==0 else 'Floating' if floating else 'Floor supported')
assert b[5*19+17]=='Floating'
report=(r/'ui-exported-practical.html').read_text();assert report.count('Formula:')==42*23
for text in [written['prediction'],written['conclusion'],written['notes'][0],written['notes'][5]]:assert text in report
assert 'Heating 65697.000000 J; cooling 0 J' in report
print('42 actual UI trials:504 derived thermal/geometry readings and42 support labels independently verified;exact42-row/written-evidence reload;actual report has966 worked calculation blocks.')
