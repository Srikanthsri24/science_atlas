"""Independently integrate inventories and check the actual downloaded GUI report."""
from html.parser import HTMLParser
from pathlib import Path
import math,json,re
class Tables(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.table=[]
  elif tag=='tr':self.row=[]
  elif tag in ('td','th'):self.cell=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
 def handle_endtag(self,tag):
  if tag in ('td','th') and self.cell is not None:self.row.append(self.cell);self.cell=None
  elif tag=='tr' and self.row is not None:self.table.append(self.row);self.row=None
  elif tag=='table':self.tables.append(self.table);self.table=None
p=Path(__file__).parent;html=p.joinpath('actual-ui-report.html').read_text();parser=Tables();parser.feed(html)
assert len(parser.tables)==4
prep,A,B,notes=[table[1:] for table in parser.tables];assert len(prep)==len(A)==len(B)==len(notes)==13
tares=[float(x) for x in re.findall(r'Substitution: round\(([\d.]+)/',html)];assert len(tares)==26
checks=0
def near(a,b,tol=2e-5):
 global checks
 assert abs(float(a)-b)<=tol*max(1,abs(b)),(a,b);checks+=1
def rk(W,S,E,J,t):
 w,s=W,S;wet=0
 def rate(w,s):
  if w<=0:return(-E-J/1.25,-J*.25/1.25)
  d=min(s,.25*w);return(-E-J*w/(w+d),-J*d/(w+d))
 while wet<t-1e-10 and w>1e-10:
  a=rate(w,s);h=min(.01,t-wet,w/(-a[0]));b=rate(w+a[0]*h/2,s+a[1]*h/2);c=rate(w+b[0]*h/2,s+b[1]*h/2);d=rate(w+c[0]*h,s+c[1]*h)
  w+=h*(a[0]+2*b[0]+2*c[0]+d[0])/6;s+=h*(a[1]+2*b[1]+2*c[1]+d[1])/6;wet+=h
 return max(0,w),s,E*wet,W-max(0,w)-E*wet,S-s
for i,row in enumerate(prep):
 trial,W,S,E,J,t,cool,station,inc,tare=row;W,S,E,J,t,cool,inc,tare=map(float,(W,S,E,J,t,cool,inc,tare));nominal=tares[2*i];near(nominal,tares[2*i+1])
 temp=70 if station=='drying' else 25+45*math.exp(-cool/30);reportable=station=='weighing' and temp<=30
 for columns,loss in ((A[i],0),(B[i],J)):
  w,s,v,sw,ss=rk(W,S,E,loss,t);D=min(s,.25*w);solid=s-D
  near(columns[1],w);near(columns[2],D);near(columns[3],solid);near(columns[4],v)
  k=5
  if loss==J and columns is B[i]:near(columns[5],sw);near(columns[6],ss);k=7
  near(columns[k],temp)
  if reportable:
   rnd=lambda n:math.floor(n/inc+.5)*inc
   gross=rnd(nominal+w+s);net=gross-tare
   near(columns[k+1],gross);near(columns[k+2],net);near(columns[k+3],100*net/S)
   if w<1e-8:near(columns[k+4],100*net/S)
   else:assert columns[k+4]=='Not a cooled dry measurement'
  else:assert columns[k+1:k+4]==['Not reportable']*3
assert '&lt;safe&gt; &amp; evidence' in html and '<safe>' not in html
assert html.count('Substitution:')==13*24
out={'actualGuiTrials':13,'numericObservationChecks':checks,'workedBlocks':13*24,'reportTables':4,'independentInventoryMethod':'RK4 dt<=0.01s with final positive-water step','status':'passed','limitations':'No physical printer,chemical calibration or independent expert certification.'}
p.joinpath('download-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out))
