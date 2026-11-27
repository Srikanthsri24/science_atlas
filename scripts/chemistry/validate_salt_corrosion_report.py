"""Independent CL-0107 HTML audit: source inputs, ten tables, units, results and operands."""
import json,re,sys,ast
from decimal import localcontext
from html.parser import HTMLParser
from salt_corrosion_reference import solve,D,validate_inputs
NUM=r'[-+]?\d+(?:\.\d*)?(?:[eE][-+]?\d+)?'
F=D('6.02214076e23')*D('1.602176634e-19')
class Report(HTMLParser):
 def __init__(self):
  super().__init__();self.tables=[];self.row=[];self.cell=None;self.inputs='';self.inscript=False;self.blocks=[];self.block=None;self.field=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.tables.append([])
  if tag=='tr':self.row=[]
  if tag in['td','th']:self.cell=''
  if tag=='section'and a.get('class')=='worked':self.block={'key':a.get('data-key')}
  if self.block is not None and tag=='p'and a.get('class')in['substitution','result']:self.field=a['class'];self.block[self.field]=''
  if tag=='script'and a.get('id')=='salt-corrosion-record-inputs':self.inscript=True
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
  if self.inscript:self.inputs+=data
  if self.field:self.block[self.field]+=data
 def handle_endtag(self,tag):
  if tag in['td','th']:self.row.append(self.cell.strip());self.cell=None
  if tag=='tr':self.tables[-1].append(self.row)
  if tag=='script':self.inscript=False
  if tag=='p':self.field=None
  if tag=='section'and self.block is not None:self.blocks.append(self.block);self.block=None
TABLES=[
 ['percent','oxygenMgL','densityGml','saltG','waterG','saltMol','solutionMl','solutionM3','saltMolM3','molarityMolL','molalityMolKg','conductivitySM'],
 ['areaM2','pathM','boundaryLayerM','resistanceOhm','initialIronMl','remainingIronMl','faceAreaCm2','sideCm','initialThicknessCm','remainingThicknessCm','penetrationPerFaceMm'],
 ['oxygenMolM3','oxygenFluxCeilingMolM2S','ohmicCeilingAM2','oxygenCeilingAM2','currentCeilingAM2','referenceCurrentAM2','initialCurrentA','instantaneousCurrentA','currentTotalOxygenFluxMolM2S','limitingRegime'],
 ['elapsedS','exhaustionChargeC','exhaustionS','activeS','primaryChargeC','meanCurrentA','primaryElectronMol','secondaryEquivalentChargeC','totalRedoxEquivalentChargeC','primaryChargeResidualC','totalRedoxResidualC','exhausted'],
 ['convertedIronMol','convertedIronG','remainingIronG','currentMassLossGS','meanMassLossGDay','newProductCalculated'],
 ['cathodicOxygenMol','furtherOxygenMol','oxygenSuppliedMol','oxygenSuppliedG','productReferenceMol','hydrationWaterSuppliedMol','hydrationWaterSuppliedG','productReferenceG','retainedSpecimenG','specimenGainG'],
 ['initialCarrierAccountG','externalInputG','finalCarrierAccountG','materialResidualG','ironAtomResidualMol','oxygenAtomResidualMol','hydrogenAtomResidualMol']]
