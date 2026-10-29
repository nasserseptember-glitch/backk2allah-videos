# backk2allah-videos — dagelijkse reminder-video's

Automatische productie van korte islamitische reminder-video's (Frans) voor het account van Nasser:
Instagram @backk.2allah, TikTok @backk2allah2, YouTube (via Metricool, brand/blogId **7687333**, timezone Europe/Brussels).
Stijl: 3D low-poly, eerste persoon, HUD-klokje links, korte Franse captions in cursief, zwart eindscherm met gouden vraag. Franse voice-over (zie stap 3b).

## FORMAT VAN ALLE VIDEO'S (wens van de gebruiker, vanaf 2026-10-30) — gaat vóór de andere stijlregels
De video "6 heures sur ton écran aujourd'hui. Et pour Allah ?" (`stories/2026-10-28-c.json`) werkte het best. **Alle 3 video's per dag volgen dit format**, telkens met een ander onderwerp, verhaal en beeld (geen chibi/cartoonstijl in de dagelijkse video's, tenzij een verzoek in `requests/` het vraagt). Lees dat bestand als voorbeeld van de opbouw, maar kopieer de tekst of het onderwerp niet.
- **Krachtig begin (belangrijkst):** de hook staat er vanaf ±0,3 s, op zwart of over een sterk eerste beeld. Het is één korte, directe zin in de "tu"-vorm, uit het dagelijkse leven, liefst met een **concreet getal of tijdstip** en een **tegenstelling met Allah/de dood/de Akhira**. Max ±60 tekens, geen inleiding of "Et si…". De stem begint meteen met de hook.
  Voorbeelden van het soort (niet letterlijk hergebruiken): « 47 notifications aujourd'hui. Combien d'appels à la prière ? » · « Tu as répondu à tout le monde. Sauf à Allah. » · « 2 h de série hier soir. 2 minutes pour Fajr ? » · « Ton téléphone : 100 %. Ton imân : ? » · « 3 000 pas pour le shopping. 0 vers la mosquée. »
- **Eerste 7 s:** na de hook meteen een tweede korte zin die het pijnlijk concreet maakt, bv. « Ton téléphone tient les comptes. ». Geen trage opbouw en geen landschap zonder tekst.
- **Teller/HUD als bewijs:** een HUD die het getal toont tegenover iets voor Allah, bv. "TEMPS D'ÉCRAN 6H12 / POUR ALLAH : 0 MIN" of "MESSAGES ENVOYÉS 83 / DUA : 0". Later in de video volgt een HUD die de verandering toont.
- **Opbouw:** het herkenbare "avant" (korte zinnen van 2,5–3,5 s, ritme « Une vidéo. Puis une autre. Puis cent. ») → vers op zwart (alleen uit verses.json) → "après" met een kleine, haalbare stap → einde op zwart met de hook-vraag opnieuw + een gouden **concrete opdracht met tijd** (bv. « Donne-Lui cinq minutes. Ce soir. »).
- **Toon:** confronterend maar liefdevol, nooit beschuldigend of angstzaaiend, met een hoopvol einde.
- **Elke dag 3 verschillende onderwerpen**, nooit 2 keer hetzelfde getal of thema in een week. Denk aan: schermtijd, uitstellen van gebed, slapen tijdens Fajr, roddelen, muziek/series, geld vs sadaqa, ouders bellen, Koran die stof verzamelt, jaren die voorbijvliegen, wachten op "later", dua vergeten, dankbaarheid, enz.
- De variatieregels hieronder (andere decors/openingsscènes/opts) blijven gelden voor de **beelden**: elke video ziet er anders uit (andere scenes, moment van de dag, HUD-label).

## Dagelijkse routine (3 video's per dag: 10:00, 18:00 en 20:00)

