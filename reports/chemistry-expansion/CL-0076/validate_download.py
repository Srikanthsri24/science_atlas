from pathlib import Path
from html.parser import HTMLParser
import json
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.cells=[];self.active=False
 def handle_starttag(self,t,a):
  if t=='td':self.cells.append('');self.active=True
 def handle_endtag(self,t):
  if t=='td':self.active=False
 def handle_data(self,t):
  if self.active:self.cells[-1]+=t
p=Path(__file__).parent;source=max(Path('/Users/macbookpro/Downloads').glob('CL-0076-particle-evidence-practical*.html'),key=lambda f:f.stat().st_mtime);text=source.read_text();reader=Parser();reader.feed(text);assert len(reader.cells)%18==0;checks=0
for j in range(len(reader.cells)//18):
 row=reader.cells[j*18:(j+1)*18];methane,oxygen,frac,ratio=map(float,row[2:6]);extent=0 if row[1]=='physical' else frac*min(methane,oxygen/2);a,b,c,d=methane-extent,oxygen-2*extent,extent,2*extent
 totalMass=methane*(12.011+4*1.008)+oxygen*(2*15.999);volume=(methane+oxygen)*8.314462618*600/101325*(ratio if row[1]=='physical' else 1);pressure=(a+b+c+d)*8.314462618*600/volume
 expected={6:extent,7:a,8:b,9:c,10:d,11:a+c,12:4*a+2*d,13:2*b+2*c+d,14:totalMass,15:volume*1000,16:pressure}
 for col,v in expected.items():assert abs(float(row[col])-v)<max(1e-10,abs(v)*1e-7),(j,col,row[col],v);checks+=1
 assert row[17]==('Chemical conversion' if extent>0 else 'Species unchanged')
assert 'Compare unchanged species under compression' in text and 'Pressure alone is insufficient' in text
assert 'Pressure = nRT/V' in text and '@media print' in text and 'http' not in text
(p/'actual-ui-report.html').write_text(text);(p/'download-validation.json').write_text(json.dumps({'rows':len(reader.cells)//18,'columns':18,'derivedQuantityChecks':checks,'method':'Independent Python stoichiometry/element/mass/ideal-gas reconstruction from actual downloaded preparations','passed':True},indent=2));print(checks,'derived quantities checked')
