"""Independent CL-0091 exported-input arithmetic check;no app solver imported.
Core physics is separately checked against a coupled RK4 temperature/path-heat ODE.
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
  if tag=='script' and attrs.get('id')=='insulation-cooling-record-inputs':self.in_json=True
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
keys=['waterMassG','thicknessMm','conductivityWMK','outsideHWM2K','vesselCapacityJK','otherConductanceWK','initialC','timeSeconds']
def solve(q,wrapped):
 m=q['waterMassG']/1000;V=m/1000;H=V/(math.pi*.035**2);cw=m*4180;cv=q['vesselCapacityJK'];C=cw+cv;k=q['conductivityWMK'];h=q['outsideHWM2K'];go=q['otherConductanceWK'];t=q['timeSeconds'];th0=q['initialC']-25;d=q['thicknessMm']/1000 if wrapped else 0;ro=.036+d;A=2*math.pi*ro*H;Rj=math.log1p(d/.036)/(2*math.pi*k*H);Rc=1/(h*A);Rs=Rj+Rc;gs=1/Rs;g=gs+go;rate=g/C;tau=C/g;half=math.log(2)/rate;th=th0*math.exp(-rate*t);fall=th0*(-math.expm1(-rate*t));T=25+th;ps=gs*th;po=go*th;P=g*th;Q=C*fall;Qs=Q*gs/g;Qo=Q*go/g;Qw=cw*fall;Qv=cv*fall;Ew=cw*th;Ev=cv*th;E=C*th;E0=C*th0;jdrop=th*Rj/Rs;odrop=th*Rc/Rs;surface=25+odrop;cool=0 if th==0 else -rate*th;mean=None if t==0 else -fall/t;crit=k/h;ct=max(0,(crit-.036)*1000);der=(1/(k*ro)-1/(h*ro*ro))/(2*math.pi*H);name='Reference jacket' if wrapped else 'Bare vessel'
 thermal=[name,T,surface,th,fall,cool,'No elapsed interval' if mean is None else mean,tau,half,ps,po,P]
 energy=[name,Ew,Ev,E,Q,Qs,Qo,Qw,Qv,Q,E0,0,0,0]
 results=[[m],[V],[H],[cw],[C],[d],[ro],[A],[Rj],[Rc],[Rs],[gs],[g],[rate],[tau],[half],[th0],[rate*t],[th],[T],[fall],[ps],[po],[P],[Q],[Qs],[Qo],[Qw],[Qv],[Ew],[Ev],[E],[E0],[0],[0],[0],[surface],[0],[cool],[] if mean is None else [mean],[crit],[ct],[der]]
 subs=[[q['waterMassG'],1000],[m,1000],[V,.035],[m,4180],[cw,cv],[d*1000,1000],[.036,d],[2,ro,H],[1,d,.036,2,k,H],[1,h,A],[Rj,Rc],[1,Rs],[gs,go],[g,C],[C,g],[2,rate],[q['initialC'],25],[rate,t],[th0,rate,t],[25,th],[th0,1,rate,t],[gs,th],[go,th],[g,th],[C,fall],[Q,gs,g],[Q,go,g],[cw,fall],[cv,fall],[cw,th],[cv,th],[C,th],[C,th0],[E,Q,E0],[Qs,Qo,Q],[Qw,Qv,Q],[25,th,Rc,Rs],[jdrop,odrop,th],[rate,th],[] if mean is None else [fall,t],[k,h],[0,crit,.036,1000],[1,k,ro,1,h,ro,2,H]]
 return dict(thermal=thermal,energy=energy,results=results,subs=subs,g=g,rate=rate,th=th,P=P,Q=Q,C=C,th0=th0)
def comparison(q,a,b):
 t=q['timeSeconds'];tol=8*sys.float_info.epsilon*max(a['g'],b['g']);diff=a['g']-b['g'];gap=0 if a['th0']==0 or t==0 else a['th']*math.expm1((a['rate']-b['rate'])*t);heat=a['C']*gap
 effect='Equal starting and room temperatures' if a['th0']==0 else 'Zero jacket thickness: identical references' if q['thicknessMm']==0 else 'Same reference cooling rate within numerical precision' if abs(diff)<=tol else 'Jacketed reference cools more slowly' if b['g']<a['g'] else 'Jacketed reference cools faster'
 initial=None if a['th0']==0 else 100*diff/a['g'];current=None if a['P']==0 else 100*(a['P']-b['P'])/a['P'];cumulative=None if a['Q']==0 else 100*heat/a['Q'];percent=lambda v:'Not defined' if v is None else v
 row=[effect,gap,heat,percent(initial),percent(current),percent(cumulative),0]
 results=[[gap],[heat],[] if initial is None else [initial],[] if current is None else [current],[] if cumulative is None else [cumulative],[0]]
 subs=[[a['th'],a['rate'],b['rate'],t],[a['C'],gap],[] if initial is None else [100,a['g'],b['g'],a['g']],[] if current is None else [100,a['P'],b['P'],a['P']],[] if cumulative is None else [100,heat,a['Q']],[heat,a['Q'],b['Q']]]
 return row,results,subs
def numbers(s):return [float(v)for v in re.findall(r'(?<![A-Za-z])[-+]?(?:[0-9]+\.?[0-9]*|\.[0-9]+)(?:e[-+]?[0-9]+)?',s)]
def main(path):
 d=Document();d.feed(open(path).read());trials=json.loads(d.json_text)['trials'];assert trials;assert len(d.tables)==4;assert len(d.tables[0])==len(d.tables[3])==len(trials)+1;assert len(d.tables[1])==len(d.tables[2])==2*len(trials)+1;assert len(d.worked)==92*len(trials);checks=0
 def compare(a,e,context):
  nonlocal checks
  if isinstance(e,str):assert a==e,(context,a,e)
  else:assert math.isclose(float(a),float(e),rel_tol=3e-8,abs_tol=3e-7),(context,a,e)
  checks+=1
 def check_work(index,results,subs):
  for j,(expected,operands) in enumerate(zip(results,subs)):
   sub,result=d.worked[index+j]
   for kind,text,values in [('result',result,expected),('operand',sub,operands)]:
    actual=numbers(text);assert len(actual)==len(values),(index,j,kind,actual,values)
    for a,e in zip(actual,values):compare(a,e,(index,j,kind))
 for i,q in enumerate(trials):
  prep=[i+1,*[q[k]for k in keys],25,q['note']]
  for a,e in zip(d.tables[0][i+1],prep):compare(a,e,(i,'preparation'))
  cases=[solve(q,False),solve(q,True)]
  for ci,c in enumerate(cases):
   for ti,row in[(1,[i+1,*c['thermal']]),(2,[i+1,*c['energy']])]:
    actual=d.tables[ti][i*2+ci+1];assert len(actual)==len(row)
    for a,e in zip(actual,row):compare(a,e,(i,ci,ti))
   check_work(i*92+ci*43,c['results'],c['subs'])
  row,results,subs=comparison(q,*cases);actual=d.tables[3][i+1];assert len(actual)==len(row)+1
  for a,e in zip(actual,[i+1,*row]):compare(a,e,(i,'comparison'))
  check_work(i*92+86,results,subs)
 print(f'PASS:{len(trials)}trials,{checks}independent table/numeric-operand/result checks,{len(d.worked)}workedblocks.')
if __name__=='__main__':main(sys.argv[1])
