#!/usr/bin/env python3
"""Rewrite the speech text in the panel SVGs the way Inkscape writes text.

The slides were generated with one <text> holding absolutely-positioned <tspan>s
and no sodipodi:role, which Inkscape reads as a pile of separately placed chunks
rather than a paragraph — typing does not reflow and Enter does not open a line.
They also carried dominant-baseline:middle, an alignment Inkscape has no notion
of, so it drew the block a few pixels away from where the browser did.

This rewrites each <text> into Inkscape's own form: the presentation attributes
folded into style (text-align, line-height, direction), sodipodi:role="line" on
every tspan, and no dominant-baseline — with the line y values shifted by the
offset that alignment was contributing, so the browser renders it unchanged.

Whitespace between the tspans is carried over verbatim. Those stray spaces are
real text nodes under xml:space="preserve" and they nudge the centring of the
line they trail, so dropping them would move text by a few pixels.

    python3 tools/inkscape-text.py [--check] [files...]

Wording and line breaks are untouched; only the markup around them changes.
"""
import argparse
import io
import os
import re

# dominant-baseline:middle lifts the glyphs by half the x-height; measured
# against the shipped font at 34.2662px it came out as 9.19px.
MIDDLE_SHIFT = 9.19 / 34.2662

TEXT_RE = re.compile(r'<text\b(?P<attrs>[^>]*)>(?P<body>.*?)</text>', re.S)
TSPAN_RE = re.compile(r'<tspan\b(?P<attrs>[^>]*)>(?P<text>[^<]*)</tspan>', re.S)


def attr(attrs, name):
    m = re.search(r'\b%s\s*=\s*"([^"]*)"' % re.escape(name), attrs)
    return m.group(1) if m else None


def style_prop(attrs, name):
    st = attr(attrs, 'style') or ''
    m = re.search(r'(?:^|;)\s*%s\s*:\s*([^;]+)' % re.escape(name), st)
    return m.group(1).strip() if m else None


def prop(attrs, name, default=None):
    return style_prop(attrs, name) or attr(attrs, name) or default


def convert_text(m):
    attrs, body = m.group('attrs'), m.group('body')

    size = float(re.sub(r'[^\d.]', '', prop(attrs, 'font-size', '16px')) or 16)
    family = prop(attrs, 'font-family', "'Noto Sans Hebrew', Arial, sans-serif")
    weight = prop(attrs, 'font-weight', '400')
    fill = prop(attrs, 'fill', '#000000')
    anchor = prop(attrs, 'text-anchor', 'start')
    direction = prop(attrs, 'direction', 'ltr')
    # keep unicode-bidi: without it the stray whitespace between the tspans joins
    # the RTL paragraph and drags the line it trails sideways by a space width
    bidi = prop(attrs, 'unicode-bidi')
    shift = MIDDLE_SHIFT * size if prop(attrs, 'dominant-baseline') == 'middle' else 0.0

    # the text nodes sitting between the tspans, kept exactly as they are
    seps, lines, pos = [], [], 0
    for sm in TSPAN_RE.finditer(body):
        seps.append(body[pos:sm.start()])
        pos = sm.end()
        sattrs = sm.group('attrs')
        lines.append((float(attr(sattrs, 'x') or attr(attrs, 'x') or 0),
                      float(attr(sattrs, 'y') or attr(attrs, 'y') or 0) + shift,
                      sm.group('text')))
    seps.append(body[pos:])

    if not lines:                      # a <text> holding its words directly
        inner = body.strip()
        if not inner or '<' in inner:
            return m.group(0)
        lines = [(float(attr(attrs, 'x') or 0), float(attr(attrs, 'y') or 0) + shift, inner)]
        seps = ['', '']

    step = (lines[1][1] - lines[0][1]) if len(lines) > 1 else size * 1.2
    align = {'middle': 'center', 'end': 'end', 'start': 'start'}.get(anchor, 'start')

    style = (
        'font-style:normal;font-variant:normal;font-weight:%s;font-stretch:normal;'
        'font-size:%gpx;line-height:%.4f;font-family:%s;'
        'text-align:%s;writing-mode:lr-tb;direction:%s;%stext-anchor:%s;'
        'fill:%s;fill-opacity:1;stroke:none'
        % (weight, size, step / size if size else 1.2, family, align, direction,
           ('unicode-bidi:%s;' % bidi) if bidi else '', anchor, fill)
    )

    tid = attr(attrs, 'id') or 'bubble-text'
    out = ['<text\n     xml:space="preserve"\n     style="%s"\n     x="%.5f"\n     y="%.5f"\n     id="%s"\n     >'
           % (style, lines[0][0], lines[0][1], tid)]
    for i, (x, y, text) in enumerate(lines):
        out.append(seps[i])
        out.append('<tspan\n       sodipodi:role="line"\n       id="%s-line%d"\n       x="%.5f"\n       y="%.5f">%s</tspan>'
                   % (tid, i + 1, x, y, text))
    out.append(seps[-1])
    out.append('</text>')
    return ''.join(out)


def ensure_sodipodi_ns(svg):
    if 'xmlns:sodipodi' in svg:
        return svg
    return re.sub(r'(<svg\b)',
                  r'\1\n   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"',
                  svg, count=1)


def process(path, check):
    svg = io.open(path, encoding='utf-8').read()
    if '<text' not in svg:
        return 'no text'
    if 'sodipodi:role' in svg:
        return 'already converted'
    new = ensure_sodipodi_ns(TEXT_RE.sub(convert_text, svg))
    if new == svg:
        return 'nothing to convert'
    if not check:
        io.open(path, 'w', encoding='utf-8').write(new)
    return '%d text element(s)' % len(TEXT_RE.findall(svg))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--check', action='store_true')
    ap.add_argument('files', nargs='*')
    a = ap.parse_args()
    files = a.files or sorted(os.path.join('assets/panels', f)
                              for f in os.listdir('assets/panels') if f.endswith('.svg'))
    for f in files:
        print('  %-50s %s' % (os.path.basename(f), process(f, a.check)))


if __name__ == '__main__':
    main()
