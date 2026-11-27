"""Independent Python reconstruction of actual CL-0086 HTML report values.
No application imports. Boundary times within1ns are treated as their event.
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
  if t in ('td','th')and self.cell is not None:self.row.append(self.cell);self.cell=None
  if t=='tr':self.rows.append(self.row)
  if t=='table':self.tables.append(self.rows);self.rows=None
src=Path(sys.argv[1]).read_text();r=json.loads(re.search(r'<script id="sublimation-record-inputs" type="application/json">(.*?)</script>',src,re.S)[1]);p=Tables();p.feed(src);assert len(p.tables)==3
blocks=re.findall(r'<li><b>(.*?)</b><p>(.*?)</p><p>Substitution: (.*?)</p><p>Result: (.*?)</p></li>',src,re.S);assert len(blocks)==22*len(r['trials']);checks=0
def near(a,b):
 global checks
 assert abs(float(a)-b)<=max(1e-8,abs(b)*5e-9),(a,b)
 checks+=1
def row(actual,expected):
 global checks
 assert len(actual)==len(expected)
 for a,b in zip(actual,expected):
  if isinstance(b,(float,int)):near(a,b)
  else:assert a==b,(a,b);checks+=1
R=8.31446261815324;L=62420;M=253.80894;pref=1e5*10**(3.36429-1039.159/(313.15-146.589));spec=L/(M*1000)
for i,q in enumerate(r['trials']):
 alpha=R*313.15/((M/1000)*q['gasVolumeMl']*1e-6)*1e-6
 pressure=lambda T:pref*math.exp(L/R*(1/313.15-1/(T+273.15)))
 ps,pc=pressure(q['sourceC']),pressure(q['collectorC']);ks,kc=.001*q['sourceAreaCm2'],.001*q['collectorAreaCm2'];capS,capC=ps/alpha,pc/alpha;a=ks*alpha;initial=q['iodineMg'];pre=-math.log1p(-initial/capS)/a if initial<capS else None;tc=-math.log1p(-pc/ps)/a if kc>0 and ps>pc and initial>capC else None
 lam=(ks+kc)*alpha;eq=(ks*ps+kc*pc)/lam
 def exchange(u):
  if u<=0:return capC,0,0
  F=-math.expm1(-lam*u)/lam;delta=capC-eq
  gas=eq+delta*math.exp(-lam*u);used=ks*((ps-alpha*eq)*u-alpha*delta*F);deposit=kc*((alpha*eq-pc)*u+alpha*delta*F)
  return gas,used,max(0,deposit)
 te=None;evgas=None
 if tc is None or pre is not None and pre<=tc:
  if pre is not None and pre<=1800:te=pre;evgas=initial
 elif tc<=1800 and exchange(1800-tc)[1]>=initial-capC:
  lo=0;hi=1800-tc
  for _ in range(60):
   mid=(lo+hi)/2
   if exchange(mid)[1]<initial-capC:lo=mid
   else:hi=mid
  te=tc+hi;evgas=exchange(hi)[0]
 t=q['timeSeconds']
 for event in (tc,te):
  if event is not None and abs(t-event)<1e-9:t=event
 if te is not None and t>=te:
  source=0;gas=capC+(evgas-capC)*math.exp(-kc*alpha*(t-te))if kc>0 and evgas>capC else evgas;deposit=initial-gas;phase='source exhausted; vapour approaching collector equilibrium'if deposit>0 else'source exhausted; all iodine remains vapour'
 elif tc is not None and t>=tc:
  gas,used,deposit=exchange(t-tc);source=initial-gas-deposit;phase='source sublimation and collector deposition'
 else:
  gas=capS*-math.expm1(-a*t);source=initial-gas;deposit=0;phase='collector covered; building vapour'if q['collectorAreaCm2']==0 else'no cooler collector; approaching source equilibrium'if q['collectorC']>=q['sourceC']else'building vapour before deposition'
 partial=alpha*gas;qs=ks*max(0,ps-partial)if source>1e-9 else 0;qc=kc*max(0,partial-pc)if tc is not None and t>=tc else 0;recovery=100*deposit/initial;respur=100*q['residueMg']/(q['residueMg']+source);purity='Not established'if deposit<=1e-12 else 100;Qsource=(initial-source)*spec;Qcollector=deposit*spec;Hv=gas*spec
 row(p.tables[0][i+1],[i+1,*[q[k]for k in ('iodineMg','residueMg','sourceC','collectorC','sourceAreaCm2','collectorAreaCm2','gasVolumeMl','timeSeconds')],phase,q['note']])
 row(p.tables[1][i+1],[i+1,source,gas,deposit,initial,q['residueMg'],initial+q['residueMg'],recovery,respur,purity,partial,101325+partial,ps,pc,qs,qc,'No onset for this preparation'if tc is None else tc,'Not reached within 1800 s'if te is None else te])
 row(p.tables[2][i+1],[i+1,spec,Qsource,Qcollector,Hv,0,qs*spec,qc*spec])
 expected=[[q['sourceC']+273.15,q['collectorC']+273.15],[ps],[pc],[alpha],[partial,101325+partial],[qs],[qc],[initial,initial],[initial+q['residueMg']]*2,[recovery],[respur],purity if isinstance(purity,str)else[purity],[spec],[Qsource],[Qcollector],[Hv],[0],[qs*spec],[qc*spec],'Not reached within 1800 s'if te is None else[te],[capC],'No onset for this preparation'if tc is None else[tc]]
 assert len(expected)==22
 for block,wanted in zip(blocks[i*22:(i+1)*22],expected):
  result=unescape(block[3])
  if isinstance(wanted,str):assert result==wanted,(result,wanted);checks+=1;continue
  actual=re.findall(r'[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?',result);assert len(actual)==len(wanted),(block[0],result,wanted)
  for x,y in zip(actual,wanted):near(x,y)
assert all(len(t)==len(r['trials'])+1 for t in p.tables)
print(f'{len(r["trials"])} actual report preparations;{checks} independent checks;{len(blocks)} worked blocks checked')
