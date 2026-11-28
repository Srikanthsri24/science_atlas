"""Independent report table/unit/operator/operand/provenance auditor."""
import json,sys
from pathlib import Path
from decimal import Decimal as D
from validate_copper_plating_report import Report as BaseReport,arithmetic,operands,near
from validate_metal_acid import reference,M,R
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'copper-plating-record-inputs'if k=='id'and v=='metal-acid-record-inputs'else v)for k,v in attrs])
HEADERS=[['Trial','Metal','Initial metal (g)','HCl concentration (mol/L)','Solution volume (mL)','Controlled progress','Contact?','Guide seconds or manual','Snapshot status','Student observation'],['Trial','Selected reaction','Limiting stock / control','Initial metal (mol)','Initial acid (mol)','Maximum extent (mol)','Reacted extent (mol)','Metal remaining (g)','Acid consumed (mol)','Acid remaining (mol)','Dissolved metal ions (mol)'],['Trial','Collection temperature (K)','Collection pressure (Pa)','Collector capacity (mL)','Generated dry gas (m3)','Generated dry gas (mL)','Retained dry gas (mL)','Relief overflow dry gas (mL)','Retained hydrogen (mol)','Overflow hydrogen (mol)','Transferred electrons (mol)'],['Trial','Initial metal atoms (mol)','Final metal atoms (mol)','Initial acid hydrogen atoms (mol)','Final accounted hydrogen atoms (mol)','Initial chlorine atoms (mol)','Final chlorine atoms (mol)','Positive charge (mol equivalents)','Negative charge (mol equivalents)','Metal conversion','Acid conversion']]
def expected_blocks(q,s):
 out={};n=s['metalInitialMol'];a=s['acidInitialMol'];x=s['extentMol'];mass=q['massG'];mm=M[q['metal']];temp=s['temperatureK'];pressure=s['pressurePa'];gas=s['generatedMl'];retained=s['retainedMl'];cap=q['collectorMl']
 def put(k,f,e,v,u):out[k]=(f,e,v,u)
 put('volume','VL = VmL / 1000',f"{q['volumeMl']} / 1000",s['volumeL'],'L')
 put('metalInitial','nM = m / M',f'{mass} / {mm}',n,'mol')
 put('acidInitial','nH = cH × VL',f"{q['acidMolL']} * {s['volumeL']}",a,'mol')
 put('acidCapacity','xH = nH / 2',f'{a} / 2',a/2,'mol')
 put('capacity','xmax = allowedFlag × min(nM, nH / 2)',f"{int(q['metal']!='Cu')} * min({n}, {a} / 2)",s['capacityMol'],'mol')
 put('extent','x = contactFlag × progress × xmax',f"{int(q['contact'])} * {q['progress']} * {s['capacityMol']}",x,'mol')
 put('metalLoss','mdissolved = min(m, x × M)',f'min({mass}, {x} * {mm})',s['metalDissolvedG'],'g')
 put('metalRemaining','mremaining = m - mdissolved',f"{mass} - {s['metalDissolvedG']}",s['metalRemainingG'],'g')
 put('acidUsed','nH,used = min(nH, 2 × x)',f'min({a}, 2 * {x})',s['acidConsumedMol'],'mol')
 put('acidRemaining','nH,remaining = max(0, nH - nH,used)',f"max(0, {a} - {s['acidConsumedMol']})",s['acidRemainingMol'],'mol')
 put('metalIons','nM2+ = x',str(x),x,'mol');put('hydrogen','nH2 = x',str(x),x,'mol');put('electrons','ne = 2 × x',f'2 * {x}',2*x,'mol')
 put('temperature','TK = TC + 273.15',f"{q['temperatureC']} + 273.15",temp,'K');put('pressure','PPa = PkPa × 1000',f"{q['pressureKPa']} * 1000",pressure,'Pa')
 put('gasM3','Vm3 = nH2 × R × TK / PPa',f'{x} * {R} * {temp} / {pressure}',s['generatedM3'],'m3')
 put('gasMl','Vml = Vm3 × 1000000',f"{s['generatedM3']} * 1000000",gas,'mL')
 put('retainedMl','Vretained = min(Vml, Vcapacity)',f'min({gas}, {cap})',retained,'mL')
 put('overflowMl','Voverflow = max(0, Vml - Vcapacity)',f'max(0, {gas} - {cap})',s['overflowMl'],'mL')
 put('retainedMol','nretained = Vretained / 1000000 × PPa / (R × TK)',f'{retained} / 1000000 * {pressure} / ({R} * {temp})',s['retainedMol'],'mol')
 put('overflowMol','noverflow = max(0, nH2 - nretained)',f"max(0, {x} - {s['retainedMol']})",s['overflowMol'],'mol')
 put('metalConversion','fM = x / nM',f'{x} / {n}'if n else'Not evaluated',s['metalConversion'],'1');put('acidConversion','fH = nH,used / nH',f"{s['acidConsumedMol']} / {a}"if a else'Not evaluated',s['acidConversion'],'1')
 put('chloride','nCl = nH,initial',str(a),a,'mol');put('positiveCharge','positiveEq = nH,remaining + 2 × nM2+',f"{s['acidRemainingMol']} + 2 * {x}",s['positiveChargeEqMol'],'mol equivalents');put('negativeCharge','negativeEq = -nCl',f'-{a}',-a,'mol equivalents')
 put('metalAtomsInitial','nM,initial = nM',str(n),n,'mol');put('metalAtomsFinal','nM,final = nM,remaining + nM2+',f"{s['metalRemainingMol']} + {x}",s['metalFinalTotalMol'],'mol')
 put('hydrogenAtomsInitial','nH,initial = nH',str(a),a,'mol');put('hydrogenAtomsFinal','nH,final = nH,remaining + 2 × nH2',f"{s['acidRemainingMol']} + 2 * {x}",s['hydrogenFinalAtomMol'],'mol')
 put('chlorineAtomsInitial','nCl,initial = nH',str(a),a,'mol');put('chlorineAtomsFinal','nCl,final = nCl',str(a),a,'mol')
 return out

