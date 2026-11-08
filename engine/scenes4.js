'use strict';
// Week 2026-11-09 scenes: airport, bus_stop, library, gym, checkout, classroom, snow_street, souk
let T4 = null;
const mod = (a, m) => ((a % m) + m) % m;
function txt(g, s, x, y, px, col, align, wt) { g.font = `${wt || 600} ${px}px InterUI, sans-serif`; g.fillStyle = col; g.textAlign = align || 'left'; g.textBaseline = 'middle'; g.fillText(s, x, y); }
function ensureT4() {
  ensureT3(); if (T4) return; T4 = {};
  T4.board = texFromCanvas(mkCanvas(512, 320, (g, w, h) => {
    g.fillStyle = '#05070c'; g.fillRect(0, 0, w, h); g.fillStyle = '#12305a'; g.fillRect(0, 0, w, 44);
    txt(g, '✈', 20, 23, 26, '#ffffff'); txt(g, '06:12', w - 18, 23, 24, '#ffd23a', 'right');
    const rows = [['AT 802', '06:40', 'B12', '#3cff8a'], ['TK 1938', '06:55', 'B07', '#3cff8a'], ['SV 228', '07:10', 'C03', '#ffd23a'], ['RAM 961', '07:25', 'B12', '#ffd23a'], ['EK 148', '07:40', 'A21', '#8aa0c0'], ['QR 196', '08:05', 'C11', '#8aa0c0']];
    rows.forEach(([f, tm, gt, c], i) => { const y = 72 + i * 42; g.fillStyle = i % 2 ? '#0a0e16' : '#0e131d'; g.fillRect(0, y - 20, w, 40); txt(g, f, 18, y, 24, '#ffd23a'); txt(g, tm, 210, y, 24, '#ffffff'); txt(g, gt, 330, y, 24, '#ffffff'); g.fillStyle = c; g.fillRect(440, y - 8, 52, 16); });
  }));
  T4.pass = texFromCanvas(mkCanvas(128, 256, (g, w, h) => {
    g.fillStyle = '#f6f4ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#1f5a8a'; g.fillRect(0, 0, w, 46);
    txt(g, 'B12', 64, 23, 26, '#ffffff', 'center'); txt(g, '06:40', 64, 72, 24, '#1b2333', 'center');
    g.fillStyle = '#9aa3b0'; for (let i = 0; i < 4; i++) g.fillRect(16, 100 + i * 18, 60 + (i * 23) % 40, 6);
    const r = rnd(3); let x = 14; while (x < w - 14) { const bw = 1 + ((r() * 4) | 0); g.fillStyle = '#111'; g.fillRect(x, 190, bw, 50); x += bw + 1 + ((r() * 3) | 0); }
  }));
  T4.page = texFromCanvas(mkCanvas(128, 160, (g, w, h) => {
    g.fillStyle = '#f2ead6'; g.fillRect(0, 0, w, h); g.fillStyle = '#8a8070';
    const r = rnd(9); for (let y = 16; y < h - 10; y += 8) g.fillRect(12, y, w - 24 - r() * 30 * (y > h - 30 ? 2 : 0.3), 3);
  }));
  T4.belt = texFromCanvas(mkCanvas(64, 64, (g, w, h) => { g.fillStyle = '#1c1d20'; g.fillRect(0, 0, w, h); g.fillStyle = '#2c2e33'; for (let y = 0; y < h; y += 16) g.fillRect(0, y, w, 5); }), true);
  T4.products = texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    g.fillStyle = '#e8e8e4'; g.fillRect(0, 0, w, h); const r = rnd(17); const cols = ['#d94a3a', '#f0c030', '#3a7ad9', '#3aa05a', '#f08a30', '#8a3ad0', '#ffffff', '#30b0c0'];
    for (let row = 0; row < 4; row++) { const y0 = row * 64; g.fillStyle = '#9aa0a8'; g.fillRect(0, y0 + 58, w, 6); let x = 2; while (x < w) { const bw = 12 + r() * 18, bh = 26 + r() * 28; g.fillStyle = cols[(r() * cols.length) | 0]; g.fillRect(x, y0 + 58 - bh, bw - 2, bh); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(x + 2, y0 + 58 - bh + 6, bw - 6, 4); x += bw; } }
  }), true);
  T4.till = texFromCanvas(mkCanvas(256, 128, (g, w, h) => { g.fillStyle = '#0c2a4a'; g.fillRect(0, 0, w, h); g.fillStyle = '#5a8ac0'; for (let i = 0; i < 4; i++) g.fillRect(14, 14 + i * 14, 100 + (i * 37) % 80, 6); txt(g, '47,90', w - 16, 100, 40, '#ffffff', 'right'); }));
  T4.tread = texFromCanvas(mkCanvas(256, 128, (g, w, h) => {
    g.fillStyle = '#06080c'; g.fillRect(0, 0, w, h); txt(g, '32:14', 20, 34, 38, '#3cff8a'); txt(g, '5.2', w - 20, 34, 38, '#ffd23a', 'right');
    for (let i = 0; i < 14; i++) { const bh = 10 + ((i * 7) % 5) * 9; g.fillStyle = i < 9 ? '#3cff8a' : '#24603a'; g.fillRect(20 + i * 16, h - 14 - bh, 11, bh); }
  }));
  T4.clock = texFromCanvas(mkCanvas(128, 128, (g, w, h) => {
    g.fillStyle = '#fbfaf6'; g.beginPath(); g.arc(64, 64, 63, 0, 7); g.fill(); g.fillStyle = '#222';
    for (let i = 0; i < 60; i++) { const a = i / 60 * PI * 2, L = i % 5 ? 4 : 11; g.save(); g.translate(64, 64); g.rotate(a); g.fillRect(-1.5, -60, i % 5 ? 2 : 4, L); g.restore(); }
  }));
  T4.chalk = texFromCanvas(mkCanvas(512, 192, (g, w, h) => {
    g.fillStyle = '#244a3a'; g.fillRect(0, 0, w, h); noiseFillOver(g, w, h, 0.06, 4); g.strokeStyle = 'rgba(240,240,230,0.75)'; g.lineWidth = 3; const r = rnd(6);
    for (let k = 0; k < 6; k++) { const y = 30 + k * 26; let x = 30 + r() * 30; g.beginPath(); g.moveTo(x, y); while (x < 260 + r() * 200) { x += 6 + r() * 10; g.lineTo(x, y + Math.sin(x * 0.3) * 4 + (r() - 0.5) * 3); } g.stroke(); }
  }));
  T4.exam = texFromCanvas(mkCanvas(128, 176, (g, w, h) => {
    g.fillStyle = '#f7f6f2'; g.fillRect(0, 0, w, h); g.fillStyle = '#20242c'; g.fillRect(12, 10, 70, 7); g.fillStyle = '#9aa0aa';
    for (let i = 0; i < 6; i++) { const y = 34 + i * 23; g.strokeStyle = '#555'; g.lineWidth = 1.5; g.strokeRect(12, y, 8, 8); g.fillRect(26, y + 2, 60 + (i * 19) % 30, 4); g.fillRect(26, y + 11, 80, 3); }
  }));
  T4.awn = [['#f2ead8', '#b8452a'], ['#f2ead8', '#2a6a5a'], ['#e8c050', '#7a3d4d'], ['#f2ead8', '#2d4a8a']].map(([a, b]) => texFromCanvas(mkCanvas(64, 64, (g, w, h) => { g.fillStyle = a; g.fillRect(0, 0, w, h); g.fillStyle = b; for (let x = 0; x < w; x += 16) g.fillRect(x, 0, 8, h); }), true));
  T4.ad = texFromCanvas(mkCanvas(128, 224, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a3a8a'); gr.addColorStop(1, '#c04a7a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,0.9)'; g.beginPath(); g.arc(64, 90, 34, 0, 7); g.fill(); g.fillStyle = '#ffd23a'; g.fillRect(20, 160, 88, 10); g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(30, 180, 68, 6);
  }));
  T4.cityDusk = texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2c3266'); gr.addColorStop(0.55, '#c8708a'); gr.addColorStop(0.8, '#f4a868'); gr.addColorStop(1, '#f8c890'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const s = g.createRadialGradient(w * 0.3, h * 0.8, 2, w * 0.3, h * 0.8, 70); s.addColorStop(0, 'rgba(255,230,170,1)'); s.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = s; g.fillRect(0, 0, w, h);
    const r = rnd(12); for (let x = -6; x < w; x += 14 + r() * 22) { const bh = 30 + r() * 70; g.fillStyle = '#241c2c'; g.fillRect(x, h - bh, 14 + r() * 18, bh); for (let k = 0; k < bh / 8; k++) if (r() < 0.25) { g.fillStyle = '#ffcf7a'; g.fillRect(x + 3 + r() * 9, h - bh + k * 8 + 3, 2, 2); } }
    g.fillStyle = '#241c2c'; g.fillRect(180, h - 120, 7, 120); g.beginPath(); g.moveTo(178, h - 120); g.lineTo(183.5, h - 140); g.lineTo(189, h - 120); g.fill(); g.fillRect(176, h - 100, 15, 4);
  }));
  T4.snowGround = texFromCanvas(mkCanvas(256, 256, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); noiseFillOver(g, w, h, 0.07, 21); }), true);
}

