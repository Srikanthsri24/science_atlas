import json,math,re,html
from pathlib import Path
p=Path(__file__).parent
rows=json.loads((p/'actual-ui-rows.json').read_text()); text=(p/'actual-ui-report.html').read_text()
u=64*math.sin(2*math.pi/128); R=8.314462618;k=.0981
checks=0
for i,row in enumerate(rows):
 assert len(row)==28
 t,r,H,Rb,dm,P,T=map(float,row[2:9]);T+=273.15; A=u*r*r;Ao=u*(r+.15)**2;B=u*Rb*Rb;V0=A*H;n0=P*V0/1000/(R*T); trapped=row[1]=='Trapped-air cup'
 d=dm*t/50 if t<50 else dm if t<90 else dm*(140-t)/50 if t<140 else 0
 def equilibrium(d):
  def interior(S):
   D=d+S
   if not trapped:return min(D,H)
   lo,hi=0,H*(1-1e-14)
   for _ in range(70):
    x=(lo+hi)/2;f=P*H/(H-x)-P-k*(D-x)
    if f>0:hi=x
    else:lo=x
   return (lo+hi)/2
  lo,hi=0,Ao*(H+.15)/B
  for _ in range(75):
   S=(lo+hi)/2;x=interior(S);res=B*S-Ao*min(d+S,H+.15)+A*x
   if res>0:hi=S
   else:lo=S
  S=0 if d==0 else (lo+hi)/2;x=0 if d==0 else interior(S)
  v=A*(H-x);n=n0 if trapped else P*v/1000/(R*T)
  return S,x,v,n
 S,x,v,n=equilibrium(d);D=d+S;peak=d if t<50 else dm;_,xp,vp,np=equilibrium(peak);nout=0 if trapped else n0-np;nin=0 if trapped else n-np;water=A*x;pg=P*H/(H-x) if trapped else P if v>1e-8 else None
 expected=[d,S,D,x,water,V0,v,pg,n0,n,nout,nin,P+k*D,B*35-water,B*35,B*35]
 for j,vv in enumerate(expected,9):
  if vv is None:assert row[j]=='Not applicable: no retained cup gas pocket'
  else:assert abs(float(row[j])-vv)<6e-7+abs(vv)*2e-10,(i,j,row[j],vv)
  checks+=1
 assert row[25]==('Contact' if x>=H-.5 else 'No contact')
 assert row[26]==('Contact recorded' if xp>=H-.5 else 'Not reached')
 C=P+k*(D+H);L=math.sqrt(P*P+2*P*k*(D+H)+k*k*(D-H)**2);vw=(Ao-A)*min(D,H);vc=Ao*max(0,min(D-H,.15));vg=A*max(0,min(D-x,H-x))
 vals=[A,r+.15,Ao,B,V0,T,n0,k,B*35,d,Ao*(H+.15)/B,S,D]+([C,L,x] if trapped else [x])+[water,H-x,v,pg,None if pg is None else P+k*(D-x),P+k*D,vw,vc,vg,vw+vc+vg,B*S,B*35-water,B*35,n,peak,np,nout,nin,n0+nin-nout-n,n*.02897*1000,None if pg is None else pg*v/1000,n*R*T,H-.5]
 block=re.search(r'<h3>Trial '+str(i+1)+r':.*?</h3><ol>(.*?)</ol>',text,re.S).group(1)
 results=[html.unescape(re.sub('<[^>]+>','',v)) for v in re.findall(r'<p>Result: (.*?)</p>',block,re.S)]
 assert len(results)==len(vals)+2,(len(results),len(vals))
 for a,b in zip(results,vals):
  if b is None:assert 'Not applicable' in a
  else:assert abs(float(a.split()[0])-b)<6e-7+abs(b)*2e-10,(i,a,b)
  checks+=1
assert text.count('<table>')==3
assert '&lt;angle&gt; &amp; reasoning.' in text
assert not re.search(r'https?://',text)
result={'status':'passed','guiRows':len(rows),'columns':28,'independentNumericChecks':checks,'workedResults':sum(len(re.findall(r'<p>Result:',v)) for v in re.findall(r'<h3>Trial .*?</ol>',text,re.S)),'printTables':3}
(p/'independent-ui-record-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(result)
