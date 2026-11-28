"""Independent exact fractional boundary and integer molecular accounts."""
import json,sys,itertools
from fractions import Fraction
from pathlib import Path
MOLECULES={'H2O':('Water',{'O':1,'H':2},2),'CH4':('Methane',{'C':1,'H':4},4),'CO2':('Carbon dioxide',{'C':1,'O':2},4)}
def expected(q):
 n=q['repeats'];end=2*n;index=tuple(map(int,q['selectedSite'].split(':')));assert n in[1,2,3]and all(0<=i<=end for i in index);size=(end+1)**3;boundary=sum(i in[0,end]for i in index);chloride=sum(index)%2==0;groups=[]
 for kind,b in [('corner',3),('edge',2),('face',1),('interior',0)]:
  for species in['Na+','Cl−']:
   count=sum(sum(i in[0,end]for i in p)==b and('Cl−'if sum(p)%2==0 else'Na+')==species for p in itertools.product(range(end+1),repeat=3));groups.append(dict(boundary=kind,species=species,rawCount=count,weight=float(Fraction(1,2**b)),effectiveCount=float(Fraction(count,2**b))))
 selected=dict(id=q['selectedSite'],index=list(index),position=[i/2 for i in index],species='Cl−'if chloride else'Na+',chargeUnits=-1 if chloride else 1,boundaryAxes=boundary,weight=float(Fraction(1,2**boundary)),boundary=['interior','face','edge','corner'][boundary],shownNeighbours=6-boundary,bulkCoordination=6)
 neighbours=[]
 for axis in range(3):
  for sign in[-1,1]:
   p=list(index);p[axis]+=sign;neighbours.append(dict(id=f"{q['selectedSite']}:{axis}:{sign}",axis=axis,sign=sign,index=p,position=[i/2 for i in p],insideDisplayedBox=all(0<=i<=end for i in p),canonicalPeriodicSite=':'.join(str(i%end)for i in p),species='Na+'if chloride else'Cl−',distanceCellUnits=.5))
 name,elements,bonds=MOLECULES[q['molecule']];count=q['moleculeCount'];assert type(count)is int and 1<=count<=8;sodium=(size-1)//2;chlorine=(size+1)//2;effective=4*n**3;assert sum(g['effectiveCount']for g in groups if g['species']=='Na+')==effective and sum(g['effectiveCount']for g in groups if g['species']=='Cl−')==effective
 return dict(inputs=q,selected=selected,neighbours=neighbours,groups=groups,conventionalCells=n**3,normalizedVolume=n**3,rawSodium=sodium,rawChloride=chlorine,rawSites=size,rawBoundaryCopyChargeUnits=-1,effectiveSodium=effective,effectiveChloride=effective,effectiveIons=2*effective,formulaUnits=effective,stoichiometricRatio='1:1',weightedChargeUnits=0,formulaUnitResidual=0,bulkCoordination=6,selectedShownNeighbours=6-boundary,selectedOutsideNeighbours=boundary,sliceSites=size if q['slice']is None else(end+1)**2,nearestOppositeDistance=.5,moleculeName=name,molecularFormula=q['molecule'],moleculeCount=count,molecularElements={e:v*count for e,v in elements.items()},molecularAtoms=sum(elements.values())*count,molecularBondOrder=bonds*count,molecularSharedElectrons=2*bonds*count,molecularChargeUnits=0,molecularIntergroupCovalentBonds=0,displayScope='Periodic reference box with boundary-sharing weights, not an isolated finite crystal; molecular positions form a comparison rack, not a measured solid packing.')
def check(actual,want):
 if isinstance(want,dict):assert set(actual)==set(want);return sum(check(actual[k],v)for k,v in want.items())
 if isinstance(want,list):assert len(actual)==len(want);return sum(check(a,b)for a,b in zip(actual,want))
 assert type(actual)is type(want)or type(actual)in[int,float]and type(want)in[int,float]
 assert actual==want,(actual,want);return 1
def validate(rows):return dict(comparisons=len(rows),exactFieldChecks=sum(check(r['state'],expected(r['input']))for r in rows))
if __name__=='__main__':print('PASS',json.dumps(validate(json.loads(Path(sys.argv[1]).read_text()))))
