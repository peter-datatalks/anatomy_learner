#!/usr/bin/env python3
"""Merge drafted module files into content/.

    python3 tools/merge_drafts.py build/drafts/konyok.json [more.json ...]

Each draft file holds {"module", "structures", "questions", "terms"}. Records whose id already
exists are replaced, so a corrected draft can be merged again. Terms whose Latin name already
exists under another id are skipped (terms without a Latin name are compared by id only). Run tools/build.py --check afterwards.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CONTENT = ROOT / 'content'
TARGETS = {  # draft key -> (file, list key)
    'structures': ('structures.json', 'structures'),
    'questions': ('questions.json', 'questions'),
    'terms': ('terms.json', 'terms'),
}


def read(name):
    return json.loads((CONTENT / name).read_text(encoding='utf-8'))


def write(name, data):
    (CONTENT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def upsert(items, new):
    index = {x['id']: i for i, x in enumerate(items)}
    added = replaced = 0
    for rec in new:
        if rec['id'] in index:
            items[index[rec['id']]] = rec
            replaced += 1
        else:
            index[rec['id']] = len(items)
            items.append(rec)
            added += 1
    return added, replaced


def main(paths):
    if not paths:
        sys.exit(__doc__)
    for path in paths:
        draft = json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
        mid = draft['module']['id']
        mods = read('modules.json')
        a, r = upsert(mods['modules'], [draft['module']])
        mods['modules'].sort(key=lambda m: (m.get('region', ''), m.get('order', 0)))
        write('modules.json', mods)
        report = [f'module {mid}: {"added" if a else "replaced"}']
        for key, (fname, lkey) in TARGETS.items():
            data = read(fname)
            new = draft.get(key, [])
            if key == 'terms':
                def latin_key(t):  # terms without a Latin name ("—") are compared by id only
                    la = t['name']['la'].strip().lower()
                    return None if la in ('', '—', '-') else la
                latin = {latin_key(t): t["id"] for t in data[lkey] if latin_key(t)}
                kept = [t for t in new if latin_key(t) is None or latin_key(t) not in latin or latin[latin_key(t)] == t["id"]]
                skipped = len(new) - len(kept)
                new = kept
            a, r = upsert(data[lkey], new)
            write(fname, data)
            report.append(f'{key} +{a} ~{r}' + (f' (skipped {skipped} existing)' if key == 'terms' and skipped else ''))
        print(f'{path}: ' + ', '.join(report))


if __name__ == '__main__':
    main(sys.argv[1:])
