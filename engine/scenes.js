'use strict';
// ================== helpers ==================
const PI = Math.PI;
function O(mesh, p, r, s, col, extra) { return Object.assign({ mesh, m: M4.trs(p, r, s), col }, extra || {}); }
function B(p, s, col, extra) { return O('box', p, [0, 0, 0], s, col, extra); }
function G(parent, local, mesh, col, extra) { return Object.assign({ mesh, m: M4.mul(parent, local), col }, extra || {}); }
function dirRot(d) { d = norm(d); return [-Math.asin(clamp(d[1], -1, 1)), Math.atan2(d[0], d[2]), 0]; }
function seg(parent, a, b, th, col, extra) { // box from a to b in parent space
  const d = sub(b, a), L = Math.hypot(...d), c = scl(add(a, b), 0.5);
  return G(parent, M4.trs(c, dirRot(d), [th[0], th[1], L]), 'box', col, extra);
}
const ease = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

// ================== textures ==================
function noiseFill(g, w, h, base, amt, seed, size = 2) {
  g.fillStyle = base; g.fillRect(0, 0, w, h); const r = rnd(seed);
  for (let i = 0; i < w * h / (size * size) * 0.6; i++) {
    const v = (r() - 0.5) * amt; g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`;
    g.fillRect(r() * w, r() * h, size, size);
  }
}
const T = {};
function buildTextures() {
  T.wood = texFromCanvas(mkCanvas(512, 512, (g, w, h) => {
    const r = rnd(4); const pw = 64;
    for (let x = 0; x < w; x += pw) for (let y = -r() * 200; y < h; y += 260 + r() * 120) {
      const v = 0.82 + r() * 0.3; g.fillStyle = `rgb(${165 * v | 0},${112 * v | 0},${72 * v | 0})`; g.fillRect(x, y, pw, 400);
      g.strokeStyle = 'rgba(60,35,20,0.5)'; g.lineWidth = 2; g.strokeRect(x, y, pw, 400);
    }
    for (let i = 0; i < 900; i++) { g.strokeStyle = `rgba(80,50,30,${r() * 0.15})`; g.beginPath(); const x = r() * w, y = r() * h; g.moveTo(x, y); g.lineTo(x + (r() - .5) * 3, y + 30 + r() * 60); g.stroke(); }
  }), true);
  T.plaster = texFromCanvas(mkCanvas(256, 256, (g, w, h) => noiseFill(g, w, h, '#ffffff', 0.10, 7, 3)), true);
  T.fabric = texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    noiseFill(g, w, h, '#ffffff', 0.08, 9, 2);
    g.strokeStyle = 'rgba(0,0,0,0.06)'; for (let i = 0; i < w; i += 8) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); }
  }), true);
  T.dirt = texFromCanvas(mkCanvas(512, 512, (g, w, h) => {
    noiseFill(g, w, h, '#b8a089', 0.35, 11, 3); const r = rnd(12);
    for (let i = 0; i < 260; i++) { const v = 0.4 + r() * 0.5; g.fillStyle = `rgba(${90 * v | 0},${75 * v | 0},${60 * v | 0},0.7)`; g.beginPath(); g.ellipse(r() * w, r() * h, 2 + r() * 7, 2 + r() * 5, r() * 3, 0, 7); g.fill(); }
    for (let i = 0; i < 40; i++) { g.strokeStyle = 'rgba(40,30,20,0.25)'; g.lineWidth = 1 + r() * 2; g.beginPath(); let x = r() * w, y = r() * h; g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (r() - .5) * 40; y += r() * 30; g.lineTo(x, y); } g.stroke(); }
  }), true);
  T.asphalt = texFromCanvas(mkCanvas(256, 256, (g, w, h) => noiseFill(g, w, h, '#ffffff', 0.18, 13, 2)), true);
  T.road = texFromCanvas(mkCanvas(256, 1024, (g, w, h) => {
    noiseFill(g, w, h, '#ffffff', 0.15, 14, 2);
    g.fillStyle = 'rgba(255,255,255,0.9)'; for (let y = 0; y < h; y += 256) g.fillRect(w / 2 - 5, y, 10, 140);
  }), true);
  T.facade = [0, 1, 2].map(k => texFromCanvas(mkCanvas(256, 512, (g, w, h) => {
    noiseFill(g, w, h, '#ffffff', 0.06, 20 + k, 3);
    const r = rnd(30 + k); const cols = 3, rows = 6;
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const x = 22 + i * 78, y = 30 + j * 80; const lit = r();
      g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(x - 5, y - 5, 54, 70);
      g.fillStyle = lit > 0.85 ? '#e9d7a8' : (k === 1 ? '#5c6f86' : '#6c7f95'); g.fillRect(x, y, 44, 60);
      g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(x, y, 44, 6);
      g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(x + 20, y, 3, 60);
    }
    g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(0, h - 70, w, 70);
  })));
  T.rug = texFromCanvas(mkCanvas(256, 512, (g, w, h) => {
    g.fillStyle = '#1f5a3c'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#d9b25a'; g.lineWidth = 8; g.strokeRect(12, 12, w - 24, h - 24);
    g.lineWidth = 3; g.strokeRect(28, 28, w - 56, h - 56);
    g.beginPath(); g.moveTo(60, h - 70); g.lineTo(60, 170); g.quadraticCurveTo(60, 70, w / 2, 60); g.quadraticCurveTo(w - 60, 70, w - 60, 170); g.lineTo(w - 60, h - 70); g.closePath(); g.stroke();
    g.fillStyle = '#174a31'; g.fill();
    g.fillStyle = '#d9b25a'; for (let x = 44; x < w - 30; x += 24) { g.beginPath(); g.arc(x, 44, 4, 0, 7); g.fill(); g.beginPath(); g.arc(x, h - 44, 4, 0, 7); g.fill(); }
    g.beginPath(); g.arc(w / 2, 140, 10, 0, 7); g.fill();
  }));
  T.soft = texFromCanvas(mkCanvas(64, 64, (g, w, h) => {
    const im = g.createImageData(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = (x / w - .5) * 2, dy = (y / h - .5) * 2; const a = Math.max(0, 1 - dx * dx) * Math.max(0, 1 - Math.pow(Math.abs(dy), 6)); const i = (y * w + x) * 4; im.data[i] = im.data[i + 1] = im.data[i + 2] = 255; im.data[i + 3] = a * 255; }
    g.putImageData(im, 0, 0);
  }));
  T.glow = texFromCanvas(mkCanvas(64, 64, (g, w, h) => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }));
  const view = (top, mid, low, sunY, sunCol, bld) => mkCanvas(256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(0.62, mid); gr.addColorStop(1, low); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    if (sunY != null) { const s = g.createRadialGradient(w * 0.62, sunY, 2, w * 0.62, sunY, 120); s.addColorStop(0, sunCol); s.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = s; g.fillRect(0, 0, w, h); }
    const r = rnd(5); g.fillStyle = bld;
    for (let x = -10; x < w; x += 18 + r() * 26) { const bh = 30 + r() * 80; g.fillRect(x, h - bh, 16 + r() * 22, bh); }
  });
  T.dawn = texFromCanvas(view('#2a3d6b', '#c88a7a', '#f2b98a', 250, 'rgba(255,190,130,0.8)', '#1c2033'));
  T.morning = texFromCanvas(view('#7fb0e6', '#f3d8a8', '#ffe7bf', 170, 'rgba(255,240,200,1)', '#8a7a78'));
  T.night = texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#05070f'); gr.addColorStop(1, '#1a2238'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rnd(8);
    for (let x = -10; x < w; x += 20 + r() * 24) { const bh = 50 + r() * 130; g.fillStyle = '#070912'; g.fillRect(x, h - bh, 18 + r() * 20, bh); for (let k = 0; k < bh / 9; k++) if (r() < 0.35) { g.fillStyle = r() < 0.7 ? '#ffcf7a' : '#9ec6ff'; g.fillRect(x + 3 + r() * 12, h - bh + k * 9 + 3, 3, 3); } }
  }));
  // faces
  const face = (kind) => texFromCanvas(mkCanvas(128, 128, (g) => {
    g.clearRect(0, 0, 128, 128); g.fillStyle = '#2a1d16';
    g.fillRect(32, 50, 12, 15); g.fillRect(84, 50, 12, 15);
    g.fillStyle = 'rgba(255,255,255,0.8)'; g.fillRect(35, 52, 4, 4); g.fillRect(87, 52, 4, 4);
    g.fillStyle = '#2a1d16'; g.fillRect(28, 38, 20, 4); g.fillRect(80, 38, 20, 4);
    g.strokeStyle = '#3a2219'; g.lineWidth = 4; g.beginPath();
    if (kind === 'smile') { g.arc(64, 78, 14, 0.2, PI - 0.2); } else if (kind === 'o') { g.arc(64, 90, 6, 0, 7); } else { g.moveTo(52, 92); g.lineTo(76, 92); }
    g.stroke();
  }));
  T.face = { smile: face('smile'), flat: face('flat'), o: face('o') };
  // phone screens (portrait 180x360)
  const scr = (fn) => texFromCanvas(mkCanvas(240, 480, (g, w, h) => { fn(g, w, h); }));
  const font = (s, wgt = 500, fam = 'InterUI') => `${wgt} ${s}px ${fam}`;
  T.scrAlarm = (time, sub) => scr((g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1b2440'); gr.addColorStop(1, '#3b2a4a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = font(14, 600); g.fillText('ALARME', w / 2, 70);
    g.font = font(64, 300); g.fillText(time, w / 2, 150); g.font = font(18, 500); g.fillStyle = '#f0d590'; g.fillText(sub, w / 2, 185);
    g.fillStyle = 'rgba(255,255,255,0.18)'; g.beginPath(); g.roundRect(30, 330, 180, 46, 23); g.fill();
    g.fillStyle = '#fff'; g.font = font(17, 600); g.fillText('Répéter', w / 2, 360);
    g.fillStyle = 'rgba(255,255,255,0.10)'; g.beginPath(); g.roundRect(30, 390, 180, 46, 23); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillText('Arrêter', w / 2, 420);
  });
  T.scrSnoozeF = (time) => scr((g, w, h) => {
    g.fillStyle = '#0d1120'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff'; g.textAlign = 'center';
    g.font = font(54, 300); g.fillText(time, w / 2, 140); g.font = font(15, 500); g.fillStyle = 'rgba(255,255,255,0.65)'; g.fillText('Alarme répétée · 5 min', w / 2, 175);
  });
  T.scrFeed = texFromCanvas(mkCanvas(240, 1920, (g, w, h) => {
    g.fillStyle = '#f4f4f6'; g.fillRect(0, 0, w, h); const r = rnd(77); const pal = ['#f2b880', '#86b6d8', '#9ccf9a', '#e58c8a', '#c3a6e0', '#f2d17a'];
    for (let y = 10; y < h; y += 250) { g.fillStyle = '#fff'; g.fillRect(8, y, w - 16, 238); g.fillStyle = pal[(r() * 6) | 0]; g.fillRect(8, y + 34, w - 16, 150);
      g.fillStyle = '#ccc'; g.beginPath(); g.arc(24, y + 17, 9, 0, 7); g.fill(); g.fillRect(40, y + 12, 80, 8); g.fillStyle = '#ddd'; g.fillRect(16, y + 196, 150, 8); g.fillRect(16, y + 212, 100, 8); }
  }), false);
  T.scrNotifF = (clock) => scr((g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2b3f63'); gr.addColorStop(1, '#5d4b6e'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = font(48, 300); g.fillText(clock, w / 2, 90);
    const items = [['Travail', 'Réunion déplacée à 14h'], ['Maman', 'Tu rentres ce soir ?'], ['Banque', 'Paiement effectué'], ['Groupe', '12 nouveaux messages'], ['Agenda', 'Demain : 3 rendez-vous']];
    items.forEach(([a, b], i) => { const y = 130 + i * 64; g.fillStyle = 'rgba(255,255,255,0.88)'; g.beginPath(); g.roundRect(14, y, w - 28, 54, 12); g.fill();
      g.textAlign = 'left'; g.fillStyle = '#222'; g.font = font(13, 700); g.fillText(a, 26, y + 21); g.font = font(12, 500); g.fillStyle = '#555'; g.fillText(b, 26, y + 40); });
  });
  T.tv = [0, 1, 2, 3].map(k => texFromCanvas(mkCanvas(128, 72, (g, w, h) => {
    const r = rnd(90 + k); g.fillStyle = ['#2c5d8a', '#7a4b2a', '#3d6b4a', '#6b3d6b'][k]; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) { g.fillStyle = `hsla(${r() * 360},50%,${40 + r() * 30}%,0.8)`; g.fillRect(r() * w, r() * h, 20 + r() * 50, 10 + r() * 30); }
  })));
}

// ================== characters ==================
const SKINS = ['#8d5a3b', '#c68e62', '#e0b48c', '#6b4329', '#b07a52'];
const SCR = {};
function scrSnoozeK(time) { const k = 's' + time; if (!SCR[k]) SCR[k] = T.scrSnoozeF(time); return SCR[k]; }
function scrAlarmK(time, sub) { const k = 'a' + time + sub; if (!SCR[k]) SCR[k] = T.scrAlarm(time, sub); return SCR[k]; }
function scrNotifK(time) { const k = 'n' + time; if (!SCR[k]) SCR[k] = T.scrNotifF(time); return SCR[k]; }
function person(base, o) {
  // o: {skin, shirt, pants, hijab, phase, walk, sit, face, armL, armR, headYaw}
  const out = [], ph = o.phase || 0, wk = o.walk || 0;
  const skin = C(o.skin || '#c68e62'), shirt = C(o.shirt || '#d9d4c7'), pants = C(o.pants || '#4b5a78');
  const bob = wk ? Math.abs(Math.sin(ph)) * 0.035 : 0;
  const R = M4.mul(base, M4.trs([0, bob, 0]));
  const hipY = o.sit ? 0.5 : 0.82;
  for (const sd of [-1, 1]) {
    const hip = [sd * 0.12, hipY, 0];
    let a = o.sit ? -PI / 2 : Math.sin(ph + (sd > 0 ? 0 : PI)) * 0.5 * wk;
    const knee = [hip[0], hip[1] - Math.cos(a) * 0.42, hip[2] - Math.sin(a) * 0.42 * -1];
    const kneeP = o.sit ? [hip[0], hip[1], hip[2] + 0.44] : [hip[0], hip[1] - Math.cos(a) * 0.42, hip[2] + Math.sin(-a) * -0.42];
    const ka = o.sit ? 0 : Math.max(0, -Math.sin(ph + (sd > 0 ? 0 : PI))) * 0.6 * wk;
    const foot = o.sit ? [kneeP[0], 0.04, kneeP[2]] : [kneeP[0], kneeP[1] - Math.cos(a - ka) * 0.40, kneeP[2] + Math.sin(a - ka) * 0.40];
    out.push(seg(R, hip, kneeP, [0.17, 0.18], pants));
    out.push(seg(R, kneeP, foot, [0.16, 0.17], pants));
    out.push(G(R, M4.trs([foot[0], 0.05, foot[2] + 0.05], [0, 0, 0], [0.17, 0.09, 0.28]), 'box', C('#2a2a2e')));
  }
  const RU = o.bow ? M4.mul(R, M4.mul(M4.trs([0, hipY, 0], [o.bow, 0, 0]), M4.trs([0, -hipY, 0]))) : R;
  const tY = hipY + 0.33;
  out.push(G(RU, M4.trs([0, tY, 0], [0, 0, 0], [0.48, 0.66, 0.27]), 'box', shirt));
  for (const sd of [-1, 1]) {
    const sh = [sd * 0.31, tY + 0.27, 0];
    const arm = (sd < 0 ? o.armL : o.armR);
    let ang = arm != null ? arm : -Math.sin(ph + (sd > 0 ? 0 : PI)) * 0.45 * wk;
    const el = [sh[0] + sd * 0.02, sh[1] - Math.cos(ang) * 0.32, sh[2] + Math.sin(ang) * 0.32];
    const fore = (o.sit && arm == null) ? 0.9 : (arm != null ? 0.2 : 0.25);
    const hand = [el[0], el[1] - Math.cos(ang + fore) * 0.3, el[2] + Math.sin(ang + fore) * 0.3];
    out.push(seg(RU, sh, el, [0.14, 0.15], shirt));
    out.push(seg(RU, el, hand, [0.13, 0.14], shirt));
    out.push(G(RU, M4.trs(hand, [0, 0, 0], [0.12, 0.13, 0.12]), 'box', skin));
  }
  const H0 = M4.mul(RU, M4.trs([0, tY + 0.55, 0], [0, o.headYaw || 0, 0]));
  if (o.hijab) {
    const hj = C(o.hijab);
    out.push(G(H0, M4.trs([0, 0.0, -0.01], [0, 0, 0], [0.46, 0.5, 0.44]), 'box', hj));
    out.push(G(H0, M4.trs([0, -0.2, 0], [0, 0, 0], [0.56, 0.18, 0.4]), 'box', hj));
    out.push(G(H0, M4.trs([0, -0.01, 0.222], [0, 0, 0], [0.32, 0.34, 0.01]), 'box', skin));
    out.push(G(H0, M4.trs([0, -0.01, 0.229], [0, 0, 0], [0.32, 0.34, 1]), 'plane', [0.9, 0.9, 0.9], { tex: T.face[o.face || 'flat'] }));
  } else {
    out.push(G(H0, M4.trs([0, 0, 0], [0, 0, 0], [0.4, 0.42, 0.38]), 'box', skin));
    out.push(G(H0, M4.trs([0, 0.2, -0.02], [0, 0, 0], [0.42, 0.08, 0.41]), 'box', C(o.hair || '#2a1f1a')));
    out.push(G(H0, M4.trs([0, -0.02, 0.192], [0, 0, 0], [0.36, 0.36, 1]), 'plane', [0.9, 0.9, 0.9], { tex: T.face[o.face || 'flat'] }));
  }
  return out;
}

// POV arm from bottom of screen to a hand point (camera-local coordinates)
function povArm(CW, from, to, sleeve, skin, handRot) {
  const out = [];
  out.push(seg(CW, from, to, [0.075, 0.08], sleeve));
  out.push(G(CW, M4.trs(to, handRot || dirRot(sub(to, from)), [0.045, 0.03, 0.065]), 'box', skin));
  return out;
}
function phone(CW, p, r, scrTex, uvr, glow) {
  const PM = M4.mul(CW, M4.trs(p, r));
  return [
    G(PM, M4.trs([0, 0, 0], [0, 0, 0], [0.072, 0.148, 0.009]), 'box', C('#15161a')),
    G(PM, M4.trs([0, 0, 0.0048], [0, 0, 0], [0.066, 0.140, 1]), 'plane', [glow, glow, glow], { mode: 1, tex: scrTex, uvr: uvr }),
  ];
}

// ================== BEDROOM ==================
function bedroom(objs, morning) {
  const wallC = C(morning ? '#efe2cf' : '#d9cbb8'), trim = C('#f2ece2');
  const fl = { tex: T.wood, uvr: [0, 0, 3, 4] };
  objs.push(B([0, -0.05, -1.25], [4.2, 0.1, 4.6], C('#ffffff'), fl));
  objs.push(B([0, 2.85, -1.25], [4.2, 0.1, 4.6], wallC));
  objs.push(B([-2.1, 1.4, -1.25], [0.1, 2.8, 4.6], wallC, { tex: T.plaster, uvr: [0, 0, 3, 2] }));
  objs.push(B([2.1, 1.4, -1.25], [0.1, 2.8, 4.6], wallC, { tex: T.plaster, uvr: [0, 0, 3, 2] }));
  objs.push(B([0, 1.4, 1.05], [4.2, 2.8, 0.1], wallC, { tex: T.plaster }));
  // front wall with window hole: window x[-1.35,0.05] y[0.9,2.3]
  const fz = -3.55, wx0 = -1.35, wx1 = 0.05, wy0 = 0.9, wy1 = 2.3;
  objs.push(B([(-2.1 + wx0) / 2, 1.4, fz], [wx0 + 2.1, 2.8, 0.1], wallC, { tex: T.plaster }));
  objs.push(B([(wx1 + 2.1) / 2, 1.4, fz], [2.1 - wx1, 2.8, 0.1], wallC, { tex: T.plaster }));
  objs.push(B([(wx0 + wx1) / 2, wy0 / 2, fz], [wx1 - wx0, wy0, 0.1], wallC));
  objs.push(B([(wx0 + wx1) / 2, (wy1 + 2.8) / 2, fz], [wx1 - wx0, 2.8 - wy1, 0.1], wallC));
  // window frame & mullion
  const fr = C('#f7f2ea');
  objs.push(B([(wx0 + wx1) / 2, wy0, fz + 0.06], [wx1 - wx0 + 0.12, 0.06, 0.18], fr));
  objs.push(B([(wx0 + wx1) / 2, wy1, fz], [wx1 - wx0 + 0.08, 0.05, 0.12], fr, { noShadow: true }));
  objs.push(B([(wx0 + wx1) / 2, (wy0 + wy1) / 2, fz], [0.04, wy1 - wy0, 0.06], fr));
  objs.push(B([(wx0 + wx1) / 2, 1.75, fz], [wx1 - wx0, 0.04, 0.06], fr));
  // view
  const vi = morning ? 3.2 : 1.25;
  objs.push(O('plane', [(wx0 + wx1) / 2, (wy0 + wy1) / 2, fz - 0.3], [0, 0, 0], [3.2, 2.6, 1], [vi, vi, vi], { mode: 1, tex: morning ? T.morning : T.dawn, noShadow: true }));
  // curtains
  const cu = C(morning ? '#c9b48e' : '#8f8170');
  objs.push(B([wx0 - 0.18, 1.5, fz + 0.12], [0.26, 2.3, 0.06], cu)); objs.push(B([wx1 + 0.18, 1.5, fz + 0.12], [0.26, 2.3, 0.06], cu));
  objs.push(B([(wx0 + wx1) / 2, 2.55, fz + 0.12], [2.0, 0.04, 0.04], C('#555')));
  // bed (head at z=0.95)
  const bx = 0.45;
  objs.push(B([bx, 0.2, -0.05], [1.6, 0.4, 2.1], C('#7b5236')));
  objs.push(B([bx, 0.5, -0.05], [1.5, 0.22, 2.0], C('#f3f1ec'), { tex: T.fabric }));
  objs.push(B([bx, 0.75, 0.97], [1.6, 0.9, 0.08], C('#6e4a31')));
  objs.push(B([bx - 0.32, 0.68, 0.7], [0.62, 0.16, 0.4], C('#ffffff'), { tex: T.fabric }));
  objs.push(B([bx + 0.36, 0.68, 0.7], [0.62, 0.16, 0.4], C('#f4efe6'), { tex: T.fabric }));
  // blanket over body
  const bl = C('#3f5d8c');
  objs.push(B([bx, 0.66, -0.42], [1.56, 0.12, 1.3], bl, { tex: T.fabric }));
  objs.push(B([bx, 0.62, -1.06], [1.56, 0.2, 0.1], bl, { tex: T.fabric }));
  objs.push(B([bx + 0.05, 0.75, -0.75], [0.5, 0.14, 0.45], bl, { tex: T.fabric }));
  // nightstand + lamp
  objs.push(B([1.62, 0.3, 0.7], [0.45, 0.6, 0.4], C('#8a6040')));
  objs.push(O('cyl', [1.62, 0.66, 0.7], [0, 0, 0], [0.12, 0.12, 0.12], C('#cfc6b8')));
  objs.push(O('cyl', [1.62, 0.86, 0.7], [0, 0, 0], [0.26, 0.24, 0.26], C('#fff1d6'), { mode: morning ? 0 : 1, col: morning ? C('#fff1d6') : C('#ffd9a0', 1.6) }));
  // shelf with books on right wall
  objs.push(B([2.0, 1.6, -1.6], [0.25, 0.04, 1.0], C('#7a5236')));
  const r = rnd(3); for (let i = 0; i < 9; i++) { const hh = 0.18 + r() * 0.1; objs.push(B([2.0, 1.62 + hh / 2, -2.05 + i * 0.1], [0.18, hh, 0.07], C(['#7a2f2f', '#2f5a7a', '#c9a24a', '#3d6b4a', '#e8e1d0'][i % 5]))); }
  // wall clock
  objs.push(O('cyl', [1.2, 2.1, fz + 0.07], [PI / 2, 0, 0], [0.34, 0.03, 0.34], C('#f4f1ea')));
  objs.push(O('cyl', [1.2, 2.1, fz + 0.055], [PI / 2, 0, 0], [0.38, 0.025, 0.38], C('#333')));
  // rug under bed
  objs.push(B([0.2, 0.005, -1.6], [2.4, 0.01, 1.4], C('#b98b6a'), { tex: T.fabric }));
  // prayer rug: rolled (night) or laid out (morning)
  if (morning) objs.push(O('box', [-0.75, 0.012, -2.55], [0, 0, 0], [0.75, 0.012, 1.3], [1, 1, 1], { tex: T.rug }));
  else objs.push(O('cyl', [-1.85, 0.5, -3.25], [0, 0, 0.08], [0.18, 1.0, 0.18], C('#1f5a3c')));
  return { wx0, wx1, wy0, wy1, fz };
}

function camLie(t) { return { pos: [0.42, 0.98, 0.42], target: [0.25, 1.15, -1.5], up: [0, 1, 0] }; }

function sceneBed1(t, dur, o) {
  o = o || {}; const sn = o.snoozeAt != null ? o.snoozeAt : 1e9; const lw = o.lowerPhone ? dur - 2.4 : 1e9;
  const objs = [];
  const W0 = bedroom(objs, false);
  let cam = camLie(t);
  const breathe = Math.sin(t * 1.3) * 0.006;
  cam.pos = add(cam.pos, [0, breathe, 0]);
  // after snooze, lower phone and turn head to side
  const turn = sstep(lw + 0.4, lw + 2.2, t);
  cam.target = lerp3(cam.target, [1.6, 0.9, 0.2], turn * 0.6);
  cam.up = norm([turn * 0.25, 1, 0]);
  cam.fov = 64;
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const ringing = o.phone === 'alarm' && t < sn + 0.3;
  const vib = ringing && (Math.floor(t * 2) % 2 === 0) ? Math.sin(t * 90) * 0.004 : 0;
  const drop = sstep(lw, lw + 1.8, t);
  const pp = [0.0 + vib, -0.12 - drop * 0.25, -0.37];
  const pr = [0.32 + drop * 0.3, 0, vib * 3];
  const scr = o.phone === 'feed' ? T.scrFeed : (t < sn + 0.3 ? scrAlarmK(o.clock || '05:42', o.sub || 'Fajr') : scrSnoozeK(o.snoozeClock || '05:42'));
  const uvrB = o.phone === 'feed' ? [0, 0.8 - ((t * 0.06) % 0.8), 1, 0.125] : null;
  const glow = ringing ? 1.5 : 1.1 * (1 - drop * 0.6);
  if (o.phone !== 'none') objs.push(...phone(CW, pp, pr, scr, uvrB, glow));
  const sleeve = C('#3a4a6a'), skin = C('#a8714c');
  objs.push(...povArm(CW, [-0.22, -0.42, -0.12], [-0.05 + vib, pp[1] - 0.05, pp[2] + 0.01], sleeve, skin));
  objs.push(...povArm(CW, [0.24, -0.42, -0.12], [0.05 + vib, pp[1] - 0.05, pp[2] + 0.01], sleeve, skin));
  // thumb tap
  const tap = sstep(sn - 0.4, sn + 0.05, t) * (1 - sstep(sn + 0.25, sn + 0.6, t));
  objs.push(G(CW, M4.trs([0.03, pp[1] - 0.045 + tap * 0.0, pp[2] + 0.012 + tap * 0.0], [0.4, 0, -0.5], [0.022, 0.06, 0.022]), 'box', skin));
  const phoneW = M4.xform(CW, [pp[0], pp[1], pp[2] + 0.1]);
  return {
    objs, cam,
    sun: { dir: [0.25, -0.32, 1], col: C('#8fa6e0', 0.9), center: [0, 1, -1.5], ext: 4.5 },
    hemi: { sky: C('#3c4a78', 0.55), gnd: C('#2a2230', 0.35) },
    pls: [{ p: phoneW, c: C('#9fb8ff', ringing ? 0.55 : 0.35 * (1 - drop)), r: 1.4 }, { p: [1.62, 0.9, 0.7], c: C('#ffb870', 0.9), r: 3.2 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.05, bloom: 0.7, th: 0.9, vig: 0.6, warm: 0.2, fade: Math.min(o.fadeIn === false ? 1 : sstep(0, 0.8, t), 1 - sstep(dur - 0.35, dur, t)) },
  };
}

function sceneBed2(t, dur, o) { // morning
  o = o || {}; const ts = t * 10 / dur; const t0 = t; t = ts;
  const objs = [];
  bedroom(objs, true);
  const sit = sstep(4.0, 6.0, t), look = sstep(5.2, 8.0, t);
  let pos = lerp3([0.42, 0.98, 0.42], [0.2, 1.38, 0.05], sit);
  let target = lerp3([0.25, 1.15, -1.5], [-0.75, 0.25, -2.4], look);
  pos = add(pos, lerp3([0, 0, 0], [-0.12, 0.08, -0.35], sstep(7.0, 10.5, t)));
  const cam = { pos, target, up: [0, 1, 0], fov: 64 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const lower = sstep(3.6, 5.0, t);
  const pp = [0, -0.11 - lower * 0.35, -0.33];
  if (lower < 0.99) {
    objs.push(...phone(CW, pp, [0.32, 0, 0], scrAlarmK(o.clock || '05:43', o.sub || 'Fajr'), null, 1.2));
    const sleeve = C('#3a4a6a'), skin = C('#a8714c');
    objs.push(...povArm(CW, [-0.22, -0.42, -0.12], [-0.05, pp[1] - 0.05, pp[2] + 0.01], sleeve, skin));
    objs.push(...povArm(CW, [0.24, -0.42, -0.12], [0.05, pp[1] - 0.05, pp[2] + 0.01], sleeve, skin));
  }
  // sunbeam (volumetric fake)
  const sd = norm([0.3, -0.42, 1]);
  const beamC = [-0.65, 1.6, -3.5];
  for (let i = 0; i < 3; i++) {
    const L = 3.6, c = add(beamC, scl(sd, L / 2 - 0.1));
    objs.push(O('box', add(c, [i * 0.05 - 0.05, 0, 0]), dirRot(sd), [1.3 - i * 0.25, 1.3 - i * 0.25, L], C('#ffd9a0', 0.045), { additive: true, mode: 3, tex: T.soft }));
  }
  // dust
  const r = rnd(21);
  for (let i = 0; i < 40; i++) {
    const u = r(), v = r(), w2 = r();
    const p = add(beamC, add(scl(sd, 0.4 + u * 3), [(v - 0.5) * 1.0 + Math.sin(t * 0.3 + i) * 0.05, (w2 - 0.5) * 1.0 + ((t * 0.04 + i * 0.13) % 0.3), 0]));
    objs.push(O('box', p, [t + i, t * 0.7, 0], [0.006, 0.006, 0.006], C('#fff2d0', 3), { mode: 1, noShadow: true }));
  }
  const open = o.wake === false ? 1 : sstep(0, 2.2, t); t = t0;
  return {
    objs, cam,
    sun: { dir: [0.3, -0.42, 1], col: C('#ffd6a0', 4.2), center: [-0.3, 0.8, -2.0], ext: 4.0 },
    hemi: { sky: C('#cfd8ea', 0.55), gnd: C('#8a6a50', 0.35) },
    pls: [{ p: [-0.6, 1.5, -3.0], c: C('#ffd9b0', 0.8), r: 4.5 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [1, 1, 1],
    post: { exposure: 1.0, bloom: 0.8, th: 1.0, vig: 0.45, warm: 0.6, blur: 1 - open, fade: Math.min(1, open * 1.3, o.wake === false ? sstep(0, 0.5, t) : 1) * (1 - sstep(dur - 0.4, dur, t)), flash: o.flashIn ? (1 - sstep(0, 0.8, t)) * 0.9 : 0 },
  };
}

// ================== STREET ==================
let STREET = null;
function buildStreet() {
  const r = rnd(42); const s = { bld: [], trees: [], people: [], cars: [], lamps: [], mtn: [] };
  for (const side of [-1, 1]) {
    let z = 15;
    while (z > -160) {
      const d = 6 + r() * 6, hgt = 7 + r() * 16, dep = 8 + r() * 6;
      s.bld.push({ x: side * (5.6 + dep / 2), z: z - d / 2, w: dep, d: d - 0.2, h: hgt, col: ['#e8d9c0', '#d9a57e', '#f2efe8', '#bcd0dc', '#e6c7a8', '#c9b9a7'][(r() * 6) | 0], tex: (r() * 3) | 0 });
      z -= d;
    }
    for (let z2 = 10; z2 > -160; z2 -= 9) s.trees.push({ x: side * 4.9, z: z2 + r() * 2, h: 2.2 + r() * 0.8 });
    for (let z2 = 5; z2 > -160; z2 -= 18) s.lamps.push({ x: side * 3.25, z: z2 });
  }
  for (let i = 0; i < 28; i++) {
    const side = r() < 0.5 ? -1 : 1, dir = r() < 0.5 ? -1 : 1;
    s.people.push({ x: side * (3.6 + r() * 1.6), z: 8 - r() * 70, dir, sp: 1.0 + r() * 0.5, ph: r() * 7, skin: SKINS[(r() * 5) | 0], shirt: ['#d9d4c7', '#c94f4f', '#4f7cc9', '#e8e2d2', '#7a9c6a', '#b58ad1', '#e0a050', '#5b5b66'][(r() * 8) | 0], pants: ['#3b4a6b', '#2d2d33', '#7a6a55', '#4a4a52'][(r() * 4) | 0], hijab: r() < 0.25 ? ['#d8cfc0', '#6b4f6b', '#2f3a4f', '#b58a6a'][(r() * 4) | 0] : null });
  }
  for (let i = 0; i < 8; i++) s.cars.push({ lane: i % 2 ? 1.5 : -1.5, z: -i * 22 + r() * 8, sp: (i % 2 ? 1 : -1) * (8 + r() * 4), col: ['#c94f4f', '#e8e8e8', '#4f7cc9', '#2d2d33', '#e0b050', '#6a8a9a'][(r() * 6) | 0] });
  for (let i = 0; i < 9; i++) s.mtn.push({ x: -260 + i * 65 + r() * 30, z: -300 - r() * 60, h: 70 + r() * 90, w: 110 + r() * 80 });
  STREET = s;
}
function car(o, x, z, yaw, col) {
  const M = M4.trs([x, 0, z], [0, yaw, 0]);
  o.push(G(M, M4.trs([0, 0.55, 0], [0, 0, 0], [1.8, 0.6, 4.2]), 'box', C(col)));
  o.push(G(M, M4.trs([0, 1.05, -0.2], [0, 0, 0], [1.6, 0.5, 2.2]), 'box', C(col)));
  o.push(G(M, M4.trs([0, 1.05, -0.2], [0, 0, 0], [1.62, 0.36, 2.0]), 'box', C('#2a3442')));
  for (const [a, b] of [[-0.85, 1.3], [0.85, 1.3], [-0.85, -1.3], [0.85, -1.3]]) o.push(G(M, M4.trs([a, 0.32, b], [0, 0, PI / 2], [0.64, 0.25, 0.64]), 'cyl', C('#1a1a1c')));
}
function sceneStreet(t, dur, o) {
  o = o || {};
  if (!STREET) buildStreet();
  const s = STREET, objs = [];
  const k = t / dur; const kk = lerp(o.dayFrom != null ? o.dayFrom : 0, o.dayTo != null ? o.dayTo : 1, k);
  const elev = lerp(55, 9, kk) * PI / 180, az = -0.6;
  const sunDir = norm([-Math.cos(elev) * Math.sin(az), -Math.sin(elev), Math.cos(elev) * Math.cos(az)]);
  const camZ = 2 - t * 1.35;
  const bob = Math.sin(t * 5.6) * 0.03, sway = Math.sin(t * 2.8) * 0.02;
  const cam = { pos: [4.0 + sway, 1.62 + bob, camZ], target: [3.7, 1.45, camZ - 10], up: [0, 1, 0], fov: 66, far: 700 };
  const skyTop = lerp3(C('#5d8fd6'), C('#3f5e9e'), kk), skyHor = lerp3(C('#dfe7ee'), C('#f2b07a'), kk);
  const sunCol = lerp3(C('#fff4e0', 3.2), C('#ffb070', 2.6), kk);
  // ground
  objs.push(B([0, -0.05, camZ - 60], [6, 0.1, 260], C('#5b5d63'), { tex: T.road, uvr: [0, 0, 1, 40] }));
  for (const sd of [-1, 1]) {
    objs.push(B([sd * 4.3, 0.06, camZ - 60], [2.6, 0.12, 260], C('#c9c2b6'), { tex: T.asphalt, uvr: [0, 0, 2, 120] }));
    objs.push(B([sd * 3.05, 0.07, camZ - 60], [0.12, 0.14, 260], C('#e8e4dc')));
  }
  objs.push(B([0, -0.12, camZ - 60], [500, 0.1, 700], C('#b8ab98')));
  const near = (z) => z < camZ + 12 && z > camZ - 170;
  for (const b of s.bld) if (near(b.z)) {
    objs.push(B([b.x, b.h / 2, b.z], [b.w, b.h, b.d], C(b.col), { tex: T.facade[b.tex], uvr: [0, 0, Math.max(1, Math.round(b.d / 4)), Math.max(1, Math.round(b.h / 4))] }));
    objs.push(B([b.x, b.h + 0.15, b.z], [b.w + 0.2, 0.3, b.d + 0.2], C('#8a7f72')));
  }
  for (const tr of s.trees) if (near(tr.z)) {
    objs.push(B([tr.x, tr.h / 2, tr.z], [0.18, tr.h, 0.18], C('#6b4a32')));
    objs.push(O('sph', [tr.x, tr.h + 0.6, tr.z], [0, 0, 0], [1.9, 1.7, 1.9], C('#5f8a4a')));
    objs.push(O('sph', [tr.x + 0.4, tr.h + 1.1, tr.z - 0.3], [0, 0, 0], [1.2, 1.1, 1.2], C('#6f9a55')));
  }
  for (const l of s.lamps) if (near(l.z)) {
    objs.push(B([l.x, 2.2, l.z], [0.1, 4.4, 0.1], C('#3a3d42')));
    objs.push(B([l.x - Math.sign(l.x) * 0.4, 4.4, l.z], [0.9, 0.08, 0.12], C('#3a3d42')));
    objs.push(B([l.x - Math.sign(l.x) * 0.8, 4.32, l.z], [0.3, 0.1, 0.2], C('#fff0c8', 0.6 + kk * 2.4), { mode: 1 }));
  }
  for (const m of s.mtn) objs.push(O('cone', [m.x, m.h / 2 - 5, m.z + camZ], [0, m.x, 0], [m.w, m.h, m.w * 0.8], lerp3(C('#8a8aa0'), C('#9a7a88'), kk)));
  for (const p of s.people) {
    const z = p.z + p.dir * p.sp * t * -1 * -1 + (p.dir > 0 ? p.sp * t : -p.sp * t) * 0;
    const zz = p.z + (p.dir > 0 ? 1 : -1) * p.sp * t;
    if (!near(zz) || (zz < camZ + 2 && zz > camZ - 7 && Math.abs(p.x - 4) < 1.1)) continue;
    const M = M4.trs([p.x, 0.12, zz], [0, p.dir > 0 ? 0 : PI, 0]);
    objs.push(...person(M, { skin: p.skin, shirt: p.shirt, pants: p.pants, hijab: p.hijab, walk: 1, phase: p.ph + t * p.sp * 5.2, face: 'flat' }));
  }
  for (const c of s.cars) { const z = ((c.z + c.sp * t - camZ + 160) % 180 + 180) % 180 + camZ - 160; car(objs, c.lane, z, c.sp > 0 ? 0 : PI, c.col); }
  objs.push(O('skyS', cam.pos, [0, 0, 0], [1200, 1200, 1200], [1, 1, 1], { mode: 2, em: [1, 0, 0], noShadow: true }));
  // POV phone (right hand)
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const pp = [0.07, -0.17 + bob * 0.2, -0.34];
  if (o.phone !== false) { objs.push(...phone(CW, pp, [0.5, -0.12, 0.05], scrNotifK(o.clock || '13:07'), null, 1.0));
  objs.push(...povArm(CW, [0.26, -0.48, -0.1], [0.085, pp[1] - 0.06, pp[2] + 0.02], C('#3a4a6a'), C('#a8714c'))); }
  const pls = s.lamps.filter(l => near(l.z) && Math.abs(l.z - camZ) < 40).slice(0, 6).map(l => ({ p: [l.x - Math.sign(l.x) * 0.8, 4.1, l.z], c: C('#ffcf8a', kk * 3), r: 9 }));
  return {
    objs, cam,
    sun: { dir: sunDir, col: sunCol, center: [3, 0, camZ - 9], ext: 16 },
    hemi: { sky: lerp3(C('#9ab8e0', 0.7), C('#7a6a9a', 0.5), kk), gnd: lerp3(C('#b0a090', 0.4), C('#704a40', 0.3), kk) },
    pls, sky: { top: skyTop, hor: skyHor, gnd: skyHor }, fog: { col: skyHor, d: 0.0065, start: 12 }, clear: skyHor,
    post: { exposure: 1.0, bloom: 0.45, th: 1.2, vig: 0.4, warm: kk * 0.6, fade: Math.min(sstep(0, 0.35, t), 1 - sstep(dur - 0.35, dur, t)) },
  };
}

// ================== LIVING ROOM (night) ==================
function sceneLiving(t, dur, o) {
  o = o || {}; const sh = o.collapseAt != null ? o.collapseAt - 7.2 : 1e9; const tl = t; t = t - sh; // event clock
  const objs = [];
  const wallC = C('#cbb9a2');
  objs.push(B([0, -0.05, -1.3], [6.2, 0.1, 6], [1, 1, 1], { tex: T.wood, uvr: [0, 0, 4, 4] }));
  objs.push(B([0, 2.85, -1.3], [6.2, 0.1, 6], wallC));
  objs.push(B([-3.1, 1.4, -1.3], [0.1, 2.8, 6], wallC, { tex: T.plaster }));
  objs.push(B([0, 1.4, -4.3], [6.2, 2.8, 0.1], wallC, { tex: T.plaster }));
  objs.push(B([0, 1.4, 1.7], [6.2, 2.8, 0.1], wallC));
  // right wall with big window
  objs.push(B([3.1, 0.35, -1.3], [0.1, 0.7, 6], wallC)); objs.push(B([3.1, 2.55, -1.3], [0.1, 0.6, 6], wallC));
  objs.push(B([3.1, 1.4, 0.9], [0.1, 2.8, 1.6], wallC)); objs.push(B([3.1, 1.4, -3.6], [0.1, 2.8, 1.4], wallC));
  objs.push(O('plane', [3.5, 1.5, -1.5], [0, -PI / 2, 0], [4.5, 2.6, 1], [1.4, 1.4, 1.4], { mode: 1, tex: T.night, noShadow: true }));
  objs.push(B([3.1, 1.5, -1.5], [0.06, 1.6, 0.05], C('#e8e2d6')));
  // TV
  const tvk = Math.floor(tl * 0.7) % 4;
  const flick = 0.8 + 0.2 * Math.sin(tl * 13) * Math.sin(tl * 5.1);
  const collapse = sstep(7.2, 9.6, t);
  const tvI = (2.2 * flick) * (1 - collapse * 0.7) * ((t > 7.4 && t < 8.6 && Math.floor(t * 9) % 3 === 0) ? 0.25 : 1);
  objs.push(B([0, 0.25, -4.0], [2.4, 0.5, 0.45], C('#5a3e2c')));
  objs.push(B([0, 1.25, -4.18], [1.9, 1.1, 0.06], C('#111')));
  objs.push(O('plane', [0, 1.25, -4.145], [0, 0, 0], [1.8, 1.0, 1], [tvI, tvI, tvI], { mode: 1, tex: T.tv[tvk] }));
  // sofa (camera on it) at back
  objs.push(B([0.4, 0.25, 1.15], [2.6, 0.5, 0.9], C('#6b7a8f'))); objs.push(B([0.4, 0.75, 1.5], [2.6, 0.7, 0.25], C('#6b7a8f')));
  objs.push(B([-0.95, 0.55, 1.15], [0.25, 0.6, 0.9], C('#62708a'))); objs.push(B([1.75, 0.55, 1.15], [0.25, 0.6, 0.9], C('#62708a')));
  // coffee table + candle + tea
  objs.push(B([0.3, 0.42, -0.4], [1.4, 0.06, 0.8], C('#f0ece4'))); for (const [a, b] of [[-0.3, -0.3], [0.9, -0.3], [-0.3, -0.5], [0.9, -0.5]]) objs.push(B([0.3 + a * 0.9, 0.2, -0.4 + b * 0.0 + (b < -0.4 ? -0.3 : 0.3)], [0.06, 0.4, 0.06], C('#c9c2b6')));
  objs.push(O('cyl', [0.25, 0.53, -0.45], [0, 0, 0], [0.09, 0.16, 0.09], C('#f6f1e6')));
  const fl = 1 + 0.15 * Math.sin(tl * 17) + 0.1 * Math.sin(tl * 29);
  objs.push(O('sph', [0.25, 0.65, -0.45], [0, 0, 0], [0.03, 0.07, 0.03], C('#ffd28a', 6 * fl), { mode: 1 }));
  objs.push(O('plane', [0.25, 0.66, -0.45], [0, 0, 0], [0.5, 0.5, 1], C('#ffb060', 0.35 * fl), { additive: true, mode: 3, tex: T.glow }));
  for (const [x, z] of [[0.65, -0.3], [-0.1, -0.55]]) objs.push(O('cyl', [x, 0.5, z], [0, 0, 0], [0.07, 0.1, 0.07], C('#b8643a')));
  objs.push(O('sph', [0.75, 0.5, -0.6], [0, 0, 0], [0.22, 0.08, 0.22], C('#e6e0d0')));
  for (let i = 0; i < 5; i++) objs.push(O('sph', [0.7 + (i % 3) * 0.06, 0.55, -0.62 + (i > 2 ? 0.06 : 0)], [0, 0, 0], [0.06, 0.05, 0.06], C(['#e0a050', '#9ccf9a', '#e58c8a'][i % 3])));
  // floor lamp
  objs.push(B([-2.6, 0.8, -3.6], [0.05, 1.6, 0.05], C('#333'))); objs.push(O('cyl', [-2.6, 1.7, -3.6], [0, 0, 0], [0.4, 0.35, 0.4], C('#ffe0b0', 1.8), { mode: 1 }));
  // mother in armchair (left), looking at TV, then turning toward camera
  objs.push(B([-1.9, 0.25, -1.1], [0.9, 0.5, 0.9], C('#8a5a4a'))); objs.push(B([-2.25, 0.7, -1.1], [0.2, 0.9, 0.9], C('#8a5a4a')));
  const mYaw = PI / 2 - 0.3 + sstep(7.6, 8.4, t) * 0.9;
  const MM = M4.trs([-1.85, 0.03, -1.1], [0, PI / 2 - 0.2, 0]);
  objs.push(...person(MM, { skin: '#9a6644', shirt: '#9c3d3d', pants: '#5a3a3a', hijab: '#e3d8c6', sit: true, face: t > 7.6 ? 'o' : 'flat', headYaw: sstep(7.6, 8.4, t) * 0.7 }));
  // shelves / plant
  objs.push(B([-3.0, 1.5, -2.4], [0.2, 0.04, 1.2], C('#6b4a32'))); objs.push(O('cyl', [2.6, 0.25, 0.9], [0, 0, 0], [0.35, 0.5, 0.35], C('#c9b9a7'))); objs.push(O('sph', [2.6, 0.9, 0.9], [0, 0, 0], [0.7, 0.9, 0.7], C('#4f7a45')));
  // wall art
  objs.push(B([-1.2, 1.9, -4.24], [0.8, 0.55, 0.03], C('#d9b25a'))); objs.push(B([-1.2, 1.9, -4.22], [0.7, 0.45, 0.03], C('#1f3a2c')));
  // camera on sofa
  let pos = [0.45, 1.18, 1.0], target = [0.1, 0.95, -2.5], up = [0, 1, 0];
  const breathe = Math.sin(tl * 1.4) * 0.006;
  pos = add(pos, [0, breathe, 0]);
  // collapse: tilt sideways, fall to the left onto sofa
  const c2 = ease(collapse);
  pos = lerp3(pos, [-0.2, 0.62, 1.05], c2);
  target = lerp3(target, [-1.5, 0.35, -1.6], c2);
  up = norm([lerp(0, -1, c2 * 0.85), 1, 0]);
  const shake = t > 6.8 && t < 7.6 ? Math.sin(t * 40) * 0.004 : 0;
  pos = add(pos, [shake, 0, 0]);
  const cam = { pos, target, up, fov: 62 };
  const CW = M4.camWorld(pos, target, up);
  // phone with scrolling feed; falls away during collapse
  const scroll = (tl * 0.06) % 0.8;
  const fall = sstep(7.0, 8.2, t);
  const pp = [0.0 + fall * 0.08, -0.16 - fall * 0.7, -0.36 + fall * 0.1];
  objs.push(...phone(CW, pp, [0.35 + fall * 2, 0, fall], T.scrFeed, [0, 0.8 - scroll, 1, 0.125], 1.1));
  if (fall < 0.6) {
    const sk = C('#a8714c'), sl = C('#7a8a6a');
    objs.push(...povArm(CW, [-0.22, -0.45, -0.1], [-0.05, pp[1] - 0.05, pp[2] + 0.01], sl, sk));
    objs.push(...povArm(CW, [0.24, -0.45, -0.1], [0.05 + Math.sin(tl * 2) * 0.004, pp[1] - 0.05, pp[2] + 0.01], sl, sk));
  }
  const phW = M4.xform(CW, [pp[0], pp[1], pp[2] + 0.1]);
  const dim = 1 - sstep(8.0, 10.2, t);
  const clk = o.clock || '21:13';
  return {
    objs, cam,
    sun: { dir: [-0.6, -0.5, 0.3], col: C('#5070b0', 0.25), on: false },
    hemi: { sky: C('#3a3550', 0.35), gnd: C('#2a2020', 0.25) },
    pls: [
      { p: [0.25, 0.75, -0.45], c: C('#ffb060', 1.6 * fl), r: 3.6 },
      { p: [-2.6, 1.6, -3.4], c: C('#ffc890', 1.6), r: 4.5 },
      { p: [0, 1.25, -3.6], c: C('#8fb0ff', tvI * 0.5), r: 5 },
      { p: phW, c: C('#cfe0ff', 0.25 * (1 - fall)), r: 1.2 },
      { p: [2.8, 1.5, -1.5], c: C('#6080c0', 0.4), r: 4 },
    ],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.05 * (0.15 + 0.85 * dim), bloom: 0.75, th: 0.9, vig: 0.55 + collapse * 0.4, warm: 0.35, blur: sstep(7.4, 9.8, t) * 0.9, sat: 1 - collapse * 0.6, fade: Math.min(sstep(0, 0.35, tl), 1 - sstep(o.collapseAt != null ? dur - 0.8 : dur - 0.35, dur, tl)) },
  };
}

// ================== GRAVE ==================
function sceneGrave(t, dur, o) {
  o = o || {};
  const objs = [];
  const dt = { tex: T.dirt, uvr: [0, 0, 2, 2] };
  const dirt = C('#8a7058');
  objs.push(B([0, -0.08, 0], [1.4, 0.1, 3.2], dirt, dt));
  objs.push(O('box', [-0.55, 0.45, 0], [0, 0, -0.12], [0.2, 1.1, 3.2], dirt, dt));
  objs.push(O('box', [0.55, 0.45, 0], [0, 0, 0.12], [0.2, 1.1, 3.2], dirt, dt));
  // slanted slabs (lahd) over the body
  for (let i = 0; i < 6; i++) {
    const z = -1.25 + i * 0.5;
    objs.push(O('box', [-0.18, 0.95, z], [0, 0, -0.55], [0.75, 0.09, 0.49], C('#9a8670'), { tex: T.dirt, uvr: [0, 0, 1, 0.6] }));
  }
  objs.push(O('box', [0.0, 1.35, 0], [0, 0, 0], [2.4, 0.2, 3.4], dirt, dt));
  objs.push(B([0, 0.45, -1.55], [1.4, 1.2, 0.2], dirt, dt));
  objs.push(B([0, 0.45, 1.6], [1.4, 1.2, 0.2], dirt, dt));
  // shroud edge visible at bottom
  const drift = Math.sin(t * 0.2) * 0.01;
  const pos = [0.02, 0.24 + drift, 0.9], target = [-0.05, 1.2, 0.3];
  const cam = { pos, target, up: [0, 0, -1], fov: 70 };
  const CW = M4.camWorld(pos, target, [0, 0, -1]);
  objs.push(G(CW, M4.trs([0, -0.33, -0.25], [0.3, 0, 0], [0.7, 0.14, 0.5]), 'box', C('#f2efe8'), { tex: T.fabric }));
  objs.push(G(CW, M4.trs([-0.22, -0.3, -0.2], [0.2, 0, 0.3], [0.3, 0.14, 0.5]), 'box', C('#ebe7de'), { tex: T.fabric }));
  // falling dust specks
  const r = rnd(5);
  for (let i = 0; i < 26; i++) {
    const x = (r() - 0.5) * 0.8, z = 0.2 + r() * 0.9, sp = 0.05 + r() * 0.08;
    const y = 1.0 - ((t * sp + r()) % 1) * 0.8;
    objs.push(O('box', [x, y, z], [t, i, 0], [0.004, 0.004, 0.004], C('#d8c8b0', 1.2), { mode: 1, noShadow: true }));
  }
  // question pulses
  const qs = o.pulses || [];
  let pulse = 0; for (const q of qs) pulse += Math.exp(-Math.pow((t - q - 0.3) / 0.5, 2));
  const intro = sstep(0, 3.0, t);
  return {
    objs, cam,
    sun: { dir: [0.1, -1, 0.05], col: C('#8090b0', 0.0), on: false },
    hemi: { sky: C('#8a95b0', 0.2 + pulse * 0.1), gnd: C('#3a3028', 0.1) },
    pls: [{ p: [0.0, 0.7, 0.3], c: C('#b8c4e0', (0.7 + pulse * 1.8) * intro), r: 2.4 }, { p: [-0.1, 0.9, 1.2], c: C('#c8b090', 0.25 * intro), r: 1.6 }],
    fog: { col: [0, 0, 0], d: 0.9, start: 0.6 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.5, th: 0.6, vig: 0.85, sat: 0.55, warm: -0.2, grain: 0.05, blur: 0.25 * (1 - intro), fade: intro * (o.flashEnd ? 1 : 1 - sstep(dur - 0.5, dur, t)), flash: o.flashEnd ? sstep(dur - 0.7, dur - 0.2, t) : 0 },
  };
}

