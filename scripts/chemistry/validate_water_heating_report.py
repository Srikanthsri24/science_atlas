"""Independent CL-0088 exported practical check; no app solver imported.
Event ties within1ns are treated as the same analytic event across JS/Python.
"""
import json,math,re,sys
from html.parser import HTMLParser
class Document(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.paragraph=None;self.sub=None;self.worked=[];self.in_json=False;self.json_text=''
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag in ('td','th'):self.cell=''
  if tag=='p':self.paragraph=''
  if tag=='script' and attrs.get('id')=='water-heating-record-inputs':self.in_json=True
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
  if self.paragraph is not None:self.paragraph+=data
  if self.in_json:self.json_text+=data
 def handle_endtag(self,tag):
  if tag in ('td','th') and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.table is not None:self.table.append(self.row)
  if tag=='table':self.table=None
  if tag=='script':self.in_json=False
  if tag=='p' and self.paragraph is not None:
   if self.paragraph.startswith('Substitution:'):self.sub=self.paragraph[13:].strip()
   if self.paragraph.startswith('Result:'):self.worked.append((self.sub,self.paragraph[7:].strip()))
   self.paragraph=None
anchors=[(20,998.16),(40,992.18),(60,983.16),(80,971.77),(100,958.35)]
def solve(q):
 m=q['waterMassG']/1000;P=q['heaterPowerW'];eta=q['coupling'];ua=q['lossWK'];cv=q['vesselCapacityJK'];t=q['timeSeconds'];pin=P*eta;cap=m*4180+cv;margin=pin-ua*80
 tb=None if margin<=0 else cap*80/pin if ua==0 else -cap/ua*math.log1p(-ua*80/pin)
 td=None if tb is None else tb+m*2256400/margin
 if tb is not None and abs(t-tb)<1e-9:tb=t
 if td is not None and abs(t-td)<1e-9:td=t
 active=t if td is None else min(t,td);warm=active if tb is None else min(active,tb);boil=0 if tb is None else max(0,active-tb);dry=td is not None and t>=td
 rise=pin*warm/cap if ua==0 else pin/ua*(-math.expm1(-ua*warm/cap));T=100 if tb is not None and active>=tb else 20+rise
 esc=m if dry else min(m,max(0,boil*margin/2256400));remain=m-esc
 E=P*active;D=pin*active;U=(1-eta)*E;B=P*(t-active);LW=pin*warm-cap*(T-20);LB=ua*80*boil;L=LW+LB;WW=m*4180*(T-20);WV=cv*(T-20);LH=esc*2256400;HS=remain*4180*(T-20);HE=esc*4180*80;rate=margin/2256400*1000 if tb is not None and active>=tb and not dry else 0;slope=0 if tb is not None and active>=tb else (pin-ua*(T-20))/cap
 for i in range(1,len(anchors)):
  if T<=anchors[i][0]+1e-10:lo,rlo=anchors[i-1];hi,rhi=anchors[i];break
 rho=rlo+(rhi-rlo)*(T-lo)/(hi-lo);V=remain*1000/rho*1000;level=V/(math.pi*16);x=ua*warm/cap;phi=1 if x==0 else -math.expm1(-x)/x;psi=1-phi
 phase='Experiment stopped at dryout' if dry else 'Boiling liquid with escaping vapour' if tb is not None and active>=tb else 'Warming toward a heat-loss limit' if tb is None else 'Liquid warming before boiling'
 thermal=[active,'No liquid remains' if dry else T,T,remain*1000,esc*1000,m*1000,slope,rate,'No finite onset' if tb is None else tb,'No finite dryout' if td is None else td]
 energy=[E,D,U,B,L,WW,WV,LH,HS,HE,0,0,0]
 results=[[m],[pin],[cap],[ua*80,margin],[] if tb is None else [tb],[active],[T],[esc,esc*1000],[m*1000,q['waterMassG']],[E],[U],[D],[B],[LW],[LB],[L],[WW],[WV],[LH],[HS],[HE],[0],[0],[0],[rate],[slope],[rho],[V],[level],[] if td is None else [td]]
 subs=[[q['waterMassG'],1000],[eta,P],[m,4180,cv],[ua,80,pin,ua*80],[pin,ua*80] if tb is None else [cap,80,pin] if ua==0 else [cap,ua,1,ua,80,pin],[t] if td is None else [t,td],[ua,warm,cap,x,phi,20,pin,warm,phi,cap],[0] if tb is None else [m,boil,margin,2256400],[remain*1000,esc*1000],[P,active],[1,eta,E],[pin,active],[P,t,active],[pin,warm,psi],[ua,80,boil],[LW,LB],[m,4180,T,20],[cv,T,20],[esc*1000,1000,2256400],[remain*1000,1000,4180,T,20],[esc*1000,1000,4180,80],[D,L,WW,WV,LH],[D,L,HS,HE,WV,LH],[E,D,U],[margin,2256400,1000] if rate>0 else [0],[0] if rate>0 or dry else [pin,ua,T,20,cap],[rlo,rhi,rlo,T,lo,hi,lo],[remain*1000,rho,1000],[V,4],[] if td is None else [tb,m,2256400,margin]]
 return phase,thermal,energy,results,subs
# The superscript2 in the level substitution denotes a power,not an operand.
def numbers(s):return [float(v) for v in re.findall(r'(?<![A-Za-z])[-+]?(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:e[-+]?[0-9]+)?',s)]
def main(path):
 d=Document();d.feed(open(path).read());r=json.loads(d.json_text);trials=r['trials'];assert trials;assert len(d.tables)==3;assert all(len(t)==len(trials)+1 for t in d.tables);assert len(d.worked)==len(trials)*30;checks=0
 def compare(actual,expected,context):
  nonlocal checks
  if isinstance(expected,str):assert actual==expected,(context,actual,expected)
  else:assert math.isclose(float(actual),expected,rel_tol=3e-8,abs_tol=3e-7),(context,actual,expected)
  checks+=1
 for i,q in enumerate(trials):
  phase,thermal,energy,results,subs=solve(q)
  prep=[i+1,*[q[k] for k in ['waterMassG','heaterPowerW','coupling','lossWK','vesselCapacityJK','timeSeconds']],phase,q['note']]
  for ti,values in enumerate([prep,[i+1,*thermal],[i+1,*energy]]):
   actual=d.tables[ti][i+1];assert len(actual)==len(values)
   for a,e in zip(actual,values):compare(a,e,(i,ti))
  for k,(result,sub) in enumerate(zip(results,subs)):
   a_sub,a_result=d.worked[i*30+k]
   for label,text,expected in [('result',a_result,result),('substitution',a_sub,sub)]:
    values=numbers(text);assert len(values)==len(expected),(i,k,label,values,expected)
    for a,e in zip(values,expected):compare(a,e,(i,k,label))
 print(f'PASS:{len(trials)} trials,{checks} independent table/worked-number checks,{len(d.worked)} worked blocks.')
if __name__=='__main__':main(sys.argv[1])
