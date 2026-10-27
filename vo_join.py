"""Join per-line TTS clips (Speko tool-result JSON files, one per narration line, in order) into one narration.
Usage: python3 vo_join.py out/vo/<id>.wav out/vo/<id>.segs.json <result1.txt> <result2.txt> ...
Writes the narration wav + the [start,end] list that vo_mix.py expects. Fails if a clip was not made by google-tts."""
import sys, json, base64, io
import numpy as np
from scipy.io import wavfile

out_wav, out_segs, files = sys.argv[1], sys.argv[2], sys.argv[3:]
SR = None; parts = []; segs = []; t = 0.0
for f in files:
    j = json.load(open(f))
    if j.get('provider') != 'google-tts': sys.exit(f'{f}: provider {j.get("provider")} — not the chosen Gemini voice, synthesize this line again')
    sr, x = wavfile.read(io.BytesIO(base64.b64decode(j['audio_base64'])))
    x = x.astype(np.float32) / 32768
    if x.ndim > 1: x = x.mean(1)
    SR = SR or sr
    idx = np.where(np.abs(x) > 0.01)[0]
    x = x[max(0, idx[0] - int(0.03 * sr)):min(len(x), idx[-1] + int(0.12 * sr))]
    segs.append([round(t, 3), round(t + len(x) / sr, 3)])
    parts += [x, np.zeros(int(0.8 * sr), np.float32)]; t += len(x) / sr + 0.8
wavfile.write(out_wav, SR, (np.concatenate(parts) * 32767).astype(np.int16))
json.dump(segs, open(out_segs, 'w'))
print('joined', len(files), 'lines,', round(t, 1), 's')
