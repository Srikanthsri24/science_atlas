"""Check actual exported observations and every worked result without app imports."""
from html.parser import HTMLParser
from html import unescape
from pathlib import Path
import math,re,json
class Tables(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.table=[]
  elif tag=='tr':self.row=[]
  elif tag in ('td','th'):self.cell=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
 def handle_endtag(self,tag):
  if tag in ('td','th') and self.cell is not None:self.row.append(self.cell);self.cell=None
  elif tag=='tr' and self.row is not None:self.table.append(self.row);self.row=None
  elif tag=='table':self.tables.append(self.table);self.table=None
p=Path(__file__).parent;html=p.joinpath('actual-ui-report.html').read_text();parser=Tables();parser.feed(html)
assert len(parser.tables)==7
tables=[t[1:] for t in parser.tables];n=len(tables[0]);assert n>=3 and all(len(t)==n for t in tables)
observations=worked=numericObservations=numericWorked=0
def compare(actual,expected,kind):
 global observations,worked,numericObservations,numericWorked
 if expected is None:assert actual=='Not established' or actual.startswith('Not established for'),(actual,expected)
 elif isinstance(expected,str):assert actual==expected,(actual,expected)
 else:
  m=re.match(r'[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?',actual,re.I);assert m,actual
  if kind=='observation':numericObservations+=1
  else:numericWorked+=1
  a=float(m[0]);assert abs(a-expected)<=8e-8*max(1,abs(expected)),(a,expected)
 if kind=='observation':observations+=1
 else:worked+=1
def smooth(x):
 x=max(0,min(1,x));return x*x*(3-2*x)
def rounded(x):return math.floor(x*100+.5)/100
results=re.findall(r'<p>Result: (.*?)</p>',html);position=0
for i,prep in enumerate(tables[0]):
 F,R,S,W,N,eta,e,h,V,k,t=map(float,prep[1:]);k=int(k)
 a=smooth((t-20)/140);npass=N*a;diss=smooth((t-180)/180);fil=smooth((t-360)/180);dry=smooth((t-900)/300)
 fm=F*(1-(1-eta)**npass);rm=R*(1-(1-e)**npass);sm=S*(1-(1-e)**npass);mag=fm+rm+sm
 fr=F-fm;rr=R-rm;sr=S-sm;D=min(sr,.36*W)*diss
 srcF=fr*(1-fil);srcR=rr*(1-fil);srcS=sr*(1-fil);srcW=W*diss-W*fil
 retained=(sr-D+D*h/W)*fil;cs=retained;cw=h*fil;rs=D*(1-h/W)*fil;rw=(W-h)*fil;reserve=k*V;washvalues=[]
 for j in range(k):
  local=t-(540+j*120)
  if local<=0:continue
  fill=smooth(local/60);drain=smooth((local-60)/60);full=min(cs,.36*(h+V));out=full*V/(h+V)*drain if h+V>0 else 0
  cs=max(0,cs-out);rs+=out;cw+=V*(fill-drain);rw+=V*drain;reserve-=V*fill;washvalues.extend([full,out,cs])
 vap=(cw+rw)*dry;cw*=1-dry;rw*=1-dry;cf=fr*fil;cr=rr*fil;cake=cf+cr+cs;initialreserve=W*(1-diss);finished=t==1200
 fp=100*fm/mag if mag>0 else None;rf=100*fm/F;rp=100*cr/cake if finished and cake>0 else None;rrec=100*cr/R if finished else None;srec=100*max(0,rs-min(rs,.36*rw))/S if finished else None
 mg=rounded(12.4+mag);cg=rounded(2.1+cake) if finished else None;sg=rounded(26.8+rs) if finished else None
 mn=mg-12.4;cn=cg-2.1 if cg is not None else None;sn=sg-26.8 if sg is not None else None
 expected=[list(map(float,prep[:1]))+[F,R,S,W,N,eta,e,h,V,k,t],[i+1,fm,rm,sm,mag,fp,rf],[i+1,srcF,srcR,srcS,srcW],[i+1,cf,cr,cs,cw],[i+1,rs,rw,reserve,initialreserve,vap],[i+1,'Yes' if finished else 'No',mn,cn,sn,rp,rrec,srec]]
 for group,values in zip(tables[:6],expected):
  assert len(group[i])==len(values)
  for actual,value in zip(group[i],values):compare(actual,value,'observation')
 values=[npass,fm,rm,sm,rf,fp,D,retained]+washvalues+[fm+srcF+cf,rm+srcR+cr,sm+srcS+cs+rs,initialreserve+srcW+cw+rw+reserve+vap,mg,mn,cg,cn,sg,sn,100*mn/F,rp,rrec,srec]
 for value in values:compare(unescape(results[position]),value,'worked');position+=1
assert position==len(results)
assert '&lt;safe&gt; &amp; evidence' in html and '<safe>' not in html
out={'status':'passed','actualGuiTrials':n,'observationFieldChecks':observations,'numericObservationChecks':numericObservations,'workedResultChecks':worked,'numericWorkedResults':numericWorked,'reportTables':7,'method':'Separate Python compartment and batch-equilibrium calculation;no app code imported','scope':'Internal engineering verification;no physical calibration,printer or independent expert certification.'}
p.joinpath('download-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out))