UNITS={'percent':'% mass','oxygenMgL':'mg/L','densityGml':'g/mL','saltG':'g','waterG':'g','saltMol':'mol NaCl','solutionMl':'mL','solutionM3':'m\u00b3','saltMolM3':'mol/m\u00b3','molarityMolL':'mol/L','molalityMolKg':'mol/kg water','conductivitySM':'S/m','areaM2':'m\u00b2','pathM':'m','boundaryLayerM':'m','resistanceOhm':'\u03a9','oxygenMolM3':'mol/m\u00b3','oxygenFluxCeilingMolM2S':'mol/m\u00b2/s','ohmicCeilingAM2':'A/m\u00b2','oxygenCeilingAM2':'A/m\u00b2','currentCeilingAM2':'A/m\u00b2','referenceCurrentAM2':'A/m\u00b2','initialCurrentA':'A','instantaneousCurrentA':'A','currentTotalOxygenFluxMolM2S':'mol/m\u00b2/s','elapsedS':'s','exhaustionChargeC':'C','exhaustionS':'s','activeS':'s','primaryChargeC':'C','convertedIronMol':'mol Fe','convertedIronG':'g','remainingIronG':'g','meanCurrentA':'A','primaryElectronMol':'mol electrons','secondaryEquivalentChargeC':'C equivalent','totalRedoxEquivalentChargeC':'C equivalent','cathodicOxygenMol':'mol O\u2082','furtherOxygenMol':'mol O\u2082','oxygenSuppliedMol':'mol O\u2082','oxygenSuppliedG':'g','productReferenceMol':'mol formula equivalents','hydrationWaterSuppliedMol':'mol H\u2082O','hydrationWaterSuppliedG':'g','productReferenceG':'g','retainedSpecimenG':'g','specimenGainG':'g','initialCarrierAccountG':'g','externalInputG':'g','finalCarrierAccountG':'g','materialResidualG':'g','ironAtomResidualMol':'mol atoms','oxygenAtomResidualMol':'mol atoms','hydrogenAtomResidualMol':'mol atoms','primaryChargeResidualC':'C','totalRedoxResidualC':'C equivalent','initialIronMl':'mL','remainingIronMl':'mL','faceAreaCm2':'cm\u00b2','sideCm':'cm','initialThicknessCm':'cm','remainingThicknessCm':'cm','penetrationPerFaceMm':'mm','currentMassLossGS':'g/s','meanMassLossGDay':'g/day'}
def unavailable(key):return'Unavailable: zero reference current'if key=='exhaustionS'else'Unavailable at the initial instant'
def header_unit(unit):
 if unit=='% mass':return'%'
 if unit.startswith('mol ')and unit!='mol/kg water':return'mol'
 if unit=='C equivalent':return'C'
 return unit

