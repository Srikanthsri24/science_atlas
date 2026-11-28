"""Independent exact structural report, expressions, units, timing and tables."""
import ast,json,math,sys
from pathlib import Path
from validate_valency_molecules_report import Report as BaseReport
from validate_neutral_atoms_report import tree_compare,evaluate
from validate_particle_arrangements import expected,MOLECULES
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):super().handle_starttag(tag,[(k,'valency-molecules-record-inputs'if k=='id'and v=='particle-arrangements-record-inputs'else v)for k,v in attrs])
def f(n):return str(n).removesuffix('.0')
HEADERS=[['Trial','Conventional cells per edge','Molecular reference','Whole molecules','Selected ionic site','Displayed z-plane or all','Layer opening (view only)','Guide seconds or manual','Inspection status','Student observation'],['Trial','Boundary class','Ion','Raw displayed copies','Weight per copy','Effective ions'],['Trial','Neighbour image','Ion','Reference coordinates (cell units)','Inside displayed box?','Periodic representative','Reference distance (cell units)'],['Trial','Molecular formula','Element','Atoms per molecule','Whole molecules','Total element atoms'],['Trial','Raw Na copies','Raw Cl copies','Raw copy charge units (not a cluster charge)','Weighted Na ions','Weighted Cl ions','Na:Cl ratio','Formula units','Weighted charge units','Shown neighbours','Beyond-box neighbours','Bulk coordination','Total molecular atoms','Intramolecular bond-order total','Intergroup covalent links in rack']]
def reference(q):
 assert q['slice']is None or type(q['slice'])is int and 0<=q['slice']<=2*q['repeats'];assert type(q['separation'])in[int,float]and math.isfinite(q['separation'])and 0<=q['separation']<=1
 time=q['guideSeconds']
 if time is not None:
  assert type(time)in[int,float]and math.isfinite(time)and 0<=time<=150
  separation=max(0,min(1,(time-45)/30))if time<75 else 1 if time<105 else max(0,1-(time-105)/25)
  assert q['slice']is None and abs(q['separation']-separation)<1e-15
 s=expected({k:q[k]for k in['repeats','molecule','moleculeCount','selectedSite','slice','separation']});label='Manual reference inspection'if time is None else'Verified guided comparison'if time>=140 else'Guided inspection before verification';return s,label
