#!/usr/bin/env python3
"""Validate content/ and build the installable web app into dist/.

    python3 tools/build.py            validate + build
    python3 tools/build.py --check    validate only (no output files)
    python3 tools/build.py --serve    build, then serve dist/ on http://localhost:8000 (or $PORT)

The build fails (exit code 1) when any record is invalid. Every learning text must exist
in both Hungarian and Swedish, so the two languages can never drift apart.
"""
import hashlib
import os
import http.server
import json
import pathlib
import shutil
import socketserver
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'content'
APP = ROOT / 'app'
DIST = ROOT / 'dist'

VIEWS = {'attekintes', 'szotar', 'modulok', 'vall', 'plexus', 'agyidegek', 'ki-utvonal', 'kviz', 'statisztika'}
# every module also has a page at 'modul-<module id>'
REVIEW_STATUSES = {'draft', 'in-review', 'reviewed'}
STRUCT_FIELDS = {
    'muscle': {'required': ['origin', 'insertion', 'innervation', 'action'],
               'optional': ['location', 'bloodSupply', 'synergists', 'antagonists', 'joints', 'palpation',
                            'clinicalTests', 'clinicalRelevance']},
    'joint': {'required': ['bones', 'jointType', 'movements'],
              'optional': ['capsule', 'ligaments', 'stabilizers', 'muscles', 'innervation', 'function',
                           'examination', 'compensations', 'clinicalRelevance']},
    'nerve': {'required': ['origin', 'motor', 'sensory'],
              'optional': ['course', 'examination', 'injurySites', 'deficits']},
}
CN_FIELDS = ['nuclei', 'brainstemOrigin', 'skullExit', 'function', 'innervates', 'examination', 'lesion']
MODALITIES = {'sensory', 'motor', 'motor+parasympathetic', 'mixed'}
ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']


class Checker:
    def __init__(self):
        self.errors = []

    def err(self, where, msg):
        self.errors.append(f'{where}: {msg}')

    def text(self, where, v, name):
        if not isinstance(v, str) or not v.strip():
            self.err(where, f'"{name}" must be a non-empty string')

    def pair(self, where, v, name):
        """A learning text: {"hu": "...", "sv": "..."}, both filled in."""
        if not isinstance(v, dict):
            self.err(where, f'"{name}" must be an object with "hu" and "sv"')
            return
        for lang in ('hu', 'sv'):
            if not isinstance(v.get(lang), str) or not v[lang].strip():
                self.err(where, f'"{name}" is missing its {"Hungarian" if lang == "hu" else "Swedish"} text ({lang})')
        extra = set(v) - {'hu', 'sv'}
        if extra:
            self.err(where, f'"{name}" has unexpected keys {sorted(extra)}')

    def name3(self, where, v):
        if not isinstance(v, dict):
            self.err(where, '"name" must be an object with "la", "hu" and "sv"')
            return
        for lang in ('la', 'hu', 'sv'):
            self.text(where, v.get(lang), f'name.{lang}')

    def review(self, where, v):
        if not isinstance(v, dict) or v.get('status') not in REVIEW_STATUSES:
            self.err(where, f'"review.status" must be one of {sorted(REVIEW_STATUSES)}')
        elif v['status'] == 'reviewed' and not (v.get('by') and v.get('date')):
            self.err(where, 'a reviewed record needs "review.by" and "review.date"')

    def unique(self, where, ids):
        seen = set()
        for i in ids:
            if i in seen:
                self.err(where, f'duplicate id "{i}"')
            seen.add(i)


def load(name):
    return json.loads((CONTENT / name).read_text(encoding='utf-8'))


