"""Independently reconstruct actual GUI data with RK4;no TypeScript imports."""
from pathlib import Path
from html.parser import HTMLParser
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
assert len(r.rows)>=9 and all(len(v)==22 for v in r.rows)
rounded=lambda v,step:math.floor(v/step+.5)*step
def near(actual,expected,tol=3e-6):assert abs(float(actual)-expected)<tol*max(1,abs(expected)),(actual,expected)
checks=0;worked=[];points=[];protocols=set()
for row in r.rows:
 water,loading,rate,tau,delta,offset,tinc,minc,winc,time=map(float,row[1:11]);mass=water*loading/100;eq=25+(loading-24)/.8;eqTime=(70-eq)/rate;coolEnd=60/rate;endAge=coolEnd-eqTime;a=water*.8*rate/100
 def rhs(age,S):return(a*min(age,endAge)-S)/tau
 def advance(age,S,dt):
  x=rhs(age,S);y=rhs(age+dt/2,S+dt*x/2);z=rhs(age+dt/2,S+dt*y/2);w=rhs(age+dt,S+dt*z);return S+dt*(x+2*y+2*z+w)/6
 # Integrate until the first threshold,then refine within the final RK4 step.
 age=0;solid=0;dt=.002
 while solid<delta:
  before=solid;previous=age;solid=advance(age,solid,dt);age+=dt
 lo=0;hi=dt
 for _ in range(45):
  mid=(lo+hi)/2
  if advance(previous,before,mid)<delta:lo=mid
  else:hi=mid
 cloudAge=previous+(lo+hi)/2;cloudTime=eqTime+cloudAge;cloudTrue=70-rate*cloudTime
 def residueAt(end):
  if end<=0:return 0
  n=max(1,math.ceil(end/.02));h=end/n;u=0;S=0
  for _ in range(n):S=advance(u,S,h);u+=h
  return S
 currentAge=max(0,time-eqTime);S=residueAt(currentAge);D=mass-S;T=max(10,70-rate*time);mr=rounded(mass,minc);wr=rounded(water,winc);Tcurrent=rounded(T+offset,tinc);eventReading=rounded(cloudTrue+offset,tinc);estimate=100*mr/wr;detected=time+1e-5>=cloudTime
 for actual,expected in zip(row[11:16],[T,D,S,mr,wr]):near(actual,expected);checks+=1
 assert row[16]==('Yes' if detected else 'No')
 if detected:
  near(row[17],cloudTime);near(row[18],eventReading);near(row[19],estimate);checks+=3;assert row[20]=='Yes';points.append((eventReading,estimate));protocols.add((water,rate,tau,delta,offset,tinc,minc,winc))
 else:assert row[17]=='Not yet reached' and row[18]=='Not yet reached' and row[19]=='Not yet established' and row[20]=='No'
 rampAge=max(0,min(time,coolEnd)-eqTime);Sramp=residueAt(rampAge)
 worked.extend([mass,mr,wr,T,Tcurrent,eq,eqTime,a,rampAge,Sramp,D,S,mass,eventReading if detected else None,estimate if detected else None,mass-delta,eq-cloudTrue,tinc/2])
assert len(set(x for x,y in points))>=3
n=len(points);xm=sum(x for x,y in points)/n;ym=sum(y for x,y in points)/n;sxx=sum((x-xm)**2 for x,y in points);sxy=sum((x-xm)*(y-ym) for x,y in points);slope=sxy/sxx;intercept=ym-slope*xm;SSE=sum((y-intercept-slope*x)**2 for x,y in points);SST=sum((y-ym)**2 for x,y in points)
worked.extend([xm,ym,sxx,sxy,slope,intercept,intercept+25*slope,SSE,SST,1-SSE/SST if SST>1e-12 else None])
results=[v.removeprefix('Result: ') for v in r.paras if v.startswith('Result: ')]
assert len(results)==len(worked),(len(results),len(worked))
for actual,expected in zip(results,worked):
 if expected is None:assert actual.startswith(('Not established','Not informative'))
 else:near(actual.split()[0],expected)
assert html.count('<circle')==len(points)
assert '&lt;safe&gt; &amp; evidence' in html and '<safe>' not in html
if len(protocols)>1:assert 'Different preparation/measurement protocols are combined here' in html
result={'actualGuiRows':len(r.rows),'columns':22,'numericObservationChecks':checks,'workedResults':len(worked),'savedGraphPoints':len(points),'distinctTemperatures':len(set(x for x,y in points)),'measurementProtocols':len(protocols),'method':'independent RK4,0.002s event bracketing/refinement and <=0.02s inventory integration','escaping':'passed','fit':{'slope':slope,'intercept':intercept,'rSquared':1-SSE/SST}}
(p/'download-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
