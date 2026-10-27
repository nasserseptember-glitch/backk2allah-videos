// Minimal WebGL2 low-poly renderer: lit boxes/cylinders/spheres/planes, sun shadow map,
// point lights, fog, sky gradient, additive glows, HDR + bloom + blur + ACES + grain.
'use strict';
const W = 1080, H = 1920;
const QS = new URLSearchParams(location.search);
const CFG = { scale: +(QS.get('scale') || 1), msaa: +(QS.get('msaa') ?? 4), shm: +(QS.get('shm') || 2048) };
const RW = Math.round(W * CFG.scale), RH = Math.round(H * CFG.scale);

// ---------- math ----------
const M4 = {
  ident() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); },
  mul(a, b) { // a*b (column-major)
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      o[c*4+r] = a[r]*b[c*4] + a[4+r]*b[c*4+1] + a[8+r]*b[c*4+2] + a[12+r]*b[c*4+3];
    }
    return o;
  },
  persp(fovy, asp, n, f) {
    const t = 1 / Math.tan(fovy / 2), o = new Float32Array(16);
    o[0] = t / asp; o[5] = t; o[10] = (f + n) / (n - f); o[11] = -1; o[14] = 2 * f * n / (n - f); return o;
  },
  ortho(l, r, b, t, n, f) {
    const o = M4.ident();
    o[0] = 2/(r-l); o[5] = 2/(t-b); o[10] = -2/(f-n); o[12] = -(r+l)/(r-l); o[13] = -(t+b)/(t-b); o[14] = -(f+n)/(f-n); return o;
  },
  lookAt(e, c, u) {
    let z = norm(sub(e, c)), x = norm(cross(u, z)), y = cross(z, x);
    return new Float32Array([x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x,e),-dot(y,e),-dot(z,e),1]);
  },
  // camera world matrix (inverse of lookAt)
  camWorld(e, c, u) {
    let z = norm(sub(e, c)), x = norm(cross(u, z)), y = cross(z, x);
    return new Float32Array([x[0],x[1],x[2],0, y[0],y[1],y[2],0, z[0],z[1],z[2],0, e[0],e[1],e[2],1]);
  },
  // T * Ry * Rx * Rz * S
  trs(p, r, s) {
    r = r || [0,0,0]; s = s || [1,1,1];
    const [rx, ry, rz] = r;
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry), cz = Math.cos(rz), sz = Math.sin(rz);
    // R = Ry*Rx*Rz
    const m00 = cy*cz + sy*sx*sz, m01 = -cy*sz + sy*sx*cz, m02 = sy*cx;
    const m10 = cx*sz,            m11 = cx*cz,             m12 = -sx;
    const m20 = -sy*cz + cy*sx*sz, m21 = sy*sz + cy*sx*cz, m22 = cy*cx;
    return new Float32Array([m00*s[0], m10*s[0], m20*s[0], 0, m01*s[1], m11*s[1], m21*s[1], 0, m02*s[2], m12*s[2], m22*s[2], 0, p[0], p[1], p[2], 1]);
  },
  xform(m, v) { return [m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12], m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13], m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]]; },
};
function sub(a, b) { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
function add(a, b) { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
function scl(a, s) { return [a[0]*s, a[1]*s, a[2]*s]; }
function dot(a, b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
function cross(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
function norm(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0]/l, a[1]/l, a[2]/l]; }
function lerp(a, b, t) { return a + (b - a) * t; }
function lerp3(a, b, t) { return [lerp(a[0],b[0],t), lerp(a[1],b[1],t), lerp(a[2],b[2],t)]; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function sstep(a, b, x) { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
function hex(h, k = 1) { const n = parseInt(h.slice(1), 16); return [((n >> 16) & 255) / 255 * k, ((n >> 8) & 255) / 255 * k, (n & 255) / 255 * k]; }
// srgb -> linear
function lin(c) { return c.map(v => Math.pow(v, 2.2)); }
function C(h, k = 1) { return lin(hex(h)).map(v => v * k); }
function rnd(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// normal matrix (inverse transpose of 3x3)
function nmat(m) {
  const a = m[0], b = m[1], c = m[2], d = m[4], e = m[5], f = m[6], g = m[8], h = m[9], i = m[10];
  const A = e*i - f*h, B = -(d*i - f*g), Cc = d*h - e*g;
  const det = a*A + b*B + c*Cc || 1e-8;
  return new Float32Array([
    A/det, B/det, Cc/det,
    -(b*i - c*h)/det, (a*i - c*g)/det, -(a*h - b*g)/det,
    (b*f - c*e)/det, -(a*f - c*d)/det, (a*e - b*d)/det,
  ]);
}

// ---------- GL setup ----------
const canvas = document.getElementById('gl');
canvas.width = W; canvas.height = H;
const gl = canvas.getContext('webgl2', { antialias: false, preserveDrawingBuffer: true, alpha: false });
gl.getExtension('EXT_color_buffer_float');
gl.getExtension('OES_texture_float_linear');

function sh(type, src) {
  const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) + '\n' + src);
  return s;
}
function prog(vs, fs) {
  const p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'aPos'); gl.bindAttribLocation(p, 1, 'aNrm'); gl.bindAttribLocation(p, 2, 'aUV');
  gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const inf = gl.getActiveUniform(p, i); u[inf.name.replace('[0]', '')] = gl.getUniformLocation(p, inf.name); }
  return { p, u };
}

// ---------- meshes ----------
function mkMesh(pos, nrm, uv, idx) {
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const buf = (data, loc, n) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, n, gl.FLOAT, false, 0, 0); };
  buf(pos, 0, 3); buf(nrm, 1, 3); buf(uv, 2, 2);
  const ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  gl.bindVertexArray(null);
  return { vao, n: idx.length };
}
function boxMesh() {
  const P = [], N = [], U = [], I = [];
  const faces = [
    [[1,0,0], [0,0,-1], [0,1,0]], [[-1,0,0], [0,0,1], [0,1,0]],
    [[0,1,0], [1,0,0], [0,0,-1]], [[0,-1,0], [1,0,0], [0,0,1]],
    [[0,0,1], [1,0,0], [0,1,0]], [[0,0,-1], [-1,0,0], [0,1,0]],
  ];
  for (const [n, u, v] of faces) {
    const b = P.length / 3;
    for (const [a, c] of [[-1,-1],[1,-1],[1,1],[-1,1]]) {
      P.push(n[0]*0.5 + u[0]*a*0.5 + v[0]*c*0.5, n[1]*0.5 + u[1]*a*0.5 + v[1]*c*0.5, n[2]*0.5 + u[2]*a*0.5 + v[2]*c*0.5);
      N.push(...n); U.push((a + 1) / 2, (c + 1) / 2);
    }
    I.push(b, b+1, b+2, b, b+2, b+3);
  }
  return mkMesh(P, N, U, I);
}
function planeMesh() { // XY plane facing +Z, size 1
  return mkMesh([-.5,-.5,0, .5,-.5,0, .5,.5,0, -.5,.5,0], [0,0,1, 0,0,1, 0,0,1, 0,0,1], [0,0, 1,0, 1,1, 0,1], [0,1,2, 0,2,3]);
}
function cylMesh(seg, rTop = 0.5) {
  const P = [], N = [], U = [], I = [];
  for (let i = 0; i < seg; i++) { // sides, flat-ish shading per segment
    const a0 = i / seg * Math.PI * 2, a1 = (i + 1) / seg * Math.PI * 2, am = (a0 + a1) / 2;
    const b = P.length / 3;
    const n = norm([Math.cos(am), (0.5 - rTop) , Math.sin(am)]);
    P.push(Math.cos(a0)*.5, -.5, Math.sin(a0)*.5, Math.cos(a1)*.5, -.5, Math.sin(a1)*.5, Math.cos(a1)*rTop, .5, Math.sin(a1)*rTop, Math.cos(a0)*rTop, .5, Math.sin(a0)*rTop);
    for (let k = 0; k < 4; k++) N.push(...n);
    U.push(i/seg,0,(i+1)/seg,0,(i+1)/seg,1,i/seg,1);
    I.push(b, b+2, b+1, b, b+3, b+2);
  }
  for (const [y, ny] of [[.5, 1], [-.5, -1]]) {
    const r = y > 0 ? rTop : .5; if (r <= 0) continue;
    const c = P.length / 3; P.push(0, y, 0); N.push(0, ny, 0); U.push(.5, .5);
    for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI * 2; P.push(Math.cos(a)*r, y, Math.sin(a)*r); N.push(0, ny, 0); U.push(.5+Math.cos(a)*.5, .5+Math.sin(a)*.5); }
    for (let i = 0; i < seg; i++) ny > 0 ? I.push(c, c+2+i, c+1+i) : I.push(c, c+1+i, c+2+i);
  }
  return mkMesh(P, N, U, I);
}
function sphMesh(seg = 16, rings = 10) {
  const P = [], N = [], U = [], I = [];
  for (let r = 0; r <= rings; r++) for (let s = 0; s <= seg; s++) {
    const th = r / rings * Math.PI, ph = s / seg * Math.PI * 2;
    const n = [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)];
    P.push(n[0]*.5, n[1]*.5, n[2]*.5); N.push(...n); U.push(s/seg, r/rings);
  }
  for (let r = 0; r < rings; r++) for (let s = 0; s < seg; s++) { const a = r*(seg+1)+s, b = a+seg+1; I.push(a, a+1, b, b, a+1, b+1); }
  return mkMesh(P, N, U, I);
}
const MESH = { box: boxMesh(), plane: planeMesh(), cyl: cylMesh(18), cyl6: cylMesh(6), cone: cylMesh(7, 0), sph: sphMesh(), skyS: sphMesh(24, 16) };

