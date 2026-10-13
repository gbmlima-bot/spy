// night rooftop: menu option, solo round, look from both sides; brief length
const L = require('./lib'); const OUT = __dirname + '/out/';
const U = process.argv[2] || 'http://localhost:8765/test-new.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  const p = await L.page(ctx, U);
  console.log(await p.evaluate(() => [...document.querySelectorAll('#mapSel option')].slice(0, 3).map(o => o.value + '=' + o.textContent)));
  await p.evaluate(() => { document.querySelector('#mapSel').value = 'n'; document.querySelector('#btnSoloA').click(); });
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 90000 });
  console.log('brief', await p.evaluate(() => ({ t: window.__mira.G.sim.t, nt: window.__mira.G.sim.state().nt })));
  await p.evaluate(() => { window.__mira.G.sim.t = 0.01; }); await p.waitForFunction(() => window.__mira.G.sim.ph === 'play'); await L.sleep(4000);
  await p.screenshot({ path: OUT + 'night-agent.png', timeout: 180000 });
  await p.evaluate(() => { const S = window.__mira.G.sim; S.ph = 'reveal'; document.querySelector('#btnMenu').click(); }); await L.sleep(2000);
  await p.evaluate(() => { document.querySelector('#mapSel').value = 'n'; document.querySelector('#btnSoloS').click(); });
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 90000 });
  await p.evaluate(() => { window.__mira.G.sim.t = 0.01; }); await p.waitForFunction(() => window.__mira.G.sim.ph === 'play'); await L.sleep(4000);
  await p.screenshot({ path: OUT + 'night-sniper.png', timeout: 180000 });
  await p.evaluate(() => { const S = window.__mira.G.sim; S.ph = 'reveal'; document.querySelector('#btnMenu').click(); }); await L.sleep(3000);
  await p.screenshot({ path: OUT + 'menu-after-night.png', timeout: 180000 });
  await b.close();
})();
