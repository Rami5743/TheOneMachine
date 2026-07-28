#!/usr/bin/env python3
"""Embed a font into panel SVGs so Hebrew renders identically everywhere.

For each SVG it subsets the source font down to the characters that file
actually uses, compresses to WOFF2, base64-encodes it into an @font-face rule
inside the SVG, and repoints font-family at the embedded family. Nothing is
loaded from the system any more, so the same file renders the same in every
browser.

    python3 tools/embed-font.py --font <ttf> --family "TOM Sans" [--check] [files...]

--check reports what would happen without writing.
"""
import argparse, base64, io, os, re, sys, tempfile

from fontTools.ttLib import TTFont
from fontTools.subset import Subsetter, Options

TEXT_RE = re.compile(r'>([^<>]*)</(?:tspan|text)>')
FAMILY_ATTR_RE = re.compile(r'font-family="[^"]*"')
FAMILY_STYLE_RE = re.compile(r'font-family:[^;"\']*')
STYLE_BLOCK_ID = 'embedded-font'


def chars_used(svg: str) -> set:
    used = set()
    for m in TEXT_RE.finditer(svg):
        used.update(m.group(1))
    used.update(' ')
    return {c for c in used if c.strip() or c == ' '}


def subset_woff2(font_path: str, chars: set) -> bytes:
    font = TTFont(font_path)
    opts = Options()
    opts.layout_features = ['*']
    opts.notdef_outline = True
    opts.recalc_bounds = True
    sub = Subsetter(options=opts)
    sub.populate(text=''.join(sorted(chars)))
    sub.subset(font)
    font.flavor = 'woff2'
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue()


def face_block(family: str, b64: str) -> str:
    return (
        f'  <defs id="{STYLE_BLOCK_ID}"><style type="text/css">\n'
        f'@font-face {{\n'
        f"  font-family: '{family}';\n"
        f'  font-style: normal;\n'
        f'  font-weight: 400;\n'
        f'  src: url(data:font/woff2;base64,{b64}) format("woff2");\n'
        f'}}\n'
        f'  </style></defs>\n'
    )


def strip_old_block(svg: str) -> str:
    return re.sub(r'\s*<defs id="%s">.*?</defs>\n?' % STYLE_BLOCK_ID, '\n', svg, flags=re.S)


def process(path: str, font_path: str, family: str, check: bool) -> tuple:
    svg = io.open(path, encoding='utf-8').read()
    svg = strip_old_block(svg)
    used = chars_used(svg)
    if not used - {' '}:
        return (path, 0, 'no text')
    data = subset_woff2(font_path, used)
    b64 = base64.b64encode(data).decode('ascii')
    out = FAMILY_ATTR_RE.sub(f'font-family="{family}"', svg)
    out = FAMILY_STYLE_RE.sub(f'font-family:{family}', out)
    # place the @font-face right after the opening <svg ...> tag
    m = re.search(r'<svg\b[^>]*>', out)
    if not m:
        return (path, 0, 'no <svg> tag')
    out = out[:m.end()] + '\n' + face_block(family, b64) + out[m.end():]
    if not check:
        io.open(path, 'w', encoding='utf-8').write(out)
    return (path, len(data), f'{len(used)} glyphs')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--font', required=True)
    ap.add_argument('--family', required=True)
    ap.add_argument('--check', action='store_true')
    ap.add_argument('files', nargs='*')
    a = ap.parse_args()
    files = a.files or sorted(
        os.path.join('assets/panels', f) for f in os.listdir('assets/panels') if f.endswith('.svg'))
    total = 0
    for f in files:
        path, size, note = process(f, a.font, a.family, a.check)
        total += size
        print(f'  {os.path.basename(path):<48} {size/1024:7.1f} KB  {note}')
    print(f'\n{len(files)} files, {total/1024/1024:.2f} MB of embedded font data')


if __name__ == '__main__':
    main()
