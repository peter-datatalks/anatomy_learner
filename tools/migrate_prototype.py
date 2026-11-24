"""One-off migration: build/prototype-dump.json (from dump_prototype.py) -> content/*.json.

Run once during Phase 0. After that, content/*.json is the source of truth and is edited
directly; do not re-run this script or it will overwrite edits.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DUMP = ROOT / 'build' / 'prototype-dump.json'
OUT = ROOT / 'content'

if (OUT / 'questions.json').exists() and '--force' not in sys.argv:
    sys.exit('content/ already exists; pass --force to overwrite it.')

d = json.loads(DUMP.read_text(encoding='utf-8'))
SV = d['SV']
DRAFT = {'status': 'draft', 'by': None, 'date': None}
SOURCE = ['prototype-v0.3']


def pair(hu, sv):
    return {'hu': hu, 'sv': sv}


def slug(s):
    s = s.lower().replace('m. ', '').replace('n. ', '').replace('ligg. ', '').replace('lig. ', '')
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')


# ---------- structures (muscles, joints, nerves) ----------
STRUCT_ID = {
    'deltoideus': 'm.deltoideus', 'supraspinatus': 'm.supraspinatus', 'infraspinatus': 'm.infraspinatus',
    'teresminor': 'm.teres-minor', 'subscapularis': 'm.subscapularis', 'serratus': 'm.serratus-anterior',
    'humeri': 'art.humeri', 'axillaris': 'n.axillaris', 'musculocutaneus': 'n.musculocutaneus',
    'medianus': 'n.medianus', 'ulnaris': 'n.ulnaris', 'radialis': 'n.radialis',
}
TYPE = {'izom': 'muscle', 'izulet': 'joint', 'ideg': 'nerve'}
FIELDS = {
    'muscle': {'loc': 'location', 'origo': 'origin', 'insertio': 'insertion', 'innervatio': 'innervation',
               'ver': 'bloodSupply', 'actio': 'action', 'syn': 'synergists', 'ant': 'antagonists',
               'izulet': 'joints', 'palp': 'palpation', 'teszt': 'clinicalTests', 'klin': 'clinicalRelevance'},
    'joint': {'csontok': 'bones', 'tipus': 'jointType', 'tok': 'capsule', 'szalag': 'ligaments',
              'stab': 'stabilizers', 'mozgas': 'movements', 'izmok': 'muscles', 'beidegzes': 'innervation',
              'funkcio': 'function', 'vizsg': 'examination', 'komp': 'compensations', 'klin': 'clinicalRelevance'},
    'nerve': {'eredes': 'origin', 'lefutas': 'course', 'motor': 'motor', 'szenz': 'sensory',
              'vizsg': 'examination', 'serules': 'injurySites', 'tunetek': 'deficits'},
}
MODULE_OF = {k: 'vall' for k in ['deltoideus', 'supraspinatus', 'infraspinatus', 'teresminor', 'subscapularis', 'serratus', 'humeri', 'axillaris']}
MODULE_OF.update({k: 'plexus' for k in ['musculocutaneus', 'medianus', 'ulnaris', 'radialis']})
KI_OF = {'vall': ['1FY053', '1FY055'], 'plexus': ['1FY053', '1FY056']}

structures = []
for key, s in d['SHEETS'].items():
    t = TYPE[s['kind']]
    sv = SV['sheets'][key]
    rec = {'id': STRUCT_ID[key], 'type': t, 'module': MODULE_OF[key],
           'name': {'la': s['la'], 'hu': s['hu'], 'sv': s['sv']}, 'fields': {}}
    for old, new in FIELDS[t].items():
        if s.get(old):
            rec['fields'][new] = pair(s[old], sv[old])
    if t == 'joint':
        rec['rom'] = [{'movement': pair(lbl, sv['rom'][i]), 'degrees': deg} for i, (lbl, deg) in enumerate(s['rom'])]
    rec['kiCourses'] = KI_OF[MODULE_OF[key]]
    rec['review'] = dict(DRAFT)
    rec['sources'] = SOURCE
    structures.append(rec)

# ---------- cranial nerves ----------
CN_FIELDS = {'nuc': 'nuclei', 'ered': 'brainstemOrigin', 'kilep': 'skullExit', 'fn': 'function',
             'izom': 'innervates', 'teszt': 'examination', 'lez': 'lesion'}
MODALITY = {'S': 'sensory', 'M': 'motor', 'M+P': 'motor+parasympathetic', 'Kevert': 'mixed'}
cranial = []
for c in d['CN']:
    sv = SV['cn'][c['n']]
    cranial.append({'id': 'cn.' + c['n'], 'number': c['n'], 'modality': MODALITY[c['type']],
                    'name': {'la': c['la'], 'hu': c['hu'], 'sv': c['sv']},
                    'fields': {new: pair(c[old], sv[old]) for old, new in CN_FIELDS.items()},
                    'kiCourses': ['1FY053', '1FY056'], 'review': dict(DRAFT), 'sources': SOURCE})

# ---------- terms ----------
CAT = {'alap': 'basics', 'csont': 'bones', 'izulet': 'joints', 'izom': 'muscles', 'ideg': 'nervous', 'elettan': 'physiology'}
terms, seen = [], set()
for t in d['TERMS']:
    base = 't.' + (slug(t['la']) if t['la'] != '—' else slug(t['sv']))
    tid, n = base, 2
    while tid in seen:
        tid, n = f'{base}-{n}', n + 1
    seen.add(tid)
    rec = {'id': tid, 'category': CAT[t['cat']], 'name': {'hu': t['hu'], 'sv': t['sv'], 'la': t['la']}}
    if t['syn']:
        rec['synonymsHu'] = t['syn']
    rec['review'] = dict(DRAFT)
    terms.append(rec)

# ---------- questions ----------
def link(l):
    view = l[0].lstrip('#')
    item = l[1]
    if item:
        item = ('cn.' + item) if view == 'agyidegek' else STRUCT_ID[item]
    return {'view': view, 'item': item or None}

questions = []
for q in d['Q']:
    sv = SV['q'][q['id']]
    rec = {'id': q['id'], 'topic': q['topic'], 'type': q['type'], 'prompt': pair(q['q'], sv['q'])}
    if q['type'] == 'mc':
        rec['options'] = [{'text': pair(o[0], sv['opts'][i][0]),
                           'whyWrong': pair(o[1], sv['opts'][i][1]) if o[1] else None}
                          for i, o in enumerate(q['opts'])]
        rec['answer'] = q['a']
    elif q['type'] == 'tf':
        rec['answer'] = q['a']
    elif q['type'] == 'match':
        rec['rows'] = q['rows']
        if q.get('heads'):
            rec['heads'] = pair(q['heads'], sv['heads'])
    elif q['type'] == 'order':
        rec['items'] = [pair(x, sv['items'][i]) for i, x in enumerate(q['items'])]
    rec['explanation'] = pair(q['exp'], sv['exp'])
    rec['link'] = link(q['link'])
    rec['review'] = dict(DRAFT)
    questions.append(rec)

# ---------- KI courses ----------
LINK_SV = d['LINK_SV']
courses = []
for i, c in enumerate(d['KI']):
    rec = {'semester': c['s'], 'code': c['code'] or None, 'name': c['name'], 'credits': c['hp'],
           'topicSource': 'kursplan' if c['src'] == 'ki' else 'app-suggestion',
           'topics': [pair(t, SV['ki'][i][j]) for j, t in enumerate(c['topics'])]}
    if c.get('links'):
        rec['links'] = [{'view': h.lstrip('#'), 'label': pair(lbl, LINK_SV[lbl])} for h, lbl in c['links']]
    courses.append(rec)
ki = {'programme': '1FY26', 'firstIntake': 'HT26', 'credits': 180,
      'officialUrl': 'https://utbildning.ki.se/bli-student/program-och-kurser/fysioterapeutprogrammet',
      'note': pair('A kurzusnevek és kreditek a KI hivatalos adatai.', 'Kursnamn och högskolepoäng är KI:s officiella uppgifter.'),
      'courses': courses}

# ---------- modules ----------
LAYER = {'alap': 'basic', 'egyetem': 'university', 'klinika': 'clinical'}
modules = [
    {'id': 'vall', 'title': pair('Vállöv és vállízület', 'Skuldergördel och axelled'),
     'latin': 'cingulum pectorale', 'termName': {'hu': 'vállöv', 'sv': 'skuldergördel', 'la': 'cingulum pectorale'},
     'kiCourses': KI_OF['vall'],
     'lessons': {LAYER[k]: pair(v, SV['layers']['vall'][k]) for k, v in d['LAYERS'].items()},
     'structures': [STRUCT_ID[k] for k in d['SHEET_ORDER']], 'review': dict(DRAFT)},
    {'id': 'plexus', 'title': pair('Plexus brachialis', 'Plexus brachialis · armplexus'),
     'latin': 'plexus brachialis', 'termName': {'hu': 'karfonat', 'sv': 'armplexus', 'la': 'plexus brachialis'},
     'kiCourses': KI_OF['plexus'],
     'lessons': {LAYER[k]: pair(v, SV['layers']['plexus'][k]) for k, v in d['PX_LAYERS'].items()},
     'structures': ['n.musculocutaneus', 'n.axillaris', 'n.radialis', 'n.medianus', 'n.ulnaris'],
     'lesions': [{'id': k, 'label': pair(v['label'], SV['lesions'][k]['label']), 'roots': v['roots'], 'trunks': v['trunks'],
                  'text': pair(v['text'], SV['lesions'][k]['text'])} for k, v in d['PX_LESIONS'].items()],
     'rootExam': [{'root': r[0], 'dermatome': pair(r[1], SV['pxRoots'][i][1]), 'myotome': pair(r[2], SV['pxRoots'][i][2]),
                   'reflex': pair(r[3], SV['pxRoots'][i][3])} for i, r in enumerate(d['PX_ROOTS'])],
     'proximalBranches': [{'origin': pair(r[0], SV['pxBranches'][i][0]), 'nerve': r[1], 'area': pair(r[2], SV['pxBranches'][i][2])}
                          for i, r in enumerate(d['PX_BRANCHES'])],
     'review': dict(DRAFT)},
]

taxonomy = {
    'termCategories': {CAT[k]: pair(v['label'], d['CAT_SV'][k]) for k, v in d['CAT'].items()},
    'quizTopics': {k: pair(v, d['TOPICS_SV'][k]) for k, v in d['TOPICS'].items()},
}

OUT.mkdir(exist_ok=True)
files = {'terms.json': {'terms': terms}, 'structures.json': {'structures': structures},
         'cranial-nerves.json': {'cranialNerves': cranial}, 'questions.json': {'questions': questions},
         'ki-programme.json': ki, 'modules.json': {'modules': modules}, 'taxonomy.json': taxonomy}
for name, data in files.items():
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'wrote content/{name}')
