"""Independent CL-0100 Decimal reference. Acid root closes carbon after deriving
CO2* from electroneutrality; app instead eliminates pressure and closes charge.
Base root uses hydroxide as unknown,not app's dissolved-calcium variable.
"""
from decimal import Decimal,localcontext
D=lambda v:Decimal(str(v))
def root(lo,hi,fn):
 for _ in range(180):
  mid=(lo+hi)/2
  if fn(mid)>0:hi=mid
  else:lo=mid
 return (lo+hi)/2
def solve(q):
 with localcontext() as ctx:
  ctx.prec=55
  w,head,gas,oxide,gf,of,hf=map(D,[q[k] for k in ['waterMl','headspaceMl','gasStockMl','oxideG','gasFraction','oxideFraction','hydrationFraction']]);vl=w/1000;vg=head/1000;rt=D('.08205736608096')*D('298.15');kw=D('1e-14');kh=D('.03406');k1=D('4.45e-7');k2=D('4.68e-11');ksp=D('5.02e-6');n0=gas/1000/rt;delivered=n0*gf
  def acid(h):
   c0=(h-kw/h)/(k1/h+2*k1*k2/h**2);p=c0/kh;b=c0*k1/h;c=c0*k1*k2/h**2
   return c0,p,b,c,p*vg/rt+vl*(c0+b+c)
  h=kw.sqrt() if delivered==0 else root(kw.sqrt(),D('.1'),lambda x:acid(x)[4]-delivered)
  c0,p,b,c,accounted=acid(h);aq=vl*(c0+b+c);ng=p*vg/rt
  ohsat=root(kw.sqrt(),D(1),lambda x:(x-kw/x)/2*x*x-ksp);casat=(ohsat-kw/ohsat)/2
  nOx=oxide/D('56.077');extent=nOx*hf;caN=min(extent,casat*vl);solid=extent-caN;ca=caN/vl;oh=ca+(ca*ca+kw).sqrt();bh=kw/oh
  pan=oxide*(1-of);unreacted=nOx*(of-hf);waterConsumed=extent*D('18.015');waterLeft=w-waterConsumed;liquid=waterLeft+caN*D('74.092');oxsolid=unreacted*D('56.077');hsolid=solid*D('74.092');acidLiquid=w+aq*D('44.009');initial=3*w+oxide+n0*D('44.009');final=w+acidLiquid+(n0-delivered+ng)*D('44.009')+pan+liquid+oxsolid+hsolid
  flat={'gasInitialMol':n0,'gasDeliveredMol':delivered,'gasStoredMol':n0-delivered,'gasStoredMl':(n0-delivered)*rt*1000,'acidAqueousCarbonMol':aq,'acidGasCarbonMol':ng,'acidCarbonResidualMol':delivered-accounted,'acidPH':-h.log10(),'acidLiquidG':acidLiquid,'oxideInitialMol':nOx,'oxideDeliveredMol':nOx*of,'hydratedMol':extent,'oxidePanG':pan,'oxideUnreactedMol':unreacted,'waterConsumedG':waterConsumed,'baseWaterG':waterLeft,'saturationCaMolL':casat,'dissolvedCaMol':caN,'solidHydroxideMol':solid,'baseCaMolL':ca,'baseOHMolL':oh,'baseHMolL':bh,'basePH':-bh.log10(),'baseIonProduct':ca*oh*oh,'baseChargeResidualMolL':2*ca+bh-oh,'baseLiquidG':liquid,'oxideSolidG':oxsolid,'hydroxideSolidG':hsolid,'baseSolidMl':oxsolid/D('3.34')+hsolid/D('2.24'),'initialTrackedG':initial,'finalTrackedG':final,'massResidualG':initial-final}
  flat['baseDisplacedMl']=w+flat['baseSolidMl'];flat.update({'acid.hMolL':h,'acid.ohMolL':kw/h,'acid.pressureAtm':p,'acid.co2StarMolL':c0,'acid.bicarbonateMolL':b,'acid.carbonateMolL':c,'acid.chargeResidualMolL':h-kw/h-b-2*c})
  return flat
