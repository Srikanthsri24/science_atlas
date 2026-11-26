"""Independent numeric validation of actual GUI trials and downloaded report."""
from pathlib import Path
import json,math
r=Path(__file__).parent;before=json.loads((r/'ui-record-before-reload.json').read_text());after=json.loads((r/'ui-record-after-reload.json').read_text());assert before==after
rows=after['rows'];assert len(rows)>=25
for row in rows:
 assert len(row)==21
 T,A,H,P,F=map(float,row[1:6]);Q=A/10000*(H+6)/100/70*1e6;end=(P+F)/Q;closed=T>=end-.00000051;S=P+F if closed else min(P+F,Q*T);pore=A*2.5;labelOut=max(0,min(P,S-pore));labelSource=P-min(P,S);labels=[];previous=0
 for phi in[.4,.35,.5]:
  v=A*2*phi;labels.append(max(0,min(P,S-previous)-max(0,S-previous-v)));previous+=v
 labelBed=sum(labels);tol=.00000051+Q*.00000051
 expected={6:Q,7:0 if closed else Q,9:S,10:labelOut,11:labelBed,12:labelSource,13:P+F-S,14:pore,15:P+F+pore,16:P,17:labels[0],18:labels[1],19:labels[2]}
 for i,value in expected.items():assert abs(float(row[i])-value)<=tol,(row[0],i,row[i],value,tol)
 if T==0:assert row[8]=='Undefined'
 else:assert abs(float(row[8])-S/T)<=tol
html=(r/'ui-exported-practical.html').read_text();assert html.count('Formula: ')==32*len(rows);assert html.count('<h3>Trial')==len(rows);assert before['prediction'] in html and before['conclusion'] in html;assert not ('NaN' in html or 'Infinity' in html)
print(f'{len(rows)} actual GUI trials independently verify water/label budgets,layer inventory,current/average flow and exact persistence;{32*len(rows)} exported worked calculation blocks passed.')
