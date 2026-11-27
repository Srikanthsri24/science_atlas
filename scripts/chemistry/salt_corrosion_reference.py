"""Independent80-digit Decimal charge/transport/mass reference for CL-0107."""
from decimal import Decimal,localcontext
import math
D=lambda value:Decimal(str(value))
def validate_inputs(q):
 assert q.get('mode')in['dilute','entered']
 bounds={'ironG':(.2,1),'solutionG':(20,100),'exposedAreaCm2':(4,20),'saltPctA':(0,10),'saltPctB':(0,10),'densityA':(.99,1.2),'densityB':(.99,1.2),'conductivityA':(5.5e-6,30),'conductivityB':(5.5e-6,30),'oxygenMgLA':(0,12),'oxygenMgLB':(0,12),'driveV':(0,.2),'solutionPathMm':(2,20),'boundaryLayerMm':(.1,2),'ceilingFraction':(0,1),'elapsedDays':(0,14)}
 for key,(lo,hi)in bounds.items():
  value=q.get(key);assert type(value)in(int,float)and math.isfinite(value)and lo<=value<=hi,(key,value)
 for key in['saltPctA','saltPctB','oxygenMgLA','oxygenMgLB','driveV','ceilingFraction']:assert q[key]==0 or q[key]>=1e-6,(key,q[key])
 if q['mode']=='dilute':assert q['saltPctA']<=.05 and q['saltPctB']<=.05
 assert set(q)<=set(bounds)|{'mode','note'}
 if 'note'in q:assert isinstance(q['note'],str)and len(q['note'])<=4000

def solve(q,id):
 validate_inputs(q);assert id in['a','b']
 with localcontext()as ctx:
  ctx.prec=80
  F=D('6.02214076e23')*D('1.602176634e-19');MFe=D('55.845');MO=D('31.998');MW=D('18.015');MS=D('58.44');rho=D('7.87')
  suffix=id.upper();percent=D(q['saltPct'+suffix]);DO=D(q['oxygenMgL'+suffix]);density=D(1)if q['mode']=='dilute'else D(q['density'+suffix]);Fe=D(q['ironG']);mass=D(q['solutionG']);Acm=D(q['exposedAreaCm2']);eta=D(q['ceilingFraction']);drive=D(q['driveV']);time=D(q['elapsedDays'])*86400
  salt=mass*percent/100;water=mass-salt;nsalt=salt/MS;VmL=mass/density;Vm3=VmL/1000000;cNa=nsalt/Vm3;M=nsalt/(VmL/1000);molal=nsalt/(water/1000)
  sigma=D('5.5e-6')+D('.01265')*cNa if q['mode']=='dilute'else D(q['conductivity'+suffix]);area=Acm/10000;L=D(q['solutionPathMm'])/1000;delta=D(q['boundaryLayerMm'])/1000;CO=DO/MO;JO=D('2e-9')*CO/delta;ohm=sigma*drive/L;ox=JO*F*D(8)/3;ceiling=min(ohm,ox);j=eta*ceiling;I=j*area;R=L/(sigma*area);Qmax=Fe/MFe*2*F;exhaust=Qmax/I if I else None;active=min(time,exhaust)if exhaust is not None else D(0);done=exhaust is not None and time>=exhaust
  # Independently cap material converted before deriving actual primary charge.
  converted=min(Fe,I*time*MFe/(2*F));nFe=converted/MFe;Q=nFe*2*F;remaining=Fe-converted;nowI=D(0)if done else I;meanI=Q/time if time else None;e=2*nFe;secondary=nFe*F;total=3*nFe*F;Ocath=nFe/2;Omore=nFe/4;Ototal=3*nFe/4;Omass=Ototal*MO;product=nFe/2;Whyd=product;WhydG=Whyd*MW;productG=converted+Omass+WhydG;specimen=remaining+productG;gain=Omass+WhydG;initial=Fe+mass;external=Omass+WhydG;final=specimen+mass;VFe=Fe/rho;Vremain=remaining/rho;face=Acm/2;side=face.sqrt();thickness=VFe/face;leftthickness=Vremain/face;depth=converted/(rho*Acm)*10;rate=nowI*MFe/(2*F);meanrate=converted/(time/86400)if time else None;Oflux=3*nowI/(8*F*area)
  regime='zero-driving-reference'if not drive else'oxygen-absent'if not DO else'matched-ceilings'if abs(ohm-ox)<=max(ohm,ox)*D('1e-12')else'resistance-limited'if ohm<ox else'oxygen-transport-limited'
  return dict(id=id,percent=percent,oxygenMgL=DO,densityGml=density,saltG=salt,waterG=water,saltMol=nsalt,solutionMl=VmL,solutionM3=Vm3,saltMolM3=cNa,molarityMolL=M,molalityMolKg=molal,conductivitySM=sigma,areaM2=area,pathM=L,boundaryLayerM=delta,oxygenMolM3=CO,oxygenFluxCeilingMolM2S=JO,ohmicCeilingAM2=ohm,oxygenCeilingAM2=ox,currentCeilingAM2=ceiling,referenceCurrentAM2=j,initialCurrentA=I,resistanceOhm=R,elapsedS=time,exhaustionChargeC=Qmax,exhaustionS=exhaust,activeS=active,primaryChargeC=Q,convertedIronMol=nFe,convertedIronG=converted,remainingIronG=remaining,instantaneousCurrentA=nowI,meanCurrentA=meanI,primaryElectronMol=e,secondaryEquivalentChargeC=secondary,totalRedoxEquivalentChargeC=total,cathodicOxygenMol=Ocath,furtherOxygenMol=Omore,oxygenSuppliedMol=Ototal,oxygenSuppliedG=Omass,productReferenceMol=product,hydrationWaterSuppliedMol=Whyd,hydrationWaterSuppliedG=WhydG,productReferenceG=productG,retainedSpecimenG=specimen,specimenGainG=gain,initialCarrierAccountG=initial,externalInputG=external,finalCarrierAccountG=final,materialResidualG=initial+external-final,ironAtomResidualMol=Fe/MFe-remaining/MFe-2*product,oxygenAtomResidualMol=2*Ototal+Whyd-4*product,hydrogenAtomResidualMol=2*Whyd-2*product,primaryChargeResidualC=Q-2*F*nFe,totalRedoxResidualC=total-4*F*Ototal,initialIronMl=VFe,remainingIronMl=Vremain,faceAreaCm2=face,sideCm=side,initialThicknessCm=thickness,remainingThicknessCm=leftthickness,penetrationPerFaceMm=depth,currentMassLossGS=rate,meanMassLossGDay=meanrate,currentTotalOxygenFluxMolM2S=Oflux,limitingRegime=regime,exhausted=done,newProductCalculated=nFe>0)
