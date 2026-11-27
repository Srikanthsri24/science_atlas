"""Independent CL-0096 practical arithmetic,using decimal mass/stock/pipette/cell accounts.
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
  if tag=='script' and a.get('id')=='universal-indicator-record-inputs':self.in_json=True
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
COMP=[('methyl-red','Methyl red','.4',[(4.4,6.2)],'red','yellow'),('methyl-orange','Methyl orange','.2',[(3.2,4.4)],'red','yellow-orange'),('phenolphthalein','Phenolphthalein','.2',[(8,10)],'colourless','pink'),('thymol-blue','Thymol blue','1',[(1.2,2.8),(8,9.6)],'red','blue'),('bromothymol-blue','Bromothymol blue','.8',[(6.2,7.6)],'yellow','blue')]
CARDS={2:'red',4:'orange',6:'yellow',7:'green',9:'blue',11:'purple'}
KEYS=['stockMl','sampleMl','doseUl','pH','component','mixtureFraction','singleFraction','mixtureLoadFraction','singleLoadFraction']
def nums(s):return[float(x)for x in re.findall(r'(?<![A-Za-z0-9.])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?',s)]
def solve(q):
 with localcontext()as ctx:
  ctx.prec=50
  stock=D(q['stockMl']);sample=D(q['sampleMl']);dose=D(q['doseUl']);chosen=next(c for c in COMP if c[0]==q['component']);pH=q['pH'];in_range=any(lo<=pH<=hi for lo,hi in chosen[3]);endpoint='unresolved' if in_range else ('red' if pH<1.2 else 'yellow' if pH<8 else 'blue') if q['component']=='thymol-blue' else chosen[4] if pH<chosen[3][0][0] else chosen[5]
  H=Decimal(10)**(-pH);OH=Decimal('1e-14')/H;pOH=14-pH;cells=[]
  for n in range(2):
   f=D(q['mixtureFraction' if n==0 else 'singleFraction']);load=D(q['mixtureLoadFraction' if n==0 else 'singleLoadFraction']);loaded_ul=dose*load;loaded=loaded_ul/1000;del_ul=dose*f;del_ml=del_ul/1000;pip=loaded-del_ml;remain=stock-loaded;vol=sample+del_ml;VL=vol/1000;eth=Decimal('.95')*del_ml;sw=Decimal('.05')*del_ml;water=sample+sw;dyes=[]
   for ident,name,C,*_ in COMP:
    C=Decimal(C) if n==0 or ident==q['component'] else Decimal(0);initial=C*stock;delivered=C*del_ml;left=C*remain;inpip=C*pip;dyes.append(dict(id=ident,name=name,C=C,ref=C*100,initial=initial,delivered=delivered,left=left,inpip=inpip,cellC=delivered/VL))
   cells.append(dict(name='Five-dye mixture' if n==0 else chosen[1]+' alone',f=f,load=load,loaded_ul=loaded_ul,loaded=loaded,del_ul=del_ul,del_ml=del_ml,pip=pip,remain=remain,vol=vol,VL=VL,eth=eth,sw=sw,water=water,phi=eth/vol,dyes=dyes,initial=sum(c['initial']for c in dyes),delivered=sum(c['delivered']for c in dyes),left=sum(c['left']for c in dyes),inpip=sum(c['inpip']for c in dyes),complete=f==1,category=(CARDS[pH]if n==0 else endpoint)if f==1 else'not-ready'))
  ready=all(c['complete']for c in cells);inference='Complete the selected dose in both independent cells before comparing endpoints.' if not ready else 'The constituent is within its stated transition interval,so its exact intermediate hue remains unresolved. Compare that limited range with the mixture’s selected teaching card,not a colour-derived exactpH.' if in_range else 'The completed constituent cell is colourless despite receiving its measured dye dose. The mixture’s selected teaching card differs;colourless is not evidence of an empty or undosed cell.' if endpoint=='colourless' else 'A constituent endpoint covers many pH values outside its transition interval. The mixture offers several selected teaching reference cards,but no match proves an exactpH or chemical identity.'
  a=next(c for c in cells[0]['dyes']if c['id']==q['component']);b=next(c for c in cells[1]['dyes']if c['id']==q['component']);ratio=None if b['delivered']==0 else a['delivered']/b['delivered']
  return dict(stock=stock,sample=sample,dose=dose,pH=pH,H=H,OH=OH,pOH=pOH,chosen=chosen,cells=cells,ready=ready,inference=inference,a=a,b=b,ratio=ratio,diff=a['delivered']-b['delivered'])

def main(path):
 d=Document();d.feed(open(path).read());trials=json.loads(d.json_text)['trials'];assert len(d.tables)==4;checks=0;wi=0
 def near(a,b,where,absolute=2e-25):
  nonlocal checks
  a=float(a);b=float(b);assert math.isfinite(a)and math.isfinite(b),where
  assert abs(a-b)<=2e-10*abs(b)+absolute,(where,a,b);checks+=1
 def row(actual,expected,where,tolerances={}):
  assert len(actual)==len(expected),(where,len(actual),len(expected))
  for j,(a,b)in enumerate(zip(actual,expected)):
   if b is None:assert a=='Not defined',(where,j,a)
   elif isinstance(b,str):assert a==b,(where,j,a,b)
   else:near(a,b,(where,j),tolerances.get(j,2e-25))
 def work(operands,result,absolute=2e-25):
  nonlocal wi
  sub,res=d.worked[wi];wi+=1;found=nums(sub);assert len(found)==len(operands),(wi,sub,operands)
  for a,b in zip(found,operands):near(a,b,('operand',wi))
  if result is None:assert res.startswith('Not defined:'),(wi,res)
  else:
   found=nums(res);assert len(found)==1,(wi,res);near(found[0],result,('result',wi),absolute)
 for i,q in enumerate(trials):
  s=solve(q);stock=s['stock'];sample=s['sample'];dose=s['dose'];H=s['H'];OH=s['OH'];pOH=s['pOH'];a=s['a'];b=s['b'];cells=s['cells'];ranges=';'.join(f'{lo}–{hi}'for lo,hi in s['chosen'][3])
  row(d.tables[0][i+1],[i+1,*[q[k]for k in KEYS],q['note']],('prep',i))
  row(d.tables[3][i+1],[i+1,q['pH'],s['chosen'][1],ranges,cells[0]['category'],cells[1]['category'],'Yes'if s['ready']else'No',a['delivered'],b['delivered'],s['diff'],s['ratio'],s['inference']],('comparison',i))
  for operands,result,tol in[([stock,1000],stock/1000,2e-25),([10,-q['pH']],H,2e-25),([14,q['pH']],pOH,2e-25),([10,-pOH],OH,2e-25),([H,1e-7],H/Decimal('1e-7'),2e-25),([H,OH,1e-14],0,3e-30)]:work(operands,result,tol)
  for n,t in enumerate(cells):
   row(d.tables[1][1+2*i+n],[i+1,t['name'],t['f'],t['del_ul'],t['del_ml'],t['vol'],t['VL'],t['remain'],t['eth'],t['sw'],t['water'],t['phi'],t['initial'],t['delivered'],t['left'],'Yes'if t['complete']else'No',t['category'],0,0,0,0,t['load'],t['loaded_ul'],t['loaded'],t['pip'],t['inpip'],0],('cell',i,n),{17:5e-15,18:4e-14,19:5e-15,20:5e-13,26:5e-14})
   blocks=[([dose,t['f']],t['del_ul'],2e-25),([t['del_ul'],1000],t['del_ml'],2e-25),([sample,t['del_ml']],t['vol'],2e-25),([t['vol'],1000],t['VL'],2e-25),([stock,t['loaded']],t['remain'],2e-25),([.95,t['del_ml']],t['eth'],2e-25),([.05,t['del_ml']],t['sw'],2e-25),([sample,t['sw']],t['water'],2e-25),([t['eth'],t['vol']],t['phi'],2e-25),([stock,t['loaded'],t['remain']],0,4e-14),([t['vol'],sample,t['del_ml']],0,5e-15),([t['water'],t['eth'],t['vol']],0,5e-15),([t['initial'],t['delivered'],t['left'],t['inpip']],0,5e-13),([dose,t['load']],t['loaded_ul'],2e-25),([t['loaded_ul'],1000],t['loaded'],2e-25),([t['loaded_ul'],t['del_ul'],1000],t['pip'],2e-25),([stock,sample,t['remain'],t['pip'],t['vol']],0,5e-14)]
   for operands,result,tol in blocks:work(operands,result,tol)
   for c,dy in enumerate(t['dyes']):
    row(d.tables[2][1+10*i+5*n+c],[i+1,t['name'],dy['name'],dy['ref'],dy['C'],dy['initial'],dy['delivered'],dy['left'],dy['cellC'],0,dy['inpip']],('dye',i,n,c),{9:2e-13})
    for operands,result,tol in[([dy['C'],100],dy['ref'],2e-25),([dy['ref'],stock,100],dy['initial'],2e-25),([dy['C'],t['del_ml'],1000,1000],dy['delivered'],2e-25),([dy['C'],t['remain']],dy['left'],2e-25),([dy['delivered'],t['VL']],dy['cellC'],2e-25),([dy['initial'],dy['delivered'],dy['left'],dy['inpip']],0,2e-13),([dy['C'],t['pip']],dy['inpip'],2e-25)]:work(operands,result,tol)
  work([a['delivered'],b['delivered']],s['diff']);work([]if s['ratio']is None else[a['delivered'],b['delivered']],s['ratio']);vr=None if cells[1]['del_ul']==0 else cells[0]['del_ul']/cells[1]['del_ul'];work([]if vr is None else[cells[0]['del_ul'],cells[1]['del_ul']],vr)
 assert len(d.tables[0])==len(d.tables[3])==len(trials)+1
 assert len(d.tables[1])==2*len(trials)+1
 assert len(d.tables[2])==10*len(trials)+1
 assert wi==len(d.worked)==113*len(trials)
 print(f'PASS:{len(trials)}trials,{2*len(trials)}cell records,{10*len(trials)}dye records,{checks}independent table/numeric-operand/result checks,{wi}workedblocks.')
if __name__=='__main__':main(sys.argv[1])
