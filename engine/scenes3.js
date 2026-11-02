'use strict';
// New scenes (Nov 2026): office, train, kitchen, park, hospital, wudu, desert, study
let T3 = null;
function ensureT3() {
  ensureT2(); if (T3) return; T3 = {};
  T3.code = texFromCanvas(mkCanvas(256, 160, (g, w, h) => {
    g.fillStyle = '#10141c'; g.fillRect(0, 0, w, h); g.fillStyle = '#1c2533'; g.fillRect(0, 0, w, 14);
    const r = rnd(31); const cols = ['#7fb4ff', '#c9d3e0', '#8fe0a0', '#e0b070', '#c9d3e0'];
    for (let y = 22; y < h - 6; y += 9) { let x = 8 + ((r() * 4) | 0) * 10; while (x < w - 20 && r() < 0.85) { const l = 10 + r() * 40; g.fillStyle = cols[(r() * 5) | 0]; g.fillRect(x, y, l, 4); x += l + 6; } }
  }));
  T3.mail = texFromCanvas(mkCanvas(256, 160, (g, w, h) => {
    g.fillStyle = '#f4f6fa'; g.fillRect(0, 0, w, h); g.fillStyle = '#2f5fd0'; g.fillRect(0, 0, w, 16); g.fillStyle = '#e3e8f0'; g.fillRect(0, 16, 60, h);
    const r = rnd(5); for (let i = 0; i < 9; i++) { const y = 22 + i * 15; g.fillStyle = i < 3 ? '#1b2333' : '#8a93a3'; g.fillRect(68, y, 50 + r() * 60, 4); g.fillStyle = '#b8c0cc'; g.fillRect(68, y + 6, 100 + r() * 70, 3); if (i < 3) { g.fillStyle = '#2f5fd0'; g.beginPath(); g.arc(64, y + 3, 2, 0, 7); g.fill(); } }
  }));
  T3.tiles = texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    g.fillStyle = '#c9d6d8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#eef3f3'; g.lineWidth = 3;
    for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 64, 0); g.lineTo(i * 64, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 64); g.lineTo(w, i * 64); g.stroke(); }
    noiseFillOver(g, w, h, 0.05, 8);
  }), true);
  T3.blinds = texFromCanvas(mkCanvas(128, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#dfeaf5'); gr.addColorStop(1, '#f7f3e6'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 12) { g.fillStyle = 'rgba(120,120,110,0.35)'; g.fillRect(0, y, w, 3); }
  }));
  T3.dune = texFromCanvas(mkCanvas(256, 256, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 6) { g.fillStyle = 'rgba(0,0,0,0.05)'; g.fillRect(0, y + Math.sin(y) * 2, w, 2); } noiseFillOver(g, w, h, 0.08, 9); }), true);
  T3.spines = texFromCanvas(mkCanvas(256, 64, (g, w, h) => {
    const r = rnd(12); let x = 0; const cols = ['#6b2b2b', '#2b4a6b', '#3d5a3a', '#7a6233', '#4a3a5a', '#8a8070', '#2a2a2a', '#9a4a2a'];
    while (x < w) { const bw = 6 + r() * 10, bh = 40 + r() * 24; g.fillStyle = cols[(r() * cols.length) | 0]; g.fillRect(x, h - bh, bw - 1, bh); g.fillStyle = 'rgba(230,200,120,0.5)'; g.fillRect(x + 1, h - bh + 6, bw - 3, 2); x += bw; }
  }), true);
}
const POV_SLEEVE = () => C('#3a4252'), POV_SKIN = () => C('#a8714c');
function room(objs, w, d, hgt, wallC, floorTex, floorCol) {
  objs.push(B([0, -0.05, -d / 2 + 1], [w, 0.1, d], floorCol || [1, 1, 1], floorTex ? { tex: floorTex, uvr: [0, 0, w / 2, d / 2] } : {}));
  objs.push(B([0, hgt + 0.05, -d / 2 + 1], [w, 0.1, d], wallC));
  objs.push(B([-w / 2, hgt / 2, -d / 2 + 1], [0.1, hgt, d], wallC, { tex: T.plaster })); objs.push(B([w / 2, hgt / 2, -d / 2 + 1], [0.1, hgt, d], wallC, { tex: T.plaster }));
  objs.push(B([0, hgt / 2, -d + 1], [w, hgt, 0.1], wallC, { tex: T.plaster })); objs.push(B([0, hgt / 2, 1.05], [w, hgt, 0.1], wallC));
}

