"""Independent CL-0098 HTML observations and worked operands/results.
Uses a separate50-digit Decimal species-vector solver;no application imports.
"""
import json,re,sys
from html.parser import HTMLParser
from limewater_reference import solve,D,MASS,KEYS
class Document(HTMLParser):
 def __init__(self):super().__init__();self.tables=[];self.table=None;self.row=None;self.cell=None;self.part=None;self.p=None;self.sub=None;self.work=[];self.in_json=False;self.json_text=''
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.table=[];self.tables.append(self.table)
  if tag=='tr':self.row=[]
  if tag in ('td','th'):self.cell=''
  if tag=='p':self.part=a.get('class');self.p=''
  if tag=='script'and a.get('id')=='limewater-record-inputs':self.in_json=True
 def handle_data(self,s):
  if self.cell is not None:self.cell+=s
  if self.p is not None:self.p+=s
  if self.in_json:self.json_text+=s
 def handle_endtag(self,tag):
  if tag in ('td','th'):self.row.append(self.cell);self.cell=None
  if tag=='tr'and self.table is not None:self.table.append(self.row)
  if tag=='table':self.table=None
  if tag=='script':self.in_json=False
  if tag=='p':
   if self.part=='substitution':self.sub=self.p
   if self.part=='result':self.work.append((self.sub,self.p))
   self.part=None;self.p=None
TABLES=[['carbonateInitialMol','hclInitialMol','maximumReactionMol','reactedMol','carbonateRemainingMol','hclRemainingMol','sourceCalciumChlorideMol','sourceWaterG','sourceLiquidG','sourceSolidG','sourceLiquidMl','sourceSolidMl','sourceFillMl','sourceMassResidualG'],['generatedMol','transferredMol','syringeMol','generatedMl','transferredMl','syringeMl','consumedCo2Mol','bypassMol','bypassMl','gasResidualMol'],['limeInitialMol','precipitatedMol','redissolvedMol','limeRemainingMol','precipitateMol','bicarbonateMol','receiverInitialWaterG','receiverWaterG','receiverSolidG','receiverLiquidG','receiverLiquidMl','receiverSolidMl','receiverFillMl','receiverMassResidualG','category','carbonateThresholdFraction','clearingThresholdFraction','peakReachable','clearingReachable'],['initialTotalG','finalTotalG','massResidualG','calciumResidualMol','carbonResidualMol','chlorineResidualMol','hydrogenResidualMol','oxygenResidualMol']]
def numbers(s):return[D(x)for x in re.findall(r'(?<![A-Za-z0-9.])[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?',s.replace('−','-'))]
def works(raw,s):
 m,va,ca,vl,cl,fr,ft=[D(raw[k])for k in KEYS];mc=MASS['carbonate'];ma=MASS['acid'];mw=MASS['water'];ms=MASS['chloride'];ml=MASS['lime'];mb=MASS['bicarbonate'];mg=MASS['gas'];R=D('8.314462618');T=D('298.15');P=D('101.325');density=D('2.71')
 nc=s['carbonateInitialMol'];na=s['hclInitialMol'];mx=s['maximumReactionMol'];r=s['reactedMol'];ncLeft=s['carbonateRemainingMol'];naLeft=s['hclRemainingMol'];Dgas=s['transferredMol'];stored=s['syringeMol'];L=s['limeInitialMol'];x=s['precipitatedMol'];y=s['redissolvedMol'];ll=s['limeRemainingMol'];solid=s['precipitateMol'];B=s['bicarbonateMol'];used=s['consumedCo2Mol'];by=s['bypassMol'];sl=s['sourceLiquidG'];ss=s['sourceSolidG'];rl=s['receiverLiquidG'];rs=s['receiverSolidG'];ws=s['sourceWaterG'];wr=s['receiverWaterG'];wa=(s['sourceInitialWaterG']+s['receiverInitialWaterG'])/mw
 w=lambda key,operands:(operands,s[key])
 return[w('carbonateInitialMol',[m,mc]),w('hclInitialMol',[ca,va,1000]),w('maximumReactionMol',[nc,na,2]),w('reactedMol',[mx,fr]),w('carbonateRemainingMol',[nc,r]),w('hclRemainingMol',[na,2,r]),w('sourceInitialWaterG',[1,va,na,ma]),w('sourceWaterG',[s['sourceInitialWaterG'],r,mw]),([r,ms],r*ms),w('sourceLiquidG',[ws,naLeft,ma,r,ms]),w('sourceSolidG',[ncLeft,mc]),w('transferredMol',[mx,ft]),w('syringeMol',[r,Dgas]),w('generatedMl',[r,R,T,P,1000]),w('syringeMl',[stored,R,T,P,1000]),w('transferredMl',[Dgas,R,T,P,1000]),w('limeInitialMol',[cl,vl,1000]),w('precipitatedMol',[Dgas,L]),w('redissolvedMol',[Dgas,L,0,L]),w('limeRemainingMol',[L,x]),w('precipitateMol',[x,y]),w('bicarbonateMol',[y]),w('consumedCo2Mol',[x,y]),w('bypassMol',[Dgas,used,0]),w('bypassMl',[by,R,T,P,1000]),w('receiverInitialWaterG',[1,vl,L,ml]),w('receiverWaterG',[s['receiverInitialWaterG'],x,y,mw]),w('receiverSolidG',[solid,mc]),w('receiverLiquidG',[wr,ll,ml,B,mb]),w('sourceFillMl',[sl,1,ss,density]),w('receiverFillMl',[rl,1,rs,density]),w('initialTotalG',[m,va,vl,1]),w('finalTotalG',[sl,ss,stored,by,mg,rl,rs]),w('massResidualG',[s['initialTotalG'],s['finalTotalG']]),w('sourceMassResidualG',[m,va,1,sl,ss,r,mg]),w('receiverMassResidualG',[vl,1,used,mg,rl,rs]),w('gasResidualMol',[r,stored,used,by]),w('calciumResidualMol',[nc,L,ncLeft,r,ll,solid,B]),w('carbonResidualMol',[nc,ncLeft,stored,by,solid,2,B]),w('chlorineResidualMol',[na,naLeft,2,r]),w('hydrogenResidualMol',[na,2,wa,2,L,naLeft,2,ws/mw,2,ll,2,B,2,wr/mw]),w('oxygenResidualMol',[3,nc,wa,2,L,3,ncLeft,ws/mw,2,stored,by,2,ll,3,solid,6,B,wr/mw]),w('carbonateThresholdFraction',[]if mx==0 else[L,mx]),w('clearingThresholdFraction',[]if mx==0 else[2,L,mx])]
