"""CL-0097 independent50-digit Decimal calorimeter report checker.No application imports."""
import json,re,sys
from decimal import Decimal,localcontext
from html.parser import HTMLParser
D=lambda x:Decimal(str(x))
class Document(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.part=None;self.p=None;self.sub=None;self.work=[];self.json_text='';self.in_json=False
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag in ('td','th'):self.cell=''
  if tag=='p':self.part=a.get('class');self.p=''
  if tag=='script' and a.get('id')=='neutralization-heat-record-inputs':self.in_json=True
 def handle_data(self,s):
  if self.cell is not None:self.cell+=s
  if self.p is not None:self.p+=s
  if self.in_json:self.json_text+=s
 def handle_endtag(self,tag):
  if tag in ('td','th'):self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.table is not None:self.table.append(self.row)
  if tag=='table':self.table=None
  if tag=='script':self.in_json=False
  if tag=='p':
   if self.part=='substitution':self.sub=self.p
   if self.part=='result':self.work.append((self.sub,self.p))
   self.part=None;self.p=None
KEYS=['acidMl','baseMl','acidMolL','baseMolL','initialC','cupJK','deliveredFraction']
BOUNDS=[(10,100),(10,100),(.1,1),(.1,1),(20,30),(0,50),(0,1)]
def numbers(s):return[D(x)for x in re.findall(r'(?<![A-Za-z0-9.])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?',s.replace('−','-'))]
def solve(q):
 with localcontext()as ctx:
  ctx.prec=50
  a,b,ca,cb,T,C,f=[D(q[k])for k in KEYS];dv=a*f;rv=a-dv;na=a*ca/1000;nd=dv*ca/1000;nr=rv*ca/1000;nb=b*cb/1000;x=min(nd,nb);ae=nd-x;be=nb-x;v=b+dv;m=v;cs=m*D('4.184');ct=cs+C;qr=-D(57300)*x;Q=-qr;dt=Q/ct;temp=T+dt;qs=cs*dt;qc=C*dt;eq=1000*nb/ca;peak=min(a,eq);pt=T+D(57300)*min(peak*ca/1000,nb)/((b+peak)*D('4.184')+C);correct=None if x==0 else-(qs+qc)/(1000*x);apparent=None if x==0 else-qs/(1000*x)
  at=x>0 and abs(nd-nb)<=D('1e-13')*max(nd,nb);condition='not-started'if dv==0 else'stoichiometric'if at else'base-excess'if nd<nb else'acid-excess'
  row=[dv,rv,na,nd,nr,nb,x,ae,be,v,m,cs,ct,qr,Q,dt,temp,qs,qc,D(0),D(0),D(0),D(0),D(0),correct,apparent,eq,'Yes'if eq/a<=1+D('1e-14')else'No',peak,pt,condition]
  works=[([ca,a,1000],na),([cb,b,1000],nb),([a,f],dv),([a,dv],rv),([ca,dv,1000],nd),([ca,rv,1000],nr),([nd,nb],x),([nd,x],ae),([nb,x],be),([b,dv],v),([1,v],m),([m,D('4.184')],cs),([cs,C],ct),([x,-57300],qr),([qr],Q),([Q,ct],dt),([T,dt],temp),([cs,dt],qs),([C,dt],qc),([qr,qs,qc],D(0)),([]if x==0 else[qs,qc,1000,x],correct),([]if x==0 else[-qs,1000,x],apparent),([1000,nb,ca],eq),([a,eq],peak),([a,b,rv,v],D(0)),([na,nr,x,ae],D(0)),([nb,x,be],D(0)),([nb,ae,nd,be],D(0))]
  return row,works

def main(path):
 d=Document();d.feed(open(path).read());r=json.loads(d.json_text);trials=r['trials'];assert 0<=len(trials)<=40;assert len(d.tables)==2;checks=0;wi=0
 def close(actual,expected):
  nonlocal checks
  checks+=1;actual=D(actual);expected=D(expected);assert actual.is_finite()and abs(actual-expected)<=max(D('1e-10'),abs(expected)*D('5e-11')),(actual,expected)
 for i,q in enumerate(trials):
  for k,(lo,hi)in zip(KEYS,BOUNDS):assert isinstance(q[k],(int,float))and not isinstance(q[k],bool)and D(lo)<=D(q[k])<=D(hi)
  p=d.tables[0][i+1];assert len(p)==9 and p[0]==str(i+1)and p[-1]==q['note'];checks+=2
  for value,k in zip(p[1:8],KEYS):close(value,q[k])
  row,works=solve(q);o=d.tables[1][i+1];assert len(o)==32 and o[0]==str(i+1);checks+=1
  for actual,expected in zip(o[1:],row):
   if expected is None:assert actual=='Not defined';checks+=1
   elif isinstance(expected,str):assert actual==expected;checks+=1
   else:close(actual,expected)
  for operands,result in works:
   sub,res=d.work[wi];wi+=1;ns=numbers(sub);assert len(ns)==len(operands),(i,wi,sub,operands)
   for actual,expected in zip(ns,operands):close(actual,expected)
   if result is None:assert res=='Not defined: no reacted amount.';checks+=1
   else:
    nums=numbers(res);assert len(nums)==1,(res,nums);close(nums[0],result)
 assert len(d.tables[0])==len(d.tables[1])==len(trials)+1
 assert wi==len(d.work)==28*len(trials)
 print(f'PASS:{len(trials)}trials,{checks}independent table/numeric-operand/result checks,{wi}workedblocks.')
if __name__=='__main__':main(sys.argv[1])