// ---------- OFFICE (late at work, laptop, city at night) ----------
function sceneOffice(t, dur, o) {
  ensureT3(); o = o || {}; const objs = [];
  room(objs, 6, 6, 2.9, C('#c8ccd0'), T.wood, C('#8a8a8a'));
  objs.push(O('plane', [0, 1.55, -4.93], [0, 0, 0], [5.6, 2.2, 1], [1.1, 1.1, 1.1], { mode: 1, tex: T.night, uvr: [0, 0, 2, 1], noShadow: true }));
  for (let x = -2.8; x <= 2.8; x += 1.4) objs.push(B([x, 1.55, -4.9], [0.06, 2.2, 0.06], C('#2a2e36')));
  objs.push(B([0, 0.74, -1.2], [1.8, 0.05, 0.8], C('#d9d3c6')));
  for (const sx of [-0.85, 0.85]) objs.push(B([sx, 0.37, -1.2], [0.05, 0.74, 0.75], C('#4a4f58')));
  objs.push(B([0, 0.775, -1.05], [0.62, 0.02, 0.42], C('#9aa0a8')));
  objs.push(G(M4.trs([0, 0.785, -1.26], [-0.32, 0, 0]), M4.trs([0, 0.2, 0], [0, 0, 0], [0.62, 0.4, 0.02]), 'box', C('#9aa0a8')));
  const scr = (o.screen === 'mail') ? T3.mail : T3.code;
  objs.push(G(M4.trs([0, 0.785, -1.245], [-0.32, 0, 0]), M4.trs([0, 0.2, 0.012], [0, 0, 0], [0.57, 0.35, 1]), 'plane', [1.6, 1.6, 1.6], { mode: 1, tex: scr, uvr: [0, ((t * 0.04) % 1), 1, 1], noShadow: true }));
  objs.push(O('cyl', [0.62, 0.83, -1.0], [0, 0, 0], [0.09, 0.12, 0.09], C('#f2efe8')));
  for (let i = 0; i < 4; i++) { const k = ((t * 0.35 + i / 4) % 1); objs.push(O('sph', [0.62 + Math.sin(t + i) * 0.02, 0.92 + k * 0.25, -1.0], [0, 0, 0], [0.04 + k * 0.05, 0.05, 0.04 + k * 0.05], C('#ffffff', 0.25 * (1 - k)), { additive: true, mode: 3, tex: T.soft, noShadow: true })); }
  for (const [x, z, c] of [[-0.6, -1.4, '#ffe066'], [-0.52, -1.35, '#ff9ab0'], [-0.7, -1.3, '#9ad0ff']]) objs.push(B([x, 0.77, z], [0.08, 0.005, 0.08], C(c)));
  objs.push(B([-0.75, 0.79, -1.25], [0.12, 0.05, 0.12], C('#333')), seg(M4.ident(), [-0.75, 0.8, -1.25], [-0.6, 1.25, -1.3], [0.025, 0.025], C('#333')), O('cone', [-0.55, 1.22, -1.25], [0.4, 0, -0.6], [0.14, 0.14, 0.14], C('#333')));
  // empty colleague desks in the dark
  for (const x of [-2.2, 2.2]) { objs.push(B([x, 0.74, -2.6], [1.4, 0.05, 0.7], C('#bdb7aa'))); objs.push(B([x, 1.0, -2.85], [0.5, 0.32, 0.03], C('#1a1c22'))); }
  const cam = { pos: [0.05 + Math.sin(t * 0.3) * 0.02, 1.22, -0.25], target: [0.02, 0.85, -1.35], up: [0, 1, 0], fov: 62 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const ty = (s) => Math.max(0, Math.sin(t * 13 + s)) * 0.015 * (o.typing === false ? 0 : 1);
  objs.push(...povArm(CW, [-0.32, -0.6, 0.05], [-0.13, -0.38 - ty(0), -0.6], POV_SLEEVE(), POV_SKIN()), ...povArm(CW, [0.32, -0.6, 0.05], [0.14, -0.39 - ty(2), -0.62], POV_SLEEVE(), POV_SKIN()));
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C('#405070', 0.3), gnd: C('#202020', 0.2) },
    pls: [{ p: [-0.5, 1.15, -1.2], c: C('#ffd9a0', 2.2), r: 2.4 }, { p: [0, 1.0, -1.0], c: C('#9fc0ff', 0.9), r: 1.6 }, { p: [0, 1.6, -4.4], c: C('#5070b0', 0.5), r: 5 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.7, th: 0.9, vig: 0.55, warm: 0.15, fade: fadeIO(t, dur) },
  };
}

