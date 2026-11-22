'use strict';
// Week 2026-11-23 scenes: bakery, cafe, ferry, orchard, laundromat, mina, balcony
let T6 = null;
function ensureT6() {
  ensureT5(); if (T6) return; T6 = {};
  T6.brick = texFromCanvas(mkCanvas(128, 128, (g, w, h) => {
    g.fillStyle = '#e8dcd0'; g.fillRect(0, 0, w, h); const r = rnd(5);
    for (let j = 0; j < 8; j++) for (let i = -1; i < 4; i++) { const x = i * 36 + (j % 2) * 18, y = j * 16; const v = 200 + r() * 55 | 0; g.fillStyle = `rgb(${v},${v * 0.8 | 0},${v * 0.66 | 0})`; g.fillRect(x + 1, y + 1, 34, 14); }
    noiseFillOver(g, w, h, 0.06, 6);
  }), true);
  const winTex = (top, mid, hor, seed, lights) => texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(0.55, mid); gr.addColorStop(1, hor); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const r = rnd(seed); g.fillStyle = '#1c1820';
    for (let x = 0; x < w; x += 22 + r() * 14) { const bh = 40 + r() * 60; g.fillRect(x, h - bh, 20 + r() * 12, bh); }
    g.fillRect(170, h - 170, 12, 170); g.beginPath(); g.moveTo(166, h - 170); g.lineTo(176, h - 200); g.lineTo(186, h - 170); g.fill(); g.fillRect(162, h - 140, 28, 6);
    g.beginPath(); g.arc(120, h - 70, 34, PI, 0); g.fill();
    if (lights) { g.fillStyle = '#ffcf7a'; for (let i = 0; i < 26; i++) g.fillRect(r() * w, h - 10 - r() * 70, 4, 5); g.fillStyle = '#9affc0'; g.fillRect(162, h - 142, 28, 3); }
  }));
  T6.winDawn = winTex('#141c3c', '#3a3a6a', '#e89070', 8, true);
  T6.winDay = winTex('#5a90d0', '#a8c8e8', '#f0ece0', 8, false);
  T6.winNight = winTex('#05081a', '#0c1430', '#1c2448', 8, true);
  T6.flour = texFromCanvas(mkCanvas(128, 128, (g, w, h) => { g.fillStyle = '#c89a64'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = 'rgba(80,50,20,0.25)'; g.fillRect(0, i * 16 + 7, w, 2); } const r = rnd(12); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(255,255,250,${0.2 + r() * 0.5})`; const x = w / 2 + (r() - 0.5) * w * r() * 1.3, y = h / 2 + (r() - 0.5) * h * r() * 1.3; g.fillRect(x, y, 2, 2); } }));
  T6.lcd = texFromCanvas(mkCanvas(128, 48, (g, w, h) => { g.fillStyle = '#0a1a10'; g.fillRect(0, 0, w, h); txt(g, '0:23', w / 2, h / 2 + 2, 30, '#5aff9a', 'center', 600); }));
  T6.vend = texFromCanvas(mkCanvas(128, 256, (g, w, h) => { g.fillStyle = '#e8eef4'; g.fillRect(0, 0, w, h); const cs = ['#d83a2a', '#2a8ad8', '#f0c030', '#3aa05a', '#f07a20', '#8a3ad8']; for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) { g.fillStyle = cs[(i + j) % 6]; g.fillRect(10 + i * 22, 14 + j * 42, 16, 30); } g.fillStyle = '#1a1c22'; g.fillRect(100, 20, 22, 120); g.fillStyle = '#2a2c34'; g.fillRect(10, 226, 86, 20); }));
  T6.sign = texFromCanvas(mkCanvas(256, 96, (g, w, h) => { g.fillStyle = '#1f6a44'; g.fillRect(0, 0, w, h); g.strokeStyle = '#f4f4f0'; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12); g.fillStyle = '#f4f4f0'; g.fillRect(30, 26, 120, 10); g.fillRect(30, 50, 80, 8); txt(g, '56', 210, 52, 40, '#f4f4f0', 'center', 600); }));
  T6.lights = texFromCanvas(mkCanvas(64, 64, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30); gr.addColorStop(0, 'rgba(255,220,150,1)'); gr.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
}
const t6Bird = (objs, PM, fl, col, s) => { s = s || 1; objs.push(G(PM, M4.trs([0, 0, 0], [0, 0, 0], [0.12 * s, 0.1 * s, 0.3 * s]), 'sph', col), G(PM, M4.trs([0.22 * s, 0, 0], [0, 0, fl], [0.42 * s, 0.02, 0.15 * s]), 'box', col), G(PM, M4.trs([-0.22 * s, 0, 0], [0, 0, -fl], [0.42 * s, 0.02, 0.15 * s]), 'box', col)); };
// string of bulbs between two points (catenary)
function t6Bulbs(objs, a, b, n, sag, t, k) {
  for (let i = 0; i <= n; i++) {
    const u = i / n; const p = [lerp(a[0], b[0], u), lerp(a[1], b[1], u) - Math.sin(u * PI) * sag, lerp(a[2], b[2], u)];
    const fl = 0.85 + 0.15 * Math.sin(t * 3 + i * 1.7);
    objs.push(O('sph', p, [0, 0, 0], [0.07, 0.09, 0.07], C('#ffd890', 6 * fl * k), { mode: 1, noShadow: true }));
    if (i % 2 === 0) objs.push(O('plane', p, [0, 0, 0], [0.7, 0.7, 1], C('#ffc070', 0.22 * k), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
    if (i < n) { const q = [lerp(a[0], b[0], (i + 1) / n), lerp(a[1], b[1], (i + 1) / n) - Math.sin((i + 1) / n * PI) * sag, lerp(a[2], b[2], (i + 1) / n)]; objs.push(seg(M4.ident(), p, q, [0.01, 0.01], C('#222'))); }
  }
}

// ---------- BAKERY BEFORE FAJR (wood-fired oven, baker, kneading dough) ----------
function sceneBakery(t, dur, o) {
  ensureT6(); o = o || {}; const objs = []; const day = o.time === 'day';
  room(objs, 6, 7.2, 3.0, C('#e6d8bc'), T3.tiles, C('#c8b8a0'));
  const fl = 0.8 + 0.2 * Math.sin(t * 11) * Math.sin(t * 7.3 + 1) + 0.1 * Math.sin(t * 23);
  // oven built into the back wall
  const OZ = -5.7, OX = -0.6;
  objs.push(B([OX, 1.15, OZ + 0.15], [3.0, 2.3, 1.2], C('#c06a46'), { tex: T6.brick, uvr: [0, 0, 3, 2.3] }));
  objs.push(O('sph', [OX, 2.3, OZ + 0.1], [0, 0, 0], [3.0, 1.0, 1.2], C('#b0603e'), { tex: T6.brick, uvr: [0, 0, 3, 1] }));
  objs.push(B([OX, 2.8, OZ + 0.2], [0.6, 0.8, 0.6], C('#8a8a8a')), B([OX, 0.62, OZ + 0.78], [3.1, 0.08, 0.1], C('#7a5a40')));
  objs.push(B([OX, 0.95, OZ + 0.76], [1.0, 0.6, 0.02], C('#120604')), O('cyl', [OX, 1.25, OZ + 0.76], [PI / 2, 0, 0], [1.0, 0.03, 0.5], C('#120604')));
  objs.push(B([OX, 0.78, OZ + 0.6], [0.95, 0.04, 0.3], C('#ff7a20', 3 * fl), { mode: 1, noShadow: true }));
  for (let i = 0; i < 7; i++) { const h = 0.18 + 0.12 * Math.abs(Math.sin(t * (6 + i) + i * 2)); objs.push(O('cone', [OX - 0.36 + i * 0.12, 0.8 + h / 2, OZ + 0.55], [0, i, 0], [0.1, h, 0.1], C(i % 2 ? '#ffb040' : '#ff6a18', 5 * fl), { mode: 1, noShadow: true })); }
  objs.push(O('plane', [OX, 1.0, OZ + 0.85], [0, 0, 0], [3.2, 2.2, 1], C('#ff8a30', 0.25 * fl), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  // breads on the oven ledge and racks on the right wall
  for (let i = 0; i < 6; i++) objs.push(O('sph', [OX - 1.25 + i * 0.5, 0.7, OZ + 0.95], [0, 0, 0], [0.32, 0.08, 0.32], C(i % 2 ? '#d89a50' : '#c8843e')));
  for (const y of [0.7, 1.25, 1.8]) { objs.push(B([2.6, y, -2.8], [0.7, 0.04, 3.2], C('#8a6a4a'))); for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) objs.push(O('sph', [2.45 + j * 0.3, y + 0.07, -4.1 + i * 0.52], [0, i, 0], [0.26, 0.09, 0.26], C(['#d8a058', '#c88a44', '#e0b070'][(i + j) % 3]))); }
  for (const z of [-1.2, -4.4]) objs.push(B([2.6, 1.2, z], [0.7, 2.4, 0.05], C('#6a4a34')));
  // flour sacks in the corner
  for (let i = 0; i < 3; i++) objs.push(O('sph', [-2.3 + (i % 2) * 0.5, 0.35 + (i === 2 ? 0.5 : 0), -5.0 + (i % 2) * 0.2], [0, i, 0], [0.62, 0.8, 0.45], C('#e8dcc0'), { tex: T.fabric }));
  // window with the dawn sky and a minaret
  objs.push(O('plane', [-2.93, 1.75, -2.6], [0, PI / 2, 0], [1.4, 1.1, 1], [1.2, 1.2, 1.2], { mode: 1, tex: day ? T6.winDay : T6.winDawn, noShadow: true }));
  objs.push(B([-2.92, 1.75, -2.6], [0.06, 1.2, 0.07], C('#5a4030')), B([-2.92, 1.75, -2.6], [0.06, 0.07, 1.5], C('#5a4030')), B([-2.9, 1.17, -2.6], [0.2, 0.06, 1.6], C('#5a4030')));
  // baker sliding bread into the oven with a long peel
  const pk = 0.5 + 0.5 * Math.sin(t * 0.9);
  const BM = M4.trs([OX + 0.5, 0, OZ + 2.15 + pk * 0.25], [0, PI + 0.12, 0]);
  objs.push(...person(BM, { skin: '#8d5a3b', shirt: '#f2efe8', pants: '#5a5a62', armL: 1.25, armR: 1.35, hair: '#f4f4f0', face: 'flat' }));
  objs.push(O('cyl', [OX + 0.5, 1.98, OZ + 2.15 + pk * 0.25], [0, 0, 0], [0.36, 0.22, 0.36], C('#f8f8f4')));
  const pa = [OX + 0.42, 1.12, OZ + 1.65 + pk * 0.25], pb = [OX + 0.05, 0.86, OZ + 0.3 + pk * 0.25];
  objs.push(seg(M4.ident(), pa, pb, [0.04, 0.04], C('#a07a50')), O('box', [pb[0], pb[1] - 0.02, pb[2] + 0.05], [0, 0.25, 0], [0.32, 0.015, 0.36], C('#b08a5a')), O('sph', [pb[0], pb[1] + 0.02, pb[2] + 0.05], [0, 0, 0], [0.24, 0.06, 0.24], C('#e8c8a0')));
  // work table with flour + dough
  const TZ = -0.95;
  objs.push(B([0.1, 0.9, TZ], [1.9, 0.08, 1.0], [1, 1, 1], { tex: T6.flour }));
  for (const [x, z] of [[-0.75, -0.5], [0.95, -0.5], [-0.75, -1.4], [0.95, -1.4]]) objs.push(B([x, 0.43, z], [0.08, 0.86, 0.08], C('#6a4a34')));
  for (let i = 0; i < 4; i++) objs.push(O('sph', [-0.55 + i * 0.16, 0.97, TZ - 0.35], [0, 0, 0], [0.13, 0.08, 0.13], C('#f0e0c8')));
  objs.push(O('cyl', [0.75, 1.02, TZ - 0.3], [0, 0, 0], [0.32, 0.18, 0.32], C('#d8d0c0')), O('sph', [0.75, 1.1, TZ - 0.3], [0, 0, 0], [0.28, 0.08, 0.28], C('#fbf8f0')));
  const kn = o.knead !== false; const ks = kn ? Math.sin(t * 2.6) : 0;
  const DP = [0.05, 0.98, TZ + 0.05];
  objs.push(O('sph', DP, [0, ks * 0.2, 0], [0.42 + ks * 0.04, 0.13 - ks * 0.015, 0.34], C('#f2e2c8')));
  const cam = { pos: [0.1, 1.62, 0.45], target: [-0.35, 0.95, -5.2], up: [0, 1, 0], fov: 66 };
  if (kn) for (const sx of [-1, 1]) { const ph = sx > 0 ? ks : -ks; objs.push(...povArm(M4.ident(), [cam.pos[0] + sx * 0.3, cam.pos[1] - 0.62, cam.pos[2] + 0.05], [DP[0] + sx * 0.12, DP[1] + 0.07 + Math.max(0, ph) * 0.05, DP[2] + 0.08 - ph * 0.06], C('#b8a890'), POV_SKIN(), [-0.6, sx * 0.4, 0])); }
  // flour dust drifting in the light
  const r = rnd(41);
  for (let i = 0; i < 40; i++) { const x = (r() - 0.5) * 3, z = -0.5 - r() * 4.5, y = mod(r() * 2.4 + t * 0.08, 2.4) + 0.5; objs.push(O('box', [x + Math.sin(t * 0.5 + i) * 0.1, y, z], [0, 0, 0], [0.012, 0.012, 0.012], C('#fff2d0', 2.5), { mode: 1, noShadow: true })); }
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C(day ? '#e0e4ec' : '#8890b0', day ? 0.65 : 0.4), gnd: C('#806040', 0.3) },
    pls: [{ p: [OX, 1.1, OZ + 1.0], c: C('#ff8a3a', 1.7 * fl), r: 5 }, { p: [0.2, 2.5, -1.2], c: C('#ffe8c8', day ? 1.2 : 0.8), r: 4.5 }, { p: [-2.5, 1.8, -2.6], c: C(day ? '#e8f0ff' : '#8a90d0', day ? 1.0 : 0.5), r: 4 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.7, th: 1.0, vig: 0.45, warm: 0.2, sat: 1.0, fade: fadeIO(t, dur) },
  };
}

// ---------- CAFE TERRACE AT NIGHT (string lights, friends, tea glasses) ----------
function sceneCafe(t, dur, o) {
  ensureT6(); o = o || {}; const objs = []; const dusk = o.time === 'dusk';
  const nf = o.friends != null ? o.friends : 3;
  objs.push(B([0, -0.05, -6], [30, 0.1, 30], C('#a89c8c'), { tex: T3.tiles, uvr: [0, 0, 15, 15] }));
  objs.push(B([0, -0.04, -9.5], [40, 0.1, 5], C('#3a3a40'), { tex: T.asphalt, uvr: [0, 0, 10, 1] }));
  objs.push(B([0, 0.06, -7], [40, 0.12, 0.3], C('#9a9488')));
  // cafe facade on the left with glowing window and awning
  objs.push(B([-4.2, 2.2, -3], [0.4, 4.4, 12], C('#d8c8a8'), { tex: T.plaster }));
  objs.push(B([-3.98, 1.3, -2.5], [0.02, 1.8, 4.5], C('#ffc880', 1.8), { mode: 1 }), B([-3.95, 1.3, -2.5], [0.06, 1.9, 0.08], C('#3a2a20')));
  objs.push(O('box', [-3.4, 2.75, -2.5], [0, 0, -0.35], [1.4, 0.04, 5.2], [1, 1, 1], { tex: T4.awn[1], uvr: [0, 0, 1, 5] }));
  objs.push(O('plane', [-3.8, 1.4, -2.5], [0, PI / 2, 0], [6, 3, 1], C('#ffb060', 0.18), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  // buildings across the street
  for (let i = 0; i < 6; i++) objs.push(B([-14 + i * 5.6, 5, -15], [5.4, 10, 2], [1, 1, 1], { tex: dusk ? T.facade[i % 3] : T2.nightFacade[i % 2], uvr: [0, 0, 1, 1], mode: dusk ? 0 : 1 }));
  // string lights over the terrace
  const k = dusk ? 0.6 : 1;
  t6Bulbs(objs, [-4, 3.0, 0.5], [3.5, 2.8, -1.5], 12, 0.5, t, k); t6Bulbs(objs, [-4, 3.0, -2.5], [3.5, 2.8, -4.5], 12, 0.5, t, k); t6Bulbs(objs, [-4, 3.0, -5.5], [3.5, 2.8, -6.8], 10, 0.4, t, k);
  objs.push(O('cyl', [3.5, 1.4, -1.5], [0, 0, 0], [0.08, 2.8, 0.08], C('#2a2a2a')), O('cyl', [3.5, 1.4, -4.5], [0, 0, 0], [0.08, 2.8, 0.08], C('#2a2a2a')));
  // our table + tea set
  const TZ = -1.05;
  objs.push(O('cyl', [0, 0.72, TZ], [0, 0, 0], [1.1, 0.04, 1.1], C('#d8d4cc')), O('cyl', [0, 0.36, TZ], [0, 0, 0], [0.07, 0.72, 0.07], C('#333')));
  objs.push(O('sph', [0.05, 0.84, TZ - 0.1], [0, 0, 0], [0.2, 0.18, 0.2], C('#c8c8d0')), O('cone', [0.05, 0.97, TZ - 0.1], [0, 0, 0], [0.08, 0.1, 0.08], C('#c8c8d0')), seg(M4.ident(), [0.15, 0.85, TZ - 0.1], [0.27, 0.92, TZ - 0.1], [0.025, 0.025], C('#c8c8d0')));
  const glasses = [[-0.28, TZ + 0.05], [0.22, TZ + 0.18], [-0.1, TZ - 0.3], [0.3, TZ - 0.28]];
  for (const [x, z] of glasses) { objs.push(O('cyl6', [x, 0.79, z], [0, 0, 0], [0.07, 0.11, 0.07], C('#d07a30', 1.1)), O('cyl6', [x, 0.84, z], [0, 0, 0], [0.075, 0.015, 0.075], C('#f4e8c0'))); }
  for (let i = 0; i < 5; i++) { const kk = mod(t * 0.35 + i / 5, 1); const [x, z] = glasses[i % 2]; objs.push(O('plane', [x + Math.sin(t + i) * 0.03, 0.9 + kk * 0.35, z], [0, 0, 0], [0.1 + kk * 0.12, 0.16, 1], C('#ffffff', 0.08 * (1 - kk)), { additive: true, mode: 3, tex: T.glow, noShadow: true })); }
  // friends talking around the table
  const fr = [[-1.0, TZ - 0.25, PI / 2 + 0.3, '#2d3a55', '#c68e62'], [0.05, TZ - 1.05, 0, '#7a3d4d', '#8d5a3b'], [1.0, TZ - 0.3, -PI / 2 - 0.3, '#556b2f', '#e0b48c']];
  for (let i = 0; i < Math.min(nf, 3); i++) { const [x, z, yw, sh, sk] = fr[i]; const talk = Math.max(0, Math.sin(t * 0.8 + i * 2.1)); objs.push(...person(M4.trs([x, 0, z], [0, yw, 0]), { skin: sk, shirt: sh, pants: '#2d2d33', sit: true, hair: '#1a1a1a', armL: 1.2, armR: 1.2 + talk * 0.25 * Math.abs(Math.sin(t * 5 + i)), headYaw: Math.sin(t * 0.7 + i * 1.3) * 0.35, face: 'flat' })); objs.push(B([x, 0.45, z], [0.42, 0.05, 0.42], C('#3a3a3a'))); }
  // other tables
  const r = rnd(23);
  for (const [x, z] of [[-2.0, -3.5], [1.6, -3.8], [-0.4, -5.6], [2.2, -6.2]]) {
    objs.push(O('cyl', [x, 0.72, z], [0, 0, 0], [0.8, 0.04, 0.8], C('#d8d4cc')), O('cyl', [x, 0.36, z], [0, 0, 0], [0.06, 0.72, 0.06], C('#333')));
    for (let j = 0; j < 2; j++) { const a = j * PI + r(); objs.push(...person(M4.trs([x + Math.sin(a) * 0.6, 0, z + Math.cos(a) * 0.6], [0, a + PI, 0]), { skin: SKINS[(r() * 5) | 0], shirt: MEN[(r() * 7) | 0], pants: '#2d2d33', sit: true, hair: '#222', hijab: r() < 0.3 ? '#d9cfc0' : null, armL: 1.3, armR: 1.3, headYaw: Math.sin(t * 0.5 + x) * 0.3, face: 'flat' })); }
  }
  // scooter passing in the street
  const sx = -14 + mod(t * 5, 28); const SM = M4.trs([sx, 0, -9.8], [0, PI / 2, 0]);
  objs.push(G(SM, M4.trs([0, 0.45, 0], [0, 0, 0], [0.4, 0.4, 1.3]), 'box', C('#c83a2a')), G(SM, M4.trs([0, 0.22, 0.5], [0, 0, PI / 2], [0.4, 0.1, 0.4]), 'cyl', C('#111')), G(SM, M4.trs([0, 0.22, -0.5], [0, 0, PI / 2], [0.4, 0.1, 0.4]), 'cyl', C('#111')), G(SM, M4.trs([0, 0.75, 0.7], [0, 0, 0], [0.12, 0.08, 0.05]), 'box', C('#fff4d0', 6), { mode: 1 }));
  objs.push(...person(M4.mul(SM, M4.trs([0, 0.15, -0.1], [0, 0, 0])), { skin: '#c68e62', shirt: '#2a2a2a', pants: '#2a2a40', sit: true, armL: 1.4, armR: 1.4, hair: '#111', face: 'flat' }));
  const cam = { pos: [0.05, 1.3, 0.45], target: [Math.sin(t * 0.25) * 0.5, 0.9, -6], up: [0, 1, 0], fov: 66, far: 300 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.phone) objs.push(...povArm(CW, [0.3, -0.6, 0.05], [0.1, -0.31, -0.42], POV_SLEEVE(), POV_SKIN()), ...phone(CW, [0.08, -0.23, -0.45], [0.35, 0, 0], T.scrFeed, [0, 0.8 - ((t * 0.06) % 0.8), 1, 0.125], 1.2));
  else { const lift = sstep(dur * 0.35, dur * 0.5, t) * (1 - sstep(dur * 0.7, dur * 0.85, t)); const GP = [0.11, -0.36 + lift * 0.1, -0.5]; objs.push(...povArm(CW, [0.32, -0.62, 0.05], [GP[0] + 0.03, GP[1] - 0.02, GP[2] + 0.02], POV_SLEEVE(), POV_SKIN(), [0, 0, 0])); objs.push(G(CW, M4.trs(add(GP, [-0.02, 0.03, 0]), [0, 0, 0], [0.06, 0.1, 0.06]), 'cyl6', C('#d07a30', 1.2))); }
  if (!dusk) skyStars(objs, cam, t, 0.5);
  objs.push(skyDome(cam));
  return {
    objs, cam, sun: { dir: norm([0.3, -1, -0.2]), col: dusk ? C('#ffb880', 0.8) : [0, 0, 0], center: [0, 0, -3], ext: 9, on: dusk },
    hemi: { sky: C(dusk ? '#9a90c0' : '#3a4060', dusk ? 0.55 : 0.4), gnd: C('#3a3028', 0.3) },
    pls: [{ p: [0, 2.6, -1.0], c: C('#ffc880', 2.0 * k), r: 5 }, { p: [-0.5, 2.6, -4.3], c: C('#ffc880', 1.6 * k), r: 5 }, { p: [-3.6, 1.4, -2.5], c: C('#ffb060', 1.4), r: 4.5 }, { p: [sx, 0.8, -9.3], c: C('#fff4d0', 1.5), r: 4 }],
    sky: { top: C(dusk ? '#2a3070' : '#04060f'), hor: C(dusk ? '#e08a70' : '#1a1c34'), gnd: C('#101014') }, fog: { col: C(dusk ? '#5a4a6a' : '#0a0c18'), d: 0.02, start: 10 }, clear: [0, 0, 0],
    post: { exposure: 1.1, bloom: 0.95, th: 0.85, vig: 0.5, warm: 0.35, sat: 1.05, fade: fadeIO(t, dur) },
  };
}

// ---------- FERRY DECK (sea crossing, gulls, distant coast) ----------
function sceneFerry(t, dur, o) {
  ensureT6(); o = o || {}; const objs = []; const tm = o.time || 'sunset'; const night = tm === 'night', day = tm === 'day';
  const roll = Math.sin(t * 0.7) * 0.012, heave = Math.sin(t * 0.55) * 0.05;
  // the deck (moves with the ship) — everything on board is built in ship space SM
  const SM = M4.trs([0, heave, 0], [Math.sin(t * 0.45) * 0.006, 0, roll]);
  const S = (p, s, col, ex) => objs.push(G(SM, M4.trs(p, [0, 0, 0], s), 'box', col, ex));
  S([0, -0.05, -6], [7, 0.1, 22], C('#8a6a4a'), { tex: T.wood, uvr: [0, 0, 3, 10] });
  S([3.6, -1.6, -6], [0.2, 3.2, 22], C('#f0f0f0')); S([3.6, -2.6, -6], [0.22, 0.4, 22], C('#2a4a8a'));
  for (let z = 3; z > -17; z -= 1.6) S([3.4, 0.55, z], [0.06, 1.1, 0.06], C('#f4f4f4'));
  for (const y of [0.4, 0.75, 1.1]) S([3.4, y, -6], [0.05, 0.05, 22], C('#f4f4f4'));
  S([3.4, 1.12, -6], [0.14, 0.05, 22], C('#a07a50'));
  // cabin wall on the left with portholes, lifeboat, flag
  S([-2.2, 1.6, -6], [0.3, 3.2, 22], C('#f2f2ee'));
  for (let z = 2; z > -16; z -= 2.2) { objs.push(G(SM, M4.trs([-2.04, 1.7, z], [0, 0, PI / 2], [0.5, 0.04, 0.5]), 'cyl', C('#3a4a6a'))); objs.push(G(SM, M4.trs([-2.03, 1.7, z], [0, 0, PI / 2], [0.4, 0.04, 0.4]), 'cyl', night ? C('#ffd890', 2.5) : C('#88a8c8', 1.0), night ? { mode: 1 } : {})); }
  objs.push(G(SM, M4.trs([-1.6, 2.9, -7], [PI / 2, 0, 0], [0.9, 3.2, 0.9]), 'cyl', C('#f07020')), G(SM, M4.trs([-1.6, 3.3, -7], [0, 0, 0], [0.75, 0.25, 3.0]), 'box', C('#f07020')));
  S([-2.2, 3.3, -6], [0.6, 0.1, 22], C('#d8d8d4'));
  S([2.6, 0.25, -9], [0.5, 0.5, 2.5], C('#c8c8c4')); // bench
  objs.push(G(SM, M4.trs([1.2, 2.2, 1.6], [0, 0, 0], [0.05, 4.4, 0.05]), 'cyl', C('#bbb')));
  const wv = (x) => Math.sin(t * 6 + x * 5) * 0.12;
  for (let i = 0; i < 6; i++) objs.push(G(SM, M4.trs([1.2, 4.0 - (i % 2) * 0.0, 1.6 + 0.15 + i * 0.13], [0, 0, wv(i)], [0.02, 0.5, 0.13]), 'box', i % 2 ? C('#f4f4f4') : C('#c82a2a')));
  // passengers at the railing
  for (const [z, i] of [[-6.5, 0], [-8.6, 1], [-13, 2]]) objs.push(...person(M4.mul(SM, M4.trs([2.9, 0, z], [0, PI / 2 + (i === 1 ? 0.3 : 0), 0])), { skin: SKINS[i + 1], shirt: ['#2d3a55', '#d9cfc0', '#7a3d4d'][i], pants: '#2d2d33', hijab: i === 1 ? '#3a5a6a' : null, hair: '#222', armL: 0.9, armR: 0.9, face: 'flat' }));
  // the sea, wake and sun streak (world space)
  const sunDir = night ? norm([0.7, 0.25, -0.5]) : day ? norm([0.4, 0.55, -0.6]) : norm([0.75, 0.05, -0.6]);
  objs.push(O('box', [0, -3.0, -200], [0, 0, 0], [2000, 0.1, 2000], C(night ? '#0a1a30' : day ? '#24557a' : '#2a4a7a'), { tex: T5.water, uvr: [0, t * 0.6, 300, 300] }));
  for (let i = 0; i < 14; i++) { const kk = mod(t * 0.25 + i / 14, 1); objs.push(O('plane', [4.2 + kk * 3, -2.9, -16 + kk * 30], [-PI / 2, 0, 0], [1.6 + kk * 4, 3, 1], C('#ffffff', 0.35 * (1 - kk)), { additive: true, mode: 3, tex: T.glow, noShadow: true })); }
  const camP = [1.7, 1.66 + heave, 0.4];
  const r = rnd(81);
  for (let i = 0; i < 60; i++) { const d = 12 + r() * 120, a = Math.atan2(sunDir[0], sunDir[2]) + (r() - 0.5) * 0.25 * (100 / d); const fl = Math.max(0, Math.sin(t * (3 + r() * 3) + i)); objs.push(O('box', [camP[0] + Math.sin(a) * d, -2.9, camP[2] + Math.cos(a) * d], [0, 0, 0], [0.4, 0.02, 0.4], C(night ? '#e0e8ff' : '#fff0d0', 4 * fl), { mode: 1, noShadow: true })); }
  // distant coast with town + minarets
  for (let i = 0; i < 40; i++) { const h = 8 + r() * 14; objs.push(O('sph', [180 + i * 3, -6, -260 + i * 9], [0, 0, 0], [60, h * 2, 40], C(day ? '#7a8a90' : night ? '#0a0e18' : '#4a3a5a'))); }
  for (let i = 0; i < 30; i++) { const z = -230 + i * 7, x = 170 + i * 2.6, h = 3 + r() * 6; objs.push(B([x, h / 2 - 3, z], [4, h, 4], C(day ? '#e8e0d0' : night ? '#141820' : '#8a6a7a'), night && r() < 0.6 ? { em: C('#ffcf7a', 0.4) } : {})); }
  for (const [x, z] of [[205, -150], [230, -95]]) objs.push(O('cyl', [x, 6, z], [0, 0, 0], [1.6, 18, 1.6], C(day ? '#f0e8d8' : night ? '#202838' : '#9a7a8a')), O('cone', [x, 16.5, z], [0, 0, 0], [1.8, 3.5, 1.8], C(day ? '#3a7a6a' : '#3a3a4a')), O('cyl', [x, 12, z], [0, 0, 0], [2.4, 0.4, 2.4], C('#9affc0', night ? 4 : 0.6), { mode: 1 }));
  // gulls gliding alongside
  if (o.gulls !== false) for (let i = 0; i < 5; i++) { const ph = t * 0.6 + i * 1.3; const PM = M4.trs([5 + i * 1.6 + Math.sin(ph) * 1.2, 2.6 + i * 0.5 + Math.sin(ph * 1.7) * 0.5, -4 - i * 2.2 + Math.sin(ph * 0.8) * 1.5], [0, PI + Math.sin(ph) * 0.3, Math.sin(ph) * 0.25]); t6Bird(objs, PM, Math.sin(t * (i % 2 ? 2 : 6) + i) * 0.35, C(night ? '#9aa0b0' : '#f4f4f4'), 1.1); }
  const cam = { pos: camP, target: [12, 0.2 + heave, -12], up: [Math.sin(roll) * 1.2, 1, 0], fov: 68, far: 1500 };
  if (night) { skyStars(objs, cam, t); skyMoon(objs, cam, sunDir, C('#05081a')); }
  objs.push(skyDome(cam));
  const top = night ? C('#04060f') : day ? C('#3a78c8') : C('#3a3a78'), hor = night ? C('#141c34') : day ? C('#d8e6ee') : C('#ff9a68');
  return {
    objs, cam, sun: { dir: scl(sunDir, -1), col: night ? C('#8090c0', 0.2) : day ? C('#fff2d8', 2.6) : C('#ffa868', 2.0), center: [1, 0, -5], ext: 12 },
    hemi: { sky: C(night ? '#405080' : day ? '#c8d8f0' : '#a090c0', night ? 0.35 : 0.6), gnd: C('#405060', 0.3) },
    pls: night ? [{ p: [0.5, 3.0, -1], c: C('#ffe0b0', 2.2), r: 7 }, { p: [0.5, 3.0, -7], c: C('#ffe0b0', 1.8), r: 7 }, { p: [2.4, 2.2, -3.5], c: C('#ffe0b0', 1.2), r: 4 }] : [],
    sky: { top, hor, gnd: hor }, fog: { col: hor, d: 0.0025, start: 60 }, clear: hor,
    post: { exposure: night ? 1.15 : 1.0, bloom: night ? 0.6 : 0.85, th: 0.95, vig: 0.42, warm: day ? 0.2 : night ? 0.05 : 0.45, sat: 1.05, fade: fadeIO(t, dur) },
  };
}

// ---------- OLIVE HARVEST IN AN ORCHARD (falling olives, nets, crates) ----------
function olive(objs, x, z, s, r, shake) {
  objs.push(O('cyl', [x, 0.7 * s, z], [0, 0, 0.18], [0.32 * s, 1.4 * s, 0.32 * s], C('#5a4a3a')), O('cyl', [x + 0.2 * s, 1.4 * s, z], [0.2, 0, -0.35], [0.22 * s, 1.0 * s, 0.22 * s], C('#5a4a3a')));
  for (let i = 0; i < 7; i++) { const a = i * 0.9 + r() * 0.5, d = 0.4 + r() * 0.9; const sh = shake ? Math.sin(shake * 18 + i) * 0.05 : 0; objs.push(O('sph', [x + Math.cos(a) * d * s + sh, (1.9 + r() * 0.9) * s, z + Math.sin(a) * d * s], [0, a, 0], [(1.3 + r() * 0.6) * s, (0.8 + r() * 0.3) * s, (1.3 + r() * 0.6) * s], C(['#7a8a5a', '#8a9a6a', '#6a7a4e'][i % 3]))); }
}
function sceneOrchard(t, dur, o) {
  ensureT6(); o = o || {}; const objs = []; const day = o.time === 'day'; const walk = o.walk !== false;
  const camZ = 1.5 - (walk ? t * 0.35 : 0);
  objs.push(B([0, -0.05, -30], [120, 0.1, 120], C('#a89060'), { tex: T5.grass, uvr: [0, 0, 40, 40] }));
  objs.push(B([0, -0.03, -30], [1.6, 0.04, 120], C('#c8b080'), { tex: T.dirt, uvr: [0, 0, 1, 40] }));
  const r = rnd(17);
  // rows of olive trees with nets beneath; the second tree on the right is being harvested
  const HX = 3.2, HZ = -6;
  for (let row = 0; row < 9; row++) for (const sx of [-1, 1]) for (let c = 0; c < 2; c++) {
    const x = sx * (3.2 + c * 4.5), z = 2 - row * 4;
    const isH = x === HX && z === HZ;
    olive(objs, x, z, 1 + (r() - 0.5) * 0.25, r, isH ? t : 0);
    if (row < 5 && c === 0) objs.push(B([x, 0.01, z], [3.6, 0.02, 3.6], C(row % 2 ? '#3a5a3a' : '#4a5440')));
  }
  // harvester shaking a branch with a long pole, olives falling on the net
  objs.push(...person(M4.trs([HX - 1.2, 0, HZ + 0.9], [0, PI * 0.75, 0]), { skin: '#8d5a3b', shirt: '#6a6a4a', pants: '#3a3a40', hair: '#cfcfcf', armL: 2.6 + Math.sin(t * 9) * 0.15, armR: 2.6 + Math.sin(t * 9) * 0.15, face: 'flat' }));
  objs.push(seg(M4.ident(), [HX - 1.0, 1.9 + Math.sin(t * 9) * 0.06, HZ + 0.7], [HX - 0.1, 3.4 + Math.sin(t * 9) * 0.1, HZ - 0.2], [0.04, 0.04], C('#a08a60')));
  for (let i = 0; i < 26; i++) { const kk = mod(t * 0.9 + i / 26, 1); const a = i * 2.4, d = 0.3 + (i % 5) * 0.25; objs.push(O('sph', [HX + Math.cos(a) * d, 2.4 - kk * kk * 2.4, HZ + Math.sin(a) * d], [0, 0, 0], [0.04, 0.05, 0.04], C('#3a2a3a'))); }
  for (let i = 0; i < 40; i++) objs.push(O('sph', [HX + (r() - 0.5) * 2.4, 0.04, HZ + (r() - 0.5) * 2.4], [0, 0, 0], [0.04, 0.04, 0.04], C(r() < 0.5 ? '#3a2a3a' : '#4a5a2a')));
  // woman picking from a ladder on the left, crates of olives
  objs.push(seg(M4.ident(), [-2.5, 0, -9.4], [-3.0, 2.6, -10.0], [0.06, 0.06], C('#a07a50')), seg(M4.ident(), [-1.9, 0, -9.7], [-2.4, 2.6, -10.3], [0.06, 0.06], C('#a07a50')));
  for (let i = 1; i < 6; i++) { const u = i / 6; objs.push(seg(M4.ident(), [lerp(-2.5, -3.0, u), u * 2.6, lerp(-9.4, -10.0, u)], [lerp(-1.9, -2.4, u), u * 2.6, lerp(-9.7, -10.3, u)], [0.04, 0.04], C('#a07a50'))); }
  objs.push(...person(M4.trs([-2.5, 1.3, -9.7], [0, PI + 0.4, 0]), { skin: '#c68e62', shirt: '#7a3d4d', pants: '#3a3a40', hijab: '#e8e2d4', armL: 2.8 + Math.sin(t * 2) * 0.2, armR: 2.4, face: 'flat' }));
  for (const [x, z, f] of [[1.6, -7.5, 1], [2.1, -7.2, 1], [1.8, -7.4, 0], [-1.3, -12, 1]]) { const y = f ? 0.2 : 0.6; objs.push(B([x, y, z], [0.55, 0.38, 0.4], C('#a8804e'), { tex: T.wood })); if (f) objs.push(B([x, y + 0.2, z], [0.5, 0.04, 0.36], C('#3a2a34'))); }
  // child walking ahead on the path
  objs.push(...person(M4.trs([0.6 + Math.sin(t * 0.4) * 0.2, 0, camZ - 8 - t * 0.15], [0, PI, 0]), { skin: '#c68e62', shirt: '#e8c040', pants: '#2a4a8a', walk: 1, phase: t * 5, hair: '#2a1f1a', face: 'flat' }));
  // hills + sky
  for (let i = 0; i < 9; i++) objs.push(O('sph', [-80 + i * 22, -6, -110 - (i % 3) * 15], [0, 0, 0], [40, 22 + (i % 4) * 4, 30], C(day ? '#8a9a7a' : '#a08a6a')));
  // birds
  for (let i = 0; i < 4; i++) t6Bird(objs, M4.trs([-10 + mod(t * 2 + i * 6, 24), 8 + Math.sin(t + i), -24 - i * 2], [0, PI / 2, 0]), Math.sin(t * 9 + i) * 0.6, C('#2a2a30'));
  const bob = walk ? Math.sin(t * 4.2) * 0.02 : 0;
  const cam = { pos: [0.3, 1.62 + bob, camZ], target: [lerp(1.6, 2.4, clamp(t / dur, 0, 1)), 1.35, camZ - 9], up: [0, 1, 0], fov: 66, far: 400 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.hands !== false) {
    const lift = sstep(0, 1.2, t) * 0.04;
    for (const sx of [-1, 1]) objs.push(...povArm(CW, [sx * 0.24, -0.68, 0.05], [sx * 0.05, -0.34 + lift, -0.5], C('#5a6a7a'), POV_SKIN(), [-0.35, 0, sx * 0.5]));
    const rr = rnd(5); for (let i = 0; i < 9; i++) objs.push(G(CW, M4.trs([(rr() - 0.5) * 0.08, -0.32 + lift + rr() * 0.02, -0.5 + (rr() - 0.5) * 0.04], [0, 0, 0], [0.018, 0.022, 0.018]), 'sph', C(i % 3 ? '#3a2a3a' : '#5a6a2a')));
  }
  objs.push(skyDome(cam));
  return {
    objs, cam, sun: { dir: day ? norm([0.4, -0.75, 0.3]) : norm([0.75, -0.3, 0.5]), col: C(day ? '#fff4e0' : '#ffc890', day ? 2.6 : 2.3), center: [0, 0, camZ - 6], ext: 14 },
    hemi: { sky: C(day ? '#c8d8f0' : '#e0c8a8', 0.6), gnd: C('#706040', 0.3) }, pls: [],
    sky: { top: C(day ? '#3a78c8' : '#4a6aa8'), hor: C(day ? '#d8e6ee' : '#f8c890'), gnd: C('#8a7a50') }, fog: { col: C(day ? '#d0dce4' : '#e8c8a0'), d: 0.009, start: 18 }, clear: C('#e0d8c0'),
    post: { exposure: 1.0, bloom: 0.6, th: 1.05, vig: 0.4, warm: day ? 0.15 : 0.45, sat: 1.0, fade: fadeIO(t, dur) },
  };
}

// ---------- LAUNDROMAT AT NIGHT (spinning drums, neon, waiting) ----------
function sceneLaundromat(t, dur, o) {
  ensureT6(); o = o || {}; const objs = []; const spin = o.spin !== false;
  room(objs, 6, 8, 3.0, C('#e4ecee'), T3.tiles, C('#d8dcdc'));
  for (let z = -0.5; z > -7; z -= 2) { const flick = z === -4.5 && (t % 4.3) < 0.15 ? 0.3 : 1; objs.push(B([0, 2.94, z], [0.2, 0.04, 1.6], C('#f4f8ff', 4 * flick), { mode: 1, noShadow: true })); }
  // glass front onto the rainy night street
  const FZ = -6.9;
  objs.push(O('plane', [0, 1.6, FZ + 0.02], [0, 0, 0], [5.8, 2.8, 1], [1, 1, 1], { mode: 1, tex: T2.nightFacade[0], uvr: [0, 0, 2, 1], noShadow: true }));
  objs.push(O('plane', [0, 1.6, FZ + 0.06], [0, 0, 0], [5.8, 2.8, 1], C('#ffffff', 0.25), { additive: true, mode: 3, tex: T2.drops, uvr: [0, -t * 0.05, 3, 1.5], noShadow: true }));
  for (const x of [-1.5, 1.5]) objs.push(B([x, 1.5, FZ + 0.08], [0.08, 3, 0.08], C('#3a3c42')));
  objs.push(B([0, 0.1, FZ + 0.08], [6, 0.2, 0.1], C('#3a3c42')));
  objs.push(B([1.0, 2.6, FZ + 0.1], [1.6, 0.3, 0.04], C('#30e0ff', 3.5), { mode: 1, noShadow: true }), O('plane', [1.0, 2.6, FZ + 0.15], [0, 0, 0], [3, 1.2, 1], C('#30c0ff', 0.25), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  // washers along the left wall (facing +x), dryers stacked on the far section
  const WX = -2.62;
  for (let i = 0; i < 6; i++) {
    const z = -0.6 - i * 0.92;
    objs.push(B([WX, 0.48, z], [0.72, 0.9, 0.86], C('#f4f6f8')), B([WX + 0.37, 0.88, z], [0.02, 0.08, 0.7], C('#c8ccd0')));
    objs.push(O('plane', [WX + 0.385, 0.88, z - 0.18], [0, PI / 2, 0], [0.22, 0.07, 1], [1.4, 1.4, 1.4], { mode: 1, tex: T6.lcd, noShadow: true }));
    objs.push(O('cyl', [WX + 0.37, 0.45, z], [0, 0, PI / 2], [0.56, 0.04, 0.56], C('#9aa0a8')), O('cyl', [WX + 0.38, 0.45, z], [0, 0, PI / 2], [0.46, 0.02, 0.46], C('#1a2430', 1.0)));
    const on = i !== 4; const sp = spin && on ? t * (i % 2 ? 7 : 5.5) + i : i;
    if (on) for (let j = 0; j < 7; j++) { const a = sp + j * 0.9; const rr = 0.13 + (j % 3) * 0.03; objs.push(O('sph', [WX + 0.3, 0.42 + Math.sin(a) * rr - (j < 3 ? 0.04 : 0), z + Math.cos(a) * rr], [a, j, 0], [0.12, 0.08, 0.14], C(['#d84a3a', '#3a7ad9', '#f0f0f0', '#f0c030', '#3aa05a', '#7a3d4d', '#2a2a40'][j]), { noShadow: true })); }
    if (on) objs.push(O('plane', [WX + 0.395, 0.48, z], [0, PI / 2, 0], [0.4, 0.4, 1], C('#cfe8ff', 0.18), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
    objs.push(B([WX + 0.2, 1.78, z], [0.7, 0.9, 0.86], C('#e8ecee')), O('cyl', [WX + 0.56, 1.74, z], [0, 0, PI / 2], [0.5, 0.04, 0.5], C('#8a9098')), O('cyl', [WX + 0.57, 1.74, z], [0, 0, PI / 2], [0.4, 0.02, 0.4], C('#2a2a30')));
  }
  // folding table + woman folding, vending machine, chairs, basket
  objs.push(B([2.4, 0.85, -3.6], [0.9, 0.06, 2.2], C('#d8d0c0')), B([2.4, 0.42, -3.6], [0.8, 0.84, 2.0], C('#b8b0a0')));
  for (let i = 0; i < 4; i++) objs.push(B([2.4, 0.92 + i * 0.05, -3.0 - (i % 2) * 0.1], [0.4, 0.05, 0.35], C(['#f0f0f0', '#3a7ad9', '#e8c8a0', '#7a3d4d'][i])));
  const fold = Math.sin(t * 1.4);
  objs.push(...person(M4.trs([1.75, 0, -3.8], [0, PI / 2, 0]), { skin: '#c68e62', shirt: '#2d3a55', pants: '#2d2d33', hijab: '#a8505a', armL: 1.3 + fold * 0.3, armR: 1.3 - fold * 0.3, headYaw: -0.1, face: 'flat' }));
  objs.push(B([1.7 + fold * 0.0, 1.12, -3.65], [0.04, 0.4 + fold * 0.05, 0.5], C('#f0f0f0')));
  objs.push(B([2.6, 0.95, -6.2], [0.8, 1.9, 0.7], C('#2a2c34')), O('plane', [2.6, 1.05, -5.84], [0, 0, 0], [0.7, 1.4, 1], [1.4, 1.4, 1.4], { mode: 1, tex: T6.vend, noShadow: true }));
  for (let i = 0; i < 4; i++) objs.push(B([2.7, 0.45, -0.3 - i * 0.55], [0.48, 0.06, 0.48], C('#e86a30')), B([2.92, 0.72, -0.3 - i * 0.55], [0.05, 0.5, 0.48], C('#e86a30')));
  objs.push(O('cyl', [-0.6, 0.2, -2.6], [0, 0, 0], [0.55, 0.4, 0.4], C('#4a8ad0')), O('sph', [-0.6, 0.4, -2.6], [0, 0, 0], [0.48, 0.18, 0.36], C('#e8e4dc'), { tex: T.fabric }));
  // camera seated on the chairs by the window wall
  const cam = { pos: [1.55, 1.2, 0.6], target: [-2.0, 0.85 + Math.sin(t * 0.3) * 0.05, -3.4], up: [0, 1, 0], fov: 68 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.phone) objs.push(...povArm(CW, [0.3, -0.6, 0.05], [0.1, -0.31, -0.42], POV_SLEEVE(), POV_SKIN()), ...phone(CW, [0.08, -0.23, -0.45], [0.35, 0, 0], T.scrFeed, [0, 0.8 - ((t * 0.06) % 0.8), 1, 0.125], 1.2));
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C('#e4eef4', 0.6), gnd: C('#8a9090', 0.3) },
    pls: [{ p: [0, 2.7, -1], c: C('#f0f6ff', 1.4), r: 5 }, { p: [0, 2.7, -4.5], c: C('#f0f6ff', 1.3), r: 5 }, { p: [1.0, 2.4, -6.4], c: C('#30c0ff', 0.6), r: 3 }, { p: [2.6, 1.2, -5.4], c: C('#ffffff', 0.5), r: 2.5 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.7, th: 0.95, vig: 0.45, warm: -0.05, sat: 0.95, fade: fadeIO(t, dur) },
  };
}

// ---------- MINA TENT CITY AT DAWN (pilgrims in ihram, white tents, mountains) ----------
function sceneMina(t, dur, o) {
  ensureT6(); o = o || {}; const objs = []; const day = o.time === 'day'; const walk = o.walk !== false;
  const camZ = 4 - (walk ? t * 0.7 : 0); const k = clamp(t / dur, 0, 1);
  objs.push(B([0, -0.05, -60], [400, 0.1, 400], C('#c8b490'), { tex: T2.sand, uvr: [0, 0, 80, 80] }));
  objs.push(B([0, -0.02, -60], [5, 0.06, 200], C('#6a6a6e'), { tex: T.asphalt, uvr: [0, 0, 2, 80] }));
  for (const sx of [-1, 1]) objs.push(B([sx * 2.7, 0.08, -60], [0.4, 0.16, 200], C('#d8d4cc')));
  // tent grid on both sides
  const tentW = C('#f6f4ee'), tentR = C('#eceae2');
  for (let row = 0; row < 26; row++) for (const sx of [-1, 1]) for (let c = 0; c < 5; c++) {
    const x = sx * (5 + c * 4.2), z = 6 - row * 4.2;
    objs.push(B([x, 0.9, z], [3.6, 1.8, 3.6], tentW), O('cone', [x, 2.5, z], [0, PI / 7, 0], [4.4, 1.5, 4.4], tentR));
  }
  for (let i = 0; i < 220; i++) { const r2 = rnd(i + 3); const x = (r2() - 0.5) * 300, z = -110 - r2() * 120; if (Math.abs(x) < 4) continue; objs.push(O('cone', [x, 1.5, z], [0, 0, 0], [4.4, 3.2, 4.4], tentW, { noShadow: true })); }
  // street lamps + direction sign
  for (let z = 4; z > -100; z -= 12) for (const sx of [-1, 1]) { objs.push(O('cyl', [sx * 3.0, 3.5, z], [0, 0, 0], [0.12, 7, 0.12], C('#8a8e94')), B([sx * 2.6, 7, z], [0.9, 0.12, 0.25], C('#8a8e94')), B([sx * 2.2, 6.92, z], [0.4, 0.06, 0.2], C('#fff0d0', day ? 0.5 : 6 * (1 - k * 0.6)), { mode: 1, noShadow: true })); }
  objs.push(B([0, 4.4, -18], [5.4, 0.08, 0.1], C('#8a8e94')), O('plane', [0, 5.0, -17.95], [0, 0, 0], [3.4, 1.3, 1], [1.4, 1.4, 1.4], { tex: T6.sign, noShadow: true }));
  for (const sx of [-1, 1]) objs.push(B([sx * 2.75, 2.5, -18], [0.12, 5, 0.12], C('#8a8e94')));
  // rocky mountains around the valley
  const r = rnd(29);
  for (let i = 0; i < 16; i++) { const a = -1.2 + i * 0.16, d = 160 + r() * 60; objs.push(O('cone', [Math.sin(a) * d, 12, camZ - Math.cos(a) * d], [0, r() * 3, 0], [70 + r() * 40, 50 + r() * 40, 60], C(day ? '#9a7a5a' : '#6a4a4a'))); }
  // pilgrims in ihram walking along the road
  for (let i = 0; i < 22; i++) {
    const lane = (i % 4) - 1.5, z = camZ - 3 - mod(i * 3.1 + t * 0.35, 60); const fem = i % 5 === 2;
    objs.push(...person(M4.trs([lane * 1.05 + Math.sin(i) * 0.2, 0, z], [0, PI, 0]), { skin: SKINS[i % 5], shirt: fem ? '#e8e6e0' : '#f6f6f2', pants: '#f2f2ee', hijab: fem ? '#f0eee8' : null, walk: 1, phase: t * 4.2 + i * 1.3, hair: i % 3 ? '#222' : '#2a2a2a', face: 'flat' }));
    if (!fem) objs.push(O('box', [lane * 1.05 + Math.sin(i) * 0.2 - 0.1, 1.45, z], [0, 0, 0.6], [0.06, 0.6, 0.29], C('#f6f6f2')));
  }
  // a few pilgrims resting by the tents
  for (const [x, z] of [[-3.6, -7], [3.8, -11], [-3.5, -22]]) objs.push(...person(M4.trs([x, 0.16, z], [0, x > 0 ? -PI / 2 : PI / 2, 0]), { skin: '#8d5a3b', shirt: '#f6f6f2', pants: '#f2f2ee', sit: true, armL: 1.2, armR: 1.2, hair: '#cfcfcf', face: 'flat' }));
  // birds + sun
  for (let i = 0; i < 5; i++) t6Bird(objs, M4.trs([-12 + mod(t * 2.4 + i * 6, 26), 14 + Math.sin(t + i), camZ - 40 - i * 3], [0, PI / 2, 0]), Math.sin(t * 8 + i) * 0.6, C('#2a2a30'), 1.4);
  const sunY = day ? 0.6 : lerp(0.02, 0.1, k), sunDir = norm([-0.25, sunY, -1]);
  const cam = { pos: [0.5, 1.62 + (walk ? Math.sin(t * 4.4) * 0.02 : 0), camZ], target: [Math.sin(t * 0.2) * 0.8, lerp(2.2, 3.8, k), camZ - 30], up: [0, 1, 0], fov: 68, far: 800 };
  if (!day) { objs.push(O('sph', add(cam.pos, scl(sunDir, 420)), [0, 0, 0], [15, 15, 15], C('#fff0c8', 6), { mode: 1, noShadow: true }), O('plane', add(cam.pos, scl(sunDir, 440)), dirRot(scl(sunDir, -1)), [180, 110, 1], C('#ffa870', 0.45), { additive: true, mode: 3, tex: T.glow, noShadow: true })); }
  objs.push(skyDome(cam));
  const top = day ? C('#2a64b8') : lerp3(C('#2a3270'), C('#4a6aa8'), k), hor = day ? C('#c8d8e4') : lerp3(C('#f09070'), C('#ffd0a0'), k);
  const pls = []; if (!day) for (let z = Math.floor(camZ / 12) * 12 + 4; pls.length < 6; z -= 12) for (const sx of [-1, 1]) if (z < camZ + 4) pls.push({ p: [sx * 2.2, 6.6, z], c: C('#ffe8c0', 1.4 * (1 - k * 0.6)), r: 9 });
  return {
    objs, cam, sun: { dir: day ? norm([0.4, -0.75, 0.4]) : norm([0.25, -Math.max(0.15, sunY + 0.1), 1]), col: day ? C('#fff4e0', 2.6) : C('#ffb880', 1.8), center: [0, 0, camZ - 8], ext: 16 },
    hemi: { sky: C(day ? '#c8d8f0' : '#b0a8d0', 0.6), gnd: C('#a08a68', 0.35) },
    pls, sky: { top, hor, gnd: hor }, fog: { col: hor, d: 0.006, start: 30 }, clear: hor,
    post: { exposure: day ? 0.85 : 1.0, bloom: day ? 0.5 : 0.8, th: day ? 1.1 : 0.95, vig: 0.4, warm: day ? 0.2 : 0.45, sat: 1.0, fade: fadeIO(t, dur) },
  };
}

// ---------- BALCONY AT MAGHRIB (rooftops, laundry, minaret, tea glass) ----------
function sceneBalcony(t, dur, o) {
  ensureT6(); o = o || {}; const objs = []; const night = o.time === 'night'; const k = clamp(t / dur, 0, 1);
  // balcony slab, walls, railing, plants
  objs.push(B([0, -0.08, -0.2], [2.8, 0.16, 2.2], C('#c8b8a0'), { tex: T3.tiles, uvr: [0, 0, 3, 2] }));
  objs.push(B([0, -1.2, -0.2], [2.8, 2.2, 2.2], C('#e0d4c0')));
  for (const sx of [-1, 1]) objs.push(B([sx * 1.45, 1.4, 0], [0.12, 2.8, 2.6], C('#e8dcc8'), { tex: T.plaster }));
  const RZ = -1.25;
  objs.push(B([0, 1.02, RZ], [2.8, 0.06, 0.08], C('#2a2a2e')), B([0, 0.1, RZ], [2.8, 0.05, 0.06], C('#2a2a2e')));
  for (let x = -1.3; x <= 1.31; x += 0.13) objs.push(B([x, 0.56, RZ], [0.025, 0.9, 0.025], C('#2a2a2e')));
  for (const [x, c] of [[-1.05, '#d83a4a'], [-0.75, '#f0f0f0'], [0.95, '#d83a4a']]) { objs.push(O('cyl', [x, 1.16, RZ], [0, 0, 0], [0.22, 0.2, 0.18], C('#b05a3a'))); for (let i = 0; i < 6; i++) objs.push(O('sph', [x + Math.cos(i) * 0.08, 1.32 + (i % 2) * 0.05, RZ + Math.sin(i) * 0.06], [0, 0, 0], [0.12, 0.08, 0.12], C('#3a7a3a'))); for (let i = 0; i < 4; i++) objs.push(O('sph', [x + Math.cos(i * 1.6) * 0.06, 1.42, RZ + Math.sin(i * 1.6) * 0.05], [0, 0, 0], [0.05, 0.05, 0.05], C(c))); }
  // little table with teapot + glasses
  objs.push(B([1.0, 0.55, -0.5], [0.5, 0.04, 0.5], C('#a07a50')), B([1.0, 0.27, -0.5], [0.05, 0.54, 0.05], C('#5a4a3a')));
  objs.push(O('sph', [1.05, 0.66, -0.6], [0, 0, 0], [0.16, 0.14, 0.16], C('#d8d8e0')), O('cone', [1.05, 0.77, -0.6], [0, 0, 0], [0.06, 0.08, 0.06], C('#d8d8e0')));
  objs.push(O('cyl6', [0.9, 0.62, -0.38], [0, 0, 0], [0.06, 0.1, 0.06], C('#d07a30', 1.1)));
  // neighbourhood: rows of flat rooftops with dishes, tanks and laundry lines
  const r = rnd(57); const cols = ['#e8dcc4', '#d8c8a8', '#f0e4d0', '#c8b498', '#e0c8a8'];
  for (let i = 0; i < 70; i++) {
    const x = (r() - 0.5) * 70, z = -6 - r() * 70, h = -2 - r() * 4 + (z < -40 ? 2 : 0), w = 4 + r() * 4, d = 4 + r() * 4;
    objs.push(B([x, h - 8, z], [w, 16, d], C(cols[i % 5]), { tex: T.plaster }), B([x, h + 0.2, z], [w + 0.1, 0.4, d + 0.1], C('#d0c0a8')));
    if (night || k > 0.7) for (let j = 0; j < 2; j++) objs.push(B([x - w / 4 + j * w / 2, h - 1.4, z + d / 2 + 0.02], [0.8, 0.9, 0.02], C(r() < 0.6 ? '#ffcf7a' : '#bcd7ff', (night ? 2.2 : 2.2 * sstep(0.7, 1, k)) * (r() < 0.7 ? 1 : 0)), { mode: 1, noShadow: true }));
    if (r() < 0.45) objs.push(O('sph', [x + w * 0.3, h + 0.9, z], [0.5, 0.6, 0], [0.9, 0.9, 0.25], C('#eeeeee')), O('cyl', [x + w * 0.3, h + 0.5, z], [0, 0, 0], [0.05, 0.6, 0.05], C('#888')));
    if (r() < 0.3) objs.push(O('cyl', [x - w * 0.3, h + 0.8, z + 0.5], [0, 0, 0], [1.0, 1.2, 1.0], C('#3a6aa0')));
    if (r() < 0.35 && z > -30) { const lx = x - w * 0.2; objs.push(seg(M4.ident(), [lx - 1.6, h + 1.5, z], [lx + 1.6, h + 1.5, z], [0.02, 0.02], C('#555'))); for (let j = 0; j < 5; j++) objs.push(O('box', [lx - 1.3 + j * 0.65, h + 1.2, z], [Math.sin(t * 2 + j + i) * 0.15, 0, 0], [0.45, 0.55, 0.02], C(['#d84a3a', '#f0f0f0', '#3a7ad9', '#f0c030', '#e8e2d4'][j]))); }
  }
  // minaret with dome
  const MX = 9, MZ = -34;
  objs.push(B([MX - 4, -3, MZ - 2], [12, 8, 10], C('#e8dcc8'), { tex: T.plaster }), O('sph', [MX - 5, 1.4, MZ - 3], [0, 0, 0], [7, 6, 7], C('#2f7a6a')), O('cyl', [MX - 5, 4.6, MZ - 3], [0, 0, 0], [0.1, 1, 0.1], C('#d8b040')));
  objs.push(O('cyl', [MX, 5, MZ], [0, 0, 0], [1.4, 20, 1.4], C('#f0e8d8')), O('cyl', [MX, 11, MZ], [0, 0, 0], [2.2, 0.4, 2.2], C('#e0d8c8')), O('cyl', [MX, 12.2, MZ], [0, 0, 0], [1.1, 2, 1.1], C('#f0e8d8')), O('cone', [MX, 14.8, MZ], [0, 0, 0], [1.3, 3, 1.3], C('#2f7a6a')));
  objs.push(O('cyl', [MX, 11.25, MZ], [0, 0, 0], [1.9, 0.2, 1.9], C('#9affc0', night ? 4 : 1 + 3 * sstep(0.3, 0.6, k)), { mode: 1 }));
  // swifts circling
  for (let i = 0; i < 10; i++) { const a = t * (0.9 + (i % 3) * 0.2) + i * 0.7, rr = 6 + (i % 4) * 2; const PM = M4.trs([Math.cos(a) * rr, 5 + Math.sin(a * 1.6 + i) * 1.5, -16 + Math.sin(a) * rr * 0.5], [0, -a, Math.sin(a) * 0.5]); t6Bird(objs, PM, Math.sin(t * 16 + i) * 0.5, C('#1a1a20'), 0.7); }
  const sunY = night ? -0.2 : lerp(0.06, -0.01, k), sunDir = norm([-0.55, sunY, -1]);
  const cam = { pos: [-0.2, 1.48, 0.55], target: [lerp(-1.2, 1.8, sstep(0, dur, t)), 0.75, -14], up: [0, 1, 0], fov: 66, far: 900 };
  if (!night) { objs.push(O('sph', add(cam.pos, scl(sunDir, 420)), [0, 0, 0], [17, 17, 17], C('#ffd8a0', 5), { mode: 1, noShadow: true }), O('plane', add(cam.pos, scl(sunDir, 440)), dirRot(scl(sunDir, -1)), [190, 120, 1], C('#ff9060', 0.55), { additive: true, mode: 3, tex: T.glow, noShadow: true })); }
  else { skyStars(objs, cam, t, 0.7); skyMoon(objs, cam, [0.4, 0.35, -1], C('#05081a')); }
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.tea !== false) { const lift = sstep(dur * 0.3, dur * 0.45, t) * (1 - sstep(dur * 0.65, dur * 0.8, t)); const GP = [0.07, -0.36 + lift * 0.12, -0.55 + lift * 0.08]; objs.push(...povArm(CW, [0.34, -0.66, 0.05], [GP[0] + 0.03, GP[1] - 0.02, GP[2] + 0.02], POV_SLEEVE(), POV_SKIN(), [0, 0, 0])); objs.push(G(CW, M4.trs(add(GP, [-0.02, 0.035, 0]), [0, 0, 0], [0.06, 0.1, 0.06]), 'cyl6', C('#d07a30', 1.2))); }
  objs.push(skyDome(cam));
  const top = night ? C('#04060f') : lerp3(C('#3a4a90'), C('#2a2a60'), k), hor = night ? C('#1a2040') : lerp3(C('#ffb070'), C('#f07050'), k);
  return {
    objs, cam, sun: { dir: night ? norm([0.2, -1, 0.3]) : scl(sunDir, -1), col: night ? C('#6070a0', 0.3) : C('#ffa060', lerp(2.0, 1.2, k)), center: [0, 0, -10], ext: 30 },
    hemi: { sky: C(night ? '#405080' : '#b098c0', night ? 0.35 : 0.6), gnd: C('#806050', 0.3) },
    pls: [{ p: [0, 2.6, 0.6], c: C('#ffd8a0', night ? 1.2 : 0.4), r: 3.5 }],
    sky: { top, hor, gnd: hor }, fog: { col: hor, d: 0.008, start: 20 }, clear: hor,
    post: { exposure: 1.0, bloom: 0.85, th: 0.95, vig: 0.42, warm: night ? 0.05 : 0.45, sat: 1.05, fade: fadeIO(t, dur) },
  };
}

Object.assign(SCENES, { bakery: sceneBakery, cafe: sceneCafe, ferry: sceneFerry, orchard: sceneOrchard, laundromat: sceneLaundromat, mina: sceneMina, balcony: sceneBalcony });
