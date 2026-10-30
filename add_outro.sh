#!/bin/bash
# Usage: ./add_outro.sh in.mp4 charon|puck out.mp4 [en|ar]  (language card + voice)  — appends the Back2Allah subscribe card (logo + name + voice)
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"; IN="$1"; VOICE="$2"; OUT="$3"; L="${4:-}"; CARD="$DIR/engine/outro.mp4"; VW="$DIR/engine/outro_${VOICE}.wav"
if [ -n "$L" ]; then CARD="$DIR/engine/outro_${L}.mp4"; VW="$DIR/engine/outro_${L}_${VOICE}.wav"; fi
ffmpeg -y -loglevel error -i "$IN" -i "$CARD" -i "$VW" -filter_complex \
 "[0:v]fps=24,format=yuv420p,setsar=1[v0];[1:v]fps=24,format=yuv420p,setsar=1[v1];\
  [0:a]aformat=sample_rates=48000:channel_layouts=stereo[a0];\
  [2:a]aresample=48000,aformat=channel_layouts=stereo,highpass=f=80,acompressor=threshold=-22dB:ratio=4,adelay=700|700,apad=whole_dur=4.5,atrim=0:4.5,loudnorm=I=-15:TP=-1.5,aformat=sample_rates=48000:channel_layouts=stereo[a1];\
  [v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
 -map "[v]" -map "[a]" -c:v libx264 -preset veryfast -crf 23 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
