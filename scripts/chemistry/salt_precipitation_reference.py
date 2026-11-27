"""Independent CL-0102 Decimal coupled-volume quadratic,not app's free-minor-ion bisection."""
from decimal import Decimal,localcontext
D=lambda x:Decimal(str(x))
def solve(q):
 with localcontext()as ctx:
  ctx.prec=60
  water,va0,vb0,ca,cb,fa,fb=map(D,[q[k]for k in['receiverMl','silverStockMl','chlorideStockMl','silverMolL','chlorideMolL','silverFraction','chlorideFraction']]);ksp=D('1.8e-10');mm=D('143.318');rho=D('5.56');na0=va0*ca/1000;nb0=vb0*cb/1000;va=va0*fa;vb=vb0*fb;na=na0*fa;nb=nb0*fb;volume=water+va+vb;v=volume/1000;beta=mm/rho/1000;q0=na*nb/v**2
  extent=D(0)
  if q0>ksp:
   aa=1-ksp*beta**2;bb=na+nb-2*ksp*v*beta;cc=na*nb-ksp*v*v;disc=(na-nb)**2+4*ksp*(v-beta*na)*(v-beta*nb);extent=2*cc/(bb+disc.sqrt())
  ag=na-extent;cl=nb-extent;solid=extent*mm;solidml=solid/rho;aqml=volume-solidml;aq=aqml/1000
  wa0=va0-na0*D('169.872');wb0=vb0-nb0*D('58.440');receiverWater=water+wa0*fa+wb0*fb
  ions=ag*D('107.868')+cl*D('35.450')+na*D('62.004')+nb*D('22.990');liquid=receiverWater+ions;initial=water+va0+vb0;final=va0-va+vb0-vb+liquid+solid
  return{'silverInitialMol':na0,'chlorideInitialMol':nb0,'silverDeliveredMl':va,'chlorideDeliveredMl':vb,'silverDeliveredMol':na,'chlorideDeliveredMol':nb,'silverStockRemainingMl':va0-va,'chlorideStockRemainingMl':vb0-vb,'silverStockRemainingMol':na0-na,'chlorideStockRemainingMol':nb0-nb,'nominalMixtureMl':volume,'nominalMixtureL':v,'analyticalSilverMolL':na/v,'analyticalChlorideMolL':nb/v,'initialIonProduct':q0,'precipitateMol':extent,'precipitateG':solid,'solidMl':solidml,'aqueousMl':aqml,'aqueousL':aq,'freeSilverMol':ag,'freeChlorideMol':cl,'freeSilverMolL':ag/aq,'freeChlorideMolL':cl/aq,'nitrateMol':na,'sodiumMol':nb,'nitrateMolL':na/aq,'sodiumMolL':nb/aq,'finalIonProduct':ag*cl/aq**2,'silverInitialWaterG':wa0,'chlorideInitialWaterG':wb0,'silverStockWaterG':wa0*(1-fa),'chlorideStockWaterG':wb0*(1-fb),'receiverWaterG':receiverWater,'receiverIonsG':ions,'receiverLiquidG':liquid,'initialContentsG':initial,'finalContentsG':final,'massResidualG':initial-final,'silverResidualMol':na0-(na0-na)-ag-extent,'chlorideResidualMol':nb0-(nb0-nb)-cl-extent,'sodiumResidualMol':nb0-(nb0-nb)-nb,'nitrateResidualMol':na0-(na0-na)-na,'chargeResidualMol':ag+nb-cl-na,'volumeResidualMl':water+va0+vb0-(va0-va)-(vb0-vb)-aqml-solidml}
