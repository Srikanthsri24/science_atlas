"""Independent CL-0090 notebook check using NumPy symmetric eigendecomposition.
No app solver or analytic sine eigenbasis imported. Requires numpy.
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
  if tag=='script' and attrs.get('id')=='heat-conductors-record-inputs':self.in_json=True
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
import numpy as np
N=48
A=np.diag(np.full(N,-2.0))+np.diag(np.ones(N-1),1)+np.diag(np.ones(N-1),-1);A[0,0]=A[-1,-1]=-3
mu,VEC=np.linalg.eigh(A)
materials=[('Copper',400,8960,385),('Aluminium',235,2700,900),('Stainless steel 304',15,8000,477)]
def solve(q,material):
 name,k,rho,cp=material;L=q['lengthCm']/100;d=q['diameterMm']/1000;Th=q['hotC'];dt=Th-25;t=q['timeSeconds'];area=math.pi*d*d/4;dx=L/N;mass=rho*area*L;C=mass*cp;cellC=C/N;alpha=k/(rho*cp);G=k*area/dx;lam=-mu*alpha/(dx*dx);forcing=np.zeros(N);forcing[0]=2*alpha*dt/(dx*dx);beta=VEC.T@forcing;step=-np.expm1(-lam*t)/lam;z=lam*t
 integral=np.empty(N);small=z<1e-3;integral[small]=t*t/2*(1-z[small]/3+z[small]**2/12-z[small]**3/60+z[small]**4/360);integral[~small]=(t-step[~small])/lam[~small]
 raw=VEC@(beta*step);theta=np.clip(raw,0,dt);T=theta+25;rates=VEC@(beta*np.exp(-lam*t));integrated=VEC@(beta*integral);qh=max(0,2*G*(dt*t-integrated[0]));qc=max(0,2*G*integrated[-1]);stored=cellC*float(np.sum(theta));mean=25+stored/C;ph=2*G*(dt-theta[0]);pc=2*G*theta[-1];pm=G*(theta[23]-theta[24]);steady=k*area*dt/L;resistance=L/(k*area);tau=1/min(lam);Fo=alpha*t/(L*L);quarter=float((T[11]+T[12])/2);mid=float((T[23]+T[24])/2);third=float((T[35]+T[36])/2);sumT=float(np.sum(T));sumRate=float(np.sum(rates));rateE=cellC*sumRate
 thermal=[name,k,rho,cp,alpha,quarter,mid,third,mean,ph,pc,steady,resistance,Fo,tau,N]
 energy=[name,mass,C,qh,qc,stored,0,C*dt/2,0,0]
 probes=[[quarter,q['lengthCm']*.25],[mid,q['lengthCm']*.5],[third,q['lengthCm']*.75]]
 results=[[L],[d],[area],[area*L],[mass],[C],[dx],[cellC],[alpha],[resistance],[dt],[steady],[(Th+25)/2],[C*dt/2],*probes,[mean],[ph],[pc],[pm],[stored],[qh-qc],[0],[ph-pc],[rateE],[0],[Fo],[L*L/alpha],[tau],[(T[-1]-T[0])/((N-1)*dx)],[mid-25]]
 probeSubs=[[1,.5,T[i],.5,T[i+1]]for i in[11,23,35]]
 subs=[[q['lengthCm'],100],[q['diameterMm'],1000],[d,4],[area,L],[rho,area*L],[mass,cp],[L,N],[C,N],[k,rho,cp],[L,k,area],[Th,25],[k,area,dt,L],[Th,25,2],[C,Th,25,2],*probeSubs,[sumT,N],[2,k,area,Th,T[0],dx],[2,k,area,T[-1],25,dx],[k,area,T[23],T[24],dx],[C,stored/C],[qh,qc],[qh,qc,stored],[ph,pc],[cellC,sumRate],[ph,pc,rateE],[alpha,t,L],[L,alpha],[1,4,alpha,dx,2,N],[T[-1],T[0],N,1,dx],[mid,25]]
 return thermal,energy,results,subs
def numbers(s):return [float(v)for v in re.findall(r'(?<![A-Za-z])[-+]?(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:e[-+]?[0-9]+)?',s)]
def main(path):
 doc=Document();doc.feed(open(path).read());trials=json.loads(doc.json_text)['trials'];assert trials;assert len(doc.tables)==3;assert len(doc.tables[0])==len(trials)+1;assert len(doc.tables[1])==len(doc.tables[2])==3*len(trials)+1;assert len(doc.worked)==96*len(trials);checks=0
 def compare(a,e,context):
  nonlocal checks
  if isinstance(e,str):assert a==e,(context,a,e)
  else:assert math.isclose(float(a),float(e),rel_tol=3e-8,abs_tol=3e-7),(context,a,e)
  checks+=1
 for i,q in enumerate(trials):
  prep=[i+1,q['lengthCm'],q['diameterMm'],q['hotC'],25,q['timeSeconds'],q['note']];assert len(doc.tables[0][i+1])==len(prep)
  for a,e in zip(doc.tables[0][i+1],prep):compare(a,e,(i,'preparation'))
  for mi,material in enumerate(materials):
   thermal,energy,results,subs=solve(q,material)
   for ti,row in[(1,[i+1,*thermal]),(2,[i+1,*energy])]:
    actual=doc.tables[ti][i*3+mi+1];assert len(actual)==len(row)
    for a,e in zip(actual,row):compare(a,e,(i,mi,ti))
   for j,expected in enumerate(results):
    sub,result=doc.worked[i*96+mi*32+j]
    for kind,txt,values in [('result',result,expected),('operand',sub,subs[j])]:
     actual=numbers(txt);assert len(actual)==len(values),(i,mi,j,kind,actual,values)
     for a,e in zip(actual,values):compare(a,e,(i,mi,j,kind))
 print(f'PASS:{len(trials)}trials,{checks}independent table/numeric-operand/result checks,{len(doc.worked)}workedblocks. NumPy matrix solver;no app solver imported.')
if __name__=='__main__':main(sys.argv[1])
