"""Independent source/guide/null/table/formula/operand/unit audit. Tiny RMS
currents use relative tolerances; only phase-zero/cancellation diagnostics have
quantity-scaled floating-point floors."""
import ast,json,math,sys
from pathlib import Path
from decimal import Decimal as D
from validate_valency_molecules_report import Report as BaseReport
from validate_solution_conductivity import reference,SAMPLES
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'valency-molecules-record-inputs'if k=='id'and v=='solution-conductivity-record-inputs'else v)for k,v in attrs])
def near(a,b,relative=D('6e-12'),floor=D(0)):
 a=D(str(a));b=D(str(b));assert abs(a-b)<=max(abs(b)*relative,D(floor)),(str(a),str(b))
def expr_value(s):
 def ev(n):
  if isinstance(n,ast.Constant):return D(ast.get_source_segment(s,n))
  if isinstance(n,ast.UnaryOp)and isinstance(n.op,ast.USub):return-ev(n.operand)
  if isinstance(n,ast.BinOp):
   a,b=ev(n.left),ev(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  raise AssertionError('Unsupported arithmetic')
 return ev(ast.parse(s,mode='eval').body)
def tree(a,b,actual,expected,floors):
 if isinstance(b,ast.UnaryOp):assert type(a)is type(b)and type(a.op)is type(b.op);return tree(a.operand,b.operand,actual,expected,floors)
 if isinstance(b,ast.Constant):
  assert isinstance(a,ast.Constant)and type(a.value)in[int,float];near(ast.get_source_segment(actual,a),ast.get_source_segment(expected,b),D('2e-14'),next(floors,D(0)));return 1
 assert isinstance(b,ast.BinOp)and isinstance(a,ast.BinOp)and type(a.op)is type(b.op);return tree(a.left,b.left,actual,expected,floors)+tree(a.right,b.right,actual,expected,floors)
TITLES={'water':'Ideal CO2-free water','sucrose':'Sucrose · ideal non-ionizing reference','kcl001':'KCl ·0.01mol/kg','kcl01':'KCl ·0.1mol/kg','kcl1':'KCl ·1.0mol/kg'}
HEADERS=[['Trial','Current reference','Reference type','Molality (mol/kg solvent)','Temperature (°C)','Gap (cm)','Facing width (cm)','Immersed depth (cm)','Configured Vrms (V)','Source connected?','Phase cycle','Guide seconds or manual','Snapshot status','Student observation'],['Trial','Assigned κ (S/m)','Assigned κ (S/cm)','Assigned κ (µS/cm)','Immersed area (m²)','Cell constant (m⁻¹)','Reference G (S)','Reference R (Ω)','Physical AC frequency (Hz)'],['Trial','Applied cell Vrms (V)','Irms (A)','Irms (µA)','Mean bulk power (W)','Ideal-channel G reading (S)','Reconstructed κ (S/m)','Reading status'],['Trial','Instantaneous V (V)','Instantaneous I (A)','Electric field (V/m)','Current density (A/m²)','Positive-ion direction','Negative-ion direction','Wire-electron direction relative to conventional path','Display cycle (s)','Physical cycle (s)'],['Trial','Matched water κ (S/m)','Matched water Irms (A)','Selected κ / water κ','Selected Irms / water Irms','Selected minus water Irms (A)','Geometry matched?','Excitation matched?']]
def validate_inputs(q):
 assert q['sampleId']in SAMPLES and type(q['connected'])is bool
 for key,lo,hi in[('gapCm',.5,3),('widthCm',.5,2),('immersedDepthCm',0,3),('voltageRmsV',0,.1),('phaseCycle',0,1)]:assert type(q[key])in[int,float]and math.isfinite(q[key])and lo<=q[key]<=hi
 time=q['guideSeconds'];base=q['guideBase']
 if time is None:assert base is None
 else:
  assert type(time)in[int,float]and math.isfinite(time)and 0<=time<=150 and base is not None
  validate_inputs({**base,'guideBase':None,'guideSeconds':None})
  sample='water'if 20<=time<45 else'sucrose'if 45<=time<70 else base['sampleId']if not 70<=time<125 or base['sampleId'].startswith('kcl')else'kcl001'
  gap=base['gapCm']*(1+(.2 if base['gapCm']<=2.5 else-.2)*math.sin((time-100)/25*math.pi))if 100<=time<125 else base['gapCm']
  expected={**base,'sampleId':sample,'gapCm':min(3,gap),'phaseCycle':(time%4)/4}
  for k,v in expected.items():
   if type(v)in[int,float]:near(q[k],v,D('2e-14'))
   else:assert q[k]==v
 return reference(q)
def workings(q,s):
 out={};water=reference({**q,'sampleId':'water'});zero=D(0);add=lambda k,f,x,r,u,fl=():out.update({k:(f,x,r,u,fl)})
 add('gap','l = gapCm / 100',f"{q['gapCm']} / 100",s['gapM'],'m');add('width','w = widthCm / 100',f"{q['widthCm']} / 100",s['widthM'],'m');add('depth','h = depthCm / 100',f"{q['immersedDepthCm']} / 100",s['depthM'],'m');add('area','A = w * h',f"{s['widthM']} * {s['depthM']}",s['areaM2'],'m²');add('cell','Kcell = l / A',f"{s['gapM']} / {s['areaM2']}"if s['wetted']else'Not evaluated: A = 0',s['cellConstantMInv'],'m⁻¹');add('scm','κ(S/cm) = κ(S/m) / 100',f"{s['conductivitySM']} / 100",s['conductivityScm'],'S/cm');add('micro','κ(µS/cm) = κ(S/m) * 10000',f"{s['conductivitySM']} * 10000",s['conductivityMicroScm'],'µS/cm');add('conductance','Gbulk = κ * A / l',f"{s['conductivitySM']} * {s['areaM2']} / {s['gapM']}",s['bulkConductanceS'],'S');add('resistance','Rbulk = 1 / Gbulk',f"1 / {s['bulkConductanceS']}"if s['bulkConductanceS']else'Not evaluated: Gbulk = 0',s['bulkResistanceOhm'],'Ω');add('applied','Vcell = sourceConnectedFlag * Vconfigured',f"{int(q['connected'])} * {q['voltageRmsV']}",s['cellVoltageRmsV'],'V');add('current','Irms = Vcell * Gbulk',f"{s['cellVoltageRmsV']} * {s['bulkConductanceS']}",s['currentRmsA'],'A');add('microCurrent','I(µA) = I(A) * 1000000',f"{s['currentRmsA']} * 1000000",s['currentMicroA'],'µA');add('power','Pmean = Vrms * Irms',f"{s['cellVoltageRmsV']} * {s['currentRmsA']}",s['meanPowerW'],'W');add('voltagePeak','Vpeak = sqrt(2) * Vrms',f"{D(2).sqrt()} * {s['cellVoltageRmsV']}",s['voltagePeakV'],'V');add('currentPeak','Ipeak = sqrt(2) * Irms',f"{D(2).sqrt()} * {s['currentRmsA']}",s['currentPeakA'],'A');add('instantVoltage','v = Vpeak * sinPhase',f"{s['voltagePeakV']} * {s['phaseSine']}",s['instantVoltageV'],'V',(0,D('2e-15')));add('instantCurrent','i = Ipeak * sinPhase',f"{s['currentPeakA']} * {s['phaseSine']}",s['instantCurrentA'],'A',(0,D('2e-15')));add('fieldRms','Ebulk,rms = wettedFlag * Vrms / l',f"{int(s['wetted'])} * {s['cellVoltageRmsV']} / {s['gapM']}",s['fieldRmsVm'],'V/m');add('fieldInstant','Ebulk = wettedFlag * v / l',f"{int(s['wetted'])} * {s['instantVoltageV']} / {s['gapM']}",s['instantFieldVm'],'V/m',(0,s['voltagePeakV']*D('2e-15'),0));add('densityRms','Jrms = κ * Erms',f"{s['conductivitySM']} * {s['fieldRmsVm']}",s['currentDensityRmsAm2'],'A/m²');add('densityInstant','J = κ * E',f"{s['conductivitySM']} * {s['instantFieldVm']}",s['instantCurrentDensityAm2'],'A/m²',(0,s['voltagePeakV']/s['gapM']*D('2e-15')));add('densityCheck','Irms = Jrms * A',f"{s['currentDensityRmsAm2']} * {s['areaM2']}",s['currentRmsA'],'A');add('channel','Greading = Irms / Vrms',f"{s['currentRmsA']} / {s['cellVoltageRmsV']}"if s['excited']else'Not evaluated: no valid excitation/immersion',s['measuredConductanceS'],'S');add('reconstruction','κreading = Greading * Kcell',f"{s['measuredConductanceS']} * {s['cellConstantMInv']}"if s['excited']else'Not evaluated: no conductivity reading',s['reconstructedConductivitySM'],'S/m');add('reconstructionResidual','Difference = κreading - κreference',f"{s['conductivitySM']} - {s['conductivitySM']}"if s['excited']else'Not evaluated: no conductivity reading',s['reconstructionResidualSM'],'S/m');add('period','T = 1 / f','1 / 1000',s['physicalPeriodS'],'s');add('magnification','Mtime = display cycle / physical cycle',f"4 / {s['physicalPeriodS']}",4000,'dimensionless');add('waterCurrent','Iwater = Vcell * κwater * A / l',f"{s['cellVoltageRmsV']} * {water['conductivitySM']} * {s['areaM2']} / {s['gapM']}",water['currentRmsA'],'A');add('conductivityRatio','rκ = κselected / κwater',f"{s['conductivitySM']} / {water['conductivitySM']}",s['conductivitySM']/water['conductivitySM'],'dimensionless');add('currentRatio','rI = Iselected / Iwater',f"{s['currentRmsA']} / {water['currentRmsA']}"if water['currentRmsA']else'Not evaluated: water comparison current = 0',s['currentRmsA']/water['currentRmsA']if water['currentRmsA']else None,'dimensionless');add('deltaCurrent','ΔI = Iselected - Iwater',f"{s['currentRmsA']} - {water['currentRmsA']}",s['currentRmsA']-water['currentRmsA'],'A');return out
def floors(s):return{'instantVoltage':s['voltagePeakV']*D('2e-15'),'instantCurrent':s['currentPeakA']*D('2e-15'),'fieldInstant':s['voltagePeakV']/s['gapM']*D('2e-15'),'densityInstant':s['conductivitySM']*s['voltagePeakV']/s['gapM']*D('2e-15'),'reconstructionResidual':s['conductivitySM']*D('1e-14')}
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);trials=r['trials'];assert len(trials)<=40 and len(p.tables)==5
 for actual,h in zip(p.tables,HEADERS):assert actual[0]==h
 want=[[],[],[],[],[]];ws={};states={}
 for i,q in enumerate(trials):
  s=validate_inputs(q);states[i]=s;water=reference({**q,'sampleId':'water'});lead=str(i+1);time=q['guideSeconds'];label='Manual ideal bulk reading'if time is None and s['excited']else'Manual unavailable-reading control'if time is None else'Guided snapshot before verification'if time<140 else'Verified guided ideal bulk reading'if s['excited']else'Verified guide stage; conductivity reading unavailable';kind='theoretical water'if q['sampleId']=='water'else'ideal nonelectrolyte'if q['sampleId']=='sucrose'else'KCl solute reference';molality=D(SAMPLES[q['sampleId']][1])
  want[0].append([lead,TITLES[q['sampleId']],kind,molality,D(25),D(str(q['gapCm'])),D(str(q['widthCm'])),D(str(q['immersedDepthCm'])),D(str(q['voltageRmsV'])),'Yes'if q['connected']else'No',D(str(q['phaseCycle'])),'Manual'if time is None else D(str(time)),label,q['note']]);want[1].append([lead,*[s[k]for k in['conductivitySM','conductivityScm','conductivityMicroScm','areaM2','cellConstantMInv','bulkConductanceS','bulkResistanceOhm']],D(1000)]);want[2].append([lead,*[s[k]for k in['cellVoltageRmsV','currentRmsA','currentMicroA','meanPowerW','measuredConductanceS','reconstructedConductivitySM']],s['status']]);want[3].append([lead,*[s[k]for k in['instantVoltageV','instantCurrentA','instantFieldVm','instantCurrentDensityAm2']],D(s['positiveIonDirection']),D(s['negativeIonDirection']),D(s['externalElectronDirection']),D(4),D('.001')]);want[4].append([lead,water['conductivitySM'],water['currentRmsA'],s['conductivitySM']/water['conductivitySM'],s['currentRmsA']/water['currentRmsA']if water['currentRmsA']else None,s['currentRmsA']-water['currentRmsA'],'Yes','Yes'])
  for key,w in workings(q,s).items():ws[i,key]=w
 fields=0
 for ti,(actual,expected)in enumerate(zip(p.tables,want)):
  assert len(actual)-1==len(expected)
  for ri,(row,values)in enumerate(zip(actual[1:],expected)):
   assert len(row)==len(values);s=states[ri];fl=floors(s)
   for ci,(a,b)in enumerate(zip(row,values)):
    if b is None:assert a=='Unavailable'
    elif isinstance(b,(D,int)):
     floor=fl[['instantVoltage','instantCurrent','fieldInstant','densityInstant'][ci-1]]if ti==3 and 1<=ci<=4 else D(0)
     near(a,b,floor=floor)
    else:assert a==b,(ti,ri,ci,a,b)
    fields+=1
 assert len(p.blocks)==len(ws);seen=set();operands=0
 for b in p.blocks:
  key=(b['trial'],b['key']);assert key not in seen;seen.add(key);formula,expression,result,unit,operandfloors=ws[key];assert b['formula']==formula
  if result is None:assert b['substitution']==expression and b['result']=='Unavailable';continue
  operands+=tree(ast.parse(b['substitution'],mode='eval').body,ast.parse(expression,mode='eval').body,b['substitution'],expression,iter(operandfloors));value,actualunit=b['result'].split(' ',1);assert actualunit==unit;floor=floors(states[b['trial']]).get(b['key'],D(0));near(value,result,floor=floor);near(expr_value(b['substitution']),result,floor=floor);near(value,expr_value(b['substitution']),floor=floor)
 assert seen==set(ws)
 return dict(observations=len(trials),workedResults=len(ws),numericResults=sum(w[2]is not None for w in ws.values()),operandChecks=operands,tableFields=fields)
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
