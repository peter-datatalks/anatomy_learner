#!/usr/bin/env python3
"""Convert the BodyParts3D meshes listed in content/anatomy3d.json into the app's compact format.

    python3 tools/build_3d.py [path/to/isa_BP3D_4.0_obj_99.zip]

Needs (not in git, download once into build/bp3d/ from the BodyParts3D download page):
  isa_BP3D_4.0_obj_99.zip  and  isa_element_parts.txt

Writes app/models/<model id>.bin and app/models/<model id>.json (these ARE committed, so the app
builds without the 136 MB source archive). Format, per part, 4-byte aligned in the .bin:
  positions: Uint16 x,y,z quantised to the model's bounding box
  indices:   Uint16 or Uint32 triangle indices
The .json lists each part's offsets and which parts belong to which structure.
"""
import collections
import json
import pathlib
import struct
import sys
import zipfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'build' / 'bp3d'
OUT = ROOT / 'app' / 'models'


def parse_obj(text):
    verts, faces = [], []
    for line in text.splitlines():
        if line.startswith('v '):
            _, x, y, z = line.split()[:4]
            verts.append((float(x), float(y), float(z)))
        elif line.startswith('f '):
            idx = [int(p.split('/')[0]) for p in line.split()[1:]]
            for i in range(1, len(idx) - 1):  # fan-triangulate polygons
                faces.append((idx[0] - 1, idx[i] - 1, idx[i + 1] - 1))
    return verts, faces


def main():
    zpath = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else SRC / 'isa_BP3D_4.0_obj_99.zip'
    files_by_name = collections.defaultdict(list)
    for line in (SRC / 'isa_element_parts.txt').read_text(encoding='utf-8').splitlines()[1:]:
        _, name, fid = line.split('\t')
        files_by_name[name].append(fid)

    zf = zipfile.ZipFile(zpath)
    members = {pathlib.PurePosixPath(n).stem: n for n in zf.namelist() if n.lower().endswith('.obj')}
    spec = json.loads((ROOT / 'content' / 'anatomy3d.json').read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)

    for model in spec['models']:
        groups = [('bone', k, v) for k, v in model['bones'].items()] + [('muscle', k, v) for k, v in model['muscles'].items()]
        meshes = []
        lo, hi = [float('inf')] * 3, [float('-inf')] * 3
        for kind, key, names in groups:
            verts, faces = [], []
            for name in names:
                for fid in files_by_name[name]:
                    if fid not in members:
                        sys.exit(f'{fid} ({name}) is not in {zpath.name}')
                    v, f = parse_obj(zf.read(members[fid]).decode('utf-8', 'replace'))
                    base = len(verts)
                    verts += v
                    faces += [(a + base, b + base, c + base) for a, b, c in f]
            if not faces:
                sys.exit(f'no geometry for {key}')
            for x, y, z in verts:
                lo = [min(lo[0], x), min(lo[1], y), min(lo[2], z)]
                hi = [max(hi[0], x), max(hi[1], y), max(hi[2], z)]
            meshes.append((kind, key, verts, faces))

        span = [max(h - l, 1e-6) for l, h in zip(lo, hi)]
        blob = bytearray()
        parts = []
        for kind, key, verts, faces in meshes:
            pos_off = len(blob)
            for x, y, z in verts:
                blob += struct.pack('<3H', *(round((c - l) / s * 65535) for c, l, s in zip((x, y, z), lo, span)))
            while len(blob) % 4:
                blob += b'\0'
            idx_off = len(blob)
            wide = len(verts) > 65535
            fmt = '<3I' if wide else '<3H'
            for tri in faces:
                blob += struct.pack(fmt, *tri)
            while len(blob) % 4:
                blob += b'\0'
            parts.append({'key': key, 'kind': kind, 'vertexCount': len(verts), 'indexCount': len(faces) * 3,
                          'positionOffset': pos_off, 'indexOffset': idx_off, 'indexType': 'uint32' if wide else 'uint16'})

        structures = {k: [k] for k in model['muscles']}
        structures.update({k: v for k, v in model['joints'].items()})
        manifest = {'id': model['id'], 'units': 'mm', 'up': 'z', 'bboxMin': lo, 'bboxMax': hi,
                    'source': model['source'], 'parts': parts, 'structures': structures}
        (OUT / f'{model["id"]}.bin').write_bytes(bytes(blob))
        (OUT / f'{model["id"]}.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
        tris = sum(p['indexCount'] for p in parts) // 3
        print(f'{model["id"]}: {len(parts)} parts, {tris:,} triangles, {len(blob) / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