0. **Verzoeken van de gebruiker:** kijk of `requests/<datum van vandaag>.md` bestaat. Zo ja: volg dat verzoek voor de video die erin staat (onderwerp, tijd, stem) — dat gaat vóór de gewone variatieregels. De andere video's van die dag blijven vrij.
1. **Lees de geschiedenis**: `ls stories/` en lees de hooks/thema's van de laatste ~14 stories — herhaal geen hook, vers of verhaal.
2. **Schrijf 3 nieuwe verhalen** als `stories/YYYY-MM-DD-a.json`, `-b.json` en `-c.json` (alle drie verschillend van elkaar en van de vorige dagen) (schema hieronder; voorbeelden: `stories/example-dernier-jour.json`, `stories/2026-10-27-a.json`, `-b.json`).
   - Taal: Frans, correct gespeld, smalle niet-afbrekende spatie (U+202F) vóór `?` `!` `:` waar passend, guillemets « … ».
   - **Koranverzen: ALLEEN letterlijk uit `verses.json`** (tekst + ref exact overnemen). Nooit zelf verzen of hadith verzinnen of parafraseren als citaat.
   - Geen afbeeldingen van profeten, geen gezichten van "Allah", geen spot of angstzaaierij; toon: oprecht, hoopvol einde.
   - **Variatie (belangrijk, wens van de gebruiker):** elk verhaal speelt in een andere context en situatie. Gebruik per video minstens 2 verschillende decors en kies decors die je in de vorige 4 video's niet als hoofddecor gebruikte. Wissel thema's af (bv. gemis van een ouder aan tafel, nachtelijk piekeren op het dak, naar Fajr in de moskee wandelen, onderweg in de auto, dankbaarheid aan zee, berouw, geduld, dua, dunya/telefoon, dood en tweede kans). Niet elke video een graf of slaapkamer.
   - **Elke video ziet er anders uit en heeft een ander verhaal (expliciete wens van de gebruiker):**
     - **Opening variëren:** NIET standaard beginnen met wakker worden / gsm in bed. Kies per video een andere eerste scène en kijk naar de openingsscène van de vorige 6 video's — gebruik die niet opnieuw. Voorbeelden van openingen: rijden in de regen om 23u, op het dak naar de sterren kijken, aan zee bij zonsondergang, binnenstappen in de moskee, een stille familietafel met een lege stoel, door de drukke stad lopen, de minaret bij dageraad, een zwart scherm met één zin.
     - **Structuur variëren:** niet altijd hook → 3 scènes → vers op zwart → ochtend → einde. Wissel af: vers aan het begin of het einde, een vraag/antwoord-opbouw, een tijdsprong (gisteren/vandaag), een brief aan jezelf, een tegenstelling (twee levens naast elkaar), een aftelling, een verhaal over een ander persoon (vader, vriend, buur). Niet altijd een HUD-klok; gebruik soms een ander HUD-label (bv. "JOUR 1 / 30", "DERNIÈRE PRIÈRE", "TEMPS D'ÉCRAN 6H12") of geen HUD.
     - **Moment van de dag en opts variëren** (dawn/night, rain, walk/zit, family-samenstelling, wel/geen telefoon). Gebruik `bed_dawn`/`bed_morning`/`grave` hooguit in 1 op 4 video's.
     - Hook en eindvraag elke keer anders geformuleerd (geen "Et si…" twee keer na elkaar).
   - Duur 45–60 s. Hook bovenaan in de eerste ~4 s, einde = zwart scherm met de hook-vraag + gouden antwoord.
3. **Render** elk verhaal (± 25–35 min per video, CPU):
   `./make_video.sh stories/<id>.json out/<id>.mp4`
   Controleer daarna een paar frames: `ffmpeg -i out/<id>.mp4 -vf "fps=1/4,scale=180:-1,tile=8x2" /tmp/check.png` en bekijk ze.
3b. **Voice-over (Frans, verplicht)** per video:
   - `python3 vo_mix.py script stories/<id>.json` geeft de vertelling (regels gescheiden door `... ...`). Schrijf tijden uit in woorden ("02:14" → "Deux heures quatorze").
   - Stemkeuze van de gebruiker: video **a → stem "Charon"** (diep, warm), video **b → stem "Puck"** (jonger, zacht), video **c → stem "Charon"**. Gebruik "..." op een eigen regel tussen de zinnen.
   - Speko `audio_synthesize` met `{"model":"gemini-3.8-flash-tts","voice":"Charon"|"Puck","intent":{"language":"fr-FR","optimizeFor":"accuracy"},"constraints":{"allowedProviders":{"tts":["google-tts:gemini-3.8-flash-tts"]}}, "instructions": <Charon: "Lis en français avec une voix masculine grave et chaleureuse, calme, intime et sincère, comme un narrateur de rappels spirituels qui parle à une seule personne. Rythme lent, longue pause à chaque ligne vide, aucune emphase théâtrale. 'Allah' doucement et avec respect. Le verset avec révérence." | Puck: "Lis en français avec une voix d'homme jeune mais posée, douce et naturelle, comme un ami qui parle doucement, calme et sincère. Rythme lent, longue pause à chaque ligne vide, sans emphase théâtrale. Noms des prières naturellement. Le verset avec révérence. Fin encourageante.">, "text": ...}`.
   - Stem moet goed verstaanbaar boven de geluiden liggen (vo_mix.py regelt dit: stem luid, achtergrond gedempt).
     Het resultaat is groot en wordt in een tool-results-bestand gezet: `jq -r .audio_base64 <bestand> | base64 -d > out/vo/<id>.wav`; `jq -r .url <bestand>` geeft een link (15 min geldig).
   - **BELANGRIJK:** bij een lange tekst valt Speko soms terug op een andere stem (provider "elevenlabs"). Controleer altijd `jq -r .provider` = `google-tts`. Werkwijze die altijd werkt: **elke vertelregel apart** synthetiseren (één `audio_synthesize` per regel, dezelfde voice + instructions, zonder "..."), en dan
     `python3 vo_join.py out/vo/<id>.wav out/vo/<id>.segs.json <result-bestand regel 1> <regel 2> ...` (in volgorde). Dat maakt de wav + segs; transcriberen is dan niet nodig. vo_join.py weigert clips die niet van google-tts komen → die regel opnieuw maken.
   - (Alternatief voor één lange opname: Speko `audio_transcribe` met word_timestamps → per vertelregel [start_s, eind_s] naar `out/vo/<id>.segs.json`.)
   - Een vers duurt in de stem ± 9–11 s: geef het `black`-segment van het vers minstens 10–11 s.
   - `python3 vo_mix.py mix stories/<id>.json out/vo/<id>.wav out/<id>.mp4 out/<id>-vo.mp4 out/vo/<id>.segs.json`
