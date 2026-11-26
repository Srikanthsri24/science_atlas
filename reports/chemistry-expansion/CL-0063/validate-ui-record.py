"""Independently reconstruct actual GUI rows and all downloaded worked results."""
import json,math,re,shutil
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).parent
r=json.loads((root/'actual-ui-record.json').read_text());assert r==json.loads((root/'record-after-reload.json').read_text())
area=128*math.sin(2*math.pi/128)/2*2.5**2
unit_area=32*math.sin(2*math.pi/32)/2
unit_volume=sum(unit_area*(math.cos(math.pi*j/24)-math.cos(math.pi*(j+1)/24))*(math.sin(math.pi*j/24)**2+math.sin(math.pi*j/24)*math.sin(math.pi*(j+1)/24)+math.sin(math.pi*(j+1)/24)**2)/3 for j in range(24))
def event(c,i):
 drop=c['plan']/c['N'];radius=(drop/unit_volume)**(1/3) if drop else 0
 release=2+i*c['interval'];surface=1.5+(c['va']+i*drop)/area
 return release,release+math.sqrt(2*(7-2*radius-surface)/981)
cases=[]
def add(t=None,target=None,**patch):
 c=dict(va=20,ca=.01,cb=.01,plan=40,N=400,interval=.2);c.update(patch)
 c['t']=t if t is not None else event(c,target-1)[1]+1e-6;cases.append(c)
for t in [0,2.03,20,40,60,105]:add(t)
for count in [199,200,201]:add(target=count)
for patch in [dict(plan=20),dict(plan=15),dict(va=30,ca=.02),dict(plan=0)]:
 for t in [0,105]:add(t,**patch)
for patch in [dict(cb=0),dict(ca=0)]:
 for t in [0,40,105]:add(t,**patch)
for t in [101.78,105]:add(t,va=30,ca=.02,cb=.02,interval=.25)
for t in [0,105]:add(t,va=10,ca=.005,cb=.005,plan=5,N=200,interval=.15)
add(105,va=10,ca=0,cb=0,plan=5,N=200,interval=.15)
for count in [31,32]:add(target=count,va=15,ca=.005,cb=.015,N=250)
assert len(cases)==len(r['rows'])==30
all_work=[]
def close(actual,expected):
 a=float(actual)
 tol=0 if expected==0 else abs(expected)*5.1e-9 if abs(expected)<.001 else abs(expected)*5.1e-10 if abs(expected)<1 else 5.1e-7
 assert abs(a-expected)<=tol+1e-16,(a,expected,tol)
for i,(row,c) in enumerate(zip(r['rows'],cases)):
 assert len(row)==25 and int(row[0])==i+1
 assert abs(float(row[1])-c['t'])<=5.1e-7
 for a,b in zip(row[2:8],[c['va'],c['ca'],c['cb'],c['plan'],c['N'],c['interval']]):close(a,b)
 # Rounded displayed times are sufficient here because target samples include a1µs post-contact margin.
 t=float(row[1]);events=[event(c,k) for k in range(c['N'])];nr=sum(t>=e[0] for e in events) if c['plan'] else 0;na=sum(t>=e[1] for e in events) if c['plan'] else 0
 dose,N=c['plan'],c['N'];released=dose*(nr/N);delivered=dose*(na/N);fall=dose*((nr-na)/N);reservoir=dose*((N-nr)/N)
 r0=50-dose;reading=50-reservoir;vessel=c['va']+delivered;litres=vessel/1000;nA=c['ca']*c['va']/1000;nB=c['cb']*delivered/1000
 xi=min(nA,nB);ae=max(0,nA-nB);be=max(0,nB-nA);sodium=nB/litres;chloride=nA/litres;D=(nA-nB)/litres;S=math.sqrt(D*D+4e-14)
 if D<0:OH=(S-D)/2;H=1e-14/OH
 else:H=(D+S)/2;OH=1e-14/H
 pH=-math.log10(H);pOH=-math.log10(OH);eq=None if c['cb']==0 else c['ca']*c['va']/c['cb'];category='acidic' if D>0 else 'basic' if D<0 else 'neutral'
 expected=[r0,reading,released,fall,delivered,vessel,nA,nB,xi,ae,be,H,OH,pH]
 for a,b in zip(row[8:22],expected):close(a,b)
 assert row[22]==category
 if eq is None:assert row[23]=='Not defined: no base equivalents'
 else:close(row[23],eq)
 all_work.extend([nA,dose/N,released,fall,delivered,reservoir,r0,reading,delivered,litres,nB,xi,ae,be,sodium,chloride,D,S,H,OH,pH,pOH,eq,H+sodium,OH+chloride,reservoir+fall+vessel,c['cb']*reservoir/1000+c['cb']*fall/1000+nB,xi+ae,xi+be])
paths=list(Path('/Users/macbookpro/Downloads').glob('CL-0063-neutralization-practical*.html'));assert paths
source=max(paths,key=lambda p:p.stat().st_mtime_ns);html=source.read_text();shutil.copyfile(source,root/'ui-exported-practical.html')
class Parse(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.p=None;self.results=[]
 def handle_starttag(self,tag,attrs):
  assert tag not in ['script','img']
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag=='td':self.cell=''
  if tag=='p':self.p=''
 def handle_data(self,text):
  if self.cell is not None:self.cell+=text
  if self.p is not None:self.p+=text
 def handle_endtag(self,tag):
  if tag=='td':self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.row:self.table.append(self.row);self.row=None
  if tag=='p':
   if self.p and self.p.startswith('Result: '):self.results.append(self.p[8:])
   self.p=None
p=Parse();p.feed(html);assert len(p.tables)==4
for table,cols in zip(p.tables,[[0,1,2,3,4,5,6,7],[0,8,9,10,11,12,13],[0,14,15,16,17,18],[0,19,20,21,22,23,24]]):assert table==[[row[j] for j in cols] for row in r['rows']]
assert len(p.results)==len(all_work)==870
for a,b in zip(p.results,all_work):
 if b is None:assert a.startswith('Not defined:')
 else:close(a.split()[0],b)
assert '&lt;script&gt;' in html and '&lt;img src=x&gt;' in html and not re.search(r'https?://',html)
assert 'A4 landscape' in html and 'VisionariesAI Labs Private Limited' in html
summary={'actualTrials':30,'columnsPerTrial':25,'downloadedWorkedResultsVerified':870,'printTables':4,'exactReload':True,'escapedWriting':True,'companyOnlyReport':True,'skippedEquivalenceVolumesMl':[float(r['rows'][-2][12]),float(r['rows'][-1][12])],'sourceDownloadedFilename':source.name}
(root/'practical-verification.json').write_text(json.dumps(summary,indent=2)+'\n');print(summary)
