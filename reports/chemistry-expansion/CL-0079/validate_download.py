"""Independent reconstruction of an actual GUI report; no TypeScript imports."""
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
assert len(r.rows)>=9 and all(len(v)==28 for v in r.rows)
curves={'strongIncrease':(24,.8),'slightIncrease':(35,.03),'decrease':(30,-.25)}
def near(a,b):assert abs(float(a)-b)<2e-6*max(1,abs(b)),(a,b)
checks=0;worked=[]
for row in r.rows:
 water,m,ta,tb,tauT,tauD,t=map(float,[row[1],row[2],row[4],row[5],row[6],row[7],row[8]]);S25,b=curves[row[3]]
 for offset,bath in [(9,ta),(18,tb)]:
  T=lambda time:25+(bath-25)*(1-math.exp(-time/tauT))
  K=lambda time:water*(S25+b*(T(time)-25))/100
  rate=lambda time,D:(min(m,K(time))-D)/tauD
  K0=water*S25/100;Kinf=water*(S25+b*(bath-25))/100;B=K0-Kinf;ratio=(m-Kinf)/B if B else -1;cross=-tauT*math.log(ratio) if 0<ratio<1 else None
  ends=([cross] if cross is not None and cross<t else [])+[t];D=min(m,K0);time=0;endValues=[]
  for end in ends:
   N=max(1,math.ceil((end-time)/.04));dt=(end-time)/N
   for i in range(N):
    a=rate(time,D);bb=rate(time+dt/2,D+a*dt/2);c=rate(time+dt/2,D+bb*dt/2);d=rate(time+dt,D+c*dt);D+=dt*(a+2*bb+2*c+d)/6;time+=dt
   endValues.append(D)
  solid=m-D;cap=K(t);target=min(m,cap);steady=abs(D-target)<.001 and abs(T(t)-bath)<.01;estimate=100*D/water if steady and solid>.001 else None
  for actual,expected in zip(row[offset:offset+6],[T(t),cap,D,solid,water+D,rate(t,D)]):near(actual,expected);checks+=1
  assert row[offset+6]==('Yes' if steady else 'No')
  if estimate is None:assert row[offset+7].startswith('Not established')
  else:near(row[offset+7],estimate);checks+=1
  worked.extend([T(t),100*cap/water,cap,target,*endValues,solid,water+D,rate(t,D),estimate,m,water+m])
results=[v.removeprefix('Result: ') for v in r.paras if v.startswith('Result: ')]
assert len(results)==len(worked),(len(results),len(worked))
for actual,expected in zip(results,worked):
 if expected is None:assert actual.startswith('Not established')
 else:near(actual.split()[0],expected)
assert '&lt;safe&gt; &amp; evidence' in html and '<safe>' not in html
result={'actualGuiRows':len(r.rows),'columns':28,'numericObservationChecks':checks,'workedResults':len(worked),'method':'independent RK4,maximum reference step0.04s','escaping':'passed'}
(p/'download-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
