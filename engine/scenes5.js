'use strict';
// Week 2026-11-16 scenes: courtyard, mountain, cemetery, waiting_room, kids_room, football, river, construction
let T5 = null;
const T5TICK = {};
function ensureT5() {
  ensureT4(); if (T5) return; T5 = {};
  T5.marble = texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    g.fillStyle = '#f2eee6'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if ((i + j) % 2) { g.fillStyle = '#e2dccf'; g.fillRect(i * 128, j * 128, 128, 128); }
    g.strokeStyle = 'rgba(150,140,125,0.5)'; g.lineWidth = 2; g.strokeRect(0, 0, 128, 128); g.strokeRect(128, 128, 128, 128); g.strokeRect(128, 0, 128, 128); g.strokeRect(0, 128, 128, 128);
    g.fillStyle = '#2a6a6a'; g.save(); g.translate(128, 128); g.rotate(PI / 4); g.fillRect(-14, -14, 28, 28); g.restore();
    noiseFillOver(g, w, h, 0.04, 31);
  }), true);
  T5.water = texFromCanvas(mkCanvas(128, 128, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); const r = rnd(51);
    for (let i = 0; i < 70; i++) { const x = r() * w, y = r() * h, l = 8 + r() * 26; g.fillStyle = `rgba(150,170,190,${0.25 + r() * 0.4})`; g.fillRect(x, y, l, 2); g.fillRect(x - w, y, l, 2); }
  }), true);
  T5.grass = texFromCanvas(mkCanvas(256, 256, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); const r = rnd(77); for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${40 + r() * 40},${70 + r() * 60},${20 + r() * 30},0.35)`; g.fillRect(r() * w, r() * h, 1.5, 3 + r() * 4); } }), true);
  T5.pitch = texFromCanvas(mkCanvas(64, 64, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, 0, w, h / 2); noiseFillOver(g, w, h, 0.05, 3); }), true);
  T5.net = texFromCanvas(mkCanvas(64, 64, (g, w, h) => { g.clearRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,1)'; g.fillRect(0, 0, w, h); g.strokeStyle = '#ffffff'; g.lineWidth = 2; for (let i = 0; i <= 64; i += 16) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, h); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(w, i); g.stroke(); } }), true);
  T5.score = texFromCanvas(mkCanvas(256, 96, (g, w, h) => { g.fillStyle = '#05070a'; g.fillRect(0, 0, w, h); txt(g, '2', 40, 50, 56, '#ffd23a', 'center'); txt(g, '1', w - 40, 50, 56, '#ffd23a', 'center'); txt(g, "78'", w / 2, 50, 40, '#ffffff', 'center'); }));
  T5.tv = texFromCanvas(mkCanvas(256, 144, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#3a8ad0'); gr.addColorStop(1, '#2ac0a0'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.arc(70, 72, 34, 0, 7); g.fill(); g.fillRect(124, 50, 100, 12); g.fillRect(124, 74, 80, 8); g.fillRect(124, 90, 90, 8); g.fillStyle = '#c03030'; g.fillRect(0, h - 20, w, 20); }));
  T5.sky = texFromCanvas(mkCanvas(128, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#1a2a5a'); gr.addColorStop(1, '#4a5a8a'); g.fillStyle = gr; g.fillRect(0, 0, w, h); g.fillStyle = '#fff6dc'; g.beginPath(); g.arc(88, 36, 13, 0, 7); g.fill(); g.fillStyle = '#1e2e5e'; g.beginPath(); g.arc(94, 32, 12, 0, 7); g.fill(); g.fillStyle = '#ffffff'; const r = rnd(4); for (let i = 0; i < 30; i++) g.fillRect(r() * w, r() * h * 0.7, 1.5, 1.5); }));
  T5.lattice = texFromCanvas(mkCanvas(64, 64, (g, w, h) => { g.fillStyle = '#000'; g.fillRect(0, 0, w, h); g.strokeStyle = '#fff'; g.lineWidth = 5; g.strokeRect(2, 2, w - 4, h - 4); g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.stroke(); }), true);
  T5.stripe = texFromCanvas(mkCanvas(64, 16, (g, w, h) => { g.fillStyle = '#f2f2f2'; g.fillRect(0, 0, w, h); g.fillStyle = '#d83020'; for (let x = -16; x < w; x += 16) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 8, 0); g.lineTo(x + 16, 0); g.lineTo(x + 8, h); g.fill(); } }), true);
  T5.poster = texFromCanvas(mkCanvas(128, 160, (g, w, h) => { g.fillStyle = '#f4f8fa'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a8a7a'; g.fillRect(0, 0, w, 30); g.fillStyle = '#c84a4a'; g.beginPath(); g.arc(64, 78, 26, 0, 7); g.fill(); g.fillStyle = '#9aa4aa'; for (let i = 0; i < 4; i++) g.fillRect(16, 116 + i * 10, 96 - i * 14, 5); }));
}
// LED counter / paper ticket textures (cached per text)
function t5Led(s) { const k = 'L' + s; if (!T5TICK[k]) T5TICK[k] = texFromCanvas(mkCanvas(256, 96, (g, w, h) => { g.fillStyle = '#080404'; g.fillRect(0, 0, w, h); txt(g, s, w / 2, h / 2 + 2, 66, '#ff3a2a', 'center', 600); })); return T5TICK[k]; }
function t5Ticket(s) { const k = 'T' + s; if (!T5TICK[k]) T5TICK[k] = texFromCanvas(mkCanvas(128, 192, (g, w, h) => { g.fillStyle = '#fbfaf4'; g.fillRect(0, 0, w, h); g.fillStyle = '#8a929c'; g.fillRect(20, 18, 88, 8); txt(g, s, w / 2, 86, 44, '#15181e', 'center', 600); for (let i = 0; i < 3; i++) g.fillRect(24, 130 + i * 14, 80 - i * 18, 5); })); return T5TICK[k]; }
// pointed arch (two columns + two slanted boxes + spandrel wall) in the XY plane at z, or rotated by yaw
function t5Arch(objs, M, w, h, col, colDark) {
  for (const sx of [-1, 1]) objs.push(G(M, M4.trs([sx * w / 2, h / 2, 0], [0, 0, 0], [0.32, h, 0.32]), 'cyl', col), G(M, M4.trs([sx * w / 2, h + 0.1, 0], [0, 0, 0], [0.48, 0.2, 0.48]), 'box', col));
  const L = Math.hypot(w / 2, w * 0.45);
  for (const sx of [-1, 1]) objs.push(G(M, M4.trs([sx * w / 4, h + 0.2 + w * 0.225, 0], [0, 0, -sx * Math.atan2(w * 0.45, w / 2)], [L, 0.22, 0.42]), 'box', colDark || col));
  objs.push(G(M, M4.trs([0, h + 0.2 + w * 0.45 + 0.5, 0], [0, 0, 0], [w + 0.5, 1.0, 0.4]), 'box', col));
}
function t5Helmet(objs, x, z, yaw, col, y0) { y0 = y0 || 0; objs.push(O('sph', [x, 1.93 + y0, z], [0, yaw, 0], [0.46, 0.3, 0.46], C(col || '#f0c020')), O('box', [x + Math.sin(yaw) * 0.2, 1.86 + y0, z + Math.cos(yaw) * 0.2], [0, yaw, 0], [0.46, 0.03, 0.14], C(col || '#f0c020'))); }

// ---------- MOSQUE COURTYARD (fountain, arcades, pigeons) ----------
function sceneCourtyard(t, dur, o) {
  ensureT5(); o = o || {}; const objs = []; const tm = o.time || 'dawn'; const night = tm === 'night', day = tm === 'day';
  const walk = o.walk !== false; const camZ = 5 - t * (walk ? 0.45 : 0);
  objs.push(B([0, -0.05, -8], [22, 0.1, 34], [1, 1, 1], { tex: T5.marble, uvr: [0, 0, 11, 17] }));
  const stone = C('#e8dcc4'), stoneD = C('#d4c4a6');
  // arcades on both sides
  for (const sd of [-1, 1]) {
    objs.push(B([sd * 10.8, 3, -8], [0.4, 6, 34], C('#e4d6bc'), { tex: T.plaster }));
    objs.push(B([sd * 9.6, 5.3, -8], [2.6, 0.2, 34], stoneD));
    objs.push(B([sd * 9.6, 0.02, -8], [2.6, 0.04, 34], C('#cfc4b0')));
    for (let z = 7; z > -22; z -= 3) {
      t5Arch(objs, M4.trs([sd * 8.4, 0, z], [0, PI / 2, 0]), 2.6, 2.6, stone, stoneD);
      if (!day) { objs.push(O('box', [sd * 9.6, 3.6, z + 1.5], [0, 0, 0], [0.22, 0.32, 0.22], C('#ffc870', 5), { mode: 1, noShadow: true }), O('plane', [sd * 9.4, 3.6, z + 1.5], [0, -sd * PI / 2, 0], [1.6, 1.6, 1], C('#ffb860', 0.25), { additive: true, mode: 3, tex: T.glow, noShadow: true })); }
    }
  }
  // prayer hall facade + dome + minaret
  const HZ = -22;
  objs.push(B([0, 4, HZ], [22, 8, 1], C('#eadcc2'), { tex: T.plaster }));
  t5Arch(objs, M4.trs([0, 0, HZ + 0.6]), 4, 4.2, stone, stoneD);
  objs.push(B([0, 2.2, HZ + 0.52], [3.6, 4.4, 0.05], C('#ffd890', night ? 3.5 : 2.2), { mode: 1 }));
  objs.push(O('plane', [0, 2.6, HZ + 0.7], [0, 0, 0], [8, 7, 1], C('#ffc070', night ? 0.35 : 0.18), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  for (const sx of [-6, -3.5, 3.5, 6]) { objs.push(B([sx, 3.2, HZ + 0.52], [1.0, 1.8, 0.05], C('#ffd890', night ? 2.5 : 1.0), { mode: 1 })); objs.push(O('sph', [sx, 4.1, HZ + 0.52], [0, 0, 0], [1.0, 0.9, 0.06], C('#ffd890', night ? 2.5 : 1.0), { mode: 1 })); }
  objs.push(O('sph', [0, 8.2, HZ - 5], [0, 0, 0], [11, 10, 11], C('#2f7a6a')), O('cyl', [0, 7.8, HZ - 5], [0, 0, 0], [11.4, 1.2, 11.4], C('#e4d6bc')), O('cyl', [0, 13.6, HZ - 5], [0, 0, 0], [0.12, 1.4, 0.12], C('#d8b040')), O('sph', [0, 14.4, HZ - 5], [0, 0, 0], [0.4, 0.4, 0.4], C('#d8b040')));
  objs.push(O('cyl', [7.5, 10, HZ - 2], [0, 0, 0], [1.7, 20, 1.7], C('#ece0c8')), O('cyl', [7.5, 15.5, HZ - 2], [0, 0, 0], [2.6, 0.4, 2.6], C('#e0d2b6')), O('cyl', [7.5, 16.6, HZ - 2], [0, 0, 0], [1.4, 2, 1.4], C('#ece0c8')), O('cone', [7.5, 19.6, HZ - 2], [0, 0, 0], [1.6, 4, 1.6], C('#2f7a6a')));
  objs.push(O('cyl', [7.5, 15.85, HZ - 2], [0, 0, 0], [2.0, 0.25, 2.0], C('#9affc0', night ? 4 : (day ? 0.3 : 2)), { mode: 1 }));
  // fountain
  const FZ = -6;
  objs.push(O('cyl6', [0, 0.3, FZ], [0, 0, 0], [5.2, 0.6, 5.2], C('#d8ccb4')));
  objs.push(O('cyl6', [0, 0.6, FZ], [0, 0, 0], [4.7, 0.04, 4.7], C(night ? '#1a4a6a' : '#2a7a9a', 1.0), { tex: T5.water, uvr: [t * 0.03, t * 0.02, 3, 3] }));
  objs.push(O('cyl', [0, 0.95, FZ], [0, 0, 0], [0.5, 0.8, 0.5], C('#d8ccb4')), O('cyl', [0, 1.4, FZ], [0, 0, 0], [1.4, 0.18, 1.4], C('#d8ccb4')), O('cyl', [0, 1.6, FZ], [0, 0, 0], [0.18, 0.4, 0.18], C('#d8ccb4')));
  for (let i = 0; i < 40; i++) { const k = mod(t * 0.9 + i / 40, 1), a = i * 2.399; const rr = 0.1 + k * 1.1; objs.push(O('sph', [Math.cos(a) * rr, 1.85 + k * 0.9 - k * k * 2.2, FZ + Math.sin(a) * rr], [0, 0, 0], [0.035, 0.06, 0.035], C('#e0f4ff', 1.8), { mode: 1, noShadow: true })); }
  for (let i = 0; i < 6; i++) { const k = mod(t * 0.4 + i / 6, 1); objs.push(O('plane', [0, 0.63, FZ], [-PI / 2, 0, 0], [0.8 + k * 3.4, 0.8 + k * 3.4, 1], C('#ffffff', 0.12 * (1 - k)), { additive: true, mode: 3, tex: T.glow, noShadow: true })); }
  // taps around the fountain + a man making wudu
  for (let i = 0; i < 8; i++) { const a = i * PI / 4 + PI / 8; objs.push(O('cyl', [Math.cos(a) * 2.75, 0.75, FZ + Math.sin(a) * 2.75], [0, 0, 0], [0.06, 0.25, 0.06], C('#c8a850'))); }
  objs.push(...person(M4.trs([-2.4, -0.05, FZ + 2.2], [0, PI + 0.9, 0]), { skin: '#8d5a3b', shirt: '#f2efe8', pants: '#f2efe8', sit: true, hair: '#1a1a1a', armL: 1.1, armR: 1.1 + Math.sin(t * 2) * 0.2, face: 'flat' }));
  // people walking towards the hall
  const r = rnd(9);
  for (let i = 0; i < 5; i++) { const x = [-4.2, 3.6, -1.5, 4.8, -5.2][i], z = 3 - mod(i * 5 + t * 1.1, 24); objs.push(...person(M4.trs([x, 0, z], [0, PI, 0]), { skin: SKINS[i % 5], shirt: MEN[i % MEN.length], pants: MEN[(i + 2) % MEN.length], walk: 1, phase: t * 4 + i, hair: '#222', face: 'flat' })); }
  // pigeons: some on the ground pecking, some circling
  for (let i = 0; i < 14; i++) {
    const x = (r() - 0.5) * 8, z = camZ - 3 - r() * 9, pk = Math.max(0, Math.sin(t * 5 + i * 1.7)) * 0.3, yaw = r() * 6;
    const PM = M4.trs([x, 0, z], [0, yaw, 0]);
    objs.push(G(PM, M4.trs([0, 0.12, 0], [0, 0, 0], [0.13, 0.12, 0.22]), 'sph', C('#8a8e98')), G(PM, M4.trs([0, 0.2 - pk * 0.25, 0.11], [pk, 0, 0], [0.08, 0.08, 0.08]), 'sph', C('#6a7080')));
  }
  for (let i = 0; i < 8; i++) { const a = t * 0.7 + i * 0.8, rr = 6 + (i % 3); const x = Math.cos(a) * rr, z = -8 + Math.sin(a) * rr * 0.6, y = 7 + Math.sin(a * 2 + i) * 1.2; const fl = Math.sin(t * 14 + i) * 0.7;
    const PM = M4.trs([x, y, z], [0, -a, 0]); objs.push(G(PM, M4.trs([0, 0, 0], [0, 0, 0], [0.12, 0.12, 0.26]), 'sph', C('#7a7e88')), G(PM, M4.trs([0.18, 0, 0], [0, 0, fl], [0.32, 0.02, 0.14]), 'box', C('#9aa0aa')), G(PM, M4.trs([-0.18, 0, 0], [0, 0, -fl], [0.32, 0.02, 0.14]), 'box', C('#9aa0aa'))); }
  const bob = walk ? Math.sin(t * 4.4) * 0.022 : 0;
  const cam = { pos: [0.6, 1.62 + bob, camZ], target: [Math.sin(t * 0.25) * 0.6, lerp(2.4, 3.4, sstep(0, dur, t)), HZ], up: [0, 1, 0], fov: 68, far: 400 };
  if (night) { skyStars(objs, cam, t); skyMoon(objs, cam, [-0.4, 0.5, -1], C('#0a1030')); }
  objs.push(skyDome(cam));
  const top = night ? C('#070b20') : day ? C('#3a78c8') : C('#3a4680'), hor = night ? C('#1c2448') : day ? C('#cfe0ee') : C('#f0a888');
  const pls = [{ p: [0, 2.4, HZ + 2], c: C('#ffc884', night ? 3 : 1.4), r: 10 }];
  if (!day) for (let z = 4; z > -20; z -= 6) for (const sd of [-1, 1]) if (pls.length < 9) pls.push({ p: [sd * 9.4, 3.4, z], c: C('#ffc890', night ? 1.6 : 0.8), r: 6 });
  return {
    objs, cam, sun: { dir: day ? norm([-0.5, -0.75, -0.4]) : night ? [0, -1, 0] : norm([-0.7, -0.22, 0.5]), col: day ? C('#fff2d8', 2.6) : night ? [0, 0, 0] : C('#ffb890', 1.4), center: [0, 0, camZ - 7], ext: 16, on: !night },
    hemi: { sky: C(night ? '#405080' : day ? '#c8d8f0' : '#a8a0c8', night ? 0.35 : 0.6), gnd: C('#a09070', 0.3) },
    pls, sky: { top, hor, gnd: hor }, fog: { col: hor, d: 0.006, start: 25 }, clear: hor,
    post: { exposure: night ? 1.15 : 1.0, bloom: 0.75, th: 0.95, vig: 0.45, warm: day ? 0.25 : night ? 0.1 : 0.4, fade: fadeIO(t, dur) },
  };
}

// ---------- MOUNTAIN SUMMIT AT SUNRISE (sea of clouds, prayer mat) ----------
function sceneMountain(t, dur, o) {
  ensureT5(); o = o || {}; const objs = []; const k = clamp(t / dur, 0, 1); const walk = o.walk !== false;
  const camZ = 4 - (walk ? sstep(0, dur * 0.7, t) * 3.2 : 0);
  // summit plateau and rocks
  objs.push(O('sph', [0, -3.1, -1], [0, 0.4, 0], [16, 6.4, 18], C('#9a9264'), { tex: T5.grass, uvr: [0, 0, 6, 6] }));
  const r = rnd(13);
  for (let i = 0; i < 26; i++) { const a = r() * PI * 2, d = 4.5 + r() * 4; const s = 0.3 + r() * 0.7; objs.push(O('sph', [Math.cos(a) * d * 1.1, -0.2 + r() * 0.3, -1 + Math.sin(a) * d], [r(), r() * 3, r()], [s * 1.4, s, s * 1.2], C(['#a8988a', '#8e8274', '#b4a898'][i % 3]))); }
  for (let i = 0; i < 60; i++) { const x = (r() - 0.5) * 9, z = 2 - r() * 9; objs.push(O('cone', [x, 0.05, z], [0, r() * 3, (r() - 0.5) * 0.4], [0.12, 0.22 + r() * 0.2, 0.12], C(['#8a8a4a', '#a09a5a', '#6a7a3a'][i % 3]), { noShadow: true })); }
  // cairn
  for (let i = 0; i < 5; i++) objs.push(O('sph', [-2.6, 0.12 + i * 0.22, -3.4], [0, i, 0], [0.6 - i * 0.09, 0.24, 0.5 - i * 0.07], C('#8a8070')));
  // prayer mat facing the sunrise
  if (o.mat !== false) objs.push(O('box', [0.4, 0.06, -4.2], [0, 0, 0], [0.75, 0.02, 1.25], [1, 1, 1], { tex: T.rug }));
  // distant peaks poking out of the clouds
  for (let i = 0; i < 12; i++) { const x = -200 + i * 38 + r() * 20, z = -120 - r() * 140, h = 30 + r() * 50, w = 30 + r() * 30; objs.push(O('cone', [x, -40 + h / 2, z], [0, r() * 3, 0], [w, h, w], C('#5a6078'))); objs.push(O('cone', [x, -40 + h * 0.83, z], [0, 0, 0], [w * 0.36, h * 0.34, w * 0.36], C('#f4f0f0'))); }
  // sea of clouds (drifting)
  for (let i = 0; i < 90; i++) { const x = (r() - 0.5) * 420 + t * 0.6, z = -20 - r() * 300, s = 14 + r() * 26; objs.push(O('sph', [x, -24 - r() * 6, z], [0, r() * 3, 0], [s * 1.8, s * 0.35, s], lerp3(C('#e8c8c8'), C('#fff0e0'), k), { noShadow: true })); }
  // sun rising
  const sunY = lerp(-0.02, 0.09, k); const sunDir = norm([0.15, sunY, -1]); const sp = add([0, 0, camZ], scl(sunDir, 420));
  objs.push(O('sph', sp, [0, 0, 0], [16, 16, 16], C('#fff2d0', 6), { mode: 1, noShadow: true }));
  objs.push(O('plane', add([0, 0, camZ], scl(sunDir, 440)), dirRot(scl(sunDir, -1)), [190, 120, 1], C('#ffb070', 0.5), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  // birds
  for (let i = 0; i < 5; i++) { const a = t * 0.15 + i * 0.5; const PM = M4.trs([-20 + mod(t * 2 + i * 9, 50), 8 + Math.sin(a * 3) * 2, -40 - i * 6], [0, PI / 2, 0]); const fl = Math.sin(t * 9 + i) * 0.6; objs.push(G(PM, M4.trs([0.4, 0, 0], [0, 0, fl], [0.8, 0.03, 0.2]), 'box', C('#202028')), G(PM, M4.trs([-0.4, 0, 0], [0, 0, -fl], [0.8, 0.03, 0.2]), 'box', C('#202028'))); }
  const bob = walk ? Math.sin(t * 4) * 0.02 * (1 - sstep(dur * 0.6, dur * 0.7, t)) : 0;
  const cam = { pos: [0.4, 1.62 + bob, camZ], target: [0.6, lerp(-0.2, 1.4, sstep(0, dur * 0.8, t)), camZ - 20], up: [0, 1, 0], fov: 66, far: 800 };
  objs.push(skyDome(cam));
  const top = lerp3(C('#2a3270'), C('#4a6ab0'), k), hor = lerp3(C('#f08a6a'), C('#ffc890'), k);
  return {
    objs, cam, sun: { dir: norm([-0.15, -Math.max(0.12, sunY + 0.1), 1]), col: C('#ffb27a', 2.2), center: [0, 0, camZ - 3], ext: 12 },
    hemi: { sky: C('#b0b0e0', 0.8), gnd: C('#c09080', 0.45) },
    pls: [], sky: { top, hor, gnd: C('#f0d8d0') }, fog: { col: hor, d: 0.0025, start: 60 }, clear: hor,
    post: { exposure: 1.0, bloom: 0.9, th: 0.95, vig: 0.4, warm: 0.45, sat: 1.05, fade: fadeIO(t, dur) },
  };
}

// ---------- CEMETERY BY DAY (visit, simple graves, cypress, dua hands) ----------
function sceneCemetery(t, dur, o) {
  ensureT5(); o = o || {}; const objs = []; const gold = o.time === 'golden';
  objs.push(B([0, -0.05, -20], [80, 0.1, 80], C('#7a9a4a'), { tex: T5.grass, uvr: [0, 0, 30, 30] }));
  objs.push(B([1.2, 0.0, -20], [1.0, 0.02, 60], C('#c8b898'), { tex: T.dirt, uvr: [0, 0, 1, 20] }));
  const r = rnd(33);
  // rows of graves (low curb + headstone)
  for (let row = 0; row < 7; row++) for (let c = 0; c < 6; c++) {
    const sd = c < 3 ? -1 : 1, x = sd * (1.8 + (c % 3) * 1.5), z = -4 - row * 3.2 + (r() - 0.5) * 0.3;
    if (row === 0 && c === 2) continue;
    const st = ['#d8d4cc', '#c8c4bc', '#e4e0d8', '#b8b4ac'][(r() * 4) | 0];
    objs.push(B([x, 0.08, z], [0.9, 0.16, 2.0], C(st)), B([x, 0.1, z], [0.7, 0.16, 1.8], C(r() < 0.5 ? '#6a5a44' : '#5a7a3a'), { tex: T.dirt, uvr: [0, 0, 0.5, 1] }));
    objs.push(B([x, 0.45, z - 1.0], [0.55, 0.7, 0.1], C(st)), O('cyl', [x, 0.8, z - 1.0], [PI / 2, 0, 0], [0.55, 0.1, 0.3], C(st)));
    if (r() < 0.35) for (let j = 0; j < 3; j++) objs.push(O('cone', [x - 0.2 + j * 0.2, 0.3, z + 0.3], [0, j, 0], [0.12, 0.3, 0.12], C('#4a7a3a')));
  }
  // the fresh grave in front of the camera
  objs.push(B([0, 0.06, -2.2], [1.0, 0.12, 2.1], C('#d8d4cc')), O('sph', [0, 0.1, -2.2], [0, 0, 0], [0.82, 0.2, 1.9], C('#8a6a4a')));
  objs.push(B([0, 0.4, -3.3], [0.45, 0.8, 0.1], C('#dcd8d0')), O('cyl', [0, 0.8, -3.3], [PI / 2, 0, 0], [0.45, 0.1, 0.24], C('#dcd8d0')));
  objs.push(O('cyl', [0.75, 0.15, -1.5], [0, 0, 0], [0.22, 0.3, 0.22], C('#3a6a8a')), O('cyl', [0.75, 0.3, -1.38], [0.9, 0, 0], [0.05, 0.25, 0.05], C('#3a6a8a')));
  for (let j = 0; j < 4; j++) objs.push(O('cone', [-0.2 + j * 0.13, 0.25, -1.6 - j * 0.2], [0, j, 0.1], [0.1, 0.22, 0.1], C('#5a8a3a')));
  // cypress + olive trees, wall
  for (let i = 0; i < 14; i++) { const sd = i % 2 ? 1 : -1, x = sd * (7 + r() * 3), z = 2 - i * 3.4, h = 5 + r() * 3; objs.push(O('cyl', [x, 0.5, z], [0, 0, 0], [0.25, 1, 0.25], C('#4a3424')), O('cone', [x, h / 2 + 0.6, z], [0, 0, 0], [1.3, h, 1.3], C('#2a4a2a'))); }
  for (const [x, z] of [[-4.5, -9], [4.2, -16], [-3.8, -22]]) { objs.push(O('cyl', [x, 0.8, z], [0, 0, 0.1], [0.3, 1.6, 0.3], C('#5a4a3a')), O('sph', [x, 2.2, z], [0, 0, 0], [3.2, 1.8, 3.2], C('#7a8a5a')), O('sph', [x + 0.6, 2.6, z + 0.4], [0, 0, 0], [1.8, 1.2, 1.8], C('#8a9a6a'))); }
  objs.push(B([0, 0.8, -32], [40, 1.6, 0.4], C('#d8cbb0'), { tex: T.plaster }), B([0, 1.65, -32], [40, 0.1, 0.5], C('#bcae90')));
  // a far visitor and birds
  objs.push(...person(M4.trs([-3.3, 0, -14], [0, 0.2, 0]), { skin: '#c68e62', shirt: '#2d3a55', pants: '#2d2d33', hijab: '#e8e2d4', armL: 0.9, armR: 0.9, face: 'flat' }));
  for (let i = 0; i < 4; i++) { const PM = M4.trs([-15 + mod(t * 1.6 + i * 7, 30), 9 + Math.sin(t + i) * 1, -26 - i * 3], [0, PI / 2, 0]); const fl = Math.sin(t * 8 + i) * 0.6; objs.push(G(PM, M4.trs([0.25, 0, 0], [0, 0, fl], [0.5, 0.02, 0.14]), 'box', C('#2a2a30')), G(PM, M4.trs([-0.25, 0, 0], [0, 0, -fl], [0.5, 0.02, 0.14]), 'box', C('#2a2a30'))); }
  // leaves drifting
  for (let i = 0; i < 30; i++) { const k = mod(t * 0.12 + i / 30, 1); objs.push(O('box', [(r() - 0.5) * 8 + Math.sin(t + i) * 0.5, 4 - k * 4, -1 - r() * 10], [t + i, i, t * 1.5], [0.07, 0.006, 0.05], C(['#a8a040', '#c88a30', '#8a9a40'][i % 3]), { noShadow: true })); }
  const k = clamp(t / dur, 0, 1);
  const cam = { pos: [0.1 + Math.sin(t * 0.3) * 0.03, 1.6, lerp(0.4, 0.1, k)], target: [0, lerp(0.55, 0.75, k), -7], up: [0, 1, 0], fov: 64, far: 300 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const du = sstep(dur * (o.dua != null ? o.dua : 0.4), dur * (o.dua != null ? o.dua : 0.4) + 1.5, t);
  if (o.dua !== false && du > 0) for (const sx of [-1, 1]) objs.push(...povArm(CW, [sx * 0.2, -0.8, -0.05], [sx * 0.07, lerp(-0.7, -0.255, du), -0.5], C('#5a6a7a'), POV_SKIN(), [-1.0, sx * 0.3, sx * 0.25]));
  objs.push(skyDome(cam));
  return {
    objs, cam, sun: { dir: gold ? norm([0.6, -0.25, -0.6]) : norm([0.4, -0.75, -0.35]), col: C(gold ? '#ffb070' : '#fff4e0', gold ? 2.2 : 2.6), center: [0, 0, -6], ext: 14 },
    hemi: { sky: C(gold ? '#f0c8a0' : '#c8d8f0', 0.6), gnd: C('#607040', 0.3) }, pls: [],
    sky: { top: C(gold ? '#5a6aa0' : '#6aa0dc'), hor: C(gold ? '#ffc890' : '#e4ecf0'), gnd: C('#6a8a4a') }, fog: { col: C(gold ? '#f0c8a0' : '#dfe8ec'), d: 0.02, start: 14 }, clear: C('#dfe6ea'),
    post: { exposure: 1.0, bloom: 0.5, th: 1.1, vig: 0.4, warm: gold ? 0.5 : 0.15, sat: 0.95, fade: fadeIO(t, dur) },
  };
}

// ---------- WAITING ROOM (number display, ticket in hand) ----------
function sceneWaitingRoom(t, dur, o) {
  ensureT5(); o = o || {}; const objs = [];
  const tick = o.ticket || 'A052'; const call = o.call != null ? o.call : 0.7; const called = t > dur * call;
  const num = called ? tick : (o.now || 'A047');
  room(objs, 7, 8, 3.0, C('#d6e4e6'), T3.tiles, C('#c8d2d4'));
  for (let z = -1; z > -7; z -= 2) objs.push(B([0, 2.94, z], [1.2, 0.03, 0.6], C('#f4f8ff', 2.4), { mode: 1, noShadow: true }));
  // display + TV + clock on the front wall
  const fw = -6.92;
  objs.push(B([-1.2, 2.3, fw], [1.6, 0.62, 0.1], C('#222')), O('plane', [-1.2, 2.3, fw + 0.06], [0, 0, 0], [1.5, 0.55, 1], [1.6, 1.6, 1.6], { mode: 1, tex: t5Led(num), noShadow: true }));
  const flash = called ? Math.max(0, Math.sin((t - dur * call) * 9)) * (1 - sstep(dur * call, dur * call + 2, t)) : 0;
  objs.push(O('plane', [-1.2, 2.3, fw + 0.1], [0, 0, 0], [2.6, 1.4, 1], C('#ff4030', 0.12 + flash * 0.3), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  objs.push(B([1.6, 2.1, fw], [1.5, 0.88, 0.08], C('#151515')), O('plane', [1.6, 2.1, fw + 0.05], [0, 0, 0], [1.4, 0.8, 1], [1.3, 1.3, 1.3], { mode: 1, tex: T5.tv, uvr: [0, 0, 1, 1], noShadow: true }));
  objs.push(O('cyl', [3.0, 2.5, fw + 0.05], [PI / 2, 0, 0], [0.5, 0.05, 0.5], C('#f8f8f8')), O('plane', [3.0, 2.5, fw + 0.09], [0, 0, 0], [0.46, 0.46, 1], [1, 1, 1], { tex: T4.clock, noShadow: true }));
  for (const [len, sp, w] of [[0.15, 1 / 3600, 0.025], [0.2, 1 / 60, 0.018]]) { const a = 2 * PI * ((0.42 + t * sp) % 1); objs.push(O('box', [3.0 + Math.sin(a) * len / 2, 2.5 + Math.cos(a) * len / 2, fw + 0.1], [0, 0, -a], [w, len, 0.01], C('#222'))); }
  objs.push(O('plane', [-3.0, 1.6, fw + 0.06], [0, 0, 0], [0.6, 0.75, 1], [1, 1, 1], { tex: T5.poster, noShadow: true }));
  // reception counter on the side
  objs.push(B([2.6, 0.55, -5.2], [1.6, 1.1, 0.6], C('#e8e4dc')), B([2.6, 1.12, -5.2], [1.7, 0.05, 0.7], C('#7a6a5a')));
  objs.push(...person(M4.trs([2.6, 0, -5.9], [0, 0, 0]), { skin: '#c68e62', shirt: '#f2f6f8', pants: '#2d3a55', hijab: '#2a6a8a', sit: true, face: 'flat' }));
  objs.push(B([2.4, 1.3, -5.5], [0.5, 0.32, 0.03], C('#1a1c22')));
  // window with blinds, plant
  objs.push(O('plane', [-3.43, 1.7, -3.2], [0, PI / 2, 0], [1.8, 1.3, 1], [1.3, 1.3, 1.3], { mode: 1, tex: T3.blinds, noShadow: true }));
  objs.push(O('cyl', [-3.0, 0.25, -6.3], [0, 0, 0], [0.4, 0.5, 0.4], C('#e8e4dc')));
  for (let i = 0; i < 7; i++) objs.push(O('cone', [-3.0 + Math.sin(i * 2.4) * 0.1, 0.85, -6.3 + Math.cos(i * 2.4) * 0.1], [Math.sin(i * 2.4) * 0.4, 0, Math.cos(i * 2.4) * 0.4], [0.18, 0.9, 0.06], C('#3a7a3a')));
  // chairs in rows facing the display
  const r = rnd(19);
  const seated = [[-2.4, -4.4, 0], [-0.4, -4.4, 1], [1.0, -4.4, 2], [-1.8, -2.6, 3], [1.4, -2.6, 4]];
  for (const z of [-4.4, -2.6]) for (let x = -2.8; x <= 1.9; x += 0.6) objs.push(B([x, 0.45, z], [0.52, 0.07, 0.48], C('#3a7a9a')), B([x, 0.7, z + 0.24], [0.52, 0.42, 0.05], C('#3a7a9a')));
  for (const z of [-4.4, -2.6]) objs.push(B([-0.45, 0.22, z], [5.0, 0.05, 0.1], C('#9aa0a8')));
  for (const [x, z, i] of seated) objs.push(...person(M4.trs([x, 0, z], [0, PI, 0]), { skin: SKINS[i], shirt: ['#7a3d4d', '#556b2f', '#2d3a55', '#c9b9a7', '#6a6a6a'][i], pants: '#2d2d33', sit: true, hijab: i === 1 || i === 3 ? ['#d9cfc0', '#4a3a5a'][i === 1 ? 0 : 1] : null, hair: i === 4 ? '#cfcfcf' : '#2a1f1a', armL: 1.3, armR: i === 2 ? 1.6 : 1.3, headYaw: Math.sin(t * 0.4 + i) * 0.2, face: 'flat' }));
  // camera seated in the last row
  const look = called ? sstep(dur * call, dur * call + 0.8, t) : 0;
  const cam = { pos: [-0.4, 1.25, 0.2], target: [lerp(-0.2, -1.2, look), lerp(1.1, 2.0, look) + Math.sin(t * 0.3) * 0.05, -6.9], up: [0, 1, 0], fov: 64 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const TP = M4.mul(CW, M4.trs([0.02, -0.27 - look * 0.06, -0.5], [-0.45, 0.1, -0.05]));
  objs.push(G(TP, M4.trs([0, 0, 0], [0, 0, 0], [0.08, 0.12, 0.002]), 'box', [1.15, 1.15, 1.15], { tex: t5Ticket(tick) }));
  objs.push(...povArm(CW, [-0.28, -0.66, 0.05], [-0.05, -0.33 - look * 0.06, -0.5], POV_SLEEVE(), POV_SKIN()), ...povArm(CW, [0.3, -0.66, 0.05], [0.09, -0.34 - look * 0.06, -0.5], POV_SLEEVE(), POV_SKIN()));
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C('#e0ecf0', 0.65), gnd: C('#909890', 0.3) },
    pls: [{ p: [-0.5, 2.8, -2], c: C('#f4f8ff', 1.4), r: 6 }, { p: [0, 2.8, -5], c: C('#f4f8ff', 1.0), r: 5 }, { p: [-1.2, 2.3, -6.4], c: C('#ff4030', 0.3 + flash), r: 2.5 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.6, th: 0.95, vig: 0.45, warm: 0.05, sat: 0.92, fade: fadeIO(t, dur) },
  };
}

// ---------- CHILD'S ROOM AT NIGHT (star night-light, sleeping child) ----------
function sceneKidsRoom(t, dur, o) {
  ensureT5(); o = o || {}; const objs = [];
  room(objs, 4.2, 4.4, 2.6, C('#b8c8e0'), T.wood, C('#b08a64'));
  // window with moon + curtains
  objs.push(O('plane', [-0.4, 1.6, -3.33], [0, 0, 0], [1.1, 1.0, 1], [1.1, 1.1, 1.1], { mode: 1, tex: T5.sky, noShadow: true }));
  objs.push(B([-0.4, 1.6, -3.32], [1.18, 0.05, 0.04], C('#e8e8f0')), B([-0.4, 1.6, -3.32], [0.05, 1.08, 0.04], C('#e8e8f0')));
  for (const sx of [-1, 1]) objs.push(B([-0.4 + sx * 0.75, 1.5, -3.26], [0.4, 1.6, 0.04], C('#f4e2b8'), { tex: T.fabric }));
  // child's bed against the right wall
  const BX = 1.2, BZ = -2.0;
  objs.push(B([BX, 0.25, BZ], [1.0, 0.3, 1.9], C('#f4f0e8')), B([BX, 0.12, BZ], [1.08, 0.22, 1.98], C('#e8d0a8')), B([BX, 0.6, BZ - 1.0], [1.1, 0.8, 0.08], C('#e8d0a8')));
  objs.push(B([BX, 0.46, BZ - 0.72], [0.7, 0.12, 0.38], C('#ffffff')));
  const breath = 1 + Math.sin(t * 1.8) * 0.03;
  const tuckK = sstep(dur * (o.tuck != null ? o.tuck : 0.4), dur * (o.tuck != null ? o.tuck : 0.4) + 2.2, t);
  objs.push(O('sph', [BX - 0.05, 0.47, BZ + 0.05], [0, 0, 0], [0.62, 0.22 * breath, 1.2], C('#5a8ad0'), { tex: T.fabric }));
  objs.push(B([BX, 0.43, BZ + lerp(0.15, -0.05, tuckK)], [0.92, 0.1, lerp(1.45, 1.2, tuckK)], C('#6a9ae0'), { tex: T.fabric }));
  objs.push(B([BX, 0.49, BZ + lerp(-0.56, -0.62, tuckK)], [0.92, 0.04, 0.1], C('#f0f0f8')));
  // child's head (turned towards the wall, hair visible)
  objs.push(O('sph', [BX - 0.02, 0.6, BZ - 0.72], [0, 0, 0.3], [0.24, 0.24, 0.26], C('#c08a62')), O('sph', [BX + 0.06, 0.64, BZ - 0.76], [0, 0, 0.3], [0.24, 0.23, 0.27], C('#4a3020')));
  // teddy, toys, nightstand + star projector
  objs.push(O('sph', [BX - 0.32, 0.55, BZ - 0.5], [0, 0, 0], [0.2, 0.22, 0.18], C('#a87a4a')), O('sph', [BX - 0.32, 0.72, BZ - 0.52], [0, 0, 0], [0.15, 0.15, 0.15], C('#a87a4a')));
  for (const sx of [-1, 1]) objs.push(O('sph', [BX - 0.32 + sx * 0.06, 0.8, BZ - 0.52], [0, 0, 0], [0.05, 0.05, 0.05], C('#8a5a3a')));
  for (const [x, z, c] of [[-0.6, -0.9, '#d84a3a'], [-0.42, -0.95, '#3a7ad9'], [-0.52, -0.8, '#f0c030'], [-0.5, -0.88, '#3aa05a']]) objs.push(O('box', [x, 0.06 + (c === '#3aa05a' ? 0.12 : 0), z], [0, x * 4, 0], [0.12, 0.12, 0.12], C(c)));
  objs.push(B([-0.5, 0.01, -1.2], [1.4, 0.02, 1.0], C('#e8d8f0'), { tex: T.rug }));
  objs.push(B([BX - 0.15, 0.25, BZ - 1.35], [0.5, 0.5, 0.4], C('#f0e8dc')));
  const PJ = [BX - 0.15, 0.6, BZ - 1.35];
  objs.push(O('cyl', [PJ[0], 0.52, PJ[2]], [0, 0, 0], [0.18, 0.04, 0.18], C('#f0f0f0')), O('sph', PJ, [0, 0, 0], [0.16, 0.14, 0.16], C('#ffd890', 3), { mode: 1, noShadow: true }));
  objs.push(O('plane', [PJ[0], PJ[1], PJ[2] + 0.1], [0, 0, 0], [1.2, 1.2, 1], C('#ffc070', 0.25), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  // projected stars on ceiling & walls (slowly rotating)
  if (o.stars !== false) {
    const r = rnd(71); const rot = t * 0.06;
    for (let i = 0; i < 90; i++) {
      const az = r() * PI * 2 + rot, el = 0.15 + r() * 1.3; const d = [Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)];
      // intersect ray from projector with room box (x in [-2.1,2.1], y <= 2.6, z in [-3.4, 1.0])
      let s = 99; if (d[1] > 0) s = Math.min(s, (2.58 - PJ[1]) / d[1]); if (d[0] > 0) s = Math.min(s, (2.08 - PJ[0]) / d[0]); if (d[0] < 0) s = Math.min(s, (-2.08 - PJ[0]) / d[0]); if (d[2] < 0) s = Math.min(s, (-3.33 - PJ[2]) / d[2]); if (d[2] > 0) s = Math.min(s, (1.0 - PJ[2]) / d[2]);
      const p = add(PJ, scl(d, s)); const tw = 0.7 + 0.3 * Math.sin(t * 2 + i);
      objs.push(O('sph', p, [0, 0, 0], [0.035, 0.035, 0.035], C(i % 5 ? '#fff0c0' : '#c0d8ff', 3 * tw), { mode: 1, noShadow: true }));
    }
  }
  // bookshelf + frame on the left wall
  objs.push(B([-2.0, 1.2, -1.6], [0.2, 0.05, 1.2], C('#e8e0d0')), O('box', [-1.97, 1.36, -1.6], [0, 0, 0], [0.14, 0.26, 1.1], [1, 1, 1], { tex: T3.spines }));
  const cam = { pos: [-0.9, 1.5, 0.6], target: [lerp(0.35, 0.8, tuckK), lerp(1.25, 0.95, tuckK), lerp(-2.4, -2.3, tuckK)], up: [0, 1, 0], fov: 70 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.hand !== false) objs.push(...povArm(CW, [0.22, -0.65, 0.05], lerp3([0.2, -0.5, -0.35], [0.12, -0.3, -1.0], tuckK), POV_SLEEVE(), POV_SKIN()));
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C('#5a6aa8', 0.6), gnd: C('#3a3040', 0.3) },
    pls: [{ p: PJ, c: C('#ffc880', 2.2), r: 4 }, { p: [-0.4, 1.6, -3.0], c: C('#8aa0e0', 0.7), r: 3.5 }, { p: [0, 2.4, -1], c: C('#7080c0', 0.35), r: 4 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.15, bloom: 0.9, th: 0.85, vig: 0.5, warm: 0.2, fade: fadeIO(t, dur) },
  };
}

// ---------- FOOTBALL PITCH UNDER FLOODLIGHTS ----------
function sceneFootball(t, dur, o) {
  ensureT5(); o = o || {}; const objs = []; const day = o.time === 'day'; const play = o.play !== false;
  const LW = 34, LL = 52; // half sizes are /2; pitch along x, camera on the near touchline (z=+LW/2)
  objs.push(B([0, -0.06, 0], [200, 0.1, 200], C('#2a3a22')));
  objs.push(B([0, -0.04, 0], [LL + 6, 0.06, LW + 6], C('#3a8a3a'), { tex: T5.pitch, uvr: [0, 0, 12, 1] }));
  const wl = C('#f4f4f0', 1.2), ln = (p, s) => objs.push(B(p, s, wl, { noShadow: true }));
  ln([0, 0.0, LW / 2], [LL, 0.012, 0.12]); ln([0, 0.0, -LW / 2], [LL, 0.012, 0.12]); ln([LL / 2, 0, 0], [0.12, 0.012, LW]); ln([-LL / 2, 0, 0], [0.12, 0.012, LW]); ln([0, 0, 0], [0.12, 0.012, LW]);
  for (let i = 0; i < 40; i++) { const a = i / 40 * PI * 2; objs.push(O('box', [Math.cos(a) * 6, 0, Math.sin(a) * 6], [0, -a, 0], [0.12, 0.012, 0.98], wl, { noShadow: true })); }
  for (const sx of [-1, 1]) {
    ln([sx * (LL / 2 - 8), 0, 0], [0.12, 0.012, 20]); ln([sx * (LL / 2 - 4), 0, 10], [8, 0.012, 0.12]); ln([sx * (LL / 2 - 4), 0, -10], [8, 0.012, 0.12]);
    const gx = sx * LL / 2;
    for (const gz of [-3.66, 3.66]) objs.push(B([gx, 1.22, gz], [0.12, 2.44, 0.12], C('#ffffff', 1.3)));
    objs.push(B([gx, 2.44, 0], [0.12, 0.12, 7.44], C('#ffffff', 1.3)));
    objs.push(O('plane', [gx + sx * 1.2, 1.22, 0], [0, PI / 2, 0], [7.3, 2.4, 1], C('#ffffff', 0.25), { additive: true, mode: 3, tex: T5.net, uvr: [0, 0, 8, 3], noShadow: true }));
    for (const gz of [-3.66, 3.66]) objs.push(O('plane', [gx + sx * 0.6, 1.22, gz], [0, 0, 0], [1.2, 2.4, 1], C('#ffffff', 0.2), { additive: true, mode: 3, tex: T5.net, uvr: [0, 0, 1.5, 3], noShadow: true }));
  }
  // stands with crowd on the far side
  const r = rnd(88);
  for (let row = 0; row < 8; row++) { objs.push(B([0, 0.5 + row * 0.6, -LW / 2 - 6 - row * 0.9], [LL + 10, 0.6, 0.9], C('#4a4e58'))); for (let i = 0; i < 70; i++) if (r() < 0.6) objs.push(B([-LL / 2 - 4 + i * 0.86 + r() * 0.3, 1.05 + row * 0.6 + Math.max(0, Math.sin(t * 6 + i + row)) * 0.04, -LW / 2 - 6 - row * 0.9], [0.4, 0.5, 0.3], C(['#d84a3a', '#f0f0f0', '#2a5ab0', '#f0c030', '#2a2a2a'][(r() * 5) | 0]), { noShadow: true })); }
  objs.push(B([0, 6.4, -LW / 2 - 12], [LL + 12, 0.3, 9], C('#2a2e36')));
  // scoreboard
  objs.push(B([LL / 2 - 4, 7.5, -LW / 2 - 9], [6, 2.4, 0.3], C('#111')), O('plane', [LL / 2 - 4, 7.5, -LW / 2 - 8.84], [0, 0, 0], [5.6, 2.1, 1], [1.6, 1.6, 1.6], { mode: 1, tex: T5.score, noShadow: true }));
  // floodlight towers
  const pls = [];
  for (const [x, z] of [[-LL / 2 - 6, -LW / 2 - 8], [LL / 2 + 6, -LW / 2 - 8], [-LL / 2 - 6, LW / 2 + 8], [LL / 2 + 6, LW / 2 + 8]]) {
    objs.push(B([x, 11, z], [0.5, 22, 0.5], C('#5a5e66')), B([x, 22.5, z], [4, 2.2, 0.4], C('#3a3e46')));
    for (let i = 0; i < 6; i++) objs.push(B([x - 1.6 + (i % 3) * 1.6, 22.0 + ((i / 3) | 0) * 1.0, z + (z > 0 ? -0.25 : 0.25)], [1.1, 0.7, 0.1], C('#ffffff', day ? 2 : 10), { mode: 1, noShadow: true }));
    objs.push(O('plane', [x, 22.5, z + (z > 0 ? -1 : 1)], [0, 0, 0], [16, 12, 1], C('#e8f0ff', day ? 0.08 : 0.35), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  }
  // players + ball
  const bx = Math.sin(t * 0.45) * 14, bz = Math.sin(t * 0.7 + 1) * 6; const bh = Math.abs(Math.sin(t * 2.2)) * 0.4;
  if (play) {
    objs.push(O('sph', [bx, 0.11 + bh, bz], [t * 6, t * 3, 0], [0.22, 0.22, 0.22], C('#ffffff', 1.4)));
    for (let i = 0; i < 12; i++) {
      const team = i % 2, ang = i * 1.3 + t * 0.2, d = 3 + (i % 4) * 2.5;
      const tx = bx + Math.cos(ang) * d * (team ? 1.2 : 1), tz = bz + Math.sin(ang) * d * 0.7;
      const x = clamp(tx, -LL / 2 + 1, LL / 2 - 1), z = clamp(tz, -LW / 2 + 1, LW / 2 - 2);
      const yaw = Math.atan2(bx - x, bz - z);
      objs.push(...person(M4.trs([x, 0, z], [0, yaw, 0]), { skin: SKINS[i % 5], shirt: team ? '#d83a2a' : '#f2f2f2', pants: team ? '#f2f2f2' : '#1a2a5a', walk: 1.4, phase: t * 7 + i, hair: '#1a1a1a', face: 'flat' }));
    }
    objs.push(...person(M4.trs([-LL / 2 + 0.8, 0, 0], [0, PI / 2, 0]), { skin: '#c68e62', shirt: '#30c060', pants: '#1a1a1a', armL: 0.3, armR: 0.3, face: 'flat' }));
  }
  // bench in front of the camera
  objs.push(B([0, 0.45, LW / 2 + 2.6], [5, 0.08, 0.6], C('#2a5ab0')), B([0, 1.1, LW / 2 + 3.0], [5.4, 1.6, 0.06], C('#a8c0d8', 0.4), { alpha: 0.4 }), B([0, 1.95, LW / 2 + 2.6], [5.4, 0.06, 1.2], C('#2a2e36')));
  objs.push(...person(M4.trs([1.4, 0, LW / 2 + 2.6], [0, PI, 0]), { skin: '#8d5a3b', shirt: '#d83a2a', pants: '#f2f2f2', sit: true, hair: '#1a1a1a', face: 'flat' }));
  const cam = { pos: [-0.6, 1.25, LW / 2 + 2.5], target: [bx * 0.6, 1.4, bz * 0.3 - 2], up: [0, 1, 0], fov: 62, far: 600 };
  if (!day) skyStars(objs, cam, t, 0.6);
  objs.push(skyDome(cam));
  if (!day) for (const [x, z] of [[-LL / 2 - 6, -LW / 2 - 8], [LL / 2 + 6, -LW / 2 - 8]]) pls.push({ p: [x * 0.6, 18, z * 0.6], c: C('#f0f4ff', 4), r: 60 });
  pls.push({ p: [0, 12, 8], c: C('#f0f4ff', day ? 0.5 : 2.5), r: 40 });
  const top = day ? C('#3a5aa0') : C('#05081a'), hor = day ? C('#f0a878') : C('#1c2448');
  return {
    objs, cam, sun: { dir: day ? norm([0.6, -0.3, -0.5]) : norm([0.2, -1, 0.3]), col: day ? C('#ffb880', 2.0) : C('#e8eeff', 1.2), center: [0, 0, 6], ext: 32 },
    hemi: { sky: C(day ? '#c0c8e0' : '#506080', 0.5), gnd: C('#2a5a2a', 0.3) },
    pls, sky: { top, hor, gnd: hor }, fog: { col: hor, d: 0.004, start: 50 }, clear: hor,
    post: { exposure: 1.05, bloom: 0.85, th: 0.95, vig: 0.45, warm: day ? 0.4 : 0.05, sat: 1.05, fade: fadeIO(t, dur) },
  };
}

// ---------- RIVER AT MISTY DAWN (flowing water, reeds, boat, bridge) ----------
function sceneRiver(t, dur, o) {
  ensureT5(); o = o || {}; const objs = []; const day = o.time === 'day'; const walk = o.walk !== false;
  const camZ = 2 - t * (walk ? 0.8 : 0); const RX = 7.5, RW = 12;
  objs.push(B([-16, -0.05, -40], [47.6, 0.1, 160], C('#6a8a44'), { tex: T5.grass, uvr: [0, 0, 18, 60] }));
  objs.push(B([RX + RW + 20, -0.05, -40], [40, 0.1, 160], C('#5a7a3a'), { tex: T5.grass, uvr: [0, 0, 16, 60] }));
  objs.push(B([4.6, 0.0, -40], [1.4, 0.02, 160], C('#b8a07a'), { tex: T.dirt, uvr: [0, 0, 1, 40] }));
  objs.push(B([RX + RW / 2, -0.55, -40], [RW + 1, 0.1, 160], C('#1a3a4a')));
  objs.push(B([RX + RW / 2, -0.35, -40], [RW, 0.02, 160], C(day ? '#4a8aa8' : '#6a8aa8', 0.9), { tex: T5.water, uvr: [0, -t * 0.25, 2, 30] }));
  for (const sd of [0, 1]) objs.push(O('box', [RX + sd * RW, -0.2, -40], [0, 0, sd ? 0.5 : -0.5], [1.0, 0.4, 160], C('#5a4a34')));
  // sun reflection streak + sparkles
  objs.push(O('plane', [RX + RW / 2 + 1, -0.32, camZ - 60], [-PI / 2, 0, 0], [4, 110, 1], C('#ffc890', day ? 0.2 : 0.4), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  const r = rnd(27);
  for (let i = 0; i < 70; i++) { const x = RX + 2 + r() * (RW - 4), z = camZ - 4 - r() * 70; const fl = Math.max(0, Math.sin(t * (3 + r() * 4) + i)); objs.push(O('box', [x, -0.32, z], [0, 0, 0], [0.12, 0.01, 0.12], C('#fff0d0', 4 * fl), { mode: 1, noShadow: true })); }
  // reeds along the near bank (swaying)
  for (let i = 0; i < 140; i++) { const z = 4 - i * 0.6 - r() * 0.4, x = RX - 0.3 + r() * 0.8, h = 0.6 + r() * 0.9; const sw = Math.sin(t * 1.4 + z * 0.6) * 0.12; objs.push(O('box', [x + sw * h * 0.5, h / 2, z], [0, r() * 3, sw], [0.03, h, 0.03], C(['#8a8a4a', '#6a7a3a', '#a09a5a'][i % 3]), { noShadow: true })); if (i % 4 === 0) objs.push(O('box', [x + sw * h, h + 0.1, z], [0, 0, sw], [0.06, 0.2, 0.06], C('#6a4a2a'))); }
  // willows + trees on both banks
  for (let i = 0; i < 12; i++) { const z = -2 - i * 7 - r() * 3, x = -3 - r() * 3; objs.push(O('cyl', [x, 1.2, z], [0, 0, 0], [0.35, 2.4, 0.35], C('#4a3a2a')), O('sph', [x, 3.2, z], [0, 0, 0], [3.4, 2.6, 3.4], C('#5a7a3a')), O('cone', [x + 0.8, 1.9, z], [PI, 0, 0], [2.6, 2.6, 2.6], C('#6a8a40'))); }
  for (let i = 0; i < 14; i++) { const z = 6 - i * 7, x = RX + RW + 2 + r() * 4; objs.push(O('cyl', [x, 1.3, z], [0, 0, 0], [0.3, 2.6, 0.3], C('#4a3a2a')), O('sph', [x, 3.4, z], [0, 0, 0], [3.0, 3.2, 3.0], C(['#4a6a34', '#6a7a3a', '#a08a40'][i % 3]))); }
  // stone bridge in the distance
  const BZ = -70;
  objs.push(B([RX + RW / 2, 3.2, BZ], [RW + 8, 0.8, 3], C('#b8a888'), { tex: T.plaster }));
  for (const px of [RX + 2, RX + RW / 2, RX + RW - 2]) objs.push(B([px, 1.4, BZ], [1.2, 3.6, 2.8], C('#a89878')));
  for (let i = 0; i < 2; i++) objs.push(...person(M4.trs([RX + 3 + i * 4 + mod(t * 1.2, 4), 3.6, BZ], [0, PI / 2, 0]), { skin: '#c68e62', shirt: ['#2d3a55', '#7a3d4d'][i], pants: '#2d2d33', walk: 1, phase: t * 4 + i, face: 'flat' }));
  // small rowing boat drifting downstream
  if (o.boat !== false) {
    const bz = camZ - 30 + mod(t * 1.2, 40) - 20, BMx = RX + RW * 0.55; const BM = M4.trs([BMx, -0.32 + Math.sin(t * 1.5) * 0.03, bz], [0, 0.15, Math.sin(t * 1.2) * 0.03]);
    objs.push(G(BM, M4.trs([0, 0.15, 0], [0, 0, 0], [1.2, 0.35, 3.2]), 'box', C('#6a3a24')), G(BM, M4.trs([0, 0.28, 0], [0, 0, 0], [1.0, 0.1, 2.9]), 'box', C('#3a2418')));
    objs.push(...person(M4.mul(BM, M4.trs([0, -0.1, 0.3], [0, 0, 0])), { skin: '#8d5a3b', shirt: '#e8e2d4', pants: '#3a3a40', sit: true, armL: 1.1 + Math.sin(t * 1.6) * 0.4, armR: 1.1 + Math.sin(t * 1.6) * 0.4, hair: '#cfcfcf', face: 'flat' }));
    for (const sx of [-1, 1]) objs.push(G(BM, M4.trs([sx * 0.9, 0.3, 0.6], [Math.sin(t * 1.6) * 0.5, 0, sx * 0.6], [0.05, 0.05, 2.0]), 'box', C('#8a6a4a')));
  }
  // morning mist drifting low over the water
  for (let i = 0; i < 16; i++) { const z = camZ - 6 - i * 5, x = RX + RW / 2 + Math.sin(t * 0.2 + i) * 3; objs.push(O('plane', [x, 0.5 + (i % 3) * 0.3, z], [0, 0, 0], [16, 2.5, 1], C('#ffffff', day ? 0.03 : 0.08), { additive: true, mode: 3, tex: T.glow, noShadow: true })); }
  // birds over the water
  for (let i = 0; i < 4; i++) { const PM = M4.trs([RX + mod(t * 3 + i * 5, 20) - 4, 5 + Math.sin(t + i) * 0.8, camZ - 20 - i * 4], [0, PI / 2, 0]); const fl = Math.sin(t * 9 + i) * 0.6; objs.push(G(PM, M4.trs([0.3, 0, 0], [0, 0, fl], [0.6, 0.02, 0.16]), 'box', C('#e8e8e8')), G(PM, M4.trs([-0.3, 0, 0], [0, 0, -fl], [0.6, 0.02, 0.16]), 'box', C('#e8e8e8'))); }
  const bob = walk ? Math.sin(t * 4.8) * 0.025 : 0;
  const cam = { pos: [walk ? 4.7 : 6.4, walk ? 1.62 + bob : 1.15, camZ], target: [RX + 3 + Math.sin(t * 0.2) * 1, 0.6, camZ - 30], up: [0, 1, 0], fov: 66, far: 1500 };
  objs.push(skyDome(cam));
  const top = day ? C('#5a90d0') : C('#5a6aa0'), hor = day ? C('#e0eaf0') : C('#f4c8a0');
  return {
    objs, cam, sun: { dir: day ? norm([0.4, -0.7, 0.4]) : norm([-0.25, -0.18, 1]), col: C(day ? '#fff4e0' : '#ffc090', day ? 2.6 : 1.8), center: [3, 0, camZ - 8], ext: 16 },
    hemi: { sky: C(day ? '#c8d8f0' : '#c0b8d8', 0.55), gnd: C('#607040', 0.3) },
    pls: [], sky: { top, hor, gnd: C('#3a5a6a') }, fog: { col: hor, d: day ? 0.008 : 0.014, start: 12 }, clear: hor,
    post: { exposure: 1.0, bloom: 0.75, th: 1.0, vig: 0.4, warm: day ? 0.2 : 0.45, sat: 1.0, fade: fadeIO(t, dur) },
  };
}

// ---------- CONSTRUCTION SITE AT SUNSET (crane, scaffolding, workers) ----------
function sceneConstruction(t, dur, o) {
  ensureT5(); o = o || {}; const objs = []; const day = o.time === 'day';
  objs.push(B([0, -0.05, -20], [120, 0.1, 120], C('#9a8468'), { tex: T.dirt, uvr: [0, 0, 20, 20] }));
  // building skeleton: slabs + columns
  const SZ = -14, nF = 5, FH = 3.2;
  for (let f = 0; f <= nF; f++) objs.push(B([0, f * FH + 0.1, SZ], [16, 0.25, 10], C('#b8b4ac')));
  for (let f = 0; f < nF; f++) for (let x = -7.5; x <= 7.5; x += 3.75) for (const z of [SZ - 4.7, SZ + 4.7]) objs.push(B([x, f * FH + FH / 2, z], [0.4, FH, 0.4], C('#a8a49c')));
  for (let x = -7.5; x <= 7.5; x += 3.75) objs.push(B([x, nF * FH + 0.9, SZ + 4.7], [0.06, 1.6, 0.06], C('#8a4a2a')));
  // scaffolding on the front face
  const sc = C('#9a9ca2');
  for (let x = -8; x <= 8; x += 2) objs.push(B([x, nF * FH / 2 + 0.4, SZ + 5.9], [0.06, nF * FH + 0.8, 0.06], sc), B([x, nF * FH / 2 + 0.4, SZ + 6.9], [0.06, nF * FH + 0.8, 0.06], sc));
  for (let f = 1; f <= nF; f++) { objs.push(B([0, f * FH - 0.4, SZ + 6.4], [16.2, 0.06, 1.1], C('#8a6a4a')), B([0, f * FH + 0.6, SZ + 6.9], [16.2, 0.05, 0.05], sc)); }
  for (let f = 0; f < nF; f++) for (let x = -8; x < 8; x += 2) objs.push(O('box', [x + 1, f * FH + FH / 2, SZ + 6.9], [0, 0, (x / 2) % 2 ? 0.95 : -0.95], [0.04, 3.6, 0.04], sc));
    // tower crane: mast, jib rotating, swinging load
  const CX = -12, CZ = -22, CH = 26;
  objs.push(O('box', [CX, CH / 2, CZ], [0, 0, 0], [1.2, CH, 1.2], C('#f0b020'), { tex: T5.lattice, uvr: [0, 0, 1, 20] }));
  const yaw = o.crane === false ? 0.6 : 0.6 + Math.sin(t * 0.12) * 0.6;
  const JM = M4.trs([CX, CH, CZ], [0, yaw, 0]);
  objs.push(G(JM, M4.trs([9, 0.6, 0], [0, 0, 0], [24, 1.0, 1.0]), 'box', C('#f0b020'), { tex: T5.lattice, uvr: [0, 0, 20, 1] }), G(JM, M4.trs([-6, 0.4, 0], [0, 0, 0], [8, 0.8, 1.2]), 'box', C('#f0b020')));
  objs.push(G(JM, M4.trs([-8, -0.4, 0], [0, 0, 0], [2.4, 1.6, 1.6]), 'box', C('#8a8a8a')), G(JM, M4.trs([0, 2.2, 0], [0, 0, 0], [1.0, 3.6, 1.0]), 'box', C('#f0b020')), G(JM, M4.trs([0.8, 0.0, 0], [0, 0, 0], [1.8, 1.6, 1.6]), 'box', C('#e8e4dc')));
  const tx = 13 + Math.sin(t * 0.2) * 3, hook = 9 + Math.sin(t * 0.15) * 2, sw = Math.sin(t * 1.1) * 0.06;
  const HM = M4.mul(JM, M4.trs([tx, 0, 0], [0, 0, sw]));
  objs.push(G(HM, M4.trs([0, -hook / 2, 0], [0, 0, 0], [0.04, hook, 0.04]), 'box', C('#222')), G(HM, M4.trs([0, -hook - 0.5, 0], [0, 0, 0], [2.6, 0.8, 1.0]), 'box', C('#7a5a3a')));
  objs.push(G(JM, M4.trs([21, 1.2, 0], [0, 0, 0], [0.3, 0.3, 0.3]), 'sph', C('#ff3020', (t % 1.5) < 0.2 ? 8 : 0.5), { mode: 1, noShadow: true }));
  // cement mixer, wheelbarrow, piles, barrier
  objs.push(O('cyl', [5.5, 1.2, -5], [0.6, t * 1.5, 0], [1.4, 1.8, 1.4], C('#e86a20')), B([5.5, 0.4, -5], [1.2, 0.8, 1.6], C('#3a3a3a')));
  objs.push(B([-3.5, 0.45, -4.5], [0.7, 0.3, 1.0], C('#3a6a8a')), O('cyl', [-3.5, 0.2, -4.0], [0, 0, PI / 2], [0.35, 0.1, 0.35], C('#222')));
  for (let i = 0; i < 4; i++) objs.push(B([-6 + i * 0.1, 0.12 + i * 0.25, -7], [3 - i * 0.4, 0.24, 0.8], C('#b0583a')));
  objs.push(O('sph', [2, 0, -6], [0, 0, 0], [3.2, 1.6, 2.6], C('#c8b890'), { tex: T2.sand }));
  for (let x = -10; x <= 10; x += 2.2) objs.push(B([x, 0.5, 1.6], [2.0, 0.3, 0.08], [1, 1, 1], { tex: T5.stripe, uvr: [0, 0, 4, 1] }), B([x - 0.9, 0.3, 1.6], [0.06, 0.6, 0.3], C('#333')));
  // workers in helmets
  const ws = [[-2.2, -5.8, 0.4, 0], [3.2, -8.5, -2.2, 1], [-5.5, -10, 0.9, 2]];
  for (const [x, z, yw, i] of ws) { objs.push(...person(M4.trs([x, 0, z], [0, yw, 0]), { skin: SKINS[i + 1], shirt: '#f07020', pants: '#3a4a6a', armL: i === 0 ? 1.2 + Math.sin(t * 3) * 0.4 : 0.2, armR: 0.2, walk: i === 1 ? 1 : 0, phase: t * 4, face: 'flat' })); t5Helmet(objs, x, z, yw, i === 2 ? '#ffffff' : '#f0c020'); }
  objs.push(...person(M4.trs([-1, 3 * FH + 0.22, SZ + 6.3], [0, 0.2, 0]), { skin: '#8d5a3b', shirt: '#f07020', pants: '#3a4a6a', armR: 1.4, face: 'flat' })); t5Helmet(objs, -1, SZ + 6.3, 0.2, null, 3 * FH + 0.22);
  // distant city + minaret on the horizon
  const r = rnd(64);
  for (let i = 0; i < 26; i++) { const x = -90 + i * 7 + r() * 3, h = 6 + r() * 18; objs.push(B([x, h / 2, -90 - r() * 20], [6, h, 6], C(day ? '#a8a0a0' : '#4a3a4a'))); }
  if (o.minaret !== false) objs.push(O('cyl', [24, 11, -84], [0, 0, 0], [1.6, 22, 1.6], C(day ? '#e0d8c8' : '#5a4a54')), O('cyl', [24, 17, -84], [0, 0, 0], [2.6, 0.5, 2.6], C(day ? '#d8d0c0' : '#5a4a54')), O('cone', [24, 24, -84], [0, 0, 0], [1.8, 4, 1.8], C(day ? '#3a7a6a' : '#3a3a4a')), O('cyl', [24, 17.4, -84], [0, 0, 0], [2.2, 0.3, 2.2], C('#9affc0', day ? 0.3 : 3), { mode: 1 }));
  // sun + glow
  const sunDir = norm([-0.12, day ? 0.5 : 0.07, -1]); const cam = { pos: [-4 + Math.sin(t * 0.2) * 0.3, 1.62, 8 - t * 0.12], target: [lerp(-6, -2, clamp(t / dur, 0, 1)), 6.5, -30], up: [0, 1, 0], fov: 68, far: 600 };
  if (!day) { objs.push(O('sph', add(cam.pos, scl(sunDir, 420)), [0, 0, 0], [18, 18, 18], C('#ffd8a0', 5), { mode: 1, noShadow: true }), O('plane', add(cam.pos, scl(sunDir, 440)), dirRot(scl(sunDir, -1)), [160, 110, 1], C('#ff9a60', 0.5), { additive: true, mode: 3, tex: T.glow, noShadow: true })); }
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.gloves !== false) { const g = C('#d88a20'); const lift = Math.sin(t * 0.8) * 0.01; objs.push(...povArm(CW, [-0.32, -0.68, 0.05], [-0.16, -0.42 + lift, -0.55], C('#f07020'), g), ...povArm(CW, [0.32, -0.68, 0.05], [0.17, -0.43 - lift, -0.56], C('#f07020'), g)); }
  objs.push(skyDome(cam));
  const top = day ? C('#4a80c8') : C('#3a3a78'), hor = day ? C('#e0e4e8') : C('#f89a68');
  return {
    objs, cam, sun: { dir: day ? norm([-0.4, -0.7, 0.5]) : norm([-0.3, -0.22, 1]), col: C(day ? '#fff2d8' : '#ffa868', day ? 2.6 : 2.0), center: [0, 0, -10], ext: 22 },
    hemi: { sky: C(day ? '#c8d8f0' : '#9080b0', 0.55), gnd: C('#806040', 0.3) },
    pls: [], sky: { top, hor, gnd: hor }, fog: { col: hor, d: 0.006, start: 30 }, clear: hor,
    post: { exposure: 1.0, bloom: 0.8, th: 1.0, vig: 0.45, warm: day ? 0.2 : 0.5, sat: 1.05, fade: fadeIO(t, dur) },
  };
}

Object.assign(SCENES, { courtyard: sceneCourtyard, mountain: sceneMountain, cemetery: sceneCemetery, waiting_room: sceneWaitingRoom, kids_room: sceneKidsRoom, football: sceneFootball, river: sceneRiver, construction: sceneConstruction });
