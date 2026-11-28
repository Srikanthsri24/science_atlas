"""Independent HTML audit with quantity-aware operand tolerances. This keeps
subtraction rounding allowances restricted to the quantities that need them."""
import ast,json,re,sys,math
from pathlib import Path
from validate_soap_hardness_report import Report as BaseReport
from validate_salt_corrosion_report import NUM,evaluate_substitution
from validate_starch_iodine import reference,compare,D,MI,MKI,IDS
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'soap-hardness-record-inputs'if k=='id'and v=='starch-iodine-record-inputs'else v)for k,v in attrs])
EXPR={
 'starchG':'q_starchGL*q_sampleMl/1000*s_starchFraction',
 'glucoseG':'q_starchGL*q_sampleMl/1000*s_glucoseFraction',
 'sampleCarrierG':'q_sampleMl*1-s_starchG-s_glucoseG',
 'remainingStockMl':'2-q_withdrawnMl','pipetteMl':'q_withdrawnMl-q_deliveredMl','vialMl':'q_sampleMl+q_deliveredMl',
 'iodideMmolL':'10*q_iodineMmolL',
 'initialIodineEqMol':'q_iodineMmolL*2/1000000','stockIodineEqMol':'q_iodineMmolL*s_remainingStockMl/1000000','pipetteIodineEqMol':'q_iodineMmolL*s_pipetteMl/1000000','vialIodineEqMol':'q_iodineMmolL*q_deliveredMl/1000000',
 'initialKiMol':'s_iodideMmolL*2/1000000','stockKiMol':'s_iodideMmolL*s_remainingStockMl/1000000','pipetteKiMol':'s_iodideMmolL*s_pipetteMl/1000000','vialKiMol':'s_iodideMmolL*q_deliveredMl/1000000',
 'initialReagentCarrierG':'2*1-s_initialIodineEqMol*M_I2-s_initialKiMol*M_KI',
 'stockCarrierG':'s_remainingStockMl*1-s_stockIodineEqMol*M_I2-s_stockKiMol*M_KI',
 'pipetteCarrierG':'s_pipetteMl*1-s_pipetteIodineEqMol*M_I2-s_pipetteKiMol*M_KI',
 'deliveredCarrierG':'q_deliveredMl*1-s_vialIodineEqMol*M_I2-s_vialKiMol*M_KI',
 'capacityMol':'s_starchG*q_capacityMmolG/1000',
 'iodineEqMmolL':'s_vialIodineEqMol*1000000/s_vialMl','capacityMmolL':'s_capacityMol*1000000/s_vialMl',
 'discriminant':'(s_iodineEqMmolL-s_capacityMmolL)*(s_iodineEqMmolL-s_capacityMmolL)+2*q_kdMmolL*(s_iodineEqMmolL+s_capacityMmolL)+q_kdMmolL*q_kdMmolL',
 'associatedMmolL':'2*s_iodineEqMmolL*s_capacityMmolL/(s_iodineEqMmolL+s_capacityMmolL+q_kdMmolL+sqrt(s_discriminant))',
 'associatedIodineEqMol':'s_associatedMmolL*s_vialMl/1000000','unassociatedIodineEqMol':'s_vialIodineEqMol-s_associatedIodineEqMol','unusedCapacityMol':'s_capacityMol-s_associatedIodineEqMol',
 'associatedIodineEqG':'s_associatedIodineEqMol*M_I2','unassociatedIodineEqG':'s_unassociatedIodineEqMol*M_I2','vialKiG':'s_vialKiMol*M_KI',
 'stockG':'s_stockCarrierG+s_stockIodineEqMol*M_I2+s_stockKiMol*M_KI',
 'pipetteG':'s_pipetteCarrierG+s_pipetteIodineEqMol*M_I2+s_pipetteKiMol*M_KI',
 'vialG':'s_sampleCarrierG+s_starchG+s_glucoseG+s_deliveredCarrierG+s_associatedIodineEqG+s_unassociatedIodineEqG+s_vialKiG',
 'initialAccountG':'q_sampleMl*1+2*1','finalAccountG':'s_stockG+s_pipetteG+s_vialG',
 'associatedFraction':'s_associatedIodineEqMol/s_vialIodineEqMol','capacityOccupancy':'s_associatedIodineEqMol/s_capacityMol',
 'associationResidualMmolL2':'q_kdMmolL*s_associatedMmolL-(s_iodineEqMmolL-s_associatedMmolL)*(s_capacityMmolL-s_associatedMmolL)',
 'materialResidualG':'s_finalAccountG-s_initialAccountG',
 'iodineEquivalentResidualMol':'s_initialIodineEqMol-s_stockIodineEqMol-s_pipetteIodineEqMol-s_associatedIodineEqMol-s_unassociatedIodineEqMol',
 'iodideInventoryResidualMol':'s_initialKiMol-s_stockKiMol-s_pipetteKiMol-s_vialKiMol',
 'iodineAtomResidualMol':'2*(s_initialIodineEqMol-s_stockIodineEqMol-s_pipetteIodineEqMol-s_associatedIodineEqMol-s_unassociatedIodineEqMol)+s_initialKiMol-s_stockKiMol-s_pipetteKiMol-s_vialKiMol',
 'potassiumAtomResidualMol':'s_initialKiMol-s_stockKiMol-s_pipetteKiMol-s_vialKiMol',
 'capacityResidualMol':'s_capacityMol-s_associatedIodineEqMol-s_unusedCapacityMol'}
