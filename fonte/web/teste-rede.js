// Teste: 3 navegadores numa sala, rodada, anfitrião fecha a aba, outro assume e começa a rodada 2.
// Precisa de: npm i peer express@4 (servidor de sinalização local) e cdn/ com three.js r128 e peerjs
// (cdn/index.txt: "arquivo url" por linha), porque os CDNs são bloqueados no contêiner.
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const fs = require('fs'), http = require('http'), { ExpressPeerServer } = require('peer'), express = require('express');
const CDN = {}; for (const l of fs.readFileSync(__dirname + '/cdn/index.txt', 'utf8').trim().split('\n')) { const [n, u] = l.split(' '); CDN[u] = fs.readFileSync(__dirname + '/cdn/' + n); }
const HTML = fs.readFileSync(__dirname + '/../../index.html'); // index.html da raiz (node fonte/web/montar.js)
http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(HTML); }).listen(8765, '127.0.0.1');
{ const app = express(); const srv = app.listen(9000, '127.0.0.1'); app.use('/', ExpressPeerServer(srv, { path: '/' })); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const P = [];
  for (const n of ['Ana', 'Bia', 'Caio']) {
    const ctx = await b.newContext({ viewport: { width: 320, height: 200 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => console.log(n, 'PAGEERR', e.message));
    p.on('requestfailed', r => { if (/127/.test(r.url())) console.log(n,'FAIL', r.url(), r.failure().errorText); }); p.on('console', m => { if (!/fonts|ERR_TUNNEL|three.js/.test(m.text())) console.log(n, 'CONSOLE', m.text().slice(0, 200)); });
    await p.route('**/*', r => { const u = r.request().url(); if (CDN[u]) return r.fulfill({ body: CDN[u], contentType: 'application/javascript' }); if (u.startsWith('http://127.0.0.1')) return r.continue(); return r.abort(); });
    await p.addInitScript(() => { const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = f => setTimeout(() => raf(f), 200); window.MIRA_NET = { host: '127.0.0.1', port: 9000, path: '/', secure: false, debug: 1 }; });
    await p.goto('http://127.0.0.1:8765/', { timeout: 300000 });
    await p.waitForFunction(() => window.__mira && !document.querySelector('#menu').hidden, null, { timeout: 240000 });
    await p.waitForFunction(() => !document.querySelector('#multiBox').hidden, null, { timeout: 30000 });
    await p.evaluate(n => { document.querySelector('#nome').value = n; }, n); P.push(p);
  }
  console.log('multiplayer menu visible on all 3');
  await P[0].evaluate(() => document.querySelector('#btnCreate').click());
  await P[0].waitForFunction(() => /^[A-Z]{4}$/.test(document.querySelector('#lobbyCode').textContent));
  const code = await P[0].evaluate(() => document.querySelector('#lobbyCode').textContent); console.log('code', code);
  for (const p of P.slice(1)) { await p.evaluate(c => { document.querySelector('#codeIn').value = c; document.querySelector('#btnJoin').click(); }, code); await sleep(1500); }
  await P[0].waitForFunction(() => !document.querySelector('#btnStart').disabled && document.querySelectorAll('#players li').length === 3, null, { timeout: 30000 });
  for (const p of P) console.log('lobby', await p.evaluate(() => [...document.querySelectorAll('#players li')].map(l => l.textContent).join(' | ')));
  await P[0].evaluate(() => document.querySelector('#btnStart').click());
  for (const p of P) await p.waitForFunction(() => window.__mira.G.role && window.__mira.G.screen === 'game', null, { timeout: 120000 });
  const roles = []; for (const p of P) roles.push(await p.evaluate(() => window.__mira.G.role)); console.log('roles', roles);
  await P[0].evaluate(() => { window.__mira.G.sim.t = 0.01; }); await sleep(5000);
  if (process.env.WATCH) { for (let k = 0; k < 12; k++) { await sleep(5000); console.log((k+1)*5+'s', JSON.stringify(await P[0].evaluate(() => window.__netstat)), (await Promise.all(P.slice(1).map(p => p.evaluate(() => (window.__netlog||[]).slice(-1)[0])))).join(' | '), await P[0].evaluate(() => [...window.__mira.Net.room ? [] : []].length)); } }
  // a non-host guest moves; host must see it
  const g = P[1];
  const before = await P[0].evaluate(() => { const M = window.__mira; return M.G.sim.ph; });
  console.log('host phase', before, 'guests phase', await P[1].evaluate(() => window.__mira.G.hostState && window.__mira.G.hostState.ph));
  // host closes the tab -> someone else must take over
  const hubWas = await P[0].evaluate(() => window.__mira.G.isHost);
  await P[0].close(); console.log('host closed (was host:', hubWas, ')');
  for (let k = 0; k < 8; k++) { await sleep(5000);
  for (const p of P.slice(1)) console.log((k+1)*5+'s', await p.evaluate(() => ({ isHost: window.__mira.G.isHost, sim: !!window.__mira.G.sim, ph: (window.__mira.G.sim || window.__mira.G.hostState || {}).ph, n: window.__mira.Net.peers().length }))); }
  for (const p of P.slice(1)) console.log((await p.evaluate(() => window.__netlog)).join('\n'), '\n----');
  for (const p of P.slice(1)) console.log('after', await p.evaluate(() => ({ isHost: window.__mira.G.isHost, sim: !!window.__mira.G.sim, ph: (window.__mira.G.sim || window.__mira.G.hostState || {}).ph, n: document.querySelectorAll('#players li').length })));
  const R = P.slice(1); let hp = null; for (const p of R) if (await p.evaluate(() => window.__mira.G.isHost)) hp = p;
  console.log('screens', await Promise.all(R.map(p => p.evaluate(() => window.__mira.G.screen + '/' + (document.querySelector('#btnNext') ? !document.querySelector('#btnNext').hidden : '-') + '/' + (document.querySelector('#btnStart') ? !document.querySelector('#btnStart').hidden : '-')))));
  if (hp) { await hp.evaluate(() => { const b = document.querySelector('#btnNext'); if (b && !b.hidden && b.offsetParent) b.click(); else document.querySelector('#btnStart').click(); }); await sleep(20000);
    console.log('round 2', await Promise.all(R.map(p => p.evaluate(() => ({ role: window.__mira.G.role, scr: window.__mira.G.screen, ph: (window.__mira.G.sim || window.__mira.G.hostState || {}).ph })))));
    console.log(await Promise.all(R.map(p => p.evaluate(() => window.__netlog.slice(-6).join(' ; '))))); }
  await b.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