// ---------- TRAIN / METRO (commute, everyone on their phone) ----------
function sceneTrain(t, dur, o) {
  ensureT3(); o = o || {}; const objs = [];
  const L = 14, sway = Math.sin(t * 1.7) * 0.012;
  objs.push(B([0, -0.05, -L / 2 + 1], [2.8, 0.1, L], C('#4a4f58'), { tex: T.asphalt, uvr: [0, 0, 2, 8] }));
  objs.push(B([0, 2.3, -L / 2 + 1], [2.8, 0.1, L], C('#d8dadc')));
  for (let z = 0.5; z > -L + 1; z -= 1.6) objs.push(B([0, 2.24, z], [1.2, 0.03, 0.9], C('#f4f8ff', 3), { mode: 1, noShadow: true }));
  for (const sx of [-1, 1]) {
    objs.push(B([sx * 1.4, 1.15, -L / 2 + 1], [0.08, 2.3, L], C('#cfd2d6')));
    for (let z = -0.5; z > -L + 1; z -= 2.2) {
      objs.push(B([sx * 1.36, 1.45, z], [0.02, 0.7, 1.6], C('#0a0c12'), { noShadow: true }));
      // passing tunnel lights
      for (let k = 0; k < 2; k++) { const zz = z + 0.8 - (((t * 9 + k * 7 + z * 3) % 16 + 16) % 16) / 10; if (zz < z - 0.8 || zz > z + 0.8) continue; objs.push(B([sx * 1.37, 1.55, zz], [0.01, 0.06, 0.25], C('#ffd8a0', 5), { mode: 1, noShadow: true })); }
      objs.push(B([sx * 1.05, 0.45, z], [0.5, 0.08, 1.8], C('#3a5a8a'))); objs.push(B([sx * 1.3, 0.75, z], [0.08, 0.6, 1.8], C('#3a5a8a')));
    }
  }
  for (let z = -1.6; z > -L + 1; z -= 2.2) for (const sx of [-0.7, 0.7]) objs.push(B([sx, 1.15, z], [0.05, 2.3, 0.05], C('#e0b84a')));
  const r = rnd(44); const shirts = ['#2d3a55', '#7a3d4d', '#556b2f', '#444', '#8a6a4a', '#3a5a6a'];
  let i = 0;
  for (let z = -1.3; z > -L + 2; z -= 1.1) for (const sx of [-1, 1]) {
    if (r() < 0.25) continue; i++;
    const x = sx * 1.02, yaw = sx > 0 ? -PI / 2 : PI / 2;
    const fem = r() < 0.4;
    objs.push(...person(M4.trs([x, 0.0, z], [0, yaw, 0]), { skin: ['#c68e62', '#8d5a3b', '#e0b48c', '#7a5238'][(r() * 4) | 0], shirt: shirts[(r() * 6) | 0], pants: '#2d2d33', sit: true, hijab: fem && r() < 0.6 ? '#d9cfc0' : null, armL: 0.9, armR: 0.9, headYaw: 0, face: 'flat' }));
    const hp = [x - sx * 0.42, 1.02, z]; objs.push(O('box', hp, [-0.9, yaw, 0], [0.07, 0.14, 0.01], C('#1a1a1a')), O('plane', add(hp, [-sx * 0.006, 0.006, 0]), [-0.9, yaw, 0], [0.065, 0.13, 1], C('#bcd4ff', 2.2), { mode: 1, noShadow: true }));
  }
  const cam = { pos: [0.25 + sway, 1.25, 1.4], target: [0.0 + sway * 3, 1.1, -10], up: [Math.sin(t * 1.7) * 0.01, 1, 0], fov: 64 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.phone !== false) objs.push(...povArm(CW, [0.3, -0.6, 0.05], [0.12, -0.3, -0.42], POV_SLEEVE(), POV_SKIN()), ...phone(CW, [0.1, -0.22, -0.45], [0.35, 0, 0], T.scrFeed, [0, 0.8 - ((t * 0.06) % 0.8), 1, 0.125], 1.2));
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C('#e8ecf4', 0.75), gnd: C('#505560', 0.3) },
    pls: [{ p: [0, 2.0, -2], c: C('#eef4ff', 1.6), r: 5 }, { p: [0, 2.0, -7], c: C('#eef4ff', 1.6), r: 5 }],
    fog: { col: C('#202430'), d: 0.04, start: 6 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.5, th: 1.1, vig: 0.45, warm: 0.0, sat: 0.85, fade: fadeIO(t, dur) },
  };
}

