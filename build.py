# Optional: regenerates content/seed.js (offline fallback) from content/*.json. Run: python3 build.py
import json,glob,os
d={os.path.basename(f)[:-5]:json.load(open(f)) for f in glob.glob('content/*.json')}
open('content/seed.js','w').write('window.SEED='+json.dumps(d,ensure_ascii=False)+';')
