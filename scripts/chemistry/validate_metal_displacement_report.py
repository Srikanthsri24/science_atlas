"""Independent finite-stock report/table/operator/operand/unit/provenance audit."""
import json,re,sys
from pathlib import Path
from decimal import Decimal as D
from validate_copper_plating_report import Report as BaseReport,arithmetic,operands,near
from validate_metal_displacement import reference,METALS
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'copper-plating-record-inputs'if k=='id'and v=='metal-displacement-record-inputs'else v)for k,v in attrs])
HEADERS=[['Trial','Coupon metal','Initial solution cation','Coupon mass (g)','Concentration (mol/L)','Solution volume (mL)','Controlled progress','Contact?','Guide seconds or manual','Snapshot status','Student observation'],['Trial','Selected reaction equation','Order permits displacement?','Potential limiting stock / control','Initial coupon (mol)','Initial target ions (mol)','Maximum selected extent (mol)','Reacted extent (mol)','Electrons transferred (mol)','Target-ion conversion','Original-coupon conversion'],['Trial','Original coupon remaining (g)','Original coupon dissolved (g)','Deposited target metal (g)','Retained solid assembly (g)','Initial relevant-metal mass (g)','Final dissolved-metal mass (g)','Final relevant-metal mass (g)','Numerical mass-account residual (g)'],['Trial','Element','Initial solid (mol)','Initial bath (mol)','Final solid (mol)','Final bath (mol)','Initial total (mol)','Final total (mol)','Final bath concentration (mol/L)']]
def expected_blocks(q,s,species):
 a=METALS[q['coupon']][0];b=METALS[q['solution']][0];out={}
 def put(k,formula,expression,value,unit):out[k]=(formula,expression,value,unit)
 put('volume','VL = VmL / 1000',f"{q['volumeMl']} / 1000",s['volumeL'],'L')
 put('couponInitial','nA = mA / MA',f"{q['couponMassG']} / {a}",s['couponInitialMol'],'mol')
 put('targetInitial','nB = cB × VL',f"{q['concentrationMolL']} * {s['volumeL']}",s['targetInitialMol'],'mol')
 put('capacity','xmax = allowedFlag × min(nA, nB)',f"{int(s['eligible'])} * min({s['couponInitialMol']}, {s['targetInitialMol']})",s['capacityMol'],'mol')
 put('extent','x = contactFlag × progress × xmax',f"{int(q['contact'])} * {q['progress']} * {s['capacityMol']}",s['extentMol'],'mol')
 put('couponLoss','mA,dissolved = min(mA, x × MA)',f"min({q['couponMassG']}, {s['extentMol']} * {a})",s['couponDissolvedG'],'g')
 put('couponRemaining','mA,remaining = mA - mA,dissolved',f"{q['couponMassG']} - {s['couponDissolvedG']}",s['couponRemainingG'],'g')
 put('deposit','mB,deposit = x × MB',f"{s['extentMol']} * {b}",s['depositMassG'],'g')
 put('assembly','msolid = mA,remaining + mB,deposit',f"{s['couponRemainingG']} + {s['depositMassG']}",s['solidAssemblyG'],'g')
 put('targetRemaining','nB,remaining = max(0, nB - x)',f"max(0, {s['targetInitialMol']} - {s['extentMol']})",s['targetRemainingMol'],'mol')
 put('electrons','ne = 2 × x',f"2 * {s['extentMol']}",s['electronTransferMol'],'mol')
 put('targetConversion','fB = x / nB',f"{s['extentMol']} / {s['targetInitialMol']}"if s['targetInitialMol']else'Not evaluated',s['targetConversion'],'1')
 put('couponConversion','fA = x / nA',f"{s['extentMol']} / {s['couponInitialMol']}"if s['couponInitialMol']else'Not evaluated',s['couponConversion'],'1')
 put('sulfate','nSO4 = nB,initial',str(s['targetInitialMol']),s['sulfateMol'],'mol')
 put('initialCharge','positiveEq = 2 × nB,initial',f"2 * {s['targetInitialMol']}",s['initialCationChargeEqMol'],'mol charge equivalents')
 put('finalCharge','positiveEqFinal = 2 × sum(finalBathMol)','2 * ('+' + '.join(str(x['finalBathMol'])for x in species)+')',s['finalCationChargeEqMol'],'mol charge equivalents')
 put('sulfateCharge','negativeEq = -2 × nSO4',f"-2 * {s['sulfateMol']}",s['sulfateChargeEqMol'],'mol charge equivalents')
 put('initialMetalMass','minitial = mA + nB × MB',f"{q['couponMassG']} + {s['targetInitialMol']} * {b}",s['initialRelevantMetalMassG'],'g')
 put('bathMetalMass','mbath = sum(finalBathMol × elementMolarMass)',' + '.join(f"({x['finalBathMol']} * {METALS[x['id']][0]})"for x in species),s['finalBathMetalMassG'],'g')
 put('finalMetalMass','mfinal = msolid + mbath',f"{s['solidAssemblyG']} + {s['finalBathMetalMassG']}",s['finalRelevantMetalMassG'],'g')
 put('massResidual','residual = mfinal - minitial',f"{s['finalRelevantMetalMassG']} - {s['initialRelevantMetalMassG']}",D(0),'g')
 for x in species:
  put(x['id']+'Initial','ninitial = initialSolid + initialBath',f"{x['initialSolidMol']} + {x['initialBathMol']}",x['initialTotalMol'],'mol')
  put(x['id']+'Final','nfinal = finalSolid + finalBath',f"{x['finalSolidMol']} + {x['finalBathMol']}",x['finalTotalMol'],'mol')
  put(x['id']+'Concentration','cfinal = finalBath / VL',f"{x['finalBathMol']} / {s['volumeL']}",x['finalConcentrationMolL'],'mol/L')
 return out