3c. **Afsluiter (verplicht, wens van de gebruiker):** elke video eindigt met het logo (maansikkel), de naam **Back2Allah**, @backk.2allah en de stem "Abonne-toi pour plus de rappels islamiques. Back to Allah." in dezelfde stem als de video:
   `./add_outro.sh out/<id>-vo.mp4 charon|puck out/<id>-final.mp4` (video a → charon, video b → puck, video c → charon). **Post altijd `<id>-final.mp4`.**
   (De afsluiter is vooraf gemaakt: engine/outro.mp4 + engine/outro_charon.wav / outro_puck.wav; opnieuw maken: `node render.js stories/_outro.json 0 108 engine/outro.mp4 8170`.)
   - Later mag ElevenLabs (connector) i.p.v. Speko als de gebruiker een abonnement heeft — zelfde stijl: diepe warme Franse mannenstem.
4. **Commit** de story-JSON's op `main` en push. Zet de video's op een orphan branch `media-YYYY-MM-DD` (map `v/`), push die branch.
   Publieke URL: `https://raw.githubusercontent.com/nasserseptember-glitch/backk2allah-videos/media-YYYY-MM-DD/v/<id>-final.mp4`
   Verwijder media-branches ouder dan 3 dagen (`git push origin --delete media-...`).
5. **Plan in via Metricool** (`createScheduledPost`, blogId 7687333), per video één post met providers instagram + tiktok + youtube:
   - **Vaste tijden (keuze van de gebruiker): video a → 10:00, video b → 18:00, video c → 20:00** (Europe/Brussels), elke dag. Is een tijd al voorbij of minder dan 20 min weg wanneer de video klaar is, plan die video dan op het eerstvolgende vrije uur (bv. 11:00) en meld dat.
   - `autoPublish: true`, `media: [raw URL]`, `text`: post.caption + "\n\n" + post.hashtags.
   - `instagramData: {type: "REEL", showReelOnFeed: true, isAiGenerated: true}`
   - `tiktokData: {title: <hook, max 90 tekens>, privacyOption: "PUBLIC_TO_EVERYONE", isAigc: true}`
   - `youtubeData: {title: post.youtube_title (max 100), type: "short", privacy: "public", madeForKids: false, category: "PEOPLE_BLOGS", isAiGeneratedContent: false}`
6. Rapporteer kort: 3 titels, tijden, plannerUrl's.

Tip voor snelheid: render de 3 video's na elkaar (make_video.sh gebruikt al 2 CPU-kernen); maak tijdens het renderen al de stemclips via Speko.

