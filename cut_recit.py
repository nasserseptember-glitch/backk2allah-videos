"""Cut Alafasy recitation excerpts for the Arabic videos (verses_ar.json -> engine/recit/*.wav).
Usage: python3 cut_recit.py <dir with SSSAAA.mp3 files (+ 057.mp3 full surah)>"""
import sys, json, subprocess, numpy as np, os
from scipy.io import wavfile
D = sys.argv[1]; SR = 48000
V = json.load(open(os.path.join(os.path.dirname(__file__), 'verses_ar.json')))
def load(f):
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
def snap(x, a, b):  # quietest 20 ms frame between a and b seconds
    if b - a < 0.03: return a
    h = int(0.02 * SR); i0, i1 = int(a * SR), min(len(x), int(b * SR))
    e = [np.sqrt((x[i:i + h] ** 2).mean()) for i in range(i0, max(i0 + 1, i1 - h), h // 2)]
    return (i0 + int(np.argmin(e)) * (h // 2) + h // 2) / SR
for v in V:
    parts = []
    for p in v['cut']:
        x = load(os.path.join(D, p['file']))
        s = 0.0 if p['start'] is None else snap(x, *p['start'])
        e = len(x) / SR if p['end'] is None else snap(x, *p['end'])
        seg = x[int(max(0, s - 0.02) * SR):int(e * SR)]
        n = len(seg); fi, fo = int(0.03 * SR), int(min(0.35, n / SR / 4) * SR)
        seg = seg.copy(); seg[:fi] *= np.linspace(0, 1, fi); seg[-fo:] *= np.linspace(1, 0, fo)
        parts += [seg, np.zeros(int(0.35 * SR), np.float32)]
    y = np.concatenate(parts[:-1])
    voiced = y[np.abs(y) > 0.02]; y = y / (np.sqrt((voiced ** 2).mean()) + 1e-9) * 0.12  # same speech RMS for every clip
    y = np.clip(y, -0.98, 0.98)
    out = os.path.join(os.path.dirname(__file__), 'engine', 'recit', v['audio'])
    wavfile.write(out, SR, (y * 32767).astype(np.int16))
    print(f"{v['audio']:22s} {len(y) / SR:5.1f}s")
