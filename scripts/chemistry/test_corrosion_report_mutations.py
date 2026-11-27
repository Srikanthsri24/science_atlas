"""CL-0106 HTML checker must reject incorrect substitutions, units and control evidence."""
import re,json,tempfile
from pathlib import Path
from validate_corrosion_report import validate
root=Path('reports/chemistry-expansion/CL-0106');source=(root/'reference-practical.html').read_text()
def alter(key,field,value,index=0):
 pattern=r'(<section class="worked" data-key="'+re.escape(key)+r'">[\s\S]*?<p class="'+field+r'">)([^<]*)(</p>)';matches=list(re.finditer(pattern,source));assert matches;match=matches[index];return source[:match.start(2)]+value+source[match.end(2):]
cases={'wrong-progress-operand':alter('wet-air.chosenProgressFraction','substitution','1 - exp(-9 * 7)'),'wrong-mass-unit':alter('wet-air.convertedIronG','result','0 kg'),'tiny-product-erasure':alter('wet-air.productReferenceG','result','0 g',13),'wrong-hydration-water':alter('wet-air.hydrationWaterG','result','999 g',7),'false-control-availability':source.replace('<td>false</td>','<td>true</td>',1),'wrong-metal-radius':alter('wet-air.shaftRadiusCm','result','2 cm')}
results=[]
with tempfile.TemporaryDirectory()as folder:
 for name,html in cases.items():
  path=Path(folder)/(name+'.html');path.write_text(html)
  try:validate(path)
  except AssertionError:results.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Mutation escaped: '+name)
(root/'report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print('PASS',len(results),'report mutations rejected')
