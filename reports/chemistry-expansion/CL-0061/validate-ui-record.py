from pathlib import Path
import json,math,runpy,re,html
root=Path(__file__).parent
model=runpy.run_path(str(root/'validate-rendered.py'))
data=json.loads((root/'actual-ui-record.json').read_text())
def near(actual,expected):
 value=float(str(actual).split()[0]);tiny='e' in str(actual).split()[0].lower()
 assert math.isclose(value,expected,rel_tol=1e-6,abs_tol=1e-20 if tiny else 5.1e-7),(actual,expected)
expected_blocks=[]
for i,(q,row) in enumerate(zip(data['record']['trials'],data['rows'])):
 p=model['physics'](q);assert len(row)==24 and int(row[0])==i+1
 controls=[q[k] for k in ['timeS','carbonateG','acidMl','acidMolL','temperatureC','pressureKPa','rateSInv']]
 for actual,value in zip(row[1:8],controls):near(actual,value)
 nc,nh=p['carbonateMol'],p['acidMol']
 limit='no reaction' if nc==0 or nh==0 else 'stoichiometric' if abs(nc-nh/2)<1e-14 else 'carbonate' if nc<nh/2 else 'acid'
 assert row[8]==limit
 outputs=[p[k] for k in ['extentMol','syringeMl','gasEquivalentMl','liberatedSolidVolumeMl',
  'carbonateLeftG','hclLeftG','calciumChlorideG','generatedWaterG','co2G','contentsG',
  'initialAirMol','co2MoleFraction','syringeCo2Mol','deadSpaceCo2Mol']]
 for actual,value in zip(row[9:23],outputs):near(actual,value)
 expected_blocks += [nc,nh,p['maximumExtentMol'],-math.expm1(-q['rateSInv']*q['timeS']),p['extentMol'],
  p['carbonateLeftG'],p['hclLeftG'],p['calciumChlorideG'],p['co2G'],p['generatedWaterG'],
  p['initialWaterG'],p['waterG'],p['contentsG'],q['temperatureC']+273.15,p['molarVolumeMl'],
  p['gasEquivalentMl'],p['initialSolidVolumeMl'],p['solidVolumeMl'],p['liberatedSolidVolumeMl'],
  p['initialDeadSpaceMl'],p['deadSpaceMl'],p['syringeMl'],p['pistonTravelCm'],p['initialAirMol'],
  p['totalGasVolumeMl'],p['co2MoleFraction'],p['syringeCo2Mol'],p['deadSpaceCo2Mol'],
  q['rateSInv']*p['maximumExtentMol']*math.exp(-q['rateSInv']*q['timeS']),p['syringeRateMlS']]
report=(root/'ui-exported-practical.html').read_text()
results=re.findall(r'<p>Result: ([^<]+)</p>',report)
assert len(results)==len(expected_blocks)==len(data['rows'])*30
for actual,value in zip(results,expected_blocks):near(html.unescape(actual),value)
assert len(re.findall('data-carbonate-table=',report))==3
assert 'http://' not in report and 'https://' not in report
assert 'VisionariesAI Labs Private Limited' in report
assert '&lt;prediction&gt;' in report and '&lt;initial&gt;' in report and 'air &amp; CO₂' in report
before=json.loads((root/'record-before-reload.json').read_text())
after=json.loads((root/'record-after-reload.json').read_text())
assert before==after==data
summary={'trials':len(data['rows']),'columnsPerTrial':24,'independentlyVerifiedWorkedResults':len(results),
 'printTables':3,'escapedStudentWriting':True,'exactReloadPersistence':True}
(root/'practical-verification.json').write_text(json.dumps(summary,indent=2)+'\n')
print('PASS:',summary)
