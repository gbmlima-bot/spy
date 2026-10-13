// reveal: moments of the round and the humiliation bonus (solo sniper against bots, sim fast-forwarded)
const L = require('./lib'); const OUT = __dirname + '/out/';
const U = process.argv[2] || 'http://localhost:8765/test-new.html';
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  const p = await L.page(ctx, U);
  await p.evaluate(() => { document.querySelector('#mapSel').value = '0'; document.querySelector('#btnSoloS').click(); });
  await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 90000 });
  const r = await p.evaluate(() => { const S = window.__mira.G.sim; S.t = 0.01; S.tick(0.02); for (let i = 0; i < 900 && S.ph === 'play'; i++) S.tick(0.2);
    const e = S.ents.find(x => x.kind === 'npc' && !x.dead); if (S.ph === 'play') S.shoot(e.id); const st = S.state(); return { ph: S.ph, why: S.why, sc: S.sc, lg: st.lg.length, dn: S.dn.length, sh: st.sh, kinds: st.lg.map(x => x[3]) }; });
  console.log(JSON.stringify(r));
  await L.sleep(5000);
  console.log(await p.evaluate(() => document.querySelector('#reveal').innerText.slice(0, 1500)));
  await p.screenshot({ path: OUT + 'reveal-moments.png', timeout: 180000 });
  await b.close();
})();