// ---------- KITCHEN (suhoor / Fajr tea, kettle steam) ----------
function sceneKitchen(t, dur, o) {
  ensureT3(); o = o || {}; const objs = []; const dawn = o.time !== 'night';
  room(objs, 5, 5, 2.7, C('#efe6d6'), T.wood, C('#c8a880'));
  objs.push(B([0, 0.45, -3.6], [4.6, 0.9, 0.7], C('#f4efe4'))); objs.push(B([0, 0.92, -3.6], [4.7, 0.05, 0.75], C('#8a8580'), { tex: T.asphalt, uvr: [0, 0, 3, 1] }));
  for (let x = -2; x <= 2; x += 0.8) objs.push(B([x, 0.45, -3.24], [0.76, 0.85, 0.02], C('#e6dccb')));
  for (let x = -2; x <= 2; x += 0.8) if (Math.abs(x) > 0.5) objs.push(B([x, 2.1, -3.75], [0.76, 0.7, 0.4], C('#e6dccb')));
  objs.push(O('plane', [0, 1.65, -3.93], [0, 0, 0], [1.1, 0.9, 1], [1.2, 1.2, 1.2], { mode: 1, tex: dawn ? T.dawn : T.night, noShadow: true }));
  objs.push(B([0, 1.65, -3.91], [0.04, 0.9, 0.03], C('#fff')), B([0, 1.65, -3.91], [1.1, 0.04, 0.03], C('#fff')));
  objs.push(B([1.3, 0.96, -3.55], [0.6, 0.02, 0.5], C('#222')));
  objs.push(O('cyl', [1.3, 1.07, -3.5], [0, 0, 0], [0.2, 0.2, 0.2], C('#b8b8b8')), O('cyl', [1.3, 1.2, -3.5], [0, 0, 0], [0.04, 0.06, 0.04], C('#333')), seg(M4.ident(), [1.4, 1.1, -3.5], [1.52, 1.2, -3.5], [0.03, 0.03], C('#b8b8b8')));
  objs.push(O('plane', [1.3, 0.975, -3.5], [-PI / 2, 0, 0], [0.3, 0.3, 1], C('#3060ff', 0.8), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  for (let i = 0; i < 6; i++) { const k = ((t * 0.4 + i / 6) % 1); objs.push(O('sph', [1.52 + k * 0.1 + Math.sin(t * 2 + i) * 0.04, 1.22 + k * 0.6, -3.5], [0, 0, 0], [0.05 + k * 0.12, 0.06 + k * 0.1, 0.05 + k * 0.12], C('#ffffff', 0.3 * (1 - k)), { additive: true, mode: 3, tex: T.soft, noShadow: true })); }
  objs.push(B([-0.4, 0.76, -1.6], [1.2, 0.05, 0.8], C('#b08060')));
  for (const [x, z] of [[-0.9, -1.3], [0.1, -1.3], [-0.9, -1.9], [0.1, -1.9]]) objs.push(B([x, 0.37, z], [0.05, 0.74, 0.05], C('#6b4a32')));
  objs.push(O('cyl', [-0.2, 0.84, -1.55], [0, 0, 0], [0.08, 0.1, 0.08], C('#f6f1e6')), O('cyl', [-0.6, 0.84, -1.7], [0, 0, 0], [0.08, 0.1, 0.08], C('#d8e8f0')));
  objs.push(O('cyl', [-0.45, 0.8, -1.45], [0, 0, 0], [0.22, 0.04, 0.22], C('#e0d0b0')));
  for (let i = 0; i < 7; i++) objs.push(O('sph', [-0.45 + Math.cos(i) * 0.06, 0.84, -1.45 + Math.sin(i) * 0.06], [0, i, 0], [0.05, 0.03, 0.03], C('#4a2a18')));
  if (o.mother !== false) objs.push(...person(M4.trs([0.8, 0, -2.9], [0, PI * 0.85, 0]), { skin: '#9a6644', shirt: '#6a4a6a', pants: '#3a3030', hijab: '#e8e0d0', armL: 1.1, armR: 0.9, face: 'smile' }));
  const k = clamp(t / dur, 0, 1);
  const cam = { pos: [lerp(-0.5, -0.3, k), 1.35, lerp(0.2, -0.2, k)], target: [0.3, 0.95, -3.0], up: [0, 1, 0], fov: 64 };
  const glow = dawn ? 1 : 0.4;
  return {
    objs, cam, sun: { dir: norm([0.1, -0.35, 1]), col: C('#ffc89a', dawn ? 1.6 : 0), center: [0, 0, -2], ext: 6, on: dawn },
    hemi: { sky: C(dawn ? '#c0b0c8' : '#40486a', 0.55), gnd: C('#806050', 0.3) },
    pls: [{ p: [0, 2.4, -1.6], c: C('#ffe2b8', dawn ? 1.0 : 2.2), r: 4.5 }, { p: [0, 1.6, -3.6], c: C(dawn ? '#ffb090' : '#6a80c0', 0.8 * glow + 0.3), r: 3 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.05, bloom: 0.7, th: 0.95, vig: 0.45, warm: 0.45, fade: fadeIO(t, dur) },
  };
}

// ---------- PARK IN AUTUMN (time passing, falling leaves) ----------
function scenePark(t, dur, o) {
  ensureT3(); o = o || {}; const objs = []; const gold = o.time === 'golden';
  objs.push(B([0, -0.05, -20], [80, 0.1, 80], C('#7a8a4a'), { tex: T2.sand, uvr: [0, 0, 30, 30] }));
  objs.push(B([0, 0.0, -20], [2.2, 0.02, 80], C('#c8b090'), { tex: T.asphalt, uvr: [0, 0, 1, 30] }));
  const r = rnd(21); const leafCols = ['#d2691e', '#e8a33a', '#b8452a', '#e0c050', '#9a3a20'];
  for (let i = 0; i < 26; i++) {
    const side = i % 2 ? 1 : -1, z = 4 - i * 2.6 - r(), x = side * (2.4 + r() * 3), h = 2.2 + r() * 1.5, col = leafCols[(r() * 5) | 0];
    objs.push(O('cyl', [x, h / 2, z], [0, 0, 0], [0.22, h, 0.22], C('#4a3424')));
    objs.push(O('sph', [x, h + 0.9, z], [0, 0, 0], [2.2 + r(), 2.0, 2.2 + r()], C(col)));
    objs.push(O('sph', [x + 0.5, h + 1.4, z + 0.3], [0, 0, 0], [1.3, 1.2, 1.3], C(leafCols[(r() * 5) | 0])));
  }
  for (let i = 0; i < 200; i++) { const x = (r() - 0.5) * 7, z = 2 - r() * 40; objs.push(B([x, 0.01, z], [0.12, 0.005, 0.08], C(leafCols[(r() * 5) | 0]), { noShadow: true })); }
  const camZ = 2 - t * (o.walk === false ? 0 : 0.9);
  for (let i = 0; i < 70; i++) { const ph = r(), x0 = (r() - 0.5) * 9, z0 = camZ - 2 - r() * 18; const k = (t * 0.18 + ph) % 1; objs.push(O('box', [x0 + Math.sin(t * 1.3 + i) * 0.5, 4.5 - k * 4.5, z0], [t * 2 + i, i, t + i], [0.1, 0.008, 0.07], C(leafCols[i % 5]), { noShadow: true })); }
  for (const z of [-6, -18]) { objs.push(B([1.6, 0.45, z], [0.5, 0.06, 1.6], C('#6b4a32')), B([1.85, 0.75, z], [0.06, 0.5, 1.6], C('#6b4a32'))); }
  objs.push(...person(M4.trs([1.6, 0.0, -18], [0, -PI / 2, 0]), { skin: '#c68e62', shirt: '#5a5a5a', pants: '#3a3a3a', sit: true, hair: '#ddd', face: 'flat' }));
  for (let i = 0; i < 3; i++) { const z = -12 - i * 7 + (t * 0.7) % 7; objs.push(...person(M4.trs([-0.5 + i * 0.5, 0, z], [0, 0, 0]), { skin: '#8d5a3b', shirt: ['#7a3d4d', '#2d3a55', '#556b2f'][i], pants: '#2d2d33', walk: 1, phase: t * 4 + i })); }
  const bob = o.walk === false ? 0 : Math.sin(t * 5.2) * 0.03;
  const cam = { pos: [0.2, 1.62 + bob, camZ], target: [0, 1.4, camZ - 20], up: [0, 1, 0], fov: 64, far: 300 };
  objs.push(skyDome(cam));
  return {
    objs, cam,
    sun: { dir: gold ? norm([-0.6, -0.25, -0.7]) : norm([-0.4, -0.7, -0.5]), col: C(gold ? '#ffb070' : '#fff0d8', gold ? 2.4 : 2.8), center: [0, 0, camZ - 6], ext: 14 },
    hemi: { sky: C(gold ? '#f0c8a0' : '#c8d8f0', 0.6), gnd: C('#806040', 0.35) }, pls: [],
    sky: { top: C(gold ? '#6a7ab0' : '#7aa8e0'), hor: C(gold ? '#ffc890' : '#e8eef0'), gnd: C('#7a8a4a') }, fog: { col: C(gold ? '#f0c8a0' : '#dfe6ea'), d: 0.02, start: 12 }, clear: C('#dfe6ea'),
    post: { exposure: 1.0, bloom: 0.5, th: 1.1, vig: 0.35, warm: gold ? 0.5 : 0.25, sat: 1.1, fade: fadeIO(t, dur) },
  };
}

// ---------- HOSPITAL (visiting a parent, heart monitor) ----------
function sceneHospital(t, dur, o) {
  ensureT3(); o = o || {}; const objs = [];
  room(objs, 5, 5, 2.8, C('#dfe6e4'), T3.tiles, C('#c8d0d0'));
  objs.push(O('plane', [1.2, 1.55, -3.93], [0, 0, 0], [1.6, 1.3, 1], [1.25, 1.25, 1.25], { mode: 1, tex: T3.blinds, noShadow: true }));
  // bed + patient lying
  objs.push(B([-0.3, 0.45, -2.2], [1.0, 0.2, 2.0], C('#e8ecee'))); objs.push(B([-0.3, 0.28, -2.2], [1.05, 0.15, 2.05], C('#9aa4aa')));
  objs.push(B([-0.3, 0.75, -3.15], [1.05, 0.5, 0.06], C('#c0c8cc')));
  objs.push(B([-0.3, 0.6, -1.85], [0.95, 0.14, 1.2], C('#cfe0ea')));
  objs.push(O('sph', [-0.3, 0.68, -2.95], [0, 0, 0], [0.5, 0.18, 0.32], C('#ffffff')));
  const who = o.patient === 'mother' ? { skin: '#9a6644', hijab: '#e3d8c6' } : { skin: '#8d5a3b', hair: '#cfcfcf' };
  const H = M4.trs([-0.3, 0.86, -2.78], [-PI / 2 + 0.35, 0, 0]);
  objs.push(G(H, M4.trs([0, 0, 0], [0, 0, 0], [0.38, 0.4, 0.36]), 'box', C(who.skin)));
  objs.push(G(H, M4.trs([0, who.hijab ? 0.02 : 0.19, -0.02], [0, 0, 0], who.hijab ? [0.44, 0.46, 0.4] : [0.4, 0.06, 0.38]), 'box', C(who.hijab || who.hair)));
  objs.push(G(H, M4.trs([0, -0.02, 0.185], [0, 0, 0], [0.32, 0.34, 1]), 'plane', [0.9, 0.9, 0.9], { tex: T.face.flat }));
  objs.push(B([0.18, 0.68, -2.0], [0.12, 0.08, 0.3], C(who.skin)));
  // monitor + IV
  objs.push(B([0.75, 1.0, -2.95], [0.05, 1.3, 0.05], C('#888')), B([0.75, 1.62, -2.85], [0.45, 0.32, 0.06], C('#222')));
  objs.push(O('plane', [0.75, 1.62, -2.817], [0, 0, 0], [0.4, 0.26, 1], [1.4, 1.4, 1.4], { mode: 1, tex: T2.ecg, uvr: [(t * 0.25) % 1, 0, 1, 1], noShadow: true }));
  const beat = Math.exp(-((t % 1.1) * 8));
  objs.push(O('sph', [0.95, 1.73, -2.81], [0, 0, 0], [0.02, 0.02, 0.01], C('#3cff8a', 2 + 6 * beat), { mode: 1 }));
  objs.push(B([-1.1, 1.0, -2.6], [0.03, 2.0, 0.03], C('#aaa')), O('box', [-1.1, 1.85, -2.6], [0, 0, 0], [0.16, 0.24, 0.05], C('#e8f4ff', 1.1), { mode: 1 }));
  objs.push(O('cyl', [-0.9, 0.85, -1.35], [0, 0, 0], [0.2, 0.02, 0.2], C('#f0f0f0')), O('cyl', [-0.9, 0.9, -1.35], [0, 0, 0], [0.06, 0.1, 0.06], C('#e0f0ff')));
  const k = clamp(t / dur, 0, 1);
  const cam = { pos: [lerp(1.25, 1.1, k), 1.45, lerp(-0.2, -0.45, k)], target: [lerp(-0.05, -0.2, k), 0.85, -2.55], up: [0, 1, 0], fov: 62 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const reach = sstep(dur * 0.35, dur * 0.6, t);
  objs.push(...povArm(CW, [-0.25, -0.62, 0.05], lerp3([-0.2, -0.45, -0.35], [-0.42, -0.36, -1.25], reach), C('#5b6b4a'), POV_SKIN()));
  return {
    objs, cam, sun: { dir: norm([-0.4, -0.5, 1]), col: C('#fff4e0', 1.4), center: [0, 0, -2], ext: 5 },
    hemi: { sky: C('#e0ecf0', 0.7), gnd: C('#909890', 0.3) },
    pls: [{ p: [0, 2.6, -2], c: C('#f0f8ff', 1.2), r: 5 }, { p: [0.75, 1.62, -2.6], c: C('#60ff9a', 0.25 + 0.4 * beat), r: 1.2 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.5, th: 1.0, vig: 0.45, warm: 0.05, sat: o.sad === false ? 1 : 0.8, fade: fadeIO(t, dur) },
  };
}

// ---------- WUDU (sink, running water, hands) ----------
function sceneWudu(t, dur, o) {
  ensureT3(); o = o || {}; const objs = []; const dawn = o.time !== 'day';
  room(objs, 3, 3, 2.6, C('#e8eeee'), T3.tiles, C('#b8c4c8'));
  objs.push(B([0, 1.3, -1.94], [2.9, 2.6, 0.02], [1, 1, 1], { tex: T3.tiles, uvr: [0, 0, 3, 3] }));
  objs.push(B([0, 0.82, -1.7], [0.9, 0.06, 0.55], C('#f6f6f4')));
  objs.push(B([0, 0.78, -1.68], [0.6, 0.06, 0.38], C('#e4e8ea')));
  objs.push(B([0, 0.4, -1.75], [0.25, 0.8, 0.25], C('#f0f0ee')));
  objs.push(O('cyl', [0, 0.95, -1.88], [0, 0, 0], [0.05, 0.22, 0.05], C('#c8ccd0')), seg(M4.ident(), [0, 1.05, -1.88], [0, 1.03, -1.72], [0.04, 0.04], C('#c8ccd0')));
  const flow = o.water === false ? 0 : 1;
  for (let i = 0; i < 26 * flow; i++) { const k = ((t * 3 + i / 26) % 1); objs.push(O('sph', [Math.sin(i) * 0.006, 1.01 - k * 0.2, -1.72], [0, 0, 0], [0.02, 0.05, 0.02], C('#d8f0ff', 1.6), { mode: 1, noShadow: true })); }
  for (let i = 0; i < 10 * flow; i++) { const a = i * 0.63 + t * 4, d = ((t * 1.5 + i / 10) % 1) * 0.12; objs.push(O('sph', [Math.cos(a) * d, 0.82, -1.66 + Math.sin(a) * d * 0.6], [0, 0, 0], [0.012, 0.012, 0.012], C('#e8f8ff', 2), { mode: 1, noShadow: true })); }
  objs.push(B([0, 1.65, -1.92], [0.8, 0.9, 0.02], C('#7a8a98')), O('plane', [0, 1.65, -1.905], [0, 0, 0], [0.76, 0.86, 1], C('#3a4a5a', 1.0), { mode: 1, tex: dawn ? T.dawn : T.morning, noShadow: true }));
  objs.push(B([-1.2, 1.2, -1.5], [0.04, 0.6, 0.35], C('#4a7a6a'), { tex: T.fabric }));
  const cam = { pos: [0.02, 1.48, -0.9], target: [0, 0.85, -1.75], up: [0, 1, 0], fov: 60 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const cup = Math.sin(t * 1.6) * 0.04;
  objs.push(...povArm(CW, [-0.3, -0.6, 0.05], [-0.08, -0.17 + cup, -0.55], C('#e8e4d8'), POV_SKIN(), [0.2, 0.6, 0]), ...povArm(CW, [0.3, -0.6, 0.05], [0.08, -0.17 + cup, -0.55], C('#e8e4d8'), POV_SKIN(), [0.2, -0.6, 0]));
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C(dawn ? '#b8c0d8' : '#e8eef4', 0.6), gnd: C('#808890', 0.3) },
    pls: [{ p: [0, 2.3, -1.2], c: C(dawn ? '#ffe8c8' : '#ffffff', 1.8), r: 3.5 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.05, bloom: 0.6, th: 1.0, vig: 0.4, warm: dawn ? 0.3 : 0.1, fade: fadeIO(t, dur) },
  };
}

// ---------- DESERT NIGHT (campfire, stars) ----------
function sceneDesert(t, dur, o) {
  ensureT3(); o = o || {}; const objs = [];
  objs.push(B([0, -0.05, -40], [300, 0.1, 300], C('#8a6a48'), { tex: T3.dune, uvr: [0, 0, 60, 60] }));
  const r = rnd(8); for (let i = 0; i < 18; i++) { const x = (r() - 0.5) * 140, z = -15 - r() * 120, s = 8 + r() * 20; objs.push(O('sph', [x, -s * 0.55, z], [0, r() * 3, 0], [s * 2.2, s, s * 1.4], C('#7a5a3c'), { tex: T3.dune })); }
  const fl = 1 + 0.18 * Math.sin(t * 13) + 0.1 * Math.sin(t * 23 + 1);
  for (let i = 0; i < 6; i++) { const a = i * PI / 3; objs.push(seg(M4.ident(), [Math.cos(a) * 0.35, 0.03, -2.4 + Math.sin(a) * 0.35], [Math.cos(a) * 0.05, 0.2, -2.4 + Math.sin(a) * 0.05], [0.06, 0.06], C('#3a2a1a'))); }
  for (let i = 0; i < 5; i++) objs.push(O('cone', [Math.sin(i * 2.1) * 0.08, 0.25, -2.4 + Math.cos(i * 2.1) * 0.08], [0, 0, 0], [0.18, (0.45 + 0.15 * Math.sin(t * 9 + i)) * fl, 0.18], C(i % 2 ? '#ff9a30' : '#ffd060', 5 * fl), { mode: 1, noShadow: true }));
  objs.push(O('plane', [0, 0.4, -2.4], [0, 0, 0], [2.4, 2.4, 1], C('#ff8a30', 0.35 * fl), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  for (let i = 0; i < 18; i++) { const k = ((t * 0.5 + i / 18) % 1); objs.push(O('sph', [Math.sin(i * 3 + t) * 0.3 * k, 0.4 + k * 2.2, -2.4 + Math.cos(i * 5) * 0.2], [0, 0, 0], [0.015, 0.015, 0.015], C('#ffb050', 6 * (1 - k)), { mode: 1, noShadow: true })); }
  objs.push(O('cone', [-3.2, 0.9, -5.5], [0, 0.6, 0], [2.4, 1.8, 2.4], C('#d8c8a8')), B([-2.7, 0.5, -4.6], [0.6, 1.0, 0.02], C('#3a2a20')));
  if (o.friend !== false) objs.push(...person(M4.trs([1.0, 0, -3.2], [0, -2.3, 0]), { skin: '#8d5a3b', shirt: '#e8e2d4', pants: '#d8d2c4', sit: true, hair: '#222', face: 'flat', armL: 1.0, armR: 1.0 }));
  const cam = { pos: [0, 1.0, 0], target: [0, lerp(0.5, 1.6, sstep(dur * 0.55, dur * 0.85, t)), -6], up: [0, 1, 0], fov: 64, far: 700 };
  skyStars(objs, cam, t, 1.3); skyMoon(objs, cam, [0.5, 0.35, -1], C('#0e1430'));
  objs.push(skyDome(cam));
  return {
    objs, cam, sun: { dir: norm([0.5, -0.6, -1]), col: C('#8aa0e0', 0.35), center: [0, 0, -4], ext: 12 },
    hemi: { sky: C('#28305a', 0.35), gnd: C('#3a2a1a', 0.2) },
    pls: [{ p: [0, 0.6, -2.4], c: C('#ff9a40', 3.2 * fl), r: 6 }],
    sky: { top: C('#060a1c'), hor: C('#1c2448'), gnd: C('#1a120c') }, fog: { col: C('#141a34'), d: 0.004, start: 30 }, clear: C('#060a1c'),
    post: { exposure: 1.05, bloom: 0.9, th: 0.85, vig: 0.5, warm: 0.3, fade: fadeIO(t, dur) },
  };
}

// ---------- STUDY / QURAN ON THE SHELF (dust, hand takes it) ----------
function sceneStudy(t, dur, o) {
  ensureT3(); o = o || {}; const objs = [];
  room(objs, 4.5, 4.5, 2.7, C('#d8cbb4'), T.wood, C('#9a7a58'));
  objs.push(B([0, 1.15, -3.3], [2.4, 2.3, 0.45], C('#5a3e28')));
  for (let i = 0; i < 4; i++) { const y = 0.35 + i * 0.52; objs.push(B([0, y, -3.12], [2.3, 0.04, 0.42], C('#6b4a32'))); objs.push(O('plane', [0, y + 0.24, -2.97], [0, 0, 0], [2.25, 0.44, 1], [1.15, 1.15, 1.15], { tex: T3.spines, uvr: [i * 0.3, 0, 2, 1], noShadow: true })); }
  // the Quran: green, gold, on the top shelf, dusty until taken
  const take = sstep(dur * 0.4, dur * 0.75, t);
  const q0 = [0.35, 2.06, -2.9], q1 = [0.05, 1.32, -1.4];
  const qp = lerp3(q0, q1, take); const qr = [lerp(0, -1.1, take), lerp(0, 0.2, take), 0];
  objs.push(O('box', qp, qr, [0.26, 0.34, 0.07], C('#1f5a3a')), O('box', add(qp, [0, 0, 0.037]), qr, [0.16, 0.2, 0.002], C('#d9b25a', 1.4)));
  if (take < 0.05) for (let i = 0; i < 25; i++) { const k = ((t * 0.05 + i / 25) % 1); objs.push(O('sph', [0.35 + Math.sin(i * 7) * 0.4, 2.3 - k * 1.2, -2.9 + Math.cos(i * 3) * 0.2], [0, 0, 0], [0.008, 0.008, 0.008], C('#fff2d8', 1.5), { mode: 1, noShadow: true })); }
  objs.push(O('plane', [0.35, 2.25, -2.9], [0, 0, 0], [1.4, 0.9, 1], C('#ffe0a0', 0.12 * (1 - take)), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  objs.push(B([1.5, 0.74, -1.8], [1.0, 0.05, 0.6], C('#7a5236')), B([1.5, 0.95, -1.95], [0.06, 0.4, 0.06], C('#333')), O('cone', [1.5, 1.18, -1.95], [PI, 0, 0], [0.3, 0.18, 0.3], C('#e8d8b0', 1.2)));
  objs.push(O('plane', [-1.6, 1.6, -3.43], [0, 0, 0], [0.9, 1.0, 1], [1.1, 1.1, 1.1], { mode: 1, tex: T.night, noShadow: true }));
  const cam = { pos: [0.1, 1.5, -0.25], target: lerp3([0.2, 1.4, -3.2], [0.05, 1.2, -1.6], take), up: [0, 1, 0], fov: 64 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const reachK = sstep(dur * 0.25, dur * 0.45, t) * (1 - take);
  if (reachK > 0.02) objs.push(...povArm(CW, [0.3, -0.6, 0.05], lerp3([0.25, -0.5, -0.4], [0.14, 0.28, -1.9], reachK), POV_SLEEVE(), POV_SKIN()));
  if (take > 0.6) objs.push(...povArm(CW, [-0.3, -0.62, 0.05], [-0.12, -0.3, -0.62], POV_SLEEVE(), POV_SKIN()), ...povArm(CW, [0.3, -0.62, 0.05], [0.12, -0.3, -0.62], POV_SLEEVE(), POV_SKIN()));
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C('#8a7a90', 0.6), gnd: C('#503828', 0.35) },
    pls: [{ p: [1.5, 1.1, -1.95], c: C('#ffd090', 2.6), r: 4.0 }, { p: [0.3, 2.4, -2.4], c: C('#ffe4b0', 1.8), r: 3.0 }, { p: [0, 2.5, -0.5], c: C('#ffe8c8', 1.0), r: 4.5 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.05, bloom: 0.7, th: 0.9, vig: 0.5, warm: 0.45, fade: fadeIO(t, dur) },
  };
}

Object.assign(SCENES, { office: sceneOffice, train: sceneTrain, kitchen: sceneKitchen, park: scenePark, hospital: sceneHospital, wudu: sceneWudu, desert: sceneDesert, study: sceneStudy });
