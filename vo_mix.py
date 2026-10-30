"""Voice-over helper.
  python3 vo_mix.py script <story.json>                 -> prints the narration text to send to TTS (one line per caption, long pauses between)
  python3 vo_mix.py mix <story.json> <vo.wav> <in.mp4> <out.mp4>
      splits the narration at the N-1 longest pauses, places each line at its caption start, ducks the sound design, remuxes.
"""
import sys, os, json, subprocess, tempfile, os
import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly

def lines(S):
    L = []
    if S.get('hook'): L.append((S['hook']['t0'] + 0.2, S['hook']['t1'], S['hook']['text']))
    for a, b, t in S.get('captions', []): L.append((a + 0.1, b, t))
    for a, b, t in S.get('big', []): L.append((a + 0.1, b, t))
    for v in S.get('verses', []):
        name, num = [p.strip() for p in v['ref'].split('—')]
        if S.get('lang') == 'ar':  # verse shown in Arabic on screen; the narrator only introduces it (no TTS recitation of the Quran)
            L.append((v['t0'] + 0.3, v['t1'], 'قال الله تعالى'))
        elif S.get('lang') == 'en':
            verse = num.split(':')[1].replace('-', ' to ')
            L.append((v['t0'] + 0.3, v['t1'], v['text'].strip('“”" .') + '. ' + name + ', verse ' + verse + '.'))
        else:
            verse = num.split(':')[1].replace('-', ' à ')
            L.append((v['t0'] + 0.3, v['t1'], v['text'].strip('«» .') + '. ' + name + ', verset ' + verse + '.'))
    if S.get('end') and S['end'].get('gold'): L.append((S['end']['goldT0'] + 0.1, S['end']['t1'], S['end']['gold']))
    L.sort()
    return L

def clean(t): return t.replace(' ', ' ').replace(' ', ' ').replace('«', '').replace('»', '').strip()

if sys.argv[1] == 'script':
    S = json.load(open(sys.argv[2]))
    print('\n\n... ...\n\n'.join(clean(t) for _, _, t in lines(S)))
    sys.exit()

sp, vop, vin, vout = sys.argv[2:6]
SEGS = json.load(open(sys.argv[6])) if len(sys.argv) > 6 else None  # optional [[start_s, end_s], ...] per line (from word timestamps)
S = json.load(open(sp)); L = lines(S)
sr, x = wavfile.read(vop); x = x.astype(np.float32) / 32768
if x.ndim > 1: x = x.mean(1)
# energy envelope
hop = int(sr * 0.01); e = np.sqrt(np.convolve(x ** 2, np.ones(hop * 3) / (hop * 3), 'same'))[::hop]
voiced = e > max(0.01, np.percentile(e, 70) * 0.12)
# runs of silence
gaps = []; i = 0
while i < len(voiced):
    if not voiced[i]:
        j = i
        while j < len(voiced) and not voiced[j]: j += 1
        if i > 0 and j < len(voiced): gaps.append((j - i, i, j))
        i = j
    else: i += 1
need = len(L) - 1
if SEGS:
    if len(SEGS) != len(L): sys.exit(f'segments file has {len(SEGS)} entries for {len(L)} lines')
    starts = [int(a / 0.01) for a, b in SEGS]; ends = [int(b / 0.01) + 8 for a, b in SEGS]
else:
    gaps = sorted(sorted(gaps, reverse=True)[:need], key=lambda g: g[1])
    if len(gaps) != need: sys.exit(f'could not split narration: {len(gaps)} gaps for {len(L)} lines')
    starts = [int(np.argmax(voiced))] + [g[2] for g in gaps]
    ends = [g[1] for g in gaps] + [len(voiced) - int(np.argmax(voiced[::-1]))]
dur = sum(s['dur'] for s in S['segments'])
OSR = 48000
vo = np.zeros(int(OSR * dur) + OSR)
prev_end = 0.0
for k, ((t0, t1, txt), s0, s1) in enumerate(zip(L, starts, ends)):
    t0 = max(t0, prev_end + 0.15)
    seg = x[max(0, (s0 - 4) * hop):(s1 + 6) * hop]
    seg = resample_poly(seg, OSR, sr)
    nxt = L[k + 1][0] if k + 1 < len(L) else dur
    room = nxt - t0 - 0.15
    ln = len(seg) / OSR
    if ln > room and room > 0.5:  # speed up slightly (max 1.25x) via resampling-free time compression
        f = min(1.12, ln / room)
        tmp = tempfile.mkdtemp(); wavfile.write(f'{tmp}/i.wav', OSR, (seg * 32767).astype(np.int16))
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f'{tmp}/i.wav', '-af', f'atempo={f:.3f}', f'{tmp}/o.wav'], check=True)
        seg = wavfile.read(f'{tmp}/o.wav')[1].astype(np.float32) / 32768
    i0 = int(t0 * OSR); n = min(len(seg), len(vo) - i0)
    fade = np.ones(n); fl = min(n, int(0.02 * OSR)); fade[:fl] = np.linspace(0, 1, fl); fade[-fl:] = np.linspace(1, 0, fl)
    vo[i0:i0 + n] += seg[:n] * fade
    prev_end = t0 + len(seg) / OSR
    if S.get('lang') == 'ar' and txt == 'قال الله تعالى':  # Arabic: real recitation (Alafasy, engine/recit) right after the intro
        v = next((v for v in S.get('verses', []) if v.get('audio') and v['t0'] <= t0 <= v['t1'] + 1), None)
        if v:
            rsr, r = wavfile.read(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'engine', 'recit', v['audio']))
            r = r.astype(np.float32) / 32768
            if r.ndim > 1: r = r.mean(1)
            r = resample_poly(r, OSR, rsr)
            nv = np.abs(x) > 0.02; nar = np.sqrt((x[nv] ** 2).mean()) if nv.any() else 0.1
            rv = np.abs(r) > 0.02; r = r / (np.sqrt((r[rv] ** 2).mean()) + 1e-9) * nar * 0.85
            r0 = prev_end + 0.25; i0 = int(r0 * OSR); n = min(len(r), len(vo) - i0)
            vo[i0:i0 + n] += r[:n]; prev_end = r0 + n / OSR
            print(f'{r0:6.2f}s  recitation {v["audio"]} {len(r) / OSR:4.1f}s (verse shown until {v["t1"]}s)')
    print(f'{t0:6.2f}s  {ln:4.1f}s/{room:4.1f}s  {clean(txt)[:60]}')
tmp = tempfile.mkdtemp()
wavfile.write(f'{tmp}/vo.wav', OSR, (np.clip(vo, -1, 1) * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', vin, '-i', f'{tmp}/vo.wav', '-filter_complex',
                '[1:a]aformat=channel_layouts=stereo,highpass=f=80,equalizer=f=3000:t=q:w=1.2:g=3,acompressor=threshold=-22dB:ratio=4:attack=8:release=180,volume=2.4,asplit[v1][v2];'
                '[0:a]volume=0.55[bg];[bg][v1]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=450[duck];'
                '[duck][v2]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.5[a]',
                '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', vout], check=True)
print('mixed ->', vout)
