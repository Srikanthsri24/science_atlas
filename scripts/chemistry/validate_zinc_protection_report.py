"""Independent input-only HTML result, unit, substitution and observation checks."""
import json,re,sys
from html.parser import HTMLParser
from decimal import Decimal
from zinc_protection_reference import cell,D,F,FE,ZN,O2,W,OH
from validate_salt_corrosion_report import evaluate_substitution,NUM

class Report(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.tables=[];self.blocks=[];self.script='';self.in_script=False;self.in_cell=False;self.row=None;self.table=None;self.h3=False;self.heading='';self.trial=None;self.block=None;self.part=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='table':self.table=[]
  if tag=='tr':self.row=[]
  if tag in ('th','td'):self.in_cell=True;self.row.append('')
  if tag=='h3':self.h3=True;self.heading=''
  if tag=='script'and a.get('id')=='zinc-protection-record-inputs':self.in_script=True
  if tag=='section'and a.get('class')=='worked':self.block={'key':a['data-key'],'trial':self.trial,'substitution':'','result':''}
  if self.block is not None and tag=='p'and a.get('class')in ('substitution','result'):self.part=a['class']
 def handle_data(self,data):
  if self.in_cell:self.row[-1]+=data
  if self.h3:self.heading+=data
  if self.in_script:self.script+=data
  if self.block is not None and self.part:self.block[self.part]+=data
 def handle_endtag(self,tag):
  if tag in ('th','td'):self.in_cell=False
  if tag=='tr':self.table.append(self.row);self.row=None
  if tag=='table':self.tables.append(self.table);self.table=None
  if tag=='h3':self.h3=False;self.trial=int(self.heading.split()[-1])-1
  if tag=='script':self.in_script=False
  if tag=='p':self.part=None
  if tag=='section'and self.block is not None:self.blocks.append(self.block);self.block=None

def phases(q,id,ref):
 t=D(q['elapsedDays'])*86400;cuts=sorted(set([D(0),t]+[ref[k]for k in ['ironExhaustionS','zincExhaustionS']if ref[k]is not None and 0<ref[k]<t]));out=[]
 for start,end in zip(cuts,cuts[1:]):
  mid=cell({**q,'elapsedDays':str((start+end)/2/86400)},id);out.append(dict(startS=start,endS=end,ironCurrentA=mid['ironCurrentA'],zincCurrentA=mid['zincCurrentA'],protectiveCurrentA=mid['protectiveCurrentA'],zincSelfCurrentA=mid['zincSelfCurrentA'],ironChargeC=mid['ironCurrentA']*(end-start),zincChargeC=mid['zincCurrentA']*(end-start)))
 return out

GROUPS=[['initialZincG','unappliedZincG','defect','coatedFraction','metalContact','exposedIronAreaCm2','exposedZincAreaCm2','oxygenScale'],['convertedIronG','remainingIronG','convertedZincG','remainingZincG','ironSavedVersusBareG','ironEquivalentAvoidedG','remainingIronVolumeMl','remainingZincVolumeMl','ironExhausted','zincExhausted'],['ironCapacityC','zincCapacityC','elapsedS','ironChargeC','zincChargeC','protectiveChargeC','zincSelfChargeC','primaryChargeC','ironCurrentA','zincCurrentA','protectiveCurrentA','meanCurrentA','ironExhaustionS','zincExhaustionS'],['ironMol','zincMol','oxygenSuppliedMol','waterSuppliedMol','oxygenSuppliedG','waterSuppliedG','ironHydroxideEquivalentG','zincHydroxideEquivalentG','productsEquivalentG'],['initialAccountG','externalInputG','finalAccountG','materialResidualG','primaryChargeResidualC','zincChargePartitionResidualC','oxygenChargeResidualC','ironAtomResidualMol','zincAtomResidualMol','oxygenAtomResidualMol','hydrogenAtomResidualMol']]
FIELDS=['ironG','zincG','carrierG','areaCm2','scratchFraction','ironDemandUAcm2','zincSupportUAcm2','zincSelfUAcm2','oxygenCapacityUA','wet','connected','elapsedDays']
def unit(key):
 if key in ('defect','coatedFraction','oxygenScale'):return 'ratio'
 if key.startswith('phase-')or key.endswith('C'):return 'C'
 if key.endswith('VolumeMl'):return 'mL'
 if key.endswith('Cm2'):return 'cm²'
 if key.endswith('Mol'):return 'mol'
 if key.endswith('G'):return 'g'
 if key.endswith('A')or key.startswith('raw-'):return 'A'
 if key.endswith('S'):return 's'
 raise AssertionError('Missing unit '+key)

def validate(path):
 p=Report();p.feed(open(path).read());r=json.loads(p.script);trials=r['trials'];assert len(p.tables)==7;assert len(p.tables[0])==len(trials)+1;checks=units=expressions=operands=0
 for header,expected_unit in zip(p.tables[0][0][1:-1],['g','g','g','cm²','fraction','µA/cm²','µA/cm²','µA/cm²','µA',None,None,'days']):
  if expected_unit:assert header.endswith(' '+expected_unit),(header,expected_unit);units+=1
 for header,expected_unit in zip(p.tables[6][0][3:],['s','s','s','A','A','A','A','C','C']):assert header.endswith(' '+expected_unit),(header,expected_unit);units+=1
 for i,q in enumerate(trials):
  refs={id:cell(q,id)for id in ['bare','intact','scratched','isolated']};endrefs={id:cell({**q,'elapsedDays':14},id)for id in refs}
  def near(actual,want,key,id=None):
   nonlocal checks
   got=D(actual);floor=D('2e-12')if 'Residual' in key else D('1e-28')
   if key in ('remainingIronG','remainingIronVolumeMl','ironSavedVersusBareG'):floor=max(floor,D(q['ironG'])*D('3e-14'))
   if key in ('remainingZincG','remainingZincVolumeMl'):floor=max(floor,D(q['zincG'])*D('3e-14'))
   if id:
    events=[endrefs[id][k]for k in ['ironExhaustionS','zincExhaustionS']if endrefs[id][k]is not None];near_event=any(abs(D(q['elapsedDays'])*86400-e)<=max(D(1),e)*D('1e-6')for e in events)
    if near_event:
     eps=D('1.4210854715202004e-14');mass=D(q['ironG'])+D(q['zincG']);moles=D(q['ironG'])/FE+D(q['zincG'])/ZN
     if key=='phaseDurationS':floor=max(floor,eps*max(events or [D(0)]))
     elif key.endswith('C')or key.startswith('phase-'):floor=max(floor,eps*2*F*moles)
     elif key.endswith('G')and key not in ('initialAccountG','finalAccountG'):floor=max(floor,eps*mass*2)
     elif key.endswith('Mol'):floor=max(floor,eps*moles*2)
     elif key.endswith('VolumeMl'):floor=max(floor,eps*mass)
     elif key=='meanCurrentA'and D(q['elapsedDays'])>0:floor=max(floor,eps*2*F*moles/(D(q['elapsedDays'])*86400))
   assert abs(got-want)<=max(floor,abs(want)*D('3e-10')),(i,id,key,str(got),str(want));checks+=1
  prep=p.tables[0][i+1];assert len(prep)==14 and prep[0]==str(i+1)and prep[-1]==q['note']
  for key,actual in zip(FIELDS,prep[1:-1]):
   if type(q[key])is bool:assert actual==str(q[key]).lower()
   else:near(actual,D(q[key]),key)
  phase_by={}
  for n,(id,s)in enumerate(refs.items()):
   s['ironSavedVersusBareG']=refs['bare']['convertedIronG']-s['convertedIronG'];phase_by[id]=phases(q,id,s)
   for table_index,fields in enumerate(GROUPS,1):
    row=p.tables[table_index][1+4*i+n];assert len(row)==len(fields)+2 and row[:2]==[str(i+1),id]
    for key,actual,header in zip(fields,row[2:],p.tables[table_index][0][2:]):
     want=s[key]
     if want is None:assert actual=='Not defined / not reached'
     elif type(want)is bool:assert actual==str(want).lower()
     else:
      near(actual,want,key,id)
      if unit(key)!='ratio':assert header.endswith(' '+unit(key)),(key,header);units+=1
   raw_fe=D(q['ironDemandUAcm2'])*s['exposedIronAreaCm2']/1000000;raw_self=D(q['zincSelfUAcm2'])*s['exposedZincAreaCm2']/1000000
   sums=lambda k:[v[k]for v in phase_by[id]]or[D(0)]
   sums2=lambda k:sum((v[k]*(v['endS']-v['startS'])for v in phase_by[id]),D(0))
   expected={k:s[k]for k in ['initialZincG','unappliedZincG','exposedIronAreaCm2','exposedZincAreaCm2','oxygenScale','selectedDemandA','protectiveCurrentA','ironCurrentA','zincSelfCurrentA','zincCurrentA','elapsedS','ironCapacityC','zincCapacityC','ironChargeC','zincChargeC','primaryChargeC','protectiveChargeC','zincSelfChargeC','ironMol','zincMol','convertedIronG','convertedZincG','remainingIronG','remainingZincG','oxygenSuppliedMol','waterSuppliedMol','oxygenSuppliedG','waterSuppliedG','ironHydroxideEquivalentG','zincHydroxideEquivalentG','productsEquivalentG','initialAccountG','externalInputG','finalAccountG','materialResidualG','meanCurrentA','ironEquivalentAvoidedG','ironSavedVersusBareG','remainingIronVolumeMl','remainingZincVolumeMl']};expected.update({'raw-iron-demand':raw_fe,'raw-zinc-self':raw_self})
   for j,v in enumerate(phase_by[id],1):
    for metal in ('iron','zinc'):expected[f'phase-{j}-{metal}']=v[metal+'ChargeC']
   op=lambda value,key='constant':(D(value),key)
   sv=lambda key:op(s[key],key)
   qq=lambda key:op(q[key],key)
   lit=lambda value:op(value)
   iron_factor=D(0)if s['ironExhausted']else s['defect']if s['zincCapacityC']>0 and not s['zincExhausted']and s['metalContact']else D(1)
   zinc_factor=s['coatedFraction']*(1 if s['metalContact']else 2)if s['zincCapacityC']>0 and not s['zincExhausted']else D(0)
   om={
    'initialZincG':[qq('zincG'),lit(1),sv('defect')], 'unappliedZincG':[qq('zincG'),sv('initialZincG')],
    'exposedIronAreaCm2':[qq('areaCm2'),lit(iron_factor)],'exposedZincAreaCm2':[qq('areaCm2'),lit(zinc_factor)],
    'raw-iron-demand':[qq('ironDemandUAcm2'),sv('exposedIronAreaCm2'),lit('1e-6')],
    'raw-zinc-self':[qq('zincSelfUAcm2'),sv('exposedZincAreaCm2'),lit('1e-6')],
    'oxygenScale':[lit(1),qq('oxygenCapacityUA'),lit('1e-6'),op(raw_fe,'currentA'),op(raw_self,'currentA')]if q['wet']and raw_fe+raw_self>0 else[lit(0)],
    'selectedDemandA':[op(raw_fe,'currentA'),sv('oxygenScale')],
    'protectiveCurrentA':[op(raw_fe,'currentA'),qq('zincSupportUAcm2'),sv('exposedZincAreaCm2'),lit('1e-6'),sv('oxygenScale')]if s['metalContact']and not s['ironExhausted']and s['zincCapacityC']>0 and not s['zincExhausted']else[lit(0)],
    'ironCurrentA':[sv('selectedDemandA'),sv('protectiveCurrentA')], 'zincSelfCurrentA':[op(raw_self,'currentA'),sv('oxygenScale')], 'zincCurrentA':[sv('zincSelfCurrentA'),sv('protectiveCurrentA')],
    'elapsedS':[qq('elapsedDays'),lit(86400)],'ironCapacityC':[lit(2),lit(F),qq('ironG'),lit(FE)],'zincCapacityC':[lit(2),lit(F),sv('initialZincG'),lit(ZN)],
    'ironChargeC':[op(v,'phase-C')for v in sums('ironChargeC')], 'zincChargeC':[op(v,'phase-C')for v in sums('zincChargeC')],
    'primaryChargeC':[sv('ironChargeC'),sv('zincChargeC')],
    'protectiveChargeC':[item for v in phase_by[id]for item in [op(v['protectiveCurrentA'],'currentA'),op(v['endS']-v['startS'],'phaseDurationS')]]or[lit(0)],
    'zincSelfChargeC':[sv('zincChargeC'),sv('protectiveChargeC')],
    'ironMol':[sv('ironChargeC'),lit(2),lit(F)], 'zincMol':[sv('zincChargeC'),lit(2),lit(F)],
    'convertedIronG':[sv('ironMol'),lit(FE)],'convertedZincG':[sv('zincMol'),lit(ZN)],
    'remainingIronG':[qq('ironG'),sv('convertedIronG')],'remainingZincG':[sv('initialZincG'),sv('convertedZincG')],
    'oxygenSuppliedMol':[sv('ironMol'),sv('zincMol'),lit(2)],'waterSuppliedMol':[sv('ironMol'),sv('zincMol')],
    'oxygenSuppliedG':[sv('oxygenSuppliedMol'),lit(O2)],'waterSuppliedG':[sv('waterSuppliedMol'),lit(W)],
    'ironHydroxideEquivalentG':[sv('ironMol'),lit(FE),lit(2),lit(OH)],'zincHydroxideEquivalentG':[sv('zincMol'),lit(ZN),lit(2),lit(OH)],
    'productsEquivalentG':[sv('ironHydroxideEquivalentG'),sv('zincHydroxideEquivalentG')],
    'initialAccountG':[qq('ironG'),qq('zincG'),qq('carrierG')], 'externalInputG':[sv('oxygenSuppliedG'),sv('waterSuppliedG')],
    'finalAccountG':[sv('remainingIronG'),sv('remainingZincG'),sv('unappliedZincG'),qq('carrierG'),sv('productsEquivalentG')],
    'materialResidualG':[sv('finalAccountG'),sv('initialAccountG'),sv('externalInputG')],
    'meanCurrentA':[sv('primaryChargeC'),sv('elapsedS')], 'ironEquivalentAvoidedG':[sv('protectiveChargeC'),lit(FE),lit(2),lit(F)],
    'ironSavedVersusBareG':[op(refs['bare']['convertedIronG'],'convertedIronG'),sv('convertedIronG')],
    'remainingIronVolumeMl':[sv('remainingIronG'),lit('7.87')],'remainingZincVolumeMl':[sv('remainingZincG'),lit('7.134')]
   }
   for j,v in enumerate(phase_by[id],1):
    for metal in ('iron','zinc'):om[f'phase-{j}-{metal}']=[op(v[metal+'CurrentA'],'currentA'),op(v['endS'],'elapsedS'),op(v['startS'],'elapsedS')]
   selected=[b for b in p.blocks if b['trial']==i and b['key'].startswith(id+'.')];assert len(selected)==len(expected);assert {b['key'].split('.',1)[1]for b in selected}==set(expected)
   for block in selected:
    key=block['key'].split('.',1)[1];want=expected[key]
    if want is None:assert block['result']=='Unavailable at the initial instant';assert not re.findall(NUM,block['substitution']);continue
    match=re.fullmatch('('+NUM+r') (.+)',block['result']);assert match and match[2]==unit(key),(key,block['result']);units+=1;near(match[1],want,key,id);near(evaluate_substitution(block['substitution']),want,key,id);expressions+=1
    nums=re.findall(NUM,block['substitution']);assert len(nums)==len(om[key]),(key,nums,om[key])
    for actual,(wanted,operand_key)in zip(nums,om[key]):near(actual,wanted,operand_key,id);operands+=1
  expected_rows=[]
  for id,ps in phase_by.items():
   for j,v in enumerate(ps,1):expected_rows.append([str(i+1),id,str(j),v['startS'],v['endS'],v['endS']-v['startS'],v['ironCurrentA'],v['zincCurrentA'],v['protectiveCurrentA'],v['zincSelfCurrentA'],v['ironChargeC'],v['zincChargeC']])
  actual_rows=[v for v in p.tables[6][1:]if v[0]==str(i+1)];assert len(actual_rows)==len(expected_rows)
  for actual,wanted in zip(actual_rows,expected_rows):
   assert len(actual)==12 and actual[:3]==wanted[:3]
   for index,(got,want)in enumerate(zip(actual[3:],wanted[3:])):near(got,want,'phase-C'if index>=7 else 'phaseDurationS'if index==2 else 'elapsedS'if index<2 else 'currentA',actual[1])
 return{'trials':len(trials),'workedResults':len(p.blocks),'numericChecks':checks,'unitChecks':units,'expressionChecks':expressions,'operandChecks':operands}
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
