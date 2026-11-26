from pathlib import Path
import json,math,re,html
p=Path(__file__).parent;rows=json.loads((p/'actual-ui-rows.json').read_text());text=(p/'actual-ui-report.html').read_text();checks=0;R=.08314462618;M=31.9988

def close(a,b):
 tol=6e-7 if abs(b)>=1 else abs(b)*6e-9+1e-18
 assert abs(float(a)-b)<tol,(a,b,tol)
for i,row in enumerate(rows):
 assert len(row)==29
 t,w,g,initial,target,p0=map(float,row[2:8]);ref=row[1]=='Constant-temperature reference';u=t/100;f=3*u*u-2*u*u*u;temp=initial if ref else initial+(target-initial)*f;T=temp+273.15;T0=initial+273.15;VL=w/1000;GL=g/1000;mw=VL;h0=.0013*math.exp(1500*(1/T0-1/298.15));h=.0013*math.exp(1500*(1/T-1/298.15));nd0=h0*mw*p0;ng0=p0*GL/(R*T0);N=nd0+ng0;D=h*mw;G=GL/(R*T);po=N/(D+G);nd=D*po;ng=G*po;nc=.79*GL/(R*T0);pc=.79*T/T0;pd=po+pc;md=nd*M*1000;mg=ng*M*1000;mt=N*M*1000;net=ng-ng0;trate=0 if ref else (target-initial)*6*u*(1-u)/100;dD=-1500*D/T**2;dG=-G/T;sens=N*(dD*G-D*dG)/(D+G)**2;rate=-sens*trate
 expected=[temp,T,h,nd0,ng0,N,nd,ng,po,pc,pd,md/VL,md,mg,mt,nd/N,net,net*M*1000,rate,trate]
 for j,v in enumerate(expected,8):close(row[j],v);checks+=1
 results=[html.unescape(re.sub('<[^>]+>','',v)) for v in re.findall(r'<p>Result: (.*?)</p>',re.search(r'<h3>Trial '+str(i+1)+r':.*?</h3><ol>(.*?)</ol>',text,re.S).group(1),re.S)]
 vals=[u,f,temp,T,T0,VL,mw,GL,h0,h,nd0,ng0,N,D,G,po,nd,ng,nd+ng-N,nc,pc,pd,md,md/VL,nd0*M*1000/VL,mg,mt,nd/N,ng/N,net,net*M*1000,trate,sens,rate]
 assert len(results)==34
 for a,b in zip(results,vals):close(a.split()[0],b);checks+=1
assert text.count('<table>')==3
assert '&lt;angle&gt; &amp; reasoning.' in text
assert not re.search('https?://',text)
result=dict(status='passed',guiRows=len(rows),columns=29,workedResults=len(rows)*34,independentNumericChecks=checks,printTables=3)
(p/'independent-ui-record-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(result)
