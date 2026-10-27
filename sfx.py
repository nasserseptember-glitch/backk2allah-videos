"""Generate a sound-design track for a story JSON. Usage: python3 sfx.py story.json out.wav"""
import sys, json
import numpy as np
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

S = json.load(open(sys.argv[1]))
SR = 48000
DUR = sum(s['dur'] for s in S['segments'])
N = int(SR * DUR)
rng = np.random.default_rng(abs(hash(S.get('id', 'x'))) % 2**32)
out = np.zeros((N, 2))
T = np.arange(N) / SR

def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, btype='low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, btype='high', fs=SR, output='sos'), x)
def env(n, a, d):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def put(sig, t0, gain=1.0, pan=0.0):
    i = int(t0 * SR); n = min(len(sig), N - i)
    if n <= 0 or i < 0: return
    out[i:i + n, 0] += sig[:n] * gain * np.sqrt(0.5 * (1 - pan)); out[i:i + n, 1] += sig[:n] * gain * np.sqrt(0.5 * (1 + pan))
def win(t0, t1, fi=0.4, fo=0.4): return np.clip(np.minimum((T - t0) / fi, (t1 - T) / fo), 0, 1)
def brown(n):
    x = np.cumsum(rng.normal(0, 1, n)); x = hp(x, 20); return x / (np.abs(x).max() + 1e-9)
def pink(n):
    w = rng.normal(0, 1, n); f = np.fft.rfft(w); k = np.arange(len(f)); k[0] = 1; f /= np.sqrt(k); x = np.fft.irfft(f, n); return x / np.abs(x).max()
IR = rng.normal(0, 1, int(SR * 1.6)) * np.exp(-np.arange(int(SR * 1.6)) / SR / 0.35); IR /= np.abs(IR).sum() ** 0.5 * 6
def verb(x, wet=0.35): return x + fftconvolve(x, IR)[:len(x)] * wet
def bell(f, d):
    n = int(SR * d * 3); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3.01 * f * t)) * env(n, 0.004, d)
def boom(d=3.0, f=42, g=1.0):
    n = int(SR * d); tt = np.arange(n) / SR
    s = np.sin(2 * np.pi * (f + 10 * np.exp(-tt * 6)) * tt) * env(n, 0.01, d / 4) + lp(rng.normal(0, 1, n), 140) * env(n, 0.01, 0.5) * 0.6
    return verb(s, 0.4) * g

