"""Input-only independent CL-0110 report/table/expression verification."""
import ast,json,re,sys
from pathlib import Path
from decimal import Decimal as D,getcontext
from validate_soap_detergent import cell,CA,MG,NA,CL,C,O,R,SOAP,DET,IDS
from validate_soap_hardness_report import Report as BaseReport,near,signature
from validate_salt_corrosion_report import evaluate_substitution,NUM
getcontext().prec=75
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):
  # Reuse HTML mechanics only; calculations below are independent of the app.
  attrs=[(k,'soap-hardness-record-inputs'if k=='id'and v=='soap-detergent-record-inputs'else v)for k,v in attrs]
  super().handle_starttag(tag,attrs)
  if tag=='p'and self.block is not None and dict(attrs).get('class')=='formula':self.block.setdefault('formula','');self.part='formula'
def expressions(q,s):
 def x(k):return str(s[k])
 v=q['sampleMl'];dose=q['deliveredMl'];ca=q['calciumMmolL']if s['isHard']else 0;mg=q['magnesiumMmolL']if s['isHard']else 0
 return {
 'stockMolL':str(q['soapMolL'])if s['isSoap']or q['matching']=='molar'else f'{q["soapMolL"]}*{SOAP}/{DET}',
 'stockGL':f'{x("stockMolL")}*{x("formulaMassGmol")}',
 'stockSurfactantMol':f'{x("stockMolL")}*20/1000',
 'deliveredSurfactantMol':f'{x("stockMolL")}*{dose}/1000',
 'deliveredSurfactantG':f'{x("deliveredSurfactantMol")}*{x("formulaMassGmol")}',
 'remainingStockSurfactantMol':f'{x("stockSurfactantMol")}-{x("deliveredSurfactantMol")}',
 'initialCalciumMol':f'{ca}*{v}/1000000','initialMagnesiumMol':f'{mg}*{v}/1000000',
 'initialHardnessMol':f'{x("initialCalciumMol")}+{x("initialMagnesiumMol")}',
 'precipitatedMetalMol':f'min({x("initialHardnessMol")},{x("deliveredSurfactantMol")}/2)'if s['isSoap']else'0',
 'reactedFraction':f'{x("precipitatedMetalMol")}/{x("initialHardnessMol")}'if s['initialHardnessMol']else'0',
 'calciumPrecipitatedMol':f'{x("initialCalciumMol")}*{x("reactedFraction")}',
 'magnesiumPrecipitatedMol':f'{x("initialMagnesiumMol")}*{x("reactedFraction")}',
 'calciumRemainingMol':f'{x("initialCalciumMol")}-{x("calciumPrecipitatedMol")}',
 'magnesiumRemainingMol':f'{x("initialMagnesiumMol")}-{x("magnesiumPrecipitatedMol")}',
 'boundSurfactantMol':f'2*{x("precipitatedMetalMol")}',
 'freeSurfactantMol':f'max(0,{x("deliveredSurfactantMol")}-{x("boundSurfactantMol")})',
 'availableFraction':f'{x("freeSurfactantMol")}/{x("deliveredSurfactantMol")}'if s['deliveredSurfactantMol']else None,
 'nominalFinalMl':f'{v}+{dose}',
 'freeSurfactantMmolL':f'{x("freeSurfactantMol")}*1000000/{x("nominalFinalMl")}',
 'initialHardnessMgL':f'{x("initialHardnessMol")}*{CA+C+3*O}*1000000/{v}',
 'dilutionOnlyHardnessMgL':f'{x("initialHardnessMol")}*{CA+C+3*O}*1000000/{x("nominalFinalMl")}',
 'residualHardnessMgL':f'({x("calciumRemainingMol")}+{x("magnesiumRemainingMol")})*{CA+C+3*O}*1000000/{x("nominalFinalMl")}',
 'sodiumMol':x('deliveredSurfactantMol')if s['isSoap']else'0',
 'chlorideMol':f'2*{x("initialHardnessMol")}',
 'calciumSoapEquivalentG':f'{x("calciumPrecipitatedMol")}*({CA}+2*{R})',
 'magnesiumSoapEquivalentG':f'{x("magnesiumPrecipitatedMol")}*({MG}+2*{R})',
 'scumEquivalentG':f'{x("calciumSoapEquivalentG")}+{x("magnesiumSoapEquivalentG")}',
 'sampleSaltG':f'{x("initialCalciumMol")}*({CA}+2*{CL})+{x("initialMagnesiumMol")}*({MG}+2*{CL})',
 'sampleCarrierG':f'{v}*1-{x("sampleSaltG")}',
 'stockCarrierG':f'20*1-{x("stockSurfactantMol")}*{x("formulaMassGmol")}',
 'deliveredCarrierG':f'{dose}*1-{x("deliveredSurfactantG")}',
 'remainingStockCarrierG':f'{x("stockCarrierG")}-{x("deliveredCarrierG")}',
 'freeSurfactantG':f'{x("freeSurfactantMol")}*{R if s["isSoap"]else s["formulaMassGmol"]}',
 'aqueousSolutesG':f'{x("calciumRemainingMol")}*{CA}+{x("magnesiumRemainingMol")}*{MG}+{x("sodiumMol")}*{NA}+{x("chlorideMol")}*{CL}+{x("freeSurfactantG")}',
 'vesselFinalG':f'{x("sampleCarrierG")}+{x("deliveredCarrierG")}+{x("aqueousSolutesG")}+{x("scumEquivalentG")}',
 'remainingStockG':f'{x("remainingStockCarrierG")}+{x("remainingStockSurfactantMol")}*{x("formulaMassGmol")}',
 'initialAccountG':f'{v}*1+20*1',
 'finalAccountG':f'{x("vesselFinalG")}+{x("remainingStockG")}',
 'materialResidualG':f'{x("finalAccountG")} - {x("initialAccountG")}',
 'aqueousChargeResidualMol':f'2*({x("calciumRemainingMol")}+{x("magnesiumRemainingMol")})+{x("sodiumMol")}-{x("chlorideMol")}-{s["freeSurfactantMol"]if s["isSoap"]else 0}'
 }