// ---------- textures ----------
function texFromCanvas(cv, repeat = false) {
  const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, cv);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const wr = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wr); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wr);
  const an = gl.getExtension('EXT_texture_filter_anisotropic'); if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, 8);
  return t;
}
function mkCanvas(w, h, fn) { const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h); return c; }

// ---------- shaders ----------
const VS = `#version 300 es
layout(location=0) in vec3 aPos; layout(location=1) in vec3 aNrm; layout(location=2) in vec2 aUV;
uniform mat4 uModel, uVP, uLVP; uniform mat3 uNM; uniform vec4 uUVR;
out vec3 vW; out vec3 vN; out vec2 vUV; out vec4 vL;
void main(){ vec4 w = uModel*vec4(aPos,1.); vW=w.xyz; vN=normalize(uNM*aNrm); vUV=aUV*uUVR.zw+uUVR.xy; vL=uLVP*w; gl_Position=uVP*w; }`;
const FS = `#version 300 es
precision highp float; precision highp sampler2DShadow;
in vec3 vW; in vec3 vN; in vec2 vUV; in vec4 vL;
uniform vec3 uCol, uEm, uSunDir, uSunCol, uHemiSky, uHemiGnd, uFogCol, uCam, uSkyTop, uSkyHor, uSkyGnd;
uniform float uFog, uAlpha, uRough, uFogStart; uniform int uMode, uTexOn, uNPL, uFlat;
uniform vec3 uPLp[10]; uniform vec3 uPLc[10]; uniform float uPLr[10];
uniform sampler2D uTex; uniform sampler2DShadow uShadow; uniform float uShOn, uShSize;
out vec4 o;
float shadow(){
  vec3 p = vL.xyz/vL.w*.5+.5; if(p.x<0.||p.x>1.||p.y<0.||p.y>1.||p.z>1.) return 1.;
  float s=0.; vec2 ts=vec2(1./uShSize);
  for(int x=-1;x<=1;x++) for(int y=-1;y<=1;y++) s+=texture(uShadow, vec3(p.xy+vec2(x,y)*ts*1.5, p.z-0.0015));
  return s/9.;
}
void main(){
  vec3 base = uCol; float a = uAlpha;
  if(uTexOn==1){ vec4 t = texture(uTex, vUV); base *= t.rgb; a *= t.a; if(uMode!=3 && a<0.5) discard; }
  if(uMode==2){ // sky
    vec3 d = normalize(vW-uCam); float y=d.y;
    vec3 c = y>0. ? mix(uSkyHor, uSkyTop, pow(clamp(y,0.,1.),0.55)) : mix(uSkyHor, uSkyGnd, clamp(-y*4.,0.,1.));
    float sd = max(dot(d, normalize(-uSunDir)),0.);
    c += uSunCol*(pow(sd,600.)*40. + pow(sd,12.)*0.35)*uEm.x;
    o = vec4(c,1.); return;
  }
  if(uMode==1){ o = vec4(base*uEm + uEm*0., a); o.rgb = base; return; } // unlit (base already HDR)
  if(uMode==3){ o = vec4(base, a); return; } // additive glow (handled by blend)
  if(uFlat==1){ o=vec4(base,1.); return; }
  vec3 N = normalize(vN); if(!gl_FrontFacing) N=-N;
  vec3 L = normalize(-uSunDir);
  float sh = uShOn>0.5 ? shadow() : 1.;
  vec3 lit = uSunCol*max(dot(N,L),0.)*sh + mix(uHemiGnd,uHemiSky,N.y*.5+.5);
  for(int i=0;i<10;i++){ if(i>=uNPL) break; vec3 d=uPLp[i]-vW; float dist=length(d); float at=clamp(1.-dist/uPLr[i],0.,1.); at*=at;
    lit += uPLc[i]*max(dot(N,d/dist),0.)*at; }
  vec3 V = normalize(uCam-vW);
  float rim = pow(1.-max(dot(N,V),0.),3.)*0.06;
  vec3 c = base*lit + uEm + base*rim*uHemiSky;
  float dist = length(vW-uCam);
  float f = 1.-exp(-pow(max(dist-uFogStart,0.)*uFog,1.6));
  c = mix(c, uFogCol, clamp(f,0.,1.));
  o = vec4(c, a);
}`;
const VSD = `#version 300 es
layout(location=0) in vec3 aPos; uniform mat4 uModel, uLVP; void main(){ gl_Position = uLVP*uModel*vec4(aPos,1.); }`;
const FSD = `#version 300 es
precision highp float; out vec4 o; void main(){ o=vec4(1.); }`;
const VQ = `#version 300 es
layout(location=0) in vec3 aPos; out vec2 uv; void main(){ uv=aPos.xy+.5; gl_Position=vec4(aPos.xy*2.,0.,1.); }`;
const FBR = `#version 300 es
precision highp float; in vec2 uv; uniform sampler2D t; uniform float th; out vec4 o;
void main(){ vec3 c=texture(t,uv).rgb; float l=max(max(c.r,c.g),c.b); o=vec4(c*max(l-th,0.)/max(l,1e-4),1.); }`;
const FBL = `#version 300 es
precision highp float; in vec2 uv; uniform sampler2D t; uniform vec2 dir; out vec4 o;
void main(){ vec3 c=texture(t,uv).rgb*0.2270;
  c+=(texture(t,uv+dir*1.3846).rgb+texture(t,uv-dir*1.3846).rgb)*0.3162;
  c+=(texture(t,uv+dir*3.2308).rgb+texture(t,uv-dir*3.2308).rgb)*0.0703; o=vec4(c,1.); }`;
