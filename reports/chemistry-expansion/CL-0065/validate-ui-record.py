"""Reconstruct actual GUI rows and every numeric downloaded worked result."""
import json,math,shutil
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).parent;r=json.loads((root/'actual-ui-record.json').read_text())
assert r==json.loads((root/'record-after-reload.json').read_text());assert len(r['rows'])==56
def close(a,b):
    tol=0 if b==0 else abs(b)*5.1e-9 if abs(b)<.001 else abs(b)*5.1e-10 if abs(b)<1 else 5.1e-7
    assert abs(float(a)-b)<=tol+2e-16,(a,b,tol)
all_work=[];events=0
for i,row in enumerate(r['rows']):
    assert len(row)==25 and int(row[0])==i+1
    day,iron,water,cell,y,k,p,f=map(float,row[2:10])
    nfe=iron/55.845;nw=water/18.015;vf0=iron/8;vfilm=(1-f)*.25*.005;mfilm=vfilm*1.2
    vg0=cell-vf0-water-vfilm;ng=101.325*(vg0/1000)/(8.314462618*298.15);no=ng*y;nn=ng*(1-y)
    init=[nfe*f,nfe*(1-f)];caps=[v*.75 for v in init];weights=[f,(1-f)*p];used=[0.,0.];o=no;t=0.;segments=[];water_done=water==0
    for _ in range(4):
        if t>=day or water_done:break
        active=[weights[j] if used[j]<caps[j] else 0 for j in range(2)];W=sum(active)
        if W==0 or o==0:break
        wb=max(0,1.5*nw-sum(used))
        if wb==0:water_done=True;break
        local=[max(0,caps[j]-used[j])*W/active[j] if active[j] else math.inf for j in range(2)]
        delta=min(o,wb,*local);lam=k*W;tau=-math.log1p(-delta/o)/lam if delta<o else math.inf
        duration=min(day-t,tau);hit=tau<=day-t;amount=delta if hit else o*(-math.expm1(-lam*duration));by=[amount*w/W for w in active]
        for j in range(2):
            used[j]+=by[j]
            if hit and local[j]==delta:by[j]+=caps[j]-used[j];used[j]=caps[j]
        oend=max(0,o-delta) if hit else o*math.exp(-lam*duration)
        water_done=hit and wb==delta;ex=hit and local[0]==delta;co=hit and local[1]==delta
        event='water exhausted' if water_done else 'both zones exhausted' if ex and co else 'exposed exhausted' if ex else 'covered exhausted' if co else 'elapsed'
        segments.append([W,lam,delta,tau if math.isfinite(tau) else None,duration,oend,sum(by),*by]);t+=duration;o=oend
        if not hit:break
    xi=[v/.75 for v in used];fe=[max(0,caps[j]-used[j])/.75*55.845 for j in range(2)];prod=[v*88.851 for v in xi]
    product=sum(xi)*88.851;feall=(sum(max(0,caps[j]-used[j])/.75 for j in range(2)))*55.845
    wl=0 if water_done else max(0,1.5*nw-sum(used))/1.5*18.015
    vf=feall/8;vp=product/4.2;vg=cell-vf-vp-wl-vfilm;pressure=(o+nn)*8.314462618*298.15/(vg/1000)
    specimen=feall+product+mfilm;whole=specimen+wl+o*31.998+nn*28.014;whole0=iron+water+no*31.998+nn*28.014+mfilm
    active_final=[weights[j] if used[j]<caps[j] and not water_done else 0 for j in range(2)];rate=k*sum(active_final)*o
    for actual,expected in zip(row[10:23],[mfilm,*fe,*prod,product,o,wl,vg,pressure,specimen,whole,whole0]):close(actual,expected)
    assert row[23]==(event if segments else 'No reaction interval');assert abs(whole-whole0)<1e-14
    work=[nfe,nw,vf0,vfilm,mfilm,vg0,ng,no,nn,*init,*weights]
    for seg in segments:work+=seg
    for j in range(2):work += [xi[j],fe[j],prod[j]]
    work += [sum(used)/.75,product,o,wl,vf,vp,vg,pressure,specimen,whole,whole0,rate]
    assert len(work)==31+9*len(segments);all_work+=work;events+=len(segments)
source=max(Path('/Users/macbookpro/Downloads').glob('CL-0065-corrosion-coatings-practical*.html'),key=lambda p:p.stat().st_mtime_ns)
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
for table,cols in zip(p.tables,[list(range(10)),[0,*range(10,18)],[0,*range(18,25)]]):assert table==[[row[j] for j in cols] for row in r['rows']]
assert len(p.results)==len(all_work)
for actual,expected in zip(p.results,all_work):
    if expected is None:assert actual=='No finite exhaustion event from oxygen depletion alone.'
    else:close(actual.split()[0],expected)
assert '&lt;script&gt;' in html and '&lt;img src=x&gt;' in html and 'https://' not in html
assert 'A4 landscape' in html and 'VisionariesAI Labs Private Limited' in html
summary=dict(actualTrials=56,columnsPerTrial=25,downloadedWorkedResultsVerified=len(all_work),reactionIntervalsVerified=events,printTables=3,exactReload=True,escapedWriting=True,companyOnlyReport=True)
(root/'practical-verification.json').write_text(json.dumps(summary,indent=2)+'\n');print(summary)
