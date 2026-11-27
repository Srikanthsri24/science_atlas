"""Independent CL-0104 high-precision analytic separable-integral inversion.
Does not use the application RK4 mesh/cache. mpmath is an isolated reference dependency.
"""
import sys
sys.path.insert(0,'/tmp/atlas-chemistry-reference-libs')
import mpmath as mp
mp.mp.dps=55
D=lambda x:mp.mpf(str(x))
def fraction(alpha,delta,beta,t):
 if not beta or not delta or not t:return mp.mpf(1)
 a=delta-alpha;target=beta*t
 if not a:return 1/mp.sqrt(1+2*beta*alpha*t)
 if a>0:
  scale=mp.root(a/alpha,3)
  def F(z):return mp.log(1+z)/3-mp.log(z*z-z+1)/6+mp.atan((2*z-1)/mp.sqrt(3))/mp.sqrt(3)
  def G(x):return scale/a*F(x/scale)
  top=G(1)
  if top-G(0)<=target:return mp.mpf(0)
  lo,hi=mp.mpf(0),mp.mpf(1)
 else:
  r=mp.root(-a/alpha,3)
  def G(x):return(mp.log(x-r)/3-mp.log(x*x+r*x+r*r)/6-mp.atan((2*x+r)/(mp.sqrt(3)*r))/mp.sqrt(3))/(alpha*r*r)
  top=G(1);lo,hi=r,mp.mpf(1)
 for _ in range(80):
  mid=(lo+hi)/2
  if top-G(mid)>target:lo=mid
  else:hi=mid
 return(lo+hi)/2
_cache={}
def solve(q,count):
 key=tuple(q[k]for k in['waterG','saltG','initialSaturation','fluxGcm2S','elapsedS'])+(count,)
 if key in _cache:return _cache[key]
 w,m,f,J,t=map(D,[q[k]for k in['waterG','saltG','initialSaturation','fluxGcm2S','elapsedS']]);N=D(count);rho=D('2.17');cap=D('.36')*w;initial=f*cap;available=cap-initial;eqextra=min(m,available);eqsolid=m-eqextra;alpha=m/cap;delta=1-f;edge0=mp.root(m/(rho*N),3);beta=2*J/(rho*edge0);minimum=mp.root(max(mp.mpf(0),1-delta/alpha),3);x=fraction(alpha,delta,beta,t);solid=m*x**3;extra=m-solid;diss=initial+extra;edge=edge0*x;area0=6*N*edge0**2;area=6*N*edge**2;sat=diss/cap;drive=max(mp.mpf(0),1-sat);rate=J*area*drive;initialrate=J*area0*delta;solution=w+diss;waterv=w;solutionv=w+diss*D('.28');solidv=solid/rho;initialcontents=w+initial+m;finalcontents=solution+solid
 s=dict(count=N,edgeLossFraction=1-x,capacityG=cap,initialDissolvedG=initial,availableCapacityG=available,equilibriumAdditionalG=eqextra,equilibriumSolidG=eqsolid,alpha=alpha,delta=delta,beta=beta,minimumX=minimum,initialEdgeCm=edge0,edgeCm=edge,initialAreaCm2=area0,areaCm2=area,additionalDissolvedG=extra,solidG=solid,totalDissolvedG=diss,saturationFraction=sat,drivingFraction=drive,rateGS=rate,initialRateGS=initialrate,solutionG=solution,waterMl=waterv,solutionMl=solutionv,solidMl=solidv,mixtureMl=solutionv+solidv,initialContentsG=initialcontents,finalContentsG=finalcontents,wholeSaltG=diss+solid,massResidualG=initialcontents-finalcontents,saltResidualG=initial+m-diss-solid,meanRateGS=extra/t if t else None,convertedFraction=extra/m,initialSolidMl=m/rho,edgeShrinkCmS=2*J/rho*drive if solid>0 else mp.mpf(0),complete=solid==0)
 _cache[key]=s;return s
