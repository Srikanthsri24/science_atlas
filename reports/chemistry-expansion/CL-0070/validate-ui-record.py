from pathlib import Path
import json,re,html
from validation_model import state
p=Path(__file__).parent;rows=json.loads((p/'actual-ui-rows.json').read_text());text=(p/'actual-ui-report.html').read_text();checks=0

def close(a,b):
 tol=6e-7 if abs(b)>=1 else abs(b)*6e-9+1e-18
 assert abs(float(a)-b)<tol,(a,b,tol)
for i,row in enumerate(rows):
 assert len(row)==28
 t,water,mass,r,prepared,N,mu=map(float,row[2:9]);sample='primary' if row[1]=='Unflocculated primary particles' else 'flocculated';s=state(t,water,mass,r,prepared,mu,sample);assert N==s['N']
 vals=[s[k] for k in ['Rf','phi','rho','vrel','v','Re','end','f','b','z','vclear','mb','mc','wb','wc','wt']]+[s['mb']+s['mc']]
 vals[0]*=1e6
 for j,v in enumerate(vals,9):close(row[j],v);checks+=1
 if s['conc'] is None:assert row[26]=='Not applicable: no suspended cloud remains'
 else:close(row[26],s['conc']);checks+=1
 results=[html.unescape(re.sub('<[^>]+>','',v)) for v in re.findall(r'<p>Result: (.*?)</p>',re.search(r'<h3>Trial '+str(i+1)+r':.*?</h3><ol>(.*?)</ol>',text,re.S).group(1),re.S)]
 expected=[s[k] for k in ['rM','N','Rf','Vp','Vf','phi','rho','eta','dry','count','Vs','V0','p0','po','vrel','v','up','Re','H','beta','Bmax','end','f','b','z','hc','hclear','mb','mc','vsb','vsc','vb','vc','vclear','wb','wc','wt','conc','F','drag','Mb','Mc','Mclear','M0']]+[s['Mb']+s['Mc']+s['Mclear'],s['mb']+s['mc'],s['tau']]
 assert len(results)==len(expected)==47
 for a,b in zip(results,expected):
  if b is None:assert a=='Not applicable: no suspended cloud remains'
  else:close(a.split()[0],b);checks+=1
assert text.count('<table>')==3
assert '&lt;angle&gt; &amp; reasoning.' in text
assert not re.search('https?://',text)
r=dict(status='passed',guiRows=len(rows),columns=28,workedResults=len(rows)*47,independentNumericChecks=checks,printTables=3);(p/'independent-ui-record-validation.json').write_text(json.dumps(r,indent=2)+'\n');print(r)