def validate(html):
 p=Report();p.feed(html);data=json.loads(p.payload);trials=data['trials'];assert len(p.tables)==4
 for table,headers in zip(p.tables,HEADERS):assert table[0]==headers and len(table)==len(trials)+1 and all(len(row)==len(headers)for row in table)
 count=0
 for i,q in enumerate(trials):
  t=q['guideSeconds']
  if t is None:assert q['guideBase']is None;label='Manual controlled-extent snapshot'
  else:
   assert 0<=t<=150;b=q['guideBase'];assert b is not None
   for k in ['metal','massG','acidMolL','volumeMl','temperatureC','pressureKPa','collectorMl']:assert q[k]==b[k]
   near(q['progress'],0 if t<=45 else(t-45)/60 if t<105 else 1);assert q['contact']==(False if t<20 else b['contact']);label='Guided snapshot before verification'if t<140 else'Verified guided reference'
  s=reference(q);row=p.tables[0][i+1];assert row[1]==q['metal']and row[6]==('Yes'if q['contact']else'No')and row[8]==label and row[9]==q['note'];near(row[0],i+1)
  for col,key in [(2,'massG'),(3,'acidMolL'),(4,'volumeMl'),(5,'progress')]:near(row[col],q[key])
  if t is None:assert row[7]=='Manual'
  else:near(row[7],t)
  assert p.tables[1][i+1][1:3]==[s['equation'],s['limiting']]
  fields=[(['metalInitialMol','acidInitialMol','capacityMol','extentMol','metalRemainingG','acidConsumedMol','acidRemainingMol','metalIonMol'],3),(['temperatureK','pressurePa','collectorMl','generatedM3','generatedMl','retainedMl','overflowMl','retainedMol','overflowMol','electronTransferMol'],1),(['metalInitialTotalMol','metalFinalTotalMol','hydrogenInitialAtomMol','hydrogenFinalAtomMol','chlorineInitialAtomMol','chlorineFinalAtomMol','positiveChargeEqMol','negativeChargeEqMol','metalConversion','acidConversion'],1)]
  for table_index,(keys,start)in enumerate(fields,1):
   near(p.tables[table_index][i+1][0],i+1)
   for col,key in enumerate(keys,start):
    value=q[key]if key=='collectorMl'else s[key]
    if value is None:assert p.tables[table_index][i+1][col]=='Unavailable'
    else:near(p.tables[table_index][i+1][col],value)
  expected=expected_blocks(q,s);blocks=[b for b in p.blocks if b['trial']==i];assert len(blocks)==32 and set(b['key']for b in blocks)==set(expected)
  for b in blocks:
   formula,expression,value,unit=expected[b['key']];assert b['formula']==formula
   if value is None:assert b['substitution']=='Not evaluated'and b['result']=='Unavailable'
   else:
    number,actual_unit=b['result'].split(' ',1);assert actual_unit==unit;near(number,value);near(arithmetic(b['substitution']),value);operands(b['substitution'],expression)
   count+=1
 return dict(observations=len(trials),workedBlocks=count)
if __name__=='__main__':print('PASS',json.dumps(validate(Path(sys.argv[1]if len(sys.argv)>1 else'reports/chemistry-expansion/CL-0124/report-fixture.html').read_text())))
