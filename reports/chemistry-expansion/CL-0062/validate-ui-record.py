"""Independent reconstruction of actual GUI observations and downloaded HTML."""
import json,math,re,shutil
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).parent
r=json.loads((root/'actual-ui-record.json').read_text());after=json.loads((root/'record-after-reload.json').read_text());assert r==after
samples=['acid','neutral','base'];cases=[]
for t in [0,2.05,10,30,65]:
 for sample in samples:cases.append(dict(t=t,sample=sample,volume=20,dose=.6,N=12,interval=4,stock=.5,acid=3,base=10))
for control in ['no-dose','pigment-free']:
 for sample in samples:cases.append(dict(t=65,sample=sample,volume=20,dose=0 if control=='no-dose' else .6,N=12,interval=4,stock=0 if control=='pigment-free' else .5,acid=3,base=10))
for t in [57.05,65]:
 for sample in samples:cases.append(dict(t=t,sample=sample,volume=30,dose=1.2,N=12,interval=5,stock=1,acid=6,base=12))
for sample in samples:cases.append(dict(t=12.13,sample=sample,volume=10,dose=.1,N=6,interval=2,stock=1,acid=2,base=8))
assert len(r['rows'])==len(cases)==30
flight=math.sqrt(.16/9.81);expected_work=[]
def close(actual,expected):
 a=float(actual);tol=abs(expected)*1e-8 if 0<abs(expected)<1e-5 else 5.1e-7
 assert abs(a-expected)<=tol,(a,expected)
for i,(row,c) in enumerate(zip(r['rows'],cases)):
 assert len(row)==20 and row[1]==c['sample']
 t,N,interval,dose,stock,volume=[c[k] for k in ['t','N','interval','dose','stock','volume']]
 ph=c['acid'] if c['sample']=='acid' else c['base'] if c['sample']=='base' else 7
 nr=0 if dose==0 else sum(t>=2+k*interval for k in range(N));na=0 if dose==0 else sum(t>=2+k*interval+flight for k in range(N))
 drop=dose/N;arrived=na*drop;reservoir=(N-nr)*drop;fall=(nr-na)*drop;vessel=volume+arrived;mass=arrived*stock;conc=mass/vessel;H=10**-ph;OH=1e-14/H
 numeric=[t,ph,volume,dose,N,interval,stock,nr,na,reservoir,fall,vessel,mass,conc,H,OH]
 for a,b in zip(row[2:18],numeric):close(a,b)
 colour='No visible indicator colour' if mass==0 else 'red / pink reference' if ph<=4 else 'pink-purple reference' if ph<7 else 'purple-blue neutral reference' if ph==7 else 'blue / blue-green reference' if ph<10 else 'green reference' if ph<12 else 'yellow-green reference'
 assert row[18]==colour
 expected_work.extend([drop,flight,nr*drop,arrived,reservoir,fall,vessel,dose*stock,mass,conc,volume+dose,dose*stock,H,OH])
source=Path('/Users/macbookpro/Downloads/CL-0062-cabbage-indicator-practical.html');html=source.read_text();shutil.copyfile(source,root/'ui-exported-practical.html')
class Parse(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.p=None;self.results=[]
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag=='td':self.cell=''
  if tag=='p':self.p=''
  assert tag not in ['script','img']
 def handle_data(self,text):
  if self.cell is not None:self.cell+=text
  if self.p is not None:self.p+=text
 def handle_endtag(self,tag):
  if tag=='td':self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.row:self.table.append(self.row);self.row=None
  if tag=='p':
   if self.p and self.p.startswith('Result: '):self.results.append(self.p[8:])
   self.p=None
p=Parse();p.feed(html);assert len(p.tables)==3
for table,cols in zip(p.tables,[[0,1,2,3,4,5,6,7,8],[0,9,10,11,12,13,14,15],[0,16,17,18,19]]):
 assert table==[[row[j] for j in cols] for row in r['rows']]
assert len(p.results)==len(expected_work)==420
for a,b in zip(p.results,expected_work):close(a.split()[0],b)
assert '&lt;script&gt;' in html and '&lt;img src=x&gt;' in html and not re.search(r'https?://',html)
assert 'A4 landscape' in html and 'VisionariesAI Labs Private Limited' in html
summary={'actualTrials':30,'columnsPerTrial':20,'downloadedWorkedResultsVerified':420,'printTables':3,'exactReload':True,'escapedWriting':True,'companyOnlyReport':True}
(root/'practical-verification.json').write_text(json.dumps(summary,indent=2)+'\n');print(summary)
