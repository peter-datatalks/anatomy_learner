"""Draws the app icons (the five-pillar dial on navy) into app/icons/. Needs Pillow.

    python3 tools/make_icons.py
"""
import math
import pathlib

from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'app' / 'icons'
NAVY = (22, 46, 72)
COLORS = [(224, 122, 133), (226, 185, 74), (127, 176, 224), (108, 192, 210), (205, 182, 140)]  # muscle, nerve, accent, joint, bone


def dial(size, inset, rounded):
    s = size * 4  # supersample for smooth edges
    img = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if rounded:
        d.rounded_rectangle([0, 0, s - 1, s - 1], radius=int(s * 0.22), fill=NAVY)
    else:
        d.rectangle([0, 0, s, s], fill=NAVY)
    r = s * (0.5 - inset)
    w = int(s * 0.09)
    c = s / 2
    box = [c - r, c - r, c + r, c + r]
    for i, col in enumerate(COLORS):
        start = i * 72 + 8 - 90
        d.arc(box, start=start, end=start + 56, fill=col, width=w)
        for a in (start, start + 56):  # round caps
            t = math.radians(a)
            x, y = c + (r - w / 2) * math.cos(t), c + (r - w / 2) * math.sin(t)
            d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=col)
    return img.resize((size, size), Image.LANCZOS)


OUT.mkdir(parents=True, exist_ok=True)
for size in (180, 192, 512):
    dial(size, 0.2, rounded=(size != 180)).save(OUT / f'icon-{size}.png')
dial(512, 0.28, rounded=False).save(OUT / 'icon-maskable-512.png')  # content inside the 80% safe zone

arcs = []
for i, (rr, gg, bb) in enumerate(COLORS):
    a0, a1 = math.radians(i * 72 + 8 - 90), math.radians(i * 72 + 64 - 90)
    x0, y0 = 32 + 18 * math.cos(a0), 32 + 18 * math.sin(a0)
    x1, y1 = 32 + 18 * math.cos(a1), 32 + 18 * math.sin(a1)
    arcs.append(f'<path d="M{x0:.2f} {y0:.2f} A18 18 0 0 1 {x1:.2f} {y1:.2f}" fill="none" '
                f'stroke="rgb({rr},{gg},{bb})" stroke-width="6" stroke-linecap="round"/>')
(OUT / 'icon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">'
                              '<rect width="64" height="64" rx="14" fill="rgb(22,46,72)"/>' + ''.join(arcs) + '</svg>\n',
                              encoding='utf-8')
print('icons written to', OUT)
