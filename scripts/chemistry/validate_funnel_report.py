"""Independent checks of the actual browser-downloaded CL-0084 HTML table.
Uses Python geometry/units/accounting; it does not import the application model.
Run: python3 scripts/chemistry/validate_funnel_report.py path/to/report.html
"""
import json,math,re,sys
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
class Table(HTMLParser):
 def __init__(self):super().__init__();self.rows=[];self.row=None;self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='tr':self.row=[]
  if tag in ('td','th'):self.cell=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
 def handle_endtag(self,tag):
  if tag in ('td','th') and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.row is not None:self.rows.append(self.row);self.row=None
src=Path(sys.argv[1]).read_text();p=Table();p.feed(src)
r=json.loads(re.search(r'<script id="funnel-record-inputs" type="application/json">(.*?)</script>',src,re.S)[1])
assert len(p.rows)==len(r['trials'])+1
blocks=re.findall(r'<li><b>(.*?)</b><p>(.*?)</p><p>Substitution: (.*?)</p><p>Result: (.*?)</p></li>',src,re.S)
assert len(blocks)==13*len(r['trials'])
checks=0
def near(a,b):
 global checks
 assert abs(float(a)-b)<=max(1e-7,abs(b)*2e-9),(a,b)
 checks+=1
def volume(h):return math.pi*.25**2*h+math.pi*3.4**2*(h/2-12*math.sin(2*math.pi*h/12)/(4*math.pi))
def height(v):
 lo,hi=0.,12.
 for _ in range(60):
  mid=(lo+hi)/2
  if volume(mid)<v:lo=mid
  else:hi=mid
 return (lo+hi)/2 if v>0 else 0.
for index,(q,cells) in enumerate(zip(r['trials'],p.rows[1:])):
 assert len(cells)==30
 v=dict(zip(p.rows[0],cells));n=lambda k:float(v[k]);near(v['Trial'],index+1)
 for k,h in [('volumeAMl','A initial mL'),('volumeBMl','B initial mL'),('densityBGml','B density g/mL'),('opening','Opening fraction'),('dischargeCoefficient','Discharge coefficient'),('switchOffsetMl','Receiver offset mL'),('closeAfterSeconds','Scheduled close s'),('timeSeconds','Reference time s')]:near(v[h],q[k])
 a1,b1,a2,b2,ar,br=[n(k) for k in ['Receiver 1 A mL','Receiver 1 B mL','Receiver 2 A mL','Receiver 2 B mL','Remaining A mL','Remaining B mL']]
 near(a1+a2+ar,q['volumeAMl']);near(b1+b2+br,q['volumeBMl'])
 lower_a=q['densityBGml']<=1;lower=ar if lower_a else br;upper=br if lower_a else ar;rho_l=1 if lower_a else q['densityBGml'];rho_u=q['densityBGml'] if lower_a else 1
 hi,hs=height(lower),height(lower+upper);pressure=98.1*(rho_l*hi+rho_u*(hs-hi))
 near(v['Interface height cm'],hi);near(v['Surface height cm'],hs);near(v['Gauge pressure Pa'],pressure);near(v['Open-flow time s'],min(q['timeSeconds'],q['closeAfterSeconds']))
 out_rho=rho_l if lower>1e-8 else rho_u
 flow=q['dischargeCoefficient']*.03*q['opening']*math.sqrt(2*981*pressure/(98.1*out_rho)) if q['timeSeconds']<q['closeAfterSeconds'] and ar+br>1e-8 else 0
 near(v['Current flow mL/s'],flow)
 m1,m2=a1+q['densityBGml']*b1,a2+q['densityBGml']*b2
 near(v['Receiver 1 mass g'],m1);near(v['Receiver 2 mass g'],m2)
 target1,target2=(a1,b2) if lower_a else (b1,a2);initial1,initial2=(q['volumeAMl'],q['volumeBMl']) if lower_a else (q['volumeBMl'],q['volumeAMl'])
 near(v['Lower recovery in receiver 1 %'],100*target1/initial1);near(v['Upper recovery in receiver 2 %'],100*target2/initial2)
 for h,m,target,rho in [('Receiver 1 lower mass purity %',m1,target1,rho_l),('Receiver 2 upper mass purity %',m2,target2,rho_u)]:
  if m>0:near(v[h],100*target*rho/m)
  else:assert v[h]=='Not established';checks+=1
 near(v['Accounted A mL'],q['volumeAMl']);near(v['Accounted B mL'],q['volumeBMl']);near(v['Accounted mass g'],q['volumeAMl']+q['densityBGml']*q['volumeBMl'])
 assert v['Observation']==q['note'];checks+=1
 expected=[[hi,hs],[pressure],[flow],[max(0,min(initial1+q['switchOffsetMl'],q['volumeAMl']+q['volumeBMl']))],[m1],[m2],[100*target1/initial1],[100*target2/initial2],[100*rho_l*target1/m1]if m1 else [],[100*rho_u*target2/m2]if m2 else [],[q['volumeAMl'],q['volumeAMl']],[q['volumeBMl'],q['volumeBMl']],[q['volumeAMl']+q['densityBGml']*q['volumeBMl']]*2]
 for block,values in zip(blocks[index*13:(index+1)*13],expected):
  result=unescape(block[3]);numbers=re.findall(r'[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?',result)
  assert len(numbers)==len(values),(block[0],result,values)
  for actual,wanted in zip(numbers,values):near(actual,wanted)
  if not values:assert result=='Not established'

assert src.count('Substitution:')==13*len(r['trials'])
assert src.count('Result:')==13*len(r['trials'])
print(f'{len(r["trials"])} actual report rows; {checks} independent numeric/text checks; {13*len(r["trials"])} worked calculation blocks checked')
