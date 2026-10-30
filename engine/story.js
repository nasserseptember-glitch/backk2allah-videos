'use strict';
// Story-driven timeline + text overlay. window.STORY is set by the driver (see stories/SCHEMA.md).
const NB = ' ';
const GOLD = '#e7c27a';
function fadeA(t, a, b, f = 0.35) { return clamp(Math.min((t - a) / f, (b - t) / f), 0, 1); }
function wrapLines(g, text, maxW) {
  const words = text.split(' '); const lines = []; let cur = '';
  for (const w of words) { const tst = cur ? cur + ' ' + w : w; if (cur && g.measureText(tst).width > maxW) { lines.push(cur); cur = w; } else cur = tst; }
  if (cur) lines.push(cur);
  if (lines.length === 2) {
    let best = null; for (let k = 1; k < words.length; k++) { const a = words.slice(0, k).join(' '), b = words.slice(k).join(' '); const la = g.measureText(a).width, lb = g.measureText(b).width; if (Math.max(la, lb) <= maxW && (!best || Math.abs(la - lb) < best[0])) best = [Math.abs(la - lb), [a, b]]; }
    if (best) return best[1];
  }
  return lines;
}
const normW = (w) => w.toLowerCase().replace(/[^a-zàâçéèêëîïôûùüÿœ'’-]/g, '');
const isAR = () => !!(window.STORY && window.STORY.lang === 'ar');
const normAr = (w) => w.replace(/[.,،؛؟?!…:«»"“”﴿﴾()]/g, '');
function drawRich(g, line, x, y, gold) {
  const words = line.split(' '); const sp = g.measureText(' ').width; let tw = 0;
  const ws = words.map(w => { const m = g.measureText(w).width; tw += m; return m; }); tw += sp * (words.length - 1);
  if (isAR()) { // right-to-left: first word on the right; each word is shaped on its own
    let rx = x + tw / 2;
    words.forEach((w, i) => { rx -= ws[i]; g.fillStyle = gold && gold.includes(normAr(w)) ? GOLD : '#ffffff'; g.fillText(w, rx, y); rx -= sp; });
    return;
  }
  let cx = x - tw / 2;
  words.forEach((w, i) => { g.fillStyle = gold && gold.includes(normW(w)) ? GOLD : '#ffffff'; g.fillText(w, cx, y); cx += ws[i] + sp; });
}
function textBlock(g, text, cx, cy, font, maxW, lh, alpha, gold, color) {
  g.font = font; g.textAlign = 'left'; g.textBaseline = 'middle';
  const lines = wrapLines(g, text, maxW); const y0 = cy - (lines.length - 1) * lh / 2;
  g.save(); g.globalAlpha = alpha; g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 18; g.shadowOffsetY = 3;
  if (isAR()) g.direction = 'rtl';
  lines.forEach((ln, i) => { if (color) { g.fillStyle = color; g.textAlign = 'center'; g.fillText(ln, cx, y0 + i * lh); g.textAlign = 'left'; } else drawRich(g, ln, cx, y0 + i * lh, gold); });
  g.restore();
}
const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fmt = (m) => `${String(((m / 60) | 0) % 24).padStart(2, '0')}:${String(Math.round(m) % 60).padStart(2, '0')}`;
function hud(g, t, S) {
  for (const h of (S.hud || [])) {
    if (t < h.t0 || t > h.t1) continue;
    let a = fadeA(t, h.t0, h.t1, 0.35) * (h.alpha || 1);
    let time = h.time;
    if (h.clock) { const k = clamp((t - h.t0) / (h.t1 - h.t0), 0, 1); time = fmt(lerp(toMin(h.clock[0]), toMin(h.clock[1]), k)); }
    let label = h.label;
    if (h.glitch) { const r = rnd(Math.floor(t * 14)); time = (time || '').split('').map(ch => /\d/.test(ch) && r() < 0.55 ? '?' : ch).join(''); if (Math.floor(t * 12) % 3 === 0) label = label.replace(/O/, '?'); }
    g.save(); g.globalAlpha = a; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 12; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    if (isAR()) {
      g.direction = 'rtl'; g.textAlign = 'right'; g.letterSpacing = '0px';
      g.fillStyle = 'rgba(255,255,255,0.92)'; g.font = '700 30px ArCairo'; g.fillText(label, W - 64, 866);
      g.direction = 'ltr'; g.fillStyle = '#fff'; g.font = '500 60px LoraUI'; if (time) g.fillText(time, W - 62, 932);
      if (h.sub) { g.direction = 'rtl'; g.font = '600 24px ArCairo'; g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillText(h.sub, W - 64, 972); }
    } else {
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '600 22px InterUI'; g.letterSpacing = '4px'; g.fillText(label, 64, 868);
    g.letterSpacing = '0px'; g.fillStyle = '#fff'; g.font = '500 60px LoraUI'; if (time) g.fillText(time, 62, 932);
    if (h.sub) { g.font = '600 17px InterUI'; g.letterSpacing = '3px'; g.fillStyle = 'rgba(255,255,255,0.75)'; g.fillText(h.sub, 64, 966); }
    }
    g.restore();
  }
}
function drawOutro(g, t, o) {
  const a = fadeA(t, o.t0, o.t1 + 1, 0.5); if (a <= 0) return;
  const k = clamp((t - o.t0) / 0.9, 0, 1), e = 1 - Math.pow(1 - k, 3);
  g.save(); g.globalAlpha = a;
  const R = 170 * (0.85 + 0.15 * e), cx = W / 2, cy = 720;
  g.shadowColor = 'rgba(231,194,122,0.35)'; g.shadowBlur = 60;
  g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.closePath(); g.fillStyle = '#111'; g.fill();
  g.shadowBlur = 0; g.save(); g.clip(); if (window.LOGO) g.drawImage(window.LOGO, cx - R, cy - R, 2 * R, 2 * R); g.restore();
  g.strokeStyle = 'rgba(231,194,122,0.8)'; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.stroke();
  g.restore();
  textBlock(g, 'Back2Allah', W / 2, 1000, '600 74px LoraUI', 900, 80, a, null, '#ffffff');
  const EN = window.STORY && window.STORY.lang === 'en';
  if (!isAR()) textBlock(g, EN ? '@backk2allah.en' : '@backk.2allah', W / 2, 1075, '500 30px InterUI', 900, 40, a * 0.85, null, GOLD);
  const a2 = fadeA(t, o.t0 + 0.6, o.t1 + 1, 0.5);
  if (a2 > 0 && isAR()) textBlock(g, 'اشترك لمزيد من التذكيرات الإسلامية 🤍', W / 2, 1140, '500 46px ArNaskh', 860, 70, a2, null, '#ffffff');
  else if (a2 > 0) textBlock(g, EN ? 'Subscribe for more Islamic reminders 🤍' : 'Abonne-toi pour plus de rappels islamiques 🤍', W / 2, 1200, 'italic 400 42px LoraItalic', 860, 54, a2, null, '#ffffff');
}
function drawOverlay(g, t) {
  const S = window.STORY; g.clearRect(0, 0, W, H);
  if (S.outro) drawOutro(g, t, S.outro);
  const AR = isAR();
  const FH = AR ? '600 64px ArNaskh' : '500 64px LoraUI', FC = AR ? '500 48px ArNaskh' : 'italic 400 44px LoraItalic', FV = AR ? '400 66px ArAmiri' : 'italic 400 58px LoraItalic',
    FR = AR ? '600 30px ArCairo' : '500 28px InterUI', FE = AR ? '600 60px ArNaskh' : '500 58px LoraUI', FG = AR ? '500 48px ArNaskh' : 'italic 400 44px LoraItalic', FB = AR ? '700 72px ArNaskh' : '600 70px LoraUI';
  const LHC = AR ? 78 : 58, LHV = AR ? 110 : 74;
  const gl2 = (arr) => (arr || []).map(w => AR ? normAr(w) : normW(w));
  if (S.hook) { const a = fadeA(t, S.hook.t0, S.hook.t1, 0.5); if (a > 0) textBlock(g, S.hook.text, W / 2, 470, FH, 860, AR ? 100 : 80, a, gl2(S.hook.gold)); }
  hud(g, t, S);
  const capGold = gl2(S.goldWords || ['allah', 'prière', 'prie', 'dua', 'allah.', 'allah,']);
  for (const [a0, a1, s] of (S.captions || [])) { const al = fadeA(t, a0, a1, 0.3); if (al > 0) { if (S.capBox) { g.font = FC; const ls = wrapLines(g, s, 900); const bw = Math.max(...ls.map(l => g.measureText(l).width)) + 56, bh = ls.length * LHC + 30; g.save(); g.globalAlpha = al * 0.45; g.fillStyle = '#000'; g.beginPath(); g.roundRect(W / 2 - bw / 2, 1270 - bh / 2, bw, bh, 18); g.fill(); g.restore(); } textBlock(g, s, W / 2, 1270, FC, 900, LHC, al, capGold); } }
  for (const [a0, a1, s] of (S.big || [])) { const al = fadeA(t, a0, a1, 0.45); if (al > 0) { const sc = 1 + (t - a0) * 0.012; g.save(); g.translate(W / 2, 760); g.scale(sc, sc); textBlock(g, s, 0, 0, FB, 900, 84, al, null, GOLD); g.restore(); } }
  for (const v of (S.verses || [])) { const a = fadeA(t, v.t0, v.t1, 0.6); if (a > 0) { textBlock(g, v.text, W / 2, 900, FV, 880, LHV, a, null, '#ffffff'); g.font = FV; const vn = wrapLines(g, v.text, 880).length; textBlock(g, v.ref, W / 2, Math.max(1010 + (v.text.length > 60 ? 70 : 0), 900 + (vn - 1) * LHV / 2 + (AR ? 120 : 95)), FR, 880, 40, a * 0.95, null, GOLD); } }
  if (S.end) { const e = S.end; let a = fadeA(t, e.t0, e.t1 + 1, 0.6); if (a > 0) { textBlock(g, e.text, W / 2, 880, FE, 820, AR ? 92 : 74, a, null, '#ffffff'); if (e.gold) { const a2 = fadeA(t, e.goldT0, e.t1 + 1, 0.6); if (a2 > 0) textBlock(g, e.gold, W / 2, AR ? 1090 : 1070, FG, 880, AR ? 74 : 56, a2, null, GOLD); } } }
}
const SCENES = { bed_dawn: sceneBed1, bed_morning: sceneBed2, street: sceneStreet, living: sceneLiving, grave: sceneGrave };
function storyDur(S) { return S.segments.reduce((a, s) => a + s.dur, 0); }
function frameAt(t) {
  const S = window.STORY; let a = 0;
  for (const sg of S.segments) {
    if (t < a + sg.dur) { if (sg.scene === 'black') return null; return SCENES[sg.scene](t - a, sg.dur, sg.opts || {}); }
    a += sg.dur;
  }
  return null;
}