def validate():
    c = Checker()
    terms = load('terms.json')['terms']
    structures = load('structures.json')['structures']
    cranial = load('cranial-nerves.json')['cranialNerves']
    questions = load('questions.json')['questions']
    ki = load('ki-programme.json')
    modules = load('modules.json')['modules']
    taxonomy = load('taxonomy.json')

    regions = taxonomy.get('regions', {})
    for k, v in regions.items():
        c.pair(f'taxonomy.regions.{k}', v, 'label')
    views = VIEWS | {'modul-' + m.get('id', '') for m in modules}
    cats = taxonomy.get('termCategories', {})
    topics = taxonomy.get('quizTopics', {})
    for k, v in cats.items():
        c.pair(f'taxonomy.termCategories.{k}', v, 'label')
    for k, v in topics.items():
        c.pair(f'taxonomy.quizTopics.{k}', v, 'label')

    c.unique('terms', [t.get('id') for t in terms])
    for t in terms:
        w = f'terms/{t.get("id")}'
        if not str(t.get('id', '')).startswith('t.'):
            c.err(w, 'id must start with "t."')
        if t.get('category') not in cats:
            c.err(w, f'unknown category "{t.get("category")}"')
        c.name3(w, t.get('name'))
        c.review(w, t.get('review'))

    struct_ids = {s.get('id') for s in structures}
    c.unique('structures', [s.get('id') for s in structures])
    module_ids = {m.get('id') for m in modules}
    for s in structures:
        w = f'structures/{s.get("id")}'
        spec = STRUCT_FIELDS.get(s.get('type'))
        if not spec:
            c.err(w, f'unknown type "{s.get("type")}"')
            continue
        c.name3(w, s.get('name'))
        if s.get('module') not in module_ids:
            c.err(w, f'unknown module "{s.get("module")}"')
        fields = s.get('fields', {})
        for f in spec['required']:
            if f not in fields:
                c.err(w, f'missing required field "{f}"')
        for f, v in fields.items():
            if f not in spec['required'] + spec['optional']:
                c.err(w, f'unknown field "{f}" for a {s["type"]}')
            c.pair(w, v, f)
        if s['type'] == 'joint':
            for i, r in enumerate(s.get('rom', [])):
                c.pair(w, r.get('movement'), f'rom[{i}].movement')
                if not isinstance(r.get('degrees'), (int, float)) or not 0 < r['degrees'] <= 180:
                    c.err(w, f'rom[{i}].degrees must be between 1 and 180')
        c.review(w, s.get('review'))

    c.unique('cranial-nerves', [n.get('id') for n in cranial])
    if [n.get('number') for n in cranial] != ROMAN:
        c.err('cranial-nerves', 'must list the 12 cranial nerves in order I–XII')
    for n in cranial:
        w = f'cranial-nerves/{n.get("id")}'
        c.name3(w, n.get('name'))
        if n.get('modality') not in MODALITIES:
            c.err(w, f'modality must be one of {sorted(MODALITIES)}')
        for f in CN_FIELDS:
            c.pair(w, n.get('fields', {}).get(f), f)
        c.review(w, n.get('review'))

    cn_ids = {n['id'] for n in cranial}
    c.unique('questions', [q.get('id') for q in questions])
    for q in questions:
        w = f'questions/{q.get("id")}'
        if q.get('topic') not in topics:
            c.err(w, f'unknown topic "{q.get("topic")}"')
        c.pair(w, q.get('prompt'), 'prompt')
        c.pair(w, q.get('explanation'), 'explanation')
        t = q.get('type')
        if t == 'mc':
            opts = q.get('options', [])
            if not 2 <= len(opts) <= 6:
                c.err(w, 'needs 2–6 options')
            if not isinstance(q.get('answer'), int) or not 0 <= q['answer'] < len(opts):
                c.err(w, '"answer" must be the index of an option')
            for i, o in enumerate(opts):
                c.pair(w, o.get('text'), f'options[{i}].text')
                if i != q.get('answer'):
                    if o.get('whyWrong') is None:
                        c.err(w, f'options[{i}] is wrong but has no "whyWrong" explanation')
                    else:
                        c.pair(w, o['whyWrong'], f'options[{i}].whyWrong')
        elif t == 'tf':
            if not isinstance(q.get('answer'), bool):
                c.err(w, '"answer" must be true or false')
        elif t == 'match':
            rows = q.get('rows', [])
            if len(rows) < 2 or any(len(r) != 3 or not all(isinstance(x, str) and x for x in r) for r in rows):
                c.err(w, '"rows" must be at least 2 rows of 3 non-empty strings')
            if 'heads' in q:
                h = q['heads']
                if not (isinstance(h, dict) and all(isinstance(h.get(l), list) and len(h[l]) == 3 for l in ('hu', 'sv'))):
                    c.err(w, '"heads" must have 3 Hungarian and 3 Swedish column titles')
        elif t == 'order':
            items = q.get('items', [])
            if len(items) < 3:
                c.err(w, 'needs at least 3 items')
            for i, it in enumerate(items):
                c.pair(w, it, f'items[{i}]')
        else:
            c.err(w, f'unknown type "{t}"')
        link = q.get('link') or {}
        if link.get('view') not in views:
            c.err(w, f'link.view "{link.get("view")}" is not a page in the app')
        item = link.get('item')
        if item and item not in struct_ids | cn_ids:
            c.err(w, f'link.item "{item}" does not exist')
        c.review(w, q.get('review'))

    total = 0
    for i, co in enumerate(ki.get('courses', [])):
        w = f'ki-programme/courses[{i}] {co.get("name")}'
        if co.get('semester') not in range(1, 7):
            c.err(w, 'semester must be 1–6')
        c.text(w, co.get('name'), 'name')
        total += co.get('credits', 0)
        if co.get('topicSource') not in ('kursplan', 'app-suggestion'):
            c.err(w, 'topicSource must be "kursplan" or "app-suggestion"')
        for j, t in enumerate(co.get('topics', [])):
            c.pair(w, t, f'topics[{j}]')
        for j, l in enumerate(co.get('links', [])):
            if l.get('view') not in views:
                c.err(w, f'links[{j}].view "{l.get("view")}" is not a page in the app')
            c.pair(w, l.get('label'), f'links[{j}].label')
    if abs(total - ki.get('credits', 0)) > 0.01:
        c.err('ki-programme', f'course credits add up to {total} hp, programme says {ki.get("credits")} hp')
    for s in range(1, 7):
        sem = sum(co['credits'] for co in ki['courses'] if co['semester'] == s)
        if abs(sem - 30) > 0.01:
            c.err('ki-programme', f'semester {s} has {sem} hp, expected 30')

    c.unique('modules', [m.get('id') for m in modules])
    by_module = {m.get('id'): m for m in modules}
    for s in structures:
        m = by_module.get(s.get('module'))
        if m and s.get('id') not in m.get('structures', []):
            c.err(f'structures/{s.get("id")}', f'is not listed in module "{m["id"]}"')
    for m in modules:
        w = f'modules/{m.get("id")}'
        c.pair(w, m.get('title'), 'title')
        if m.get('region') not in regions:
            c.err(w, f'region "{m.get("region")}" is not in taxonomy.regions')
        if not isinstance(m.get('order'), int):
            c.err(w, '"order" must be a whole number')
        c.text(w, m.get('latin'), 'latin')
        if 'navLabel' in m:
            c.pair(w, m['navLabel'], 'navLabel')
        if m.get('id') not in topics:
            c.err(w, f'needs a quiz topic "{m.get("id")}" in taxonomy.quizTopics')
        if 'structureGroups' in m:
            grouped = []
            for i, g in enumerate(m['structureGroups']):
                c.pair(w, g.get('title'), f'structureGroups[{i}].title')
                grouped += g.get('structures', [])
            if sorted(grouped) != sorted(m.get('structures', [])):
                c.err(w, 'structureGroups must list exactly the module\'s structures, each once')
        c.name3(w, m.get('termName'))
        for k in ('basic', 'university', 'clinical'):
            c.pair(w, m.get('lessons', {}).get(k), f'lessons.{k}')
        for sid in m.get('structures', []):
            if sid not in struct_ids:
                c.err(w, f'structure "{sid}" does not exist')
        for les in m.get('lesions', []):
            c.pair(w, les.get('label'), f'lesions.{les.get("id")}.label')
            c.pair(w, les.get('text'), f'lesions.{les.get("id")}.text')
        for r in m.get('rootExam', []):
            for f in ('dermatome', 'myotome', 'reflex'):
                c.pair(w, r.get(f), f'rootExam.{r.get("root")}.{f}')
        for i, b in enumerate(m.get('proximalBranches', [])):
            c.pair(w, b.get('origin'), f'proximalBranches[{i}].origin')
            c.pair(w, b.get('area'), f'proximalBranches[{i}].area')
        c.review(w, m.get('review'))

    bundle = {'terms': terms, 'structures': structures, 'cranialNerves': cranial, 'questions': questions,
              'ki': ki, 'modules': modules, 'taxonomy': taxonomy}
    counts = {'terms': len(terms), 'structures': len(structures), 'cranial nerves': len(cranial),
              'questions': len(questions), 'KI courses': len(ki.get('courses', [])), 'modules': len(modules)}
    records = terms + structures + cranial + questions + modules
    reviewed = sum(1 for r in records if (r.get('review') or {}).get('status') == 'reviewed')
    return c.errors, bundle, counts, (reviewed, len(records))


