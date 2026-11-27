"""Independent Python checks of actual CL-0085 browser-downloaded report.
No application imports. Recomputes speed exposure,transport,screen and balances.
"""
import json,math,re,sys
from pathlib import Path
from html import unescape
from html.parser import HTMLParser
class Tables(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.rows=None;self.row=None;self.cell=None
 def handle_starttag(self,t,a):
  if t=='table':self.rows=[]
  if t=='tr':self.row=[]
  if t in ('td','th'):self.cell=''
 def handle_data(self,s):
  if self.cell is not None:self.cell+=s
 def handle_endtag(self,t):
  if t in ('td','th') and self.cell is not None:self.row.append(self.cell);self.cell=None
  if t=='tr':self.rows.append(self.row)
  if t=='table':self.tables.append(self.rows);self.rows=None
src=Path(sys.argv[1]).read_text();r=json.loads(re.search(r'<script id="separation-pair-record-inputs" type="application/json">(.*?)</script>',src,re.S)[1]);parser=Tables();parser.feed(src);assert len(parser.tables)==3
blocks=re.findall(r'<li><b>(.*?)</b><p>(.*?)</p><p>Substitution: (.*?)</p><p>Result: (.*?)</p></li>',src,re.S);assert len(blocks)==33*len(r['trials'])
checks=0
def near(a,b):
 global checks
 assert abs(float(a)-b)<=max(1e-9,abs(b)*3e-9),(a,b)
 checks+=1
def row(actual,expected):
 global checks
 assert len(actual)==len(expected)
 for a,b in zip(actual,expected):
  if isinstance(b,(int,float)):near(a,b)
  else:assert a==b,(a,b);checks+=1
def spin(q,t):
 end=q['holdSeconds']+20;omega=q['rpm']*math.pi/30;t=min(t,end)
 if t<=10:n=t/10;J=omega**2*t**3/300
 elif t<=10+q['holdSeconds']:n=1;J=omega**2*(10/3+t-10)
 else:u=t-10-q['holdSeconds'];n=max(0,1-u/10);J=omega**2*(10/3+q['holdSeconds']+u-u*u/10+u**3/300)
 if t>=end:n=0;J=omega**2*(q['holdSeconds']+20/3)
 return omega,omega*n,J
for i,q in enumerate(r['trials']):
 t=q['timeSeconds'];om,w,J=spin(q,t);mu=q['viscosityMpaS']/1000;ri=q['innerRadiusCm']/100;rb=ri+.04;area=.0005;a=q['poreUm']*1e-6/2;k=.4*a*a/40;decay=k*1000*9.81/(mu*.0002);processed=-math.expm1(-decay*t);remaining=10*math.exp(-decay*t);collected=10*processed;stage='stopped'if t>=q['holdSeconds']+20 else'accelerating'if t<10 else'holding'if t<10+q['holdSeconds']else'decelerating'
 prep=[i+1,q['poreUm'],q['particleDensityKgM3'],q['viscosityMpaS'],q['rpm'],q['holdSeconds'],q['innerRadiusCm'],t,w*30/math.pi,stage,w*w*ri/9.81,w*w*rb/9.81,om*om*rb/9.81,J,q['note']];row(parser.tables[0][i+1],prep)
 pieces=[];total_up=total_captured=total_passed=total_pellet=total_suspended=0;Re_max=0
 worked=[[mu],[om,w],[w*w*ri/9.81,w*w*rb/9.81],[om*om*rb/9.81],[J],[k],[decay],[remaining,collected],[decay*remaining]]
 size_work=[]
 for j,d in enumerate([1,3,6]):
  S=(d*1e-6)**2*(q['particleDensityKgM3']-1000)/(18*mu);exponent=S*J;fraction=min(1,rb/(rb-ri)*-math.expm1(-exponent));pellet=.005*fraction;suspended=.005-pellet;up=.005*(1-processed);captured=.005*processed if d>=q['poreUm'] else 0;passed=.005*processed-captured;front=min(rb,ri*math.exp(min(exponent,math.log(rb/ri))));required=math.log(rb/ri)/S;Re=1000*(S*om*om*rb)*(d*1e-6)/mu;Re_max=max(Re_max,Re)
  _,_,finalJ=spin(q,q['holdSeconds']+20)
  full='Not reached by selected program'
  if finalJ>=required:
   lo=0;hi=q['holdSeconds']+20
   for _ in range(55):
    mid=(lo+hi)/2
    if spin(q,mid)[2]<required:lo=mid
    else:hi=mid
   full=hi
  row(parser.tables[2][1+i*3+j],[i+1,d,5,up*1000,captured*1000,passed*1000,pellet*1000,suspended*1000,S,front*100,required,full,Re])
  total_up+=up;total_captured+=captured;total_passed+=passed;total_pellet+=pellet;total_suspended+=suspended
  size_work += [[S],[front*100],[fraction],[pellet*1000,suspended*1000],[up*1000,captured*1000,passed*1000],[Re]]
 receiver=None if collected==0 else total_passed*1000/collected
 summary=[i+1,remaining,collected,decay*remaining,total_up*1000,total_captured*1000,total_passed*1000,100*total_captured/.015,total_pellet*1000,total_suspended*1000,100*total_pellet/.015,'Not established'if receiver is None else receiver,total_suspended*1000/10,10.015,10.015,Re_max,(.015/(q['particleDensityKgM3']/1000))/(10+.015/(q['particleDensityKgM3']/1000))];row(parser.tables[1][i+1],summary)
 worked += [[100*total_captured/.015],[100*total_pellet/.015],[]if receiver is None else[receiver],[1000*total_suspended/10],[10.015,10.015],[10.015,10.015]]+size_work
 assert len(worked)==33
 for block,values in zip(blocks[33*i:33*(i+1)],worked):
  result=unescape(block[3]);numbers=re.findall(r'[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?',result)
  assert len(numbers)==len(values),(block[0],result,values)
  for actual,expected in zip(numbers,values):near(actual,expected)
  if not values:assert result=='Not established'
assert len(parser.tables[0])==len(r['trials'])+1 and len(parser.tables[1])==len(r['trials'])+1 and len(parser.tables[2])==3*len(r['trials'])+1
print(f'{len(r["trials"])} actual preparations;{checks} independent numeric/text checks;{len(blocks)} worked blocks checked')
