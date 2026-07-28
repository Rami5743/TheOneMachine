#!/usr/bin/env python3
"""Turn the speech text in the panel SVGs into vector outlines.

Why: an SVG that references a font by name renders differently on every machine
that has a different font installed, and Inkscape ignores @font-face entirely.
Outlines depend on nothing — the same file draws the same shapes in every
browser and every editor.

What it does per file:
  1. remembers the original <text> markup,
  2. repoints font-family at the chosen font,
  3. lets Inkscape do object-to-path (the same engine the artwork is edited in),
  4. puts the original <text> back inside <defs id="source-text">, where it does
     not render but stays greppable and lets this tool regenerate the outlines
     after a wording change.

    python3 tools/outline-text.py --font "Arimo" [files...]

Run it again after editing the text inside <defs id="source-text">: the stored
markup is what gets re-outlined.
"""
import argparse, io, os, re, subprocess, sys, tempfile

TEXT_BLOCK_RE = re.compile(r'<text\b.*?</text>', re.S)
SOURCE_DEFS_RE = re.compile(r'<defs id="source-text"[^>]*>(.*?)</defs>\s*', re.S)
FAMILY_ATTR_RE = re.compile(r'font-family="[^"]*"')
FAMILY_STYLE_RE = re.compile(r'font-family:[^;"\']*')


def source_text_blocks(svg):
    """The <text> elements to outline: the stored source if present, else live ones."""
    stored = SOURCE_DEFS_RE.search(svg)
    if stored:
        return TEXT_BLOCK_RE.findall(stored.group(1)), True
    return TEXT_BLOCK_RE.findall(svg), False


def outline(path, font, keep_source=True):
    svg = io.open(path, encoding='utf-8').read()
    blocks, from_store = source_text_blocks(svg)
    if not blocks:
        return 'no text'

    # rebuild a text-carrying document: drop any previous outlines and stored copy
    work = SOURCE_DEFS_RE.sub('', svg)
    if from_store:
        # the live text was already replaced by outlines last time - strip those
        work = re.sub(r'<g\b[^>]*id="outlined-text"[^>]*>.*?</g>\s*', '', work, flags=re.S)
        anchor = re.search(r'</svg>', work)
        work = work[:anchor.start()] + '\n'.join(blocks) + '\n' + work[anchor.start():]

    work = FAMILY_ATTR_RE.sub(f'font-family="{font}"', work)
    work = FAMILY_STYLE_RE.sub(f'font-family:{font}', work)

    d = os.path.dirname(os.path.abspath(path))
    with tempfile.NamedTemporaryFile('w', suffix='.svg', dir=d, delete=False, encoding='utf-8') as tf:
        tf.write(work)
        tmp_in = tf.name
    tmp_out = tmp_in.replace('.svg', '.out.svg')
    try:
        subprocess.run(['inkscape', tmp_in, '--actions=select-all:all;object-to-path',
                        f'--export-filename={tmp_out}', '--export-plain-svg'],
                       check=True, capture_output=True, timeout=180)
        out = io.open(tmp_out, encoding='utf-8').read()
    finally:
        for f in (tmp_in, tmp_out):
            if os.path.exists(f):
                os.remove(f)

    if '<text' in out:
        return 'FAILED: text survived'
    if keep_source:
        stored = ('  <defs id="source-text" style="display:none">\n'
                  + '\n'.join(blocks) + '\n  </defs>\n')
        m = re.search(r'</svg>', out)
        out = out[:m.start()] + stored + out[m.start():]
    io.open(path, 'w', encoding='utf-8').write(out)
    return f'{len(blocks)} text block(s) outlined'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--font', required=True)
    ap.add_argument('files', nargs='*')
    a = ap.parse_args()
    files = a.files or sorted(os.path.join('assets/panels', f)
                              for f in os.listdir('assets/panels') if f.endswith('.svg'))
    for f in files:
        before = os.path.getsize(f)
        note = outline(f, a.font)
        after = os.path.getsize(f)
        print(f'  {os.path.basename(f):<48} {before/1024:6.1f} -> {after/1024:6.1f} KB  {note}')


if __name__ == '__main__':
    main()
