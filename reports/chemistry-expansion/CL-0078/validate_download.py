"""Independent numerical reconstruction of the actual GUI download; no TS imports."""
from html.parser import HTMLParser
from pathlib import Path
import math,json
class Read(HTMLParser):
 def __init__(self):super().__init__();self.rows=[];self.row=None;self.cell=None;self.paras=[];self.p=None
 def handle_starttag(self,tag,attrs):
  if tag=='tr':self.row=[]
  if tag=='td':self.cell=''
  if tag=='p':self.p=''
 def handle_data(self,v):
  if self.cell is not None:self.cell+=v
  if self.p is not None:self.p+=v
 def handle_endtag(self,tag):
  if tag=='td' and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.row:self.rows.append(self.row);self.row=None
  if tag=='p' and self.p is not None:self.paras.append(self.p);self.p=None
p=Path(__file__).parent;html=(p/'actual-ui-report.html').read_text();r=Read();r.feed(html)
assert len(r.rows)==8 and all(len(v)==24 for v in r.rows)
assert '&lt;safe&gt; &amp; preserved.' in html and '<safe>' not in html
ramp=lambda t,a,b:max(0,min(1,(t-a)/(b-a)))
def near(a,b):assert abs(float(a)-b)<2e-7*max(1,abs(b)),(a,b)
checks=0;worked=[]
for row in r.rows:
 _,C,V,f,ret,rinse,tau,method,error,early,t,*_=row
 C,V,f,ret,rinse,tau,error,t=map(float,[C,V,f,ret,rinse,tau,error,t]);m=C*V/1000;mw=m*f
 # Numerical quadrature independent of implementation's antiderivative.
 def portion(t):
  delivered=mw*((1-ret)*ramp(t,15,25)+ret*rinse*ramp(t,30,40));D=0
  for a,b,mass in [(15,25,mw*(1-ret)),(30,40,mw*ret*rinse)]:
   stop=min(t,b)
   if stop<=a:continue
   N=6000;dt=(stop-a)/N
   for i in range(N):
    age=t-(a+(i+.5)*dt);u=max(0,min(1,age/tau));D+=mass/(b-a)*(1-(1-u)**3)*dt
  return delivered,D,max(0,delivered-D),V*(.4*ramp(t,5,15)+.1*rinse*ramp(t,30,40))
 start=80 if early=='Yes' else max(80,40+tau);end=start+20
 delivered,D,S,base=portion(t);_,Df,Sf,Wf=portion(min(t,end));need=V+error-Wf-(.6*Df+Sf/2 if method=='solutionMark' else 0);W=base+ramp(t,start,end)*max(0,need);solution=W+.6*D;occupied=solution+S/2;boat=mw-delivered;actual=D/(solution/1000);mixed=t>=end+15 and end>=40+tau;ready=t>=end and S<1e-9 and abs(occupied-V)<1e-7 and mixed
 vals=[mw,boat,D,S,W,solution,occupied,actual,occupied-V]
 for a,b in zip(row[11:20],vals):near(a,b);checks+=1
 assert row[20]==('Yes' if mixed else 'No')
 assert row[21]==('Yes' if ready and boat<1e-9 else 'No')
 assert row[22]==('Yes' if ready and abs(actual-C)<1e-7 else 'No')
 worked.extend([m,mw,delivered,D,solution,S/2,occupied,solution/1000,actual,100*(actual-C)/C,mw,1.5*V])
results=[v.removeprefix('Result: ').split()[0] for v in r.paras if v.startswith('Result: ')]
assert len(results)==len(worked)==96
for a,b in zip(results,worked):near(a,b)
result={'actualGuiRows':8,'columns':24,'independentObservationNumericChecks':checks,'independentWorkedResults':len(worked),'escaping':'passed','method':'independent midpoint quadrature6000 samples per cohort'}
(p/'download-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