const FCP = `#version 300 es
precision highp float; in vec2 uv; uniform sampler2D t; out vec4 o; void main(){ o=vec4(texture(t,uv).rgb,1.); }`;
const FFIN = `#version 300 es
precision highp float; in vec2 uv; uniform sampler2D sc, b1, b2, bl; uniform float exposure, bloom, blur, vig, grainAmt, fade, flash, time, sat, warm;
out vec4 o;
float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }
vec3 aces(vec3 x){ return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.); }
void main(){
  vec3 c = texture(sc,uv).rgb;
  vec3 bb = texture(bl,uv).rgb;
  c = mix(c, bb, blur);
  c += (texture(b1,uv).rgb*0.6 + texture(b2,uv).rgb*0.8)*bloom;
  c *= exposure;
  c = aces(c);
  float l = dot(c, vec3(.299,.587,.114)); c = mix(vec3(l), c, sat);
  c *= vec3(1.+warm*0.06, 1., 1.-warm*0.06);
  vec2 d = uv-.5; d.x*=0.75; c *= 1.-vig*smoothstep(.25,.85,length(d)*1.25);
  c = pow(c, vec3(1./2.2));
  c += (h(uv*vec2(1080.,1920.)+time*91.7)-.5)*grainAmt;
  c = mix(c, vec3(1.), flash); c *= fade;
  o = vec4(c,1.);
}`;
const P = { main: prog(VS, FS), depth: prog(VSD, FSD), br: prog(VQ, FBR), bl: prog(VQ, FBL), cp: prog(VQ, FCP), fin: prog(VQ, FFIN) };