def workings(q,s):
 out={};add=lambda k,formula,x,result,unit:out.update({k:(formula,x,result,unit)})
 n=q['repeats'];l=2*n+1;groups=s['groups'];name,elements,bonds=MOLECULES[q['molecule']];count=q['moleculeCount'];add('cells','Ncells = n * n * n',f'{n} * {n} * {n}',n**3,'cells');add('rawSites','Ndisplay = (2n + 1) * (2n + 1) * (2n + 1)',f'{l} * {l} * {l}',l**3,'displayed copies');add('rawNa','NrawNa = (Ndisplay - 1) / 2',f"({s['rawSites']} - 1) / 2",s['rawSodium'],'displayed copies');add('rawCl','NrawCl = (Ndisplay + 1) / 2',f"({s['rawSites']} + 1) / 2",s['rawChloride'],'displayed copies')
 for g in groups:add(g['boundary']+':'+g['species'],'Neffective(group) = raw copies * sharing weight',f"{g['rawCount']} * {f(g['weight'])}",g['effectiveCount'],'effective ions')
 for species,key in[('Na+','weightedNa'),('Cl−','weightedCl')]:add(key,'Neffective(species) = sum(group contributions)',' + '.join(f(g['effectiveCount'])for g in groups if g['species']==species),s['effectiveSodium'if species=='Na+'else'effectiveChloride'],'effective ions')
 add('effectiveIons','Nions = NNa + NCl',f"{s['effectiveSodium']} + {s['effectiveChloride']}",s['effectiveIons'],'effective ions');add('ratio','Ratio = NNa / NCl',f"{s['effectiveSodium']} / {s['effectiveChloride']}",1,'dimensionless');add('formulaUnits','Nformula = 4 * Ncells',f"4 * {s['conventionalCells']}",s['formulaUnits'],'formula units');add('residual','Residual = NNa - 4 * Ncells',f"{s['effectiveSodium']} - 4 * {s['conventionalCells']}",0,'effective ions');add('weightedCharge','qweighted/e0 = NNa - NCl',f"{s['effectiveSodium']} - {s['effectiveChloride']}",0,'elementary-charge units');add('rawCharge','qcopies/e0 = NrawNa - NrawCl',f"{s['rawSodium']} - {s['rawChloride']}",-1,'elementary-charge units');add('shown','Nshown = 6 - boundary axes',f"6 - {s['selected']['boundaryAxes']}",s['selectedShownNeighbours'],'neighbours');add('outside','Noutside = 6 - Nshown',f"6 - {s['selectedShownNeighbours']}",s['selectedOutsideNeighbours'],'neighbours');add('coordination','CN = Nshown + Noutside',f"{s['selectedShownNeighbours']} + {s['selectedOutsideNeighbours']}",6,'neighbours');add('distance','d = normalized cell edge / 2','1 / 2',.5,'normalized cell units')
 for e,n in elements.items():add('element:'+e,'Nelement = atoms per molecule * whole molecules',f'{n} * {count}',n*count,'atoms')
 add('molecularAtoms','Natoms = atoms per molecule * whole molecules',f'{sum(elements.values())} * {count}',s['molecularAtoms'],'atoms');add('molecularOrder','B = bond-order sum per molecule * whole molecules',f'{bonds} * {count}',s['molecularBondOrder'],'bond-order units');add('sharedElectrons','Eshared = 2 * B',f"2 * {s['molecularBondOrder']}",s['molecularSharedElectrons'],'electrons');return out
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);trials=r['trials'];assert len(trials)<=40 and len(p.tables)==5
 for table,h in zip(p.tables,HEADERS):assert table[0]==h
 want=[[],[],[],[],[]];ws={}
 for i,q in enumerate(trials):
  s,label=reference(q);lead=str(i+1);time=q['guideSeconds'];want[0].append([lead,str(q['repeats']),q['molecule'],str(q['moleculeCount']),q['selectedSite'],'All'if q['slice']is None else str(q['slice']),f(q['separation']),'Manual'if time is None else f(time),label,q['note']]);want[1]+=[[lead,g['boundary'],g['species'],str(g['rawCount']),f(g['weight']),f(g['effectiveCount'])]for g in s['groups']];want[2]+=[[lead,n['id'],n['species'],', '.join(f(v)for v in n['position']),'Yes'if n['insideDisplayedBox']else'No',n['canonicalPeriodicSite'],f(n['distanceCellUnits'])]for n in s['neighbours']]
  name,elements,bonds=MOLECULES[q['molecule']];want[3]+=[[lead,q['molecule'],e,str(n),str(q['moleculeCount']),str(n*q['moleculeCount'])]for e,n in elements.items()];want[4].append([lead,*[f(s[k])for k in['rawSodium','rawChloride','rawBoundaryCopyChargeUnits','effectiveSodium','effectiveChloride']],'1:1',*[f(s[k])for k in['formulaUnits','weightedChargeUnits','selectedShownNeighbours','selectedOutsideNeighbours','bulkCoordination','molecularAtoms','molecularBondOrder','molecularIntergroupCovalentBonds']]])
  for k,v in workings(q,s).items():ws[i,k]=v
 for actual,rows in zip(p.tables,want):
  # Element rows retain the target's original atom-order convention; compare
  # table3 by element identity rather than assuming dictionary order.
  if actual is p.tables[3]:assert sorted(actual[1:])==sorted(rows)
  else:assert actual[1:]==rows,(actual[1:],rows)
 assert len(p.blocks)==len(ws);seen=set();operands=0
 for b in p.blocks:
  key=(b['trial'],b['key']);assert key not in seen;seen.add(key);formula,expression,result,unit=ws[key];assert b['formula']==formula;operands+=tree_compare(ast.parse(b['substitution'],mode='eval').body,ast.parse(expression,mode='eval').body,b['substitution'],expression);assert b['result']==f'{f(result)} {unit}';assert evaluate(b['substitution'])==evaluate(expression)==result
 assert seen==set(ws)
 return dict(observations=len(trials),workedResults=len(ws),operandChecks=operands,tableFields=sum(len(row)for table in want for row in table))
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
