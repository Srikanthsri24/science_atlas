from pathlib import Path
import json,math,re,html
p=Path(__file__).parent;rows=json.loads((p/'actual-ui-rows.json').read_text());text=(p/'actual-ui-report.html').read_text();checks=0
for i,row in enumerate(rows):
 assert len(row)==25
 t,V0,c0,add,prepPath,path,P0=map(float,row[2:9]);ref=row[1]=='Unchanged reference';f=min(t/80,1);vt=add*f;va=0 if ref else vt;V=V0+va;ns=c0*V0/1000;cc=ns*1000/V;cm=cc*1e-6;A=20000*cm*path;T=10**(-A);P=P0*T;ab=P0-P;area=4*path;h=V/area;vr=8-vt;Sr=64*math.sin(2*math.pi/128)*.6**2
 assert path==(1 if ref else prepPath)
 expected=[vt,va,V,ns,cc,cm,A,100*T,P,ab,area,h,vr,2*V0+8,2*V0+8]
 for j,v in enumerate(expected,9):assert abs(float(row[j])-v)<6e-7+abs(v)*2e-10,(i,j,row[j],v);checks+=1
 results=[html.unescape(re.sub('<[^>]+>','',v)) for v in re.findall(r'<p>Result: (.*?)</p>',re.search(r'<h3>Trial '+str(i+1)+r':.*?</h3><ol>(.*?)</ol>',text,re.S).group(1),re.S)]
 vals=[f,vt,va,V,ns,cc,cm,path,A,T,100*T,P,ab,P0-P-ab,area,h,12-h,area*12,vr,Sr,vr/Sr,15+vr/Sr,2*V0+8,2*V0+8,cc*V/1000-ns,0 if ref or t==0 or t>=80 else add/80]
 assert len(results)==26
 for a,b in zip(results,vals):assert abs(float(a.split()[0])-b)<6e-7+abs(b)*2e-10,(i,a,b);checks+=1
assert text.count('<table>')==3
assert '&lt;angle&gt; &amp; reasoning.' in text
assert not re.search('https?://',text)
result=dict(status='passed',guiRows=len(rows),columns=25,workedResults=len(rows)*26,independentNumericChecks=checks,printTables=3)
(p/'independent-ui-record-validation.json').write_text(json.dumps(result,indent=2)+'\n');print(result)