FIELDS=[['remainingStockMl','pipetteMl','vialMl','vialIodineEqMol','vialKiMol'],['starchG','glucoseG','capacityMol','associatedIodineEqMol','unassociatedIodineEqMol','associatedFraction','capacityOccupancy','cue'],['sampleCarrierG','stockG','pipetteG','vialG','initialAccountG','finalAccountG','materialResidualG','iodineAtomResidualMol','potassiumAtomResidualMol']]
HEADERS=[['Stock left mL','Held in pipette mL','Nominal vial mL','Vial iodine-equivalent mol','Vial potassium/iodide inventory mol'],['Starch g','Glucose g','Selected capacity mol equivalents','Associated iodine-equivalent mol','Unassociated iodine-equivalent mol','Associated fraction','Capacity occupancy','Qualitative reference cue (not detection limit)'],['Sample carrier g','Stock material g','Pipette material g','Vial material g','Initial material g','Final material g','Material residual g','Iodine atom residual mol','Potassium atom residual mol']]
CUES={'no-iodine-reference':'No iodine inventory — untested reference','association-reference':'Illustrated association reference — not a visibility prediction','reagent-colour-reference':'Reagent-colour reference — no selected association'}
QKEYS=['sampleMl','starchGL','iodineMmolL','withdrawnMl','deliveredMl','capacityMmolG','kdMmolL']
def shape(node):
 if isinstance(node,(ast.Constant,ast.Name)):return'number'
 if isinstance(node,ast.UnaryOp):return(type(node.op).__name__,shape(node.operand))
 if isinstance(node,ast.BinOp):return(type(node.op).__name__,shape(node.left),shape(node.right))
 if isinstance(node,ast.Call)and isinstance(node.func,ast.Name)and not node.keywords:return(node.func.id,tuple(shape(a)for a in node.args))
 raise AssertionError('Unsupported arithmetic shape')
def leaves(tree):return[n for n in ast.walk(tree)if isinstance(n,ast.Constant)or isinstance(n,ast.Name)and n.id!='sqrt']
def strict(a,b):assert abs(D(str(a))-D(str(b)))<=max(D('1e-300'),abs(D(str(b)))*D('2e-15')),(a,str(b))
def unit(key):
 if key in['associatedFraction','capacityOccupancy']:return'fraction'
 if key in['discriminant','associationResidualMmolL2']:return'(mmol/L)²'
 if key.endswith('G'):return'g'
 if key.endswith('Ml'):return'mL'
 if key.endswith('MmolL'):return'mmol/L'
 if key.endswith('IodineEqMol')or key=='iodineEquivalentResidualMol':return'mol I2 equivalents'
 if key in['capacityMol','unusedCapacityMol','capacityResidualMol']:return'mol equivalents'
 if key in['iodineAtomResidualMol','potassiumAtomResidualMol']:return'mol atoms'
 return'mol'
