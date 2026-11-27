"""Independent CL-0089 export validation; no app solver imported."""
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
  if tag=='script' and attrs.get('id')=='water-cooling-record-inputs':self.in_json=True
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
def solve(q):
 m=q['waterMassG']/1000; cv=q['vesselCapacityJK']; cb=q['storeCapacityJK']; tb0=q['storeInitialC']; k=q['conductanceWK']; t=q['timeSeconds']; cs=m*4180+cv; ci=m*2100+cv; latent=m*333400; warm=cs*20; reserve=-cb*tb0-warm; E=latent-reserve; rate=k*(1/cs+1/cb); irate=k*(1/ci+1/cb)
 outcome='No thermal contact' if k==0 else 'No finite freezing onset' if reserve<=0 else 'Partial freezing limit' if E>0 else 'Complete freezing only in the infinite-time limit' if E==0 else 'Finite complete freezing'
 onset=None if k==0 or reserve<=0 else math.log(cb*(20-tb0)/reserve)/rate
 plateau=None if k==0 or E>=0 else cb/k*math.log(reserve/(-E)); complete=None if plateau is None else onset+plateau
 if onset is not None and abs(t-onset)<1e-9:onset=t
 if complete is not None and abs(t-complete)<1e-9:complete=t
 if k==0:ts=20;tb=tb0;ice=0;gap=20-tb0;Q=0;phase='Contact disconnected'
 elif onset is None or t<onset:
  Q=cs*cb/(cs+cb)*(20-tb0)*(-math.expm1(-rate*t));ts=max(0,20-Q/cs);tb=tb0+Q/cb;ice=0;gap=(20-tb0)*math.exp(-rate*t);phase='Liquid cooling'
 elif complete is None or t<complete:
  tb=-reserve/cb*math.exp(-k/cb*(t-onset));ts=0;ice=min(1,max(0,reserve*(-math.expm1(-k/cb*(t-onset)))/latent));gap=-tb;Q=warm+ice*latent;phase='Freezing plateau'
 else:
  extra=ci*cb/(ci+cb)*(-E/cb)*(-math.expm1(-irate*(t-complete)));ts=-extra/ci;tb=E/cb+extra/cb;ice=1;gap=-E/cb*math.exp(-irate*(t-complete));Q=warm+latent+extra;phase='Ice cooling'
 ig=ice*q['waterMassG'];lg=(1-ice)*q['waterMassG'];ws=m*(2100 if phase=='Ice cooling' else 4180)*ts;wl=lg/1000*333400;hw=ws+wl;hv=cv*ts;hb=cb*tb;sens=m*4180*20-ws;lat=ice*latent;vrel=cv*(20-ts);rel=sens+lat+vrel;gain=cb*(tb-tb0);power=k*gap
 limT=20 if k==0 else -reserve/(cs+cb) if reserve<=0 else E/(ci+cb) if E<0 else 0;limB=tb0 if k==0 else limT;limF=0 if k==0 or reserve<=0 else min(1,reserve/latent);growth=power/333400*1000 if phase=='Freezing plateau' else 0;slope=-power/cs if phase=='Liquid cooling' else -power/ci if phase=='Ice cooling' else 0
 thermal=[phase,ts,tb,lg,ig,lg+ig,power,growth,'No finite onset' if onset is None else onset,'No finite completion' if complete is None else complete,limT,limB,limF]
 energy=[hw,hv,hb,hw+hv+hb,E,sens,lat,vrel,rel,gain,Q,0,0,0]
 vl=lg;vi=ig/.917;V=vl+vi
 results=[[m],[cs,ci],[latent],[warm],[-cb*tb0],[reserve],[E],[rate,irate],[] if onset is None else [onset],[] if complete is None else [plateau,complete],[Q],[ts],[tb],[ice],[ig,lg,ig+lg],[power],[hw],[hv,hb],[sens],[lat],[vrel],[rel],[gain],[0],[0,0],[limT,limB],[limF],[growth],[slope,power/cb],[vl,vi],[V,V/(math.pi*16)]]
 pre=cs*cb/(cs+cb);post=ci*cb/(ci+cb)
 exchange=[0] if k==0 else [pre,20,tb0,1,rate,t] if phase=='Liquid cooling' else [warm,reserve,1,k,t,onset,cb] if phase=='Freezing plateau' else [warm,latent,post,E/cb,1,irate,t,complete]
 temp=[Q,warm,latent,ci] if phase=='Ice cooling' else [0] if phase=='Freezing plateau' else [20,Q,cs]
 iceSub=[reserve,1,k,t,onset,cb,latent] if phase=='Freezing plateau' else []
 limSub=[20,tb0] if k==0 else [-reserve,cs,cb] if reserve<=0 else [E,ci,cb] if E<0 else [0]
 subs=[[q['waterMassG'],1000],[m,4180,cv,m,2100,cv],[m,333400],[cs,20],[cb,0,tb0],[-cb*tb0,warm],[latent,cs,20,cb,tb0],[k,1,cs,1,cb,k,1,ci,1,cb],[] if onset is None else [cb,20,tb0,reserve,rate],[] if complete is None else [cb,k,reserve,reserve,latent,onset,plateau],exchange,temp,[tb0,Q,cb],iceSub,[ice,q['waterMassG'],1,ice,q['waterMassG'],ig,lg],[k,gap],[m,2100 if phase=='Ice cooling' else 4180,ts,lg,1000,333400],[cv,ts,cb,tb],[m,4180,20,ws],[ig,1000,333400],[cv,20,ts],[sens,lat,vrel],[cb,tb,tb0],[hw,hv,hb,E],[rel,gain,Q,gain],limSub,[] if k==0 else [reserve,latent,0,1],[power,333400,1000] if phase=='Freezing plateau' else [],[power,cs,power,cb] if phase=='Liquid cooling' else [power,ci,power,cb] if phase=='Ice cooling' else [0,power,cb],[lg,1,ig,.917],[vl,vi,V,4]]
 return outcome,thermal,energy,results,subs
