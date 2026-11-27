"""Independent reconstruction of actual downloaded CL-0087 HTML observations.
Does not import app outputs; ideal-phase/energy solver is independently coded.
"""
import json,math,sys,re
from html.parser import HTMLParser
class Document(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.current=None;self.row=None;self.cell=None;self.json_text='';self.in_json=False;self.blocks=0;self.paragraph=None;self.worked=[];self.substitution=None
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='p':self.paragraph=''
  if tag=='table':self.current=[];self.tables.append(self.current)
  if tag=='tr':self.row=[]
  if tag in ('td','th'):self.cell=''
  if tag=='script' and attrs.get('id')=='mixture-melting-record-inputs':self.in_json=True
 def handle_data(self,data):
  if self.paragraph is not None:self.paragraph+=data
  if self.cell is not None:self.cell+=data
  if self.in_json:self.json_text+=data
  if data.startswith('Substitution:'):self.blocks+=1
 def handle_endtag(self,tag):
  if tag=='p' and self.paragraph is not None:
   if self.paragraph.startswith('Substitution:'):self.substitution=self.paragraph[13:].strip()
   if self.paragraph.startswith('Result:'):self.worked.append((self.substitution,self.paragraph[7:].strip()))
   self.paragraph=None
  if tag in ('td','th') and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.current is not None:self.current.append(self.row)
  if tag=='table':self.current=None
  if tag=='script':self.in_json=False
R=8.31446261815324
xa=lambda T:math.exp(-10000/R*(1/T-1/333.15))
xb=lambda T:math.exp(-12000/R*(1/T-1/353.15))
def root(fun,lo,hi):
 for _ in range(100):
  m=(lo+hi)/2
  if fun(m)>0:hi=m
  else:lo=m
 return (lo+hi)/2
Te=root(lambda T:xa(T)+xb(T)-1,100,333.15);xe=xa(Te)
def reference(q,x):
 n=q['amountMmol']/1000;P=q['netPowerW'];t=q['timeSeconds'];pure=x in (0,1)
 onset=(333.15 if x==1 else 353.15) if pure else Te
 completion=onset if pure else 1/(1/(333.15 if x>=xe else 353.15)-R/(10000 if x>=xe else 12000)*math.log(x if x>=xe else 1-x))
 fp=1 if pure else min(x/xe,(1-x)/(1-xe));lp=(10000 if x==1 else 12000) if pure else fp*(xe*10000+(1-xe)*12000)
 low=50*(onset-278.15);maxQ=n*(50*85+x*10000+(1-x)*12000);Q=min(P*t,maxQ);h=Q/n
 def amounts(T):
  if T>=completion:return x,1-x
  if x>xe:return min(x,(1-x)*xa(T)/(1-xa(T))),1-x
  return x,min(1-x,x*xb(T)/(1-xb(T)))
 if h<low:T=278.15+h/50;a=b=0
 elif h<=low+lp:
  T=onset;f=(h-low)/lp
  a,b=(x*f,(1-x)*f) if pure else (fp*xe*f,fp*(1-xe)*f)
 elif h>=50*(completion-278.15)+x*10000+(1-x)*12000:a,b=x,1-x;T=278.15+(h-a*10000-b*12000)/50
 else:
  def H(T):
   aa,bb=amounts(T);return 50*(T-278.15)+aa*10000+bb*12000-h
  T=root(H,onset,completion);a,b=amounts(T)
 f=a+b;sensible=n*50*(T-278.15);la=n*a*10000;lb=n*b*12000
 phase=[T-273.15,(x-a)*n*1000,a*n*1000,(1-x-b)*n*1000,b*n*1000,n*1000,f,None if f==0 else a/f,onset-273.15,completion-273.15,completion-onset,n*low/P,n*(low+lp)/P,n*(50*(completion-278.15)+x*10000+(1-x)*12000)/P]
 energy=[P*t,Q,P*t-Q,sensible,la,lb,Q-sensible-la-lb]
 return phase,energy,dict(T=T,a=a,b=b,fp=fp,lp=lp,onset=onset,completion=completion,maxQ=maxQ)
def main(path):
 d=Document();d.feed(open(path).read());r=json.loads(d.json_text);assert len(d.tables)==3;trials=r['trials'];assert trials,'No actual observations';checks=0
 assert [len(t)-1 for t in d.tables]==[len(trials),2*len(trials),2*len(trials)]
 for i,q in enumerate(trials):
  row=d.tables[0][i+1];assert len(row)==6
  for actual,key in zip(row[1:5],['xA','amountMmol','netPowerW','timeSeconds']):assert math.isclose(float(actual),q[key],rel_tol=2e-9,abs_tol=1e-8);checks+=1
  assert row[5]==q['note'];checks+=1
  for j,x in enumerate([q['xA'],1]):
   phase,energy,z=reference(q,x)
   for table_index,values in [(1,phase),(2,energy)]:
    row=d.tables[table_index][1+2*i+j];assert len(row)==len(values)+2
    for actual,expected in zip(row[2:],values):
     if expected is None:assert actual=='No liquid present'
     else:assert math.isclose(float(actual),expected,rel_tol=2e-8,abs_tol=2e-7),(i,j,actual,expected)
     checks+=1
   # Independently inspect every printed worked result, not just table cells.
   n=q['amountMmol']/1000;T=z['T'];a=z['a'];b=z['b'];onset=z['onset'];completion=z['completion'];fp=z['fp'];lp=z['lp'];P=q['netPowerW'];t=q['timeSeconds'];Q=energy[1]
   results=[[n,n*x,n*(1-x)],[T],[xe,1-xe,1,Te-273.15],[onset-273.15,completion-273.15],[completion-onset],energy[:3],[energy[3]],[energy[4]],[energy[5]],[energy[6]],[x*n*1000],[(1-x)*n*1000],[a+b],[] if a+b==0 else [a/(a+b)],[fp],[phase[11]],[phase[12]],[T,a,b,energy[6]],[a+b],[phase[13]]]
   pure=x in (0,1);rich=x>xe;plateau=abs(T-onset)<1e-8
   substitutions=[[q['amountMmol'],1000,n,x,n,1,x],[T-273.15,273.15],[10000,R,1,Te,1,333.15,12000,R,1,Te,1,353.15],[onset] if pure else [1,333.15 if rich else 353.15,R,10000 if rich else 12000,x if rich else 1-x],[completion,onset],[P,t,energy[0],z['maxQ'],energy[0],Q],[n,50,T,278.15],[a*n*1000,1000,10000],[b*n*1000,1000,12000],energy[1:2]+energy[3:6],[(x-a)*n*1000,a*n*1000,n*1000,x],[(1-x-b)*n*1000,b*n*1000,n*1000,1,x],[a*n*1000,b*n*1000,n*1000],[] if a+b==0 else [a*n*1000,a*n*1000,b*n*1000],[] if pure else [x,xe,1,x,1,xe],[n,50,onset,278.15,P],[phase[11],n,lp,P],[Q,n,50,278.15,10000,12000],[] if a+b==0 or a+b>=1-1e-14 else [fp,Q,n,50,onset,278.15,lp] if plateau else [10000 if rich else 12000,R,1,T,1,333.15 if rich else 353.15,a/(a+b) if rich else b/(a+b),1,x,1,a/(a+b)] if rich else [12000,R,1,T,1,353.15,b/(a+b),x,1,b/(a+b)],[n,50,completion,278.15,x,10000,1,x,12000,P]]
   for k,(expected,expected_sub) in enumerate(zip(results,substitutions)):
    substitution,result=d.worked[(i*2+j)*20+k]
    # Digits embedded in identifiers (xA,LA) are absent; scientific notation retained.
    numbers=lambda text:[float(v) for v in re.findall(r'(?<![A-Za-z])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?',text)]
    actual=numbers(result);assert len(actual)==len(expected),(i,j,k,'result count',actual,expected)
    for aa,ee in zip(actual,expected):assert math.isclose(aa,ee,rel_tol=2e-8,abs_tol=2e-7),(i,j,k,'result',aa,ee);checks+=1
    actual_sub=numbers(substitution);assert len(actual_sub)==len(expected_sub),(i,j,k,'substitution count',actual_sub,expected_sub)
    for aa,ee in zip(actual_sub,expected_sub):assert math.isclose(aa,ee,rel_tol=2e-8,abs_tol=2e-7),(i,j,k,'substitution',aa,ee);checks+=1
 assert d.blocks==len(trials)*40
 print(f'PASS: {len(trials)} actual paired trials, {checks} independent table/worked-number checks, {d.blocks} worked calculation blocks.')
if __name__=='__main__':main(sys.argv[1])
