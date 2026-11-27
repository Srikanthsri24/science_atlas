"""Independent Decimal material-account reference; selected progress law is not empirical rust data."""
from decimal import Decimal,localcontext
import math
D=lambda value:Decimal(str(value))
PI=D('3.141592653589793238462643383279502884197169399375105820974944592307816406286')
def validate_inputs(q):
 bounds={'ironG':(.2,1),'waterG':(20,40),'accessibleOxygenMol':(0,.005),'chosenRatePerDay':(0,1),'elapsedDays':(0,14),'hydrationNumber':(0,3),'nailLengthCm':(3,5)}
 for key,(lo,hi)in bounds.items():
  value=q.get(key);assert type(value)in(int,float)and math.isfinite(value)and lo<=value<=hi,(key,value)
 assert set(q)<=set(bounds)|{'note'}
 if 'note'in q:assert isinstance(q['note'],str)and len(q['note'])<=4000

def solve(q,id):
 validate_inputs(q);assert id in ['wet-air','oxygen-excluded','dry-air']
 with localcontext()as ctx:
  ctx.prec=80
  iron,water,oxygen,rate,days,x,L=[D(q[k])for k in['ironG','waterG','accessibleOxygenMol','chosenRatePerDay','elapsedDays','hydrationNumber','nailLengthCm']]
  MFe=D('55.845');MO2=D('31.998');MW=D('18.015');rho=D('7.87')
  w=D(0)if id=='dry-air'else water;o=D(0)if id=='oxygen-excluded'else oxygen
  Fe0=iron/MFe;water0=w/MW;f=1-(-rate*days).exp();target=Fe0*f;Olimit=4*o/3;Wlimit=2*water0/x if x else None;conditions=w>0 and o>0
  used=min(target,Olimit,Wlimit if Wlimit is not None else Fe0)if conditions else D(0)
  oxide=used/2;usedG=used*MFe;leftG=iron-usedG;left=leftG/MFe;Oused=used*3/4;Oleft=o-Oused;OinitialG=o*MO2;OusedG=Oused*MO2;OleftG=Oleft*MO2;Wused=x*oxide;WusedG=Wused*MW;WleftG=w-WusedG;Wleft=WleftG/MW;dryG=usedG+OusedG;productG=dryG+WusedG;formula=2*MFe+D('1.5')*MO2+x*MW;specimen=leftG+productG;gain=OusedG+WusedG;initial=iron+w+OinitialG;final=specimen+WleftG+OleftG;V0=iron/rho;Vleft=leftG/rho;r0=(V0/(PI*(L+D('.28')))).sqrt();rleft=r0*(leftG/iron).sqrt()
  condition='water-excluded'if id=='dry-air'else'oxygen-excluded'if not o else'zero-rate-reference'if not rate else'initial-reference'if not used else'matched-target-and-oxygen-reference'if abs(target-Olimit)<=max(target,Olimit)*D('1e-12')else'oxygen-limited-reference'if used==Olimit else'hydration-water-limited-reference'if Wlimit is not None and used==Wlimit else'chosen-progress-reference'
  return dict(id=id,initialWaterG=w,initialOxygenMol=o,initialIronMol=Fe0,initialWaterMol=water0,chosenProgressFraction=f,targetIronMol=target,oxygenIronLimitMol=Olimit,waterIronLimitMol=Wlimit,convertedIronMol=used,oxideReferenceMol=oxide,convertedIronG=usedG,remainingIronG=leftG,remainingIronMol=left,oxygenConsumedMol=Oused,oxygenRemainingMol=Oleft,oxygenInitialG=OinitialG,oxygenConsumedG=OusedG,oxygenRemainingG=OleftG,hydrationWaterMol=Wused,hydrationWaterG=WusedG,remainingWaterG=WleftG,remainingWaterMol=Wleft,dryOxideReferenceG=dryG,productReferenceG=productG,referenceFormulaGmol=formula,retainedSpecimenG=specimen,specimenMassGainG=gain,initialAccountG=initial,finalAccountG=final,massResidualG=initial-final,ironAtomResidualMol=Fe0-left-2*oxide,oxygenAtomResidualMol=2*o+water0-2*Oleft-Wleft-(3+x)*oxide,hydrogenAtomResidualMol=2*water0-2*Wleft-2*x*oxide,convertedFraction=usedG/iron,initialIronMl=V0,remainingIronMl=Vleft,shaftRadiusCm=r0,remainingRadiusCm=rleft,conditionsPresent=conditions,newProductCalculated=used>0,condition=condition)
