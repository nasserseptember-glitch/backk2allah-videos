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
    elif sc == 'office':  # fridge/AC hum, keyboard clicks, distant city
        out[:] += ((lp(BROWN, 200) * 0.03 + bp(PINK, 100, 140) * 0.02) * w)[:, None]
        if o.get('typing', True):
            tt = a + 0.5
            while tt < b - 0.3:
                put(hp(burst := rng.normal(0, 1, int(SR * 0.025)), 1500) * env(int(SR * 0.025), 0.001, 0.006) * 0.05, tt, pan=rng.uniform(-0.3, 0.3))
                tt += rng.uniform(0.08, 0.22) + (0.6 if rng.random() < 0.08 else 0)
    elif sc == 'train':  # rumble + rail clacks + air
        out[:] += ((lp(BROWN, 160) * 0.09 + bp(PINK, 300, 1500) * 0.03) * w)[:, None]
        tt = a + 0.3
        while tt < b - 0.2:
            for dt in (0, 0.12):
                n = int(SR * 0.08); put(lp(rng.normal(0, 1, n), 900) * env(n, 0.002, 0.03) * 0.12, tt + dt)
            tt += 1.15
    elif sc == 'kitchen':  # room tone, kettle hiss rising, cup clink, faint birds at dawn
        n = int(SR * d); k = np.clip(np.arange(n) / n, 0, 1)
        put(bp(rng.normal(0, 1, n), 2500, 7000) * (0.004 + 0.02 * k) * win(0, d, 0.8, 0.8)[:n], a)
        out[:] += (lp(BROWN, 250) * 0.02 * w)[:, None]
        put(verb(bell(2600, 0.15), 0.3) * 0.02, a + d * 0.6); put(verb(bell(3900, 0.1), 0.3) * 0.01, a + d * 0.6)
        if o.get('time') != 'night':
            for kk in range(int(d * 1.2)):
                f0 = rng.uniform(2800, 4400); m = int(SR * 0.1); u = np.arange(m) / SR
                put(verb(np.sin(2 * np.pi * (f0 + 900 * u / u[-1]) * u) * np.sin(np.pi * u / u[-1]) ** 2, 0.4) * 0.008, a + 0.5 + rng.random() * (d - 1), pan=rng.uniform(-0.8, 0.8))
    elif sc == 'park':  # wind in trees, leaves rustle, footsteps on leaves, birds
        out[:] += ((bp(PINK, 1500, 7000) * 0.025 * (0.6 + 0.4 * np.sin(T * 0.7)) + lp(BROWN, 300) * 0.02) * w)[:, None]
        if o.get('walk', True):
            tt = a + 0.3
            while tt < b - 0.2:
                n = int(SR * 0.12); put(bp(rng.normal(0, 1, n), 800, 6000) * env(n, 0.003, 0.04) * 0.06, tt, pan=0.2 if int(tt * 2) % 2 else -0.2); tt += 0.6
        for kk in range(int(d * 1.5)):
            f0 = rng.uniform(2600, 4600); m = int(SR * rng.uniform(0.06, 0.14)); u = np.arange(m) / SR
            put(verb(np.sin(2 * np.pi * (f0 + rng.uniform(-1500, 1500) * u / u[-1]) * u) * np.sin(np.pi * u / u[-1]) ** 2, 0.3) * 0.015, a + 0.5 + rng.random() * (d - 1), pan=rng.uniform(-0.8, 0.8))
    elif sc == 'hospital':  # ventilation hum + heart monitor beeps
        out[:] += ((lp(BROWN, 180) * 0.03 + bp(PINK, 2000, 5000) * 0.004) * w)[:, None]
        tt = a + 0.4
        while tt < b - 0.2:
            m = int(SR * 0.12); u = np.arange(m) / SR; put(np.sin(2 * np.pi * 1046 * u) * env(m, 0.003, 0.05) * 0.06, tt); tt += 1.1
    elif sc == 'wudu':  # running tap water
        n = int(SR * d)
        if o.get('water', True): put((bp(rng.normal(0, 1, n), 600, 9000) * 0.05 + bp(rng.normal(0, 1, n), 200, 900) * 0.02) * win(0, d, 0.4, 0.6)[:n], a)
        out[:] += (lp(BROWN, 200) * 0.015 * w)[:, None]
    elif sc == 'desert':  # soft wind + crackling fire
        out[:] += ((bp(PINK, 200, 1500) * 0.02 * (0.6 + 0.4 * np.sin(T * 0.4)) + lp(BROWN, 120) * 0.03) * w)[:, None]
        for kk in range(int(d * 9)):
            m = int(SR * rng.uniform(0.004, 0.02)); put(hp(rng.normal(0, 1, m), 1200) * env(m, 0.0005, 0.004) * rng.uniform(0.03, 0.12), a + 0.2 + rng.random() * (d - 0.4), pan=rng.uniform(-0.2, 0.2))
    elif sc == 'study':  # quiet room, clock ticking
        out[:] += (lp(BROWN, 200) * 0.02 * w)[:, None]
        tt = a + 0.3
        while tt < b - 0.1:
            m = int(SR * 0.02); put(hp(rng.normal(0, 1, m), 2500) * env(m, 0.0005, 0.004) * 0.05, tt, pan=-0.5); tt += 1.0
    elif sc == 'airport':  # big hall air, distant announcements chime, rolling suitcase, jet whine outside
        out[:] += ((lp(BROWN, 220) * 0.035 + bp(PINK, 300, 2500) * 0.015) * w)[:, None]
        for kk in range(max(1, int(d // 7))):
            t0 = a + 1.0 + kk * 7
            for j, f in enumerate([587.33, 739.99, 880.0]): put(verb(bell(f, 0.6), 0.6) * 0.03, t0 + j * 0.35)
        n = int(SR * d); u = np.arange(n) / SR
        put(bp(rng.normal(0, 1, n), 2500, 5000) * 0.006 * np.sin(np.pi * u / d), a)
        tt = a + 1.5
        while tt < b - 2:
            m = int(SR * 1.6); put(bp(rng.normal(0, 1, m), 100, 900) * env(m, 0.3, 0.8) * 0.03, tt, pan=rng.uniform(-0.6, 0.6)); tt += rng.uniform(3, 5)
    elif sc == 'bus_stop':  # rain on the shelter roof, tyres on wet road, bus brakes + door
        if o.get('rain', True):
            out[:] += ((bp(PINK, 800, 9000) * 0.06 + lp(BROWN, 200) * 0.03) * w)[:, None]
            for kk in range(int(d * 25)):
                m = int(SR * 0.006); put(hp(rng.normal(0, 1, m), 3000) * env(m, 0.0005, 0.002) * rng.uniform(0.02, 0.06), a + rng.random() * d, pan=rng.uniform(-0.8, 0.8))
        else: out[:] += (lp(BROWN, 200) * 0.03 * w)[:, None]
        for kk in range(int(d // 4)):
            m = int(SR * 3.0); u = np.arange(m) / SR
            put(bp(rng.normal(0, 1, m), 300, 4000) * np.exp(-((u - 1.5) / 0.6) ** 2) * 0.08, a + 0.5 + kk * 4 + rng.uniform(0, 1), pan=-0.4)
        if o.get('bus') is not None:
            bt = a + o['bus']; m = int(SR * 6); u = np.arange(m) / SR
            put(lp(rng.normal(0, 1, m), 180) * (u / 6) ** 2 * 0.25 + np.sin(2 * np.pi * 55 * u) * (u / 6) ** 2 * 0.05, bt - 6, pan=-0.3)
            m = int(SR * 0.9); put(bp(rng.normal(0, 1, m), 2500, 7000) * env(m, 0.01, 0.25) * 0.08, bt - 0.2, pan=-0.3)
            m = int(SR * 0.7); put(bp(rng.normal(0, 1, m), 300, 3000) * env(m, 0.05, 0.2) * 0.07, bt + 0.8, pan=-0.3)
    elif sc == 'library':  # deep quiet, page turns, a soft cough far away
        out[:] += (lp(BROWN, 150) * 0.015 * w)[:, None]
        if o.get('turn', True):
            tt = a + 2.75
            while tt < b - 0.3:
                m = int(SR * 0.35); put(bp(rng.normal(0, 1, m), 1500, 8000) * env(m, 0.04, 0.09) * 0.05, tt); tt += 5
        put(verb(bp(rng.normal(0, 1, int(SR * 0.25)), 300, 2000) * env(int(SR * 0.25), 0.01, 0.06), 0.6) * 0.015, a + d * 0.45, pan=0.5)
    elif sc == 'gym':  # treadmill motor + belt, footfalls, air con
        out[:] += ((bp(PINK, 90, 400) * 0.04 + bp(PINK, 2000, 6000) * 0.006) * w)[:, None]
        out[:] += (np.sin(2 * np.pi * 120 * T) * 0.006 * w)[:, None]
        if o.get('run', True):
            tt = a + 0.3; k = 0
            while tt < b - 0.2:
                m = int(SR * 0.08); put(lp(rng.normal(0, 1, m), 500) * env(m, 0.002, 0.03) * 0.12, tt, pan=0.15 if k % 2 else -0.15); tt += 0.35; k += 1
    elif sc == 'checkout':  # store hum, scanner beeps, belt motor, murmurs
        out[:] += ((bp(PINK, 60, 200) * 0.03 + bp(PINK, 300, 2500) * 0.02) * w)[:, None]
        tt = a + 1.0
        while tt < b - 0.5:
            m = int(SR * 0.12); u = np.arange(m) / SR; put(np.sin(2 * np.pi * 2400 * u) * env(m, 0.003, 0.05) * 0.05, tt, pan=0.2); tt += rng.uniform(1.0, 2.0)
        pay = a + d * o.get('pay', 0.6) + d * 0.2
        if pay < b:
            m = int(SR * 0.4); u = np.arange(m) / SR; put((np.sin(2 * np.pi * 1760 * u) * (u < 0.15) + np.sin(2 * np.pi * 2200 * u) * (u > 0.2)) * 0.05, pay)
    elif sc == 'classroom':  # silence, wall clock ticking, pen scratching
        out[:] += (lp(BROWN, 180) * 0.015 * w)[:, None]
        tt = a + 0.4
        while tt < b - 0.1:
            m = int(SR * 0.02); put(hp(rng.normal(0, 1, m), 2500) * env(m, 0.0005, 0.004) * 0.07, tt, pan=0.5); tt += 1.0
        if o.get('write', True):
            n = int(SR * d * 0.6); am = np.clip(np.sin(2 * np.pi * 1.1 * np.arange(n) / SR), 0, 1)
            put(bp(rng.normal(0, 1, n), 2500, 8000) * am * 0.02, a)
    elif sc == 'snow_street':  # muffled silence, soft wind, crunching steps in snow
        out[:] += ((lp(BROWN, 120) * 0.03 + bp(PINK, 300, 1200) * 0.012 * (0.6 + 0.4 * np.sin(T * 0.3))) * w)[:, None]
        if o.get('walk', True):
            tt = a + 0.3; k = 0
            while tt < b - 0.2:
                m = int(SR * 0.22); put(bp(rng.normal(0, 1, m), 400, 4000) * env(m, 0.01, 0.06) * (rng.random(m) > 0.4) * 0.09, tt, pan=0.15 if k % 2 else -0.15); tt += 0.65; k += 1
    elif sc == 'souk':  # crowd murmur, footsteps, a few hand claps/metal clinks of stalls
        am = lp(np.abs(rng.normal(0, 1, N)), 4); am /= am.max()
        out[:] += ((bp(PINK, 200, 2500) * 0.05 * (0.5 + am) + lp(BROWN, 200) * 0.03) * w)[:, None]
        for kk in range(int(d * 1.2)):
            put(verb(bell(rng.uniform(1800, 3200), 0.25), 0.4) * 0.012, a + 0.3 + rng.random() * (d - 0.6), pan=rng.uniform(-0.8, 0.8))
        if o.get('walk', True):
            tt = a + 0.3
            while tt < b - 0.2:
                m = int(SR * 0.1); put(lp(rng.normal(0, 1, m), 1200) * env(m, 0.002, 0.03) * 0.06, tt); tt += 0.6
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