def operands(q,s):
 sol,Fe,A,drive,L,delta,eta,days=[D(q[k])for k in['solutionG','ironG','exposedAreaCm2','driveV','solutionPathMm','boundaryLayerMm','ceilingFraction','elapsedDays']]
 return{'percent':[s['percent']],'oxygenMgL':[s['oxygenMgL']],'densityGml':[s['densityGml']],'saltG':[sol,s['percent'],100],'waterG':[sol,s['saltG']],'saltMol':[s['saltG'],D('58.44')],'solutionMl':[sol,s['densityGml']],'solutionM3':[s['solutionMl'],D('1e-6')],'saltMolM3':[s['saltMol'],s['solutionM3']],'molarityMolL':[s['saltMol'],s['solutionMl'],1000],'molalityMolKg':[s['saltMol'],s['waterG'],1000],'conductivitySM':[D('5.5e-6'),D('.01265'),s['saltMolM3']]if q['mode']=='dilute'else[s['conductivitySM']],
 'areaM2':[A,D('.0001')],'pathM':[L,1000],'boundaryLayerM':[delta,1000],'resistanceOhm':[s['pathM'],s['conductivitySM'],s['areaM2']],'oxygenMolM3':[s['oxygenMgL'],D('31.998')],'oxygenFluxCeilingMolM2S':[D('2e-9'),s['oxygenMolM3'],s['boundaryLayerM']],'ohmicCeilingAM2':[s['conductivitySM'],drive,s['pathM']],'oxygenCeilingAM2':[8,F,s['oxygenFluxCeilingMolM2S'],3],'currentCeilingAM2':[s['ohmicCeilingAM2'],s['oxygenCeilingAM2']],'referenceCurrentAM2':[eta,s['currentCeilingAM2']],'initialCurrentA':[s['referenceCurrentAM2'],s['areaM2']],'instantaneousCurrentA':[0]if s['exhausted']else[s['initialCurrentA']],'currentTotalOxygenFluxMolM2S':[3,s['instantaneousCurrentA'],8,F,s['areaM2']],
 'elapsedS':[days,86400],'exhaustionChargeC':[2,F,Fe,D('55.845')],'exhaustionS':[s['exhaustionChargeC'],s['initialCurrentA']]if s['exhaustionS']is not None else[],'activeS':[s['elapsedS'],s['exhaustionS']]if s['exhaustionS']is not None else[0],'primaryChargeC':[s['initialCurrentA'],s['elapsedS'],s['exhaustionChargeC']],'convertedIronMol':[Fe,D('55.845'),s['primaryChargeC'],2,F],'convertedIronG':[s['convertedIronMol'],D('55.845')],'remainingIronG':[0,Fe,s['convertedIronG']],'meanCurrentA':[s['primaryChargeC'],s['elapsedS']]if s['meanCurrentA']is not None else[],'primaryElectronMol':[s['primaryChargeC'],F],'secondaryEquivalentChargeC':[F,s['convertedIronMol']],'totalRedoxEquivalentChargeC':[s['primaryChargeC'],s['secondaryEquivalentChargeC']],
 'cathodicOxygenMol':[s['convertedIronMol'],2],'furtherOxygenMol':[s['convertedIronMol'],4],'oxygenSuppliedMol':[s['cathodicOxygenMol'],s['furtherOxygenMol']],'oxygenSuppliedG':[s['oxygenSuppliedMol'],D('31.998')],'productReferenceMol':[s['convertedIronMol'],2],'hydrationWaterSuppliedMol':[s['productReferenceMol']],'hydrationWaterSuppliedG':[s['hydrationWaterSuppliedMol'],D('18.015')],'productReferenceG':[s['convertedIronG'],s['oxygenSuppliedG'],s['hydrationWaterSuppliedG']],'retainedSpecimenG':[s['remainingIronG'],s['productReferenceG']],'specimenGainG':[s['oxygenSuppliedG'],s['hydrationWaterSuppliedG']],
 'initialCarrierAccountG':[Fe,sol],'externalInputG':[s['oxygenSuppliedG'],s['hydrationWaterSuppliedG']],'finalCarrierAccountG':[s['retainedSpecimenG'],sol],'materialResidualG':[s['initialCarrierAccountG'],s['externalInputG'],s['finalCarrierAccountG']],'ironAtomResidualMol':[Fe,D('55.845'),s['remainingIronG'],D('55.845'),2,s['productReferenceMol']],'oxygenAtomResidualMol':[2,s['oxygenSuppliedMol'],s['hydrationWaterSuppliedMol'],4,s['productReferenceMol']],'hydrogenAtomResidualMol':[2,s['hydrationWaterSuppliedMol'],2,s['productReferenceMol']],'primaryChargeResidualC':[s['primaryChargeC'],2,F,s['convertedIronMol']],'totalRedoxResidualC':[s['totalRedoxEquivalentChargeC'],4,F,s['oxygenSuppliedMol']],
 'initialIronMl':[Fe,D('7.87')],'remainingIronMl':[s['remainingIronG'],D('7.87')],'faceAreaCm2':[A,2],'sideCm':[s['faceAreaCm2']],'initialThicknessCm':[s['initialIronMl'],s['faceAreaCm2']],'remainingThicknessCm':[s['remainingIronMl'],s['faceAreaCm2']],'penetrationPerFaceMm':[10,s['convertedIronG'],D('7.87'),A],'currentMassLossGS':[s['instantaneousCurrentA'],D('55.845'),2,F],'meanMassLossGDay':[s['convertedIronG'],days]if days else[]}

