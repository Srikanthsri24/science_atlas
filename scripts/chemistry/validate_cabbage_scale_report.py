"""Independent CL-0095 practical arithmetic, using decimal reference exponents/volumes.
No application imports. Teaching categories are editorial data,not empirical calibration.
"""
import json,math,re,sys
from decimal import Decimal,localcontext
from html.parser import HTMLParser
class Document(HTMLParser):
 def __init__(self):
  super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.part=None;self.p=None;self.sub=None;self.worked=[];self.in_json=False;self.json_text=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag in ('td','th'):self.cell=''
  if tag=='p':self.part=a.get('class');self.p=''
  if tag=='script' and a.get('id')=='cabbage-scale-record-inputs':self.in_json=True
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
   if self.part=='result':self.worked.append((self.sub,self.p))
   self.p=None;self.part=None
D=lambda x:Decimal(str(x))
PH=[2,4,7,9,11];categories={2:'pink',4:'pink',7:'violet-blue',9:'blue-green',11:'green'}
def nums(s):return [float(x) for x in re.findall(r'(?<![A-Za-z0-9.])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?',s)]
def solve(q):
 with localcontext() as ctx:
  ctx.prec=50
  sample=D(q['sampleMl']);dose=D(q['indicatorDoseUl']);tubes=[]
  for i,(pH,fraction) in enumerate(zip(PH+[q['testPH']],q['fractions'])):
   fraction=D(fraction);ul=dose*fraction;ml=ul/1000;vol=sample+ml;H=Decimal(10)**(-pH);OH=Decimal('1e-14')/H
   tubes.append(dict(name='Investigation' if i==5 else f'Reference pH{pH}',pH=pH,f=fraction,ul=ul,ml=ml,vol=vol,L=vol/1000,phi=ml/vol,H=H,OH=OH,pOH=14-pH,complete=fraction==1,category=categories[pH] if fraction==1 else 'not-ready'))
  initial=6*dose;delivered=sum(t['ul'] for t in tubes);remaining=initial-delivered
  return tubes,initial,delivered,remaining

def main(path):
 d=Document();d.feed(open(path).read());trials=json.loads(d.json_text)['trials'];assert len(d.tables)==3;checks=0;wi=0
 def near(a,b,where,absolute=2e-25):
  nonlocal checks
  a=float(a);b=float(b);assert math.isfinite(a) and math.isfinite(b),where
  assert abs(a-b)<=2e-10*abs(b)+absolute,(where,a,b);checks+=1
 def row(actual,expected,where,tolerances={}):
  assert len(actual)==len(expected),(where,len(actual),len(expected))
  for j,(a,b) in enumerate(zip(actual,expected)):
   if isinstance(b,str):assert a==b,(where,j,a,b)
   else:near(a,b,(where,j),tolerances.get(j,2e-25))
 def work(operands,result,absolute=2e-25):
  nonlocal wi
  sub,res=d.worked[wi];wi+=1;found=nums(sub);assert len(found)==len(operands),(wi,sub,operands)
  for a,b in zip(found,operands):near(a,b,('operand',wi))
  found=nums(res);assert len(found)==1,(wi,res);near(found[0],result,('result',wi),absolute)
 for i,q in enumerate(trials):
  tubes,initial,delivered,remaining=solve(q);sample=D(q['sampleMl']);dose=D(q['indicatorDoseUl']);ready=all(t['complete'] for t in tubes);test=tubes[-1];matches=[t['pH'] for t in tubes[:5] if t['category']==test['category']] if ready else []
  inference='Finish the selected indicator dose in all six tubes before comparing the reference cards.' if not ready else f"The investigation matches the selected pH{' and pH'.join(map(str,matches))} cards. This shared shade cannot distinguish those references;it does not establish a continuous pH interval." if len(matches)>1 else f'The investigation matches the selected pH{matches[0]} card in this teaching set. A single matching card does not prove exact pH or chemical identity.'
  row(d.tables[0][i+1],[i+1,sample,dose,q['testPH'],*q['fractions'],q['note']],('prep',i))
  for operands,result,tol in [([6,dose],initial,2e-25),([t['ul'] for t in tubes],delivered,2e-25),([initial,delivered],remaining,1e-12),([initial,delivered,remaining],0,1e-12),([6,sample],6*sample,2e-25),([*[t['vol'] for t in tubes],remaining,1000,6*sample,initial,1000],0,1e-12)]:work(operands,result,tol)
  for j,t in enumerate(tubes):
   row(d.tables[1][1+6*i+j],[i+1,t['name'],t['pH'],t['f'],t['ul'],t['ml'],t['vol'],t['L'],t['phi'],'Yes' if t['complete'] else 'No',t['category'],t['H'],t['OH'],t['pOH'],0,0],('tube',i,j),{14:5e-15,15:3e-30})
   for operands,result,tol in [([dose,t['f']],t['ul'],2e-25),([t['ul'],1000],t['ml'],2e-25),([sample,t['ml']],t['vol'],2e-25),([t['vol'],1000],t['L'],2e-25),([t['ml'],t['vol']],t['phi'],2e-25),([14,t['pH']],t['pOH'],2e-25),([10,-t['pH']],t['H'],2e-25),([10,-t['pOH']],t['OH'],2e-25),([t['H'],t['OH'],1e-14],0,3e-30),([t['vol'],sample,t['ml']],0,5e-15)]:work(operands,result,tol)
  for j,a in enumerate(tubes[:5]):
   delta=test['pH']-a['pH'];ratio=a['H']/test['H'];power=Decimal(10)**delta;same='Not ready' if not a['complete'] or not test['complete'] else 'Yes' if a['category']==test['category'] else 'No'
   row(d.tables[2][1+5*i+j],[i+1,a['pH'],test['pH'],delta,ratio,power,same,'Yes' if ready else 'No',inference],('comparison',i,j))
   work([test['pH'],a['pH']],delta);work([a['H'],test['H']],ratio);work([10,delta],power)
 assert len(d.tables[0])==len(trials)+1
 assert len(d.tables[1])==6*len(trials)+1
 assert len(d.tables[2])==5*len(trials)+1
 assert wi==len(d.worked)==81*len(trials)
 print(f'PASS:{len(trials)}trials,{6*len(trials)}tube records,{checks}independent table/numeric-operand/result checks,{wi}workedblocks.')
if __name__=='__main__':main(sys.argv[1])