## Algemene tips (alle talen)
- **Maak eerst de stemclips, dan pas de captiontijden + render.** Elke caption moet minstens (stemduur / 1,12) + 0,2 s lang zijn, anders loopt de stem achter op de tekst. Pas de tijden aan vóór `make_video.sh` (de tekst wordt mee gerenderd).
- Gebruik nooit `pkill -f`/`pgrep -f` met een patroon uit je eigen commando (dat kill't je eigen shell). Wacht op achtergrondtaken via de melding.
- `git pull --rebase` vóór elke push naar `main`: de Franse en de Engelse taak draaien tegelijk.

## ENGELS ACCOUNT (aparte dagelijkse taak, vanaf 2026-10-30)
Brand **Back2AllahENG, blogId 7737230** (Instagram @backk2allah.en, TikTok @back2Allah, YouTube Back2AllahEN), timezone Europe/Brussels.
- Zelfde FORMAT als hierboven (krachtige hook met getal, HUD-teller, avant → vers → après, gouden opdracht), zelfde engine en variatieregels voor de beelden. **Eigen verhalen en onderwerpen**: geen vertaling van de Franse video's; kies onderwerpen/hooks die verschillen van de Franse video's van dezelfde dag en van alle `stories/*-en-*.json` van de laatste 7 dagen.
- Bestanden: `stories/YYYY-MM-DD-en-a.json`, `-en-b.json`, `-en-c.json`, met `"lang": "en"` (zet Engelse afsluiter-tekst + @backk2allah.en en Engelse vers-uitspraak in vo_mix).
- Engels: natuurlijk, kort, "you"-vorm, geen Franse typografie; aanhalingstekens “ … ”. Voorbeeld: `stories/2026-10-29-en-c.json`.
- **Verzen ALLEEN letterlijk uit `verses_en.json`** (Sahih International, tekst + ref exact). Nooit zelf vertalen of hadith citeren.
- Tijden: **en-a → 13:00 (Charon), en-b → 19:00 (Puck), en-c → 22:00 (Charon)**. Zelfde regel bij te laat: eerstvolgend vrij uur, en melden.
- Stem (Speko, per regel, `intent.language: "en-US"`, zelfde model/provider-constraint als hierboven). Getallen en tijden voluit in woorden ("4 hours" → "Four hours"; vers: "Surah Ar-Ra'd, verse twenty-eight").
  - Charon: "Read in English with a deep, warm, calm male voice, intimate and sincere, like a narrator of spiritual reminders speaking to one person. Slow pace, no theatrical emphasis. Say 'Allah' gently and with respect. Read Quran verses with reverence."
  - Puck: "Read in English with a young but composed male voice, soft and natural, like a friend speaking gently, calm and sincere. Slow pace, no theatrical emphasis. Say 'Allah' gently and with respect. Read Quran verses with reverence. Encouraging ending."
- Afsluiter: `./add_outro.sh out/<id>-vo.mp4 charon|puck out/<id>-final.mp4 en` (engine/outro_en.mp4 + outro_en_charon.wav / outro_en_puck.wav).
- Media: orphan branch **`media-en-YYYY-MM-DD`** (map `v/`), URL `https://raw.githubusercontent.com/nasserseptember-glitch/backk2allah-videos/media-en-YYYY-MM-DD/v/<id>-final.mp4`. Verwijder `media-en-*` ouder dan 3 dagen (raak `media-YYYY-...` van de Franse taak niet aan).
- Metricool: blogId **7737230**, zelfde providers/instellingen als stap 5 (REEL + isAiGenerated, TikTok title + isAigc, YouTube short PEOPLE_BLOGS). Engelse hashtags (#islamicreminder #islam #muslim #quran #deen + onderwerp).

## Story-schema (JSON)
- `segments`: lijst van `{scene, dur, opts}`; scenes:
  - `bed_dawn` — in bed, vóór zonsopgang. opts: `phone: "alarm"|"feed"|"none"`, `clock`, `sub` (tekst op alarmscherm), `snoozeAt` (s, duim drukt "Répéter"), `lowerPhone` (telefoon zakt op het einde)
  - `street` — wandelen door de stad met telefoon. opts: `dayFrom`/`dayTo` (0 = middag, 1 = zonsondergang), `clock` (op telefoonscherm), `phone: false`
  - `living` — woonkamer 's avonds, moeder in zetel, tv, kaars. opts: `collapseAt` (s; camera valt om, zwart — alleen voor "dood"-verhalen)
  - `grave` — donker graf, liggend naar boven. opts: `pulses` (s, lichtpulsen bij grote tekst), `flashEnd`
  - `bed_morning` — wakker worden in ochtendzon, gebedskleed in zonnestraal. opts: `clock`, `sub`, `flashIn`, `wake: false` (geen wazig-openen)
  - `mosque_ext` — naar de moskee wandelen, minaretten, verlichte deur. opts: `time: "night"|"dawn"`, `speed`
  - `mosque_int` — gebedszaal, rijen gelovigen, mihrab, kroonluchter. opts: `ruku: [[start,eind],...]` (rijen buigen), `povBow` (camera buigt mee), `night`, `rows`
  - `rooftop` — 's nachts op een dak, stad met lichtjes, sterren, maan. opts: `phone` (telefoon in handen), `legs`
  - `car_night` — autorijden 's nachts in de regen, stuur, achterlichten, straatlampen. opts: `rain: false`, `clock`
  - `seaside` — strand bij zonsondergang, golven, glinsterende zee. opts: `walk: false` (zittend)
  - `dinner` — familie-avondmaal aan tafel, kaars, hanglamp. opts: `family: ["father","mother","sibling"]` (laat iemand weg = lege stoel, bv. voor gemis/rouw), `sad`
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
- `lang`: `"en"` voor het Engelse account (anders Frans)

Tests: `node render.js stories/<id>.json 0 0 /tmp/st 8160 --stills 3,15,30` maakt stills.