def evaluate_substitution(raw):
 expression=raw.replace('\u00d7','*').replace('\u2212','-')
 expression=re.sub(r'\s+\((?:selected dilute value|entered value|entered total conductivity|metal exhausted|metal not exhausted|zero reference current)\)$','',expression)
 tree=ast.parse(expression,mode='eval')
 def visit(node):
  if isinstance(node,ast.Expression):return visit(node.body)
  if isinstance(node,ast.Constant)and type(node.value)in(int,float):return D(ast.get_source_segment(expression,node))
  if isinstance(node,ast.UnaryOp)and isinstance(node.op,(ast.USub,ast.UAdd)):return -visit(node.operand)if isinstance(node.op,ast.USub)else visit(node.operand)
  if isinstance(node,ast.BinOp):
   a,b=visit(node.left),visit(node.right)
   if isinstance(node.op,ast.Add):return a+b
   if isinstance(node.op,ast.Sub):return a-b
   if isinstance(node.op,ast.Mult):return a*b
   if isinstance(node.op,ast.Div):return a/b
  if isinstance(node,ast.Call)and isinstance(node.func,ast.Name)and not node.keywords:
   args=[visit(v)for v in node.args]
   if node.func.id=='min'and args:return min(args)
   if node.func.id=='max'and args:return max(args)
   if node.func.id=='sqrt'and len(args)==1:return args[0].sqrt()
  raise AssertionError('Unsupported substitution expression: '+raw)
 with localcontext()as ctx:
  ctx.prec=80
  return visit(tree)