def main(path):
 d=Document();d.feed(open(path).read());r=json.loads(d.json_text);trials=r['trials'];assert 0<=len(trials)<=40;assert len(d.tables)==5;checks=0;wi=0
 def close(actual,expected):
  nonlocal checks
  checks+=1;a=D(actual);e=D(expected);assert a.is_finite()and abs(a-e)<=max(D('2e-13'),abs(e)*D('5e-11')),(a,e)
 for i,q in enumerate(trials):
  s=solve(q);row=d.tables[0][i+1];assert len(row)==9 and row[0]==str(i+1)and row[-1]==q['note'];checks+=2
  for a,k in zip(row[1:8],KEYS):close(a,q[k])
  for table,keys in zip(d.tables[1:],TABLES):
   row=table[i+1];assert len(row)==len(keys)+1 and row[0]==str(i+1);checks+=1
   for a,k in zip(row[1:],keys):
    e=s[k]
    if e is None:assert a=='Not defined';checks+=1
    elif isinstance(e,bool):assert a==('Yes'if e else'No');checks+=1
    elif isinstance(e,str):assert a==e;checks+=1
    else:close(a,e)
  expected=works(q,s);assert len(expected)==44
  for operands,result in expected:
   sub,res=d.work[wi];wi+=1;ns=numbers(sub);assert len(ns)==len(operands),(i,wi,sub,operands)
   for a,e in zip(ns,operands):close(a,e)
   if result is None:assert res=='Not defined: no maximum generatable gas.';checks+=1
   else:
    ns=numbers(res);assert len(ns)==1,(res,ns);close(ns[0],result)
 assert all(len(t)==len(trials)+1 for t in d.tables)
 assert wi==len(d.work)==44*len(trials)
 print(f'PASS:{len(trials)}trials,{checks}independent table/numeric-operand/result checks,{wi}workedblocks.')
if __name__=='__main__':main(sys.argv[1])