def build(bundle):
    payload = json.dumps(bundle, ensure_ascii=False, separators=(',', ':'))
    app_files = sorted(p for p in APP.rglob('*') if p.is_file())
    h = hashlib.sha256(payload.encode())
    for p in app_files:
        h.update(p.read_bytes())
    version = h.hexdigest()[:10]
    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(APP, DIST)
    (DIST / 'content.json').write_text(payload, encoding='utf-8')
    sw = DIST / 'sw.js'
    sw.write_text(sw.read_text(encoding='utf-8').replace('__BUILD_VERSION__', version), encoding='utf-8')
    idx = DIST / 'index.html'
    idx.write_text(idx.read_text(encoding='utf-8').replace('__BUILD_VERSION__', version), encoding='utf-8')
    return version, len(payload)


def main():
    errors, bundle, counts, (reviewed, total) = validate()
    print('Content: ' + ', '.join(f'{v} {k}' for k, v in counts.items()))
    print(f'Reviewed by an expert: {reviewed} of {total} records')
    if errors:
        print(f'\n{len(errors)} problem(s) found — nothing was built:')
        for e in errors:
            print('  - ' + e)
        sys.exit(1)
    print('All checks passed (every text has Hungarian and Swedish).')
    if '--check' in sys.argv:
        return
    version, size = build(bundle)
    print(f'Built dist/ (version {version}, content.json {size // 1024} KB)')
    if '--serve' in sys.argv:
        port = int(os.environ.get('PORT', 8000))
        handler = lambda *a, **k: http.server.SimpleHTTPRequestHandler(*a, directory=str(DIST), **k)
        with socketserver.TCPServer(('127.0.0.1', port), handler) as httpd:
            print(f'Serving on http://localhost:{port}  (Ctrl+C to stop)')
            httpd.serve_forever()


if __name__ == '__main__':
    main()