def validate(path):
 p=Report();p.feed(open(path).read());r=json.loads(p.inputs);trials=r['trials'];assert len(trials)<=40;assert isinstance(r['plan'],str)and len(r['plan'])<=4000;assert isinstance(r['conclusion'],str)and len(r['conclusion'])<=4000;assert len(p.tables)==10;assert len(p.blocks)==133*len(trials);checks=0;unitchecks=0;expressionchecks=0
 for j,table in enumerate(p.tables):assert len(table)==1+len(trials)*(1 if j in[0,9]else 2),(j,len(table))
 assert len(p.tables[0][0])==11 and len(p.tables[1][0])==6 and len(p.tables[9][0])==4
 for header,unit in zip(p.tables[0][0][2:-1],['g','g','cm\u00b2','V','mm','mm','fraction','days']):assert header.endswith(unit),(header,unit);unitchecks+=1
 for header,unit in zip(p.tables[1][0][2:],['%','g/mL','S/m','mg/L']):assert header.endswith(unit),(header,unit);unitchecks+=1
 for table,keys in zip(p.tables[2:9],TABLES):
  assert len(table[0])==len(keys)+2 and table[0][:2]==['Trial','Cell']
  for header,key in zip(table[0][2:],keys):
   if key in UNITS:assert header.endswith(header_unit(UNITS[key])),(key,header,UNITS[key]);unitchecks+=1
 for i,q in enumerate(trials):
  validate_inputs(q);ironfloor=D('2e-15')*D(q['ironG']);preparation=p.tables[0][i+1];assert len(preparation)==11 and preparation[0]==str(i+1)and preparation[1]==q['mode']and preparation[-1]==q['note']
  def near(actual,want,key,operand_index=None,comparison_floor=None):
   nonlocal checks
   checks+=1;assert re.fullmatch(NUM,str(actual)),(key,actual)
   if operand_index is not None:
    floor=ironfloor if(key,operand_index)in[('remainingIronMl',0),('retainedSpecimenG',0),('ironAtomResidualMol',2)]else ironfloor/D('7.87')if(key,operand_index)==('remainingThicknessCm',0)else D('1e-300')
   else:floor=D('3e-12')if key=='materialResidualG'else D('3e-14')if key.endswith('AtomResidualMol')else D('5e-12')if key in['primaryChargeResidualC','totalRedoxResidualC']else ironfloor if key=='remainingIronG'else ironfloor/D('7.87')if key=='remainingIronMl'else ironfloor/D('7.87')/(D(q['exposedAreaCm2'])/2)if key=='remainingThicknessCm'else D('1e-300')
   if comparison_floor is not None:floor=max(floor,comparison_floor)
   assert abs(D(actual)-D(want))<=max(floor,abs(D(want))*D('3e-11')),(i,key,actual,str(want),str(floor))
  for actual,key in zip(preparation[2:-1],['ironG','solutionG','exposedAreaCm2','driveV','solutionPathMm','boundaryLayerMm','ceilingFraction','elapsedDays']):near(actual,D(q[key]),key)
  blocks=p.blocks[133*i:133*(i+1)];assert len({b['key']for b in blocks})==133
  cells={id:solve(q,id)for id in['a','b']}
  for j,id in enumerate(['a','b']):
   s=cells[id];op=operands(q,s);selected=[b for b in blocks if b['key'].startswith(id+'.')];assert len(selected)==65;assert {b['key'][2:]for b in selected}==set(UNITS)==set(op)
   prep=p.tables[1][1+2*i+j];assert len(prep)==6 and prep[:2]==[str(i+1),id.upper()]
   for actual,key in zip(prep[2:],['saltPct'+id.upper(),'density'+id.upper(),'conductivity'+id.upper(),'oxygenMgL'+id.upper()]):near(actual,D(q[key]),key)
   for table,keys in zip(p.tables[2:9],TABLES):
    row=table[1+2*i+j];assert len(row)==2+len(keys)and row[:2]==[str(i+1),id.upper()]
    for actual,key in zip(row[2:],keys):
     want=s[key]
     if want is None:assert actual==unavailable(key),(key,actual)
     elif isinstance(want,bool):assert actual==str(want).lower(),(key,actual,want)
     elif isinstance(want,str):assert actual==want,(key,actual,want)
     else:near(actual,want,key)
   for b in selected:
    key=b['key'][2:];want=s[key]
    if want is None:assert b['result']==unavailable(key);assert not re.findall(NUM,b['substitution']);continue
    match=re.fullmatch('('+NUM+r') (.+)',b['result']);assert match,(key,b['result']);assert match[2]==UNITS[key],(key,match[2],UNITS[key]);unitchecks+=1;near(match[1],want,key)
    nums=re.findall(NUM,b['substitution']);assert len(nums)==len(op[key]),(key,nums,op[key])
    for index,(actual,value)in enumerate(zip(nums,op[key])):near(actual,D(value),key,index)
    near(evaluate_substitution(b['substitution']),want,key);expressionchecks+=1
  a,b=cells['a'],cells['b'];expected={'deltaIronLossG':b['convertedIronG']-a['convertedIronG'],'deltaSpecimenGainG':b['specimenGainG']-a['specimenGainG'],'initialCurrentRatioBoverA':b['initialCurrentA']/a['initialCurrentA']if a['initialCurrentA']else None};comparisonOps={'deltaIronLossG':[b['convertedIronG'],a['convertedIronG']],'deltaSpecimenGainG':[b['specimenGainG'],a['specimenGainG']],'initialCurrentRatioBoverA':[b['initialCurrentA'],a['initialCurrentA']]};floors={'deltaIronLossG':D('2e-14')*max(a['convertedIronG'],b['convertedIronG']),'deltaSpecimenGainG':D('2e-14')*max(a['specimenGainG'],b['specimenGainG']),'initialCurrentRatioBoverA':D('1e-300')}
  selected=[b for b in blocks if'.'not in b['key']];assert {b['key']for b in selected}==set(expected);row=p.tables[9][i+1];assert len(row)==4 and row[0]==str(i+1)
  for actual,(key,want)in zip(row[1:],expected.items()):
   if want is None:assert actual=='Unavailable: initial cell A current is zero'
   else:near(actual,want,key,comparison_floor=floors[key])
  for block in selected:
   key=block['key'];want=expected[key]
   if want is None:assert block['result']=='Unavailable: initial cell A current is zero';assert not re.findall(NUM,block['substitution']);continue
   match=re.fullmatch('('+NUM+r') (.+)',block['result']);assert match;assert match[2]==('ratio'if key=='initialCurrentRatioBoverA'else'g');unitchecks+=1;near(match[1],want,key,comparison_floor=floors[key]);nums=re.findall(NUM,block['substitution']);assert len(nums)==2
   for index,(actual,value)in enumerate(zip(nums,comparisonOps[key])):near(actual,value,key,index)
   near(evaluate_substitution(block['substitution']),want,key,comparison_floor=floors[key]);expressionchecks+=1
 return{'trials':len(trials),'workedResults':len(p.blocks),'numericChecks':checks,'unitChecks':unitchecks,'expressionChecks':expressionchecks}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
