"""Validate CL-0099 exported tables and all49numeric worked results per trial independently."""
import json,re,sys
from decimal import Decimal,localcontext
from html.parser import HTMLParser
D=lambda v:Decimal(str(v))
class Report(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.worked=[];self.inputs='';self.intable=False;self.incell=False;self.inworked=False;self.inscript=False;self.row=[];self.cell='';self.block=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.tables.append([]);self.intable=True
  if tag=='tr':self.row=[]
  if tag in ('td','th'):self.incell=True;self.cell=''
  if tag=='section' and a.get('class')=='worked':self.inworked=True;self.block=''
  if tag=='script' and a.get('id')=='indicator-dilution-record-inputs':self.inscript=True
 def handle_data(self,data):
  if self.incell:self.cell+=data
  if self.inworked:self.block+=data+' '
  if self.inscript:self.inputs+=data
 def handle_endtag(self,tag):
  if tag in ('td','th'):self.row.append(self.cell.strip());self.incell=False
  if tag=='tr' and self.intable:self.tables[-1].append(self.row)
  if tag=='table':self.intable=False
  if tag=='section' and self.inworked:self.worked.append(self.block.strip());self.inworked=False
  if tag=='script':self.inscript=False

def check(path):
 p=Report();p.feed(open(path).read());record=json.loads(p.inputs);trials=record['trials'];checks=0;worked=[];rows=[]
 def near(actual,expected):
  nonlocal checks
  checks+=1
  if abs(D(actual)-expected)>max(D('1e-22'),abs(expected)*D('3e-11')):raise AssertionError(f'{actual} != {expected}')
 with localcontext() as ctx:
  ctx.prec=60
  for index,q in enumerate(trials):
   v0,c0,w,a,b=map(D,[q['sampleMl'],q['stockMolL'],q['waterMl'],q['orangeFraction'],q['phenolFraction']]);vols=[]
   for i,fraction in enumerate([D(0),a,D(0),b]):
    added=w*fraction;v=v0+added;n=c0*v0/1000;c=n*1000/v;mass=v0/1000;tracer=mass*1000/v;ratio=v0/v;kw=D('1e-14');lo=kw.sqrt();hi=c+lo
    for _ in range(240):
     mid=(lo+hi)/2
     if mid-kw/mid<c:lo=mid
     else:hi=mid
    major=(lo+hi)/2;h=major if q['kind']=='acid' else kw/major;ph=-h.log10();height=v/10;vols.append(v)
    family=('red' if ph<D('3.1') else 'yellow' if ph>D('4.4') else 'transition') if i<2 else ('colourless' if ph<D('8.2') else 'pink' if ph>10 else 'transition')
    rows.append([str(index+1),'methyl-orange' if i<2 else 'phenolphthalein','Test' if i%2 else 'Control',added,v,n,c,mass,tracer,ratio,ph,family,height,D(2)])
    worked.extend([added,v,n,c,mass,tracer,ratio,major,h,ph,height])
   res=w*(2-a-b);total=sum(vols)+res;worked.extend([res,4*v0+2*w,total,total-(4*v0+2*w),total])
  if len(p.worked)!=len(worked):raise AssertionError('Worked block count')
  for block,expected in zip(p.worked,worked):
   match=re.search(r'=\s*([-+\d.eE]+)\s+\S+\s*$',block)
   if not match:raise AssertionError('Missing numeric worked result')
   near(match[1],expected)
  if trials:
   actual=p.tables[1][1:]
   if len(actual)!=len(rows):raise AssertionError('Observation row count')
   for row,expected in zip(actual,rows):
    if len(row)!=len(expected):raise AssertionError('Observation columns')
    for value,want in zip(row,expected):
     if isinstance(want,Decimal):near(value,want)
     elif value!=want:raise AssertionError(f'{value} != {want}')
 print(f'PASS {len(trials)} trials; {len(worked)} worked results; {checks} independent numeric checks')
if __name__=='__main__':check(sys.argv[1])
