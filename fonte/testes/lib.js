const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs');
const MOCK = fs.readFileSync(__dirname + '/mock.js', 'utf8');
const CDN = {}; for (const l of fs.readFileSync(__dirname + '/cdn/index.txt', 'utf8').trim().split('\n')) { const [n, u] = l.split(' '); CDN[u] = fs.readFileSync(__dirname + '/cdn/' + n); }
exports.launch = async () => chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'] });
exports.page = async (ctx, url, opts = {}) => {
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_TUNNEL/.test(m.text())) console.log('CONSOLE', m.text().slice(0, 300)); });
  await p.route('**/*', r => { const u = r.request().url(); if (CDN[u]) return r.fulfill({ body: CDN[u], contentType: 'application/javascript' }); if (u.startsWith('http://localhost')) return r.continue(); return r.abort(); });
  if (opts.mock !== false) await p.addInitScript(MOCK);
  await p.goto(url, { timeout: 300000, waitUntil: 'domcontentloaded' });
  await p.waitForFunction(opts.until || (() => window.__mira && !document.querySelector('#menu').hidden), null, { timeout: 240000, polling: opts.until ? 500 : 'raf' });
  return p;
};
exports.sleep = ms => new Promise(r => setTimeout(r, ms));
