"""Independent CL-0101 Decimal reference: explicit protonation polynomials and
linear-H charge root,not app's recursive weights/log-H root."""
from decimal import Decimal,localcontext
D=lambda x:Decimal(str(x))
def solve(q):
 with localcontext() as ctx:
  ctx.prec=55;kw=D('1e-14');vol=D(q['volumeMl']);kaL=D(10)**(-D('3.86'));cit=[D(10)**(-D(p))for p in ['3.13','4.76','6.4']]
  specs=[('water',D(0),[],D(0),D(0)),('acetic',D(q['aceticMolL']),[D('1.75e-5')],D(0),D('60.052')),('lactic',D(q['lacticMolL']),[kaL],D(0),D('90.078')),('citric',D(q['citricMolL']),cit,D(0),D('192.123')),('bicarbonate',D(q['bicarbonateMolL']),[D('4.45e-7'),D('4.68e-11')],D(q['bicarbonateMolL']),D('84.006'))]
  cells=[]
  for name,c,ks,na,mm in specs:
   def fractions(h):
    if not ks:return[D(1)]
    if len(ks)==1:terms=[h,ks[0]]
    elif len(ks)==2:terms=[h*h,ks[0]*h,ks[0]*ks[1]]
    else:terms=[h**3,ks[0]*h*h,ks[0]*ks[1]*h,ks[0]*ks[1]*ks[2]]
    den=sum(terms);return[t/den for t in terms]
   def residual(h):return h+na-kw/h-c*sum(i*f for i,f in enumerate(fractions(h)))
   lo,hi=D('1e-14'),D(1)
   for _ in range(190):
    mid=(lo+hi)/2
    if residual(mid)>0:hi=mid
    else:lo=mid
   h=(lo+hi)/2 if c else kw.sqrt();fs=fractions(h);species=[c*f for f in fs];formal=c*vol/1000;mass=formal*mm
   cells.append({'id':name,'hMolL':h,'ohMolL':kw/h,'pH':-h.log10(),'fractions':fs,'speciesMolL':species,'anionChargeMolL':sum(i*v for i,v in enumerate(species)),'residual':residual(h),'formalMol':formal,'soluteG':mass,'waterG':vol-mass,'nominalContentsG':vol,'sodiumMol':na*vol/1000,'speciesMol':[v*vol/1000 for v in species],'formalResidualMolL':c-sum(species)})
  return{'cells':cells,'totalSoluteG':sum(c['soluteG']for c in cells),'totalSolventG':sum(c['waterG']for c in cells),'totalContentsG':5*vol,'massResidualG':D(0)}
