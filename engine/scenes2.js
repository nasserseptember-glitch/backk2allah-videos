'use strict';
// Extra scenes: mosque_ext, mosque_int, rooftop, car_night, seaside, dinner
let T2 = null;
function ensureT2() {
  if (T2) return; T2 = {};
  T2.carpet = texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    g.fillStyle = '#8c2a2a'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#d9b25a'; g.lineWidth = 4; g.strokeRect(4, 4, w - 8, h - 8);
    g.beginPath(); g.moveTo(40, h - 20); g.lineTo(40, 90); g.quadraticCurveTo(40, 25, w / 2, 20); g.quadraticCurveTo(w - 40, 25, w - 40, 90); g.lineTo(w - 40, h - 20); g.stroke();
    g.fillStyle = '#7a2222'; g.fill();
    g.fillStyle = '#d9b25a'; g.beginPath(); g.arc(w / 2, 70, 8, 0, 7); g.fill();
    noiseFillOver(g, w, h, 0.06, 3);
  }), true);
  T2.nightFacade = [0, 1].map(k => texFromCanvas(mkCanvas(256, 512, (g, w, h) => {
    g.fillStyle = '#1a1d26'; g.fillRect(0, 0, w, h); const r = rnd(70 + k);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 9; j++) {
      const x = 14 + i * 60, y = 16 + j * 55, lit = r();
      g.fillStyle = lit > 0.62 ? (r() < 0.8 ? '#ffcf7a' : '#bcd7ff') : '#0c0e14'; g.fillRect(x, y, 38, 34);
    }
  })));
  T2.drops = texFromCanvas(mkCanvas(256, 256, (g, w, h) => {
    g.clearRect(0, 0, w, h); const r = rnd(4);
    for (let i = 0; i < 90; i++) { const x = r() * w, y = r() * h, s = 1 + r() * 3; const gr = g.createRadialGradient(x, y, 0, x, y, s * 2); gr.addColorStop(0, 'rgba(255,255,255,0.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, s * 2, 0, 7); g.fill(); }
    for (let i = 0; i < 14; i++) { const x = r() * w, y = r() * h; g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .5) * 4, y + 20 + r() * 40); g.stroke(); }
  }), true);
  T2.sand = texFromCanvas(mkCanvas(256, 256, (g, w, h) => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); noiseFillOver(g, w, h, 0.12, 2); }), true);
  T2.ecg = texFromCanvas(mkCanvas(256, 64, (g, w, h) => {
    g.fillStyle = '#04140c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3cff8a'; g.lineWidth = 2; g.beginPath();
    for (let x = 0; x <= w; x++) { const p = x % 64; const y = p > 28 && p < 34 ? (p < 31 ? 10 : 54) : 34; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  }), true);
}
function noiseFillOver(g, w, h, amt, seed) {
  const r = rnd(seed); for (let i = 0; i < w * h / 4 * 0.6; i++) { const v = (r() - 0.5) * amt; g.fillStyle = v > 0 ? `rgba(255,255,255,${v})` : `rgba(0,0,0,${-v})`; g.fillRect(r() * w, r() * h, 2, 2); }
}
const STARS = (() => { const r = rnd(99); const a = []; for (let i = 0; i < 260; i++) { const az = r() * PI * 2, el = Math.asin(0.05 + r() * 0.95); a.push([Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az), 0.5 + r() * 1.6, r() * 6]); } return a; })();
function skyStars(objs, cam, t, k = 1) {
  for (const [x, y, z, b, ph] of STARS) {
    const tw = 0.75 + 0.25 * Math.sin(t * 2 + ph);
    objs.push(O('box', add(cam.pos, [x * 450, y * 450, z * 450]), [0, 0, 0], [0.9, 0.9, 0.9], C('#ffffff', b * tw * k), { mode: 1, noShadow: true }));
  }
}
function skyMoon(objs, cam, dir, skyTop) {
  dir = norm(dir); const p = add(cam.pos, scl(dir, 430));
  objs.push(O('sph', p, [0, 0, 0], [14, 14, 14], C('#fff6dc', 1.5), { mode: 1, noShadow: true }));
  const side = norm(cross(dir, [0, 1, 0]));
  objs.push(O('sph', add(add(cam.pos, scl(dir, 424)), add(scl(side, 4.5), [0, 1.5, 0])), [0, 0, 0], [13.5, 13.5, 13.5], skyTop, { mode: 1, noShadow: true }));
  objs.push(O('plane', add(cam.pos, scl(dir, 440)), dirRot(scl(dir, -1)), [70, 70, 1], C('#bcd0ff', 0.05), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
}
const skyDome = (cam) => O('skyS', cam.pos, [0, 0, 0], [1200, 1200, 1200], [1, 1, 1], { mode: 2, em: [1, 0, 0], noShadow: true });
const fadeIO = (t, dur, a = 0.5, b = 0.4) => Math.min(sstep(0, a, t), 1 - sstep(dur - b, dur, t));
const MEN = ['#e9e4d8', '#d8d2c4', '#bfb8a8', '#f2efe8', '#9aa3ad', '#6f7a86', '#c9b9a7'];

// ---------- MOSQUE EXTERIOR ----------
function sceneMosqueExt(t, dur, o) {
  ensureT2(); o = o || {}; const dawn = o.time === 'dawn';
  const objs = [];
  objs.push(B([0, -0.05, -20], [220, 0.1, 220], C('#7d766e'), { tex: T.asphalt, uvr: [0, 0, 40, 40] }));
  objs.push(B([0, 0.01, -22], [26, 0.03, 24], C('#d6cdbd'), { tex: T.plaster, uvr: [0, 0, 8, 8] }));
  const wall = C('#efe7d8'), z0 = -34;
  objs.push(B([0, 4.5, z0], [24, 9, 16], wall, { tex: T.plaster, uvr: [0, 0, 4, 2] }));
  objs.push(O('sph', [0, 9, z0], [0, 0, 0], [12, 11, 12], C('#e7dfd0')));
  objs.push(B([0, 15.2, z0], [0.15, 1.6, 0.15], C('#d9b25a')));
  objs.push(O('sph', [0, 16.1, z0], [0, 0, 0], [0.5, 0.5, 0.5], C('#d9b25a')));
  for (const sx of [-1, 1]) objs.push(O('sph', [sx * 8.5, 9, z0 + 4], [0, 0, 0], [3.6, 3.2, 3.6], C('#e7dfd0')));
  for (const sx of [-1, 1]) {
    const mx = sx * 14.5;
    objs.push(O('cyl', [mx, 10, z0 + 6], [0, 0, 0], [1.7, 20, 1.7], wall));
    objs.push(O('cyl', [mx, 15.5, z0 + 6], [0, 0, 0], [2.6, 0.45, 2.6], wall));
    objs.push(O('cyl', [mx, 15.85, z0 + 6], [0, 0, 0], [2.4, 0.12, 2.4], C('#ffd28a', dawn ? 0.8 : 3), { mode: 1 }));
    objs.push(O('cone', [mx, 21.4, z0 + 6], [0, 0, 0], [1.5, 2.8, 1.5], C('#2f6b52')));
  }
  const glow = dawn ? 1.3 : 2.6;
  objs.push(O('plane', [0, 2.4, z0 + 8.03], [0, 0, 0], [2.8, 4.8, 1], C('#ffcf8a', glow), { mode: 1 }));
  objs.push(O('sph', [0, 4.8, z0 + 8.02], [0, 0, 0], [2.8, 2.8, 0.04], C('#ffcf8a', glow), { mode: 1 }));
  objs.push(B([0, 6.2, z0 + 8.1], [4.2, 0.3, 0.3], C('#d9b25a')));
  for (let x = -10; x <= 10; x += 3.3) { if (Math.abs(x) < 2) continue; objs.push(O('plane', [x, 5.8, z0 + 8.03], [0, 0, 0], [1.1, 2.0, 1], C('#ffd9a0', glow * 0.7), { mode: 1 })); objs.push(O('sph', [x, 6.8, z0 + 8.02], [0, 0, 0], [1.1, 1.1, 0.04], C('#ffd9a0', glow * 0.7), { mode: 1 })); }
  for (let z = -2; z > -22; z -= 6) for (const sx of [-1, 1]) {
    objs.push(B([sx * 4.5, 1.6, z], [0.12, 3.2, 0.12], C('#2e3036')));
    objs.push(O('sph', [sx * 4.5, 3.3, z], [0, 0, 0], [0.45, 0.45, 0.45], C('#ffe0a8', dawn ? 1 : 4), { mode: 1 }));
  }
  for (let i = 0; i < 6; i++) { const x = -10 + i * 4 + (i % 2) * 1.2; objs.push(O('sph', [x < 0 ? x - 6 : x + 6, 1.4, -14 - (i % 3) * 3], [0, 0, 0], [2.4, 2.8, 2.4], C('#3d5a3a'))); }
  // worshippers walking toward the door
  const r = rnd(8);
  for (let i = 0; i < 9; i++) {
    const x = (r() - 0.5) * 6, z = -4 - r() * 14 - t * 1.1, sp = 1.0 + r() * 0.3;
    if (z < z0 + 9) continue;
    objs.push(...person(M4.trs([x, 0.02, z], [0, PI, 0]), { skin: SKINS[i % 5], shirt: MEN[i % MEN.length], pants: MEN[(i + 3) % MEN.length], hijab: i % 4 === 1 ? '#3a3f55' : null, walk: 1, phase: i + t * 5.4 * sp }));
  }
  const camZ = 7 - t * (o.speed != null ? o.speed : 1.0);
  const bob = Math.sin(t * 5.4) * 0.03;
  const cam = { pos: [0.6, 1.62 + bob, camZ], target: [0, 5.5 + Math.sin(t * 0.2) * 0.3, z0], up: [0, 1, 0], fov: 66, far: 700 };
  const top = dawn ? C('#24365f') : C('#050a1a'), hor = dawn ? C('#e9a77c') : C('#1c2846');
  objs.push(skyDome(cam));
  if (!dawn) { skyStars(objs, cam, t); skyMoon(objs, cam, [0.35, 0.42, -1], top); }
  const pls = [{ p: [0, 2.5, z0 + 9.5], c: C('#ffc884', dawn ? 2 : 5), r: 14 }];
  for (const sx of [-1, 1]) pls.push({ p: [sx * 14.5, 15.8, z0 + 6], c: C('#ffd28a', dawn ? 0.5 : 2), r: 9 });
  for (let z = -2; z > -22; z -= 6) pls.push({ p: [4.5, 3.2, z], c: C('#ffd9a0', dawn ? 0.4 : 1.6), r: 7 }, { p: [-4.5, 3.2, z], c: C('#ffd9a0', dawn ? 0.4 : 1.6), r: 7 });
  return {
    objs, cam,
    sun: dawn ? { dir: [-0.6, -0.25, -0.5], col: C('#ffc48a', 2.2), center: [0, 4, -20], ext: 26 } : { dir: [-0.35, -0.42, 1], col: C('#8ea4e0', 0.35), center: [0, 4, -20], ext: 26 },
    hemi: dawn ? { sky: C('#a8b4d8', 0.5), gnd: C('#7a5a48', 0.3) } : { sky: C('#3a4878', 0.32), gnd: C('#1a1820', 0.2) },
    pls: pls.slice(0, 10), sky: { top, hor, gnd: hor }, fog: { col: hor, d: 0.008, start: 20 }, clear: hor,
    post: { exposure: dawn ? 1.0 : 1.15, bloom: 0.9, th: 0.9, vig: 0.5, warm: dawn ? 0.4 : 0.1, fade: fadeIO(t, dur) },
  };
}

// ---------- MOSQUE INTERIOR ----------
function sceneMosqueInt(t, dur, o) {
  ensureT2(); o = o || {};
  const objs = []; const wall = C('#efe6d4');
  objs.push(B([0, -0.05, -5], [18, 0.1, 22], [1, 1, 1], { tex: T2.carpet, uvr: [0, 0, 9, 11] }));
  objs.push(B([0, 7.05, -5], [18, 0.1, 22], wall));
  for (const sx of [-1, 1]) objs.push(B([sx * 9, 3.5, -5], [0.2, 7, 22], wall, { tex: T.plaster, uvr: [0, 0, 6, 2] }));
  objs.push(B([0, 3.5, -16], [18, 7, 0.2], wall, { tex: T.plaster, uvr: [0, 0, 6, 2] }));
  objs.push(B([0, 3.5, 6], [18, 7, 0.2], wall));
  // mihrab
  objs.push(B([0, 1.8, -15.85], [2.4, 3.6, 0.1], C('#2f6b52')));
  objs.push(O('plane', [0, 1.7, -15.78], [0, 0, 0], [1.8, 3.2, 1], C('#e9c98a', 1.3), { mode: 1 }));
  objs.push(O('sph', [0, 3.3, -15.79], [0, 0, 0], [1.8, 1.8, 0.04], C('#e9c98a', 1.3), { mode: 1 }));
  objs.push(B([0, 4.0, -15.84], [3.0, 0.25, 0.12], C('#d9b25a')));
  // minbar (steps) right of mihrab
  for (let i = 0; i < 5; i++) objs.push(B([2.4, 0.15 + i * 0.3, -15.2 + i * 0.25], [0.9, 0.3 + i * 0.6, 0.5], C('#6b4a32')));
  // columns + arches
  for (const sx of [-1, 1]) for (let z = 2; z > -15; z -= 4) {
    objs.push(O('cyl', [sx * 5, 2.4, z], [0, 0, 0], [0.55, 4.8, 0.55], C('#f4efe4')));
    objs.push(B([sx * 5, 5.2, z - 2], [0.5, 0.9, 4], C('#e7dccb')));
  }
  // high windows
  for (const sx of [-1, 1]) for (let z = 2; z > -14; z -= 4) objs.push(O('plane', [sx * 8.88, 5.3, z - 2], [0, -sx * PI / 2, 0], [1.2, 1.8, 1], C('#cfe0ff', o.night ? 0.25 : 1.6), { mode: 1, noShadow: true }));
  // chandelier
  const ch = [0, 5.3, -6];
  objs.push(B([0, 6.2, -6], [0.04, 1.6, 0.04], C('#555')));
  for (let i = 0; i < 16; i++) { const a = i / 16 * PI * 2; objs.push(O('sph', [ch[0] + Math.cos(a) * 1.6, ch[1], ch[2] + Math.sin(a) * 1.6], [0, 0, 0], [0.16, 0.22, 0.16], C('#ffe2a8', 6), { mode: 1 })); }
  objs.push(O('cyl', ch, [0, 0, 0], [3.4, 0.08, 3.4], C('#b8933e')));
  // worshippers in rows facing qibla (-z); bow timeline
  let bow = 0; for (const [a, b] of (o.ruku || [])) bow = Math.max(bow, sstep(a, a + 0.8, t) * (1 - sstep(b, b + 0.8, t)));
  const rows = o.rows || 3; const r = rnd(12);
  for (let row = 0; row < rows; row++) for (let i = 0; i < 9; i++) {
    const x = -4 + i * 1.0, z = -2.2 - row * 1.4;
    objs.push(...person(M4.trs([x, 0.02, z], [0, PI, 0]), { skin: SKINS[(i + row) % 5], shirt: MEN[(i * 3 + row) % MEN.length], pants: MEN[(i + row * 2) % MEN.length], hair: '#1a1410', armL: 0.9 + bow * 0.4, armR: 0.9 + bow * 0.4, bow: bow * 1.45, face: 'flat' }));
  }
  const sway = Math.sin(t * 0.4) * 0.05;
  let pos = [0.4 + sway, 1.65, 1.6 - (o.walkIn ? (1 - sstep(0, dur * 0.7, t)) * -3.5 : 0)], target = [0, 1.6, -14];
  if (o.povBow) { pos = lerp3(pos, [0.4, 1.25, 0.1], bow); target = lerp3(target, [0.4, 0, -1.4], bow); }
  const cam = { pos, target, up: [0, 1, 0], fov: 66 };
  const pls = [{ p: ch, c: C('#ffd8a0', 3.2), r: 12 }, { p: [0, 2, -14.8], c: C('#ffd090', 1.4), r: 6 }, { p: [-5, 4, -1], c: C('#ffe0b0', 0.8), r: 8 }, { p: [5, 4, -1], c: C('#ffe0b0', 0.8), r: 8 }];
  return {
    objs, cam,
    sun: { dir: [0.5, -0.6, -0.3], col: C('#ffe4c0', o.night ? 0 : 1.2), center: [0, 2, -6], ext: 12, on: !o.night },
    hemi: { sky: C('#e8dcc8', o.night ? 0.25 : 0.55), gnd: C('#6a3a2a', 0.3) },
    pls, fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.0, bloom: 0.75, th: 1.0, vig: 0.45, warm: 0.35, fade: fadeIO(t, dur) },
  };
}

// ---------- ROOFTOP AT NIGHT ----------
let CITY = null;
function sceneRooftop(t, dur, o) {
  ensureT2(); o = o || {};
  if (!CITY) { const r = rnd(31); CITY = []; for (let i = 0; i < 220; i++) { const x = (r() - 0.5) * 360, z = -18 - r() * 260; CITY.push([x, z, 6 + r() * 34, 8 + r() * 14, (r() * 2) | 0]); } }
  const objs = [];
  objs.push(B([0, -0.05, 0], [10, 0.1, 9], C('#6e6a64'), { tex: T.asphalt, uvr: [0, 0, 4, 4] }));
  objs.push(B([0, 0.45, -3.6], [10, 0.9, 0.3], C('#8f877d')));
  objs.push(B([3.2, 0.9, 1.5], [1.6, 1.8, 1.2], C('#7a7a7e')));
  objs.push(O('cyl', [-3.4, 1.2, 2.5], [0, 0, 0], [1.4, 2.4, 1.4], C('#8a8f96')));
  const G0 = -40;
  objs.push(B([0, G0, -140], [700, 0.2, 400], C('#14161c')));
  for (const [x, z, h, w, k] of CITY) objs.push(B([x, G0 + h / 2, z], [w, h, w], C('#ffffff', 1.25), { mode: 1, tex: T2.nightFacade[k], uvr: [0, 0, Math.max(1, Math.round(w / 6)), Math.max(1, Math.round(h / 10))] }));
  for (let i = 0; i < 40; i++) { const z = -30 - i * 7; objs.push(O('sph', [-6, G0 + 0.6, z], [0, 0, 0], [0.5, 0.5, 0.5], C('#ffb060', 5), { mode: 1 }), O('sph', [6, G0 + 0.6, z - 3], [0, 0, 0], [0.5, 0.5, 0.5], C('#ffb060', 5), { mode: 1 })); }
  const pan = Math.sin(t / dur * PI - PI / 2) * 0.35;
  const cam = { pos: [0.2, 1.3, -3.25], target: [Math.sin(pan) * 25, -9, -3.25 - Math.cos(pan) * 25], up: [0, 1, 0], fov: 68, far: 700 };
  // legs over the edge
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  if (o.legs) for (const sx of [-1, 1]) objs.push(O('box', [0.2 + sx * 0.14, 0.95, -3.55], [0.15, 0, 0], [0.16, 0.16, 0.6], C('#2d3a55')), O('box', [0.2 + sx * 0.14, 0.7, -3.88], [0, 0, 0], [0.16, 0.5, 0.17], C('#2d3a55')));
  if (o.phone) { const pp = [0.0, -0.16, -0.36]; objs.push(...phone(CW, pp, [0.4, 0, 0], T.scrFeed, [0, 0.8 - ((t * 0.05) % 0.8), 1, 0.125], 1.0)); objs.push(...povArm(CW, [-0.22, -0.45, -0.1], [-0.05, pp[1] - 0.05, pp[2] + 0.01], C('#2d3a55'), C('#a8714c')), ...povArm(CW, [0.24, -0.45, -0.1], [0.05, pp[1] - 0.05, pp[2] + 0.01], C('#2d3a55'), C('#a8714c'))); }
  const top = C('#04081a'), hor = C('#2a2c48');
  objs.push(skyDome(cam)); skyStars(objs, cam, t); skyMoon(objs, cam, [-0.5, 0.35, -1], top);
  return {
    objs, cam,
    sun: { dir: [0.5, -0.5, 1], col: C('#8ea4e0', 0.3), center: [0, 0, -1], ext: 6 },
    hemi: { sky: C('#3a4878', 0.3), gnd: C('#2a2020', 0.2) },
    pls: [{ p: [0, 0.6, -6], c: C('#ffb070', 0.4), r: 8 }], sky: { top, hor, gnd: C('#0c0d14') }, fog: { col: C('#1a1c2c'), d: 0.004, start: 30 }, clear: hor,
    post: { exposure: 1.35, bloom: 1.0, th: 0.7, vig: 0.5, warm: 0.1, fade: fadeIO(t, dur) },
  };
}

// ---------- CAR AT NIGHT (rain) ----------
let ROAD = null;
function sceneCar(t, dur, o) {
  ensureT2(); o = o || {};
  if (!ROAD) { const r = rnd(55); ROAD = { b: [], cars: [] }; for (const sd of [-1, 1]) for (let z = 20; z > -400; z -= 9 + r() * 7) ROAD.b.push([sd * (9 + r() * 4), z, 6 + r() * 18, 6 + r() * 5, (r() * 2) | 0]); for (let i = 0; i < 6; i++) ROAD.cars.push([i % 2 ? -1.8 : 1.8, -20 - i * 28, i % 2 ? -1 : 1]); }
  const objs = []; const speed = 11; const zc = -t * speed;
  objs.push(B([0, -0.05, zc - 150], [8, 0.1, 420], C('#4a4c52'), { tex: T.road, uvr: [0, (t * speed / 50) % 1, 1, 60] }));
  objs.push(B([0, -0.06, zc - 150], [400, 0.08, 420], C('#25262a')));
  for (const sd of [-1, 1]) objs.push(B([sd * 5, 0.07, zc - 150], [2, 0.14, 420], C('#5e5a55')));
  for (const [x, z, h, w, k] of ROAD.b) { if (z > zc + 15 || z < zc - 300) continue; objs.push(B([x + Math.sign(x) * w / 2, h / 2, z], [w, h, 8], C('#ffffff', 0.5), { mode: 1, tex: T2.nightFacade[k], uvr: [0, 0, 2, Math.max(1, Math.round(h / 8))] })); }
  const pls = [];
  for (let z = 0; z > -420; z -= 24) for (const sd of [-1, 1]) {
    const zz = z + Math.floor(-zc / 24) * -24 + 0; if (zz > zc + 10 || zz < zc - 260) continue;
    objs.push(B([sd * 4.3, 3, zz], [0.12, 6, 0.12], C('#2e3036')), B([sd * 3.6, 6, zz], [1.5, 0.12, 0.2], C('#2e3036')), B([sd * 3.0, 5.9, zz], [0.5, 0.12, 0.3], C('#ffd7a0', 5), { mode: 1 }));
    if (zz < zc + 2 && zz > zc - 60 && pls.length < 6) pls.push({ p: [sd * 3.0, 5.6, zz], c: C('#ffc890', 2.2), r: 14 });
  }
  for (const [x, z0, dir] of ROAD.cars) {
    const z = dir > 0 ? zc + z0 - t * 3 : ((z0 + t * 24 - zc) % 220 + 220) % 220 * -1 + zc + 10;
    car(objs, x, z, dir > 0 ? PI : 0, dir > 0 ? '#5a6a7a' : '#3a3a40');
    if (dir > 0) { for (const sx of [-0.65, 0.65]) objs.push(B([x + sx, 0.75, z + 2.12], [0.35, 0.15, 0.05], C('#ff2a2a', 6), { mode: 1 })); objs.push(O('plane', [x, 0.75, z + 2.2], [0, 0, 0], [3, 1.4, 1], C('#ff3020', 0.25), { additive: true, mode: 3, tex: T.glow })); }
    else { for (const sx of [-0.6, 0.6]) objs.push(B([x + sx, 0.7, z - 2.12], [0.35, 0.18, 0.05], C('#fff3d8', 8), { mode: 1 })); objs.push(O('plane', [x, 0.7, z - 2.3], [0, PI, 0], [4, 2, 1], C('#fff0d0', 0.35), { additive: true, mode: 3, tex: T.glow })); }
  }
  // interior (car frame)
  const CM = M4.trs([1.8, 0, zc]); const P = (p, s, c, e) => G(CM, M4.trs(p, [0, 0, 0], s), 'box', c, e);
  objs.push(P([0, 0.88, -0.85], [1.7, 0.22, 0.6], C('#1c1d21')), P([0, 1.0, -0.62], [1.7, 0.06, 0.2], C('#232428')));
  objs.push(P([0, 1.62, -0.4], [1.7, 0.08, 1.6], C('#2a2a2e')));
  for (const sx of [-0.83, 0.83]) objs.push(G(CM, M4.trs([sx, 1.3, -0.8], [0.45, 0, 0], [0.08, 0.75, 0.08]), 'box', C('#202024')));
  objs.push(P([-0.38, 0.97, -0.72], [0.38, 0.1, 0.02], C('#79b8ff', 1.6), { mode: 1 }), P([0.15, 0.95, -0.66], [0.3, 0.18, 0.02], C('#ffffff', 0.9), { mode: 1, tex: T.scrNotifF ? scrNotifK(o.clock || '23:40') : null }));
  const wc = [-0.38, 0.93, -0.5];
  for (let i = 0; i < 14; i++) { const a = i / 14 * PI * 2; objs.push(G(CM, M4.trs([wc[0] + Math.cos(a) * 0.19, wc[1] + Math.sin(a) * 0.19 * 0.85, wc[2] + Math.sin(a) * 0.19 * 0.5], [0.55, 0, a], [0.06, 0.022, 0.025]), 'box', C('#151517'))); }
  for (const sx of [-1, 1]) objs.push(seg(CM, [-0.38 + sx * 0.3, 0.62, 0.0], [-0.38 + sx * 0.17, 0.98, -0.47], [0.06, 0.065], C('#2d3a55')), G(CM, M4.trs([-0.38 + sx * 0.17, 0.99, -0.5], [0.5, 0, 0], [0.045, 0.07, 0.04]), 'box', C('#a8714c')));
  // windshield rain
  if (o.rain !== false) objs.push(G(CM, M4.trs([0, 1.32, -1.08], [-0.48, 0, 0], [1.6, 0.75, 1]), 'plane', C('#cfd8e8', 0.22), { additive: true, mode: 3, tex: T2.drops, uvr: [0, (t * 0.15) % 1, 2, 1], noShadow: true }));
  const sway = Math.sin(t * 0.7) * 0.008;
  const cam = { pos: [1.8 - 0.38, 1.27 + sway, zc + 0.05], target: [1.8 - 0.25, 1.1, zc - 20], up: [Math.sin(t * 0.5) * 0.01, 1, 0], fov: 66, far: 500 };
  const top = C('#070a14'), hor = C('#2a3040');
  objs.push(skyDome(cam));
  pls.push({ p: [1.5, 1.0, zc - 0.6], c: C('#79b8ff', 0.18), r: 1.2 });
  return {
    objs, cam,
    sun: { dir: [0.2, -1, 0.1], col: [0, 0, 0], on: false },
    hemi: { sky: C('#3a4058', 0.22), gnd: C('#15161a', 0.15) },
    pls, sky: { top, hor, gnd: hor }, fog: { col: C('#262b38'), d: 0.022, start: 8 }, clear: hor,
    post: { exposure: 1.2, bloom: 1.0, th: 0.75, vig: 0.6, warm: 0.0, fade: fadeIO(t, dur) },
  };
}

// ---------- SEASIDE SUNSET ----------
function sceneSea(t, dur, o) {
  ensureT2(); o = o || {};
  const objs = []; const k = clamp(t / dur, 0, 1);
  const sunDir = norm([0.05, -lerp(0.09, 0.03, k), 1]);
  objs.push(B([0, -0.05, 12], [500, 0.1, 64], C('#dcc39c'), { tex: T2.sand, uvr: [0, 0, 80, 10] }));
  objs.push(B([0, -0.25, -240], [800, 0.1, 440], C('#24506e')));
  for (let i = 0; i < 4; i++) { const ph = t * 0.6 + i * 1.6; const z = -20 + Math.sin(ph) * 1.6 + i * 0.3; objs.push(B([0, -0.12 + i * 0.002, z], [500, 0.02, 0.5 + 0.3 * (1 + Math.sin(ph))], C('#e8eef0', 0.9))); }
  objs.push(B([0, -0.13, -21.5], [500, 0.02, 4], C('#3e6a80')));
  objs.push(O('plane', [0, -0.1, -170], [-PI / 2, 0, 0], [26, 300, 1], C('#ffb070', 0.45), { additive: true, mode: 3, tex: T.glow, noShadow: true }));
  const r = rnd(17); for (let i = 0; i < 90; i++) { const x = (r() - 0.5) * (6 + r() * 30), z = -24 - r() * 260; const fl = Math.max(0, Math.sin(t * (3 + r() * 4) + i)); objs.push(O('box', [x * (1 + (-z) / 120), -0.08, z], [0, 0, 0], [0.25, 0.02, 0.25], C('#ffd8a0', 4 * fl), { mode: 1, noShadow: true })); }
  for (let i = 0; i < 6; i++) objs.push(O('sph', [-14 + i * 6 + r() * 3, 0.1, 4 - r() * 14], [0, r() * 3, 0], [1 + r() * 1.5, 0.6 + r() * 0.6, 1 + r()], C('#5a5048')));
  for (const [x, z] of [[-9, -12], [11, -9]]) objs.push(...person(M4.trs([x, 0.02, z], [0, PI, 0]), { skin: '#7a5238', shirt: '#2d3a55', pants: '#3a3a3a', sit: true, face: 'flat' }));
  const walk = o.walk !== false; const camX = walk ? -t * 0.9 : 0;
  const bob = walk ? Math.sin(t * 5.2) * 0.03 : 0;
  const cam = { pos: [camX, walk ? 1.62 + bob : 1.0, 2], target: [camX + 4, 0.6, -60], up: [0, 1, 0], fov: 66, far: 700 };
  const top = lerp3(C('#3a4a80'), C('#2a2e5a'), k), hor = lerp3(C('#f5a86a'), C('#e8805a'), k);
  objs.push(skyDome(cam));
  return {
    objs, cam,
    sun: { dir: sunDir, col: C('#ffb27a', 2.4), center: [camX, 0, -4], ext: 18 },
    hemi: { sky: C('#8a90c0', 0.45), gnd: C('#a07050', 0.35) },
    pls: [], sky: { top, hor, gnd: C('#24506e') }, fog: { col: hor, d: 0.0035, start: 40 }, clear: hor,
    post: { exposure: 1.0, bloom: 0.8, th: 1.0, vig: 0.45, warm: 0.5, fade: fadeIO(t, dur) },
  };
}

// ---------- FAMILY DINNER ----------
function sceneDinner(t, dur, o) {
  ensureT2(); o = o || {};
  const objs = []; const wallC = C('#d8c8b0');
  objs.push(B([0, -0.05, -1.5], [7, 0.1, 7], [1, 1, 1], { tex: T.wood, uvr: [0, 0, 4, 4] }));
  objs.push(B([0, 2.85, -1.5], [7, 0.1, 7], wallC));
  objs.push(B([-3.5, 1.4, -1.5], [0.1, 2.8, 7], wallC, { tex: T.plaster })); objs.push(B([3.5, 1.4, -1.5], [0.1, 2.8, 7], wallC, { tex: T.plaster }));
  objs.push(B([0, 1.4, -5], [7, 2.8, 0.1], wallC, { tex: T.plaster })); objs.push(B([0, 1.4, 2], [7, 2.8, 0.1], wallC));
  objs.push(O('plane', [2.2, 1.6, -4.94], [0, 0, 0], [1.8, 1.4, 1], [1.2, 1.2, 1.2], { mode: 1, tex: T.night, noShadow: true }));
  objs.push(B([2.2, 1.6, -4.92], [0.05, 1.4, 0.05], C('#eee')));
  objs.push(B([-1.4, 1.7, -4.93], [0.9, 0.6, 0.03], C('#d9b25a'))); objs.push(B([-1.4, 1.7, -4.91], [0.8, 0.5, 0.03], C('#1f3a2c')));
  // table
  const tz = -1.4;
  objs.push(B([0, 0.75, tz], [1.2, 0.06, 2.0], C('#f3efe6'), { tex: T.fabric }));
  for (const [x, z] of [[-0.5, -0.9], [0.5, -0.9], [-0.5, 0.9], [0.5, 0.9]]) objs.push(B([x, 0.37, tz + z], [0.06, 0.74, 0.06], C('#6b4a32')));
  const plate = (x, z) => { objs.push(O('cyl', [x, 0.79, z], [0, 0, 0], [0.3, 0.02, 0.3], C('#fbfaf6'))); };
  plate(0, tz + 0.75); plate(0, tz - 0.75); plate(-0.38, tz); plate(0.38, tz);
  objs.push(O('cyl', [0, 0.82, tz], [0, 0, 0], [0.45, 0.08, 0.45], C('#e0d6c4')));
  for (let i = 0; i < 7; i++) objs.push(O('sph', [Math.cos(i) * 0.12, 0.88, tz + Math.sin(i) * 0.12], [0, 0, 0], [0.09, 0.07, 0.09], C(['#e0a050', '#9ccf9a', '#e58c8a', '#f2d17a'][i % 4])));
  objs.push(B([0.3, 0.83, tz - 0.25], [0.3, 0.08, 0.15], C('#c98a4a')));
  for (const [x, z] of [[0.18, tz + 0.55], [-0.2, tz - 0.55], [-0.25, tz + 0.2], [0.25, tz - 0.2]]) objs.push(O('cyl', [x, 0.84, z], [0, 0, 0], [0.06, 0.12, 0.06], C('#b8643a')));
  const fl = 1 + 0.12 * Math.sin(t * 17) + 0.08 * Math.sin(t * 29);
  objs.push(O('cyl', [-0.15, 0.86, tz + 0.15], [0, 0, 0], [0.07, 0.16, 0.07], C('#f6f1e6')));
  objs.push(O('sph', [-0.15, 0.97, tz + 0.15], [0, 0, 0], [0.025, 0.06, 0.025], C('#ffd28a', 6 * fl), { mode: 1 }));
  objs.push(O('plane', [-0.15, 0.98, tz + 0.15], [0, 0, 0], [0.4, 0.4, 1], C('#ffb060', 0.3 * fl), { additive: true, mode: 3, tex: T.glow }));
  objs.push(B([0, 2.4, tz], [0.02, 0.9, 0.02], C('#333')), O('cone', [0, 1.85, tz], [0, 0, 0], [0.6, 0.35, 0.6], C('#2f3a33')), O('sph', [0, 1.72, tz], [0, 0, 0], [0.18, 0.12, 0.18], C('#ffe0b0', 4), { mode: 1 }));
  // chairs + family
  const chair = (x, z, yaw) => { const M = M4.trs([x, 0, z], [0, yaw, 0]); objs.push(G(M, M4.trs([0, 0.45, 0], [0, 0, 0], [0.48, 0.06, 0.48]), 'box', C('#7a5236')), G(M, M4.trs([0, 0.8, -0.22], [0, 0, 0], [0.48, 0.7, 0.05]), 'box', C('#7a5236'))); };
  const seats = { father: [0, tz - 1.25, 0], mother: [-0.95, tz - 0.1, PI / 2], sibling: [0.95, tz + 0.1, -PI / 2] };
  const fam = o.family || ['father', 'mother', 'sibling'];
  for (const [who, [x, z, yaw]] of Object.entries(seats)) {
    chair(x, z, yaw);
    if (!fam.includes(who)) continue;
    const look = Math.sin(t * 0.6 + x) * 0.3;
    const opt = who === 'mother' ? { skin: '#9a6644', shirt: '#7a3d4d', pants: '#4a3a3a', hijab: '#e3d8c6' } : who === 'father' ? { skin: '#8d5a3b', shirt: '#d8d2c4', pants: '#3b4a6b', hair: '#2a2a2a' } : { skin: '#a8714c', shirt: '#4f7cc9', pants: '#2d2d33' };
    objs.push(...person(M4.trs([x, 0.0, z + (yaw === 0 ? 0.05 : 0)], [0, yaw, 0]), Object.assign(opt, { sit: true, face: o.sad ? 'flat' : 'smile', headYaw: look, armL: 1.25, armR: 1.25 })));
  }
  // POV hands on table
  const cam = { pos: [0, 1.3, tz + 1.95], target: [0, 0.9, tz - 0.8], up: [0, 1, 0], fov: 64 };
  const CW = M4.camWorld(cam.pos, cam.target, cam.up);
  objs.push(...povArm(CW, [-0.3, -0.55, -0.05], [-0.17, -0.36, -0.5], C('#5b6b4a'), C('#a8714c')), ...povArm(CW, [0.3, -0.55, -0.05], [0.17, -0.37, -0.52], C('#5b6b4a'), C('#a8714c')));
  return {
    objs, cam,
    sun: { dir: [-0.6, -0.5, 0.3], col: [0, 0, 0], on: false },
    hemi: { sky: C('#4a4058', 0.35), gnd: C('#2a2020', 0.25) },
    pls: [{ p: [0, 1.6, tz], c: C('#ffcf98', 2.6), r: 4.5 }, { p: [-0.15, 1.0, tz + 0.15], c: C('#ffb060', 1.2 * fl), r: 2.2 }, { p: [2.2, 1.6, -4.5], c: C('#6080c0', 0.35), r: 4 }],
    fog: { col: [0, 0, 0], d: 0 }, clear: [0, 0, 0],
    post: { exposure: 1.05, bloom: 0.75, th: 0.9, vig: 0.55, warm: 0.4, sat: o.sad ? 0.7 : 1, fade: fadeIO(t, dur) },
  };
}

Object.assign(SCENES, { mosque_ext: sceneMosqueExt, mosque_int: sceneMosqueInt, rooftop: sceneRooftop, car_night: sceneCar, seaside: sceneSea, dinner: sceneDinner });
