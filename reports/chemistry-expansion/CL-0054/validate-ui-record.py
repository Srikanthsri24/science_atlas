"""Independent GUI observations and actual downloaded report; no app imports."""
import json,html,re
from html.parser import HTMLParser
from pathlib import Path
p=Path(__file__).parent;before=json.loads((p/'ui-record-before-reload.json').read_text());after=json.loads((p/'ui-record-after-reload.json').read_text());assert before==after;rows=after['rows'];assert len(rows)==32
expectedCalculations=[]
for row in rows:
 assert len(row)==23
 P=float(row[1]);I,S,N,W=map(float,row[3:7]);a,b,f,e=[max(0,min(1,P-j)) for j in range(4)];D=min(N,.36*W)*b;sourceN=(N-D)*(1-f);filterS=S*f;filterN=(N-D)*f;dishW=W*b*f*(1-e);dishD=min(D*f,.36*dishW);crystal=D*f-dishD;vap=W*b*f*e;total=I+S+N+W;purity=100*filterS/(filterS+filterN) if filterS+filterN>0 else None;recovery=100*crystal/N
 expected={7:I*a,8:S*(1-f),9:D*(1-f),10:sourceN,11:W*b*(1-f),12:W*(1-b),13:filterS,14:filterN,15:dishW,16:dishD,17:crystal,18:vap,20:recovery,21:total}
 for col,value in expected.items():assert abs(float(row[col])-value)<.00000051,(row[0],col,row[col],value)
 if purity is None:assert row[19]=='Undefined'
 else:assert abs(float(row[19])-purity)<.00000051
 expectedCalculations.append([total,I*a,I*a,W*b,.36*W,N/.36,D,N-D,filterS,filterN,filterS+filterN,purity,vap,dishW,dishD,crystal,recovery,dishW+dishD+crystal,I,S,N,W,total])
report=(p/'ui-exported-practical.html').read_text();assert not re.search(r'https?://',report);assert 'VisionariesAI Labs' in report
for name in ['prediction','conclusion']:assert html.escape(after[name],quote=True) in report
class Tables(HTMLParser):
 def __init__(self):super().__init__();self.tables={};self.current=None;self.rows=[];self.row=None;self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.current=dict(attrs).get('data-sequence-report-table');self.tables[self.current]=[]
  if tag=='tr' and self.current is not None:self.row=[]
  if tag=='td' and self.current is not None:self.cell=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
 def handle_endtag(self,tag):
  if tag=='td' and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.current is not None and self.row:self.tables[self.current].append(self.row)
  if tag=='table':self.current=None
parser=Tables();parser.feed(report)
for key,cols in [('0',[0,1,2,3,4,5,6,22]),('1',[0,1,7,8,9,10,11,12,13,14]),('2',[0,1,15,16,17,18,19,20,21])]:assert parser.tables[key]==[[r[i] for i in cols] for r in rows],('report table mismatch',key)
blocks=re.findall(r'<li><strong>(.*?)</strong><p><code>(.*?)</code></p><p>Substitution: (.*?)</p><p>Result: (.*?)</p></li>',report);assert len(blocks)==736
for i,expected in enumerate(expectedCalculations):
 for j,value in enumerate(expected):
  title,formula,substitution,result=[html.unescape(x) for x in blocks[i*23+j]];assert title and formula and substitution
  if value is None:assert 'Undefined' in result
  else:
   actual=float(re.search(r'-?\d+(?:\.\d+)?',result).group());assert abs(actual-value)<.00000051,(i,j,title,actual,value)
print('32 actual GUI trials independently verify component budgets,capacity,purity andrecovery. Exact reload persistence,three print tables and736 worked results passed.')
