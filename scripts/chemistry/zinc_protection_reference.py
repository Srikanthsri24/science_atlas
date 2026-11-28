"""Independent 80-digit Decimal solution of the selected finite-metal reference."""
from decimal import Decimal, localcontext
D=lambda v: Decimal(str(v))
F=D('6.02214076e23')*D('1.602176634e-19')
FE,ZN,O2,W,OH=map(D,['55.845','65.38','31.998','18.015','17.007'])
IDS=['bare','intact','scratched','isolated']
def cell(q,id):
 with localcontext() as ctx:
  ctx.prec=80
  a={k:D(q[k])for k in ('ironG','zincG','carrierG','areaCm2','scratchFraction','ironDemandUAcm2','zincSupportUAcm2','zincSelfUAcm2','oxygenCapacityUA','elapsedDays')}
  defect=D(1)if id=='bare'else D(0)if id=='intact'else a['scratchFraction'];coat=1-defect
  iz=a['zincG']*coat;unused=a['zincG']-iz;contact=id=='intact'or(id=='scratched'and q['connected'])
  cf=2*F*a['ironG']/FE;cz=2*F*iz/ZN;t=a['elapsedDays']*86400
  def rate(fe,zn):
   af=a['areaCm2']*(defect if zn and contact else 1)if fe else D(0);az=a['areaCm2']*coat*(1 if contact else 2)if zn else D(0)
   demand=a['ironDemandUAcm2']*af/D(1000000);own=a['zincSelfUAcm2']*az/D(1000000)
   scale=min(D(1),a['oxygenCapacityUA']/D(1000000)/(demand+own))if q['wet']and demand+own else D(0)
   prot=min(demand,a['zincSupportUAcm2']*az/D(1000000))*scale if contact and fe and zn else D(0)
   return demand*scale-prot,own*scale+prot,prot,own*scale,scale,af,az,demand*scale
  r0=rate(True,iz>0);tf=cf/r0[0]if r0[0]else D('Infinity');tz=cz/r0[1]if r0[1]else D('Infinity')
  first=min(tf,tz);dt=min(t,first);qf=r0[0]*dt;qz=r0[1]*dt;qp=r0[2]*dt;qs=r0[3]*dt
  ef=tf if tf<=t else None;ez=tz if tz<=t else None
  if first<=t:
   fe_alive=tf>first;zn_alive=iz>0 and tz>first
   if not fe_alive:qf=cf
   if not zn_alive:qz=cz
   r1=rate(fe_alive,zn_alive);left=t-first
   next_fe=(cf-qf)/r1[0]if r1[0]else D('Infinity');next_zn=(cz-qz)/r1[1]if r1[1]else D('Infinity');second=min(next_fe,next_zn)
   dt1=min(left,second);qf+=r1[0]*dt1;qz+=r1[1]*dt1;qp+=r1[2]*dt1;qs+=r1[3]*dt1
   if next_fe<=left:qf=cf;ef=first+next_fe
   if next_zn<=left:qz=cz;ez=first+next_zn
   # A third phase can only be idle: both finite metals are exhausted, or one never had current.
  qf=min(cf,qf);qz=min(cz,qz);fe_ex=qf==cf;zn_ex=cz>0 and qz==cz
  r=rate(not fe_ex,cz>0 and not zn_ex)
  mf=a['ironG']if fe_ex else qf*FE/(2*F);mz=iz if zn_ex else qz*ZN/(2*F);lf=a['ironG']-mf;lz=iz-mz;nf=mf/FE;nz=mz/ZN;nm=nf+nz;charge=qf+qz;ox=nm/2;water=nm;og=ox*O2;wg=water*W;pf=nf*(FE+2*OH);pz=nz*(ZN+2*OH);prod=pf+pz;initial=a['ironG']+a['zincG']+a['carrierG'];external=og+wg;final=lf+lz+unused+a['carrierG']+prod
  result=dict(id=id,defect=defect,coatedFraction=coat,metalContact=contact,initialZincG=iz,unappliedZincG=unused,ironCapacityC=cf,zincCapacityC=cz,elapsedS=t,ironChargeC=qf,zincChargeC=qz,protectiveChargeC=qp,zincSelfChargeC=qs,primaryChargeC=charge,ironExhaustionS=ef,zincExhaustionS=ez,ironExhausted=fe_ex,zincExhausted=zn_ex,convertedIronG=mf,convertedZincG=mz,remainingIronG=lf,remainingZincG=lz,ironMol=nf,zincMol=nz,totalMetalMol=nm,oxygenSuppliedMol=ox,waterSuppliedMol=water,oxygenSuppliedG=og,waterSuppliedG=wg,ironHydroxideEquivalentG=pf,zincHydroxideEquivalentG=pz,productsEquivalentG=prod,initialAccountG=initial,externalInputG=external,finalAccountG=final,materialResidualG=final-initial-external,primaryChargeResidualC=charge-2*F*nm,zincChargePartitionResidualC=qz-qp-qs,oxygenChargeResidualC=charge-4*F*ox,ironAtomResidualMol=a['ironG']/FE-lf/FE-nf,zincAtomResidualMol=a['zincG']/ZN-lz/ZN-unused/ZN-nz,oxygenAtomResidualMol=2*ox+water-2*nm,hydrogenAtomResidualMol=2*water-2*nm,ironEquivalentAvoidedG=qp*FE/(2*F),initialIronVolumeMl=a['ironG']/D('7.87'),remainingIronVolumeMl=lf/D('7.87'),initialZincVolumeMl=iz/D('7.134'),remainingZincVolumeMl=lz/D('7.134'),meanCurrentA=charge/t if t else None)
  result.update(zip(['ironCurrentA','zincCurrentA','protectiveCurrentA','zincSelfCurrentA','oxygenScale','exposedIronAreaCm2','exposedZincAreaCm2','selectedDemandA'],r));return result