BROWN, PINK = brown(N), pink(N)
a = 0.0
for sg in S['segments']:
    sc, d, o = sg['scene'], sg['dur'], sg.get('opts', {})
    b = a + d
    w = win(a, b)
    if sc == 'bed_dawn':
        out[:] += (lp(BROWN, 300) * 0.02 * w)[:, None]
        if o.get('phone') == 'alarm':
            stop = a + o.get('snoozeAt', d)
            t = a + 0.6
            while t < stop - 0.3:
                for k, f in enumerate([659.25, 783.99, 987.77, 1318.5, 987.77, 783.99]):
                    put(verb(bell(f, 0.5), 0.25), t + k * 0.16, 0.06)
                t += 1.3
            t = a + 0.5
            while t < stop - 0.4:
                n = int(SR * 0.45); tt = np.arange(n) / SR
                s = np.sign(np.sin(2 * np.pi * 155 * tt)) * np.minimum(1, tt / 0.02) * np.minimum(1, (0.45 - tt) / 0.02)
                put(lp(s, 600) * 0.05, t); t += 1.0
            if 'snoozeAt' in o:
                n = int(SR * 0.05); put(hp(rng.normal(0, 1, n), 2000) * env(n, 0.001, 0.008) * 0.12, stop)
    elif sc == 'street':
        out[:] += ((bp(PINK, 150, 3000) * 0.11 + lp(BROWN, 200) * 0.06) * w)[:, None]
        t = a + 0.2
        k = 0
        while t < b - 0.2:
            n = int(SR * 0.12)
            s = lp(rng.normal(0, 1, n), 900) * env(n, 0.002, 0.03) + np.sin(2 * np.pi * 80 * np.arange(n) / SR) * env(n, 0.002, 0.04) * 0.6
            put(s * 0.09, t, pan=(-0.15 if k % 2 else 0.15)); t += 0.56; k += 1
        for i in range(int(d // 3.5)):
            n = int(SR * 3.0); tt = np.arange(n) / SR
            put(bp(rng.normal(0, 1, n), 80, 1200) * np.exp(-((tt - 1.5) / 0.7) ** 2) * 0.07, a + 1 + i * 3.4, pan=rng.uniform(-0.7, 0.7))
        if o.get('phone', True):
            for i in range(int(d // 2.5)):
                n = int(SR * 0.6); tt = np.arange(n) / SR
                s = (np.sin(2 * np.pi * 1318.5 * tt) * (tt < 0.1) + np.sin(2 * np.pi * 1760 * tt) * (tt >= 0.1)) * env(n, 0.003, 0.12)
                put(verb(s, 0.2) * 0.05, a + 1.5 + i * 2.4 + rng.uniform(0, 0.8), pan=0.3)
    elif sc == 'living':
        ca = o.get('collapseAt')
        lw = win(a, a + ca + 2.3 if ca is not None else b, 0.4, 0.25)
        am = lp(np.abs(rng.normal(0, 1, N)), 5); am /= am.max()
        out[:] += ((bp(rng.normal(0, 1, N), 250, 2600) * am * 0.07 + lp(BROWN, 250) * 0.025) * lw)[:, None]
        if ca is not None:
            t = a + ca - 1.6; ibi = 0.86; i = 0
            while t < a + ca + 2.2:
                for off, g in [(0, 1.0), (0.17, 0.7)]:
                    n = int(SR * 0.25); tt = np.arange(n) / SR
                    put(np.sin(2 * np.pi * (52 - 20 * tt) * tt) * env(n, 0.005, 0.07) * g * 0.5 * min(1, 0.35 + i * 0.15), t + off)
                t += ibi; ibi *= 1.07; i += 1
            out[:] += (win(a + ca + 2.1, a + ca + 5.6, 0.3, 2.5) * np.sin(2 * np.pi * 3600 * T) * 0.012)[:, None]
    elif sc == 'grave':
        out[:] += (lp(BROWN, 160) * 0.10 * win(a, b, 2.5, 0.2))[:, None]
        for k in range(int(d * 2)):
            n = int(SR * 0.4)
            s = bp(rng.normal(0, 1, n), 1500, 6000) * env(n, 0.005, 0.06) * (rng.random(n) > 0.92)
            put(s * 0.03, a + 0.6 + rng.random() * (d - 1), pan=rng.uniform(-0.6, 0.6))
        for q in o.get('pulses', []): put(boom(3.5, 48, 0.5), a + q)
        if o.get('flashEnd'):
            n = int(SR * 1.3); tt = np.arange(n) / SR
            put(bp(rng.normal(0, 1, n), 300, 8000) * (tt / 1.3) ** 3 * 0.25, b - 1.3)
    elif sc == 'bed_morning':
        out[:] += ((lp(BROWN, 300) * 0.02 + bp(PINK, 400, 4000) * 0.012) * win(a, b, 0.8, 0.8))[:, None]
        for k in range(int(d * 2.6)):
            f0 = rng.uniform(2600, 4600); n = int(SR * rng.uniform(0.06, 0.16)); tt = np.arange(n) / SR
            t0 = a + 0.6 + rng.random() * (d - 1)
            for rep in range(rng.integers(1, 4)):
                s = np.sin(2 * np.pi * (f0 + rng.uniform(-1500, 1500) * tt / tt[-1]) * tt) * np.sin(np.pi * tt / tt[-1]) ** 2
                put(verb(s, 0.3) * 0.02, t0 + rep * 0.13, pan=rng.uniform(-0.8, 0.8))
    elif sc == 'black':
        out[:] += (lp(BROWN, 120) * 0.04 * win(a, b, 1.0, 1.0))[:, None]
    a = b

for v in S.get('verses', []): put(boom(4, 40, 0.55), v['t0'])
for bg in S.get('big', []): put(boom(3.5, 48, 0.4), bg[0])
if S.get('end'):
    put(boom(4, 44, 0.4), S['end']['t0'])
    if S['end'].get('gold'):
        n = int(SR * 3); tt = np.arange(n) / SR
        put(verb(np.sin(2 * np.pi * 523.25 * tt) * env(n, 0.01, 0.9) * 0.5 + np.sin(2 * np.pi * 784 * tt) * env(n, 0.01, 0.7) * 0.25, 0.5) * 0.08, S['end']['goldT0'])

out = np.tanh(out * 1.6) / 1.6
out = out / (np.abs(out).max() + 1e-9) * 0.89
wavfile.write(sys.argv[2], SR, (out * 32767).astype(np.int16))
print('sfx ok', round(DUR, 2), 's')
