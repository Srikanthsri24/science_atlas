from PIL import Image,ImageChops,ImageStat
import json
from pathlib import Path
p=Path(__file__).parent
bounds=(0,198,390,532)
a=Image.open(p/'orbit-before.jpg').convert('RGB').crop(bounds)
b=Image.open(p/'orbit-after.jpg').convert('RGB').crop(bounds)
c=Image.open(p/'orbit-reset.jpg').convert('RGB').crop(bounds)
values={'orbitPixelMeanDifference':sum(ImageStat.Stat(ImageChops.difference(a,b)).mean)/3,'resetPixelMeanDifference':sum(ImageStat.Stat(ImageChops.difference(a,c)).mean)/3}
print(values)
assert values['orbitPixelMeanDifference']>1
assert values['resetPixelMeanDifference']<1
(p/'orbit-pixel-verification.json').write_text(json.dumps(values,indent=2)+'\n')
