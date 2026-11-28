import json,re,tempfile
from pathlib import Path
from validate_soap_detergent_report import validate
html=Path('reports/chemistry-expansion/CL-0110/reference-practical.html').read_text();out=[]
def change(key,part,fn):
 pattern=re.compile(r'(<section class="worked" data-key="'+re.escape(key)+r'">[\s\S]*?<p class="'+part+r'">)([\s\S]*?)(</p>)')
 m=pattern.search(html);assert m;return html[:m.start(2)]+fn(m[2])+html[m.end(2):]
cases={
 'wrong-zero-dose-stock-operator':change('soap-soft.remainingStockSurfactantMol','substitution',lambda s:s.replace('−','+',1)),
 'wrong-operand-hidden-by-no-hardness':change('soap-soft.initialCalciumMol','substitution',lambda s:s.replace('50.000000000000000','75.000000000000000',1)),
 'wrong-concentration-unit':change('detergent-hard.stockMolL','result',lambda s:s.replace('mol/L','g/L')),
 'invented-nonionic-counterion':change('detergent-hard.sodiumMol','result',lambda s:'0.1 mol'),
 'invented-zero-dose-availability':change('soap-hard.availableFraction','result',lambda s:'0 fraction'),
 'wrong-difference-operator':change('comparison.soapHardWaterLossMol','substitution',lambda s:s.replace('−','+',1)),
 'missing-formula':change('soap-hard.boundSurfactantMol','formula',lambda s:''),
 'wrong-hardness-table-unit':html.replace('<th>Residual hardness mg/L as CaCO₃</th>','<th>Residual hardness mol/L</th>',1),
 'wrong-matching-basis':html.replace('<td>molar</td>','<td>mass</td>',1),
 'wrong-observation':html.replace('<td>0.0000000000000000</td>','<td>1.0000000000000000</td>',1),
 'missing-worked-result':re.sub(r'<section class="worked"[\s\S]*?</section>','',html,count=1),
 'inferred-cmc-outside-reference':html.replace('<td>below_reference_band</td>','<td>above_reference_band</td>',1)
}
for name,bad in cases.items():
 assert bad!=html,name
 with tempfile.TemporaryDirectory()as directory:
  p=Path(directory)/'bad.html';p.write_text(bad)
  try:validate(p)
  except (AssertionError,ValueError):out.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Corruption escaped: '+name)
Path('reports/chemistry-expansion/CL-0110/report-mutation-checks.json').write_text(json.dumps(out,indent=2)+'\n');print(len(out),'report corruptions rejected')
