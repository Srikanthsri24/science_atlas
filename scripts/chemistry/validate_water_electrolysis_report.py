"""Independent complete-table/formula/operand/unit/history/provenance audit."""
import ast,json,re,sys
from pathlib import Path
from decimal import Decimal as D
from validate_ionic_phase_report import Report as BaseReport
from validate_water_electrolysis import reference,F,R
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'ionic-phase-record-inputs'if k=='id'and v=='water-electrolysis-record-inputs'else v)for k,v in attrs])
def near(a,b,tol=D('6e-12')):
 a,b=D(str(a)),D(str(b));assert abs(a-b)<=abs(b)*tol,(str(a),str(b))
def arithmetic(source):
 def ev(n):
  if isinstance(n,ast.Constant):return D(ast.get_source_segment(source,n))
  if isinstance(n,ast.UnaryOp)and isinstance(n.op,ast.USub):return-ev(n.operand)
  if isinstance(n,ast.Call)and isinstance(n.func,ast.Name)and n.func.id=='min':return min(ev(x)for x in n.args)
  if isinstance(n,ast.BinOp):
   a,b=ev(n.left),ev(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  raise AssertionError('Unexpected expression')
 return ev(ast.parse(source,mode='eval').body)
def operands(actual,expected):
 def cmp(a,b):
  assert type(a)==type(b),(ast.dump(a),ast.dump(b))
  if isinstance(b,ast.Constant):near(a.value,b.value,D('4e-14'));return
  if isinstance(b,ast.UnaryOp):assert type(a.op)==type(b.op);cmp(a.operand,b.operand);return
  if isinstance(b,ast.Call):assert isinstance(a.func,ast.Name)and a.func.id==b.func.id=='min'and len(a.args)==len(b.args);[cmp(x,y)for x,y in zip(a.args,b.args)];return
  assert isinstance(b,ast.BinOp)and type(a.op)==type(b.op);cmp(a.left,b.left);cmp(a.right,b.right)
 cmp(ast.parse(actual,mode='eval').body,ast.parse(expected,mode='eval').body)
HEADERS=[['Trial','Source history: A, s, connection','Configured current (A)','Source connected now?','Gas temperature (°C)','Common dry-gas pressure (kPa)','Each tube capacity (mL)','Guide seconds or manual','Snapshot status','Student observation'],['Trial','Elapsed physical time (s)','Passed charge (C)','Electron amount (mol)','H2 generated (mol)','O2 generated (mol)','Water consumed (mol)','Active current now (A)'],['Trial','H2 dry-equivalent generated (mL)','H2 retained (mL)','H2 overflow (mL)','O2 dry-equivalent generated (mL)','O2 retained (mL)','O2 overflow (mL)','Generated H2/O2 volume ratio','Retained H2/O2 volume ratio'],['Trial','Temperature (K)','Pressure (Pa)','H2 compartment fill fraction','O2 compartment fill fraction','Gas-volume interpretation']]
def expected_blocks(q,s):
 hist=q['history'];out={}
 def add(k,formula,expr,value,unit):out[k]=(formula,expr,value,unit)
 add('elapsed','t = sum(segment durations)',' + '.join(str(h['durationS'])for h in hist)if hist else'0',s['elapsedS'],'s')
 for i,h in enumerate(hist):add('segment'+str(i),'Qsegment = connectedFlag × I × duration',f"{int(h['connected'])} * {h['currentA']} * {h['durationS']}",D(str(h['currentA']))*D(str(h['durationS']))if h['connected']else D(0),'C')
 add('charge','Q = sum(connectedFlag × I × duration)',' + '.join(f"({int(h['connected'])} * {h['currentA']} * {h['durationS']})"for h in hist)if hist else'0',s['chargeC'],'C')
 add('electrons','ne = Q / F',f"{s['chargeC']} / {F}",s['electronMoles'],'mol')
 add('hydrogen','nH2 = Q / (2 × F)',f"{s['chargeC']} / (2 * {F})",s['hydrogenMol'],'mol')
 add('oxygen','nO2 = Q / (4 × F)',f"{s['chargeC']} / (4 * {F})",s['oxygenMol'],'mol')
 add('water','nH2O = 2 × nO2',f"2 * {s['oxygenMol']}",s['waterConsumedMol'],'mol')
 add('temperature','T = temperatureC + 273.15',f"{q['temperatureC']} + 273.15",s['temperatureK'],'K')
 add('pressure','P = pressureKPa × 1000',f"{q['pressureKPa']} * 1000",s['pressurePa'],'Pa')
 cap=q['capacityMl']
 for gas,prefix,mol in [('H2','hydrogen','hydrogenMol'),('O2','oxygen','oxygenMol')]:
  v=s[prefix+'GeneratedMl'];ret=s[prefix+'RetainedMl'];overflow=s[prefix+'OverflowMl']
  add(gas+'volume','VmL = n × R × T / P × 1000000',f"{s[mol]} * {R} * {s['temperatureK']} / {s['pressurePa']} * 1000000",v,'mL')
  add(gas+'retained','Vretained = min(capacity, Vgenerated)',f'min({cap}, {v})',ret,'mL')
  add(gas+'overflow','Voverflow = Vgenerated - Vretained',f'{v} - {ret}',overflow,'mL')
  add(gas+'balance','Vgenerated = Vretained + Voverflow',f'{ret} + {overflow}',v,'mL')
  add(gas+'fill','fill = Vretained / capacity',f'{ret} / {cap}',ret/D(str(cap)),'1')
 add('generatedRatio','ratioGenerated = VH2generated / VO2generated',f"{s['hydrogenGeneratedMl']} / {s['oxygenGeneratedMl']}"if s['generatedVolumeRatio']is not None else'Not evaluated',s['generatedVolumeRatio'],'1')
 add('retainedRatio','ratioRetained = VH2retained / VO2retained',f"{s['hydrogenRetainedMl']} / {s['oxygenRetainedMl']}"if s['retainedVolumeRatio']is not None else'Not evaluated',s['retainedVolumeRatio'],'1')
 return out

def validate(html):
 p=Report();p.feed(html);data=json.loads(p.payload);trials=data['trials'];assert len(p.tables)==4
 for t,h in zip(p.tables,HEADERS):assert t[0]==h and len(t)==len(trials)+1 and all(len(row)==len(h)for row in t)
 count=0
 for i,q in enumerate(trials):
  t=q['guideSeconds']
  if t is None:assert q['guideBase']is None;label='Manual source-history snapshot'
  else:
   assert 0<=t<=150;b=q['guideBase'];assert b is not None;physical=0 if t<=20 else (t-20)*600/90 if t<110 else 600
   for k in ['currentA','temperatureC','pressureKPa','capacityMl']:assert q[k]==b[k]
   assert q['connected']==(b['connected']if 20<t<110 else False)
   assert len(q['history'])==(1 if physical>0 else 0)
   if physical>0:
    h=q['history'][0];near(h['durationS'],physical,D('4e-14'));assert h['currentA']==b['currentA']and h['connected']==b['connected']
   label='Guided snapshot before verification'if t<140 else'Verified guided reference'
  row=p.tables[0][i+1];assert row[8]==label and row[9]==q['note'];assert row[3]==('Yes'if q['connected']else'No')
  for col,k in [(2,'currentA'),(4,'temperatureC'),(5,'pressureKPa'),(6,'capacityMl')]:near(row[col],q[k])
  if t is None:assert row[7]=='Manual'
  else:near(row[7],t)
  if not q['history']:assert row[1]=='No passed-time segments'
  else:
   entries=row[1].split('; ');assert len(entries)==len(q['history'])
   for text,h in zip(entries,q['history']):
    match=re.fullmatch(r'(.+) A × (.+) s \((connected|disconnected)\)',text);assert match;near(match[1],h['currentA']);near(match[2],h['durationS']);assert match[3]==('connected'if h['connected']else'disconnected')
  assert p.tables[3][i+1][5]=='Compensated dry-equivalent volumes at common T/P; not raw wet-gas meniscus measurements.'
  s=reference(q);expected=expected_blocks(q,s);blocks=[b for b in p.blocks if b['trial']==i];assert len(blocks)==len(expected)and set(b['key']for b in blocks)==set(expected)
  for b in blocks:
   formula,expression,value,unit=expected[b['key']];assert b['formula']==formula
   if value is None:assert b['result']=='Unavailable'and b['substitution']=='Not evaluated'
   else:
    number,actualUnit=b['result'].split(' ',1);assert actualUnit==unit;near(number,value);near(arithmetic(b['substitution']),value);operands(b['substitution'],expression)
   count+=1
  keys=[['elapsedS','chargeC','electronMoles','hydrogenMol','oxygenMol','waterConsumedMol','activeCurrentA'],['hydrogenGeneratedMl','hydrogenRetainedMl','hydrogenOverflowMl','oxygenGeneratedMl','oxygenRetainedMl','oxygenOverflowMl','generatedVolumeRatio','retainedVolumeRatio'],['temperatureK','pressurePa','hydrogenFillFraction','oxygenFillFraction']]
  for table,ks in zip(p.tables[1:],keys):
   for col,k in enumerate(ks,1):
    if s[k]is None:assert table[i+1][col]=='Unavailable'
    else:near(table[i+1][col],s[k])
 return dict(observations=len(trials),workedBlocks=count)
if __name__=='__main__':print('PASS',json.dumps(validate(Path(sys.argv[1]if len(sys.argv)>1 else 'reports/chemistry-expansion/CL-0121/report-fixture.html').read_text())))
