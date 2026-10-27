#!/bin/bash
# Usage: ./make_video.sh stories/<id>.json out/<id>.mp4   — renders video (2 parallel workers) + sound, ~25-40 min
set -euo pipefail
STORY="$1"; OUT="$2"; DIR="$(cd "$(dirname "$0")" && pwd)"; TMP="$(mktemp -d)"
mkdir -p "$(dirname "$OUT")"
FR=$(python3 -c "import json;s=json.load(open('$STORY'));print(int(round(sum(x['dur'] for x in s['segments'])*24)))")
H=$(( FR * 11 / 20 ))
node "$DIR/render.js" "$STORY" 0 "$H" "$TMP/a.mp4" 8151 > "$TMP/a.log" 2>&1 &
P1=$!
node "$DIR/render.js" "$STORY" "$H" "$FR" "$TMP/b.mp4" 8152 > "$TMP/b.log" 2>&1 &
P2=$!
wait $P1 || { cat "$TMP/a.log"; exit 1; }
wait $P2 || { cat "$TMP/b.log"; exit 1; }
python3 "$DIR/sfx.py" "$STORY" "$TMP/sfx.wav"
printf "file '%s'\nfile '%s'\n" "$TMP/a.mp4" "$TMP/b.mp4" > "$TMP/list.txt"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$TMP/list.txt" -i "$TMP/sfx.wav" -map 0:v -map 1:a \
  -c:v libx264 -preset veryfast -crf 24 -pix_fmt yuv420p -c:a aac -b:a 160k -af "loudnorm=I=-15:TP=-1.5" -shortest -movflags +faststart "$OUT"
grep -h "PAGEERR\|ERR" "$TMP"/*.log || true
ffprobe -v error -show_entries format=duration,size -of compact "$OUT"
