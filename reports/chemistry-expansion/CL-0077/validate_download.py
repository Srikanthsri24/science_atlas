from pathlib import Path
from html.parser import HTMLParser
import math,json,re
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.cells=[];self.incell=False;self.items=[];self.item=None
 def handle_starttag(self,t,a):
  if t=='td':self.cells.append('');self.incell=True
  if t=='li':self.item=''
 def handle_endtag(self,t):
  if t=='td':self.incell=False
  if t=='li' and self.item is not None:self.items.append(self.item);self.item=None
 def handle_data(self,d):
  if self.incell:self.cells[-1]+=d
  if self.item is not None:self.item+=d
p=Path(__file__).parent;src=max(Path('/Users/macbookpro/Downloads').glob('CL-0077-displaced-density-practical*.html'),key=lambda f:f.stat().st_mtime);text=src.read_text();r=Parser();r.feed(text);assert len(r.cells)%22==0;rows=[r.cells[i:i+22]for i in range(0,len(r.cells),22)];worked=[v for v in r.items if 'Substitution:' in v and 'Result:' in v];assert len(worked)==21*len(rows)
checks=0;workChecks=0
R=math.sqrt(20/math.pi);w=R-1.8;meniscus=2*math.pi*.12*(1.8*w/3+w*w/4)
def display(x,step):return math.floor(x/step+.5+1e-10)*step
def same(got,want):
 if want is None:assert not re.match(r'^[-+]?\d',got),got
 else:assert abs(float(re.match(r'^[-+]?\d*\.?\d+(?:e[-+]?\d+)?',got,re.I).group())-want)<max(2e-7,abs(want)*2e-7),(got,want)
for i,row in enumerate(rows):
 V,rho,water,lower,rm,rv=map(float,row[2:8]);frac=0 if row[1]=='weigh' else min(1,lower);sub=V*(3*frac**2-2*frac**3);mass=V*rho;mr=display(mass,rm);v0=display(water,rv);vf=display(water+sub,rv);dv=vf-v0;ratio=mr/dv if dv>0 else None;valid=row[1]=='immerse' and lower>=1 and dv>0;low=(mr-rm/2)/(dv+rv)if valid and dv>rv else None;high=(mr+rm/2)/(dv-rv)if valid and dv>rv else None;H=(water+sub-meniscus)/20;force=(mass-sub)*.00981
 expected={8:mr,9:v0,10:vf,11:dv,12:ratio,14:low,15:high,16:ratio*1000 if valid else None,17:sub,18:H,19:water,20:force}
 for col,value in expected.items():same(row[col],value);checks+=1
 assert row[13]==('Yes' if valid else 'No: partial or no immersion')
 values=[V,mass,mr,sub,water+sub,meniscus,(water-meniscus)/20,H,v0,vf,dv,ratio,ratio*1000 if valid else None,rv/2,rv,rm/2,low,high,(ratio-rho)/rho*100 if valid else None,water,force]
 for j,value in enumerate(values):same(worked[i*21+j].split('Result: ',1)[1],value);workChecks+=1
assert '&lt;reference&gt;' in text and '<reference>'not in text and 'Weigh dry,record initial water' in text and '@media print' in text
(p/'actual-ui-report.html').write_text(text);(p/'download-validation.json').write_text(json.dumps({'rows':len(rows),'columns':22,'observationChecks':checks,'workedResultChecks':workChecks,'method':'Independent Python ellipsoid cap,meniscus volume,quantized readings,rounding bounds and static-force reconstruction from actual downloaded preparations','passed':True},indent=2));print(len(rows),'rows;',checks,'observation and',workChecks,'worked-result checks passed')