// ---------- framebuffers ----------
function rt(w, h, depth = false, ms = 0) {
  const fb = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
  let tex = null, rb = null;
  if (ms) {
    rb = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, ms, gl.RGBA16F, w, h);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, rb);
    const db = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, db);
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, ms, gl.DEPTH_COMPONENT24, w, h);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, db);
  } else {
    tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]]) gl.texParameteri(gl.TEXTURE_2D, k, v);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (depth) { const db = gl.createRenderbuffer(); gl.bindRenderbuffer(gl.RENDERBUFFER, db); gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, w, h); gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, db); }
  }
  return { fb, tex, w, h };
}
const MSAA = CFG.msaa;
const r2 = (d) => [Math.round(RW / d), Math.round(RH / d)];
const RT = { sc: rt(RW, RH, !MSAA), h1: rt(...r2(2)), h2: rt(...r2(2)), q1: rt(...r2(4)), q2: rt(...r2(4)), e1: rt(...r2(8)), e2: rt(...r2(8)), bq1: rt(...r2(4)), bq2: rt(...r2(4)), bq3: rt(...r2(8)), bq4: rt(...r2(8)) };
RT.ms = MSAA ? rt(RW, RH, true, MSAA) : RT.sc;
// shadow map
const SHM = CFG.shm;
const shTex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, shTex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, SHM, SHM, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
const shFB = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, shFB);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shTex, 0);
const dummyTex = texFromCanvas(mkCanvas(2, 2, (g) => { g.fillStyle = '#fff'; g.fillRect(0, 0, 2, 2); }));

