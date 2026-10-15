// Versão em inglês (?lang=en): passa pelo menu, sala, briefing, partida e revelação dos dois lados em cada mapa pedido e
// lista o que ainda ficou em português (MIRA_IDIOMA.misses). Capturas em out/en-*.png.
// node fonte/testes/t25.js <url> [mapas]   (sai com código 1 se sobrar texto em português nas telas principais)
const L = require('./lib'), fs = require('fs');
const [U, MAPS = '0'] = process.argv.slice(2);
(async () => {
  const b = await L.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 760 } });
  await ctx.addInitScript(() => { window.MIRA_WEB = true; });
  const p = await L.page(ctx, U + (U.includes('?') ? '&' : '?') + 'lang=en');
  const info = await p.evaluate(() => ({ lang: MIRA_IDIOMA.lang, n: MIRA_IDIOMA.size, h: document.querySelector('#menu').innerText.slice(0, 200) }));
  console.log('idioma', info.lang, info.n, 'textos ·', info.h.replace(/\n+/g, ' | '));
  await p.screenshot({ path: __dirname + '/out/en-menu.png' });
  await p.evaluate(() => { document.querySelector('#nome').value = 'Ana'; document.querySelector('#btnCreate').click(); });
  await p.waitForFunction(() => !document.querySelector('#lobby').hidden, null, { timeout: 60000, polling: 500 });
  await L.sleep(1500); await p.screenshot({ path: __dirname + '/out/en-sala.png' });
  await p.evaluate(() => document.querySelector('#btnLeave').click()); await L.sleep(1000);
  for (const id of MAPS.split(',')) {
    for (const role of ['A', 'S']) {
      await p.evaluate(([id, role]) => { try { localStorage.removeItem('mira-intro-a'); localStorage.removeItem('mira-intro-s'); } catch (e) { } document.querySelector('#mapSel').value = id; document.querySelector('#btnSolo' + role).click(); }, [id, role]);
      await p.waitForFunction(() => window.__mira.G.sim && window.__mira.G.sim.ph === 'brief', null, { timeout: 180000, polling: 500 });
      await L.sleep(800); await p.screenshot({ path: __dirname + `/out/en-${id}-${role}-brief.png` });
      await p.evaluate(() => { window.__mira.G.sim.t = 0.01; });
      await L.sleep(6000); await p.screenshot({ path: __dirname + `/out/en-${id}-${role}-jogo.png` });
      if (role === 'A') { // go to a mission and start it, to see the prompt and the challenge
        await p.evaluate(() => { const M = window.__mira, st = M.st, m = M.MISSIONS[st.ms.find(o => !(st.ts && st.ts[0] === o))], P = M.PROPS[m.p], c = M.ctrl; c.path = []; c.goal = null; c.lv = P.lv; c.y = M.LVY(P.lv); c.x = P.s[0]; c.z = P.s[1]; });
        await L.sleep(2500); await p.evaluate(() => window.__mira.tryAct()); await L.sleep(2500);
        await p.screenshot({ path: __dirname + `/out/en-${id}-A-missao.png` });
      }
      await p.evaluate(() => { const S = window.__mira.G.sim; for (let i = 0; i < 300 && S.ph === 'play'; i++) S.tick(0.1); if (S.ph === 'play') S.shoot(S.ents.find(e => e.id !== S.agentId && e.kind !== 'static' && !e.dead).id); });
      await p.waitForFunction(() => !document.querySelector('#reveal').hidden, null, { timeout: 60000, polling: 500 }).catch(() => { });
      await L.sleep(1500); await p.screenshot({ path: __dirname + `/out/en-${id}-${role}-fim.png` });
      await p.evaluate(() => document.querySelector('#btnMenu').click()); await L.sleep(1500);
    }
  }
  const miss = await p.evaluate(() => [...MIRA_IDIOMA.misses]);
  fs.writeFileSync(__dirname + '/out/en-faltando.txt', miss.join('\n') + '\n');
  console.log('em português ainda:', miss.length, '(out/en-faltando.txt)'); for (const m of miss.slice(0, 60)) console.log('  ' + m);
  if (miss.length) process.exitCode = 1;
  await b.close();
})();
