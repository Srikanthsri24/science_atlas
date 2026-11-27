"""CL-0103 independent60-digit Decimal material/reference model.
Solves first-order survival with Decimal exp; derives conversion by subtraction,
and reconstructs gas volume by initial/final total gas state rather than renderer.
"""
from decimal import Decimal,localcontext
D=lambda x:Decimal(str(x))
def solve(q,k):
 with localcontext()as ctx:
  ctx.prec=60
  v,C,t,T,P,k=map(D,[q['volumeMl'],q['concentrationMolL'],q['elapsedS'],q['temperatureK'],q['pressureKpa'],k]);R=D('8.314');n0=C*v/1000;n=n0*(-k*t).exp();used=n0-n;oxygen=used/2;air=P*((100-v)/1000)/(R*T);gasmol=air+oxygen;gasall=gasmol*R*T/P*1000;increment=gasall-(100-v);rateO=k*n/2;airg=air*D('28.97');solvent=v-n0*D('34.014');water=used*D('18.015');peroxide=n*D('34.014');og=oxygen*D('31.998');liquid=solvent+water+peroxide;gas=airg+og;initial=v+airg;final=liquid+gas
  return dict(k=k,initialPeroxideMol=n0,remainingFraction=(-k*t).exp(),conversion=1-(-k*t).exp(),remainingPeroxideMol=n,consumedPeroxideMol=used,extentMol=oxygen,oxygenMol=oxygen,createdWaterMol=used,remainingConcentrationMolL=C*(-k*t).exp(),disappearanceMolLS=k*C*(-k*t).exp(),reactionRateMolLS=k*C*(-k*t).exp()/2,oxygenRateMolS=rateO,gasMl=increment,gasRateMlS=rateO*R*T/P*1000,maximumGasMl=n0/2*R*T/P*1000,headspaceMl=100-v,initialAirMol=air,totalGasMol=gasmol,oxygenMoleFraction=(air*D(".2095")+oxygen)/gasmol,totalGasVolumeMl=gasall,initialPeroxideG=n0*D('34.014'),initialSolventG=solvent,remainingPeroxideG=peroxide,createdWaterG=water,oxygenG=og,initialAirG=airg,liquidG=liquid,gasG=gas,initialContentsG=initial,finalContentsG=final,massResidualG=initial-final,hydrogenResidualMol=2*n0-2*n-2*used,oxygenResidualMol=2*n0-2*n-used-2*oxygen,halfLifeS=D(2).ln()/k if k else None,t90S=D(10).ln()/k if k else None,meanGasRateMlS=increment/t if t else None,inferredK=k if t and n0 else None)