// rain / snow particles in a box around the camera (world-fixed lattice, wraps with camera)
function rainAround(objs, cam, t, n, opt) {
  const r = rnd(opt.seed || 7), H = opt.h || 6, R = opt.r || 7;
  for (let i = 0; i < n; i++) {
    const x0 = r() * R * 2, z0 = r() * R * 2, ph = r();
    const x = cam.pos[0] + R - mod(cam.pos[0] + R - x0, R * 2) , z = cam.pos[2] + R * 0.6 - mod(cam.pos[2] + R * 0.6 - z0, R * 2);
    const y = (opt.top || 5.5) - mod(t * opt.v + ph * H, H);
    if (opt.cover && opt.cover(x, y, z)) continue;
    if (opt.snow) objs.push(O('sph', [x + Math.sin(t * 0.9 + i) * 0.25, y, z], [0, 0, 0], [0.035, 0.035, 0.035], C('#ffffff', opt.k || 1.4), { mode: 1, noShadow: true }));
    else objs.push(O('box', [x, y, z], [0, 0, 0.12], [0.006, 0.42, 0.006], C('#b8c8e8', opt.k || 0.55), { additive: true, mode: 3, noShadow: true }));
  }
}

// ---------- AIRPORT GATE (big window, plane, departures board) ----------
function sceneAirport(t, dur, o) {
  ensureT4(); o = o || {}; const night = o.time === 'night'; const objs = []; const k = clamp(t / dur, 0, 1);
  const Hh = 4.4, zw = -10;
  objs.push(B([0, -0.05, -4], [16, 0.1, 13], C('#c4c8cc'), { tex: T3.tiles, uvr: [0, 0, 8, 6] }));
  objs.push(B([0, Hh, -4], [16, 0.1, 13], C('#d8dadc')));
  for (let z = 1; z > zw; z -= 2.2) objs.push(B([0, Hh - 0.06, z], [9, 0.03, 0.22], C('#f4f8ff', 2.4), { mode: 1, noShadow: true }));
  for (const sx of [-1, 1]) objs.push(B([sx * 8, Hh / 2, -4], [0.1, Hh, 13], C('#cfd2d4'), { tex: T.plaster }));
  objs.push(B([0, Hh / 2, 2.4], [16, Hh, 0.1], C('#cfd2d4')));
  // glass wall: mullions + sill
  objs.push(B([0, 0.2, zw], [16, 0.4, 0.3], C('#5a5e66')), B([0, Hh - 0.15, zw], [16, 0.3, 0.3], C('#5a5e66')));
  for (let x = -7.5; x <= 7.5; x += 2.5) objs.push(B([x, Hh / 2, zw], [0.12, Hh, 0.14], C('#4a4e56')));
  objs.push(B([0, 2.3, zw], [16, 0.08, 0.1], C('#4a4e56')));
  objs.push(O('plane', [0, Hh / 2, zw + 0.06], [0, 0, 0], [16, Hh, 1], C(night ? '#8090b0' : '#c0c8d8', 0.05), { additive: true, mode: 3, noShadow: true }));
  // apron outside
  objs.push(B([0, -0.6, -120], [600, 0.1, 220], C(night ? '#2a2c32' : '#5a5c62'), { tex: T.asphalt, uvr: [0, 0, 60, 30] }));
  for (let i = 0; i < 40; i++) { const x = -60 + i * 3.2; objs.push(B([x, -0.5, -46], [0.25, 0.08, 0.25], C(i % 2 ? '#3a8aff' : '#ffd060', 4), { mode: 1, noShadow: true })); }
  for (let x = -40; x <= 40; x += 6) objs.push(B([x, -0.53, -24], [3, 0.02, 0.2], C('#e8d050', 0.9)));
  // plane (side view, taxiing to the right)
  const px = o.plane === false ? null : (o.plane === 'still' ? 0 : lerp(-10, 5, k));
  if (px != null) {
    const z = -24, y = 2.4, M = M4.trs([px, y, z]); const W = '#f2f4f6';
    objs.push(G(M, M4.trs([0, 0, 0], [0, 0, PI / 2], [3.2, 30, 3.2]), 'cyl', C(W)));
    objs.push(G(M, M4.trs([15, -0.15, 0], [0, 0, 0], [3.6, 2.9, 3.1]), 'sph', C(W)), G(M, M4.trs([-15.5, 0.3, 0], [0, 0, 0], [3.2, 2.4, 2.6]), 'sph', C(W)));
    objs.push(G(M, M4.trs([16.2, 0.5, 0], [0, 0, 0], [0.9, 0.5, 2.2]), 'box', C('#1a2230')));
    objs.push(G(M, M4.trs([-14, 3.0, 0], [0, 0, -0.5], [5.2, 4.6, 0.3]), 'box', C('#1f5a8a')));
    objs.push(G(M, M4.trs([-15, 0.6, 0], [0, 0, 0], [3, 0.2, 9]), 'box', C(W)));
    objs.push(G(M, M4.trs([-1, -0.9, 0], [0, 0.35, 0], [5, 0.3, 26]), 'box', C('#dcdfe2')));
    for (const sz of [-1, 1]) objs.push(G(M, M4.trs([0.5, -1.9, sz * 5.5], [0, 0, PI / 2], [1.7, 3.4, 1.7]), 'cyl', C('#c8ccd2')));
    objs.push(G(M, M4.trs([0, -0.25, 1.62], [0, 0, 0], [26, 0.35, 0.05]), 'box', C('#1f5a8a')));
    for (let i = 0; i < 22; i++) objs.push(G(M, M4.trs([-11 + i * 1.1, 0.45, 1.6], [0, 0, 0], [0.32, 0.38, 0.05]), 'box', night ? C('#ffe0a0', 3) : C('#20283a'), night ? { mode: 1, noShadow: true } : {}));
    for (const gx of [12, -2]) objs.push(G(M, M4.trs([gx, -2.6, 0], [0, 0, 0], [0.25, 1.4, 0.25]), 'box', C('#555')), G(M, M4.trs([gx, -3.1, 0], [PI / 2, 0, 0], [0.9, 0.5, 0.9]), 'cyl', C('#151515')));
    const blink = (t % 1.2) < 0.12 ? 8 : 0.4;
    objs.push(G(M, M4.trs([-16.4, 5.2, 0], [0, 0, 0], [0.25, 0.25, 0.25]), 'sph', C('#ff3030', blink * 2), { mode: 1, noShadow: true }));
    objs.push(G(M, M4.trs([-1, -0.5, 13], [0, 0, 0], [0.4, 0.4, 0.4]), 'sph', C('#30ff60', 6), { mode: 1, noShadow: true }));
    objs.push(G(M, M4.trs([-1, 2.6, 1.0], [0, 0, 0], [6, 6, 1]), 'plane', C('#ff4040', blink * 0.08), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  }
  // seats facing the window
  for (const z of [-3.2, -5.4, -7.4]) for (let x = -6.2; x <= 6.2; x += 0.62) {
    if (Math.abs(x - 0.3) < 1.7) continue;
    objs.push(B([x, 0.45, z], [0.55, 0.08, 0.5], C('#2f3c50')), B([x, 0.78, z + 0.24], [0.55, 0.58, 0.06], C('#2f3c50')));
  }
  for (const z of [-3.2, -5.4, -7.4]) for (const sx of [-1, 1]) objs.push(B([0.3 + sx * 4.1, 0.25, z], [4.6, 0.06, 0.08], C('#888c92')));
  const r = rnd(5);
  for (const [x, z] of [[-1.6, -3.2], [-3.4, -3.2], [2.2, -5.4], [2.8, -3.2], [-2.0, -5.4], [-2.6, -7.4], [3.4, -7.4]]) {
    const fem = r() < 0.5;
    objs.push(...person(M4.trs([x, 0.02, z + 0.05], [0, PI, 0]), { skin: ['#c68e62', '#8d5a3b', '#e0b48c'][(r() * 3) | 0], shirt: ['#7a3d4d', '#2d3a55', '#556b2f', '#6a6a6a'][(r() * 4) | 0], pants: '#2d2d33', sit: true, hijab: fem ? '#d9cfc0' : null, face: 'flat' }));
  }
  objs.push(B([-0.55, 0.3, -6.1], [0.4, 0.55, 0.25], C('#7a2a2a')), B([-0.55, 0.65, -6.1], [0.04, 0.3, 0.04], C('#222')));
  objs.push(...person(M4.trs([-0.9, 0, -6.3], [0, PI + 0.3, 0]), { skin: '#8d5a3b', shirt: '#e8e2d4', pants: '#3a3a40', hair: '#1a1a1a', armR: 0.3, face: 'flat' }));
  objs.push(...person(M4.trs([1.5, 0, -8.2], [0, PI - 0.4, 0]), { skin: '#c68e62', shirt: '#2d3a55', pants: '#2d2d33', hijab: '#6a4a6a', face: 'flat' }));
  // departures board + gate sign
  objs.push(B([-0.7, 3.2, -5], [1.9, 1.2, 0.12], C('#111')), O('plane', [-0.7, 3.2, -4.93], [0, 0, 0], [1.8, 1.12, 1], [1.4, 1.4, 1.4], { mode: 1, tex: T4.board, noShadow: true }));
  objs.push(B([-0.7, 4.0, -5], [0.04, 0.5, 0.04], C('#333')));
  objs.push(B([2.2, 3.3, -6.2], [1.1, 0.5, 0.1], C('#1a2a4a')), O('plane', [2.2, 3.3, -6.14], [0, 0, 0], [1.0, 0.42, 1], C('#ffd23a', 1.6), { mode: 1, tex: T4.pass, uvr: [0, 0.82, 1, 0.18], noShadow: true }));
  const look = Math.sin(t * 0.25) * 0.5 + (px != null ? px * 0.08 : 0);
  const cam = { pos: [0.3, 1.35, -0.6], target: [look, 1.2, -30], up: [0, 1, 0], fov: 64, far: 600 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.pass !== false) {
    const lift = sstep(0.1 * dur, 0.3 * dur, t) * 0.05;
    const P = M4.mul(CW, M4.trs([0.1, -0.29 + lift, -0.5], [-0.35, -0.12, 0.08]));
    objs.push(G(P, M4.trs([0, 0, 0], [0, 0, 0], [0.09, 0.18, 0.003]), 'box', [1.1, 1.1, 1.1], { tex: T4.pass }));
    objs.push(...povArm(CW, [0.32, -0.62, 0.05], [0.12, -0.38 + lift, -0.5], POV_SLEEVE(), POV_SKIN(), [-0.6, 0.3, 0.4]));
  }
  objs.push(skyDome(cam));
  const top = night ? C('#060a1c') : C('#36478a'), hor = night ? C('#1c2448') : C('#f3a46c');
  return {
    objs, cam, sun: { dir: night ? [0, -1, 0] : norm([-0.35, -0.12, 1]), col: night ? [0, 0, 0] : C('#ffc890', 1.6), center: [0, 0, -5], ext: 10, on: !night },
    hemi: { sky: C(night ? '#8090b0' : '#d8d8e0', 0.6), gnd: C('#808080', 0.3) },
    pls: [{ p: [0, 3.8, -2], c: C('#eef4ff', 1.6), r: 7 }, { p: [0, 3.8, -7], c: C('#eef4ff', 1.2), r: 7 }, { p: [-1.3, 3.0, -4.4], c: C('#ffd23a', 0.4), r: 3 }],
    sky: { top, hor, gnd: hor }, fog: { col: hor, d: 0.006, start: 25 }, clear: hor,
    post: { exposure: 1.0, bloom: 0.75, th: 0.95, vig: 0.45, warm: night ? 0.05 : 0.35, fade: fadeIO(t, dur) },
  };
}

// ---------- BUS STOP IN THE RAIN (evening, waiting, bus arrives) ----------
function sceneBusStop(t, dur, o) {
  ensureT4(); o = o || {}; const objs = [];
  objs.push(B([0, -0.05, -80], [8, 0.1, 200], C('#2a2c30'), { tex: T.road, uvr: [0, 0, 1, 30] }));
  objs.push(B([6, 0.07, -80], [4, 0.14, 200], C('#5a5856'), { tex: T.asphalt, uvr: [0, 0, 2, 60] }), B([-6, 0.07, -80], [4, 0.14, 200], C('#5a5856')));
  objs.push(B([0, -0.08, -80], [300, 0.05, 300], C('#1a1b1e')));
  const r = rnd(41);
  for (const sd of [-1, 1]) for (let z = 6; z > -170; z -= 9 + r() * 5) { const h = 8 + r() * 16, w = 7 + r() * 3; objs.push(B([sd * (8.2 + w / 2), h / 2, z], [w, h, 8.6], C('#ffffff', 0.55), { mode: 1, tex: T2.nightFacade[(r() * 2) | 0], uvr: [0, 0, 2, Math.max(1, Math.round(h / 8))] })); }
  const pls = [];
  for (let z = 4; z > -150; z -= 16) for (const sd of [-1, 1]) {
    const x = sd * 4.3; objs.push(B([x, 2.6, z], [0.12, 5.2, 0.12], C('#2e3036')), B([x - sd * 0.6, 5.2, z], [1.3, 0.1, 0.2], C('#2e3036')), B([x - sd * 1.1, 5.12, z], [0.45, 0.1, 0.28], C('#ffd7a0', 5), { mode: 1 }));
    objs.push(O('plane', [x - sd * 1.1, 0.02, z + 3], [-PI / 2, 0, 0], [1.2, 9, 1], C('#ffb870', 0.25), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
    if (z > -40 && pls.length < 5) pls.push({ p: [x - sd * 1.1, 4.8, z], c: C('#ffc890', 2.0), r: 13 });
  }
  // shelter
  const SX = 5.6;
  objs.push(B([SX, 2.55, -0.3], [2.4, 0.1, 4.2], C('#3a3e46')), B([SX + 1.1, 1.3, -0.3], [0.06, 2.5, 4.2], C('#3a3e46')));
  objs.push(O('plane', [SX + 1.06, 1.35, -0.3], [0, -PI / 2, 0], [4.0, 2.2, 1], C('#a8c0e0', 0.07), { additive: true, mode: 3, noShadow: true }));
  objs.push(O('plane', [SX + 1.04, 1.4, -0.3], [0, -PI / 2, 0], [3.8, 2.0, 1], C('#d8e8ff', 0.18), { additive: true, mode: 3, tex: T2.drops, uvr: [0, (t * 0.12) % 1, 2, 1], noShadow: true }));
  objs.push(B([SX + 1.0, 1.35, -1.6], [0.08, 2.1, 1.3], C('#3a3e46')), O('plane', [SX + 0.95, 1.35, -1.6], [0, -PI / 2, 0], [1.1, 1.9, 1], [1.5, 1.5, 1.5], { mode: 1, tex: T4.ad, noShadow: true }));
  objs.push(B([SX + 0.75, 0.48, -0.3], [0.4, 0.06, 2.4], C('#6a5040')), B([SX + 0.75, 0.24, -0.3], [0.3, 0.48, 0.1], C('#3a3e46')));
  objs.push(B([SX - 1.0, 1.4, -4.4], [0.08, 2.8, 0.08], C('#3a3e46')), B([SX - 1.0, 2.5, -4.4], [0.5, 0.5, 0.04], C('#2060c0')));
  objs.push(O('plane', [SX - 1.0, 2.5, -4.37], [0, 0, 0], [0.4, 0.4, 1], C('#ffffff', 1.5), { mode: 1, tex: T4.awn[3], uvr: [0, 0, 0.5, 0.2], noShadow: true }));
  // passing cars (oncoming, left lane)
  for (let i = 0; i < 3; i++) {
    const z = -160 + mod(t * 14 + i * 60, 180);
    car(objs, -1.9, z, 0, ['#3a3a40', '#6a2a2a', '#5a6a7a'][i]);
    for (const sx of [-0.6, 0.6]) objs.push(B([-1.9 + sx, 0.7, z + 2.12], [0.35, 0.18, 0.05], C('#fff3d8', 8), { mode: 1 }));
    objs.push(O('plane', [-1.9, 0.75, z + 2.3], [0, 0, 0], [4, 2, 1], C('#fff0d0', 0.35), { additive: true, mode: 3, tex: T.glow }), O('plane', [-1.9, 0.02, z + 8], [-PI / 2, 0, 0], [1.6, 12, 1], C('#fff0d0', 0.18), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  }
  // the bus
  if (o.bus != null) {
    const k = clamp((t - (o.bus - 6)) / 6, 0, 1);
    if (k > 0) {
      const z = lerp(-120, -7.5, 1 - (1 - k) * (1 - k)), x = 2.4, BM = M4.trs([x, 0, z]);
      objs.push(G(BM, M4.trs([0, 1.75, 0], [0, 0, 0], [2.5, 3.0, 12]), 'box', C('#1f6a6a')));
      objs.push(G(BM, M4.trs([0, 2.1, 6.0], [0, 0, 0], [2.3, 1.3, 0.04]), 'box', C('#1a2430')), G(BM, M4.trs([0, 1.7, 5.9], [0, 0, 0], [2.2, 0.5, 0.2]), 'box', C('#ffe0b0', 0.6), { mode: 1 }));
      for (const sx of [-1, 1]) for (let j = 0; j < 6; j++) objs.push(G(BM, M4.trs([sx * 1.26, 2.15, -4.6 + j * 1.75], [0, 0, 0], [0.03, 0.9, 1.5]), 'box', C('#ffe2b0', 0.55), { mode: 1 }));
      objs.push(G(BM, M4.trs([0, 3.05, 6.02], [0, 0, 0], [1.6, 0.3, 0.03]), 'box', C('#ff9a20', 4), { mode: 1 }));
      for (const sx of [-0.9, 0.9]) objs.push(G(BM, M4.trs([sx, 0.7, 6.02], [0, 0, 0], [0.35, 0.2, 0.03]), 'box', C('#fff6e0', 10), { mode: 1 }));
      objs.push(G(BM, M4.trs([0, 0.8, 6.3], [0, 0, 0], [5, 2.4, 1]), 'plane', C('#fff0d0', 0.4), { additive: true, mode: 3, tex: T.glow }));
      for (const [a, b] of [[-1.2, 4], [1.2, 4], [-1.2, -4], [1.2, -4]]) objs.push(G(BM, M4.trs([a, 0.45, b], [0, 0, PI / 2], [0.9, 0.3, 0.9]), 'cyl', C('#151517')));
      pls.push({ p: [x, 1.0, z + 7], c: C('#fff0d0', 2.0 * k), r: 10 });
    }
  }
  const cam = { pos: [SX + 0.1, 1.62, 1.0], target: [2.6 + Math.sin(t * 0.3) * 0.3, 1.3, -30], up: [0, 1, 0], fov: 66, far: 400 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.phone) objs.push(...povArm(CW, [0.3, -0.6, 0.05], [0.12, -0.3, -0.42], C('#2a2e3a'), POV_SKIN()), ...phone(CW, [0.1, -0.22, -0.45], [0.35, 0, 0], T.scrFeed, [0, 0.8 - ((t * 0.05) % 0.8), 1, 0.125], 1.1));
  if (o.rain !== false) rainAround(objs, cam, t, 420, { v: 9, h: 6, r: 8, top: 5.8, cover: (x, y, z) => x > SX - 1.2 && x < SX + 1.2 && z > -2.4 && z < 1.8 && y < 2.6 });
  pls.push({ p: [SX + 0.3, 2.3, -1.2], c: C('#c8d8ff', 1.0), r: 4 });
  objs.push(skyDome(cam));
  const top = C('#141c34'), hor = C('#4a5470');
  return {
    objs, cam, sun: { dir: [0.2, -1, 0.1], col: [0, 0, 0], on: false },
    hemi: { sky: C('#4a5878', 0.45), gnd: C('#202228', 0.2) },
    pls, sky: { top, hor, gnd: hor }, fog: { col: C('#2a3040'), d: 0.015, start: 14 }, clear: hor,
    post: { exposure: 1.2, bloom: 0.95, th: 0.75, vig: 0.55, warm: 0.05, fade: fadeIO(t, dur) },
  };
}

// ---------- LIBRARY (tall shelves, green lamps, pages turning) ----------
function sceneLibrary(t, dur, o) {
  ensureT4(); o = o || {}; const eve = o.time === 'evening'; const objs = [];
  const L = 18, Hh = 5;
  objs.push(B([0, -0.05, -L / 2 + 1], [8, 0.1, L], C('#8a6a4a'), { tex: T.wood, uvr: [0, 0, 4, 9] }));
  objs.push(B([0, Hh, -L / 2 + 1], [8, 0.1, L], C('#e8dcc4')));
  for (let z = 0; z > -L + 1; z -= 3) objs.push(B([0, Hh - 0.1, z], [6, 0.12, 0.3], C('#6b4a32')));
  for (const sx of [-1, 1]) {
    objs.push(B([sx * 4, Hh / 2, -L / 2 + 1], [0.1, Hh, L], C('#5a3e28')));
    for (let i = 0; i < 6; i++) { const y = 0.3 + i * 0.68; objs.push(B([sx * 3.75, y, -L / 2 + 1], [0.45, 0.05, L], C('#6b4a32'))); objs.push(O('plane', [sx * 3.62, y + 0.3, -L / 2 + 1], [0, -sx * PI / 2, 0], [L, 0.56, 1], [1.05, 1.05, 1.05], { tex: T3.spines, uvr: [i * 0.37, 0, 14, 1], noShadow: true })); }
    for (let z = 0.5; z > -L + 1; z -= 3) objs.push(B([sx * 3.72, Hh / 2, z], [0.5, Hh, 0.12], C('#4a3220')));
  }
  // end window (arched feel: tall + glow beam)
  const zE = -L + 1;
  objs.push(B([0, Hh / 2, zE], [8, Hh, 0.1], C('#e8dcc4'), { tex: T.plaster }));
  objs.push(O('plane', [0, 2.6, zE + 0.07], [0, 0, 0], [2.4, 3.6, 1], [1.3, 1.3, 1.3], { mode: 1, tex: eve ? T.dawn : T.morning, noShadow: true }));
  objs.push(B([0, 2.6, zE + 0.1], [0.08, 3.6, 0.06], C('#4a3220')), B([0, 2.6, zE + 0.1], [2.4, 0.08, 0.06], C('#4a3220')));
  objs.push(O('plane', [0, 1.8, zE + 5], [-0.45, 0, 0], [2.6, 11, 1], C(eve ? '#ffb080' : '#fff0d0', 0.08), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  const r = rnd(14);
  for (let i = 0; i < 60; i++) { const ph = r(), k = mod(t * 0.03 + ph, 1); objs.push(O('sph', [(r() - 0.5) * 2.2, 0.6 + mod(r() * 3 + Math.sin(t * 0.3 + i) * 0.2, 3.2), zE + 1 + r() * 8], [0, 0, 0], [0.012, 0.012, 0.012], C('#fff4d8', 1.6 * Math.sin(k * PI)), { mode: 1, noShadow: true })); }
  // reading tables with green lamps + readers
  const tz = [-0.9, -4.2, -7.5, -10.8];
  const pls = [];
  tz.forEach((z, i) => {
    objs.push(B([0, 0.76, z], [1.3, 0.06, 2.6], C('#6b4a32')), B([0, 0.38, z - 1.1], [1.1, 0.76, 0.08], C('#4a3220')), B([0, 0.38, z + 1.1], [1.1, 0.76, 0.08], C('#4a3220')));
    for (const dz of (i === 0 ? [-0.7] : [-0.7, 0.7])) {
      objs.push(B([0, 0.82, z + dz], [0.06, 0.06, 0.06], C('#c8a050')), B([0, 1.0, z + dz], [0.02, 0.36, 0.02], C('#c8a050')));
      objs.push(B([0, 1.18, z + dz], [0.22, 0.08, 0.42], C('#1f6a3a', 1.4)), B([0, 1.135, z + dz], [0.16, 0.01, 0.36], C('#fff0c0', 5), { mode: 1, noShadow: true }));
    }
    if (pls.length < 7) pls.push({ p: [0, 1.0, z], c: C('#ffe0a0', i === 0 ? 1.4 : 1.8), r: 2.6 });
    if (i > 0) for (const sx of [-1, 1]) if (r() < 0.75) {
      const zz = z + (r() - 0.5) * 1.4;
      objs.push(...person(M4.trs([sx * 1.0, 0.02, zz], [0, -sx * PI / 2, 0]), { skin: ['#c68e62', '#8d5a3b', '#e0b48c'][(r() * 3) | 0], shirt: ['#7a3d4d', '#2d3a55', '#556b2f', '#8a6a4a'][(r() * 4) | 0], pants: '#2d2d33', sit: true, hijab: r() < 0.4 ? '#e3d8c6' : null, bow: 0.25, armL: 1.2, armR: 1.2, face: 'flat' }));
      objs.push(B([sx * 0.4, 0.8, zz], [0.3, 0.02, 0.22], C('#f2ead6')));
      objs.push(B([sx * 1.0, 0.45, zz], [0.45, 0.05, 0.45], C('#4a3220')));
    }
  });
  // my open book (pages turn)
  const BZ = -0.55, BY = 0.8;
  objs.push(B([0, BY, BZ], [0.48, 0.025, 0.32], C('#1f3a5a')));
  for (const sx of [-1, 1]) objs.push(O('box', [sx * 0.115, BY + 0.018, BZ], [0, 0, sx * -0.05], [0.22, 0.01, 0.3], [1, 1, 1], { tex: T4.page }));
  if (o.turn !== false) {
    const per = 5, ph = mod(t, per) / per, ang = sstep(0.55, 0.9, ph) * PI;
    if (ph > 0.5) objs.push(G(M4.trs([0, BY + 0.03, BZ], [0, 0, ang]), M4.trs([0.11, 0, 0], [0, 0, 0], [0.22, 0.005, 0.3]), 'box', [1, 1, 1], { tex: T4.page }));
  }
  const cam = { pos: [0.05, 1.25, 0.4], target: [Math.sin(t * 0.2) * 0.2, 0.75, -6], up: [0, 1, 0], fov: 64 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  objs.push(...povArm(CW, [-0.3, -0.62, 0.05], [-0.17, -0.42, -0.62], POV_SLEEVE(), POV_SKIN()), ...povArm(CW, [0.3, -0.62, 0.05], [0.18, -0.43, -0.6], POV_SLEEVE(), POV_SKIN()));
  pls.push({ p: [0, 3.5, zE + 2], c: C(eve ? '#ffb080' : '#fff4e0', 1.6), r: 8 });
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C(eve ? '#a08070' : '#d8d0c0', 0.5), gnd: C('#503828', 0.3) },
    pls, fog: { col: C('#3a2a1a'), d: 0.03, start: 8 }, clear: [0, 0, 0],
    post: { exposure: 1.05, bloom: 0.7, th: 0.9, vig: 0.5, warm: 0.4, fade: fadeIO(t, dur) },
  };
}

// ---------- GYM (treadmills facing a sunset window) ----------
function sceneGym(t, dur, o) {
  ensureT4(); o = o || {}; const night = o.time === 'night'; const run = o.run !== false; const objs = [];
  const zw = -4.6;
  objs.push(B([0, -0.05, -1.5], [12, 0.1, 9], C('#2a2c30'), { tex: T.asphalt, uvr: [0, 0, 6, 4] }));
  objs.push(B([0, 3.4, -1.5], [12, 0.1, 9], C('#3a3c42')));
  for (let x = -4; x <= 4; x += 2) objs.push(B([x, 3.33, -1.5], [0.25, 0.03, 7], C('#f4f8ff', 2.4), { mode: 1, noShadow: true }));
  objs.push(B([0, 0.4, zw], [12, 0.8, 0.2], C('#4a4c52')), B([0, 3.2, zw], [12, 0.4, 0.2], C('#4a4c52')));
  objs.push(O('plane', [0, 1.95, zw - 0.05], [0, 0, 0], [12, 2.4, 1], [1.25, 1.25, 1.25], { mode: 1, tex: night ? T.night : T4.cityDusk, uvr: [0, 0, 1.6, 1], noShadow: true }));
  for (let x = -5; x <= 5; x += 2) objs.push(B([x, 1.95, zw], [0.12, 2.4, 0.16], C('#2a2c30')));
  objs.push(B([-6, 1.7, -1.5], [0.1, 3.4, 9], C('#c8ccd0'), { tex: T.plaster }));
  objs.push(B([-5.92, 1.6, -1.5], [0.02, 2.4, 7], C('#30384a'), { mode: 1 }));
  objs.push(B([6, 1.7, -1.5], [0.1, 3.4, 9], C('#c8ccd0')), B([0, 1.7, 3], [12, 3.4, 0.1], C('#c8ccd0')));
  // dumbbell rack along the right wall
  objs.push(B([5.4, 0.5, -1.5], [0.6, 0.06, 4], C('#222')), B([5.4, 0.85, -1.5], [0.6, 0.06, 4], C('#222')));
  for (let i = 0; i < 10; i++) for (const y of [0.6, 0.95]) objs.push(O('cyl', [5.4, y, -3.2 + i * 0.38], [PI / 2, 0, 0], [0.16, 0.3, 0.16], C('#111')));
  // treadmills
  const lanes = [-2.6, -1.3, 0, 1.3, 2.6], me = 0; const r = rnd(9);
  for (const [x, z] of [...lanes.map(x => [x, -2.6]), ...lanes.map(x => [x, 0.2])]) {
    objs.push(B([x, 0.12, z], [0.8, 0.24, 1.9], C('#3a3c42')), O('box', [x, 0.245, z], [0, 0, 0], [0.62, 0.01, 1.7], [1, 1, 1], { tex: T4.belt, uvr: [0, mod(t * 2.5, 1), 1, 4] }));
    for (const sx of [-1, 1]) objs.push(seg(M4.ident(), [x + sx * 0.36, 0.2, z - 0.8], [x + sx * 0.36, 1.25, z - 0.95], [0.05, 0.05], C('#55585e')));
    objs.push(B([x, 1.25, z - 0.97], [0.8, 0.05, 0.05], C('#55585e')), O('box', [x, 1.38, z - 1.0], [-0.5, 0, 0], [0.5, 0.28, 0.06], C('#1a1c20')), O('plane', [x, 1.39, z - 0.966], [-0.5, 0, 0], [0.44, 0.22, 1], [1.4, 1.4, 1.4], { mode: 1, tex: T4.tread, noShadow: true }));
    if (x !== me && r() < 0.85) objs.push(...person(M4.trs([x, 0.25, z + 0.1], [0, PI, 0]), { skin: ['#c68e62', '#8d5a3b', '#e0b48c'][(r() * 3) | 0], shirt: ['#c03a3a', '#2d3a55', '#3a8a5a', '#e8e8e8'][(r() * 4) | 0], pants: '#1d1d22', walk: 1.4, phase: t * 9 + x * 2, hair: '#1a1a1a', face: 'flat' }));
  }
  const bob = run ? Math.abs(Math.sin(t * 4.5)) * 0.04 : 0;
  const cam = { pos: [me + 0.02, 1.95 + bob, 0.55], target: [me + 0.6, 1.25 + bob * 0.5, -8], up: [Math.sin(t * 4.5) * 0.006 * (run ? 1 : 0), 1, 0], fov: 66 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const sw = run ? Math.sin(t * 4.5) * 0.04 : 0;
  if (o.hands !== false) objs.push(...povArm(CW, [-0.3, -0.62, 0.05], [-0.2, -0.36 + sw, -0.5 - sw], C('#c03a3a'), POV_SKIN()), ...povArm(CW, [0.3, -0.62, 0.05], [0.22, -0.36 - sw, -0.5 + sw], C('#c03a3a'), POV_SKIN()));
  return {
    objs, cam, sun: { dir: night ? [0, -1, 0] : norm([0.4, -0.15, 1]), col: night ? [0, 0, 0] : C('#ffb070', 1.4), center: [0, 0, -2], ext: 7, on: !night },
    hemi: { sky: C(night ? '#506080' : '#c0a0b0', 0.55), gnd: C('#404040', 0.3) },
    pls: [{ p: [0, 3.0, -1], c: C('#eef4ff', 1.5), r: 7 }, { p: [0, 1.8, -4.2], c: C(night ? '#6080c0' : '#ffa070', 1.1), r: 5 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.05, bloom: 0.7, th: 0.95, vig: 0.45, warm: night ? 0.05 : 0.35, sat: 1.05, fade: fadeIO(t, dur) },
  };
}

// ---------- SUPERMARKET CHECKOUT (conveyor, cashier, paying) ----------
function sceneCheckout(t, dur, o) {
  ensureT4(); o = o || {}; const objs = [];
  objs.push(B([0, -0.05, -6], [16, 0.1, 18], C('#e0e0dc'), { tex: T3.tiles, uvr: [0, 0, 8, 9] }));
  objs.push(B([0, 3.6, -6], [16, 0.1, 18], C('#e8eaec')));
  for (let z = 1; z > -14; z -= 2.4) for (const x of [-3, 3]) objs.push(B([x, 3.53, z], [0.3, 0.03, 1.8], C('#f4f8ff', 3), { mode: 1, noShadow: true }));
  for (let i = 0; i < 5; i++) { const x = -6 + i * 3; objs.push(B([x, 1.1, -10], [1.0, 2.2, 6], C('#d8dadc'))); for (const sx of [-1, 1]) objs.push(O('plane', [x + sx * 0.505, 1.1, -10], [0, sx * PI / 2, 0], [6, 2.0, 1], [1.05, 1.05, 1.05], { tex: T4.products, uvr: [i * 0.2, 0, 4, 1], noShadow: true })); }
  objs.push(B([0, 1.8, -13.5], [16, 3.6, 0.1], C('#c8ccd0'), { tex: T.plaster }));
  // checkout lane
  const CZ = -1.6;
  objs.push(B([-0.55, 0.45, CZ], [0.8, 0.9, 3.6], C('#3a5a8a')), O('box', [-0.55, 0.91, CZ], [0, 0, 0], [0.62, 0.02, 3.4], [1, 1, 1], { tex: T4.belt, uvr: [0, mod(-t * 0.4, 1), 1, 6] }));
  const items = [['box', [0.2, 0.25, 0.14], '#d94a3a'], ['cyl', [0.14, 0.22, 0.14], '#f0f0f0'], ['box', [0.25, 0.08, 0.18], '#f0c030'], ['cyl', [0.1, 0.28, 0.1], '#3aa05a'], ['box', [0.16, 0.16, 0.16], '#3a7ad9'], ['sph', [0.16, 0.16, 0.16], '#f08a30'], ['box', [0.3, 0.12, 0.2], '#8a3ad0']];
  items.forEach(([m, s, c], i) => { const z = CZ + 1.6 - mod(t * 0.35 + i * 0.5, 3.5); if (z < CZ - 1.6) return; objs.push(O(m, [-0.55 + ((i * 37) % 5 - 2) * 0.05, 0.92 + s[1] / 2, z], [0, i, 0], s, C(c))); });
  objs.push(B([-0.55, 1.0, CZ + 0.4], [0.62, 0.12, 0.03], C('#888'))); // divider
  objs.push(B([0.6, 0.5, CZ - 1.4], [0.9, 1.0, 0.8], C('#d8dadc')), O('box', [0.6, 1.25, CZ - 1.55], [0, -0.5, 0], [0.4, 0.28, 0.04], C('#1a1c20')), O('plane', [0.588, 1.25, CZ - 1.53], [0, -0.5, 0], [0.36, 0.24, 1], [1.4, 1.4, 1.4], { mode: 1, tex: T4.till, noShadow: true }));
  objs.push(B([0.05, 1.04, CZ - 0.6], [0.12, 0.18, 0.08], C('#222')), B([0.05, 1.12, CZ - 0.555], [0.08, 0.05, 0.005], C('#60c0ff', 2), { mode: 1 }));
  objs.push(B([-0.55, 2.4, CZ - 1.6], [0.06, 0.8, 0.06], C('#888')), B([-0.55, 2.85, CZ - 1.6], [0.5, 0.3, 0.12], C('#2a6a3a')), O('plane', [-0.55, 2.85, CZ - 1.535], [0, 0, 0], [0.46, 0.26, 1], C('#ffffff', 1.4), { mode: 1, tex: T4.awn[1], uvr: [0, 0, 1, 0.2], noShadow: true }));
  const cw = o.cashier === 'man';
  objs.push(...person(M4.trs([1.0, 0, CZ - 0.9], [0, -PI / 4, 0]), { skin: '#9a6644', shirt: '#c03a3a', pants: '#2d2d33', hijab: cw ? null : '#2d3a55', hair: '#1a1a1a', armL: 0.9, armR: 0.6, face: 'smile' }));
  if (o.queue !== false) objs.push(...person(M4.trs([0.25, 0, CZ - 0.2], [0, PI - 0.25, 0]), { skin: '#c68e62', shirt: '#556b2f', pants: '#3a3a40', hair: '#3a2a1a', armL: 0.5, armR: 0.3, face: 'flat' }));
  // other lanes
  for (const x of [-3.4, 3.4]) { objs.push(B([x, 0.45, CZ - 0.5], [0.8, 0.9, 3.0], C('#3a5a8a')), B([x, 2.85, CZ - 1.6], [0.5, 0.3, 0.12], C('#2a6a3a'))); }
  objs.push(...person(M4.trs([4.1, 0, CZ - 0.5], [0, PI, 0]), { skin: '#8d5a3b', shirt: '#7a3d4d', pants: '#2d2d33', hijab: '#d9cfc0', face: 'flat' }));
  const cam = { pos: [0.55, 1.6, 0.9], target: [-0.1, 1.0, -2.6], up: [0, 1, 0], fov: 64 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const pay = o.pay != null ? o.pay : 0.6;
  const reach = sstep(dur * pay, dur * Math.min(0.98, pay + 0.2), t);
  const hp = lerp3([0.14, -0.36, -0.5], [-0.05, -0.27, -0.95], reach);
  objs.push(...povArm(CW, [0.32, -0.62, 0.05], hp, POV_SLEEVE(), POV_SKIN(), [-1.0, 0.2, 0]));
  objs.push(G(M4.mul(CW, M4.trs(add(hp, [-0.01, 0.025, -0.02]), [-1.0, 0.2, 0])), M4.trs([0, 0, 0], [0, 0, 0], [0.085, 0.004, 0.054]), 'box', C('#1f5a8a')));
  objs.push(...povArm(CW, [-0.32, -0.62, 0.05], [-0.2, -0.5, -0.45], POV_SLEEVE(), POV_SKIN()));
  return {
    objs, cam, sun: { dir: [0, -1, 0], col: [0, 0, 0], on: false },
    hemi: { sky: C('#f0f4f8', 0.8), gnd: C('#a0a0a0', 0.35) },
    pls: [{ p: [0, 3.2, -1], c: C('#f4f8ff', 1.4), r: 6 }, { p: [0, 3.2, -8], c: C('#f4f8ff', 1.2), r: 7 }],
    fog: { col: C('#e8eaec'), d: 0.03, start: 8 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.45, th: 1.1, vig: 0.4, warm: 0.05, sat: 0.95, fade: fadeIO(t, dur) },
  };
}

// ---------- CLASSROOM / EXAM (heads down, wall clock, pen writing) ----------
function sceneClassroom(t, dur, o) {
  ensureT4(); o = o || {}; const objs = [];
  const room = { w: 8, d: 9, h: 3.2 };
  objs.push(B([0, -0.05, -3.5], [8, 0.1, 9], C('#b89a78'), { tex: T.wood, uvr: [0, 0, 4, 4] }));
  objs.push(B([0, 3.2, -3.5], [8, 0.1, 9], C('#ecebe6')));
  for (const z of [-1, -4, -7]) objs.push(B([0, 3.14, z], [3, 0.03, 0.3], C('#f4f8ff', 2.4), { mode: 1, noShadow: true }));
  objs.push(B([4, 1.6, -3.5], [0.1, 3.2, 9], C('#e6dccb'), { tex: T.plaster }), B([0, 1.6, -8], [8, 3.2, 0.1], C('#e6dccb'), { tex: T.plaster }), B([0, 1.6, 1], [8, 3.2, 0.1], C('#e6dccb')));
  // window wall on the left
  objs.push(B([-4, 0.45, -3.5], [0.1, 0.9, 9], C('#e6dccb')), B([-4, 3.0, -3.5], [0.1, 0.4, 9], C('#e6dccb')));
  objs.push(O('plane', [-3.96, 1.85, -3.5], [0, PI / 2, 0], [9, 1.9, 1], [1.3, 1.3, 1.3], { mode: 1, tex: T.morning, uvr: [0, 0, 2, 1], noShadow: true }));
  for (let z = 0.5; z > -8; z -= 1.5) objs.push(B([-3.95, 1.85, z], [0.08, 1.9, 0.08], C('#f4f4f0')));
  // board + clock
  objs.push(B([0, 1.75, -7.92], [4.6, 1.5, 0.06], C('#4a3a2a')), O('plane', [0, 1.75, -7.88], [0, 0, 0], [4.4, 1.35, 1], [1.0, 1.0, 1.0], { tex: T4.chalk, noShadow: true }));
  const CK = [2.9, 2.55, -7.9];
  objs.push(O('cyl', CK, [PI / 2, 0, 0], [0.5, 0.06, 0.5], C('#222')), O('plane', add(CK, [0, 0, 0.035]), [0, 0, 0], [0.44, 0.44, 1], [1.3, 1.3, 1.3], { tex: T4.clock, noShadow: true }));
  const [hh, mm] = (o.clock || '10:52').split(':').map(Number);
  const secs = t + (o.fast ? t * 59 : 0), mins = mm + secs / 60, hrs = (hh % 12) + mins / 60;
  const hand = (ang, L, w, c, dz) => G(M4.trs(add(CK, [0, 0, 0.04 + dz]), [0, 0, -ang]), M4.trs([0, L / 2 - 0.02, 0], [0, 0, 0], [w, L, 0.01]), 'box', C(c), { mode: 1, noShadow: true });
  objs.push(hand(hrs / 12 * PI * 2, 0.12, 0.02, '#111', 0), hand(mins / 60 * PI * 2, 0.18, 0.014, '#111', 0.004), hand(secs / 60 * PI * 2, 0.19, 0.006, '#c02020', 0.008));
  // desks + students heads down
  const r = rnd(33);
  for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
    const x = -2.4 + col * 1.6, z = -1.5 - row * 1.5;
    objs.push(B([x, 0.72, z], [0.9, 0.05, 0.6], C('#c8a878')), B([x, 0.36, z], [0.06, 0.72, 0.06], C('#555')));
    objs.push(B([x, 0.74, z + 0.05], [0.24, 0.005, 0.32], C('#f7f6f2')));
    objs.push(B([x, 0.45, z + 0.55], [0.42, 0.05, 0.4], C('#3a5a8a')), B([x, 0.7, z + 0.78], [0.42, 0.45, 0.04], C('#3a5a8a')));
    if (r() < 0.85 && !(row === 0 && Math.abs(x) < 1)) objs.push(...person(M4.trs([x, 0.0, z + 0.45], [0, PI, 0]), { skin: ['#c68e62', '#8d5a3b', '#e0b48c', '#7a5238'][(r() * 4) | 0], shirt: ['#2d3a55', '#7a3d4d', '#556b2f', '#d8d2c4', '#4a4a4a'][(r() * 5) | 0], pants: '#2d2d33', sit: true, hijab: r() < 0.35 ? ['#e3d8c6', '#2d3a55', '#6a4a6a'][(r() * 3) | 0] : null, bow: 0.35 + r() * 0.15, armL: 1.3, armR: 1.25, face: 'flat' }));
  }
  // my desk (back row centre aisle)
  const MZ = 0.0, MX = 0.0;
  objs.push(B([MX, 0.72, MZ - 0.25], [0.9, 0.05, 0.6], C('#c8a878')), O('box', [MX - 0.02, 0.75, MZ - 0.25], [0, 0.08, 0], [0.24, 0.004, 0.33], [1.05, 1.05, 1.05], { tex: T4.exam }));
  const k = clamp(t / dur, 0, 1), up = sstep(o.lookUp != null ? o.lookUp : 0.6, Math.min(1, (o.lookUp != null ? o.lookUp : 0.6) + 0.15), k);
  const cam = { pos: [MX, 1.25 + up * 0.15, MZ + 0.35], target: lerp3([MX - 0.05, 0.5, MZ - 1.6], [CK[0] - 0.6, CK[1] - 0.75, CK[2]], up), up: [0, 1, 0], fov: 62 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  const wr = o.write === false ? 0 : (1 - up);
  const pen = [0.04 + Math.sin(t * 7) * 0.025 * wr, -0.3 + Math.sin(t * 13) * 0.006 * wr - up * 0.15, -0.55];
  objs.push(...povArm(CW, [0.3, -0.62, 0.05], pen, POV_SLEEVE(), POV_SKIN(), [-0.9, 0.2, 0.3]));
  objs.push(G(M4.mul(CW, M4.trs(pen, [-0.9, 0.2, 0.3])), M4.trs([-0.01, 0.02, -0.06], [0.9, 0, 0], [0.012, 0.15, 0.012]), 'box', C('#2050c0')));
  objs.push(...povArm(CW, [-0.32, -0.62, 0.05], [-0.18, -0.36 - up * 0.15, -0.55], POV_SLEEVE(), POV_SKIN()));
  return {
    objs, cam, sun: { dir: norm([0.7, -0.5, -0.2]), col: C('#fff0d8', 1.6), center: [0, 0, -3.5], ext: 7 },
    hemi: { sky: C('#e0e8f0', 0.6), gnd: C('#907860', 0.3) },
    pls: [{ p: [0, 2.9, -2], c: C('#f4f8ff', 1.0), r: 6 }, { p: [0, 2.9, -6], c: C('#f4f8ff', 1.0), r: 6 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.5, th: 1.05, vig: 0.45, warm: 0.15, fade: fadeIO(t, dur) },
  };
}

// ---------- SNOWY STREET AT NIGHT (falling snow, footprints to the mosque) ----------
function sceneSnow(t, dur, o) {
  ensureT4(); o = o || {}; const objs = []; const walk = o.walk !== false;
  const camZ = 2 - t * (walk ? 1.0 : 0);
  objs.push(B([0, -0.05, -60], [60, 0.1, 160], C('#dfe6f2'), { tex: T4.snowGround, uvr: [0, 0, 20, 50] }));
  const r = rnd(61);
  for (const sd of [-1, 1]) for (let z = 8; z > -90; z -= 8 + r() * 3) {
    const h = 5 + r() * 6, w = 6, x = sd * (6.5 + w / 2);
    objs.push(B([x, h / 2, z], [w, h, 7.4], C('#ffffff', 0.5), { mode: 1, tex: T2.nightFacade[(r() * 2) | 0], uvr: [0, 0, 2, Math.max(1, Math.round(h / 6))] }));
    objs.push(B([x, h + 0.12, z], [w + 0.3, 0.25, 7.7], C('#e8eef8')));
    objs.push(B([sd * 6.3, 0.2, z], [0.6, 0.4, 7], C('#e8eef8')));
  }
  const pls = [];
  for (let z = 6; z > -90; z -= 14) for (const sd of [-1, 1]) {
    const x = sd * 5.4, zz = z + (sd > 0 ? 7 : 0);
    objs.push(B([x, 1.8, zz], [0.12, 3.6, 0.12], C('#22252c')), O('box', [x, 3.7, zz], [0, 0, 0], [0.32, 0.38, 0.32], C('#ffd090', 5), { mode: 1 }), B([x, 3.94, zz], [0.42, 0.08, 0.42], C('#f0f4fa')));
    objs.push(O('plane', [x, 3.7, zz], [0, 0, 0], [2.6, 2.6, 1], C('#ffc070', 0.22), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
    objs.push(O('plane', [x * 0.95, 0.02, zz], [-PI / 2, 0, 0], [3.5, 3.5, 1], C('#ffb060', 0.09), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
    if (zz < camZ + 4 && zz > camZ - 40 && pls.length < 7) pls.push({ p: [x, 3.4, zz], c: C('#ffc890', 1.7), r: 9 });
  }
  // footprints of someone who went before
  for (let i = 0; i < 120; i++) { const z = 3 - i * 0.7; objs.push(O('box', [0.3 + (i % 2 ? 0.16 : -0.16), 0.006, z], [0, (i % 2 ? 0.08 : -0.08), 0], [0.1, 0.004, 0.22], C('#b4c0dc'), { noShadow: true })); }
  // parked car with snow
  car(objs, -4.2, -16, 0, '#4a5a6a'); objs.push(B([-4.2, 1.33, -16.2], [1.5, 0.12, 2.0], C('#f0f4fa')), B([-4.2, 0.9, -14.6], [1.7, 0.08, 1.0], C('#f0f4fa')));
  // mosque at the end of the street
  if (o.mosque !== false) {
    const MZ = -96;
    objs.push(B([0, 4, MZ], [14, 8, 8], C('#d8d0c0')), O('sph', [0, 8, MZ], [0, 0, 0], [8, 7, 8], C('#c8d8e0')), O('sph', [0, 8.3, MZ], [0, 0, 0], [8.2, 6.6, 8.2], C('#f4f8ff', 0.6)));
    objs.push(B([0, 2.2, MZ + 4.05], [2.4, 3.4, 0.1], C('#ffd890', 4), { mode: 1 }));
    for (const sx of [-4.5, -2.6, 2.6, 4.5]) objs.push(B([sx, 4.5, MZ + 4.05], [0.9, 1.6, 0.1], C('#ffd890', 2.5), { mode: 1 }));
    objs.push(O('cyl', [8, 9, MZ], [0, 0, 0], [1.5, 18, 1.5], C('#e0d8c8')), O('cyl', [8, 15, MZ], [0, 0, 0], [2.2, 0.5, 2.2], C('#ddd')), O('cyl', [8, 15.4, MZ], [0, 0, 0], [1.9, 0.3, 1.9], C('#60ff9a', 4), { mode: 1 }), O('cone', [8, 19.5, MZ], [0, 0, 0], [1.6, 3.2, 1.6], C('#c8d8e0')));
    objs.push(O('plane', [0, 3, MZ + 5], [0, 0, 0], [10, 7, 1], C('#ffc070', 0.25), { additive: true, mode: 3, tex: T.glow, noShadow: true }), O('plane', [8, 15.4, MZ + 1.5], [0, 0, 0], [5, 3, 1], C('#60ff9a', 0.2), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  }
  const bob = walk ? Math.sin(t * 4.8) * 0.025 : 0;
  const cam = { pos: [0.1, 1.62 + bob, camZ], target: [0, 1.9, camZ - 30], up: [0, 1, 0], fov: 64, far: 400 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  // breath puffs
  for (let i = 0; i < 2; i++) { const k = mod(t / 2.6 + i * 0.5, 1); if (k > 0.6) continue; const kk = k / 0.6; objs.push(G(CW, M4.trs([0, -0.14 + kk * 0.06, -0.35 - kk * 0.4], [0, 0, 0], [0.12 + kk * 0.35, 0.08 + kk * 0.2, 0.15]), 'sph', C('#e8f0ff', 0.12 * Math.sin(kk * PI)), { additive: true, mode: 3, tex: T.soft, noShadow: true })); }
  rainAround(objs, cam, t, 520, { snow: true, v: 0.9, h: 7, r: 9, top: 6.5, k: 1.3 });
  objs.push(skyDome(cam));
  const top = C('#0a1024'), hor = C('#3a4664');
  return {
    objs, cam, sun: { dir: norm([0.3, -0.8, -0.4]), col: C('#7a90d0', 0.35), center: [0, 0, camZ - 8], ext: 16 },
    hemi: { sky: C('#6a80b8', 0.45), gnd: C('#c8d0e8', 0.25) },
    pls, sky: { top, hor, gnd: hor }, fog: { col: C('#3a4664'), d: 0.012, start: 15 }, clear: hor,
    post: { exposure: 1.1, bloom: 0.85, th: 0.85, vig: 0.5, warm: 0.0, sat: 0.95, fade: fadeIO(t, dur) },
  };
}

// ---------- SOUK / MARKET ALLEY (lanterns, spices, awnings, crowd) ----------
function sceneSouk(t, dur, o) {
  ensureT4(); o = o || {}; const objs = []; const day = o.time === 'day'; const walk = o.walk !== false;
  const camZ = 2 - t * (walk ? 0.8 : 0), Wd = 3.6, Hh = 5;
  objs.push(B([0, -0.05, -30], [Wd + 2, 0.1, 80], C('#b89a78'), { tex: T3.tiles, uvr: [0, 0, 2, 40] }));
  const r = rnd(77); const spice = ['#c0401a', '#e0a020', '#8a4a20', '#d8c040', '#a02a1a', '#6a7a30'];
  for (const sd of [-1, 1]) {
    objs.push(B([sd * (Wd / 2 + 0.3), Hh / 2, -30], [0.6, Hh, 80], C('#c8a070'), { tex: T.plaster }));
    for (let z = 4, i = 0; z > -60; z -= 3.2, i++) {
      const x = sd * (Wd / 2 - 0.1);
      objs.push(B([sd * (Wd / 2 - 0.02), 1.3, z], [0.1, 2.4, 2.4], C('#2a1a12')));
      objs.push(O('box', [sd * (Wd / 2 - 0.45), 2.55, z], [0, 0, sd * 0.35], [0.9, 0.03, 2.8], [1, 1, 1], { tex: T4.awn[(i + (sd > 0 ? 1 : 0)) % 4], uvr: [0, 0, 3, 1] }));
      const kind = (i + (sd > 0 ? 2 : 0)) % 3;
      if (kind === 0) { // spices
        objs.push(B([sd * (Wd / 2 - 0.45), 0.4, z], [0.7, 0.8, 2.2], C('#6b4a32')));
        for (let j = 0; j < 4; j++) { const zz = z - 0.8 + j * 0.53; objs.push(O('cyl', [sd * (Wd / 2 - 0.45), 0.86, zz], [0, 0, 0], [0.42, 0.12, 0.42], C('#8a6a4a')), O('cone', [sd * (Wd / 2 - 0.45), 1.04, zz], [0, j, 0], [0.4, 0.3, 0.4], C(spice[(i + j) % 6]))); }
      } else if (kind === 1) { // hanging rugs
        objs.push(O('plane', [sd * (Wd / 2 - 0.1), 1.35, z], [0, -sd * PI / 2, 0], [1.4, 2.0, 1], [1, 1, 1], { tex: T.rug, noShadow: true }));
        objs.push(B([sd * (Wd / 2 - 0.45), 0.35, z + 0.5], [0.6, 0.7, 0.9], C('#7a2a2a'), { tex: T.fabric }));
      } else { // lamps / brass
        objs.push(B([sd * (Wd / 2 - 0.4), 0.45, z], [0.6, 0.9, 2.2], C('#5a3e28')));
        for (let j = 0; j < 3; j++) objs.push(O('sph', [sd * (Wd / 2 - 0.4), 1.05, z - 0.6 + j * 0.6], [0, 0, 0], [0.3, 0.26, 0.3], C('#d8a840')), O('cyl', [sd * (Wd / 2 - 0.4), 1.25, z - 0.6 + j * 0.6], [0, 0, 0], [0.06, 0.18, 0.06], C('#c89830')));
      }
    }
  }
  // hanging lanterns across the alley
  const pls = [];
  for (let z = 1, i = 0; z > -60; z -= 4.2, i++) {
    const sw = Math.sin(t * 1.3 + i) * 0.12, LP = M4.trs([0, Hh - 0.3, z], [sw * 0.4, 0, sw]);
    objs.push(B([0, Hh - 0.3, z], [Wd + 0.6, 0.02, 0.02], C('#222')));
    objs.push(G(LP, M4.trs([0, -0.45, 0], [0, 0, 0], [0.02, 0.9, 0.02]), 'box', C('#222')));
    const lc = ['#ffb040', '#ff7040', '#ffd060', '#60c0a0'][i % 4];
    objs.push(G(LP, M4.trs([0, -1.05, 0], [0, PI / 4, 0], [0.28, 0.4, 0.28]), 'box', C(lc, 5), { mode: 1, noShadow: true }), G(LP, M4.trs([0, -0.8, 0], [0, 0, 0], [0.3, 0.1, 0.3]), 'cone', C('#3a2a1a')));
    objs.push(G(LP, M4.trs([0, -1.05, 0], [0, 0, 0], [1.8, 1.8, 1]), 'plane', C(lc, 0.25), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
    if (z < camZ + 3 && z > camZ - 22 && pls.length < 6) pls.push({ p: [0, Hh - 1.4, z], c: C(lc, day ? 0.4 : 1.1), r: 5 });
  }
  // people walking both ways
  for (let i = 0; i < 8; i++) {
    const dir = i % 2 ? 1 : -1, x = dir > 0 ? -0.75 : [0.75, -0.7, 0.8, -0.75][(i >> 1) % 4];
    const z = dir > 0 ? camZ - 2 - mod(i * 4.7 - t * 1.6, 26) : camZ - 3 - mod(i * 3.1 + t * 0.25, 18);
    if (dir > 0 && z > camZ - 2.2) continue;
    objs.push(...person(M4.trs([x, 0, z], [0, dir > 0 ? 0 : PI, 0]), { skin: ['#c68e62', '#8d5a3b', '#7a5238', '#e0b48c'][i % 4], shirt: ['#e8e2d4', '#7a3d4d', '#2d3a55', '#d8d2c4', '#556b2f'][i % 5], pants: i % 2 ? '#d8d2c4' : '#2d2d33', hijab: i % 3 === 1 ? '#3a2a4a' : null, walk: 1, phase: t * 4 + i, face: 'flat' }));
  }
  const bob = walk ? Math.sin(t * 4.6) * 0.025 : 0;
  const cam = { pos: [0.05, 1.62 + bob, camZ], target: [Math.sin(t * 0.35) * 0.8, 1.7, camZ - 20], up: [0, 1, 0], fov: 66, far: 400 };
  objs.push(skyDome(cam));
  const top = day ? C('#4a86d0') : C('#1c2250'), hor = day ? C('#c8d8e8') : C('#d07a5a');
  return {
    objs, cam, sun: { dir: day ? norm([0.3, -0.9, -0.2]) : norm([0.6, -0.25, -0.5]), col: C(day ? '#fff0d0' : '#ff9a60', day ? 2.4 : 0.8), center: [0, 0, camZ - 8], ext: 14 },
    hemi: { sky: C(day ? '#c8d8f0' : '#8070a0', day ? 0.6 : 0.4), gnd: C('#806040', 0.3) },
    pls, sky: { top, hor, gnd: hor }, fog: { col: day ? C('#e8d8c0') : C('#3a2a30'), d: 0.03, start: 10 }, clear: hor,
    post: { exposure: 1.05, bloom: 0.85, th: 0.9, vig: 0.5, warm: 0.5, sat: 1.1, fade: fadeIO(t, dur) },
  };
}

Object.assign(SCENES, { airport: sceneAirport, bus_stop: sceneBusStop, library: sceneLibrary, gym: sceneGym, checkout: sceneCheckout, classroom: sceneClassroom, snow_street: sceneSnow, souk: sceneSouk });
