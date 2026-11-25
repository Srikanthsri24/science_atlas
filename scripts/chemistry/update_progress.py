"""Derive the completion ledger; a catalogue entry alone never counts as completion."""
import hashlib,json
from collections import Counter
from pathlib import Path
labs=json.loads(Path('data/chemistry-labs.json').read_text())['labs']
ready=[r for r in labs if r['status']=='ready']
for lab in ready:
    assert all(v=='passed' for v in lab['review'].values()), f"Incomplete review: {lab['id']}"
    path=Path(lab['reviewEvidence']);report=json.loads(path.read_text())
    assert report['status']=='passed_internal_functional_review', f"No passed report: {lab['id']}"
    for file,digest in report.get('sourceHashes',{}).items():
        assert hashlib.sha256(Path(file).read_bytes()).hexdigest()==digest, f"Source changed after review: {lab['id']} {file}"
counts=Counter(r['status'] for r in labs)
assert set(counts)<={'ready','in_progress','planned'}
p=Path('reports/chemistry-expansion/progress.json')
prior=json.loads(p.read_text()) if p.exists() else {}
prior.update(totalLabs=len(labs),completedCount=len(ready),inProgressCount=counts['in_progress'],plannedCount=counts['planned'],completedLabs=[r['id'] for r in ready],inProgressLabs=[r['id'] for r in labs if r['status']=='in_progress'],nextLab=next((r['id'] for r in labs if r['status']!='ready'),None),goalStatus='active',classCounts={str(i):sum(r['grade']==i for r in labs) for i in range(1,13)})
p.write_text(json.dumps(prior,indent=2)+'\n')
print(f"{len(ready)}/{len(labs)} reviewed; {counts['in_progress']} in progress; next {prior['nextLab']}")
