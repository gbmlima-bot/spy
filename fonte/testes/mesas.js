// Rendered regression for the numbered tables and the mission instruction in Portuguese and English.
const L = require('./lib'), fs = require('fs'), assert = require('assert/strict');
const U = process.argv[2] || 'http://127.0.0.1:8874/', OUT = __dirname + '/out';
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await L.launch(), errors = [];
  try {
    for (const lang of ['pt', 'en']) {
      const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
      await ctx.addInitScript(() => { window.__noIntro = true; });
      const p = await L.page(ctx, U + '?lang=' + lang); p.on('pageerror', e => errors.push(e.message));
      await p.selectOption('#mapSel', '10'); await p.locator('#btnSoloA').click();
      await p.waitForFunction(() => window.__mira.G.sim?.ph === 'brief', null, { polling: 100 });
      await p.evaluate(() => { const S = window.__mira.G.sim; S.t = .01; S.ai.update = () => {}; });
      await p.waitForFunction(() => window.__mira.G.sim.ph === 'play', null, { polling: 100 });
      const mission = await p.evaluate(() => {
        const M = window.__mira, S = M.G.sim, c = M.ctrl, P = M.PROPS.find(q => q.key === 'abajur'), o = P.ms[0];
        S.ms = [o]; S.dn = []; S.ts = null; S._st = null; M.G.lastPh = null;
        // Stand beside the plaque so the player's body does not cover its digit in the evidence image.
        Object.assign(c, { path: [], goal: null, act: null, pose: null, lk: null, settle: null, vx: 0, vz: 0, x: P.s[0] + .9, z: P.s[1], y: M.LVY(P.lv), lv: P.lv });
        S.setPlayer(M.G.myEid, c.x, c.z, 0, 0, c.y);
        M.isoState.az = 0; M.isoState.elev = .8; M.isoState.zoom = 4.7;
        return o;
      });
      await p.waitForFunction(() => document.querySelector('#msList').textContent.includes('3'), null, { polling: 100 });
      await L.sleep(1200);
      assert.match(await p.locator('#msList li').getAttribute('title'), lang === 'pt' ? /vagão-restaurante, mesa 3/ : /dining car, table 3/);
      await p.screenshot({ path: OUT + '/mesas-' + lang + '.png' });
      await p.keyboard.press('e');
      assert.equal(await p.evaluate(() => window.__mira.ctrl.act?.o), mission);
      await p.keyboard.press('Escape');
      assert.equal(await p.evaluate(() => window.__mira.ctrl.act), null);
      const misses = await p.evaluate(() => window.MIRA_IDIOMA?.misses || []);
      if (lang === 'en') assert.ok(!JSON.stringify(misses).includes('vagão-restaurante, mesa 3'), 'new target must be translated');
      await ctx.close(); console.log('PASS numbered table target and E/Escape: ' + lang);
    }
    assert.deepEqual(errors, []);
  } finally { await b.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