def numbers(s):
 return [float(v) for v in re.findall(r'(?<![A-Za-z])[-+]?(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:e[-+]?[0-9]+)?',s)]
def main(path):
 d=Document();d.feed(open(path).read());trials=json.loads(d.json_text)['trials'];assert trials;assert len(d.tables)==3;assert all(len(t)==len(trials)+1 for t in d.tables);assert len(d.worked)==31*len(trials);checks=0
 def compare(a,e,context):
  nonlocal checks
  if isinstance(e,str):assert a==e,(context,a,e)
  else:assert math.isclose(float(a),e,rel_tol=3e-8,abs_tol=3e-7),(context,a,e)
  checks+=1
 for i,q in enumerate(trials):
  outcome,thermal,energy,results,subs=solve(q);prep=[i+1,*[q[k] for k in ['waterMassG','vesselCapacityJK','storeCapacityJK','storeInitialC','conductanceWK','timeSeconds']],outcome,q['note']]
  for ti,values in enumerate([prep,[i+1,*thermal],[i+1,*energy]]):
   row=d.tables[ti][i+1];assert len(row)==len(values)
   for a,e in zip(row,values):compare(a,e,(i,ti))
  for j,expected in enumerate(results):
   sub,result=d.worked[i*31+j];assert sub and not any(v in sub for v in ['NaN','undefined','Infinity']);actual=numbers(result);assert len(actual)==len(expected),(i,j,actual,expected)
   for a,e in zip(actual,expected):compare(a,e,(i,j,'result'))
   operands=numbers(sub);assert len(operands)==len(subs[j]),(i,j,'operands',operands,subs[j])
   for a,e in zip(operands,subs[j]):compare(a,e,(i,j,'operand'))
 print(f'PASS:{len(trials)}trials,{checks} independent table/worked-result/operand checks,{len(d.worked)}blocks.')
if __name__=='__main__':main(sys.argv[1])
