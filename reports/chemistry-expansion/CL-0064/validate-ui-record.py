"""Independent reconstruction of actual browser observations and downloaded results."""
import json, math, shutil
from pathlib import Path
from html.parser import HTMLParser
root=Path(__file__).parent
r=json.loads((root/'actual-ui-record.json').read_text())
assert r==json.loads((root/'record-after-reload.json').read_text())
assert len(r['rows'])==40
def close(a,b):
    tolerance=0 if b==0 else abs(b)*5.1e-9 if abs(b)<.001 else abs(b)*5.1e-10 if abs(b)<1 else 5.1e-7
    assert abs(float(a)-b)<=tolerance+1e-16,(a,b,tolerance)
results=[]
for i,row in enumerate(r['rows']):
    assert len(row)==23 and int(row[0])==i+1
    day,iron,water,cell,y,k,a=map(float,row[2:9])
    nfe=iron/55.845;nwater=water/18.015;vfe=iron/8;vg0=cell-vfe-water
    ngas=101.325*(vg0/1000)/(8.314462618*298.15);no=ngas*y;nn=ngas*(1-y)
    cap=min(nfe,no/.75,nwater/.5);tail=math.exp(-k*day);f=-math.expm1(-k*day);xi=cap*f
    fe=((nfe-cap)+cap*tail)*55.845;oleft=((no-.75*cap)+.75*cap*tail);wleft=((nwater-.5*cap)+.5*cap*tail)*18.015
    product=xi*88.851;attached=a*product;sediment=(1-a)*product
    vf=fe/8;va=attached/4.2;vs=sediment/4.2;vw=wleft;vg=cell-vf-va-vs-vw
    pressure=(oleft+nn)*8.314462618*298.15/(vg/1000);coupon=fe+attached;allfe=fe+product
    whole=fe+attached+sediment+wleft+oleft*31.998+nn*28.014;whole0=iron+water+no*31.998+nn*28.014
    for actual,expected in zip(row[10:22],[fe,product,attached,sediment,oleft,wleft,vg,pressure,coupon,allfe,whole,whole0]):close(actual,expected)
    assert abs(whole-whole0)<1e-14
    if not water and not no:lim='water and oxygen excluded'
    elif not water:lim='water excluded'
    elif not no:lim='oxygen excluded'
    else:lim=' + '.join(name for name,v in [('iron',nfe),('oxygen',no/.75),('water',nwater/.5)] if v==cap)
    assert row[9]==lim
    results.extend([nfe,nwater,vfe,vg0,ngas,no,nn,cap,f,xi,fe,.75*xi,.5*xi,product,attached,sediment,oleft,wleft,vf,va,vs,vw,vg,pressure,coupon,allfe,whole,whole0,cap*k*tail])
source=max(Path('/Users/macbookpro/Downloads').glob('CL-0064-rust-conditions-practical*.html'),key=lambda p:p.stat().st_mtime_ns)
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
for table,cols in zip(p.tables,[list(range(10)),[0,*range(10,16)],[0,*range(16,23)]]):assert table==[[row[j] for j in cols] for row in r['rows']]
assert len(p.results)==len(results)==1160
for actual,expected in zip(p.results,results):close(actual.split()[0],expected)
assert '&lt;script&gt;' in html and '&lt;img src=x&gt;' in html and 'https://' not in html
assert 'A4 landscape' in html and 'VisionariesAI Labs Private Limited' in html
summary=dict(actualTrials=40,columnsPerTrial=23,downloadedWorkedResultsVerified=1160,printTables=3,exactReload=True,escapedWriting=True,companyOnlyReport=True)
(root/'practical-verification.json').write_text(json.dumps(summary,indent=2)+'\n');print(summary)