function quad(p, src, dst, setU) {
  gl.bindFramebuffer(gl.FRAMEBUFFER, dst ? dst.fb : null);
  gl.viewport(0, 0, dst ? dst.w : W, dst ? dst.h : H);
  gl.useProgram(p.p);
  if (src) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, src.tex); gl.uniform1i(p.u.t, 0); }
  if (setU) setU(p.u);
  gl.bindVertexArray(MESH.plane.vao); gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}
function blurChain(src, a, b, passes) {
  quad(P.cp, src, a);
  for (let i = 0; i < passes; i++) {
    quad(P.bl, a, b, u => gl.uniform2f(u.dir, 1.2 / a.w, 0));
    quad(P.bl, b, a, u => gl.uniform2f(u.dir, 0, 1.2 / a.h));
  }
}

// ---------- render a frame ----------
// frame = { objs:[{m, mesh, col, em, mode, tex, uvr, alpha, noShadow, additive}], cam:{pos,target,up,fov}, sun:{dir,col,on,center,ext}, hemi:{sky,gnd}, pls:[{p,c,r}], fog:{col,d,start}, sky:{top,hor,gnd,sunGlow}, post:{} }
function renderFrame(F, time) {
  const cam = F.cam;
  const view = M4.lookAt(cam.pos, cam.target, cam.up || [0, 1, 0]);
  const proj = M4.persp((cam.fov || 62) * Math.PI / 180, W / H, cam.near || 0.03, cam.far || 600);
  const vp = M4.mul(proj, view);
  const sun = F.sun;
  const sd = norm(sun.dir);
  const ctr = sun.center || cam.target, ext = sun.ext || 12;
  const lview = M4.lookAt(sub(ctr, scl(sd, 60)), ctr, Math.abs(sd[1]) > 0.95 ? [0, 0, 1] : [0, 1, 0]);
  const lvp = M4.mul(M4.ortho(-ext, ext, -ext, ext, 1, 140), lview);
  const shadowOn = sun.on !== false && !QS.get('noshadow');
  // shadow pass
  gl.bindFramebuffer(gl.FRAMEBUFFER, shFB); gl.viewport(0, 0, SHM, SHM);
  gl.enable(gl.DEPTH_TEST); gl.clear(gl.DEPTH_BUFFER_BIT); gl.disable(gl.BLEND);
  if (shadowOn) {
    gl.useProgram(P.depth.p); gl.uniformMatrix4fv(P.depth.u.uLVP, false, lvp);
    gl.enable(gl.CULL_FACE); gl.cullFace(gl.FRONT); gl.disable(gl.CULL_FACE);
    for (const o of F.objs) {
      if (o.noShadow || o.mode === 2 || o.mode === 3 || o.additive) continue;
      gl.uniformMatrix4fv(P.depth.u.uModel, false, o.m);
      const me = MESH[o.mesh || 'box']; gl.bindVertexArray(me.vao); gl.drawElements(gl.TRIANGLES, me.n, gl.UNSIGNED_SHORT, 0);
    }
  }
  // main pass
  gl.bindFramebuffer(gl.FRAMEBUFFER, RT.ms.fb); gl.viewport(0, 0, RW, RH);
  const bg = F.clear || [0, 0, 0];
  gl.clearColor(bg[0], bg[1], bg[2], 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  const pr = P.main, u = pr.u; gl.useProgram(pr.p);
  gl.uniformMatrix4fv(u.uVP, false, vp); gl.uniformMatrix4fv(u.uLVP, false, lvp);
  gl.uniform3fv(u.uSunDir, sd); gl.uniform3fv(u.uSunCol, sun.col);
  gl.uniform3fv(u.uHemiSky, F.hemi.sky); gl.uniform3fv(u.uHemiGnd, F.hemi.gnd);
  const fog = F.fog || { col: [0, 0, 0], d: 0 };
  gl.uniform3fv(u.uFogCol, fog.col); gl.uniform1f(u.uFog, fog.d); gl.uniform1f(u.uFogStart, fog.start || 0);
  gl.uniform3fv(u.uCam, cam.pos);
  const sky = F.sky || { top: [0, 0, 0], hor: [0, 0, 0] };
  gl.uniform3fv(u.uSkyTop, sky.top); gl.uniform3fv(u.uSkyHor, sky.hor); gl.uniform3fv(u.uSkyGnd, sky.gnd || sky.hor);
  const pls = (F.pls || []).slice(0, 10);
  gl.uniform1i(u.uNPL, QS.get('nopl') ? 0 : pls.length);
  if (pls.length) {
    gl.uniform3fv(u.uPLp, new Float32Array(pls.flatMap(p => p.p)));
    gl.uniform3fv(u.uPLc, new Float32Array(pls.flatMap(p => p.c)));
    gl.uniform1fv(u.uPLr, new Float32Array(pls.map(p => p.r)));
  }
  gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, shTex); gl.uniform1i(u.uShadow, 1);
  gl.uniform1f(u.uShOn, shadowOn ? 1 : 0); gl.uniform1f(u.uShSize, SHM);
  gl.uniform1i(u.uTex, 0); gl.uniform1i(u.uFlat, QS.get('flat') ? 1 : 0);
  const draw = (o) => {
    gl.uniformMatrix4fv(u.uModel, false, o.m);
    gl.uniformMatrix3fv(u.uNM, false, nmat(o.m));
    gl.uniform3fv(u.uCol, o.col || [1, 1, 1]);
    gl.uniform3fv(u.uEm, o.em || [0, 0, 0]);
    gl.uniform1i(u.uMode, o.mode || 0);
    gl.uniform1f(u.uAlpha, o.alpha == null ? 1 : o.alpha);
    gl.uniform4fv(u.uUVR, o.uvr || [0, 0, 1, 1]);
    gl.activeTexture(gl.TEXTURE0);
    if (o.tex) { gl.bindTexture(gl.TEXTURE_2D, o.tex); gl.uniform1i(u.uTexOn, 1); } else { gl.bindTexture(gl.TEXTURE_2D, dummyTex); gl.uniform1i(u.uTexOn, 0); }
    const me = MESH[o.mesh || 'box']; gl.bindVertexArray(me.vao); gl.drawElements(gl.TRIANGLES, me.n, gl.UNSIGNED_SHORT, 0);
  };
  gl.enable(gl.DEPTH_TEST); gl.depthMask(true); gl.disable(gl.BLEND);
  gl.disable(gl.CULL_FACE);
  for (const o of F.objs) if (!o.additive) draw(o);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.depthMask(false);
  for (const o of F.objs) if (o.additive) draw(o);
  gl.depthMask(true); gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST);
  // resolve
  if (MSAA) { gl.bindFramebuffer(gl.READ_FRAMEBUFFER, RT.ms.fb); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, RT.sc.fb);
  gl.blitFramebuffer(0, 0, RW, RH, 0, 0, RW, RH, gl.COLOR_BUFFER_BIT, gl.NEAREST); }
  const po = Object.assign({ exposure: 1, bloom: 0.6, th: 1.0, blur: 0, vig: 0.55, grain: 0.035, fade: 1, flash: 0, sat: 1, warm: 0 }, F.post || {});
  // bloom
  if (!QS.get('nobloom')) {
  quad(P.br, RT.sc, RT.h1, uu => gl.uniform1f(uu.th, po.th));
  quad(P.bl, RT.h1, RT.h2, uu => gl.uniform2f(uu.dir, 1 / RT.h1.w, 0)); quad(P.bl, RT.h2, RT.h1, uu => gl.uniform2f(uu.dir, 0, 1 / RT.h1.h));
  blurChain(RT.h1, RT.q1, RT.q2, 2);
  blurChain(RT.q1, RT.e1, RT.e2, 3); }
  // full-scene blur (for DOF/eye-opening)
  if (po.blur > 0.001) { blurChain(RT.sc, RT.bq1, RT.bq2, 2); blurChain(RT.bq1, RT.bq3, RT.bq4, 2); }
  gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H);
  gl.useProgram(P.fin.p); const fu = P.fin.u;
  const bind = (unit, tex, name) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(fu[name], unit); };
  bind(0, RT.sc.tex, 'sc'); bind(1, RT.q1.tex, 'b1'); bind(2, RT.e1.tex, 'b2'); bind(3, (po.blur > 0.001 ? RT.bq3 : RT.sc).tex, 'bl');
  gl.uniform1f(fu.exposure, po.exposure); gl.uniform1f(fu.bloom, po.bloom); gl.uniform1f(fu.blur, po.blur); gl.uniform1f(fu.vig, po.vig);
  gl.uniform1f(fu.grainAmt, po.grain); gl.uniform1f(fu.fade, po.fade); gl.uniform1f(fu.flash, po.flash); gl.uniform1f(fu.time, time); gl.uniform1f(fu.sat, po.sat); gl.uniform1f(fu.warm, po.warm);
  gl.bindVertexArray(MESH.plane.vao); gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  gl.finish();
}
