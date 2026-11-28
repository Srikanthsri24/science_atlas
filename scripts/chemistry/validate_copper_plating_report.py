"""Independent complete table/unit/operator/operand/provenance report audit.
Only the floating mass-account residual has an electrode-mass-scaled roundoff
allowance. Tiny positive charge/deposit/thickness use relative checks only."""
import ast,json,re,sys
from pathlib import Path
from decimal import Decimal as D
from validate_water_electrolysis_report import Report as BaseReport
from validate_copper_plating import reference,F,M,RHO
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'water-electrolysis-record-inputs'if k=='id'and v=='copper-plating-record-inputs'else v)for k,v in attrs])
def near(a,b,tol=D('7e-12'),floor=D(0)):
 a,b=D(str(a)),D(str(b));assert abs(a-b)<=max(abs(b)*tol,floor),(str(a),str(b))
def arithmetic(source):
 def ev(n):
  if isinstance(n,ast.Constant):return D(ast.get_source_segment(source,n))
  if isinstance(n,ast.UnaryOp)and isinstance(n.op,ast.USub):return-ev(n.operand)
  if isinstance(n,ast.Call)and isinstance(n.func,ast.Name)and n.func.id in ['min','max']:return(min if n.func.id=='min'else max)(ev(x)for x in n.args)
  if isinstance(n,ast.BinOp):
   a,b=ev(n.left),ev(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  raise AssertionError('Unsupported expression')
 return ev(ast.parse(source,mode='eval').body)
def operands(actual,expected,floor=D(0)):
 def cmp(a,b):
  assert type(a)==type(b),(ast.dump(a),ast.dump(b))
  if isinstance(b,ast.Constant):near(a.value,b.value,D('5e-14'),floor);return
  if isinstance(b,ast.UnaryOp):assert type(a.op)==type(b.op);cmp(a.operand,b.operand);return
  if isinstance(b,ast.Call):assert isinstance(a.func,ast.Name)and a.func.id==b.func.id and len(a.args)==len(b.args);[cmp(x,y)for x,y in zip(a.args,b.args)];return
  assert isinstance(b,ast.BinOp)and type(a.op)==type(b.op);cmp(a.left,b.left);cmp(a.right,b.right)
 cmp(ast.parse(actual,mode='eval').body,ast.parse(expected,mode='eval').body)
HEADERS=[['Trial','Source history: A, s, connection','Configured current (A)','Source switch requested on?','Initial copper anode (g)','Initial cathode (g)','Exposed width (cm)','Exposed height (cm)','Guide seconds or manual','Snapshot status','Student observation'],['Trial','Elapsed physical time (s)','Energized physical time (s)','Requested coulomb budget (C)','Passed charge (C)','Finite anode charge ceiling (C)','Unmet charge demand (C)','Anode exhausted?','Active current now (A)','Bath net copper change (mol)'],['Trial','Initial anode (g)','Final anode (g)','Anode loss (g)','Initial cathode (g)','Final cathode (g)','Cathode gain (g)','Initial electrode total (g)','Final electrode total (g)','Numerical mass-account residual (g)'],['Trial','Exposed area (cm²)','Exposed area (m²)','Copper deposit (mg)','Deposit volume (cm³)','Average film thickness (cm)','Average film thickness (m)','Average film thickness (µm)','Active current density (A/m²)']]
def blocks_expected(q,s):
 out={};put=lambda k,formula,expr,value,unit:out.update({k:(formula,expr,value,unit)})
 put('chargeCeiling','Qlimit = (manodeInitial / MCu) × 2 × F',f"({q['anodeInitialG']} / {M}) * 2 * {F}",s['chargeLimitC'],'C');prior=D(0)
 for i,r in enumerate(q['history']):
  request=D(str(r['currentA']))*D(str(r['durationS']))if r['connected']else D(0);available=max(D(0),s['chargeLimitC']-prior);passed=min(available,request);I=D(str(r['currentA']))
  put('request'+str(i),'Qrequest = connectedFlag × I × duration',f"{int(r['connected'])} * {I} * {r['durationS']}",request,'C')
  put('remaining'+str(i),'Qavailable = max(0, Qlimit - Qprevious)',f"max(0, {s['chargeLimitC']} - {prior})",available,'C')
  put('delivered'+str(i),'Qsegment = min(Qavailable, Qrequest)',f'min({available}, {request})',passed,'C')
  put('activeTime'+str(i),'tactive = Qsegment / I',f'{passed} / {I}'if I else'Not evaluated',passed/I if I else None,'s');prior+=passed
 put('elapsed','telapsed = sum(segment durations)',' + '.join(str(r['durationS'])for r in q['history'])if q['history']else'0',s['elapsedS'],'s')
 put('requested','Qrequested = sum(connectedFlag × I × duration)',' + '.join(f"({int(r['connected'])} * {r['currentA']} * {r['durationS']})"for r in q['history'])if q['history']else'0',s['requestedChargeC'],'C')
 put('passed','Qpassed = min(Qrequested, Qlimit)',f"min({s['requestedChargeC']}, {s['chargeLimitC']})",s['passedChargeC'],'C')
 put('unmet','Qunmet = Qrequested - Qpassed',f"{s['requestedChargeC']} - {s['passedChargeC']}",s['unmetChargeDemandC'],'C')
 put('electronMol','ne = Qpassed / F',f"{s['passedChargeC']} / {F}",s['electronMol'],'mol')
 put('depositMass','mCu = min(manodeInitial, Qpassed × MCu / (2 × F))',f"min({q['anodeInitialG']}, {s['passedChargeC']} * {M} / (2 * {F}))",s['depositMassG'],'g')
 put('copperMol','nCu = mCu / MCu',f"{s['depositMassG']} / {M}",s['copperMol'],'mol')
 put('anodeFinal','manodeFinal = manodeInitial - mCu',f"{q['anodeInitialG']} - {s['depositMassG']}",s['anodeFinalG'],'g')
 put('cathodeFinal','mcathodeFinal = mcathodeInitial + mCu',f"{q['cathodeInitialG']} + {s['depositMassG']}",s['cathodeFinalG'],'g')
 put('initialTotal','minitial = manodeInitial + mcathodeInitial',f"{q['anodeInitialG']} + {q['cathodeInitialG']}",s['initialElectrodeMassG'],'g')
 put('finalTotal','mfinal = manodeFinal + mcathodeFinal',f"{s['anodeFinalG']} + {s['cathodeFinalG']}",s['finalElectrodeMassG'],'g')
 put('residual','residual = mfinal - minitial',f"{s['finalElectrodeMassG']} - {s['initialElectrodeMassG']}",D(0),'g')
 put('area','Acm2 = widthCm × heightCm',f"{q['widthCm']} * {q['heightCm']}",s['areaCm2'],'cm²')
 put('areaSI','Am2 = Acm2 / 10000',f"{s['areaCm2']} / 10000",s['areaM2'],'m²')
 put('volume','Vcm3 = mCu / rhoCu',f"{s['depositMassG']} / {RHO}",s['depositVolumeCm3'],'cm³')
 put('thicknessCm','dcm = Vcm3 / Acm2',f"{s['depositVolumeCm3']} / {s['areaCm2']}",s['thicknessCm'],'cm')
 put('thicknessM','dm = dcm / 100',f"{s['thicknessCm']} / 100",s['thicknessM'],'m')
 put('thicknessMicro','dµm = dcm × 10000',f"{s['thicknessCm']} * 10000",s['thicknessMicrometre'],'µm')
 put('currentDensity','j = Iactive / Am2',f"{s['activeCurrentA']} / {s['areaM2']}",s['currentDensityAm2'],'A/m²')
 return out

def validate(html):
 p=Report();p.feed(html);data=json.loads(p.payload);trials=data['trials'];assert len(p.tables)==4
 for table,headers in zip(p.tables,HEADERS):assert table[0]==headers and len(table)==len(trials)+1 and all(len(row)==len(headers)for row in table)
 count=0
 for i,q in enumerate(trials):
  t=q['guideSeconds']
  if t is None:assert q['guideBase']is None;label='Manual source-history snapshot'
  else:
   assert 0<=t<=150;b=q['guideBase'];assert b is not None
   for k in ['currentA','anodeInitialG','cathodeInitialG','widthCm','heightCm']:assert q[k]==b[k]
   physical=0 if t<=45 else(t-45)*600/70 if t<115 else 600
   assert q['connected']==(b['connected']if 45<t<115 else False);assert len(q['history'])==(1 if physical>0 else 0)
   if physical>0:
    h=q['history'][0];near(h['durationS'],physical,D('5e-14'));assert h['currentA']==b['currentA']and h['connected']==b['connected']
   label='Guided snapshot before verification'if t<140 else'Verified guided reference'
  row=p.tables[0][i+1];assert row[9]==label and row[10]==q['note'];assert row[3]==('Yes'if q['connected']else'No')
  for col,k in [(2,'currentA'),(4,'anodeInitialG'),(5,'cathodeInitialG'),(6,'widthCm'),(7,'heightCm')]:near(row[col],q[k])
  if t is None:assert row[8]=='Manual'
  else:near(row[8],t)
  if not q['history']:assert row[1]=='No source-history segments'
  else:
   entries=row[1].split('; ');assert len(entries)==len(q['history'])
   for text,h in zip(entries,q['history']):
    match=re.fullmatch(r'(.+) A × (.+) s \((connected|disconnected)\)',text);assert match;near(match[1],h['currentA']);near(match[2],h['durationS']);assert match[3]==('connected'if h['connected']else'disconnected')
  s=reference(q);ex=blocks_expected(q,s);blocks=[b for b in p.blocks if b['trial']==i];assert len(blocks)==len(ex)and set(b['key']for b in blocks)==set(ex)
  floor=s['initialElectrodeMassG']*D('1e-15')
  for b in blocks:
   formula,expression,value,unit=ex[b['key']];assert b['formula']==formula;roundoff=floor if b['key']=='residual'else D(0)
   if value is None:assert b['result']=='Unavailable'and b['substitution']=='Not evaluated'
   else:
    num,actualUnit=b['result'].split(' ',1);assert actualUnit==unit;near(num,value,floor=roundoff);near(arithmetic(b['substitution']),value,floor=roundoff);operands(b['substitution'],expression,roundoff)
   count+=1
  for col,k in enumerate(['elapsedS','energizedS','requestedChargeC','passedChargeC','chargeLimitC','unmetChargeDemandC'],1):near(p.tables[1][i+1][col],s[k])
  assert p.tables[1][i+1][7]==('Yes'if s['depleted']else'No');near(p.tables[1][i+1][8],s['activeCurrentA']);near(p.tables[1][i+1][9],0)
  for col,value in enumerate([q['anodeInitialG'],s['anodeFinalG'],s['anodeLossG'],q['cathodeInitialG'],s['cathodeFinalG'],s['cathodeGainG'],s['initialElectrodeMassG'],s['finalElectrodeMassG'],D(0)],1):near(p.tables[2][i+1][col],value,floor=floor if col==9 else D(0))
  for col,k in enumerate(['areaCm2','areaM2','depositMassMg','depositVolumeCm3','thicknessCm','thicknessM','thicknessMicrometre','currentDensityAm2'],1):near(p.tables[3][i+1][col],s[k])
 return dict(observations=len(trials),workedBlocks=count)
if __name__=='__main__':print('PASS',json.dumps(validate(Path(sys.argv[1]if len(sys.argv)>1 else'reports/chemistry-expansion/CL-0122/report-fixture.html').read_text())))
