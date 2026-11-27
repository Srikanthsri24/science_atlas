"""Independent CL-0094 export arithmetic;free ions solved by log-space charge-balance bisection."""
import json,math,re,sys
from html.parser import HTMLParser
class Document(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.part=None;self.p=None;self.sub=None;self.worked=[];self.in_json=False;self.json_text=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag in('td','th'):self.cell=''
  if tag=='p':self.part=a.get('class');self.p=''
  if tag=='script' and a.get('id')=='turmeric-tests-record-inputs':self.in_json=True
 def handle_data(self,s):
  if self.cell is not None:self.cell+=s
  if self.p is not None:self.p+=s
  if self.in_json:self.json_text+=s
 def handle_endtag(self,tag):
  if tag in('td','th'):self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.table is not None:self.table.append(self.row)
  if tag=='table':self.table=None
  if tag=='script':self.in_json=False
  if tag=='p':
   if self.part=='substitution':self.sub=self.p
   if self.part=='result':self.worked.append((self.sub,self.p))
   self.p=None;self.part=None
eps=sys.float_info.epsilon
keys=['waterFilmUl','baseMilliM','baseAliquotUl','acidMilliM','acidAliquotUl','baseFraction','acidFraction']
names=['Water reference','Acid-dose reference','Base-dose reference','Reversal investigation']
def solve(q,B,A):
 CB=q['baseMilliM']/1000;CA=q['acidMilliM']/1000;Vu=q['waterFilmUl']+B+A;V=Vu*1e-6;nB=CB*(B*1e-6);nA=CA*(A*1e-6);xi=min(nA,nB);ea=nA-xi;eb=nB-xi;delta=nA-nB;C=delta/V;tol=8*eps*max(nA,nB);tie=abs(delta)<=tol;lo=0.;hi=14.
 for _ in range(120):
  mid=(lo+hi)/2;H=10**(-mid)
  if H-1e-14/H-C>0:lo=mid
  else:hi=mid
 pH=(lo+hi)/2;H=10**(-pH);OH=1e-14/H;pOH=-math.log10(OH);major=max(H,OH);minor=min(H,OH);root=major+minor;Na=nB/V;Cl=nA/V;cl='equivalent-within-numerical-precision' if tie else 'acidic' if delta>0 else 'basic';end='yellow' if tie or delta>0 else 'rust-red' if pH>=9 else 'unresolved'
 obs=[q['waterFilmUl'],B,A,Vu,nB,nA,xi,ea,eb,pH,end,cl];eq=[H,OH,Na,Cl,C,pOH,0,0,0,0,0,0,0]
 results=[CB,CA,B*1e-6,A*1e-6,Vu,V,nB,nA,xi,ea,eb,delta,C,abs(C),root,major,minor,H,OH,pH,pOH,Na,Cl,0,0,0,0,0,0,0,tol]
 subs=[[q['baseMilliM'],1000],[q['acidMilliM'],1000],[B,1e-6],[A,1e-6],[q['waterFilmUl'],B,A],[Vu,1e-6],[CB,B*1e-6],[CA,A*1e-6],[nA,nB],[nA,xi],[nB,xi],[nA,nB],[delta,V],[C],[abs(C),4,1e-14],[abs(C),root,2],[1e-14,major],[H],[OH],[H,1],[OH,1],[nB,V],[nA,V],[Vu,q['waterFilmUl'],B,A],[nA,xi,ea],[nB,xi,eb],[H,OH,C],[Cl,Na,C],[H,OH,1e-14],[pH,pOH,14],[8,eps,nA,nB]]
 return dict(obs=obs,eq=eq,results=results,subs=subs,endpoint=end,nB=nB,nA=nA)
def nums(s):return[float(x)for x in re.findall(r'(?<![A-Za-z0-9.])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?',s)]
def main(path):
 d=Document();d.feed(open(path).read());trials=json.loads(d.json_text)['trials'];assert len(d.tables)==4;checks=0;wi=0
 def near(a,b,where,absolute=2e-25):
  nonlocal checks
  assert math.isfinite(a)and math.isfinite(b),where
  assert abs(a-b)<=2e-10*abs(b)+absolute,(where,a,b);checks+=1
 def row(actual,expected,where,tolerances={}):
  assert len(actual)==len(expected),(where,len(actual),len(expected))
  for j,(a,b)in enumerate(zip(actual,expected)):
   if b is None:assert a=='Not defined',(where,j,a)
   elif isinstance(b,str):assert a==b,(where,j,a,b)
   else:near(float(a),b,(where,j),tolerances.get(j,2e-25))
 def work(sub,result,tol=2e-25):
  nonlocal wi
  a,b=d.worked[wi];wi+=1;an=nums(a);assert len(an)==len(sub),(wi,a,sub)
  for x,y in zip(an,sub):near(x,y,('operand',wi))
  if result is None:assert b.startswith('Not defined:'),(wi,b)
  else:
   bn=nums(b);assert len(bn)==1,(wi,b);near(bn[0],result,('result',wi),tol)
 for i,q in enumerate(trials):
  B=q['baseAliquotUl']*q['baseFraction'];A=q['acidAliquotUl']*q['acidFraction'];wells=[solve(q,0,0),solve(q,0,q['acidAliquotUl']),solve(q,q['baseAliquotUl'],0),solve(q,B,A)];required=q['baseMilliM']*q['baseAliquotUl']/q['acidMilliM'];frac=None if q['acidAliquotUl']==0 else required/q['acidAliquotUl'];nb=q['baseMilliM']/1000*(q['baseAliquotUl']*1e-6);na=q['acidMilliM']/1000*(q['acidAliquotUl']*1e-6);enough=na+8*eps*max(na,nb)>=nb;end=wells[3]['endpoint']
  inference='The reference well is sufficiently basic for the chosen rust-red endpoint. The colour does not measure an exact pH.' if end=='rust-red' else 'The remaining basic reference lies in our conservative unresolved region. Do not infer an exact hue or pH.' if end=='unresolved' else 'Yellow is consistent with the chosen acid,water or equivalent references;yellow alone does not distinguish them.'
  outcome='No base dose was selected,so this preparation does not demonstrate a base-to-acid colour reversal.' if q['baseAliquotUl']==0 else 'No acid dose was selected;the guide cannot remove the chosen base excess.' if q['acidAliquotUl']==0 else 'The planned acid dose is insufficient for the full selected base dose. Do not force a yellow final result.' if not enough else 'Follow the staged additions and record the current state separately from the planned final preparation.' if q['baseFraction']<1 or q['acidFraction']<1 else 'Compare the final equivalent quantities and the reference controls. A yellow endpoint is not proof of exact neutralization.'
  row(d.tables[0][i+1],[i+1,*[q[k]for k in keys],q['note']],('prep',i))
  row(d.tables[3][i+1],[i+1,required,frac,'Yes' if enough else 'No',wells[2]['endpoint'],end,inference,outcome],('comparison',i))
  for sub,result in[([q['baseAliquotUl'],q['baseFraction']],B),([q['acidAliquotUl'],q['acidFraction']],A),([q['baseMilliM']/1000,q['baseAliquotUl']*1e-6],nb),([q['acidMilliM']/1000,q['acidAliquotUl']*1e-6],na),([q['baseMilliM'],q['baseAliquotUl'],q['acidMilliM']],required),([]if frac is None else[required,q['acidAliquotUl']],frac)]:work(sub,result)
  for j,w in enumerate(wells):
   row(d.tables[1][1+4*i+j],[i+1,names[j],*w['obs']],('well',i,j))
   row(d.tables[2][1+4*i+j],[i+1,names[j],*w['eq']],('equilibrium',i,j),{8:3e-14,9:3e-12,10:2e-20,11:2e-20,12:2e-16,13:2e-16,14:2e-28})
   for k,(sub,result)in enumerate(zip(w['subs'],w['results'])):work(sub,result,3e-12 if k==23 else 2e-20 if k in(24,25) else 2e-16 if k in(26,27) else 2e-28 if k==28 else 3e-14 if k==29 else 2e-35 if k==30 else 2e-25)
 assert wi==len(d.worked)==130*len(trials)
 assert len(d.tables[0])==len(d.tables[3])==len(trials)+1
 assert len(d.tables[1])==len(d.tables[2])==4*len(trials)+1
 print(f'PASS:{len(trials)}trials,{4*len(trials)}well records,{checks}independent table/numeric-operand/result checks,{wi}workedblocks.')
if __name__=='__main__':main(sys.argv[1])
