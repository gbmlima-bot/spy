// Primeira rodada como agente: tutorial guiado (andar → anel dourado → fazer a missão → laser), etiqueta "VOCÊ" sobre a
// cabeça e lista de missões curta (rótulo + andar). node fonte/testes/t23.js <url> [largura] [altura]
const L = require('./lib');
const [U, W = '1280', H = '720'] = process.argv.slice(2);
const t0 = Date.now(), ok = (c, m) => { console.log((c ? 'ok   ' : 'FALHA') + ' ' + m + ' (' + ((Date.now() - t0) / 1000 | 0) + ' s)'); if (!c) process.exitCode = 1; };
(async () => {
  const b = await L.launch(); const touch = +W < 700;
  const ctx = await b.newContext({ viewport: { width: +W, height: +H }, hasTouch: touch, isMobile: touch });
  const p = await L.page(ctx, U);
  await p.evaluate(() => { try { localStorage.removeItem('mira-intro-a'); } catch (e) { } document.querySelector('#mapSel').value = '0'; document.querySelector('#btnSoloA').click(); });
  await p.waitForFunction(() => { const M = window.__mira; return M.G.sim && M.G.sim.ph === 'brief'; }, null, { timeout: 180000 });
  const brief = await p.$$eval('#brief li', l => l.map(x => x.textContent));
  ok(brief.length >= 4 && brief.every(t => !t.includes('·')), 'briefing: missões sem a descrição longa (' + brief[0] + ')');
  await p.evaluate(() => { window.__mira.G.sim.t = 0.01; });
  await p.waitForFunction(() => window.__mira.GINTRO.on, null, { timeout: 60000 }).catch(() => { });
  ok(await p.evaluate(() => window.__mira.GINTRO.on && /você/.test(document.querySelector('#coachText').textContent)), 'tutorial do agente começa: ' + await p.$eval('#coachText', e => e.textContent));
  ok(await p.evaluate(() => window.__mira.meTag.visible), 'etiqueta VOCÊ sobre a cabeça');
  const li = await p.$$eval('#msList li', l => l.map(x => x.textContent));
  ok(li.length >= 4 && li.every(t => !t.includes('·')) && await p.$$eval('#msList li .fl', l => l.length) === li.length, 'lista: rótulo + andar (' + li[0] + ')');
  await L.sleep(1500); await p.screenshot({ path: __dirname + `/out/t23-${W}-passo1.png` });
  // anda 2,5 m
  await p.evaluate(() => { const M = window.__mira, c = M.ctrl; for (const [dx, dz] of [[2.5, 0], [-2.5, 0], [0, 2.5], [0, -2.5]]) if (M.navFree ? M.navFree(c.x + dx, c.z + dz, c.lv) : true) { c.x += dx; c.z += dz; break; } });
  await p.waitForFunction(() => window.__mira.GINTRO.i === 1, null, { timeout: 30000 }).catch(() => { });
  ok(await p.evaluate(() => window.__mira.GINTRO.i) === 1, 'andou: passo 2 (anel dourado)');
  // vai até o objeto da primeira missão
  await p.evaluate(() => { const M = window.__mira, st = M.st, m = M.MISSIONS[st.ms.find(o => !(st.ts && st.ts[0] === o))], P = M.PROPS[m.p], c = M.ctrl; c.path = []; c.goal = null; c.lv = P.lv; c.y = M.LVY(P.lv); c.x = P.s[0]; c.z = P.s[1]; });
  await p.waitForFunction(() => window.__mira.GINTRO.i === 2, null, { timeout: 30000 }).catch(() => { });
  ok(await p.evaluate(() => window.__mira.GINTRO.i) === 2, 'chegou no objeto: passo 3 (fazer a missão)');
  await L.sleep(800); await p.screenshot({ path: __dirname + `/out/t23-${W}-passo3.png` });
  await p.evaluate(() => window.__mira.tryAct());
  await p.waitForFunction(() => window.__mira.GINTRO.i === 3, null, { timeout: 30000 }).catch(() => { });
  ok(await p.evaluate(() => window.__mira.GINTRO.i) === 3, 'começou a missão: passo final (laser)');
  await p.waitForFunction(() => !window.__mira.GINTRO.on, null, { timeout: 120000, polling: 500 }).catch(() => { });
  ok(await p.evaluate(() => !window.__mira.GINTRO.on && localStorage.getItem('mira-intro-a') === '1'), 'tutorial termina e não volta');
  await b.close();
})();
