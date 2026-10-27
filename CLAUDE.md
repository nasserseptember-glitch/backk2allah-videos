# backk2allah-videos — dagelijkse reminder-video's

Automatische productie van korte islamitische reminder-video's (Frans) voor het account van Nasser:
Instagram @backk.2allah, TikTok @backk2allah2, YouTube (via Metricool, brand/blogId **7687333**, timezone Europe/Brussels).
Stijl: 3D low-poly, eerste persoon, HUD-klokje links, korte Franse captions in cursief, zwart eindscherm met gouden vraag. Geen voice-over.

## Dagelijkse routine (2 video's per dag)

1. **Lees de geschiedenis**: `ls stories/` en lees de hooks/thema's van de laatste ~14 stories — herhaal geen hook, vers of verhaal.
2. **Schrijf 2 nieuwe verhalen** als `stories/YYYY-MM-DD-a.json` en `-b.json` (schema hieronder; voorbeelden: `stories/example-dernier-jour.json`, `stories/2026-10-27-a.json`, `-b.json`).
   - Taal: Frans, correct gespeld, smalle niet-afbrekende spatie (U+202F) vóór `?` `!` `:` waar passend, guillemets « … ».
   - **Koranverzen: ALLEEN letterlijk uit `verses.json`** (tekst + ref exact overnemen). Nooit zelf verzen of hadith verzinnen of parafraseren als citaat.
   - Geen afbeeldingen van profeten, geen gezichten van "Allah", geen spot of angstzaaierij; toon: oprecht, hoopvol einde.
   - Duur 45–60 s. Hook bovenaan in de eerste ~4 s, einde = zwart scherm met de hook-vraag + gouden antwoord.
3. **Render** elk verhaal (± 25–35 min per video, CPU):
   `./make_video.sh stories/<id>.json out/<id>.mp4`
   Controleer daarna een paar frames: `ffmpeg -i out/<id>.mp4 -vf "fps=1/4,scale=180:-1,tile=8x2" /tmp/check.png` en bekijk ze.
4. **Commit** de story-JSON's op `main` en push. Zet de video's op een orphan branch `media-YYYY-MM-DD` (map `v/`), push die branch.
   Publieke URL: `https://raw.githubusercontent.com/nasserseptember-glitch/backk2allah-videos/media-YYYY-MM-DD/v/<id>.mp4`
   Verwijder media-branches ouder dan 3 dagen (`git push origin --delete media-...`).
5. **Plan in via Metricool** (`createScheduledPost`, blogId 7687333), per video één post met providers instagram + tiktok + youtube:
   - Tijden: `getBestTimeToPostByNetwork` (instagram) voor vandaag; kies de piek in de ochtend (9–12u) voor video a en de avondpiek (17–20u) voor video b. Moet minstens 45 min in de toekomst liggen; anders beide in de avond, ≥2 u uit elkaar.
   - `autoPublish: true`, `media: [raw URL]`, `text`: post.caption + "\n\n" + post.hashtags.
   - `instagramData: {type: "REEL", showReelOnFeed: true, isAiGenerated: true}`
   - `tiktokData: {title: <hook, max 90 tekens>, privacyOption: "PUBLIC_TO_EVERYONE", isAigc: true}`
   - `youtubeData: {title: post.youtube_title (max 100), type: "short", privacy: "public", madeForKids: false, category: "PEOPLE_BLOGS", isAiGeneratedContent: false}`
6. Rapporteer kort: 2 titels, tijden, plannerUrl's.

## Story-schema (JSON)
- `segments`: lijst van `{scene, dur, opts}`; scenes:
  - `bed_dawn` — in bed, vóór zonsopgang. opts: `phone: "alarm"|"feed"|"none"`, `clock`, `sub` (tekst op alarmscherm), `snoozeAt` (s, duim drukt "Répéter"), `lowerPhone` (telefoon zakt op het einde)
  - `street` — wandelen door de stad met telefoon. opts: `dayFrom`/`dayTo` (0 = middag, 1 = zonsondergang), `clock` (op telefoonscherm), `phone: false`
  - `living` — woonkamer 's avonds, moeder in zetel, tv, kaars. opts: `collapseAt` (s; camera valt om, zwart — alleen voor "dood"-verhalen)
  - `grave` — donker graf, liggend naar boven. opts: `pulses` (s, lichtpulsen bij grote tekst), `flashEnd`
  - `bed_morning` — wakker worden in ochtendzon, gebedskleed in zonnestraal. opts: `clock`, `sub`, `flashIn`, `wake: false` (geen wazig-openen)
  - `black` — zwart scherm (voor vers of einde)
- Tijden hieronder zijn **absolute seconden** vanaf het begin van de video.
- `hook`: `{t0, t1, text, gold: [woorden in goud]}` (bovenaan)
- `hud`: lijst `{t0, t1, label, time | clock: ["13:07","19:58"], sub, glitch, alpha}`
- `captions`: `[[t0, t1, "tekst"], ...]` (max ~60 tekens, 2.5–4.5 s elk, nooit overlappend)
- `big`: `[[t0, t1, "tekst"]]` grote gouden tekst in het midden
- `verses`: `[{t0, t1, text, ref}]` (op een `black`-segment)
- `end`: `{t0, t1, text, goldT0, gold}`
- `goldWords`: woorden die in captions goud kleuren
- `post`: `{caption, hashtags, youtube_title}`

Tests: `node render.js stories/<id>.json 0 0 /tmp/st 8160 --stills 3,15,30` maakt stills.