def unit(k):
 if k=='stockMolL':return'mol/L'
 if k=='stockGL':return'g/L'
 if k=='freeSurfactantMmolL':return'mmol/L'
 if k.endswith('HardnessMgL'):return'mg/L as CaCO₃'
 if k in['availableFraction','reactedFraction']:return'fraction'
 if k=='aqueousChargeResidualMol':return'mol charge'
 if k.endswith('Mol'):return'mol'
 if k.endswith('Ml'):return'mL'
 return'g'
TABLES=[
 [('Formula reference g/mol','formulaMassGmol'),('Actual stock mol/L','stockMolL'),('Stock solute g/L','stockGL'),('Delivered surfactant mol','deliveredSurfactantMol'),('Delivered surfactant g','deliveredSurfactantG'),('Bound surfactant mol','boundSurfactantMol'),('Unprecipitated surfactant mol','freeSurfactantMol'),('Unprecipitated surfactant mmol/L','freeSurfactantMmolL'),('Available fraction (undefined at zero dose)','availableFraction')],
 [('Initial calcium mol','initialCalciumMol'),('Initial magnesium mol','initialMagnesiumMol'),('Calcium precipitated mol','calciumPrecipitatedMol'),('Magnesium precipitated mol','magnesiumPrecipitatedMol'),('Calcium remaining mol','calciumRemainingMol'),('Magnesium remaining mol','magnesiumRemainingMol'),('Initial hardness mg/L as CaCO₃','initialHardnessMgL'),('Dilution-only hardness mg/L as CaCO₃','dilutionOnlyHardnessMgL'),('Residual hardness mg/L as CaCO₃','residualHardnessMgL'),('Soap-product equivalent g','scumEquivalentG'),('Neutral-detergent CMC reference band only','nonionicCmcReferencePosition')],
 [('Stock surfactant remaining mol','remainingStockSurfactantMol'),('Stock material remaining g','remainingStockG'),('Final vessel material g','vesselFinalG'),('Initial whole account g','initialAccountG'),('Final whole account g','finalAccountG'),('Material residual g','materialResidualG'),('Aqueous charge residual mol charge','aqueousChargeResidualMol'),('Surfactant inventory residual mol','surfactantResidualMol')]
]
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);assert len(p.tables)==4
 assert p.tables[0][0]==['Trial','Matched sample mL','Hard sample calcium mmol/L','Hard sample magnesium mmol/L','Soap reference mol/L','Delivered stock mL','Selected agitation cycles','Dose matching basis','Student observation']
 trials=r['trials'];assert len(p.tables[0])==len(trials)+1;tablechecks=0
 states=[]
 for i,t in enumerate(trials):
  q={k:v for k,v in t.items()if k!='note'};states.append({id:cell(q,id)for id in IDS});row=p.tables[0][i+1]
  assert len(row)==9 and row[0]==str(i+1)and row[-2:]==[q['matching'],t['note']]
  for actual,k in zip(row[1:7],['sampleMl','calciumMmolL','magnesiumMmolL','soapMolL','deliveredMl','agitationCycles']):near(actual,q[k],D('2e-18'));tablechecks+=1
 for table,fields in zip(p.tables[1:],TABLES):
  assert table[0]==['Trial','Sample']+[h for h,k in fields]and len(table)==4*len(trials)+1
  for i in range(len(trials)):
   for j,id in enumerate(IDS):
    row=table[1+i*4+j];assert row[:2]==[str(i+1),id]and len(row)==len(fields)+2
    for actual,(_,k)in zip(row[2:],fields):
     want=states[i][id][k]
     if want is None:assert actual=='Not defined / not applicable'
     elif isinstance(want,str):assert actual==want
     else:near(actual,want,D('2e-18')if k.endswith('Mol')else D('2e-11'))
     tablechecks+=1
 assert len(p.blocks)==168*len(trials);seen=set();operands=0;nulls=0;formulas=0
 for b in p.blocks:
  i=b['trial'];id,k=b['key'].split('.');assert (i,id,k)not in seen;seen.add((i,id,k));assert b.get('formula');formulas+=1
  q={k:v for k,v in trials[i].items()if k!='note'}
  if id=='comparison':
   ss,sh,ds,dh=[states[i][v]for v in IDS];pairs={'soapHardWaterLossMol':(ss['freeSurfactantMol'],sh['freeSurfactantMol']),'detergentHardWaterLossMol':(ds['freeSurfactantMol'],dh['freeSurfactantMol']),'detergentMinusSoapDeliveredMol':(dh['deliveredSurfactantMol'],sh['deliveredSurfactantMol']),'detergentMinusSoapDeliveredG':(dh['deliveredSurfactantG'],sh['deliveredSurfactantG'])};a,z=pairs[k];want=a-z;expected=f'{a} - {z}'
  else:
   assert id in IDS;s=states[i][id];want=s[k];expected=expressions(q,s)[k]
  if want is None:
   assert b['result']=='Undefined at zero delivered dose'and b['substitution']=='Undefined: denominator is zero';nulls+=1;continue
  result=re.fullmatch('('+NUM+') (.+)',b['result']);assert result and result[2]==unit(k),(k,b['result']);near(result[1],want,D('2e-18')if k.endswith('Mol')else D('2e-11'))
  actual=b['substitution'].replace('×','*').replace('−','-')
  assert signature(ast.parse(actual,mode='eval').body)==signature(ast.parse(expected,mode='eval').body),(k,'wrong expression structure')
  leaves=lambda source:[ast.get_source_segment(source,n)for n in ast.walk(ast.parse(source,mode='eval'))if isinstance(n,ast.Constant)]
  a,z=leaves(actual),leaves(expected);assert len(a)==len(z)
  for x,y in zip(a,z):near(x,y,D('2e-18'));operands+=1
  near(evaluate_substitution(actual),D(result[1]),D('2e-18')if k.endswith('Mol')else D('2e-11'))
 return{'trials':len(trials),'workedResults':len(p.blocks),'undefinedAvailabilityChecks':nulls,'formulaPresenceChecks':formulas,'operandChecks':operands,'tableChecks':tablechecks,'tables':4}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
