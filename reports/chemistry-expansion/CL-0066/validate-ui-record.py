"""Independent numerical reconstruction of actual observations and report."""
import json,math,shutil
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).parent;r=json.loads((root/'actual-ui-record.json').read_text())
assert r==json.loads((root/'record-after-reload.json').read_text());assert len(r['rows'])==60
R=8.314462618;area=128*math.sin(2*math.pi/128)/2*1.25**2
def close(a,b):
    tol=0 if b==0 else abs(b)*5.1e-9 if abs(b)<.001 else abs(b)*5.1e-10 if abs(b)<1 else 5.1e-7
    assert abs(float(a)-b)<=tol+1e-15,(a,b,tol)
all_work=[];intervals=0
for i,row in enumerate(r['rows']):
    assert len(row)==26 and int(row[0])==i+1
    piston=row[1]=='Free-piston reference';ret=row[2]=='Return jacket at 120 s'
    t,V0,P0,theta0,target,G=map(float,row[3:9]);T0=theta0+273.15;Tj=target+273.15;n=P0*(V0/1000)/(R*T0)
    cv=2.5*R;cp=3.5*R;capacity=cp if piston else cv;thermal=n*capacity;tau=thermal/G
    first=min(t,120) if ret else t;second=max(0,t-120) if ret else 0
    first_delta=(target-theta0)*(-math.expm1(-first/tau));delta=first_delta*math.exp(-second/tau) if second else first_delta
    gas=T0+delta;bath=T0 if ret and t>=120 else Tj
    dV=V0*delta/T0 if piston else 0;V=V0+dV;dP=0 if piston else P0*delta/T0;P=P0+dP
    heat=n*capacity*delta;work=n*R*delta if piston else 0;internal=n*cv*delta;flow=G*(bath-gas);rate=flow/thermal
    mass=n*.02897*1000;density=mass/(V/1000);height=V/area
    for a,b in zip(row[9:25],[gas-273.15,gas,bath-273.15,n,tau,V,dV,P,dP,heat,work,internal,flow,mass,density,height]):close(a,b)
    assert abs(heat-work-internal)<1e-13
    blocks=[T0,Tj,n,capacity,thermal,tau];segments=[]
    if first>0:segments.append((first,Tj,T0,T0+first_delta,first_delta))
    if second>0:segments.append((second,T0,T0+first_delta,gas,first_delta*math.expm1(-second/tau)))
    for duration,b,start,end,change in segments:blocks.extend([duration,b,start,change,end,n*capacity*change,n*R*change if piston else 0,n*cv*change])
    blocks.extend([delta,gas,gas-273.15,bath-273.15,dV,V,dP,P,heat,work,internal,flow,rate,mass,density,height,P*V/1000,n*R*gas,None,math.sqrt(3*R*gas/.02897)])
    assert len(blocks)==26+8*len(segments);all_work+=blocks;intervals+=len(segments)
source=max(Path('/Users/macbookpro/Downloads').glob('CL-0066-air-expansion-practical*.html'),key=lambda p:p.stat().st_mtime_ns)
html=source.read_text();shutil.copyfile(source,root/'ui-exported-practical.html')
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
p=Parse();p.feed(html);assert len(p.tables)==3
for table,cols in zip(p.tables,[list(range(9)),[0,*range(9,18)],[0,*range(18,26)]]):assert table==[[row[j] for j in cols] for row in r['rows']]
assert len(p.results)==len(all_work)
for actual,expected in zip(p.results,all_work):
    if expected is None:assert abs(float(actual.split()[0]))<1e-13 # roundoff-only first-law residual
    else:close(actual.split()[0],expected)
assert '&lt;script&gt;' in html and '&lt;img src=x&gt;' in html and 'https://' not in html
assert 'A4 landscape' in html and 'VisionariesAI Labs Private Limited' in html
summary=dict(actualTrials=60,columnsPerTrial=26,downloadedWorkedResultsVerified=len(all_work),thermalIntervalsVerified=intervals,printTables=3,exactReload=True,escapedWriting=True,companyOnlyReport=True)
(root/'practical-verification.json').write_text(json.dumps(summary,indent=2)+'\n');print(summary)
