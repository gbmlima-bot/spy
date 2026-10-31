const fs = require('fs');
const { chromium } = require('playwright');
const MOCK = fs.readFileSync(__dirname + '/mock.js', 'utf8');
const CDN = require('./assets')(__dirname);
exports.launch = async () => chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : process.env.GPU === '1' ? { channel: 'chromium' } : {}), args: [...(process.env.GPU === '1' ? ['--enable-gpu', ...(process.platform === 'darwin' ? ['--use-angle=metal'] : [])] : ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist']), '--autoplay-policy=no-user-gesture-required'] });
exports.page = async (ctx, url, opts = {}) => {
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  p.on('console', m => { if (m.type() === 'error' && !/fonts|ERR_TUNNEL/.test(m.text())) console.log('CONSOLE', m.text().slice(0, 300)); });
  if (!opts.nativeResources) await p.route('**/*', r => { const u = r.request().url(); if (CDN[u]) return r.fulfill({ body: CDN[u], contentType: 'application/javascript' }); if (u.startsWith('https://fonts.googleapis.com/')) return r.fulfill({ body: '', contentType: 'text/css' }); if (/^http:\/\/(localhost|127\.0\.0\.1)(:|\/)/.test(u)) return r.continue(); return r.abort(); });
  if (opts.mock !== false) await p.addInitScript(MOCK);
  await p.goto(url, { timeout: 300000, waitUntil: 'domcontentloaded' });
  await p.waitForFunction(opts.until || (() => window.__mira && !document.querySelector('#menu').hidden), null, { timeout: 240000, polling: opts.until ? 500 : 'raf' });
  // Tests directly switch maps; preload script definitions, never construct their scenes.
  if (opts.preload !== false) await p.evaluate(async () => { if (window.__mira?.ensureMapAssets) for (let id = 0; id <= 10; id++) await __mira.ensureMapAssets(id); });
  return p;
};
exports.sleep = ms => new Promise(r => setTimeout(r, ms));