def validate(html):
 p=Report();p.feed(html);data=json.loads(p.payload);trials=data['trials'];assert len(p.tables)==4
 for i,(table,headers)in enumerate(zip(p.tables,HEADERS)):assert table[0]==headers and len(table)==len(trials)*(3 if i==3 else 1)+1 and all(len(row)==len(headers)for row in table)
 count=0
 for i,q in enumerate(trials):
  t=q['guideSeconds']
  if t is None:assert q['guideBase']is None;label='Manual controlled-extent snapshot'
  else:
   assert 0<=t<=150;b=q['guideBase'];assert b is not None
   for k in ['coupon','solution','couponMassG','concentrationMolL','volumeMl']:assert q[k]==b[k]
   near(q['progress'],0 if t<=45 else(t-45)/60 if t<105 else 1);assert q['contact']==(False if t<20 else b['contact']);label='Guided snapshot before verification'if t<140 else'Verified guided reference'
  row=p.tables[0][i+1];assert row[1:3]==[q['coupon'],q['solution']];assert row[7]==('Yes'if q['contact']else'No');assert row[9]==label and row[10]==q['note']
  for col,k in [(3,'couponMassG'),(4,'concentrationMolL'),(5,'volumeMl'),(6,'progress')]:near(row[col],q[k])
  if t is None:assert row[8]=='Manual'
  else:near(row[8],t)
  s,species=reference(q);expected=expected_blocks(q,s,species);blocks=[b for b in p.blocks if b['trial']==i];assert len(blocks)==30 and set(b['key']for b in blocks)==set(expected)
  floor=s['initialRelevantMetalMassG']*D('1e-15')
  for b in blocks:
   formula,expression,value,unit=expected[b['key']];assert b['formula']==formula;roundoff=floor if b['key']=='massResidual'else D(0)
   if value is None:assert b['substitution']=='Not evaluated'and b['result']=='Unavailable'
   else:
    number,actualUnit=b['result'].split(' ',1);assert actualUnit==unit;near(number,value,floor=roundoff);near(arithmetic(b['substitution']),value,floor=roundoff);operands(b['substitution'],expression,roundoff)
   count+=1
  equation=f"{q['coupon']}(s) + {q['solution']}2+(aq) → {q['coupon']}2+(aq) + {q['solution']}(s)"if s['eligible']else'No net selected metal-displacement reaction'
  assert p.tables[1][i+1][1:4]==[equation,'Yes'if s['eligible']else'No',s['limiting']]
  for col,k in enumerate(['couponInitialMol','targetInitialMol','capacityMol','extentMol','electronTransferMol','targetConversion','couponConversion'],4):
   if s[k]is None:assert p.tables[1][i+1][col]=='Unavailable'
   else:near(p.tables[1][i+1][col],s[k])
  for col,k in enumerate(['couponRemainingG','couponDissolvedG','depositMassG','solidAssemblyG','initialRelevantMetalMassG','finalBathMetalMassG','finalRelevantMetalMassG'],1):near(p.tables[2][i+1][col],s[k])
  near(p.tables[2][i+1][8],0,floor=floor)
  for j,x in enumerate(species):
   row=p.tables[3][1+i*3+j];assert row[1]==x['id'];near(row[0],i+1)
   for col,k in enumerate(['initialSolidMol','initialBathMol','finalSolidMol','finalBathMol','initialTotalMol','finalTotalMol','finalConcentrationMolL'],2):near(row[col],x[k])
 return dict(observations=len(trials),workedBlocks=count,elementRows=len(trials)*3)
if __name__=='__main__':print('PASS',json.dumps(validate(Path(sys.argv[1]if len(sys.argv)>1 else'reports/chemistry-expansion/CL-0123/report-fixture.html').read_text())))
