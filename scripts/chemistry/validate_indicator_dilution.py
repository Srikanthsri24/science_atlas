"""Independent CL-0099 core check: Decimal charge-balance bisection,not JS quadratic root."""
import json,sys
from decimal import Decimal,localcontext
D=lambda x:Decimal(str(x))
def validate(cases):
 checks=0
 def near(actual,expected,label):
  nonlocal checks
  checks+=1
  if abs(D(actual)-expected)>max(Decimal('1e-24'),abs(expected)*Decimal('2e-11')):raise AssertionError(f'{label}: {actual} != {expected}')
 with localcontext() as ctx:
  ctx.prec=60
  for case in cases:
   q,s=case['inputs'],case['state'];v0,c0,w=map(D,[q['sampleMl'],q['stockMolL'],q['waterMl']]);a,b=map(D,[q['orangeFraction'],q['phenolFraction']]);kw=Decimal('1e-14')
   near(s['reservoirRemainingMl'],2*w-w*a-w*b,'reservoir')
   total=2*w-w*a-w*b
   for i,cell in enumerate(s['cells']):
    added=w*([D(0),a,D(0),b][i]);vol=v0+added;n=c0*v0/1000;c=n*1000/vol
    # Solve majority - Kw/majority = formal concentration using monotonic bisection.
    lo,hi=kw.sqrt(),c+kw.sqrt()
    for _ in range(240):
     mid=(lo+hi)/2
     if mid-kw/mid<c:lo=mid
     else:hi=mid
    major=(lo+hi)/2;h=major if q['kind']=='acid' else kw/major
    expected={'addedWaterMl':added,'volumeMl':vol,'formalMol':n,'formalMolL':c,'indicatorMg':v0/1000,'indicatorMgL':v0/vol,'concentrationRatio':v0/vol,'hMolL':h,'ohMolL':kw/h,'pH':-h.log10(),'fillHeightCm':vol/10,'opticalPathCm':D(2)}
    for key,value in expected.items():near(cell[key],value,f'cell{i}.{key}')
    family=('red' if -h.log10()<D('3.1') else 'yellow' if -h.log10()>D('4.4') else 'transition') if i<2 else ('colourless' if -h.log10()<D('8.2') else 'pink' if -h.log10()>10 else 'transition')
    if cell['colourFamily']!=family:raise AssertionError('Colour-family mismatch')
    total+=vol
   near(s['finalTotalMl'],total,'total');near(s['initialTotalMl'],4*v0+2*w,'initial');near(s['finalContentsG'],total,'contents mass')
 return checks
if __name__=='__main__':
 cases=json.load(open(sys.argv[1]));print(f'PASS {len(cases)} cases; {validate(cases)} independently recomputed fields')
