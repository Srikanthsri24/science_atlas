"""Independent complete report tables, units, operand trees, root/log and provenance."""
import ast,json,sys
from pathlib import Path
from decimal import Decimal as D
from validate_copper_plating_report import Report as BaseReport,near,operands
from validate_oxide_neutral import reference,carbon_reference,K1,K2,KW,MM
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'copper-plating-record-inputs'if k=='id'and v=='oxide-neutral-record-inputs'else v)for k,v in attrs])
def arithmetic(source):
 def ev(n):
  if isinstance(n,ast.Constant):return D(ast.get_source_segment(source,n))
  if isinstance(n,ast.UnaryOp)and isinstance(n.op,ast.USub):return-ev(n.operand)
  if isinstance(n,ast.BinOp):
   a,b=ev(n.left),ev(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  if isinstance(n,ast.Call)and isinstance(n.func,ast.Name):
   args=[ev(a)for a in n.args];name=n.func.id
   if name in ['min','max']:return(min if name=='min'else max)(args)
   if name=='log10':assert len(args)==1;return args[0].log10()
   if name=='rootH':
    assert len(args)==5 and args[2:]==[K1,K2,KW];return carbon_reference(args[0],D(1),args[1])['hMolL']
  raise AssertionError('Unsupported expression')
 return ev(ast.parse(source,mode='eval').body)
HEADERS=[['Trial','Initial CuO (g)','HCl (mol/L)','Acid volume (mL)','CuO contact?','CuO controlled extent fraction','Closed carbon (mmol)','Initial carbon solution (mL)','NaOH stock (mol/L)','NaOH stock volume (mL)','Delivered stock fraction','Guide seconds or manual','Snapshot status','Student observation'],['Trial','Reacted CuO (mol)','CuO remaining (g)','Acid consumed (mol)','Acid remaining (mol)','Dissolved Cu(II) (mol)','Water formed (mol)','Chloride spectator (mol)','Copper total (mol)','Positive charge (mol equivalents)','Negative charge (mol equivalents)','Acid-equivalent concentration (mol/L)','Left pH','Limiting stock / control'],['Trial','Delivered stock (mL)','Stored stock (mL)','Delivered NaOH (mol)','Stored NaOH (mol)','Mixed carbon solution (L)','Total carbon (mol/L)','Sodium (mol/L)','Hydrogen ions (mol/L)','Hydroxide ions (mol/L)','Right reference pH','Right reference pOH','Base equivalents per carbon'],['Trial','CO2* neutral pool (mol)','Bicarbonate (mol)','Carbonate (mol)','Final carbon (mol)','Initial carbon (mol)','Sodium (mol)','Positive charge (mol equivalents)','Negative charge (mol equivalents)','Potential CO2* distribution weight','Potential bicarbonate distribution weight','Potential carbonate distribution weight']]
def expected_blocks(q,s,c):
 out={};h=c['hMolL'];den=h*h+K1*h+K1*K2;remaining=1-D(str(q['baseFraction']))
 def put(key,formula,expr,result,unit):out[key]=(formula,expr,result,unit)
 put('acidVolume','VA = VmL / 1000',f"{q['acidVolumeMl']} / 1000",s['acidVolumeL'],'L')
 put('oxideInitial','nCuO = mCuO / MCuO',f"{q['oxideG']} / {MM}",s['oxideInitialMol'],'mol')
 put('acidInitial','nH = cH × VA',f"{q['acidMolL']} * {s['acidVolumeL']}",s['acidInitialMol'],'mol')
 put('capacity','xmax = min(nCuO, nH / 2)',f"min({s['oxideInitialMol']}, {s['acidInitialMol']} / 2)",s['capacityMol'],'mol')
 put('extent','x = contactFlag × progress × xmax',f"{int(q['contact'])} * {q['reactionProgress']} * {s['capacityMol']}",s['extentMol'],'mol')
 put('oxideLoss','mCuO,dissolved = min(mCuO, x × MCuO)',f"min({q['oxideG']}, {s['extentMol']} * {MM})",s['oxideDissolvedG'],'g')
 put('oxideRemaining','mCuO,remaining = mCuO - mCuO,dissolved',f"{q['oxideG']} - {s['oxideDissolvedG']}",s['oxideRemainingG'],'g')
 put('acidUsed','nH,used = min(nH, 2 × x)',f"min({s['acidInitialMol']}, 2 * {s['extentMol']})",s['acidConsumedMol'],'mol')
 put('acidRemaining','nH,remaining = max(0, nH - nH,used)',f"max(0, {s['acidInitialMol']} - {s['acidConsumedMol']})",s['acidRemainingMol'],'mol')
 put('copperIons','nCu2+ = x',str(s['extentMol']),s['copperIonMol'],'mol');put('waterFormed','nH2O,formed = x',str(s['extentMol']),s['waterFormedMol'],'mol');put('chloride','nCl = nH,initial',str(s['acidInitialMol']),s['chlorideMol'],'mol')
 put('copperTotal','nCu,total = nCuO,remaining + nCu2+',f"{s['oxideRemainingMol']} + {s['copperIonMol']}",s['copperTotalMol'],'mol')
 put('acidPositive','positiveA = nH,remaining + 2 × nCu2+',f"{s['acidRemainingMol']} + 2 * {s['copperIonMol']}",s['acidPositiveChargeMol'],'mol equivalents');put('acidNegative','negativeA = -nCl',f"-{s['chlorideMol']}",s['acidNegativeChargeMol'],'mol equivalents')
 put('acidEquivalentC','cH,equiv = nH,remaining / VA',f"{s['acidRemainingMol']} / {s['acidVolumeL']}",s['acidEquivalentMolL'],'mol/L');put('acidPH','pHA = unavailable without Cu(II) speciation','Not evaluated',None,'1')
 put('carbonInitial','nC = carbonMmol / 1000',f"{q['carbonMmol']} / 1000",s['carbonInitialMol'],'mol')
 put('baseInitial','nB,initial = cB × Vstock / 1000',f"{q['baseMolL']} * {q['baseStockMl']} / 1000",s['baseInitialMol'],'mol')
 put('deliveredVolume','Vdelivered = Vstock × fraction',f"{q['baseStockMl']} * {q['baseFraction']}",s['baseDeliveredMl'],'mL');put('deliveredBase','nB,delivered = nB,initial × fraction',f"{s['baseInitialMol']} * {q['baseFraction']}",s['baseDeliveredMol'],'mol')
 put('remainingFraction','fremaining = 1 - fraction',f"1 - {q['baseFraction']}",remaining,'1');put('storedVolume','Vstored = Vstock × fremaining',f"{q['baseStockMl']} * {remaining}",s['baseStoredMl'],'mL');put('storedBase','nB,stored = nB,initial × fremaining',f"{s['baseInitialMol']} * {remaining}",s['baseStoredMol'],'mol')
 put('mixedVolume','VC = (Vwater + Vdelivered) / 1000',f"({q['waterMl']} + {s['baseDeliveredMl']}) / 1000",s['carbonVolumeL'],'L')
 put('carbonC','CT = nC / VC',f"{s['carbonInitialMol']} / {s['carbonVolumeL']}",c['totalCarbonMolL'],'mol/L');put('sodiumC','Na = nB,delivered / VC',f"{s['baseDeliveredMol']} / {s['carbonVolumeL']}",c['sodiumMolL'],'mol/L')
 put('hydrogenRoot','H + Na = Kw/H + CT × (K1×H + 2×K1×K2) / (H×H + K1×H + K1×K2)',f"H + {c['sodiumMolL']} = {KW} / H + {c['totalCarbonMolL']} * ({K1} * H + 2 * {K1} * {K2}) / (H * H + {K1} * H + {K1} * {K2})",h,'mol/L')
 put('hydroxide','OH = Kw / H',f'{KW} / {h}',c['ohMolL'],'mol/L');put('denominator','D = H×H + K1×H + K1×K2',f'{h} * {h} + {K1} * {h} + {K1} * {K2}',den,'(mol/L)²')
 put('alpha0','a0 = H×H / D',f'{h} * {h} / {den}',c['alpha0'],'1');put('alpha1','a1 = K1×H / D',f'{K1} * {h} / {den}',c['alpha1'],'1');put('alpha2','a2 = K1×K2 / D',f'{K1} * {K2} / {den}',c['alpha2'],'1')
 for key,formula,weight,result in [('neutralPool','nCO2star = CT × a0 × VC','alpha0','neutralPoolMol'),('bicarbonate','nHCO3 = CT × a1 × VC','alpha1','bicarbonateMol'),('carbonate','nCO3 = CT × a2 × VC','alpha2','carbonateMol')]:put(key,formula,f"{c['totalCarbonMolL']} * {c[weight]} * {s['carbonVolumeL']}",c[result],'mol')
 put('carbonTotal','nC,final = nCO2star + nHCO3 + nCO3',f"{c['neutralPoolMol']} + {c['bicarbonateMol']} + {c['carbonateMol']}",c['finalCarbonMol'],'mol')
 put('pH','pH = -log10(H / (1 mol/L))',f'-log10({h})',c['pH'],'1');put('pOH','pOH = -log10(OH / (1 mol/L))',f"-log10({c['ohMolL']})",c['pOH'],'1')
 put('carbonPositive','positiveC = (H + Na) × VC',f"({h} + {c['sodiumMolL']}) * {s['carbonVolumeL']}",c['positiveChargeMol'],'mol equivalents');put('carbonNegative','negativeC = (OH + HCO3 + 2×CO3) × VC',f"({c['ohMolL']} + {c['bicarbonateMolL']} + 2 * {c['carbonateMolL']}) * {s['carbonVolumeL']}",c['negativeChargeMol'],'mol equivalents')
 put('baseEquivalents','r = nB,delivered / nC',f"{s['baseDeliveredMol']} / {s['carbonInitialMol']}"if s['carbonInitialMol']else'Not evaluated',c['baseEquivalentsPerCarbon'],'1');put('waterProduct','Kw,check = H × OH',f"{h} * {c['ohMolL']}",KW,'(mol/L)²');put('fractionSum','sumA = a0 + a1 + a2',f"{c['alpha0']} + {c['alpha1']} + {c['alpha2']}",D(1),'1')
 return out

def validate(html):
 p=Report();p.feed(html);r=json.loads(p.payload);trials=r['trials'];assert len(p.tables)==4
 for table,headers in zip(p.tables,HEADERS):assert table[0]==headers and len(table)==len(trials)+1 and all(len(row)==len(headers)for row in table)
 count=0
 for i,q in enumerate(trials):
  t=q['guideSeconds']
  if t is None:assert q['guideBase']is None;label='Manual paired-station snapshot'
  else:
   assert 0<=t<=150;b=q['guideBase'];assert b is not None
   for key in ['oxideG','acidMolL','acidVolumeMl','carbonMmol','waterMl','baseMolL','baseStockMl']:assert q[key]==b[key]
   prog=0 if t<=45 else(t-45)/60 if t<105 else 1;near(q['reactionProgress'],prog);near(q['baseFraction'],prog);assert q['contact']==(False if t<20 else b['contact']);label='Guided snapshot before verification'if t<140 else'Verified guided reference'
  s,c=reference(q);row=p.tables[0][i+1];near(row[0],i+1);assert row[4]==('Yes'if q['contact']else'No')and row[12]==label and row[13]==q['note']
  for col,key in [(1,'oxideG'),(2,'acidMolL'),(3,'acidVolumeMl'),(5,'reactionProgress'),(6,'carbonMmol'),(7,'waterMl'),(8,'baseMolL'),(9,'baseStockMl'),(10,'baseFraction')]:near(row[col],q[key])
  if t is None:assert row[11]=='Manual'
  else:near(row[11],t)
  fieldsets=[(s,['extentMol','oxideRemainingG','acidConsumedMol','acidRemainingMol','copperIonMol','waterFormedMol','chlorideMol','copperTotalMol','acidPositiveChargeMol','acidNegativeChargeMol','acidEquivalentMolL','acidPH']),({**s,**c},['baseDeliveredMl','baseStoredMl','baseDeliveredMol','baseStoredMol','carbonVolumeL','totalCarbonMolL','sodiumMolL','hMolL','ohMolL','pH','pOH','baseEquivalentsPerCarbon']),({**s,**c},['neutralPoolMol','bicarbonateMol','carbonateMol','finalCarbonMol','carbonInitialMol','sodiumMol','positiveChargeMol','negativeChargeMol','alpha0','alpha1','alpha2'])]
  for table_index,(values,keys)in enumerate(fieldsets,1):
   near(p.tables[table_index][i+1][0],i+1)
   for col,key in enumerate(keys,1):
    if values[key]is None:assert p.tables[table_index][i+1][col]=='Unavailable'
    else:near(p.tables[table_index][i+1][col],values[key])
  assert p.tables[1][i+1][-1]==s['limiting'];expected=expected_blocks(q,s,c);blocks=[b for b in p.blocks if b['trial']==i];assert len(blocks)==44 and set(b['key']for b in blocks)==set(expected)
  for b in blocks:
   formula,expression,value,unit=expected[b['key']];assert b['formula']==formula
   if value is None:assert b['substitution']=='Not evaluated'and b['result']=='Unavailable'
   else:
    number,actual_unit=b['result'].split(' ',1);assert actual_unit==unit;near(number,value)
    if b['key']=='hydrogenRoot':
     # H is the independently checked,12-significant-digit reported root.
     # Compare equation coefficients strictly without rechecking that rounded H
     # against the full-precision reference at the tighter operand tolerance.
     actual_sides=b['substitution'].split(' = ');expected_sides=expression.split(' = ');assert len(actual_sides)==2 and all('H'in side for side in actual_sides)
     for actual_side,expected_side in zip(actual_sides,expected_sides):
      actual_numeric=actual_side.replace('H',f'({number})');expected_numeric=expected_side.replace('H',f'({number})');operands(actual_numeric,expected_numeric);near(arithmetic(actual_numeric),arithmetic(expected_numeric))
     near(arithmetic(actual_sides[0].replace('H',f'({number})')),arithmetic(actual_sides[1].replace('H',f'({number})')))
    else:near(arithmetic(b['substitution']),value);operands(b['substitution'],expression)
   count+=1
 return dict(observations=len(trials),workedBlocks=count)
if __name__=='__main__':print('PASS',json.dumps(validate(Path(sys.argv[1]if len(sys.argv)>1 else'reports/chemistry-expansion/CL-0125/report-fixture.html').read_text())))
