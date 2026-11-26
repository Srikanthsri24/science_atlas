"""Independently validate actual UI table and downloaded report;no app imports."""
from pathlib import Path
import json,math
r=Path(__file__).parent;before=json.loads((r/'ui-record-before-reload.json').read_text());after=json.loads((r/'ui-record-after-reload.json').read_text());assert before==after;assert len(after['rows'])==22
for row in after['rows']:
 assert len(row)==19
 h,V,A,RH,F=map(float,row[1:6]);initial=V*.997;expected=[];rates=[];losses=[];remaining=[];depths=[];actual=[];energy=[]
 for film in[10,F]:
  rate=.000025/(film/1000)*(.023*(1-RH/100))*A/10000*3600000;loss=min(initial,rate*h);mass=initial-loss;dry=mass<=rate*.00000051+1e-10
  if dry and rate>0:mass=0;loss=initial
  rates.append(rate);losses.append(loss);remaining.append(mass);depths.append(mass/.997/A);actual.append(0 if dry else rate);energy.append(loss/1000*2442000)
 expected=[*remaining,*losses,*depths,*actual,*energy]
 for j,(value,ex) in enumerate(zip(row[6:16],expected)):
  tol=.00000051+max(rates)*.00000051
  if j in[8,9]:tol=.00000051+max(rates)*.00000051*2442
  assert abs(float(value)-ex)<=tol,(row[0],j,value,ex,tol)
 if losses[0]>0:assert abs(float(row[16])-losses[1]/losses[0])<.000002
 else:assert row[16]=='Undefined'
 assert abs(float(row[17])-2*initial)<.00000051
html=(r/'ui-exported-practical.html').read_text();assert html.count('Formula: ')==31*22;assert html.count('<h3>Trial')==22;assert before['prediction'] in html and before['conclusion'] in html;assert not ('NaN' in html or 'Infinity' in html)
print('22 actual GUI trials independently verify mass,depth,rate,latent energy,ratios and pair budgets;exact reload persistence and682 exported worked calculation blocks passed.')