def validate(path):
 p=Report();p.feed(Path(path).read_text());record=json.loads(p.payload);trials=record['trials'];assert len(trials)<=40 and len(p.tables)==4 and len(p.blocks)==176*len(trials);tablechecks=0;operandchecks=0;undefined=0;seen=set()
 assert p.tables[0][0]==['Trial','Sample mL','Full-reference dry solute g/L','Stock iodine-equivalent mmol/L','Withdrawn mL','Delivered mL','Selected capacity mmol equivalents/g starch','Selected apparent Kd mmol/L','Student colour observation']
 assert len(p.tables[0])==len(trials)+1
 for i,trial in enumerate(trials):
  q={k:trial[k]for k in QKEYS};assert all(type(v)in[int,float]and math.isfinite(v)for v in q.values());assert 5<=q['sampleMl']<=30 and 0<=q['starchGL']<=5 and 0<=q['iodineMmolL']<=1 and 0<=q['deliveredMl']<=q['withdrawnMl']<=2 and 0<=q['capacityMmolG']<=1 and .001<=q['kdMmolL']<=1
  for k in['starchGL','iodineMmolL','withdrawnMl','deliveredMl','capacityMmolG']:assert q[k]==0 or q[k]>=1e-6
  row=p.tables[0][i+1];assert len(row)==9 and row[0]==str(i+1)and row[-1]==trial['note']
  for actual,k in zip(row[1:-1],QKEYS):strict(actual,q[k]);tablechecks+=1
 for table,fields,headers in zip(p.tables[1:],FIELDS,HEADERS):
  assert len(table)==1+4*len(trials)and table[0]==['Trial','Sample']+headers
  for i,trial in enumerate(trials):
   q={k:trial[k]for k in QKEYS}
   for j,id in enumerate(IDS):
    s=reference(q,id);row=table[1+4*i+j];assert len(row)==2+len(fields)and row[:2]==[str(i+1),id]
    for actual,key in zip(row[2:],fields):
     if key=='cue':assert actual==CUES[s[key]]
     elif s[key]is None:assert actual=='Undefined'
     else:compare(float(actual),s[key],key,q,s)
     tablechecks+=1
 for b in p.blocks:
  i=b['trial'];id,key=b['key'].split('.');assert(i,id,key)not in seen;seen.add((i,id,key));q={k:trials[i][k]for k in QKEYS};s=reference(q,id);expected=EXPR[key];actual=b['substitution'].replace('×','*').replace('−','-');at=ast.parse(actual,mode='eval').body;et=ast.parse(expected,mode='eval').body
  assert shape(at)==shape(et),(key,'operator mismatch');av,ev=leaves(at),leaves(et);assert len(av)==len(ev)
  for a,e in zip(av,ev):
   assert isinstance(a,ast.Constant)and type(a.value)in[int,float];value=ast.get_source_segment(actual,a)
   if isinstance(e,ast.Constant):strict(value,ast.get_source_segment(expected,e))
   elif e.id.startswith('q_'):strict(value,q[e.id[2:]])
   elif e.id.startswith('s_'):compare(float(value),s[e.id[2:]],e.id[2:],q,s)
   else:strict(value,{'M_I2':MI,'M_KI':MKI}[e.id])
   operandchecks+=1
  if s[key]is None:assert b['result'].startswith('Undefined');undefined+=1;continue
  result=re.fullmatch('('+NUM+') (.+)',b['result']);assert result and result[2]==unit(key),(key,b['result']);compare(float(result[1]),s[key],key,q,s)
  calculated=evaluate_substitution(actual);compare(float(calculated),D(result[1]),key,q,s)
 return {'trials':len(trials),'workedResults':len(p.blocks),'undefinedResults':undefined,'operandChecks':operandchecks,'tableFieldChecks':tablechecks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
