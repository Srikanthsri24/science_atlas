import json,math,re,html
from pathlib import Path
from html.parser import HTMLParser
p=Path(__file__).parent;before=json.loads((p/'ui-record-before-reload.json').read_text());after=json.loads((p/'ui-record-after-reload.json').read_text());assert before==after;r=after['record'];assert len(r['trials'])==37;calc=[]
for i,q in enumerate(r['trials']):
 W,D,T,P,F,C,t=[q[n] for n in ['waterG','dyeMg','initialTemperatureC','netPowerW','coolantFlowMlMin','coolantInletC','timeS']];warm=W*4.18*(100-T);tb=warm/P;rate=P/2256;duration=.5*W/rate;stop=tb+duration;clamp=lambda delay:max(0,min(duration,t-tb-delay));heat=P*min(t,stop);sensible=min(heat,warm);temp=T+sensible/(W*4.18);vap=rate*clamp(0);arr=rate*clamp(3);transit=vap-arr;mc=F/60;cdot=mc*4.18;eff=-math.expm1(-2/cdot) if cdot>0 else 0;ua=cdot*(100-C)*eff;flow=cdot*20;cap=min(ua,flow);eta=min(1,cap/P);cond=eta*arr;rec=eta*rate*clamp(4);drain=cond-rec;vent=(1-eta)*arr;pot=W-vap;latent=vap*2256;removed=cond*2256;out=C+(P*eta/cdot if cdot>0 and t>tb+3 and t<stop+3 else 0);recovery=100*rec/W;concentration=D/(pot/1000)
 row=[i+1,t,W,D,T,P,F,C,pot,transit,drain,rec,vent,W,D,temp,heat,cap,eta,out,recovery,concentration,q['observation']]
 for j,x in enumerate(row):
  y=after['rows'][i][j]
  if isinstance(x,str):assert y==x
  else:assert math.isclose(float(y),x,rel_tol=1e-8,abs_tol=5.1e-7),(i,j,y,x)
 calc.extend([warm,tb,rate,stop,heat,sensible,temp,vap,arr,transit,mc,cdot,eff,ua,flow,cap,eta,cond,rec,drain,vent,pot,W,latent,removed,out,recovery,concentration,W/pot,W+D/1000])
report=(p/'ui-exported-practical.html').read_text();assert 'VisionariesAI Labs' in report and not re.search(r'https?://',report)
for n in ['prediction','conclusion']:assert html.escape(r[n],quote=True).replace('&#x27;','&#39;') in report
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.tables={};self.current=None;self.row=None;self.cell=None;self.inp=False;self.p='';self.results=[]
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.current=dict(attrs).get('data-still-table');self.tables[self.current]=[]
  if tag=='tr' and self.current is not None:self.row=[]
  if tag=='td' and self.current is not None:self.cell=''
  if tag=='p':self.inp=True;self.p=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
  if self.inp:self.p+=data
 def handle_endtag(self,tag):
  if tag=='td' and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.current is not None and self.row:self.tables[self.current].append(self.row);self.row=None
  if tag=='table':self.current=None
  if tag=='p' and self.inp:
   if self.p.startswith('Result: '):self.results.append(self.p[8:])
   self.inp=False
v=Parser();v.feed(report)
for j,cols in enumerate([[0,1,2,3,4,5,6,7],[0,1,8,9,10,11,12,13,14,22],[0,1,15,16,17,18,19,20,21]]):assert v.tables[str(j)]==[[row[c] for c in cols] for row in after['rows']]
assert len(v.results)==len(calc)==1110
for i,(s,x) in enumerate(zip(v.results,calc)):
 m=re.match(r'[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?',s,re.I);assert m
 assert math.isclose(float(m[0]),x,rel_tol=1e-8,abs_tol=5.1e-7),(i,m[0],x)
print('PASS:37 actual GUI trials,23-column records,1110 independently computed results,3 print tables,HTML escaping/company-only output andexact reload persistence')
