// Usage: node render.js <story.json> <startFrame> <endFrame> <out.mp4|stillsDir> [port] [--stills t1,t2]
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');
const FPS = 24, Q = 'scale=0.5&msaa=4&shm=1024';
const [storyPath, a0, b0, out, port0] = process.argv.slice(2);
const PORT = +(port0 || 8150);
const story = JSON.parse(fs.readFileSync(storyPath, 'utf8'));
const root = path.join(__dirname, 'engine');
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html' : f.endsWith('.js') ? 'text/javascript' : 'application/octet-stream' }); r.end(d); }); });
(async () => {
  await new Promise(res => srv.listen(PORT, res));
  const b = await chromium.launch({ args: ['--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto(`http://localhost:${PORT}/index.html?${Q}`);
  await p.waitForFunction(() => window.ready || window.err, null, { timeout: 60000 });
  await p.evaluate(s => { window.STORY = s; }, story);
  const err = await p.evaluate(() => window.err); if (err) { console.log('ERR', err); process.exit(1); }
  const stillsIdx = process.argv.indexOf('--stills');
  if (stillsIdx > 0) {
    fs.mkdirSync(out, { recursive: true });
    for (const t of process.argv[stillsIdx + 1].split(',').map(Number)) { await p.evaluate(t => renderAt(t), t); await p.screenshot({ path: path.join(out, `s_${t.toFixed(1).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 85 }); }
  } else {
    const { spawn } = require('child_process');
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let i = +a0; i < +b0; i++) {
      await p.evaluate(t => renderAt(t), i / FPS);
      const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 120 === 0) console.log(path.basename(out), i, '/', b0, ((Date.now() - t0) / (i - a0 + 1)).toFixed(0), 'ms/frame');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close(); srv.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
