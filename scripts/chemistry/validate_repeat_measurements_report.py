"""Independent Python CL-0092 report check. Does not import or execute application code."""
import json,math,re,sys
from html.parser import HTMLParser
class Document(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.part=None;self.p=None;self.sub=None;self.worked=[];self.in_json=False;self.json_text=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag in('td','th'):self.cell=''
  if tag=='p':self.part=a.get('class');self.p=''
  if tag=='script' and a.get('id')=='repeat-measurements-record-inputs':self.in_json=True
 def handle_data(self,s):
  if self.cell is not None:self.cell+=s
  if self.p is not None:self.p+=s
  if self.in_json:self.json_text+=s
 def handle_endtag(self,tag):
  if tag in('td','th'):self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.table is not None:self.table.append(self.row)
  if tag=='table':self.table=None
  if tag=='script':self.in_json=False
  if tag=='p':
   if self.part=='substitution':self.sub=self.p
   if self.part=='result':self.worked.append((self.sub,self.p))
   self.p=None;self.part=None
MASK=0xffffffff
# Integer operations mirror the documented generator,not an imported app implementation.
def normals(seed,n):
 a=seed;out=[]
 def uniform():
  nonlocal a
  a=(a+0x6d2b79f5)&MASK;t=((a^(a>>15))*(a|1))&MASK;t=(t^((t+(((t^(t>>7))*(t|61))&MASK))&MASK))&MASK
  return ((t^(t>>14))+.5)/4294967296
 for _ in range(n):out.append(math.sqrt(-2*math.log(uniform()))*math.cos(2*math.pi*uniform()))
 return out
def quantize(v,step):return math.copysign(math.floor(abs(v/step)+.5),v)*step if v else 0
def stats(xs):
 n=len(xs);mean=math.fsum(xs)/n;dev=[x-mean for x in xs];sq=[d*d for d in dev];ss=math.fsum(sq);var=ss/(n-1) if n>1 else None;sd=math.sqrt(var) if var is not None else None
 return dict(n=n,total=math.fsum(xs),mean=mean,lo=min(xs),hi=max(xs),span=max(xs)-min(xs),dev=dev,sq=sq,ss=ss,var=var,sd=sd,u=sd/math.sqrt(n) if sd is not None else None)
def solve(q):
 n=q['recordedCount'];b=quantize(q['zeroOffsetG'],q['resolutionG']);rs=[]
 for i,z in enumerate(normals(q['seed'],n)):
  noise=q['noiseSdG']*z;a=q['referenceMassG']+q['zeroOffsetG']+noise;x=quantize(a,q['resolutionG']);y=round(x-b,2);rs.append(dict(i=i+1,z=z,noise=noise,a=a,x=x,y=y,rawerr=x-q['referenceMassG'],correrr=y-q['referenceMassG']))
 return b,rs,stats([r['x']for r in rs]),stats([r['y']for r in rs])
def nums(s):return[float(x)for x in re.findall(r'[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?',s)]
def main(path):
 d=Document();d.feed(open(path).read());series=json.loads(d.json_text)['series'];assert len(d.tables)==3;checks=0;wi=0;ri=1
 def numeric(a,b,where):
  nonlocal checks
  assert math.isfinite(a) and math.isfinite(b),where
  assert abs(a-b)<=5e-10*max(1,abs(b)),(where,a,b);checks+=1
 def row(actual,expected,where):
  assert len(actual)==len(expected),(where,len(actual),len(expected))
  for i,(a,b)in enumerate(zip(actual,expected)):
   if b is None:assert a=='Not defined',(where,i,a)
   elif isinstance(b,str):assert a==b,(where,i,a,b)
   else:numeric(float(a),b,(where,i))
 def work(sub,result):
  nonlocal wi
  a,b=d.worked[wi];wi+=1;an=nums(a);assert len(an)==len(sub),(wi,a,sub)
  for x,y in zip(an,sub):numeric(x,y,('sub',wi))
  if result is None:assert b.startswith('Not defined:'),(wi,b)
  else:
   bn=nums(b);assert len(bn)==1,(wi,b);numeric(bn[0],result,('result',wi))
 for i,q in enumerate(series):
  b,rs,raw,corrected=solve(q);n=len(rs);m=q['referenceMassG'];step=q['resolutionG'];res=q['zeroOffsetG']-b
  row(d.tables[0][i+1],[i+1,m,q['noiseSdG'],q['zeroOffsetG'],step,q['repeats'],q['seed'],n,b,res,q['note']],('prep',i))
  for j,r in enumerate(rs):
   row(d.tables[1][ri],[i+1,j+1,r['x'],r['y'],raw['dev'][j],raw['sq'][j],corrected['dev'][j],corrected['sq'][j],r['rawerr'],r['correrr']],('reading',i,j));ri+=1
   for sub,result in[([q['noiseSdG'],r['z']],r['noise']),([m,q['zeroOffsetG'],r['noise']],r['a']),([step,r['a']],r['x']),([r['x'],b],r['y']),([r['x'],raw['mean']],raw['dev'][j]),([raw['dev'][j]],raw['sq'][j]),([r['y'],corrected['mean']],corrected['dev'][j]),([corrected['dev'][j]],corrected['sq'][j]),([r['x'],m],r['rawerr']),([r['y'],m],r['correrr'])]:work(sub,result)
  for ci,(name,v)in enumerate([('Raw indications',raw),('Zero-corrected',corrected)]):
   row(d.tables[2][1+2*i+ci],[i+1,name,n,v['total'],v['mean'],v['lo'],v['hi'],v['span'],v['ss'],v['var'],v['sd'],v['u'],v['mean']-m],('summary',i,ci))
   xs=[r['x'if ci==0 else'y']for r in rs]
   for sub,result in[([m,1000],m/1000),([step,q['zeroOffsetG']],b),([q['zeroOffsetG'],b],res),(xs,v['total']),([v['total'],n],v['mean']),([v['hi'],v['lo']],v['span']),(v['sq'],v['ss']),([1]if n==1 else[v['ss'],n,1],v['var']),([1]if n==1 else[v['var']],v['sd']),([1]if n==1 else[v['sd'],n],v['u']),([v['mean'],m],v['mean']-m)]:work(sub,result)
 assert wi==len(d.worked),(wi,len(d.worked));assert ri==len(d.tables[1]);assert len(d.tables[0])==1+len(series);assert len(d.tables[2])==1+2*len(series)
 print(f'PASS:{len(series)}series,{ri-1}readings,{checks}independent table/numeric-operand/result checks,{wi}workedblocks.')
if __name__=='__main__':main(sys.argv[1])
